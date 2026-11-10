// Находка 2: вятърът не стига до ефектите при карта само с weather_entity (всяка нова карта в 2.7), нито в възли.
import { describe, it, expect } from 'vitest';
import { Any, clean, plan, makeHass, baseConfig, renderCard } from './_util';
clean();

describe('2. the wind behind the effects', () => {
  it('a card of a weather entity alone: snow in a wind of 70 km/h (force 8) is a blizzard', async () => {
    const Card = customElements.get('platinum-weather-card-plus-charts') as Any;
    const hass = makeHass({ 'weather.home': { state: 'snowy', attributes: { supported_features: 1, temperature: -3, temperature_unit: '°C', wind_speed: 70, wind_speed_unit: 'km/h' } } });
    // what the picker makes in 2.7: option_effects: subtle, and the measurements implied from the weather entity
    const el = (await renderCard({ type: 'custom:platinum-weather-card-plus-charts', ...Card.getStubConfig(hass) } as never, hass)) as Any;
    expect(plan(el), 'the effects are on for a new card').not.toBeNull();
    expect(plan(el).blizzard).toBe(true);
  });
  it('and its clouds cross faster in a gale than in a calm', async () => {
    const mount = async (wind: number) => (await renderCard(baseConfig({ weather_entity: 'weather.home', option_effects: 'full' } as never),
      makeHass({ 'weather.home': { state: 'cloudy', attributes: { temperature: 10, temperature_unit: '°C', wind_speed: wind, wind_speed_unit: 'km/h' } } }))) as Any;
    expect(plan(await mount(80)).driftSeconds).toBeLessThan(plan(await mount(2)).driftSeconds);
  });
  it('a sensor in knots: 34 kn is force 8, not the force 5 of 34 km/h (the picker offers sensors in kn)', async () => {
    const el = (await renderCard(baseConfig({ option_effects: 'full', entity_forecast_icon: 'sensor.c', entity_wind_speed: 'sensor.w' } as never),
      makeHass({ 'sensor.c': { state: 'snowy' }, 'sensor.w': { state: '34', attributes: { unit_of_measurement: 'kn' } } }))) as Any;
    expect(plan(el).blizzard).toBe(true);
  });
});
