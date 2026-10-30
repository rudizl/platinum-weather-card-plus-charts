import { describe, it, expect } from 'vitest';
import '../src/platinum-weather-card';
import { makeHass, baseConfig } from './helpers';

// With an altitude set, both forecasts correct the station pressure to sea level, and the correction needs the temperature of the air
// in °C. Sager read the state of entity_temperature as °C whatever its unit (68 °F was 68 °C: 4.95 hPa off at 300 m, enough to change
// its letter), and the state of a weather entity ('sunny') as no number, so 15 °C; Zambretti read the weather entity, but °F as °C too.

type El = HTMLElement & Record<string, any>;
function card(states: Record<string, { state: string; attributes?: Record<string, unknown> }>, extra: Record<string, unknown> = {}): El {
  const el = document.createElement('platinum-weather-card-plus-charts') as El;
  el.setConfig(baseConfig({ entity_pressure: 'sensor.p', entity_temperature: 'sensor.t', option_forecast_altitude: 300, option_local_forecast: true, ...extra }));
  el.hass = makeHass({ 'sensor.p': { state: '980', attributes: { unit_of_measurement: 'hPa' } }, ...states });
  return el;
}
const sensorT = (state: string, unit?: string) => ({ 'sensor.t': { state, attributes: unit === undefined ? {} : { unit_of_measurement: unit } } });

describe('the temperature of the sea-level correction', () => {
  const celsius = card(sensorT('20', '°C'));

  it.each([
    ['68', '°F'], ['68', 'F'], ['293.15', 'K'], ['20', '°C'], ['20', undefined],
  ])('%s %s is 20 °C, for Sager and for Zambretti alike', (state, unit) => {
    const el = card(sensorT(state, unit));
    expect(el._forecastPressureHpa).toBeCloseTo(celsius._forecastPressureHpa, 6);
    expect(el._zambrettiPressureHpa).toBeCloseTo(celsius._forecastPressureHpa, 6);
  });

  it('the temperature changes the correction, so the case above means something', () => {
    expect(Math.abs(card(sensorT('35', '°C'))._forecastPressureHpa - celsius._forecastPressureHpa)).toBeGreaterThan(1);
  });

  it('a weather entity gives its temperature attribute, in its own unit, to both', () => {
    const weather = (temperature: number, unit: string) => card(
      { 'weather.home': { state: 'sunny', attributes: { temperature, temperature_unit: unit } } }, { entity_temperature: 'weather.home' });
    expect(weather(20, '°C')._forecastPressureHpa).toBeCloseTo(celsius._forecastPressureHpa, 6);
    expect(weather(68, '°F')._forecastPressureHpa).toBeCloseTo(celsius._forecastPressureHpa, 6);
    expect(weather(68, '°F')._zambrettiPressureHpa).toBeCloseTo(celsius._forecastPressureHpa, 6);
  });

  it('no temperature to read is 15 °C, as before', () => {
    const fifteen = card(sensorT('15', '°C'))._forecastPressureHpa;
    expect(card(sensorT('unavailable', '°C'))._forecastPressureHpa).toBeCloseTo(fifteen, 6);
    expect(card({}, { entity_temperature: undefined })._zambrettiPressureHpa).toBeCloseTo(fifteen, 6);
  });
});
