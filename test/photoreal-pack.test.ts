import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { resolve } from 'path';
import '../src/platinum-weather-card';
import '../src/editor';
import { render } from 'lit';
import { makeHass, baseConfig, renderCard } from './helpers';

// The photoreal pack: WebP pictures with a transparent background, kept in icons/photoreal and shipped in one module beside the
// card (dist/icons-photoreal.js, #41; they were PNGs, a flat file each, until 2.7), named p-<name>.webp: the fifteen names the custom pack asks for, and five more for
// the levels of the sky and of the rain, which the custom pack does not ask for, and three for what is not a tornado and was drawn as one (a tropical storm, dust, a name
// that is not known).

const DIST = resolve(__dirname, '../icons/photoreal');
const NAMES = ['clear-day', 'clear-night', 'partlycloudy-day', 'partlycloudy-night', 'cloudy', 'fog', 'rain', 'pouring',
  'snow', 'sleet', 'hail', 'lightning', 'lightning-rain', 'wind', 'exceptional',
  'mostlysunny-day', 'mostlysunny-night', 'mostlycloudy-day', 'mostlycloudy-night', 'lightrain',
  'tropical-storm', 'dust', 'unknown', 'brokenclouds-day', 'brokenclouds-night'];

type Card = HTMLElement & { _getIconUrl: (n: string, f?: boolean) => string; _weatherIcon: (c: string) => string; _iconToWcc: (n: string) => string; _iconToPhotoreal?: (n: string, m?: boolean) => string };

async function card(config: Record<string, unknown> = {}) {
  return (await renderCard(baseConfig({ icon_pack: 'photoreal', ...config } as never), makeHass({ 'weather.home': { state: 'cloudy' } }))) as unknown as Card;
}

// A WebP of a picture with a transparent background is RIFF....WEBP with a VP8X chunk, whose flags carry the alpha bit
// and whose canvas is 24 bits of width less one and 24 of height less one.
function webp(n: string) {
  const b = readFileSync(resolve(DIST, `p-${n}.webp`));
  return { b, riff: b.subarray(0, 4).toString('latin1'), kind: b.subarray(8, 12).toString('latin1'), chunk: b.subarray(12, 16).toString('latin1'),
    alpha: (b[20] & 0x10) !== 0, w: 1 + b.readUIntLE(24, 3), h: 1 + b.readUIntLE(27, 3) };
}

describe('the files', () => {
  it('there are twenty-five, each p-<name>.webp, in icons/photoreal, which the build puts in the module of the pack', () => {
    for (const n of NAMES) expect(existsSync(resolve(DIST, `p-${n}.webp`)), `p-${n}.webp`).toBe(true);
    expect(readdirSync(DIST).filter((f) => /^p-.*\.webp$/.test(f)).sort()).toEqual(NAMES.map((n) => `p-${n}.webp`).sort());
  });
  it('each is a real WebP with an alpha channel: a picture that has a background of its own is not an icon', () => {
    for (const n of NAMES) {
      const f = webp(n);
      expect([f.riff, f.kind], n).toEqual(['RIFF', 'WEBP']);
      expect(f.chunk, `${n}: an extended WebP, which is the one that can carry an alpha channel`).toBe('VP8X');
      expect(f.alpha, `${n}: the alpha bit`).toBe(true);
    }
  });
  it('each is square, and not so large that the card is slow to start', () => {
    for (const n of NAMES) {
      const f = webp(n);
      expect(f.w, n).toBe(f.h);
      expect(f.w, n).toBeGreaterThanOrEqual(256);
      expect(f.w, n).toBeLessThanOrEqual(512);
      expect(statSync(resolve(DIST, `p-${n}.webp`)).size / 1024, `${n} in KB`).toBeLessThan(60);
    }
    const total = NAMES.reduce((s, n) => s + statSync(resolve(DIST, `p-${n}.webp`)).size, 0) / 1024 / 1024;
    // they were 2.3 MB as PNGs
    expect(total, 'all of them, in MB').toBeLessThan(0.75);
  });
});

