import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { resolve } from 'path';
import '../src/platinum-weather-card';
import '../src/editor';
import { render } from 'lit';
import { makeHass, baseConfig, renderCard } from './helpers';

// The photoreal pack: twenty PNG pictures with a transparent background, a flat file each beside the card's own
// (the release uploads dist/* flat), named p-<name>.png: the fifteen names the custom pack asks for, and five more for
// the levels of the sky and of the rain, which the custom pack does not ask for, and three for what is not a tornado and was drawn as one (a tropical storm, dust, a name
// that is not known).

const DIST = resolve(__dirname, '../dist');
const NAMES = ['clear-day', 'clear-night', 'partlycloudy-day', 'partlycloudy-night', 'cloudy', 'fog', 'rain', 'pouring',
  'snow', 'sleet', 'hail', 'lightning', 'lightning-rain', 'wind', 'exceptional',
  'mostlysunny-day', 'mostlysunny-night', 'mostlycloudy-day', 'mostlycloudy-night', 'lightrain',
  'tropical-storm', 'dust', 'unknown', 'brokenclouds-day', 'brokenclouds-night'];

type Card = HTMLElement & { _getIconUrl: (n: string, f?: boolean) => string; _weatherIcon: (c: string) => string; _iconToWcc: (n: string) => string };

async function card(config: Record<string, unknown> = {}) {
  return (await renderCard(baseConfig({ icon_pack: 'photoreal', ...config } as never), makeHass({ 'weather.home': { state: 'cloudy' } }))) as unknown as Card;
}

describe('the files', () => {
  it('there are twenty-five, each p-<name>.png, in dist, where the release takes them from', () => {
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
    expect(total, 'all of them, in MB').toBeLessThan(2.6);
  });
});

describe('the pack in the card', () => {
  it('is a picture beside the card, named after the condition', async () => {
    const el = await card();
    expect(el._getIconUrl('clear-day')).toMatch(/\/p-clear-day\.png\?r=\d+$/);
    expect(el._getIconUrl('rainy-3-day')).toMatch(/\/p-rain\.png\?r=\d+$/);
    expect(el._getIconUrl('rainy-3')).toMatch(/\/p-pouring\.png\?r=\d+$/);
    expect(el._getIconUrl('cloudy-2-night')).toMatch(/\/p-brokenclouds-night\.png\?r=\d+$/);
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
    // what the rain gauge makes of a plain sky: rainy-1, rainy-2 and rainy-3, each with a day or a night (cloudy-3 and rainy-2
    // were the two the table had not, and both fell to a tornado, which the test did not mind: the tornado is a picture too)
    const RATES = ['rainy-1', 'rainy-2', 'rainy-3'].flatMap((b) => [`${b}-day`, `${b}-night`]);
    const names = new Set<string>([...BANDS, ...RATES, 'cloudy']);
    for (const c of CONDITIONS) names.add(el._weatherIcon(c));
    const missing: string[] = [];
    const tornado: string[] = [];
    const ON_PURPOSE = new Set<string>();   // the tornado is for 'exceptional', which is not a name the card produces from a condition's icon
    for (const n of names) {
      const url = el._getIconUrl(n);
      const file = url.split('/').pop()!.split('?')[0];
      if (!/^p-.*\.png$/.test(file) || !existsSync(resolve(DIST, file))) missing.push(`${n} -> ${file}`);
      if (file === 'p-exceptional.png' && !ON_PURPOSE.has(n)) tornado.push(n);
    }
    expect(missing, 'names that land on a picture that is not there').toEqual([]);
    expect(tornado, 'names that land on the tornado without meaning to').toEqual([]);
  });
  it('the forecast strips use it too', async () => {
    expect((await card())._getIconUrl('rainy-3-day', true)).toMatch(/p-rain\.png\?r=\d+$/);
  });
  it('another pack is not changed by it', async () => {
    const el = await card({ icon_pack: 'default' });
    expect(el._getIconUrl('clear-day')).toMatch(/a-clear-day\.svg$/);
  });
});

