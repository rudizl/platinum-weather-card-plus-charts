import { describe, it, expect } from 'vitest';
import { render } from 'lit';
import '../src/platinum-weather-card';
import '../src/editor';
import { makeHass } from './helpers';

// Global Options had become a drawer for everything that fitted nowhere else. What decides how the
// card looks, as distinct from what it reads, now has a panel of its own, next to it. The settings
// keep their keys: nothing in anyone's configuration moves, only where the editor puts the control.

type Editor = HTMLElement & {
  setConfig: (c: unknown) => void; hass: unknown; updateComplete: Promise<unknown>;
  _optionGlobalOptionsEditor: () => unknown; _optionAppearanceEditor: () => unknown;
  _editSubmenu: (ev: unknown) => void;
};

async function editor(config: Record<string, unknown> = {}) {
  const el = document.createElement('platinum-weather-card-plus-charts-editor') as Editor;
  el.setConfig({ card_config_version: 8, weather_entity: 'weather.home', ...config });
  el.hass = makeHass({ 'weather.home': { state: 'cloudy' } });
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}
const draw = (t: unknown) => { const box = document.createElement('div'); render(t as never, box); return box; };
// every setting a panel draws, by the key it writes
function keys(box: HTMLElement): string[] {
  const out = new Set<string>();
  for (const e of box.querySelectorAll('*')) {
    const cv = (e as unknown as { configValue?: string }).configValue;
    const v = e.classList.contains('pwc-switch') ? (e as unknown as { value?: string }).value : undefined;
    if (cv) out.add(cv);
    if (v) out.add(v);
  }
  return [...out];
}
const MOVED = ['icon_pack', 'icon_pack_path', 'option_static_icons', 'option_compact_slots', 'option_sun_overrides_icon', 'option_effects', 'option_effects_area'];

describe('the Appearance row', () => {
  it('is in the list, straight after Global Options, and is not a section', async () => {
    const el = await editor();
    const box = draw((el as unknown as { render: () => unknown }).render());
    const rows = [...box.querySelectorAll('.section-flex')];
    const titles = rows.map((r) => (r.querySelector('.section-title')?.textContent ?? '').trim());
    const g = titles.findIndex((t) => /global/i.test(t));
    expect(g).toBe(0);
    expect(titles[1]).toMatch(/appearance/i);
    // like Global Options: no switch, no arrows, one button
    const row = rows[1];
    expect(row.querySelectorAll('ha-icon-button').length).toBe(1);
    expect(row.querySelector('.pwc-switch')).toBeNull();
    expect((row.querySelector('ha-icon-button') as unknown as { value: string }).value).toBe('option_appearance');
  });
  it('opens the panel', async () => {
    const el = await editor();
    el._editSubmenu({ currentTarget: { value: 'option_appearance' } });
    await el.updateComplete;
    const box = draw((el as unknown as { render: () => unknown }).render());
    expect(keys(box)).toEqual(expect.arrayContaining(['icon_pack', 'option_effects']));
    expect(box.querySelector('.back-title')).not.toBeNull();
  });
});

describe('what the Appearance panel holds', () => {
  it('the icons, the density of the slots, and the weather behind the card', async () => {
    const k = keys(draw((await editor())._optionAppearanceEditor()));
    for (const key of ['icon_pack', 'option_static_icons', 'option_compact_slots', 'option_sun_overrides_icon', 'option_effects', 'option_effects_area']) expect(k, key).toContain(key);
  });
  it('and the path of its own, when the icon pack is custom', async () => {
    const plain = keys(draw((await editor())._optionAppearanceEditor()));
    expect(plain).not.toContain('icon_pack_path');
    const custom = keys(draw((await editor({ icon_pack: 'custom' }))._optionAppearanceEditor()));
    expect(custom).toContain('icon_pack_path');
  });
});

describe('what Global Options no longer holds', () => {
  it('none of what moved', async () => {
    const k = keys(draw((await editor({ icon_pack: 'custom' }))._optionGlobalOptionsEditor()));
    for (const key of MOVED) expect(k, `${key} is still in Global Options`).not.toContain(key);
  });
  it('and still holds the rest: the titles, the time and the language, the station and what it corrects, the actions', async () => {
    const box = draw((await editor({ entity_solar_radiation: 'sensor.solar' }))._optionGlobalOptionsEditor());
    const k = keys(box);
    for (const key of ['text_card_title', 'text_card_title_2', 'option_time_format', 'option_locale', 'entity_solar_radiation', 'entity_cloud_cover', 'entity_rain_rate', 'option_cloud_overrides_icon', 'option_cloud_cover_oktas']) expect(k, key).toContain(key);
    expect(box.querySelectorAll('hui-action-editor').length).toBe(3);
  });
});

describe('the settings do not move in the configuration', () => {
  it('a card configured before the move still reads and shows the same values', async () => {
    const el = await editor({ icon_pack: 'meteocons-fill', option_static_icons: true, option_compact_slots: true, option_effects: 'full', option_effects_area: 'card' });
    const box = draw(el._optionAppearanceEditor());
    const sel = (k: string) => ([...box.querySelectorAll('select')].find((s) => (s as unknown as { configValue: string }).configValue === k) as unknown as { value: string }).value;
    expect(sel('icon_pack')).toBe('meteocons-fill');
    expect(sel('option_effects')).toBe('full');
    expect(sel('option_effects_area')).toBe('card');
    const on = [...box.querySelectorAll('.pwc-switch.active')].map((s) => (s as unknown as { value: string }).value);
    expect(on).toEqual(expect.arrayContaining(['option_static_icons', 'option_compact_slots']));
  });
});
