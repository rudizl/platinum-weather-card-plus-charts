import { describe, it, expect } from 'vitest';
import '../src/platinum-weather-card';
import { makeHass, baseConfig, renderCard } from './helpers';

// The slots that a card draws when nobody has chosen them (README: l1 forecast_max, l2 forecast_min, l3 wind, l4 pressure, l5 sun_next; r1 popforecast, r2 humidity, r3 uv_summary, r4 moon, r5 sun_following).
// A card of nothing but a weather entity got them all, and a house without a UV warning, or with a provider that gives no humidity, saw rows of `---` that nobody had asked for.
// A slot that the user did not choose and that has nothing to read is not drawn, as the moon was not. A slot that was chosen keeps its `---`, and so does one whose entity is set and gives nothing for now.

type Entry = Record<string, unknown>;
// three days, from an hour ahead: the card does not take a forecast of fewer than three entries, nor the entries that are already in the past
const today = (extra: Entry = {}): Entry[] => [0, 1, 2].map((d) => ({ datetime: new Date(Date.now() + 3600000 + d * 86400000).toISOString(), temperature: 15, templow: 6, condition: 'cloudy', ...extra }));
const POOR = { temperature: 13 };
const RICH = { temperature: 13, humidity: 80, pressure: 1016, wind_speed: 20, wind_bearing: 312, wind_gust_speed: 30 };

async function card(attrs: Record<string, unknown>, cfg: Record<string, unknown> = {}, forecast: Entry[] = today(), extraStates: Record<string, unknown> = {}) {
  const hass = makeHass({ 'weather.home': { state: 'cloudy', attributes: attrs }, ...extraStates } as never, { forecast });
  return (await renderCard(baseConfig({ weather_entity: 'weather.home', forecast_type: 'daily', section_order: ['overview', 'slots'], ...cfg } as never), hass)) as HTMLElement & { getCardSize: () => number; _getCardSizeSlotsSection: () => number };
}
const drawn = (el: HTMLElement) => ['forecast_max', 'forecast_min', 'wind', 'pressure', 'humidity', 'uv_summary', 'popforecast', 'moon']
  .filter((s) => el.shadowRoot?.querySelector(`[data-slot="${s}"]`));
const text = (el: HTMLElement, s: string) => (el.shadowRoot?.querySelector(`[data-slot="${s}"]`)?.textContent ?? '').replace(/\s+/g, ' ').trim();

describe('a card of a weather entity that gives only a temperature', () => {
  it('draws the slots that have a source, and not the ones that have nothing to read', async () => {
    const el = await card(POOR);
    expect(drawn(el)).toEqual(['forecast_max', 'forecast_min']);
  });
});

describe('a weather entity that gives the usual attributes', () => {
  it('draws the wind, the pressure and the humidity, and not the UV summary, which needs an entity of its own', async () => {
    const el = await card(RICH);
    expect(drawn(el)).toEqual(expect.arrayContaining(['forecast_max', 'forecast_min', 'wind', 'pressure', 'humidity']));
    expect(drawn(el)).not.toContain('uv_summary');
    expect(drawn(el)).not.toContain('moon');
  });
  it('the chance of rain with the forecast: drawn when the forecast gives one, and not when it does not', async () => {
    expect(drawn(await card(RICH, {}, today({ precipitation_probability: 40 })))).toContain('popforecast');
    expect(drawn(await card(RICH, {}, today({ precipitation: 1.2 })))).toContain('popforecast');
    expect(drawn(await card(RICH, {}, today()))).not.toContain('popforecast');
  });
});

describe('what was chosen is drawn, with its `---`', () => {
  it('a slot that the user set, whatever the provider gives', async () => {
    const el = await card(POOR, { slot_l3: 'wind', slot_l4: 'pressure', slot_r2: 'humidity', slot_r3: 'uv_summary' });
    expect(drawn(el)).toEqual(expect.arrayContaining(['wind', 'pressure', 'humidity', 'uv_summary']));
    expect(text(el, 'humidity')).toContain('---');
    expect(text(el, 'uv_summary')).toContain('---');
  });
  it('a slot whose entity the user set, which gives nothing for now: not hidden while it is unavailable', async () => {
    const el = await card(POOR, { entity_humidity: 'sensor.h', entity_pressure: 'sensor.p' }, today(), { 'sensor.h': { state: 'unavailable' }, 'sensor.p': { state: 'unknown' } });
    expect(drawn(el)).toEqual(expect.arrayContaining(['humidity', 'pressure']));
    expect(text(el, 'humidity')).toContain('---');
  });
  it('the UV summary, when its entity is set', async () => {
    const el = await card(POOR, { entity_uv_alert_summary: 'sensor.uv' }, today(), { 'sensor.uv': { state: 'Moderate' } });
    expect(drawn(el)).toContain('uv_summary');
    expect(text(el, 'uv_summary')).toContain('Moderate');
  });
  it('and a slot that is removed is removed', async () => {
    expect(drawn(await card(RICH, { slot_l3: 'remove', slot_r2: 'remove' }))).not.toEqual(expect.arrayContaining(['wind']));
    expect(drawn(await card(RICH, { slot_r2: 'remove' }))).not.toContain('humidity');
  });
});

describe('the size of the slots section follows the slots that are drawn', () => {
  it('a card with fewer slots to draw is shorter by the rows that are not there', async () => {
    const poor = (await card(POOR)).getCardSize !== undefined ? (await card(POOR))._getCardSizeSlotsSection() : 0;
    const rich = (await card(RICH, {}, today({ precipitation_probability: 40 })))._getCardSizeSlotsSection();
    expect(poor).toBeLessThan(rich);
  });
  it('and the card as a whole never reports less than it has to draw', async () => {
    const el = await card(RICH, {}, today({ precipitation_probability: 40 }));
    expect(el.getCardSize()).toBeGreaterThan(0);
  });
});

describe('a card with sensors and no weather entity', () => {
  it('draws only what its entities give: no weather entity, no forecast slots, no source, no slot', async () => {
    const hass = makeHass({ 'sensor.t': { state: '14' }, 'sensor.h': { state: '70', attributes: { unit_of_measurement: '%' } } } as never);
    const el = (await renderCard(baseConfig({ entity_temperature: 'sensor.t', entity_humidity: 'sensor.h', section_order: ['overview', 'slots'] } as never), hass)) as HTMLElement;
    expect(drawn(el)).toContain('humidity');
    expect(drawn(el)).not.toEqual(expect.arrayContaining(['forecast_max']));
    expect(drawn(el)).not.toContain('wind');
    expect(drawn(el)).not.toContain('uv_summary');
  });
});
