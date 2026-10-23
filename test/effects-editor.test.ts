import { describe, it, expect } from 'vitest';
import { render } from 'lit';
import '../src/platinum-weather-card';
import '../src/editor';
import { TRANSLATIONS } from '../src/translations';
import { makeHass } from './helpers';

// The two effects options in the visual editor, in the Appearance panel beside the icon pack:
// the choice of how much, and the choice of where.

type Editor = HTMLElement & {
  setConfig: (c: unknown) => void; hass: unknown; updateComplete: Promise<unknown>;
  _optionAppearanceEditor: () => unknown; _valueChanged: (ev: unknown) => void;
};

async function editor(config: Record<string, unknown> = {}) {
  const el = document.createElement('platinum-weather-card-plus-charts-editor') as Editor;
  el.setConfig({ card_config_version: 8, weather_entity: 'weather.home', ...config });
  el.hass = makeHass({ 'weather.home': { state: 'cloudy' } });
  document.body.appendChild(el);
  await el.updateComplete;
  const box = document.createElement('div');
  render(el._optionAppearanceEditor() as never, box);
  return { el, box };
}
const select = (box: HTMLElement, key: string) =>
  [...box.querySelectorAll('select')].find((s) => (s as unknown as { configValue: string }).configValue === key) as HTMLSelectElement | undefined;
const options = (s: HTMLSelectElement | undefined) => [...(s?.querySelectorAll('option') ?? [])].map((o) => o.getAttribute('value'));

describe('the effects choice in the editor', () => {
  it('is there, with off, subtle and full', async () => {
    const { box } = await editor();
    expect(options(select(box, 'option_effects'))).toEqual(['off', 'subtle', 'full']);
  });
  it('and the place, with the top part or the whole card', async () => {
    const { box } = await editor();
    expect(options(select(box, 'option_effects_area'))).toEqual(['overview', 'card']);
  });
  it('shows off and the top part when the configuration says nothing', async () => {
    const { box } = await editor();
    expect((select(box, 'option_effects') as unknown as { value: string }).value).toBe('off');
    expect((select(box, 'option_effects_area') as unknown as { value: string }).value).toBe('overview');
  });
  it('shows what the configuration says', async () => {
    const { box } = await editor({ option_effects: 'full', option_effects_area: 'card' });
    expect((select(box, 'option_effects') as unknown as { value: string }).value).toBe('full');
    expect((select(box, 'option_effects_area') as unknown as { value: string }).value).toBe('card');
  });
  it('shows off for a word it does not know, as the card itself reads it', async () => {
    const { box } = await editor({ option_effects: 'bogus', option_effects_area: 'bogus' });
    expect((select(box, 'option_effects') as unknown as { value: string }).value).toBe('off');
    expect((select(box, 'option_effects_area') as unknown as { value: string }).value).toBe('overview');
  });
  it('writes the choice into the configuration', async () => {
    const { el } = await editor();
    const seen: Record<string, unknown>[] = [];
    el.addEventListener('config-changed', (e) => seen.push((e as CustomEvent).detail.config));
    el._valueChanged({ target: { configValue: 'option_effects', value: 'subtle' } });
    el._valueChanged({ target: { configValue: 'option_effects_area', value: 'card' } });
    expect(seen).toHaveLength(2);
    expect(seen[0].option_effects).toBe('subtle');
    expect(seen[1].option_effects).toBe('subtle');
    expect(seen[1].option_effects_area).toBe('card');
  });
  it('does not write what is already there', async () => {
    const { el } = await editor({ option_effects: 'subtle' });
    const seen: unknown[] = [];
    el.addEventListener('config-changed', (e) => seen.push(e));
    el._valueChanged({ target: { configValue: 'option_effects', value: 'subtle' } });
    expect(seen).toHaveLength(0);
  });
  it('explains itself, and says it is experimental', async () => {
    const { box } = await editor();
    expect(box.textContent).toMatch(/experimental/i);
  });
});

describe('the words, in every language', () => {
  const KEYS = ['appearance', 'effects', 'effects_hint', 'effects_off', 'effects_subtle', 'effects_full', 'effects_area', 'effects_area_overview', 'effects_area_card'];
  it('are all there, and not left in English where the language is not', () => {
    const en = (TRANSLATIONS as Record<string, { editor?: Record<string, string> } & Record<string, unknown>>).en;
    for (const [lang, t] of Object.entries(TRANSLATIONS as Record<string, Record<string, unknown>>)) {
      const ed = (t.editor ?? t) as Record<string, string>;
      for (const k of KEYS) {
        expect(typeof ed[k], `${lang}: ${k}`).toBe('string');
        expect(ed[k].length, `${lang}: ${k}`).toBeGreaterThan(1);
        if (lang !== 'en') expect(ed[k], `${lang}: ${k} is still English`).not.toBe(((en.editor ?? en) as Record<string, string>)[k]);
      }
    }
  });
});
