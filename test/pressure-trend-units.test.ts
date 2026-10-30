import { describe, it, expect } from 'vitest';
import '../src/platinum-weather-card';
import { makeHass, baseConfig } from './helpers';

// A pressure trend sensor (a Derivative helper, mostly) gives its unit: hPa/h, but also inHg/h for a station in inches, mmHg/h, or
// Pa/min. The card read the number as hPa/h whatever the unit, so -0.06 inHg/h (about -2 hPa/h, a barometer falling fast) was steady,
// for Sager, for Zambretti and for the arrow of the pressure slot.

type El = HTMLElement & Record<string, any>;
function card(state: string, unit: string | undefined, extra: Record<string, unknown> = {}): El {
  const el = document.createElement('platinum-weather-card-plus-charts') as El;
  el.setConfig(baseConfig({ entity_pressure: 'sensor.p', entity_pressure_trend: 'sensor.trend', option_local_forecast: true, ...extra }));
  el.hass = makeHass({
    'sensor.p': { state: '1005', attributes: { unit_of_measurement: 'hPa' } },
    'sensor.trend': { state, attributes: unit === undefined ? {} : { unit_of_measurement: unit } },
  }, { config: { latitude: undefined, longitude: undefined } });   // no tide removed: the conversion alone
  return el;
}

describe('the pressure trend in the unit of its sensor', () => {
  it.each([
    ['-0.06', 'inHg/h', -0.06 * 33.8639],
    ['-1.5', 'mmHg/h', -1.5 * 1.33322],
    ['-3.4', 'Pa/min', -3.4 / 100 * 60],
    ['0.12', 'kPa/h', 1.2],
    ['-2', 'hPa/h', -2],
    ['-2', 'mbar/h', -2],
    ['-2', 'hPa/3h', -2 / 3],
    ['-2', undefined, -2],
  ])('%s %s is %f hPa/h', (state, unit, hpa) => {
    expect(card(state, unit).pressureTrendHpaPerHour).toBeCloseTo(hpa, 6);
  });

  it('Zambretti reads a trend in inHg/h as the same trend in hPa/h', () => {
    const inches = card('-0.06', 'inHg/h').localForecastText;
    const hpa = card(String(-0.06 * 33.8639), 'hPa/h').localForecastText;
    const steady = card('-0.06', 'hPa/h').localForecastText;
    expect(inches).not.toBeNull();
    expect(inches).toBe(hpa);
    expect(inches, 'read as -0.06 hPa/h, steady').not.toBe(steady);
  });

  it('the arrow of the pressure slot falls for -0.04 inHg/h', () => {
    expect(card('-0.04', 'inHg/h').pressureTrend).toBe('falling');
    expect(card('0.04', 'inHg/h').pressureTrend).toBe('rising');
    expect(card('-0.04', 'hPa/h').pressureTrend).toBe('steady');
  });

  it('a trend given in words is read as before', () => {
    expect(card('falling', undefined).pressureTrend).toBe('falling');
    expect(card('falling', undefined).pressureTrendHpaPerHour).toBeNull();
  });
});
