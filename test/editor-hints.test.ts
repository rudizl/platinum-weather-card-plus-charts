import { describe, it, expect } from 'vitest';
import '../src/platinum-weather-card';
import '../src/editor';
import { TRANSLATIONS } from '../src/translations';
import { makeHass } from './helpers';

// Each row of the first screen of the editor has a hint under its title: what is in that section or topic, so that one knows which to open
// (2.7). It replaced a line of what the row was set to, which the card beside the editor already shows; that line spoke in names of entities
// and numbers, and said little of what one would find inside.

const SECTIONS = ['warnings', 'overview', 'extended', 'slots', 'daily_forecast', 'hourly_forecast', 'charts'];
const TOPICS = ['topic_appearance', 'topic_warnings', 'topic_sky', 'topic_local_forecast', 'topic_card'];
const HINTS = [...SECTIONS.map((s) => `hint_${s}`), ...TOPICS.map((t) => `hint_${t}`)];
type Editor = HTMLElement & { setConfig: (c: unknown) => void; hass: unknown; updateComplete: Promise<unknown> };

async function firstScreen(language = 'en') {
  const el = document.createElement('platinum-weather-card-plus-charts-editor') as Editor;
  el.setConfig({ card_config_version: 8, weather_entity: 'weather.home', show_section_hourly_forecast: true, option_locale: language });
  el.hass = makeHass({ 'weather.home': { state: 'cloudy' } });
  (el.hass as { language: string }).language = language;
  document.body.appendChild(el); await el.updateComplete;
  return el;
}
const editorTexts = (lang: string) => ((TRANSLATIONS as Record<string, Record<string, unknown>>)[lang].editor ?? {}) as Record<string, string>;

describe('the hints of the first screen', () => {
  it('every section and every topic has one, under its title', async () => {
    const el = await firstScreen();
    const rows = [...el.shadowRoot!.querySelectorAll('.section-row, .topic-row')];
    expect(rows.length).toBe(SECTIONS.length + TOPICS.length);
    for (const r of rows) expect(r.querySelector('.row-summary')?.textContent?.trim(), r.className).toBeTruthy();
  });
  it('they say what is there, not what it is set to: the same whatever the configuration', async () => {
    const a = await firstScreen();
    const text = (el: HTMLElement) => [...el.shadowRoot!.querySelectorAll('.row-summary')].map((x) => x.textContent?.trim());
    const b = document.createElement('platinum-weather-card-plus-charts-editor') as Editor;
    b.setConfig({ card_config_version: 8, weather_entity: 'weather.home', show_section_hourly_forecast: true, icon_pack: 'photoreal', option_effects: 'full',
      daily_forecast_days: 7, entity_warning: 'sensor.w', option_locale: 'en' });
    b.hass = makeHass({ 'weather.home': { state: 'cloudy' } });
    document.body.appendChild(b); await b.updateComplete;
    expect(text(b)).toEqual(text(a));
  });
  it('in English as written', async () => {
    const el = await firstScreen();
    const hintOf = (sel: string) => el.shadowRoot!.querySelector(`${sel} .row-summary`)?.textContent?.trim();
    expect(hintOf('.edit-overview-section')).toBe("The weather now and today's forecast");
    expect(hintOf('[data-topic="topic_sky"]')).toBe('The sun and rain sensors that correct the icon');
  });
  it('in every language there are all twelve, none empty, none the same as another, none the same as its title', () => {
    for (const lang of Object.keys(TRANSLATIONS)) {
      const t = editorTexts(lang);
      const vals = HINTS.map((k) => t[k]);
      for (const [k, v] of HINTS.map((k, i) => [k, vals[i]])) expect(typeof v === 'string' && v.trim().length > 0, `${lang} ${k}`).toBe(true);
      expect(new Set(vals).size, `${lang}: two hints alike`).toBe(HINTS.length);
      for (const topic of TOPICS) expect(t[`hint_${topic}`], `${lang} ${topic}`).not.toBe(t[topic]);
    }
  });
  it('and the summaries they replaced are gone from every language', () => {
    for (const lang of Object.keys(TRANSLATIONS)) expect(Object.keys(editorTexts(lang)).filter((k) => k.startsWith('summary_')), lang).toEqual([]);
  });
  it('the Bulgarian ones say rain the way people say it', () => {
    const bg = editorTexts('bg');
    for (const k of HINTS) expect(bg[k], k).not.toMatch(/валежомер/i);
  });
});
