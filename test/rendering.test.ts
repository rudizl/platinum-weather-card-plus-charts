import { describe, it, expect } from 'vitest';
import '../src/platinum-weather-card';
import { makeHass, baseConfig, renderCard } from './helpers';

// These render the real card in jsdom against a fake Home Assistant. They cover
// what the source-level tests cannot: that values reach the screen, in the right
// units, and that the guards against bad data actually produce '---'.

const sensors = {
  'sensor.temp': { state: '21.5', attributes: { unit_of_measurement: '°C' } },
  'sensor.app': { state: '23.1', attributes: { unit_of_measurement: '°C' } },
  'sensor.hum': { state: '64', attributes: { unit_of_measurement: '%' } },
  'sensor.press': { state: '1016.5', attributes: { unit_of_measurement: 'hPa' } },
  'sensor.wspeed': { state: '12', attributes: { unit_of_measurement: 'km/h' } },
  'sensor.wgust': { state: '20', attributes: { unit_of_measurement: 'km/h' } },
  'sensor.wbear': { state: '180' },
  'sun.sun': { state: 'above_horizon', attributes: { elevation: 35 } },
};

function slotText(el: HTMLElement, slot: string): string {
  const li = el.shadowRoot?.querySelector(`li[data-slot="${slot}"]`);
  return (li?.textContent ?? '').replace(/\s+/g, ' ').trim();
}

async function card(extra: Record<string, unknown> = {}, states = sensors) {
  return (await renderCard(
    baseConfig({
      section_order: ['overview', 'slots'],
      overview_layout: 'complete',
      entity_temperature: 'sensor.temp',
      entity_apparent_temp: 'sensor.app',
      entity_humidity: 'sensor.hum',
      entity_pressure: 'sensor.press',
      entity_wind_speed: 'sensor.wspeed',
      entity_wind_gust: 'sensor.wgust',
      entity_wind_bearing: 'sensor.wbear',
      entity_sun: 'sun.sun',
      slot_l1: 'humidity',
      slot_l2: 'pressure',
      slot_r1: 'wind',
      ...extra,
    } as never),
    makeHass(states),
  )) as HTMLElement;
}

describe('the card renders at all', () => {
  it('produces a card element with content', async () => {
    const el = await card();
    expect(el.shadowRoot?.querySelector('ha-card')).toBeTruthy();
    expect(el.shadowRoot?.querySelectorAll('li').length).toBeGreaterThan(0);
  });

  it('shows the current temperature', async () => {
    const el = await card();
    expect(el.shadowRoot?.querySelector('.temp')?.textContent?.trim()).toBe('22');
  });

  it('shows one decimal when asked', async () => {
    const el = await card({ option_show_overview_decimals: true });
    expect(el.shadowRoot?.querySelector('.temp')?.textContent?.trim()).toBe('21.5');
  });
});

describe('slots show their values', () => {
  it('renders humidity with its unit', async () => {
    const el = await card();
    expect(slotText(el, 'humidity')).toContain('64');
    expect(slotText(el, 'humidity')).toContain('%');
  });

  it('renders pressure', async () => {
    const el = await card();
    expect(slotText(el, 'pressure')).toMatch(/1[,.]?017/);
    expect(slotText(el, 'pressure')).toContain('hPa');
  });

  it('renders wind as bearing, speed and unit', async () => {
    const el = await card();
    const wind = slotText(el, 'wind');
    expect(wind).toContain('12');
    expect(wind).toContain('km/h');
    expect(wind).toContain('S'); // 180° is south
  });

  it('honours pressure decimals', async () => {
    const el = await card({ option_pressure_decimals: 1 });
    expect(slotText(el, 'pressure')).toMatch(/1[,.]?016\.5/);
  });
});

describe('missing data degrades to dashes, never NaN', () => {
  // The bug this guards: a wind slot reading "unavailable NaNkm/h (Gust NaNkm/h)",
  // wide enough to break the two-column layout.
  const broken = {
    ...sensors,
    'sensor.hum': { state: 'unavailable' },
    'sensor.press': { state: 'unknown' },
    'sensor.wspeed': { state: 'unavailable' },
    'sensor.wbear': { state: 'unavailable' },
  };

  it('never prints NaN anywhere', async () => {
    const el = await card({}, broken);
    expect(el.shadowRoot?.textContent).not.toContain('NaN');
  });

  it('never prints the raw unavailable state', async () => {
    const el = await card({}, broken);
    // '---' is the placeholder; the literal word must not reach the card
    expect(slotText(el, 'humidity')).not.toContain('unavailable');
    expect(slotText(el, 'wind')).not.toContain('unavailable');
  });

  it('shows the placeholder instead', async () => {
    const el = await card({}, broken);
    expect(slotText(el, 'humidity')).toContain('---');
    expect(slotText(el, 'pressure')).toContain('---');
  });
});