describe('the pack in the card', () => {
  it('is a picture beside the card, named after the condition', async () => {
    const el = await card();
    expect(el._getIconUrl('clear-day')).toMatch(/\/p-clear-day\.webp$/);
    expect(el._getIconUrl('rainy-3-day')).toMatch(/\/p-rain\.webp$/);
    expect(el._getIconUrl('rainy-3')).toMatch(/\/p-pouring\.webp$/);
    expect(el._getIconUrl('cloudy-2-night')).toMatch(/\/p-partlycloudy-night\.webp$/);
  });
  it('and is the same place as the card itself, not the Internet and not a path the user has to make', async () => {
    const url = (await card())._getIconUrl('snowy-3');
    expect(url).not.toMatch(/^https?:\/\/(cdn|raw)/);
    expect(url).toMatch(/p-snow\.webp$/);
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
      if (!/^p-.*\.webp$/.test(file) || !existsSync(resolve(DIST, file))) missing.push(`${n} -> ${file}`);
      if (file === 'p-exceptional.webp' && !ON_PURPOSE.has(n)) tornado.push(n);
    }
    expect(missing, 'names that land on a picture that is not there').toEqual([]);
    expect(tornado, 'names that land on the tornado without meaning to').toEqual([]);
  });
  it('the forecast strips use it too', async () => {
    expect((await card())._getIconUrl('rainy-3-day', true)).toMatch(/p-rain\.webp$/);
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
    expect(file(el, 'cloudy-1-day')).toBe('p-mostlysunny-day.webp');
    expect(file(el, 'cloudy-2-day')).toBe('p-partlycloudy-day.webp');
    expect(file(el, 'cloudy-3-day')).toBe('p-mostlycloudy-day.webp');
    expect(file(el, 'cloudy-3-night')).toBe('p-mostlycloudy-night.webp');
  });
  it('three levels of rain, three pictures: light, rain, pouring', async () => {
    const el = await card();
    const f = [file(el, 'rainy-1-day'), file(el, 'rainy-2-day'), file(el, 'rainy-3')];
    expect(f).toEqual(['p-lightrain.webp', 'p-rain.webp', 'p-pouring.webp']);
  });
  it('and the pictures are not the same picture under other names', () => {
    const sums = new Map<string, string>();
    for (const n of NAMES) {
      const key = readFileSync(resolve(DIST, `p-${n}.webp`)).toString('base64');
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

describe('broken clouds: a sun or a moon with torn streaks of cloud, for the sky that the sensors measure at 55 to 85 per cent', () => {
  const file = (el: Card, n: string, forecast = false) => el._getIconUrl(n, forecast).split('/').pop()!.split('?')[0];
  it('what a provider calls partly cloudy is the partly cloudy picture, a sun with a cloud, and so is a forecast of it', async () => {
    const el = await card();
    expect(el._weatherIcon('partlycloudy')).toBe('cloudy-2-day');
    expect(file(el, el._weatherIcon('partlycloudy'))).toBe('p-partlycloudy-day.webp');
    expect(file(el, 'cloudy-2-day', true)).toBe('p-partlycloudy-day.webp');
    expect(el._getIconUrl('cloudy-2-night', true, true).split('/').pop()!.split('?')[0]).toBe('p-partlycloudy-night.webp');   // an hour that is night, in a forecast
  });
  it('the levels on each side of it are what they were', async () => {
    const el = await card();
    expect(file(el, 'cloudy-1-day')).toBe('p-mostlysunny-day.webp');
    expect(file(el, 'cloudy-3-night')).toBe('p-mostlycloudy-night.webp');
  });
  it('the custom pack has no such picture, and keeps its fifteen names: the second level is partly cloudy there', async () => {
    const el = await card();
    expect(el._iconToWcc('cloudy-2-day')).toBe('partlycloudy-day');
    expect(el._iconToWcc('cloudy-2-night')).toBe('partlycloudy-night');
  });
  it('the table of the pack has the broken clouds under their own names, for the sky that was measured', async () => {
    const c = (await card()) as Card & { _iconToPhotoreal: (n: string, measured?: boolean) => string };
    expect(c._iconToPhotoreal('cloudy-2-day', true)).toBe('brokenclouds-day');
    expect(c._iconToPhotoreal('cloudy-2-night', true)).toBe('brokenclouds-night');
    expect(c._iconToPhotoreal('cloudy-2-day', false)).toBe('partlycloudy-day');
    expect(c._iconToPhotoreal('cloudy-1-day', true)).toBe('mostlysunny-day');
    expect(c._iconToPhotoreal('cloudy-3-day', true)).toBe('mostlycloudy-day');
  });
});

describe('the strange conditions each have a picture of their own, and only the exceptional one is alarming', () => {
  const file = (el: Card, n: string) => el._getIconUrl(n).split('/').pop()!.split('?')[0];
  it('exceptional, a tropical storm, dust and a name that is not known are four different pictures', async () => {
    const el = await card();
    expect(file(el, 'exceptional')).toBe('p-exceptional.webp');
    expect(file(el, 'tropical-storm')).toBe('p-tropical-storm.webp');
    expect(file(el, 'dust')).toBe('p-dust.webp');
    expect(file(el, 'unknown')).toBe('p-unknown.webp');
  });
  it('a tornado, a hurricane and an exceptional condition are the exceptional picture', async () => {
    const el = await card();
    for (const n of ['exceptional', 'tornado', 'hurricane']) expect(file(el, n), n).toBe('p-exceptional.webp');
  });
  it('a name that nobody has heard of is the picture of the unknown, and not the exceptional one', async () => {
    const el = await card();
    for (const n of ['something-new', 'qwerty-day', 'xyz', '']) expect(file(el, n), JSON.stringify(n)).toBe('p-unknown.webp');
  });
  it('and a name that is new in a family that the card knows is still that family', async () => {
    const el = await card();
    expect(file(el, 'cloudy-4-day')).toBe('p-cloudy.webp');
    expect(file(el, 'rainy-9-night')).toBe('p-rain.webp');
    expect(file(el, 'snowy-7')).toBe('p-snow.webp');
  });
});

describe('pictures that change without changing their names', () => {
  // Home Assistant serves the files beside a card with a cache of 31 days (max-age=2678400, seen on 23 October), so a phone that has
  // an old picture keeps it for a month unless the address changes. Until 2.7 a revision of the pack was in the address of each
  // picture; now the pack is one module, and the version of the card is in its address (#41): a new version is a new address.
  it('the pack is asked for with the version of the card in its address', async () => {
    const { packUrl } = await import('../src/icon-packs');
    const { CARD_VERSION } = await import('../src/const');
    expect(packUrl('/local/community/x/', 'photoreal', CARD_VERSION)).toBe(`/local/community/x/icons-photoreal.js?v=${encodeURIComponent(CARD_VERSION)}`);
  });
  it('and the address of a picture names the file and nothing else, the same way for every picture', async () => {
    const el = await card();
    for (const n of ['clear-day', 'clear-night', 'cloudy-1-day']) expect(el._getIconUrl(n), n).toMatch(/\/p-[a-z-]+\.webp$/);
  });
});

describe('the choice in the editor', () => {
  type Editor = HTMLElement & { setConfig: (c: unknown) => void; hass: unknown; updateComplete: Promise<unknown>; _topicAppearance: () => unknown };
  it('is offered in Appearance, among the packs', async () => {
    const el = document.createElement('platinum-weather-card-plus-charts-editor') as Editor;
    el.setConfig({ card_config_version: 8, weather_entity: 'weather.home', icon_pack: 'photoreal' });
    el.hass = makeHass({ 'weather.home': { state: 'cloudy' } });
    document.body.appendChild(el);
    await el.updateComplete;
    const box = document.createElement('div'); render(el._topicAppearance() as never, box);
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
