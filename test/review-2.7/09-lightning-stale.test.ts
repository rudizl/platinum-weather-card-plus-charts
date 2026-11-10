// Находка 9: разстояние до мълния, което сензорът пази от последния удар.
import { describe, it, expect } from 'vitest';
import { Any, clean, plan, makeHass, baseConfig, renderCard } from './_util';
clean();

describe('9. a strike three days old', () => {
  it('does not flash behind the card', async () => {
    const old = new Date(Date.now() - 3 * 86400000).toISOString();
    const el = (await renderCard(baseConfig({ option_effects: 'subtle', entity_forecast_icon: 'sensor.c', entity_lightning_distance: 'sensor.km' } as never),
      makeHass({ 'sensor.c': { state: 'sunny' }, 'sensor.km': { state: '8', attributes: { unit_of_measurement: 'km' }, last_changed: old, last_updated: old } }))) as Any;
    expect(plan(el).flash).toBe(false);
  });
});
