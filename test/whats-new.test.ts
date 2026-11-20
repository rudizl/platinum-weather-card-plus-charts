import { describe, it, expect, beforeEach } from 'vitest';
import '../src/platinum-weather-card';
import '../src/editor';
import { TRANSLATIONS } from '../src/translations';
import { makeHass } from './helpers';

// „Ново в 2.7“: a card at the top of the first screen of the editor while this card lacks the photoreal icons or the weather effects, with
// „Опитай“ (turns on what is missing, in the editor only), „Върни“ (puts both back as they were) and „Не показвай повече“ (remembered in
// this browser, under a key with the version). And „Ново“ beside the new settings of 2.7, with a count on the rows that hold them.

// The tests run without a page origin, so jsdom gives no localStorage: a small one stands in for it.
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map<string, string>();
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
    getItem: (k: string) => (store.has(k) ? store.get(k)! : null), setItem: (k: string, v: string) => { store.set(k, String(v)); },
    removeItem: (k: string) => { store.delete(k); }, clear: () => store.clear(),
  } });
}

type Editor = HTMLElement & { setConfig: (c: unknown) => void; hass: unknown; updateComplete: Promise<unknown> };
const KEY = 'pwc-whats-new-2.7';

async function editor(config: Record<string, unknown> = {}, language = 'bg') {
  const el = document.createElement('platinum-weather-card-plus-charts-editor') as Editor;
  el.setConfig({ card_config_version: 8, weather_entity: 'weather.home', ...config });
  el.hass = { ...(makeHass({ 'weather.home': { state: 'cloudy' } }) as object), language };
  const fired: Record<string, unknown>[] = [];
  el.addEventListener('config-changed', (e) => fired.push((e as CustomEvent).detail.config));
  document.body.appendChild(el);
  await el.updateComplete;
  return { el, fired, root: el.shadowRoot!, last: () => fired[fired.length - 1] };
}
const card = (root: ShadowRoot) => root.querySelector('.whats-new');
const click = async (el: Editor, root: ShadowRoot, selector: string) => { (root.querySelector(selector) as HTMLElement).click(); await el.updateComplete; };

describe('the card „Ново в 2.7“', () => {
  beforeEach(() => { localStorage.clear(); document.body.innerHTML = ''; });

  it('shows while the card lacks photoreal or the effects, and not when it has both', async () => {
    expect(card((await editor({})).root)).not.toBeNull();
    expect(card((await editor({ icon_pack: 'photoreal' })).root)).not.toBeNull();
    expect(card((await editor({ option_effects: 'full' })).root)).not.toBeNull();
    expect(card((await editor({ icon_pack: 'photoreal', option_effects: 'subtle' })).root)).toBeNull();
  });

  it('„Опитай“ turns on only what is missing, and „Върни“ puts both back as they were', async () => {
    const { el, root, last } = await editor({ icon_pack: 'meteocons-fill' });
    await click(el, root, '.whats-new-primary');
    expect(last()).toMatchObject({ icon_pack: 'photoreal', option_effects: 'subtle' });
    expect(card(root)!.textContent).toContain('Картата вече е с иконите photoreal');
    await click(el, root, '.whats-new-primary');
    expect(last()!.icon_pack).toBe('meteocons-fill');
    expect('option_effects' in last()!).toBe(false);

    const two = await editor({ option_effects: 'full' });
    await click(two.el, two.root, '.whats-new-primary');
    expect(two.last()).toMatchObject({ icon_pack: 'photoreal', option_effects: 'full' });
  });

  it('„Не показвай повече“ hides it in this browser, under a key with the version', async () => {
    const { el, root } = await editor({});
    await click(el, root, '.whats-new-hide');
    expect(card(root)).toBeNull();
    expect(localStorage.getItem(KEY)).toBe('1');
    expect(card((await editor({})).root)).toBeNull();
  });

  it('says it in the language of the editor', async () => {
    const { root } = await editor({}, 'bg');
    expect(card(root)!.textContent).toContain('Ново в 2.7');
    expect(card(root)!.textContent).toContain('„Запазване“');
    expect(card(root)!.textContent).toContain('Не показвай повече');
  });
});

describe('„Ново“ beside the new settings of 2.7', () => {
  beforeEach(() => { localStorage.clear(); document.body.innerHTML = ''; });

  it('counts the new settings on the rows of the first screen', async () => {
    const { root } = await editor({}, 'en');
    const badge = (sel: string) => root.querySelector(`${sel} .badge-new`)?.textContent?.trim() ?? null;
    expect(badge('[data-topic="topic_appearance"]')).toBe('3 new');
    expect(badge('[data-topic="topic_warnings"]')).toBe('2 new');
    expect(badge('[data-topic="topic_local_forecast"]')).toBe('New');
    expect(badge('[data-topic="topic_sky"]')).toBeNull();
    expect(badge('[data-topic="topic_card"]')).toBeNull();
    expect(badge('.edit-slots-section')).toBe('New');
  });

  it('every language has the texts, and only English says them in English', () => {
    const KEYS = ['whats_new_title', 'whats_new_body', 'whats_new_tried', 'whats_new_try', 'whats_new_undo', 'whats_new_hide', 'badge_new', 'badge_new_count'];
    const all = TRANSLATIONS as unknown as Record<string, { editor: Record<string, string> }>;
    for (const [lang, t] of Object.entries(all)) {
      for (const k of KEYS) {
        expect(typeof t.editor[k], `${lang}: ${k}`).toBe('string');
        if (lang !== 'en') expect(t.editor[k], `${lang}: ${k} is English`).not.toBe(all.en.editor[k]);
      }
      expect(t.editor.badge_new_count, `${lang}: {n}`).toContain('{n}');
    }
  });
});
