import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { join, resolve } from 'path';
import '../src/platinum-weather-card';
import { makeHass, baseConfig, renderCard } from './helpers';
import { iconData, packUrl, packOf, BLANK, RETRY_MS, _setLoader, _forgetPacks } from '../src/icon-packs';
import { CARD_VERSION } from '../src/const';
// @ts-expect-error a script of the build, in JavaScript
import { buildPack } from '../scripts/build-icons.mjs';

// A release carried 136 files, one picture each, because the Marketplace installs a card from the files of its release one by one
// (#41). Each built-in pack is one module now, dist/icons-<pack>.js, made by scripts/build-icons.mjs from icons/<pack>/, and a card
// loads only the pack it shows: a transparent pixel until it has come, the picture after. The address of a picture (_getIconUrl)
// still names its file; a CDN pack or a custom path is an address as it was.

const ROOT = resolve(__dirname, '..');
const files = (pack: string) => readdirSync(join(ROOT, 'icons', pack)).sort();

describe('the modules the build makes', () => {
  it('one entry for every picture of the folder, by the name the card has always used', () => {
    expect(Object.keys(buildPack('animated'))).toEqual(files('animated'));
    expect(Object.keys(buildPack('static'))).toEqual(files('static'));
    expect(Object.keys(buildPack('photoreal'))).toEqual(files('photoreal'));
    expect(files('animated').length).toBe(54);
    expect(files('static').length).toBe(54);
    expect(files('photoreal').length).toBe(25);
  });
  it('an SVG goes in as text, and comes out as the file it was', () => {
    for (const [file, uri] of Object.entries(buildPack('animated') as Record<string, string>)) {
      expect(uri.startsWith('data:image/svg+xml;charset=utf-8,'), file).toBe(true);
      const body = uri.slice('data:image/svg+xml;charset=utf-8,'.length);
      // nothing that would end the URI, the attribute or the CSS around it
      expect(body, file).not.toMatch(/[#"\n]/);
      expect(decodeURIComponent(body), file).toBe(readFileSync(join(ROOT, 'icons', 'animated', file), 'utf8'));
    }
  });
  it('a WebP goes in as base64, and comes out as the file it was', () => {
    for (const [file, uri] of Object.entries(buildPack('photoreal') as Record<string, string>)) {
      expect(uri.startsWith('data:image/webp;base64,'), file).toBe(true);
      expect(Buffer.from(uri.split(',')[1], 'base64').equals(readFileSync(join(ROOT, 'icons', 'photoreal', file))), file).toBe(true);
    }
  });
  it('and no picture is left in dist: the release is the card and its three packs', () => {
    expect(readdirSync(join(ROOT, 'dist')).filter((f) => /\.(svg|png|webp)$/.test(f))).toEqual([]);
  });
});

describe('loading a pack', () => {
  let asked: string[];
  let answer: (url: string) => Promise<{ default: Record<string, string> }>;
  beforeEach(() => {
    _forgetPacks(); asked = [];
    answer = async () => ({ default: { 'a-clear-day.svg': 'data:image/svg+xml,SUN' } });
    _setLoader((url) => { asked.push(url); return answer(url); });
  });
  afterEach(() => _forgetPacks());

  it('knows which pack a file is of, and a file of none is no business of its', () => {
    expect([packOf('a-clear-day.svg'), packOf('s-rainy-3.svg'), packOf('p-rain.webp'), packOf('fire-ban-black.svg')]).toEqual(['animated', 'static', 'photoreal', null]);
    expect(iconData('/b/', 'something.svg', CARD_VERSION, () => undefined)).toBeNull();
    expect(asked).toEqual([]);
  });
  it('a transparent pixel until the pack comes, the picture after, and the card is told', async () => {
    let told = 0;
    expect(iconData('/b/', 'a-clear-day.svg', CARD_VERSION, () => told++)).toBe(BLANK);
    await new Promise((r) => setTimeout(r, 0));
    expect(told).toBe(1);
    expect(iconData('/b/', 'a-clear-day.svg', CARD_VERSION, () => told++)).toBe('data:image/svg+xml,SUN');
    expect(asked).toEqual([packUrl('/b/', 'animated', CARD_VERSION)]);
    expect(asked[0]).toBe(`/b/icons-animated.js?v=${encodeURIComponent(CARD_VERSION)}`);
  });
  it('is asked for once, however many icons wait for it', async () => {
    for (let i = 0; i < 5; i++) iconData('/b/', 'a-clear-day.svg', CARD_VERSION, () => undefined);
    await new Promise((r) => setTimeout(r, 0));
    expect(asked.length).toBe(1);
  });
  it('a picture the pack has not got is the transparent pixel, not a broken image', async () => {
    iconData('/b/', 'a-clear-day.svg', CARD_VERSION, () => undefined);
    await new Promise((r) => setTimeout(r, 0));
    expect(iconData('/b/', 'a-nothing.svg', CARD_VERSION, () => undefined)).toBe(BLANK);
  });
  // since the review of 2.7 (finding 5): not at the next redraw, which came at every change of state in the home, but after a pause
  it('a pack that fails to come is asked for again after a pause, not at the next redraw', async () => {
    let calls = 0;
    answer = async () => { calls++; if (calls === 1) throw new Error('offline'); return { default: { 'a-clear-day.svg': 'X' } }; };
    expect(iconData('/b/', 'a-clear-day.svg', CARD_VERSION, () => undefined)).toBe(BLANK);
    await new Promise((r) => setTimeout(r, 0));
    iconData('/b/', 'a-clear-day.svg', CARD_VERSION, () => undefined);
    await new Promise((r) => setTimeout(r, 0));
    expect(calls).toBe(1);
    const realNow = Date.now;
    Date.now = () => realNow() + RETRY_MS + 1;
    try {
      iconData('/b/', 'a-clear-day.svg', CARD_VERSION, () => undefined);
      await new Promise((r) => setTimeout(r, 0));
    } finally { Date.now = realNow; }
    expect(calls).toBe(2);
    expect(iconData('/b/', 'a-clear-day.svg', CARD_VERSION, () => undefined)).toBe('X');
  });
});

describe('the card', () => {
  afterEach(() => _forgetPacks());
  type Card = HTMLElement & { updateComplete: Promise<unknown> };
  const hass = () => makeHass({ 'weather.home': { state: 'sunny' }, 'sun.sun': { state: 'above_horizon', attributes: { elevation: 30 } } });
  it('draws the picture of its pack once the pack has come', async () => {
    _forgetPacks();
    const asked: string[] = [];
    _setLoader(async (url) => { asked.push(url); return { default: Object.fromEntries(files('animated').map((f) => [f, `data:image/svg+xml,${f}`])) }; });
    const el = (await renderCard(baseConfig({ weather_entity: 'weather.home', entity_sun: 'sun.sun', section_order: ['overview'] } as never), hass())) as Card;
    await new Promise((r) => setTimeout(r, 0)); await el.updateComplete;
    const img = el.shadowRoot!.querySelector('.big-icon img')!;
    expect(img.getAttribute('data-icon')).toMatch(/\/a-clear-day\.svg$/);
    expect(img.getAttribute('src')).toBe('data:image/svg+xml,a-clear-day.svg');
    expect(asked.length).toBe(1);
  });
  it('a pack from a CDN, or a path of the user\'s own, is the address it was, and loads no module', async () => {
    _forgetPacks();
    const asked: string[] = [];
    _setLoader(async (url) => { asked.push(url); return { default: {} }; });
    const cdn = (await renderCard(baseConfig({ weather_entity: 'weather.home', icon_pack: 'meteocons-fill', section_order: ['overview'] } as never), hass())) as Card;
    expect(cdn.shadowRoot!.querySelector('.big-icon img')!.getAttribute('src')).toMatch(/^https:\/\/cdn\.jsdelivr\.net\/.*\.svg$/);
    const own = (await renderCard(baseConfig({ weather_entity: 'weather.home', icon_pack: 'custom', icon_pack_path: '/local/mine/{condition}.png', section_order: ['overview'] } as never), hass())) as Card;
    expect(own.shadowRoot!.querySelector('.big-icon img')!.getAttribute('src')).toMatch(/^\/local\/mine\/[a-z-]+\.png$/);
    expect(asked).toEqual([]);
  });
});
