import { describe, it, expect, beforeEach } from 'vitest';
import '../src/platinum-weather-card';
import { makeHass, baseConfig, makeForecast, renderCard, textOf, queryAll } from './helpers';

// entity_cloud_cover is the provider's sky for the night, a fallback and not a measurement of the station; the README recommends it
// for Sager. It was one of the measurement settings, and setting any of those means "nothing is filled in from the weather entity", so
// a card of a weather entity alone that named it, even as the weather entity itself, lost its temperature, its icon and its slots.
// And a measurement setting pointed at the weather entity itself is no choice of anything else: the rest is still that entity.

const ATTRS = { temperature: 18, humidity: 70, pressure: 1012, pressure_unit: 'hPa', wind_speed: 12, wind_bearing: 200, wind_speed_unit: 'km/h', cloud_coverage: 80 };

function hass() {
  return makeHass({
    'weather.home': { state: 'cloudy', attributes: ATTRS },
    'sensor.t': { state: '17.5', attributes: { unit_of_measurement: '°C' } },
    'sensor.cc': { state: '40', attributes: { unit_of_measurement: '%' } },
  }, { forecast: makeForecast(6) });
}

async function card(extra: Record<string, unknown>) {
  const el = await renderCard(baseConfig({ weather_entity: 'weather.home', section_order: ['overview', 'slots'], ...extra }), hass()) as HTMLElement & Record<string, any>;
  const out = {
    temp: textOf(el, '#current-temp-text'),
    icon: el.forecastIcon as string,
    slots: queryAll(el, 'li[data-slot]').map((l) => (l as HTMLElement).dataset.slot).join(','),
    implied: [...el._impliedKeys as Set<string>],
    errors: [...el._error as string[]],
    el,
  };
  return out;
}

describe('the cloud cover fallback and the weather entity alone', () => {
  let plain: Awaited<ReturnType<typeof card>>;
  beforeEach(async () => { plain = await card({}); plain.el.remove(); });

  it('a card of a weather entity alone reads it for everything (the reference)', () => {
    expect(plain.temp).toBe('18');
    expect(plain.icon).toBe('cloudy');
    expect(plain.slots).toBe('forecast_max,forecast_min,wind,pressure,popforecast,humidity');
  });

  it('naming the weather entity as the cloud cover entity changes nothing', async () => {
    const c = await card({ entity_cloud_cover: 'weather.home' });
    expect([c.temp, c.icon, c.slots]).toEqual([plain.temp, plain.icon, plain.slots]);
    c.el.remove();
  });

  it('naming a sensor as the cloud cover entity changes nothing else, and the sensor is the one that is read', async () => {
    const c = await card({ entity_cloud_cover: 'sensor.cc' });
    expect([c.temp, c.icon, c.slots]).toEqual([plain.temp, plain.icon, plain.slots]);
    expect(c.el.providerCloudFraction).toBe(0.4);
    c.el.remove();
  });

  it('with no cloud cover entity named, the slot and Sager still read the sky of the weather entity', async () => {
    const c = await card({ section_order: ['slots'], slot_l1: 'cloud_cover' });
    expect(textOf(c.el, '.cloud-cover-text')).toBe('80%');
    expect(c.el.providerCloudFraction).toBe(0.8);
    c.el.remove();
  });

  it('a measurement setting pointed at the weather entity itself is no choice: the rest is still filled in', async () => {
    const c = await card({ entity_temperature: 'weather.home' });
    expect([c.temp, c.icon, c.slots]).toEqual([plain.temp, plain.icon, plain.slots]);
    expect(c.implied).toContain('entity_humidity');
    expect(c.implied).not.toContain('entity_temperature');   // that one is the user's
    c.el.remove();
  });

  it('a measurement setting pointed at a sensor is a choice, as documented: nothing is filled in around it', async () => {
    const c = await card({ entity_temperature: 'sensor.t' });
    expect(c.temp).toBe('18');                                   // 17.5, rounded: the sensor's
    expect(c.icon).toBe('---');
    expect(c.slots).toBe('forecast_max,forecast_min,popforecast');
    expect(c.implied).not.toContain('entity_humidity');
    expect(c.implied).not.toContain('entity_forecast_icon');
    c.el.remove();
  });
});
