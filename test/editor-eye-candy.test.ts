import { describe, it, expect, afterEach } from 'vitest';
import { render } from 'lit';
import { readFileSync } from 'fs';
import { join } from 'path';
import '../src/platinum-weather-card';
import '../src/editor';
import { makeHass, choice } from './helpers';
import { _setLoader, _forgetPacks } from '../src/icon-packs';

// The editor of 2.7, made pleasanter to look at ("eye candy for everyone"): the topics on tiles of their own colour, a section that is off
// dimmed, and the icon pack, the effects, their place and the style of the warnings chosen by pressing a picture instead of from a list.
// Nothing in the configuration changes: the same keys, the same values.

type Editor = HTMLElement & {
  setConfig: (c: unknown) => void; hass: unknown; updateComplete: Promise<unknown>; _config: Record<string, unknown>;
  _topicAppearance: () => unknown; _topicWarnings: () => unknown; _editSubmenu: (e: unknown) => void;
};
async function editor(config: Record<string, unknown> = {}) {
  const el = document.createElement('platinum-weather-card-plus-charts-editor') as Editor;
  el.setConfig({ card_config_version: 8, weather_entity: 'weather.home', ...config });
  el.hass = makeHass({ 'weather.home': { state: 'cloudy' } });
  document.body.appendChild(el); await el.updateComplete;
  return el;
}
function written(el: Editor, act: () => void): Record<string, unknown> | undefined {
  let out: Record<string, unknown> | undefined;
  const f = (e: Event) => { out = (e as CustomEvent).detail.config; };
  el.addEventListener('config-changed', f); act(); el.removeEventListener('config-changed', f);
  return out;
}
// a page drawn apart from the editor, with the editor as the host of its events, as it is when the editor draws it
const draw = (el: Editor, t: unknown) => { const box = document.createElement('div'); render(t as never, box, { host: el }); return box; };
const SRC = readFileSync(join(__dirname, '..', 'src', 'editor.ts'), 'utf8');

