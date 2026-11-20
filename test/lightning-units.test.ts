import { describe, it, expect } from 'vitest';
import { render } from 'lit';
import '../src/platinum-weather-card';
import '../src/editor';
import { makeHass, baseConfig, renderCard } from './helpers';
import { TRANSLATIONS } from '../src/translations';

// The distance of a lightning detector is read in the unit of its entity (#38). It was compared, as it came, with limits written for
// kilometres: with a detector in miles (Blitzortung follows the unit system of Home Assistant), the default range of 50 was 50 miles,
// the row turned red within 15 miles and amber within 30, and the editor said "Warn within (km)". The colours now work in kilometres
// whatever the unit, the limit stays in the unit of the entity (a value someone set keeps meaning what it meant), its default is
// 50 km in that unit, and the editor names the unit of the chosen entity.

type Card = HTMLElement;
async function card(state: string, unit: string | undefined, extra: Record<string, unknown> = {}) {
  const attrs = unit === undefined ? {} : { unit_of_measurement: unit };
  return (await renderCard(baseConfig({ section_order: ['warnings'], entity_lightning_distance: 'sensor.ld', ...extra } as never),
    makeHass({ 'sensor.ld': { state, attributes: attrs } }))) as Card;
}
const row = (el: Card) => el.shadowRoot?.querySelector('.warning-row') as HTMLElement | null;
const level = (el: Card) => { const r = row(el); return !r ? 'none' : r.classList.contains('level-red') ? 'red' : r.classList.contains('level-orange') ? 'amber' : 'yellow'; };
const text = (el: Card) => (row(el)?.querySelector('.warning-text')?.textContent ?? '').trim();

describe('a detector in miles', () => {
  it('9 mi is 14.5 km: red, as a storm that near is', async () => {
    const el = await card('9', 'mi');
    expect(level(el)).toBe('red');
    expect(text(el)).toMatch(/9 mi$/);
  });
  it('15 mi is 24 km: amber, not red', async () => {
    expect(level(await card('15', 'mi'))).toBe('amber');
  });
  it('20 mi is 32 km: yellow, not amber', async () => {
    expect(level(await card('20', 'mi'))).toBe('yellow');
  });
  it('the default range is 50 km, 31 mi: a storm 40 mi away is not a warning', async () => {
    expect(level(await card('30', 'mi'))).toBe('yellow');
    expect(level(await card('40', 'mi'))).toBe('none');
  });
  it('a range that was set keeps the unit of the entity, as it always had: 45 is 45 mi', async () => {
    expect(level(await card('40', 'mi', { option_lightning_max_distance: 45 }))).toBe('yellow');
    expect(level(await card('46', 'mi', { option_lightning_max_distance: 45 }))).toBe('none');
  });
});

describe('other units, and none', () => {
  it('kilometres are as they were', async () => {
    expect(level(await card('14', 'km'))).toBe('red');
    expect(level(await card('29', 'km'))).toBe('amber');
    expect(level(await card('50', 'km'))).toBe('yellow');
    expect(level(await card('51', 'km'))).toBe('none');
  });
  it('a distance without a unit is read in kilometres', async () => {
    expect(level(await card('14', undefined))).toBe('red');
    expect(text(await card('14', undefined))).toMatch(/14 km$/);
  });
  it('metres are metres: 12000 m is 12 km, red', async () => {
    const el = await card('12000', 'm');
    expect(level(el)).toBe('red');
    expect(text(el)).toMatch(/12000 m$/);
  });
});

describe('the editor', () => {
  type Editor = HTMLElement & { setConfig: (c: unknown) => void; hass: unknown; updateComplete: Promise<unknown>; _sectionWarningsEditor: () => unknown };
  async function field(unit?: string) {
    const el = document.createElement('platinum-weather-card-plus-charts-editor') as Editor;
    el.setConfig({ card_config_version: 8, weather_entity: 'weather.home', entity_lightning_distance: 'sensor.ld' });
    el.hass = makeHass({ 'weather.home': { state: 'sunny' }, 'sensor.ld': { state: '10', attributes: unit ? { unit_of_measurement: unit } : {} } });
    document.body.appendChild(el); await el.updateComplete;
    const box = document.createElement('div'); render(el._sectionWarningsEditor() as never, box);
    const input = [...box.querySelectorAll('ha-input')].find((x) => (x as unknown as { configValue: string }).configValue === 'option_lightning_max_distance') as Element;
    const hint = input.nextElementSibling?.textContent ?? '';
    // the label is an attribute of the field
    return { label: input.getAttribute('label') ?? '', hint };
  }
  it('names the unit of the chosen entity, and the default in it', async () => {
    const mi = await field('mi');
    expect(mi.label).toBe('Warn within (mi)');
    expect(mi.hint).toMatch(/Default 31 mi\./);
    const km = await field('km');
    expect(km.label).toBe('Warn within (km)');
    expect(km.hint).toMatch(/Default 50 km\./);
    expect((await field()).label).toBe('Warn within (km)');
  });
  it('in every language the label and the hint have the places for the unit and the default', () => {
    for (const [lang, t] of Object.entries(TRANSLATIONS)) {
      const e = t.editor as Record<string, string>;
      expect(e.lightning_max_distance, lang).toContain('{unit}');
      expect(e.lightning_max_distance_hint, lang).toContain('{default}');
      expect(e.lightning_max_distance, lang).not.toMatch(/\(k[mм]\)|\(км\)/);
    }
  });
});
