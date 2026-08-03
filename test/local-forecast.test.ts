import { describe, it, expect } from 'vitest';
import '../src/platinum-weather-card';
import { makeHass, baseConfig, renderCard } from './helpers';

// The Zambretti module is unit-tested; this covers the layer around it — which
// inputs are trusted, when they are ignored, and how the sentence is assembled.

async function forecast(
  extra: Record<string, unknown> = {},
  sensors: Record<string, unknown> = {},
) {
  return (await renderCard(
    baseConfig({
      section_order: ['overview'],
      overview_layout: 'complete',
      entity_temperature: 'sensor.temp',
      entity_summary: 'sensor.summary',
      entity_pressure: 'sensor.press',
      entity_pressure_trend: 'sensor.trend',
      option_local_forecast: true,
      ...extra,
    } as never),
    makeHass({
      'sensor.temp': { state: '21', attributes: { unit_of_measurement: '°C' } },
      'sensor.summary': { state: 'PROVIDER TEXT' },
      'sensor.press': { state: '1020', attributes: { unit_of_measurement: 'hPa' } },
      'sensor.trend': { state: '0', attributes: { unit_of_measurement: 'hPa/h' } },
      ...sensors,
    } as never),
  )) as HTMLElement;
}

const text = (el: HTMLElement) => (el.shadowRoot?.textContent ?? '').replace(/\s+/g, ' ');

describe('when the local forecast applies', () => {
  it('replaces the provider text', async () => {
    const el = await forecast();
    expect(text(el)).not.toContain('PROVIDER TEXT');
  });

  it('leaves the provider text alone when switched off', async () => {
    const el = await forecast({ option_local_forecast: false });
    expect(text(el)).toContain('PROVIDER TEXT');
  });

  it('falls back to the provider when no pressure entity is configured', async () => {
    // Without pressure there is nothing to compute from.
    const el = await forecast({ entity_pressure: undefined });
    expect(text(el)).toContain('PROVIDER TEXT');
  });

  it('falls back when the pressure sensor is unavailable', async () => {
    const el = await forecast({}, { 'sensor.press': { state: 'unavailable' } });
    expect(text(el)).toContain('PROVIDER TEXT');
  });
});

describe('pressure level drives the outlook', () => {
  it('reads high steady pressure as fair', async () => {
    const el = await forecast({}, {
      'sensor.press': { state: '1030', attributes: { unit_of_measurement: 'hPa' } },
    });
    expect(text(el).toLowerCase()).toMatch(/fair|settled/);
  });

  it('reads low falling pressure as unsettled', async () => {
    const el = await forecast({}, {
      'sensor.press': { state: '990', attributes: { unit_of_measurement: 'hPa' } },
      'sensor.trend': { state: '-1.5', attributes: { unit_of_measurement: 'hPa/h' } },
    });
    expect(text(el).toLowerCase()).toMatch(/rain|unsettled|storm/);
  });

  it('converts the pressure unit before judging it', async () => {
    // 30.12 inHg is about 1020 hPa: fair, not stormy.
    const el = await forecast({}, {
      'sensor.press': { state: '30.12', attributes: { unit_of_measurement: 'inHg' } },
    });
    expect(text(el).toLowerCase()).toMatch(/fair|settled/);
  });

  it('applies the station altitude correction', async () => {
    // 1002 hPa at 154 m is really 1020 at sea level: the same fair outlook.
    const el = await forecast({ option_forecast_altitude: 154 }, {
      'sensor.press': { state: '1002.5', attributes: { unit_of_measurement: 'hPa' } },
    });
    expect(text(el).toLowerCase()).toMatch(/fair|settled/);
  });

  it('reads the same pressure as worse without the correction', async () => {
    const corrected = await forecast({ option_forecast_altitude: 154 }, {
      'sensor.press': { state: '1002.5', attributes: { unit_of_measurement: 'hPa' } },
    });
    const raw = await forecast({}, {
      'sensor.press': { state: '1002.5', attributes: { unit_of_measurement: 'hPa' } },
    });
    expect(text(corrected)).not.toBe(text(raw));
  });
});

