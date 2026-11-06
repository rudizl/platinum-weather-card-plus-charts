import { describe, it, expect } from 'vitest';
import { render } from 'lit';
import { readFileSync } from 'fs';
import { join } from 'path';
import '../src/platinum-weather-card';
import '../src/editor';
import { makeHass } from './helpers';

// The first batch of pickers that offer what a field can read: the temperatures, the humidity, the pressure and the wind. A house has more than a thousand sensors; a field for a temperature offers
// the ones that say they are temperatures. By what an entity says it is (its device class and its unit; a weather entity, the attribute that the field reads), and never so that
// a house without such a sensor is left with nothing, and never so that it cannot be turned off.

type St = { entity_id: string; state?: string; attributes: Record<string, unknown> };
type Ed = HTMLElement & { hass?: unknown; setConfig: (c: unknown) => void; updateComplete: Promise<unknown>; _pickerOffers: (k: string, e: St) => boolean; _filterFor: (k: string) => ((e: St) => boolean) | undefined };
const e = (id: string, attributes: Record<string, unknown> = {}): St => ({ entity_id: id, state: '1', attributes });
const house = (list: St[], config: Record<string, unknown> = {}): Ed => {
  const el = document.createElement('platinum-weather-card-plus-charts-editor') as Ed;
  el.setConfig({ card_config_version: 8, weather_entity: 'weather.home', ...config });
  el.hass = { states: Object.fromEntries(list.map((s) => [s.entity_id, s])) };
  return el;
};
const BATCH = ['entity_temperature', 'entity_apparent_temp', 'entity_dew_point', 'entity_forecast_max', 'entity_forecast_min', 'entity_forecast_max_1', 'entity_forecast_min_1', 'entity_observed_max', 'entity_observed_min',
  'entity_temp_next', 'entity_temp_following', 'entity_humidity', 'entity_pressure', 'entity_wind_speed', 'entity_wind_speed_kt', 'entity_wind_gust', 'entity_wind_gust_kt', 'entity_wind_bearing', 'entity_wind_bearing_6h'];

const cpu = e('sensor.cpu_load', { unit_of_measurement: '%', friendly_name: 'CPU load' });
const disk = e('sensor.disk_use', { unit_of_measurement: '%' });
const power = e('sensor.power', { unit_of_measurement: 'W', device_class: 'power' });
const temp = e('sensor.outside_temp', { unit_of_measurement: '\u00b0C', device_class: 'temperature' });
const tempNoClass = e('sensor.template_temp', { unit_of_measurement: '\u00b0F' });
const humid = e('sensor.outside_humidity', { unit_of_measurement: '%', device_class: 'humidity' });
const humidNamed = e('sensor.template_h', { unit_of_measurement: '%', friendly_name: 'Влажност навън' });
const press = e('sensor.baro', { unit_of_measurement: 'hPa', device_class: 'atmospheric_pressure' });
const wind = e('sensor.wind', { unit_of_measurement: 'km/h', device_class: 'wind_speed' });
const dir = e('sensor.vane', { unit_of_measurement: '\u00b0' });
const wx = e('weather.forecast_varna', { temperature: 13, humidity: 80, pressure: 1016, wind_speed: 20, wind_bearing: 312, dew_point: 9, wind_gust_speed: 30 });
const wxPoor = e('weather.ivarna103', { temperature: 13, humidity: 82 });
const HOUSE = [cpu, disk, power, temp, tempNoClass, humid, humidNamed, press, wind, dir, wx, wxPoor];
const offered = (el: Ed, key: string) => HOUSE.filter((s) => el._pickerOffers(key, s)).map((s) => s.entity_id);

describe('every picker of the first batch has its rule', () => {
  it('and each is given its filter in the editor', () => {
    const src = readFileSync(join(__dirname, '..', 'src', 'editor.ts'), 'utf8');
    const blocks = [...src.matchAll(/<ha-entity-picker\b(.*?)<\/ha-entity-picker>/gs)].map((m) => m[0]);
    for (const key of BATCH) {
      const mine = blocks.filter((b) => b.includes(`.configValue=\${'${key}'}`));
      expect(mine.length, `a picker for ${key}`).toBeGreaterThan(0);
      for (const b of mine) expect(b, key).toContain(`.entityFilter=\${this._filterFor('${key}')}`);
    }
  });
  it('and the others are not narrowed here: no rule, no filter', () => {
    const el = house(HOUSE);
    expect(el._filterFor('entity_sun')).toBeUndefined();
    expect(el._filterFor('weather_entity')).toBeUndefined();
    expect(el._filterFor('entity_summary')).toBeUndefined();
    expect(el._filterFor('entity_temperature')).toBeTypeOf('function');
    for (const key of BATCH) expect(el._filterFor(key), `a rule for ${key}`).toBeTypeOf('function');
  });
});

