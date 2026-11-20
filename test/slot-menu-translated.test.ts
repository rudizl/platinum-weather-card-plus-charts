import { describe, it, expect } from 'vitest';
import { render } from 'lit';
import { readFileSync } from 'fs';
import { join } from 'path';
import '../src/platinum-weather-card';
import '../src/editor';
import { TRANSLATIONS } from '../src/translations';
import { makeHass } from './helpers';

// The menu that picks what a slot shows had its thirty-odd labels written into _slotOptions in English, so they showed in English in every
// language (#70). They go through the translations now, as slot_opt_<value>.

type Editor = HTMLElement & { setConfig: (c: unknown) => void; hass: unknown; updateComplete: Promise<unknown>; _slotOptions: (v: string) => unknown };
async function options(language: string): Promise<{ value: string; text: string }[]> {
  const el = document.createElement('platinum-weather-card-plus-charts-editor') as Editor;
  el.setConfig({ card_config_version: 8, weather_entity: 'weather.home' });
  el.hass = { ...(makeHass({ 'weather.home': { state: 'cloudy' } }) as object), language };
  document.body.appendChild(el);
  await el.updateComplete;
  const box = document.createElement('select');
  render(el._slotOptions('') as never, box);
  el.remove();
  return [...box.querySelectorAll('option')].map((o) => ({ value: o.value, text: (o.textContent || '').trim() }));
}
const LANGS = Object.keys(TRANSLATIONS as Record<string, unknown>);

describe('the menu of the slots (#70)', () => {
  it('has no text written into _slotOptions', () => {
    const src = readFileSync(join(__dirname, '..', 'src', 'editor.ts'), 'utf8');
    const start = src.indexOf('private _slotOptions(');
    const body = src.slice(start, src.indexOf('\n  }\n', start));
    // a label is text with a space or a capital letter; the values of the slots are lower_case
    const quoted = [...body.matchAll(/(['"])((?:(?!\1)[^\n])*)\1/g)].map((m) => m[2]);
    expect(quoted.filter((s) => /[A-Z]|\s/.test(s))).toEqual([]);
  });

  it('every language has a label for every value of the menu', async () => {
    const values = (await options('en')).map((o) => o.value);
    expect(values.length).toBeGreaterThan(30);
    const keys = [...new Set(values.map((v) => `slot_opt_${/^custom\d$/.test(v) ? 'custom' : v}`))];
    for (const lang of LANGS) {
      const ed = ((TRANSLATIONS as Record<string, { editor: Record<string, string> }>)[lang]).editor;
      expect(keys.filter((k) => typeof ed[k] !== 'string' || ed[k].length < 2), lang).toEqual([]);
    }
  });

  it('in Bulgarian the menu shows Bulgarian, and the four custom entities are numbered', async () => {
    const opts = await options('bg');
    const latin = opts.map((o) => o.text.replace(/PM2\.5|PM10|UV/g, '')).filter((t) => /[A-Za-z]/.test(t));
    expect(latin).toEqual([]);
    expect(opts.filter((o) => /^custom\d$/.test(o.value)).map((o) => o.text)).toEqual(['Собствен обект 1', 'Собствен обект 2', 'Собствен обект 3', 'Собствен обект 4']);
  });

  it('in each language other than English, no label is left in English', async () => {
    const en = await options('en');
    for (const lang of LANGS.filter((l) => l !== 'en')) {
      const opts = await options(lang);
      const same = opts.filter((o, i) => o.text === en[i].text && !/^(PM|UV)/.test(o.text)).map((o) => o.value);
      expect(same, lang).toEqual([]);
    }
  });
});
