// Two holes the review of 2.7 found in the tests (M35, M18): what reaches the effects from a detector in miles, and that a gauge does not
// judge sleet. Each was a mutation no test caught.
import { describe, it, expect } from 'vitest';
import { Any, clean, plan, makeHass, baseConfig, renderCard } from './_util';
clean();

const now = () => new Date().toISOString();
async function storm(distance: string, unit: string) {
  return (await renderCard(baseConfig({ option_effects: 'full', entity_forecast_icon: 'sensor.c', entity_sun: 'sun.sun', entity_lightning_distance: 'sensor.ld' } as never),
    makeHass({ 'sensor.c': { state: 'sunny' }, 'sun.sun': { state: 'above_horizon', attributes: { elevation: 30 } },
      'sensor.ld': { state: distance, attributes: { unit_of_measurement: unit }, last_changed: now() } }))) as Any;
}
async function sleet(rate: string) {
  return (await renderCard(baseConfig({ option_effects: 'full', entity_forecast_icon: 'sensor.c', entity_sun: 'sun.sun', entity_rain_rate: 'sensor.r' } as never),
    makeHass({ 'sensor.c': { state: 'snowy-rainy' }, 'sun.sun': { state: 'above_horizon', attributes: { elevation: 30 } },
      'sensor.r': { state: rate, attributes: { unit_of_measurement: 'mm/h' } } }))) as Any;
}

describe('M35: the effects are given the distance in kilometres', () => {
  it('a storm 10 mi away flashes as one 16.1 km away, not as one 10 km away', async () => {
    // how bright and how often: the nearer, the brighter and the more often
    const pick = (p: Any) => ({ peak: p.flashPeak, seconds: p.flashSeconds });
    const miles = pick(plan(await storm('10', 'mi')));
    expect(miles).toEqual(pick(plan(await storm('16.09', 'km'))));
    expect(miles).not.toEqual(pick(plan(await storm('10', 'km'))));
  });
});

describe('M18: a gauge does not judge sleet', () => {
  it('sleet is the same rain whatever the gauge reads, and a dry gauge does not take it away', async () => {
    const heavy = plan(await sleet('12')).rain;
    expect(heavy).not.toBeNull();
    expect(plan(await sleet('0.5')).rain).toEqual(heavy);
    expect(plan(await sleet('0')).rain).toEqual(heavy);
  });
});