describe('unit handling follows the sensor', () => {
  it('uses the sensor unit for pressure rather than assuming hPa', async () => {
    const el = await card({}, {
      ...sensors,
      'sensor.press': { state: '29.92', attributes: { unit_of_measurement: 'inHg' } },
    });
    expect(slotText(el, 'pressure')).toContain('inHg');
  });

  it('uses the sensor unit for wind speed', async () => {
    const el = await card({}, {
      ...sensors,
      'sensor.wspeed': { state: '5', attributes: { unit_of_measurement: 'm/s' } },
    });
    expect(slotText(el, 'wind')).toContain('m/s');
  });
});

describe('the local forecast', () => {
  const forecastStates = {
    ...sensors,
    'sensor.press': { state: '1020', attributes: { unit_of_measurement: 'hPa' } },
    'sensor.trend': { state: '0.02', attributes: { unit_of_measurement: 'hPa/h' } },
    'sensor.summary': { state: 'Provider text' },
  };

  it('replaces the summary text when enabled', async () => {
    const el = await card({
      entity_summary: 'sensor.summary',
      entity_pressure_trend: 'sensor.trend',
      option_local_forecast: true,
    }, forecastStates);
    const text = el.shadowRoot?.textContent ?? '';
    expect(text).not.toContain('Provider text');
    // high steady pressure reads as settled
    expect(text.toLowerCase()).toMatch(/fair|settled/);
  });

  it('leaves the summary alone when disabled', async () => {
    const el = await card({
      entity_summary: 'sensor.summary',
      option_local_forecast: false,
    }, forecastStates);
    expect(el.shadowRoot?.textContent).toContain('Provider text');
  });

  it('adds a pressure-tendency clause in verbose mode', async () => {
    const el = await card({
      entity_summary: 'sensor.summary',
      entity_pressure_trend: 'sensor.trend',
      option_local_forecast: true,
      option_local_forecast_verbose: true,
    }, forecastStates);
    expect(el.shadowRoot?.textContent?.toLowerCase()).toContain('pressure');
  });
});

describe('the warnings section', () => {
  const withWarning = (level: string, type: string) => ({
    ...sensors,
    'binary_sensor.warn': {
      state: 'on',
      attributes: {
        event: 'Hot weather',
        awareness_level: `${level}; yellow; Moderate`,
        awareness_type: `${type}; high-temperature`,
        expires: '2026-08-05T00:00:00+03:00',
      },
    },
  });

  it('shows nothing when no warning is active', async () => {
    const el = await card(
      { section_order: ['warnings', 'overview'], entity_warning: 'binary_sensor.warn' },
      { ...sensors, 'binary_sensor.warn': { state: 'off', attributes: {} } },
    );
    expect(el.shadowRoot?.querySelector('.warning-row')).toBeNull();
  });

  it('shows a translated hazard rather than the provider wording', async () => {
    const el = await card(
      { section_order: ['warnings', 'overview'], entity_warning: 'binary_sensor.warn' },
      withWarning('2', '5'),
    );
    const row = el.shadowRoot?.querySelector('.warning-row');
    expect(row).toBeTruthy();
    // type 5 is high temperature; the card's own wording, not "Hot weather"
    expect(row?.textContent).toContain('High temperatures');
  });

  it('escalates its styling with the level', async () => {
    const yellow = await card(
      { section_order: ['warnings'], entity_warning: 'binary_sensor.warn' },
      withWarning('2', '1'),
    );
    const red = await card(
      { section_order: ['warnings'], entity_warning: 'binary_sensor.warn' },
      withWarning('4', '1'),
    );
    expect(yellow.shadowRoot?.querySelector('.warning-row.level-red')).toBeNull();
    expect(red.shadowRoot?.querySelector('.warning-row.level-red')).toBeTruthy();
  });

  it('falls back to the provider wording for an unknown hazard type', async () => {
    const el = await card(
      { section_order: ['warnings'], entity_warning: 'binary_sensor.warn' },
      withWarning('2', '99'),
    );
    expect(el.shadowRoot?.querySelector('.warning-row')?.textContent).toContain('Hot weather');
  });
});

