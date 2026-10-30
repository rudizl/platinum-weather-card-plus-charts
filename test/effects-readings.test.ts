import { describe, it, expect, beforeEach } from 'vitest';
import '../src/platinum-weather-card';
import { makeHass, baseConfig, renderCard, forgetSharedState } from './helpers';

// What the effects read from the card: the temperature in degrees Celsius, and the minutes since the gauge last read rain.
// They meet two things of the fixes of the analysis of 2.6.0: one `_temperatureC` for the effects and for the sea-level correction, and the
// memory of the gauge kept per sensor (not once for the page).
beforeEach(() => forgetSharedState());

type Card = { _temperatureC: number | null; _minutesSinceRain: () => number | null };
const gauges = () => (customElements.get('platinum-weather-card-plus-charts') as unknown as { _gaugeRain: Map<string, { t: number; rate: number }> })._gaugeRain;

async function card(states: Record<string, { state: string; attributes?: Record<string, unknown> }>, config: Record<string, unknown>, systemTemperature = '\u00b0C') {
  const hass = makeHass({ 'weather.w': { state: 'cloudy', attributes: {} }, ...states });
  (hass.config.unit_system as Record<string, string>).temperature = systemTemperature;
  return (await renderCard(baseConfig({ weather_entity: 'weather.w', section_order: ['overview'], ...config } as never), hass)) as unknown as Card;
}

describe('the temperature in degrees Celsius', () => {
  it('a sensor that gives no unit is in the unit system of Home Assistant', async () => {
    const f = await card({ 'sensor.t': { state: '68' } }, { entity_temperature: 'sensor.t' }, '\u00b0F');
    expect(f._temperatureC).toBeCloseTo(20, 5);
    const c = await card({ 'sensor.t': { state: '68' } }, { entity_temperature: 'sensor.t' }, '\u00b0C');
    expect(c._temperatureC).toBeCloseTo(68, 5);
  });
  it('a sensor with a unit of its own is read in it, whatever the unit system says', async () => {
    const f = await card({ 'sensor.t': { state: '68', attributes: { unit_of_measurement: '\u00b0F' } } }, { entity_temperature: 'sensor.t' }, '\u00b0C');
    expect(f._temperatureC).toBeCloseTo(20, 5);
    const k = await card({ 'sensor.t': { state: '293.15', attributes: { unit_of_measurement: 'K' } } }, { entity_temperature: 'sensor.t' }, '\u00b0F');
    expect(k._temperatureC).toBeCloseTo(20, 5);
  });
  it('a weather entity gives its temperature attribute, in its temperature_unit', async () => {
    const w = await card({ 'weather.w': { state: 'sunny', attributes: { temperature: 68, temperature_unit: '\u00b0F' } } }, { entity_temperature: 'weather.w' });
    expect(w._temperatureC).toBeCloseTo(20, 5);
  });
  it('is null when there is no temperature to read', async () => {
    const none = await card({}, {});
    expect(none._temperatureC).toBeNull();
    const words = await card({ 'sensor.t': { state: 'unavailable' } }, { entity_temperature: 'sensor.t' });
    expect(words._temperatureC).toBeNull();
  });
});

describe('the minutes since the gauge last read rain', () => {
  const dry = (id: string) => ({ [id]: { state: '0', attributes: { unit_of_measurement: 'mm/h' } } });
  it('are those of the gauge of the card', async () => {
    gauges().set('sensor.rain_a', { t: Date.now() - 5 * 60000, rate: 2 });
    const a = await card(dry('sensor.rain_a'), { entity_rain_rate: 'sensor.rain_a' });
    expect(a._minutesSinceRain()).toBeCloseTo(5, 0);
  });
  it('are nothing for a card whose gauge is another one, or that has none: the rain of one station is not the rain of another', async () => {
    gauges().set('sensor.rain_a', { t: Date.now() - 5 * 60000, rate: 2 });
    const b = await card(dry('sensor.rain_b'), { entity_rain_rate: 'sensor.rain_b' });
    expect(b._minutesSinceRain()).toBeNull();
    const none = await card({}, {});
    expect(none._minutesSinceRain()).toBeNull();
  });
  it('are nothing while it rains', async () => {
    gauges().set('sensor.rain_a', { t: Date.now() - 5 * 60000, rate: 2 });
    const wet = await card({ 'sensor.rain_a': { state: '1.5', attributes: { unit_of_measurement: 'mm/h' } } }, { entity_rain_rate: 'sensor.rain_a' });
    expect(wet._minutesSinceRain()).toBeNull();
  });
});