describe('the temperatures', () => {
  it('are the sensors that say they are temperatures, by class or by unit, and the weather entities that have one', () => {
    const el = house(HOUSE);
    for (const key of ['entity_temperature', 'entity_forecast_max', 'entity_observed_min', 'entity_temp_next']) {
      const o = offered(el, key);
      expect(o, key).toContain('sensor.outside_temp');
      expect(o, key).toContain('sensor.template_temp');
      expect(o, key).not.toContain('sensor.cpu_load');
      expect(o, key).not.toContain('sensor.power');
    }
  });
  it('the dew point and the feels-like want the attribute that has them: a weather entity without it is not offered', () => {
    const el = house(HOUSE);
    expect(offered(el, 'entity_dew_point')).toContain('weather.forecast_varna');
    expect(offered(el, 'entity_dew_point')).not.toContain('weather.ivarna103');
    expect(offered(el, 'entity_apparent_temp')).not.toContain('weather.forecast_varna');
  });
});

describe('the humidity, the pressure and the wind', () => {
  it('a humidity is a sensor of that class, or in per cent with a name that says so, and not a processor', () => {
    const o = offered(house(HOUSE), 'entity_humidity');
    expect(o).toEqual(expect.arrayContaining(['sensor.outside_humidity', 'sensor.template_h', 'weather.forecast_varna', 'weather.ivarna103']));
    expect(o).not.toContain('sensor.cpu_load');
    expect(o).not.toContain('sensor.disk_use');
  });
  it('a pressure is of the class or of a unit of pressure', () => {
    const o = offered(house(HOUSE), 'entity_pressure');
    expect(o).toContain('sensor.baro');
    expect(o).toContain('weather.forecast_varna');
    expect(o).not.toContain('weather.ivarna103');
    expect(o).not.toContain('sensor.outside_temp');
  });
  it('a wind speed is of the class or of a unit of speed; a gust wants wind_gust_speed of a weather entity', () => {
    const el = house(HOUSE);
    expect(offered(el, 'entity_wind_speed')).toEqual(expect.arrayContaining(['sensor.wind', 'weather.forecast_varna']));
    expect(offered(el, 'entity_wind_gust')).toContain('weather.forecast_varna');
    expect(offered(el, 'entity_wind_gust_kt')).toContain('sensor.wind');
    expect(offered(el, 'entity_wind_speed')).not.toContain('sensor.outside_temp');
  });
  it('a wind direction is in degrees', () => {
    const el = house(HOUSE);
    expect(offered(el, 'entity_wind_bearing')).toEqual(expect.arrayContaining(['sensor.vane', 'weather.forecast_varna']));
    expect(offered(el, 'entity_wind_bearing_6h')).toContain('sensor.vane');
    expect(offered(el, 'entity_wind_bearing_6h')).not.toContain('sensor.wind');
  });
});

describe('nothing is hidden from a house that has nothing to offer', () => {
  it('a house with no sensor that fits a field is offered every sensor for it, as before', () => {
    const el = house([cpu, disk, power, wx]);
    expect([cpu, disk, power].filter((s) => el._pickerOffers('entity_temperature', s))).toHaveLength(3);
  });
  it('and when a sensor that fits appears, the others are not offered any more', () => {
    const el = house([cpu, disk]);
    expect(el._pickerOffers('entity_temperature', cpu)).toBe(true);
    el.hass = { states: { [cpu.entity_id]: cpu, [temp.entity_id]: temp } };
    expect(el._pickerOffers('entity_temperature', cpu)).toBe(false);
    expect(el._pickerOffers('entity_temperature', temp)).toBe(true);
  });
  it('an entity that is neither a sensor nor a weather entity is not narrowed', () => {
    expect(house(HOUSE)._pickerOffers('entity_temperature', e('input_number.x'))).toBe(true);
  });
});