describe('tappable readings are marked only when they will do something', () => {
  it('marks a sensor-backed slot', async () => {
    const el = await card();
    const li = el.shadowRoot?.querySelector('li[data-slot="humidity"]');
    expect(li?.classList.contains('slot-tappable')).toBe(true);
  });

  it('leaves slots inert when the feature is off', async () => {
    const el = await card({ option_slot_tap_more_info: false });
    const li = el.shadowRoot?.querySelector('li[data-slot="humidity"]');
    expect(li?.classList.contains('slot-tappable')).toBe(false);
  });
});

describe('units come from the entity, not the system settings', () => {
  // Issue #20: an instance in Sweden was quietly set to US customary, so the
  // card printed a Celsius reading from Met.no under a °F label. Nothing is
  // ever converted, so the figure was right and only the suffix was wrong —
  // which is what made it diagnosable, and also what made it wrong.
  const imperial = {
    unit_system: {
      length: 'mi', mass: 'lb', temperature: '°F', volume: 'gal',
      pressure: 'psi', wind_speed: 'mph', accumulated_precipitation: 'in',
    },
  };

  async function metricEntityOnImperialSystem(extra: Record<string, unknown> = {}) {
    return (await renderCard(
      baseConfig({
        section_order: ['overview', 'slots'],
        overview_layout: 'complete',
        entity_temperature: 'sensor.temp',
        slot_l1: 'humidity',
        slot_r1: 'remove',
        entity_humidity: 'sensor.hum',
        ...extra,
      } as never),
      makeHass(
        {
          'sensor.temp': { state: '13.9', attributes: { unit_of_measurement: '°C' } },
          'sensor.hum': { state: '64', attributes: { unit_of_measurement: '%' } },
        },
        { config: imperial },
      ),
    )) as HTMLElement;
  }

  it('labels a Celsius sensor in Celsius even on a Fahrenheit system', () => {
    // The exact shape of the report.
    return metricEntityOnImperialSystem().then((el) => {
      const text = el.shadowRoot?.textContent ?? '';
      expect(text, 'the reading is labelled with the system unit').not.toContain('°F');
      expect(text).toContain('°C');
    });
  });

  it('does the same for a weather entity, which states its own units', () => {
    return renderCard(
      baseConfig({
        section_order: ['overview'],
        overview_layout: 'complete',
        weather_entity: 'weather.metno',
        entity_temperature: 'weather.metno',
      } as never),
      makeHass(
        {
          'weather.metno': {
            state: 'cloudy',
            attributes: {
              temperature: 13.9,
              temperature_unit: '°C',
              precipitation_unit: 'mm',
              pressure_unit: 'hPa',
              wind_speed_unit: 'm/s',
            },
          },
        },
        { config: imperial },
      ),
    ).then((el) => {
      const text = (el as HTMLElement).shadowRoot?.textContent ?? '';
      expect(text, 'a weather entity stating °C was labelled °F').not.toContain('°F');
      expect(text).toContain('°C');
    });
  });

  it('falls back to the system only when nothing states a unit', () => {
    // Removing the fallback altogether would leave the unit blank for anyone
    // whose sensor does not declare one.
    return renderCard(
      baseConfig({
        section_order: ['overview'],
        overview_layout: 'complete',
        entity_temperature: 'sensor.bare',
      } as never),
      makeHass({ 'sensor.bare': { state: '55' } }, { config: imperial }),
    ).then((el) => {
      expect((el as HTMLElement).shadowRoot?.textContent).toContain('°F');
    });
  });

  it('reads precipitation from the weather entity too', () => {
    return renderCard(
      baseConfig({
        section_order: ['slots'],
        slot_l1: 'rainfall',
        slot_r1: 'remove',
        weather_entity: 'weather.metno',
        entity_rainfall: 'weather.metno',
      } as never),
      makeHass(
        {
          'weather.metno': {
            state: 'rainy',
            attributes: { precipitation: 2.5, precipitation_unit: 'mm' },
          },
        },
        { config: imperial },
      ),
    ).then((el) => {
      const slot = (el as HTMLElement).shadowRoot?.querySelector('li[data-slot="rainfall"]');
      const text = (slot?.textContent ?? '').replace(/\s+/g, ' ');
      expect(text, 'millimetres were labelled inches').not.toMatch(/\bin\b/);
      expect(text).toContain('mm');
    });
  });
});
