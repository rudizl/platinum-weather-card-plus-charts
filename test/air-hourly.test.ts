import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import '../src/platinum-weather-card';
import { makeHass, baseConfig, renderCard, forgetSharedState } from './helpers';

// The bands of the European index are for hourly values (my review of 2.7): one reading of a cheap sensor over the line, a chimney or a gust,
// raised the warning, and the next reading took it away. The warning goes by the mean of the last hour of readings now, kept in memory for the
// sensor, as the pyranometer's are; the slot still shows the reading of the moment.

type Card = HTMLElement & { hass: unknown; updateComplete: Promise<unknown> };
const realNow = Date.now;
let clock = realNow();
const hass = (pm25: string) => makeHass({ 'sensor.pm25': { state: pm25, attributes: { unit_of_measurement: 'µg/m³' } } });
async function card(first: string) {
  return (await renderCard(baseConfig({ section_order: ['warnings', 'slots'], slot_l1: 'pm25', entity_pm25: 'sensor.pm25' } as never), hass(first))) as Card;
}
// the same card, a reading every minute for a number of minutes
async function readings(el: Card, value: string, minutes: number) {
  for (let i = 0; i < minutes; i++) { clock += 60_000; el.hass = hass(value); await el.updateComplete; }
}
const warning = (el: Card) => el.shadowRoot!.querySelector('.air-warning');

describe('the warning about the air goes by the hour', () => {
  beforeEach(() => { forgetSharedState(); clock = realNow(); Date.now = () => clock; });
  afterEach(() => { Date.now = realNow; });

  it('one reading over the line after a clean hour is not a warning', async () => {
    const el = await card('8');
    await readings(el, '8', 59);
    await readings(el, '120', 1);
    expect(warning(el)).toBeNull();
    // the slot shows the reading of the moment
    expect(el.shadowRoot!.querySelector('[data-slot="pm25"] .air-text')?.textContent?.trim()).toBe('120');
  });
  it('an hour of poor air is', async () => {
    const el = await card('70');
    await readings(el, '70', 60);
    expect(warning(el)?.textContent).toContain('Poor');
  });
  it('and readings older than an hour no longer count', async () => {
    const el = await card('70');
    await readings(el, '70', 60);
    await readings(el, '8', 61);
    expect(warning(el)).toBeNull();
  });
});
