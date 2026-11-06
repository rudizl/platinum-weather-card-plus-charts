import { describe, it, expect } from 'vitest';
import '../src/platinum-weather-card';
import { makeHass, baseConfig, renderCard, warnings } from './helpers';

// A setting that names an entity Home Assistant does not have (deleted, renamed, or not loaded yet at start-up) put a warning box of Home Assistant's above the card.
// In the sections view the card has the height of its content, and the box pushed the card itself out of its cell: one missing optional sensor and all that was
// seen was the warning, on an empty card (6 November 2026, while a helper was being replaced). The card is drawn now, and the warning is a short row at its top,
// inside it, for as long as the entity is missing.

type State = { state: string; attributes?: Record<string, unknown> };
const base: Record<string, State> = {
  'weather.w': { state: 'sunny', attributes: { temperature: 12, humidity: 60, pressure: 1013, wind_speed: 10, wind_bearing: 90 } },
  'sensor.wind': { state: '90', attributes: { unit_of_measurement: '°' } },
};
const cfg = (extra: Record<string, unknown> = {}) => baseConfig({ weather_entity: 'weather.w', entity_wind_bearing: 'sensor.wind',
  section_order: ['overview', 'slots', 'daily_forecast'], ...extra } as never);

describe('an entity that is missing', () => {
  it('leaves the card drawn, with the warning as a row inside it, at its top', async () => {
    const el = (await renderCard(cfg({ entity_wind_bearing_6h: 'sensor.gone' }), makeHass(base))) as HTMLElement;
    const r = el.shadowRoot!;
    expect(r.querySelector('hui-warning'), 'no box of Home Assistant outside the card').toBeNull();
    const card = r.querySelector('ha-card')!;
    expect(card).not.toBeNull();
    const row = card.querySelector('.content > .config-warning');
    expect(row, 'the warning is inside the card').not.toBeNull();
    expect(card.querySelector('.content')!.firstElementChild).toBe(row);
    expect(warnings(el)).toEqual(["'entity_wind_bearing_6h=sensor.gone' not found"]);
    expect(card.querySelector('.overview-section'), 'the overview is still drawn').not.toBeNull();
  });
  it('names every entity that is missing, one line each', async () => {
    const el = (await renderCard(cfg({ entity_wind_bearing_6h: 'sensor.gone', entity_uv_index: 'sensor.gone_too' }), makeHass(base))) as HTMLElement;
    expect(warnings(el).sort()).toEqual(["'entity_uv_index=sensor.gone_too' not found", "'entity_wind_bearing_6h=sensor.gone' not found"]);
  });
  it('shows no row when nothing is missing', async () => {
    const el = (await renderCard(cfg(), makeHass(base))) as HTMLElement;
    expect(el.shadowRoot!.querySelector('.config-warning')).toBeNull();
    expect(warnings(el)).toEqual([]);
  });
  it('the row goes when the entity comes back, without a reload', async () => {
    const hass = makeHass(base);
    const el = (await renderCard(cfg({ entity_wind_bearing_6h: 'sensor.back' }), hass)) as HTMLElement & { hass: unknown; updateComplete: Promise<unknown> };
    expect(warnings(el).length).toBe(1);
    el.hass = { ...hass, states: { ...(hass as unknown as { states: Record<string, State> }).states, 'sensor.back': { state: '20', attributes: { unit_of_measurement: '°' } } } };
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.config-warning')).toBeNull();
  });
  it('the row is styled as a warning that does not take the card over', async () => {
    const el = (await renderCard(cfg({ entity_wind_bearing_6h: 'sensor.gone' }), makeHass(base))) as HTMLElement;
    const css = String((el as unknown as { styles: { cssText: string } }).styles.cssText).replace(/\s+/g, ' ');
    expect(css).toMatch(/\.config-warning \{[^}]*display: flex;[^}]*font-size: 12px;/);
    expect(css).toMatch(/\.config-warning-icon \{[^}]*color: var\(--warning-color, #ffa600\);/);
  });
});