describe('the first screen', () => {
  it('each topic has its icon on a tile', async () => {
    const el = await editor();
    const rows = [...el.shadowRoot!.querySelectorAll('.topic-row')];
    expect(rows.length).toBe(5);
    for (const r of rows) expect(r.querySelector('.topic-tile ha-icon'), r.getAttribute('data-topic') ?? '').toBeTruthy();
  });
  it('of five colours, none of them purple, each dark enough for its white icon', () => {
    const colours: Record<string, string> = {};
    for (const m of SRC.matchAll(/\.topic-row\[data-topic="(topic_[a-z_]+)"\] \.topic-tile \{ background: (#[0-9a-f]{6}); \}/g)) colours[m[1]] = m[2];
    expect(Object.keys(colours).sort()).toEqual(['topic_appearance', 'topic_card', 'topic_local_forecast', 'topic_sky', 'topic_warnings']);
    expect(new Set(Object.values(colours)).size).toBe(5);
    const lum = (hex: string) => {
      const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
      return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
    };
    const hue = (hex: string) => {
      const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
      const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
      if (d === 0) return -1;
      const h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
      return (h * 60 + 360) % 360;
    };
    for (const [t, c] of Object.entries(colours)) {
      expect(hue(c) >= 260 && hue(c) <= 320, `${t} ${c} is purple`).toBe(false);
      // an icon is a graphic: 3 to 1 against white
      expect((1.05) / (lum(c) + 0.05), `${t} ${c} against its white icon`).toBeGreaterThanOrEqual(3);
    }
  });
  it('a section that is off is dimmed; its switch and its pencil are not', async () => {
    const el = await editor({ show_section_extended: false });
    const rows = [...el.shadowRoot!.querySelectorAll('.section-row')];
    // the extended section, switched off here, and the hours, which are off until they are switched on
    const off = rows.filter((r) => r.classList.contains('off')).map((r) => [...r.classList].find((c) => c.startsWith('edit-')));
    expect(off.sort()).toEqual(['edit-extended-section', 'edit-hourly-forecast-section']);
    expect(rows.find((r) => r.classList.contains('edit-overview-section'))!.classList.contains('off')).toBe(false);
    expect(SRC).toMatch(/\.section-row\.off \.section-icon,\s*\.section-row\.off \.title-stack,\s*\.section-row\.off \.down-icon,\s*\.section-row\.off \.up-icon \{\s*opacity: 0\.45;/);
  });
});

describe('the icon packs, as pictures', () => {
  afterEach(() => _forgetPacks());
  it('one for each pack, in the order of the list they replace, and the chosen one pressed', async () => {
    const el = await editor({ icon_pack: 'photoreal' });
    const c = choice(draw(el, el._topicAppearance()), 'icon_pack')!;
    expect(c.values).toEqual(['default', 'photoreal', 'meteocons-fill', 'meteocons-line', 'ha-official', 'wcc-2', 'custom']);
    expect(c.value).toBe('photoreal');
  });
  it('each shows its own partly cloudy day: the built-in from their modules, the others from where the card takes them', async () => {
    _forgetPacks();
    _setLoader(async (url) => ({ default: url.includes('icons-photoreal') ? { 'p-partlycloudy-day.webp': 'data:image/webp;base64,P' } : { 'a-cloudy-2-day.svg': 'data:image/svg+xml,A', 's-cloudy-2-day.svg': 'data:image/svg+xml,S' } }));
    const el = await editor();
    draw(el, el._topicAppearance()); await new Promise((r) => setTimeout(r, 0)); await el.updateComplete;
    const box = draw(el, el._topicAppearance());
    const src = (v: string) => choice(box, 'icon_pack')!.button(v)!.querySelector('img')?.getAttribute('src');
    expect(src('default')).toBe('data:image/svg+xml,A');
    expect(src('photoreal')).toBe('data:image/webp;base64,P');
    expect(src('meteocons-fill')).toMatch(/basmilius\/weather-icons\/production\/fill\/all\/partly-cloudy-day\.svg$/);
    expect(src('ha-official')).toMatch(/scinos\/lovelace-weather-icons@main\/svg\/partlycloudy\.svg$/);
    expect(src('wcc-2')).toBe('/hacsfiles/weather-chart-card/icons2/partlycloudy-day.svg');
    expect(choice(box, 'icon_pack')!.button('custom')!.querySelector('img')).toBeNull();
  });
  it('a press on the picture inside the button chooses the pack', async () => {
    const el = await editor();
    const box = draw(el, el._topicAppearance());
    const img = choice(box, 'icon_pack')!.button('photoreal')!.querySelector('img') as HTMLElement;
    expect(written(el, () => img.click())?.icon_pack).toBe('photoreal');
  });
  it('the custom pack still asks for its path', async () => {
    const el = await editor({ icon_pack: 'custom' });
    const box = draw(el, el._topicAppearance());
    expect([...box.querySelectorAll('ha-input')].some((x) => (x as unknown as { configValue: string }).configValue === 'icon_pack_path')).toBe(true);
  });
});

describe('the static icons, of the default pack only', () => {
  const row = (box: Element) => [...box.querySelectorAll('.toggle-row')].find((r) => (r.querySelector('.pwc-switch') as unknown as { value?: string } | null)?.value === 'option_static_icons') as HTMLElement;
  it('can be switched with the default pack', async () => {
    const el = await editor();
    const r = row(draw(el, el._topicAppearance()));
    expect(r.classList.contains('disabled')).toBe(false);
    expect(written(el, () => (r.querySelector('.pwc-switch') as HTMLElement).click())).toBeTruthy();
  });
  it('are greyed, and do nothing, with any other', async () => {
    const el = await editor({ icon_pack: 'photoreal' });
    const r = row(draw(el, el._topicAppearance()));
    expect(r.classList.contains('disabled')).toBe(true);
    expect(written(el, () => (r.querySelector('.pwc-switch') as HTMLElement).click())).toBeUndefined();
  });
});

describe('the effects and the warnings, as pictures', () => {
  it('a press sets how much of the effects, and where', async () => {
    const el = await editor();
    const box = draw(el, el._topicAppearance());
    expect(written(el, () => choice(box, 'option_effects')!.button('subtle')!.click())?.option_effects).toBe('subtle');
    expect(written(el, () => choice(box, 'option_effects_area')!.button('card')!.click())?.option_effects_area).toBe('card');
  });
  it('the effects show a picture for each setting', async () => {
    const el = await editor();
    const c = choice(draw(el, el._topicAppearance()), 'option_effects')!;
    for (const v of ['off', 'subtle', 'full']) expect(c.button(v)!.querySelector('svg'), v).toBeTruthy();
  });
  it('a press on the classic picture sets the classic style', async () => {
    const el = await editor();
    const box = draw(el, el._topicWarnings());
    expect(choice(box, 'option_warning_style')!.value).toBe('soft');
    expect(written(el, () => choice(box, 'option_warning_style')!.button('classic')!.click())?.option_warning_style).toBe('classic');
  });
});

describe('seen in Home Assistant on beta.5', () => {
  it('a hint wraps to a second line rather than being cut beside the arrows', () => {
    const rule = /\.row-summary \{([^}]*)\}/.exec(SRC)![1];
    expect(rule).not.toMatch(/white-space:\s*nowrap/);
    expect(rule).toMatch(/-webkit-line-clamp:\s*2/);
  });
  it('the effects are not named twice, by the heading of their group and by a label under it', async () => {
    const el = await editor();
    const box = draw(el, el._topicAppearance());
    const labels = [...box.querySelectorAll('label.label')].map((l) => l.textContent?.trim());
    const groups = [...box.querySelectorAll('.group-heading')].map((h) => h.textContent?.trim());
    expect(groups).toContain(el.shadowRoot ? (groups.find((g) => /effect|ефект/i.test(g ?? '')) ?? groups[1]) : '');
    for (const g of groups) expect(labels, `"${g}" twice`).not.toContain(g);
  });
});
