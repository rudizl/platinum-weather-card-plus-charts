import { describe, it, expect } from 'vitest';
import { render } from 'lit';
import '../src/platinum-weather-card';
import '../src/editor';
import { makeHass } from './helpers';
import { TRANSLATIONS } from '../src/translations';
import { readFileSync } from 'node:fs';

// A row of the first screen says what it is set to, in a line under its title, so that a setting can be seen without opening its page (the mockup of 2.7).
// And the words of the editor: labels in sentence case in English, the classic style called classic, and a choice left empty called the default.

type Editor = HTMLElement & { setConfig: (c: unknown) => void; hass: unknown; updateComplete: Promise<unknown>; render: () => unknown };
async function editor(config: Record<string, unknown> = {}) {
  const el = document.createElement('platinum-weather-card-plus-charts-editor') as Editor;
  el.setConfig({ card_config_version: 8, weather_entity: 'weather.home', ...config });
  el.hass = makeHass({
    'weather.home': { state: 'cloudy', attributes: { friendly_name: 'Home weather' } },
    'binary_sensor.alarm': { state: 'off', attributes: { friendly_name: 'MeteoAlarm Varna' } },
    'sensor.ld': { state: '30', attributes: { unit_of_measurement: 'mi' } },
    'weather.hourly': { state: 'sunny', attributes: { friendly_name: 'Varna hourly' } },
  });
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}
async function summaries(config: Record<string, unknown> = {}) {
  const el = await editor(config);
  const box = document.createElement('div'); render(el.render() as never, box);
  const out: Record<string, string> = {};
  // the sections first: the pencil of Warnings opens the topic, and the topic row is the one that says what it is set to
  for (const r of box.querySelectorAll('.section-row')) {
    const edit = (r.querySelector('.edit-icon') as unknown as { value: string }).value;
    out[edit] = (r.querySelector('.row-summary')?.textContent ?? '').trim();
  }
  for (const r of box.querySelectorAll('.topic-row')) out[(r as unknown as { value: string }).value] = (r.querySelector('.row-summary')?.textContent ?? '').trim();
  return out;
}

describe('the summaries of the first screen', () => {
  it('a topic says what it is set to', async () => {
    const s = await summaries({ icon_pack: 'photoreal', option_effects: 'full', entity_warning: 'binary_sensor.alarm', entity_lightning_distance: 'sensor.ld',
      option_lightning_max_distance: 30, entity_solar_radiation: 'sensor.sr', option_cloud_overrides_icon: true, entity_rain_rate: 'sensor.rr',
      option_local_forecast: true, option_forecast_algorithm: 'sager', text_card_title: 'Къщичка', option_locale: 'bg' });
    expect(s.topic_appearance).toBe('Icon pack: Photoreal · Weather effects: Full');
    expect(s.topic_warnings).toBe('MeteoAlarm Varna · lightning within 30 mi · Soft');
    expect(s.topic_sky).toBe('Pyranometer, corrects the icon · Rain gauge');
    expect(s.topic_local_forecast).toBe('Sager');
    expect(s.topic_card).toBe('“Къщичка” · Български');
  });
  it('and says so when nothing is set', async () => {
    const s = await summaries();
    expect(s.topic_appearance).toBe('Icon pack: Default');
    expect(s.topic_warnings).toBe('No entity chosen · Soft');
    expect(s.topic_sky).toBe('No sensors');
    expect(s.topic_local_forecast).toBe('Off');
    expect(s.topic_card).toBe('Language of Home Assistant');
  });
  it('a section says it too, with the defaults the card itself uses', async () => {
    const s = await summaries({ entity_hourly: 'weather.hourly', hourly_forecast_step: 2, daily_forecast_days: 7, daily_forecast_layout: 'vertical', slot_l1: 'humidity', slot_r1: 'pressure' });
    expect(s.section_daily_forecast).toBe('7 days · Vertical');
    expect(s.section_hourly_forecast).toBe('12 hours, every 2 · Varna hourly');
    expect(s.section_slots).toBe('2 slots');
    expect(s.section_overview).toBe('Complete');
    expect((await summaries()).section_daily_forecast).toBe('5 days · Horizontal');
    expect((await summaries()).section_hourly_forecast).toBe('No entity chosen');
  });
  it('a value it does not know shows no key', async () => {
    const s = await summaries({ option_effects: 'storm', overview_layout: 'weird', icon_pack: 'mine', option_locale: 'xx' });
    for (const [row, text] of Object.entries(s)) expect(text, row).not.toMatch(/\b[a-z]+_[a-z_]+\b/);
  });
  it('in every language, without a key left', async () => {
    for (const lang of Object.keys(TRANSLATIONS)) {
      const el = await editor({ entity_hourly: 'weather.hourly', hourly_forecast_step: 3 });
      (el as unknown as { hass: { language: string } }).hass = { ...(el.hass as object), language: lang } as never;
      await el.updateComplete;
      const box = document.createElement('div'); render(el.render() as never, box);
      for (const x of box.querySelectorAll('.row-summary')) expect((x.textContent ?? '').trim(), lang).not.toMatch(/\b(summary|opt|warning_style)_[a-z_]+\b|\{\w+\}/);
    }
  });
});

describe('the words of the editor', () => {
  const en = TRANSLATIONS.en.editor as Record<string, string>;
  it('every language has the placeholders of English in each text that has them', () => {
    // which placeholders, not how often: a translation may say {condition} once where English says it twice
    const marks = (v: string) => [...new Set(v.match(/\{\w+\}/g) ?? [])].sort().join(' ');
    for (const [lang, t] of Object.entries(TRANSLATIONS)) {
      for (const [k, v] of Object.entries(en)) {
        const tv = (t.editor as Record<string, string>)[k];
        if (tv !== undefined) expect(marks(tv), `${lang} ${k}`).toBe(marks(v));
      }
    }
  });
  it('the English labels are in sentence case, as in Home Assistant', () => {
    const KEEP = new Set(['UV', 'HA', 'MeteoAlarm', 'Zambretti', 'Sager', 'Weathercaster', 'Beaufort', 'Meteocons', 'BOM', 'CAP', 'WMO', 'NWS', 'CDN', 'Derivative', 'Trend', 'Statistics', 'Home', 'Assistant']);
    const title = Object.entries(en).filter(([k, v]) => !k.endsWith('_hint') && !k.startsWith('icon_pack_') && !/[.:] /.test(v)
      && v.split(' ').slice(1).some((w) => /^[A-Z][a-z]/.test(w) && !KEEP.has(w.replace(/[()—,]/g, ''))));
    expect(title).toEqual([]);
    expect(Object.values(en).join(' ')).not.toMatch(/\bTodays\b/);
  });
  it('the classic style of the warnings is called classic in every language', () => {
    for (const [lang, t] of Object.entries(TRANSLATIONS)) expect((t.editor as Record<string, string>).warning_style_classic, lang).not.toMatch(/before|досега/i);
    expect(en.warning_style_classic).toBe('Classic');
  });
  it('a choice left empty is called the default, in every select', () => {
    const src = readFileSync('src/editor.ts', 'utf8');
    expect(src).not.toContain('<option value=""></option>');
    for (const [lang, t] of Object.entries(TRANSLATIONS)) expect((t.editor as Record<string, string>).opt_default, lang).toBeTruthy();
  });
});