describe('the switch that turns it off', () => {
  it('offers every entity in every list', () => {
    const el = house(HOUSE, { option_editor_all_entities: true });
    for (const key of BATCH) expect(HOUSE.filter((s) => el._pickerOffers(key, s)), key).toHaveLength(HOUSE.length);
  });
  it('is in the global options, with its words', () => {
    const el = house(HOUSE);
    const box = document.createElement('div');
    render((el as unknown as { _optionGlobalOptionsEditor: () => unknown })._optionGlobalOptionsEditor() as never, box);
    expect(box.querySelector('.pwc-switch') !== null && [...box.querySelectorAll('.pwc-switch')].some((s) => (s as unknown as { value?: string }).value === 'option_editor_all_entities')).toBe(true);
  });
});

describe('the pickers as the editor draws them', () => {
  it('the ones for the first batch carry the filter on the element, and it narrows', () => {
    const el = house(HOUSE, { slot_l1: 'wind', slot_l2: 'pressure', slot_l3: 'humidity', slot_l4: 'forecast_max' });
    const box = document.createElement('div');
    for (const m of ['_sectionOverviewEditor', '_sectionSlotsEditor', '_sectionDailyForecastEditor']) {
      const part = document.createElement('div');
      render((el as unknown as Record<string, () => unknown>)[m]() as never, part);
      box.append(...part.childNodes);
    }
    const found = [...box.querySelectorAll('*')].filter((n) => BATCH.includes((n as unknown as { configValue?: string }).configValue ?? '')) as unknown as Array<{ configValue: string; entityFilter?: (s: St) => boolean }>;
    expect(found.length, 'pickers of the batch found').toBeGreaterThan(3);
    for (const p of found) expect(typeof p.entityFilter, p.configValue).toBe('function');
    const wspeed = found.find((p) => p.configValue === 'entity_wind_speed');
    if (wspeed) expect(HOUSE.filter(wspeed.entityFilter!).map((s) => s.entity_id)).toContain('sensor.wind');
  });
});


// The second batch: the update time, the solar radiation, the rain, the UV index, the visibility, the moon, the lightning and the hourly weather entity.
const BATCH2 = ['entity_update_time', 'entity_solar_radiation', 'entity_rain_rate', 'entity_rainfall', 'entity_pos', 'entity_pos_1', 'entity_possible_tomorrow', 'entity_uv_index', 'entity_visibility', 'entity_moon',
  'entity_lightning_distance', 'entity_lightning_azimuth', 'entity_hourly'];
const stamp = e('sensor.last_seen', { device_class: 'timestamp' });
const solar = e('sensor.gw_solar', { unit_of_measurement: 'W/m\u00b2', device_class: 'irradiance' });
const rate = e('sensor.gw_rain_rate', { unit_of_measurement: 'mm/h', device_class: 'precipitation_intensity' });
const rain = e('sensor.gw_rain_today', { unit_of_measurement: 'mm', device_class: 'precipitation' });
const uv = e('sensor.gw_uv_index', { unit_of_measurement: 'UV index' });
const dist = e('sensor.car_range', { unit_of_measurement: 'km', device_class: 'distance' });
const visi = e('sensor.visibility_km', { unit_of_measurement: 'km', device_class: 'distance' });
const moon = e('sensor.moon_phase', { device_class: 'enum', options: ['new_moon', 'full_moon', 'last_quarter'] });
const moonNamed = e('sensor.luna_template', { friendly_name: 'Moon phase text' });
const bolt = e('sensor.kshchichka_lightning_distance', { unit_of_measurement: 'km', device_class: 'distance' });
const boltAz = e('sensor.kshchichka_lightning_azimuth', { unit_of_measurement: '\u00b0' });
const wxHourly = e('weather.forecast_varna', { supported_features: 3, uv_index: 1.2 });
const wxDaily = e('weather.ivarna103', { supported_features: 1 });
const HOUSE2 = [stamp, solar, rate, rain, uv, dist, visi, moon, moonNamed, bolt, boltAz, cpu, wxHourly, wxDaily];
// A picker offers the domains that it was given (includeDomains); the filter narrows inside them. So each field is looked at in its own domains.
const DOMAINS: Record<string, string[]> = { entity_update_time: ['sensor'], entity_solar_radiation: ['sensor'], entity_rain_rate: ['sensor'], entity_moon: ['sensor'], entity_lightning_distance: ['sensor'], entity_lightning_azimuth: ['sensor'],
  entity_hourly: ['weather'], entity_rainfall: ['sensor'] };
const offered2 = (el: Ed, key: string) => HOUSE2.filter((s) => (DOMAINS[key] ?? ['sensor', 'weather']).includes(s.entity_id.split('.')[0]) && el._pickerOffers(key, s)).map((s) => s.entity_id);

