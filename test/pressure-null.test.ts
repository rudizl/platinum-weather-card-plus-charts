import { describe, it, expect } from 'vitest';
import '../src/platinum-weather-card';
import { makeHass, baseConfig } from './helpers';

// A weather entity can give its pressure as null (Home Assistant writes None so), and Number(null) is 0, which passed the check for
// "not a number": the pressure slot said 0 and the forecasts were given a pressure of 0 hPa (they refused it, only by the range check).
// null, an empty value and no value at all are no pressure.

function card(pressure: unknown, extra: Record<string, unknown> = {}) {
  const el = document.createElement('platinum-weather-card-plus-charts') as HTMLElement & Record<string, any>;
  el.setConfig(baseConfig({ weather_entity: 'weather.home', option_local_forecast: true, ...extra }));
  const attributes: Record<string, unknown> = { temperature: 20, pressure_unit: 'hPa' };
  if (pressure !== 'absent') attributes.pressure = pressure;
  el.hass = makeHass({ 'weather.home': { state: 'cloudy', attributes } });
  return el;
}

describe('a weather entity with no pressure', () => {
  for (const p of [null, '', ' ', 'absent']) {
    it(`${JSON.stringify(p)} is no pressure: the slot says --- and the forecasts have none`, () => {
      const el = card(p);
      expect(el.currentPressure).toBe('---');
      expect(el._forecastPressureHpa).toBeNull();
      expect(el._zambrettiPressureHpa).toBeNull();
    });
  }
  it('a pressure of 1013 is read as before', () => {
    const el = card(1013);
    expect(el.currentPressure).toBe((1013).toLocaleString(el.locale));
    expect(el._forecastPressureHpa).toBe(1013);
    expect(el._zambrettiPressureHpa).toBe(1013);
    expect(el.localForecastText).not.toBeNull();
  });
  it('and a pressure given as text, as some integrations do', () => {
    const el = card('1013.2');
    expect(el._forecastPressureHpa).toBeCloseTo(1013.2, 5);
  });
  it('a sensor whose state is empty is no pressure either', () => {
    const el = document.createElement('platinum-weather-card-plus-charts') as HTMLElement & Record<string, any>;
    el.setConfig(baseConfig({ entity_pressure: 'sensor.p', option_local_forecast: true }));
    el.hass = makeHass({ 'sensor.p': { state: '', attributes: { unit_of_measurement: 'hPa' } } });
    expect(el.currentPressure).toBe('---');
    expect(el._forecastPressureHpa).toBeNull();
    expect(el._zambrettiPressureHpa).toBeNull();
  });
});
