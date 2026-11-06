import { describe, it, expect } from 'vitest';
import { render } from 'lit';
import '../src/platinum-weather-card';
import '../src/editor';
import { makeHass } from './helpers';

// Global Options had become a drawer for everything that fitted nowhere else. What decides how the card looks, as distinct from what it reads, got a panel of its
// own next to it in 2.6, and in 2.7 it is the first of the five pages by topic; Global Options is gone, and what it held is on the pages Card and language and Sky
// and rain from sensors, with the actions in the interactions at the bottom of the first screen. The settings keep their keys: nothing in anyone's configuration
// moves, only where the editor puts the control.

type Editor = HTMLElement & {
  setConfig: (c: unknown) => void; hass: unknown; updateComplete: Promise<unknown>;
  _topicAppearance: () => unknown; _topicCard: () => unknown; _topicSky: () => unknown;
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

describe('the Appearance topic', () => {
  it('is the first of the topics on the first screen, and is not a section', async () => {
    const el = await editor();
    const box = draw((el as unknown as { render: () => unknown }).render());
    const topics = [...box.querySelectorAll('.topic-row')];
    expect((topics[0] as unknown as { value: string }).value).toBe('topic_appearance');
    expect(topics[0].textContent).toMatch(/appearance/i);
    // a topic: no switch and no arrows
    expect(topics[0].querySelector('.pwc-switch')).toBeNull();
    expect(topics[0].querySelector('ha-icon-button')).toBeNull();
  });
  it('opens its page', async () => {
    const el = await editor();
    el._editSubmenu({ currentTarget: { value: 'topic_appearance' } });
    await el.updateComplete;
    const box = draw((el as unknown as { render: () => unknown }).render());
    expect(keys(box)).toEqual(expect.arrayContaining(['icon_pack', 'option_effects']));
    expect(box.querySelector('.back-title')).not.toBeNull();
  });
  it('and the name of 2.6 still leads to it', async () => {
    const el = await editor();
    el._editSubmenu({ currentTarget: { value: 'option_appearance' } });
    await el.updateComplete;
    expect(keys(draw((el as unknown as { render: () => unknown }).render()))).toContain('icon_pack');
  });
});

describe('what the Appearance page holds', () => {
  it('the icons, the density of the slots, and the weather behind the card', async () => {
    const k = keys(draw((await editor())._topicAppearance()));
    for (const key of ['icon_pack', 'option_static_icons', 'option_compact_slots', 'option_sun_overrides_icon', 'option_effects', 'option_effects_area']) expect(k, key).toContain(key);
  });
  it('and the path of its own, when the icon pack is custom', async () => {
    const plain = keys(draw((await editor())._topicAppearance()));
    expect(plain).not.toContain('icon_pack_path');
    const custom = keys(draw((await editor({ icon_pack: 'custom' }))._topicAppearance()));
    expect(custom).toContain('icon_pack_path');
  });
});

describe('Global Options is gone, and what it held is in three places', () => {
  it('Card and language: the titles, the time and the language, and none of what is about the look', async () => {
    const k = keys(draw((await editor({ icon_pack: 'custom' }))._topicCard()));
    for (const key of ['text_card_title', 'text_card_title_2', 'option_time_format', 'option_locale']) expect(k, key).toContain(key);
    for (const key of MOVED) expect(k, `${key} is on Card and language`).not.toContain(key);
  });
  it('Sky and rain from sensors: the station and what it corrects', async () => {
    const k = keys(draw((await editor({ entity_solar_radiation: 'sensor.solar' }))._topicSky()));
    for (const key of ['entity_solar_radiation', 'entity_cloud_cover', 'entity_rain_rate', 'option_cloud_overrides_icon', 'option_cloud_cover_oktas']) expect(k, key).toContain(key);
  });
  it('the actions: at the bottom of the first screen, in the interactions', async () => {
    const box = draw(((await editor()) as unknown as { render: () => unknown }).render());
    expect(box.querySelectorAll('.interactions hui-action-editor').length).toBe(3);
  });
});

describe('the settings do not move in the configuration', () => {
  it('a card configured before the move still reads and shows the same values', async () => {
    const el = await editor({ icon_pack: 'meteocons-fill', option_static_icons: true, option_compact_slots: true, option_effects: 'full', option_effects_area: 'card' });
    const box = draw(el._topicAppearance());
    const sel = (k: string) => ([...box.querySelectorAll('select')].find((s) => (s as unknown as { configValue: string }).configValue === k) as unknown as { value: string }).value;
    expect(sel('icon_pack')).toBe('meteocons-fill');
    expect(sel('option_effects')).toBe('full');
    expect(sel('option_effects_area')).toBe('card');
    const on = [...box.querySelectorAll('.pwc-switch.active')].map((s) => (s as unknown as { value: string }).value);
    expect(on).toEqual(expect.arrayContaining(['option_static_icons', 'option_compact_slots']));
  });
});