describe('every picker of the second batch has its rule and its filter', () => {
  it('in the editor, and as a rule', () => {
    const src = readFileSync(join(__dirname, '..', 'src', 'editor.ts'), 'utf8');
    const blocks = [...src.matchAll(/<ha-entity-picker\b(.*?)<\/ha-entity-picker>/gs)].map((m) => m[0]);
    const el = house(HOUSE2);
    for (const key of BATCH2) {
      const mine = blocks.filter((b) => b.includes(`.configValue=\${'${key}'}`));
      expect(mine.length, `a picker for ${key}`).toBeGreaterThan(0);
      for (const b of mine) expect(b, key).toContain(`.entityFilter=\${this._filterFor('${key}')}`);
      expect(el._filterFor(key), `a rule for ${key}`).toBeTypeOf('function');
    }
  });
});

describe('what the second batch offers', () => {
  it('the update time: a sensor that is a timestamp, and not the rest of the house', () => {
    const o = offered2(house(HOUSE2), 'entity_update_time');
    expect(o).toEqual(['sensor.last_seen']);
  });
  it('the solar radiation, the rain rate and the rain: by class or unit, each its own', () => {
    const el = house(HOUSE2);
    expect(offered2(el, 'entity_solar_radiation')).toEqual(['sensor.gw_solar']);
    expect(offered2(el, 'entity_rain_rate')).toEqual(['sensor.gw_rain_rate']);
    for (const key of ['entity_rainfall', 'entity_pos', 'entity_pos_1', 'entity_possible_tomorrow']) {
      const o = offered2(el, key);
      expect(o, key).toContain('sensor.gw_rain_today');
      expect(o, key).not.toContain('sensor.gw_rain_rate');
      if (key !== 'entity_rainfall') expect(o, key).toContain('weather.forecast_varna');   // a forecast may give a possible rain; today's rain is a sensor
    }
  });
  it('the UV index: a unit with UV in it, or a weather entity that has uv_index', () => {
    const o = offered2(house(HOUSE2), 'entity_uv_index');
    expect(o).toEqual(['sensor.gw_uv_index', 'weather.forecast_varna']);
  });
  it('the visibility: a distance, in a unit of distance, and the lightning is not one of them', () => {
    const el = house(HOUSE2);
    const o = offered2(el, 'entity_visibility');
    expect(o).toEqual(expect.arrayContaining(['sensor.car_range', 'sensor.visibility_km', 'sensor.kshchichka_lightning_distance']));
    expect(o).not.toContain('sensor.gw_solar');
  });
  it('the moon: an enum with moon phases, or a name that says moon', () => {
    expect(offered2(house(HOUSE2), 'entity_moon')).toEqual(['sensor.moon_phase', 'sensor.luna_template']);
  });
  it('the lightning: a distance or a bearing that is named for lightning, and not every distance or every degree of the house', () => {
    const el = house(HOUSE2);
    expect(offered2(el, 'entity_lightning_distance')).toEqual(['sensor.kshchichka_lightning_distance']);
    expect(offered2(el, 'entity_lightning_azimuth')).toEqual(['sensor.kshchichka_lightning_azimuth']);
  });
  it('the hourly weather entity: only one that gives an hourly forecast', () => {
    expect(offered2(house(HOUSE2), 'entity_hourly')).toEqual(['weather.forecast_varna']);
  });
});

describe('and nothing is hidden from a house that has nothing that fits', () => {
  it('no timestamp, no irradiance: every sensor is offered for the field', () => {
    const el = house([cpu, disk, wxDaily]);
    expect([cpu, disk].filter((x) => el._pickerOffers('entity_update_time', x))).toHaveLength(2);
    expect([cpu, disk].filter((x) => el._pickerOffers('entity_solar_radiation', x))).toHaveLength(2);
  });
  it('no lightning named in the house: every distance is offered for the lightning', () => {
    const el = house([dist, visi, cpu]);
    expect(el._pickerOffers('entity_lightning_distance', dist)).toBe(true);
    expect(el._pickerOffers('entity_lightning_distance', cpu)).toBe(true);
  });
  it('no weather entity with an hourly forecast: every weather entity is offered for it', () => {
    const el = house([wxDaily, cpu]);
    expect(el._pickerOffers('entity_hourly', wxDaily)).toBe(true);
  });
  it('and the switch offers everything, for the second batch too', () => {
    const el = house(HOUSE2, { option_editor_all_entities: true });
    for (const key of BATCH2) expect(HOUSE2.filter((x) => el._pickerOffers(key, x)), key).toHaveLength(HOUSE2.length);
  });
});
