import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { resolve } from 'path';
import '../src/platinum-weather-card';
import '../src/editor';
import { render } from 'lit';
import { makeHass, baseConfig, renderCard } from './helpers';

// The photoreal pack: fifteen PNG pictures with a transparent background, a flat file each beside the card's own
// (the release uploads dist/* flat), named p-<name>.png after the names the custom pack asks for.

const DIST = resolve(__dirname, '../dist');
const NAMES = ['clear-day', 'clear-night', 'partlycloudy-day', 'partlycloudy-night', 'cloudy', 'fog', 'rain', 'pouring',
  'snow', 'sleet', 'hail', 'lightning', 'lightning-rain', 'wind', 'exceptional'];

type Card = HTMLElement & { _getIconUrl: (n: string, f?: boolean) => string; _weatherIcon: (c: string) => string; _iconToWcc: (n: string) => string };

async function card(config: Record<string, unknown> = {}) {
  return (await renderCard(baseConfig({ icon_pack: 'photoreal', ...config } as never), makeHass({ 'weather.home': { state: 'cloudy' } }))) as unknown as Card;
}

describe('the files', () => {
  it('there are fifteen, each p-<name>.png, in dist, where the release takes them from', () => {
    for (const n of NAMES) expect(existsSync(resolve(DIST, `p-${n}.png`)), `p-${n}.png`).toBe(true);
    expect(readdirSync(DIST).filter((f) => /^p-.*\.png$/.test(f)).sort()).toEqual(NAMES.map((n) => `p-${n}.png`).sort());
  });
  it('each is a real PNG with an alpha channel: a picture that has a background of its own is not an icon', () => {
    for (const n of NAMES) {
      const b = readFileSync(resolve(DIST, `p-${n}.png`));
      expect(b.subarray(0, 8).toString('hex'), n).toBe('89504e470d0a1a0a');
      expect(b[25], `${n}: colour type (6 is RGBA)`).toBe(6);
    }
  });
  it('each is square, and not so large that the card is slow to start', () => {
    for (const n of NAMES) {
      const b = readFileSync(resolve(DIST, `p-${n}.png`));
      const w = b.readUInt32BE(16), h = b.readUInt32BE(20);
      expect(w, n).toBe(h);
      expect(w, n).toBeGreaterThanOrEqual(256);
      expect(w, n).toBeLessThanOrEqual(512);
      expect(statSync(resolve(DIST, `p-${n}.png`)).size / 1024, `${n} in KB`).toBeLessThan(180);
    }
    const total = NAMES.reduce((s, n) => s + statSync(resolve(DIST, `p-${n}.png`)).size, 0) / 1024 / 1024;
    expect(total, 'all fifteen, in MB').toBeLessThan(2.2);
  });
});

describe('the pack in the card', () => {
  it('is a picture beside the card, named after the condition', async () => {
    const el = await card();
    expect(el._getIconUrl('clear-day')).toMatch(/\/p-clear-day\.png\?r=\d+$/);
    expect(el._getIconUrl('rainy-3-day')).toMatch(/\/p-rain\.png\?r=\d+$/);
    expect(el._getIconUrl('rainy-3')).toMatch(/\/p-pouring\.png\?r=\d+$/);
    expect(el._getIconUrl('cloudy-2-night')).toMatch(/\/p-partlycloudy-night\.png\?r=\d+$/);
  });
  it('and is the same place as the card itself, not the Internet and not a path the user has to make', async () => {
    const url = (await card())._getIconUrl('snowy-3');
    expect(url).not.toMatch(/^https?:\/\/(cdn|raw)/);
    expect(url).toMatch(/p-snow\.png\?r=\d+$/);
  });
  it('has a picture for every name the card can produce, and the picture is in dist', async () => {
    const el = await card();
    const CONDITIONS = ['sunny', 'clear-night', 'partlycloudy', 'cloudy', 'rainy', 'pouring', 'snowy', 'snowy-rainy', 'fog', 'hail', 'lightning', 'lightning-rainy', 'windy', 'windy-variant', 'exceptional', 'drizzle', 'light-rain', 'showers'];
    const BANDS = ['clear', 'cloudy-1', 'cloudy-2', 'cloudy-3'].flatMap((b) => [`${b}-day`, `${b}-night`]);
    const names = new Set<string>([...BANDS, 'cloudy']);
    for (const c of CONDITIONS) names.add(el._weatherIcon(c));
    const missing: string[] = [];
    for (const n of names) {
      const url = el._getIconUrl(n);
      const file = url.split('/').pop()!.split('?')[0];
      if (!/^p-.*\.png$/.test(file) || !existsSync(resolve(DIST, file))) missing.push(`${n} -> ${file}`);
    }
    expect(missing, 'names that land on a picture that is not there').toEqual([]);
  });
  it('the forecast strips use it too', async () => {
    expect((await card())._getIconUrl('rainy-3-day', true)).toMatch(/p-rain\.png\?r=\d+$/);
  });
  it('another pack is not changed by it', async () => {
    const el = await card({ icon_pack: 'default' });
    expect(el._getIconUrl('clear-day')).toMatch(/a-clear-day\.svg$/);
  });
});

describe('pictures that change without changing their names', () => {
  // Home Assistant serves them with a cache of 31 days (max-age=2678400, seen on 23 October), so a phone that has
  // the old p-rain.png keeps it for a month unless the address changes. The revision is in the address, and
  // Home Assistant does not mind it.
  it('the address carries the revision of the pack, the same for every picture', async () => {
    const el = await card();
    const revs = new Set(NAMES.map((n) => /\?r=(\d+)$/.exec(el._getIconUrl(n === 'partlycloudy-day' ? 'cloudy-1-day' : n === 'clear-night' ? 'clear-night' : 'clear-day'))![1]));
    expect(revs.size).toBe(1);
    expect(+[...revs][0]).toBeGreaterThanOrEqual(2);
  });
});

describe('the choice in the editor', () => {
  type Editor = HTMLElement & { setConfig: (c: unknown) => void; hass: unknown; updateComplete: Promise<unknown>; _optionAppearanceEditor: () => unknown };
  it('is offered in Appearance, among the packs', async () => {
    const el = document.createElement('platinum-weather-card-plus-charts-editor') as Editor;
    el.setConfig({ card_config_version: 8, weather_entity: 'weather.home', icon_pack: 'photoreal' });
    el.hass = makeHass({ 'weather.home': { state: 'cloudy' } });
    document.body.appendChild(el);
    await el.updateComplete;
    const box = document.createElement('div'); render(el._optionAppearanceEditor() as never, box);
    const sel = [...box.querySelectorAll('select')].find((s) => (s as unknown as { configValue: string }).configValue === 'icon_pack') as HTMLSelectElement;
    const values = [...sel.querySelectorAll('option')].map((o) => o.getAttribute('value'));
    expect(values).toContain('photoreal');
    expect((sel as unknown as { value: string }).value).toBe('photoreal');
    expect(values.indexOf('photoreal')).toBeLessThan(values.indexOf('custom'));
  });
});

describe('what the README says of it', () => {
  const readme = readFileSync(resolve(__dirname, '../README.md'), 'utf8');
  it('names the pack in the table and in the settings', () => {
    expect(readme).toMatch(/\|\s*`photoreal`\s*\|/);
    expect(readme).toMatch(/`photoreal`/);
  });
  it('says plainly that the pictures were made with an AI, and that the licence is still to be settled', () => {
    expect(readme).toMatch(/generated with .*Gemini/i);
    expect(readme).toMatch(/licen[cs]e.*(review|settled|decided)/i);
  });
});