describe('the levels of the sky and of the rain look different', () => {
  const file = (el: Card, n: string) => el._getIconUrl(n).split('/').pop()!.split('?')[0];
  it('four bands of cloud, four pictures, by day and by night', async () => {
    const el = await card();
    for (const t of ['day', 'night']) {
      const f = ['clear', 'cloudy-1', 'cloudy-2', 'cloudy-3'].map((b) => file(el, `${b}-${t}`));
      expect(new Set(f).size, `${t}: ${f.join(', ')}`).toBe(4);
    }
    expect(file(el, 'cloudy-1-day')).toBe('p-mostlysunny-day.png');
    expect(file(el, 'cloudy-2-day')).toBe('p-brokenclouds-day.png');
    expect(file(el, 'cloudy-3-day')).toBe('p-mostlycloudy-day.png');
    expect(file(el, 'cloudy-3-night')).toBe('p-mostlycloudy-night.png');
  });
  it('three levels of rain, three pictures: light, rain, pouring', async () => {
    const el = await card();
    const f = [file(el, 'rainy-1-day'), file(el, 'rainy-2-day'), file(el, 'rainy-3')];
    expect(f).toEqual(['p-lightrain.png', 'p-rain.png', 'p-pouring.png']);
  });
  it('and the pictures are not the same picture under other names', () => {
    const sums = new Map<string, string>();
    for (const n of NAMES) {
      const key = readFileSync(resolve(DIST, `p-${n}.png`)).toString('base64');
      expect(sums.has(key), `${n} is the same file as ${sums.get(key)}`).toBe(false);
      sums.set(key, n);
    }
  });
  it('a name the table has not got looks like its family, and not like a tornado', async () => {
    const el = await card();
    for (const [n, want] of [['cloudy-4-day', 'cloudy'], ['rainy-9-night', 'rain'], ['snowy-7', 'snow'], ['fog-night', 'fog'], ['clear-night', 'clear-night']] as const) {
      expect(el._iconToWcc(n), n).toBe(want);
    }
    expect(el._iconToWcc('tornado')).toBe('exceptional');
    expect(el._iconToWcc('something-new')).toBe('cloudy');   // the custom and the wcc-2 packs have no picture for a name that is not known: the plain cloud
  });
});

describe('broken clouds: a sun or a moon with torn streaks of cloud, for the level of 55 to 85 per cent', () => {
  const file = (el: Card, n: string) => el._getIconUrl(n).split('/').pop()!.split('?')[0];
  it('the second level of the sky is the broken clouds, by day and by night', async () => {
    const el = await card();
    expect(file(el, 'cloudy-2-day')).toBe('p-brokenclouds-day.png');
    expect(file(el, 'cloudy-2-night')).toBe('p-brokenclouds-night.png');
  });
  it('and so is the condition that a provider calls partly cloudy: the card names both cloudy-2, and they are the same sky', async () => {
    const el = await card();
    expect(el._weatherIcon('partlycloudy')).toBe('cloudy-2-day');
    expect(file(el, el._weatherIcon('partlycloudy'))).toBe('p-brokenclouds-day.png');
  });
  it('the levels on each side of it are what they were', async () => {
    const el = await card();
    expect(file(el, 'cloudy-1-day')).toBe('p-mostlysunny-day.png');
    expect(file(el, 'cloudy-3-night')).toBe('p-mostlycloudy-night.png');
  });
  it('the custom pack has no such picture, and keeps its fifteen names: the second level is still partly cloudy there', async () => {
    const el = await card();
    expect(el._iconToWcc('cloudy-2-day')).toBe('partlycloudy-day');
    expect(el._iconToWcc('cloudy-2-night')).toBe('partlycloudy-night');
  });
});

describe('the strange conditions each have a picture of their own, and only the exceptional one is alarming', () => {
  const file = (el: Card, n: string) => el._getIconUrl(n).split('/').pop()!.split('?')[0];
  it('exceptional, a tropical storm, dust and a name that is not known are four different pictures', async () => {
    const el = await card();
    expect(file(el, 'exceptional')).toBe('p-exceptional.png');
    expect(file(el, 'tropical-storm')).toBe('p-tropical-storm.png');
    expect(file(el, 'dust')).toBe('p-dust.png');
    expect(file(el, 'unknown')).toBe('p-unknown.png');
  });
  it('the revision of the pack was raised when the exceptional picture was changed, so that a phone does not keep the vortex for a month', async () => {
    const el = await card();
    expect(Number(/\?r=(\d+)$/.exec(el._getIconUrl('exceptional'))![1])).toBeGreaterThanOrEqual(6);
  });
  it('a tornado, a hurricane and an exceptional condition are the exceptional picture', async () => {
    const el = await card();
    for (const n of ['exceptional', 'tornado', 'hurricane']) expect(file(el, n), n).toBe('p-exceptional.png');
  });
  it('a name that nobody has heard of is the picture of the unknown, and not the exceptional one', async () => {
    const el = await card();
    for (const n of ['something-new', 'qwerty-day', 'xyz', '']) expect(file(el, n), JSON.stringify(n)).toBe('p-unknown.png');
  });
  it('and a name that is new in a family that the card knows is still that family', async () => {
    const el = await card();
    expect(file(el, 'cloudy-4-day')).toBe('p-cloudy.png');
    expect(file(el, 'rainy-9-night')).toBe('p-rain.png');
    expect(file(el, 'snowy-7')).toBe('p-snow.png');
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
