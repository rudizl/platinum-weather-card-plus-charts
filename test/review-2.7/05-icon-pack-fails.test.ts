// Находка 5: пакет с икони, който не се зареди.
import { describe, it, expect } from 'vitest';
import { Any, clean, makeHass, baseConfig, renderCard } from './_util';
import { _setLoader, iconData, BLANK } from '../../src/icon-packs';
clean();

const hass = () => makeHass({ 'sensor.c': { state: 'sunny' }, 'sun.sun': { state: 'above_horizon' } });

describe('5. a pack that does not load', () => {
  it('is not asked for again at every redraw of the card', async () => {
    let asked = 0;
    _setLoader(async () => { asked++; throw new Error('404'); });
    const el = (await renderCard(baseConfig({ entity_forecast_icon: 'sensor.c' } as never), hass())) as Any;
    for (let i = 0; i < 20; i++) { el.hass = hass(); await el.updateComplete; await new Promise((r) => setTimeout(r, 0)); }
    // 21 redraws in a few milliseconds: a retry now and then, not one request each
    expect(asked).toBeLessThanOrEqual(3);
  });
  it('and the card says so: something other than an invisible picture and no word', async () => {
    _setLoader(async () => { throw new Error('404'); });
    const el = (await renderCard(baseConfig({ entity_forecast_icon: 'sensor.c' } as never), hass())) as Any;
    await new Promise((r) => setTimeout(r, 5)); el.hass = hass(); await el.updateComplete;
    const img = el.shadowRoot.querySelector('.overview-section img');
    const silent = img?.getAttribute('src') === BLANK && el.shadowRoot.querySelectorAll('.config-warning, .unknown-forecast').length === 0;
    expect(silent).toBe(false);
  });
  // it is a failure like any other: said by the card, and asked for again after the pause (not at once, as every failure)
  it('a module without a default export is not remembered as a pack of no pictures', async () => {
    const { failedPacks, RETRY_MS } = await import('../../src/icon-packs');
    let asked = 0;
    _setLoader(async () => { asked++; return {} as never; });
    iconData('/b/', 'a-clear-day.svg', '1', () => undefined);
    await new Promise((r) => setTimeout(r, 0));
    expect(failedPacks()).toEqual(['animated']);
    const realNow = Date.now;
    Date.now = () => realNow() + RETRY_MS + 1;
    try {
      iconData('/b/', 'a-clear-day.svg', '1', () => undefined);
      await new Promise((r) => setTimeout(r, 0));
    } finally { Date.now = realNow; }
    expect(asked).toBe(2);
  });
});

describe('5. and after the pause', () => {
  it('is asked for again, at an address of its own, and the row goes when it comes', async () => {
    const { _setLoader: setLoader, iconData: data, RETRY_MS, failedPacks } = await import('../../src/icon-packs');
    const asked: string[] = [];
    let fail = true;
    setLoader(async (url) => { asked.push(url); if (fail) throw new Error('404'); return { default: { 'a-clear-day.svg': 'data:x' } }; });
    data('/b/', 'a-clear-day.svg', '1', () => undefined);
    await new Promise((r) => setTimeout(r, 0));
    expect(failedPacks()).toEqual(['animated']);
    const realNow = Date.now;
    Date.now = () => realNow() + RETRY_MS + 1;
    try {
      fail = false;
      data('/b/', 'a-clear-day.svg', '1', () => undefined);
      await new Promise((r) => setTimeout(r, 0));
    } finally { Date.now = realNow; }
    expect(asked).toEqual(['/b/icons-animated.js?v=1', '/b/icons-animated.js?v=1&try=1']);
    expect(failedPacks()).toEqual([]);
    expect(data('/b/', 'a-clear-day.svg', '1', () => undefined)).toBe('data:x');
  });
  it('the row of the warning names the file, in every language', async () => {
    const { TRANSLATIONS } = await import('../../src/translations');
    for (const [lang, t] of Object.entries(TRANSLATIONS)) expect((t as { card: Record<string, string> }).card.icons_not_loaded, lang).toContain('{file}');
  });
});