describe('wind direction is only trusted when it is steady', () => {
  const withWind = (speed: string, bearing: string) => ({
    'sensor.wspeed': { state: speed, attributes: { unit_of_measurement: 'km/h' } },
    'sensor.wbear': { state: bearing },
  });

  it('ignores the bearing in light air', async () => {
    // Below 8 km/h a vane wanders; the forecast must not move because of it.
    const calm = await forecast(
      { entity_wind_speed: 'sensor.wspeed', entity_wind_bearing: 'sensor.wbear' },
      withWind('2', '180'),
    );
    const none = await forecast();
    expect(text(calm)).toBe(text(none));
  });

  it('uses the bearing in a steady wind', async () => {
    const southerly = await forecast(
      { entity_wind_speed: 'sensor.wspeed', entity_wind_bearing: 'sensor.wbear' },
      withWind('20', '180'),
    );
    const northerly = await forecast(
      { entity_wind_speed: 'sensor.wspeed', entity_wind_bearing: 'sensor.wbear' },
      withWind('20', '0'),
    );
    // A southerly brings moist air and reads worse than a northerly.
    expect(text(southerly)).not.toBe(text(northerly));
  });

  it('ignores a bearing that is not a usable direction', async () => {
    const bad = await forecast(
      { entity_wind_speed: 'sensor.wspeed', entity_wind_bearing: 'sensor.wbear' },
      withWind('20', 'unavailable'),
    );
    expect(text(bad)).not.toContain('NaN');
  });
});

describe('the pressure tendency clause', () => {
  it('is absent in compact mode', async () => {
    const el = await forecast();
    expect(text(el).toLowerCase()).not.toContain('the pressure is');
  });

  it('is present in verbose mode', async () => {
    const el = await forecast({ option_local_forecast_verbose: true });
    expect(text(el).toLowerCase()).toContain('pressure');
  });

  it('says rising when the trend is clearly up', async () => {
    const el = await forecast(
      { option_local_forecast_verbose: true },
      { 'sensor.trend': { state: '2.0', attributes: { unit_of_measurement: 'hPa/h' } } },
    );
    expect(text(el).toLowerCase()).toContain('rising');
  });

  it('says falling when the trend is clearly down', async () => {
    const el = await forecast(
      { option_local_forecast_verbose: true },
      { 'sensor.trend': { state: '-2.0', attributes: { unit_of_measurement: 'hPa/h' } } },
    );
    expect(text(el).toLowerCase()).toContain('falling');
  });

  it('agrees with the pressure slot arrow', async () => {
    // The two used different thresholds once, so the card could show a rising
    // arrow beside a sentence calling the pressure steady.
    for (const trend of ['2.0', '-2.0', '0']) {
      const el = (await renderCard(
        baseConfig({
          section_order: ['overview', 'slots'],
          overview_layout: 'complete',
          entity_temperature: 'sensor.temp',
          entity_pressure: 'sensor.press',
          entity_pressure_trend: 'sensor.trend',
          option_local_forecast: true,
          option_local_forecast_verbose: true,
          slot_l1: 'pressure',
          slot_r1: 'remove',
        } as never),
        makeHass({
          'sensor.temp': { state: '21' },
          'sensor.press': { state: '1020', attributes: { unit_of_measurement: 'hPa' } },
          'sensor.trend': { state: trend, attributes: { unit_of_measurement: 'hPa/h' } },
        } as never),
      )) as HTMLElement;
      const sentence = text(el).toLowerCase();
      const arrow = el.shadowRoot?.querySelector('.pressure-trend ha-icon')?.getAttribute('icon') ?? '';
      if (arrow.includes('up')) {
        expect(sentence, `arrow up but sentence says otherwise: ${sentence}`).toContain('rising');
      } else if (arrow.includes('down')) {
        expect(sentence, `arrow down but sentence says otherwise`).toContain('falling');
      }
    }
  });

  it('omits the clause when no trend sensor is configured', async () => {
    const el = await forecast({
      option_local_forecast_verbose: true,
      entity_pressure_trend: undefined,
    });
    expect(text(el).toLowerCase()).not.toContain('the pressure is');
  });
});

describe('language', () => {
  it('renders the forecast in the configured locale', async () => {
    const en = await forecast({ option_locale: 'en' });
    const bg = await forecast({ option_locale: 'bg' });
    expect(text(en)).not.toBe(text(bg));
    expect(text(bg)).toMatch(/[А-Яа-я]/);
  });
});
