import { describe, it, expect } from 'vitest';
import { render } from 'lit';
import '../src/platinum-weather-card';
import '../src/editor';
import { makeHass } from './helpers';
import { TRANSLATIONS as LANGS } from '../src/translations';

// The editor had nine blocks on its first screen and 162 settings under them, and a topic was spread over several: the warnings in three places, the fire danger in
// five, the sky in Global Options between the title and the language, the local forecast split between the Overview, the first screen and Global Options (26 October
// 2026). In 2.7 the sections keep their row (a switch, the order, and one page for where their data come from) and everything else is on five pages by topic:
// Appearance, Warnings, Sky and rain from sensors, Local forecast, Card and language. The actions are a group of their own at the bottom of the first screen, as in
// the cards of Home Assistant. No key changes: a configuration written in YAML keeps working, and only where the editor shows a setting moves.

type Editor = HTMLElement & {
  setConfig: (c: unknown) => void; hass: unknown; updateComplete: Promise<unknown>;
  _editSubmenu: (ev: unknown) => void; _goBack: () => void; render: () => unknown; _config: Record<string, unknown>;
};
async function editor(config: Record<string, unknown> = {}) {
  const el = document.createElement('platinum-weather-card-plus-charts-editor') as Editor;
  el.setConfig({ card_config_version: 8, weather_entity: 'weather.home', ...config });
  el.hass = makeHass({ 'weather.home': { state: 'cloudy' }, 'sensor.t': { state: '2026-11-06T10:00:00+02:00', attributes: { device_class: 'timestamp', last: 'x' } },
    'sensor.x': { state: 'text', attributes: { detailed: 'y' } } });
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}
const draw = (t: unknown) => { const box = document.createElement('div'); render(t as never, box); return box; };
function keys(box: HTMLElement): string[] {
  const out = new Set<string>();
  for (const e of box.querySelectorAll('*')) {
    const cv = (e as unknown as { configValue?: string }).configValue;
    const v = e.classList.contains('pwc-switch') ? (e as unknown as { value?: string }).value : undefined;
    const dk = e.getAttribute('data-key');
    if (cv) out.add(cv);
    if (v) out.add(v);
    if (dk) out.add(dk);
  }
  return [...out];
}
async function page(el: Editor, id: string) {
  el._editSubmenu({ currentTarget: { value: id } });
  await el.updateComplete;
  const box = draw(el.render());
  el._goBack(); await el.updateComplete;
  return box;
}
// a configuration that opens every setting that only shows under a condition
const FULL = {
  entity_update_time: 'sensor.t', update_time_use_attr: true, overview_layout: 'complete', daily_forecast_layout: 'vertical', entity_hourly: 'weather.home',
  entity_lightning_distance: 'sensor.ld', entity_solar_radiation: 'sensor.sr', option_local_forecast: true, option_forecast_algorithm: 'sager',
  icon_pack: 'custom', entity_extended: 'sensor.x', extended_use_attr: true, entity_extended_1: 'sensor.x', daily_extended_use_attr: true,
  entity_summary_1: 'sensor.x', summary_1_use_attr: true, entity_pressure: 'sensor.p',
};
// The layout of the days decides two of them: the tooltips are only there across, the fire danger of the days only down. A page is read in both.
const FULL_ACROSS = { ...FULL, daily_forecast_layout: 'horizontal' };
async function keysBoth(id: string): Promise<string[]> {
  const out = new Set<string>();
  for (const cfg of [FULL, FULL_ACROSS]) { const el = await editor(cfg); for (const k of keys(await page(el, id))) out.add(k); }
  return [...out];
}
const PAGES: Record<string, string[]> = {
  section_overview: ['entity_update_time', 'update_time_use_attr', 'update_time_name_attr', 'text_update_time_prefix', 'entity_temperature', 'entity_apparent_temp',
    'entity_forecast_icon', 'entity_summary', 'entity_dew_point', 'option_show_comfort'],
  section_daily_forecast: ['weather_entity', 'forecast_type', 'entity_forecast_icon_1', 'entity_summary_1', 'summary_1_use_attr', 'summary_1_name_attr',
    'entity_forecast_min_1', 'entity_forecast_max_1', 'entity_pop_1', 'entity_pos_1', 'entity_extended_1', 'daily_extended_use_attr', 'daily_extended_name_attr',
    'entity_fire_danger_1', 'daily_forecast_layout', 'daily_forecast_days', 'daily_extended_forecast_days', 'option_tooltips', 'option_show_current_day',
    'option_daily_forecast_date', 'option_show_forecast_pop', 'option_show_forecast_wind'],
  section_hourly_forecast: ['entity_hourly', 'hourly_forecast_hours', 'hourly_forecast_step', 'option_hourly_shade_night', 'option_hourly_precipitation',
    'option_hourly_wind', 'option_hourly_group', 'option_hourly_pop'],
  section_charts: ['option_show_temperature_chart', 'option_show_precipitation_chart'],
  section_extended: ['entity_extended', 'extended_use_attr', 'extended_name_attr', 'entity_todays_uv_forecast', 'entity_todays_fire_danger', 'option_extended_separator'],
  topic_appearance: ['icon_pack', 'icon_pack_path', 'option_static_icons', 'option_compact_slots', 'option_sun_overrides_icon', 'option_effects', 'option_effects_area',
    'forecast_text_alignment', 'overview_layout', 'option_show_overview_decimals', 'option_show_overview_separator', 'option_today_temperature_decimals',
    'option_pressure_decimals', 'option_wind_decimals', 'option_today_rainfall_decimals', 'option_forecast_decimals', 'option_show_gust_in_wind',
    'option_wind_bearing_icon', 'option_moon_icon_only', 'option_slot_tap_more_info'],
  topic_warnings: ['entity_warning', 'entity_lightning_distance', 'entity_lightning_azimuth', 'option_lightning_max_distance', 'option_warning_show_expiry',
    'option_warning_style', 'option_color_fire_danger', 'option_daily_color_fire_danger'],
  topic_sky: ['entity_solar_radiation', 'entity_cloud_cover', 'entity_rain_rate', 'option_cloud_min_elevation_am', 'option_cloud_min_elevation_pm',
    'option_cloud_overrides_icon', 'option_cloud_cover_oktas'],
  topic_local_forecast: ['option_local_forecast', 'option_local_forecast_verbose', 'option_forecast_algorithm', 'entity_wind_bearing_6h', 'option_forecast_altitude',
    'option_trend_window_hours', 'entity_pressure', 'entity_pressure_trend'],
  topic_card: ['text_card_title', 'text_card_title_2', 'option_time_format', 'option_locale', 'option_editor_all_entities'],
};
const SLOTS = ['slot_l1', 'slot_r1', 'slot_l2', 'slot_r2', 'slot_l3', 'slot_r3', 'slot_l4', 'slot_r4', 'slot_l5', 'slot_r5', 'slot_l6', 'slot_r6', 'slot_l7', 'slot_r7', 'slot_l8', 'slot_r8'];
const ACTIONS = ['tap_action', 'hold_action', 'double_tap_action'];
const TOPICS = ['topic_appearance', 'topic_warnings', 'topic_sky', 'topic_local_forecast', 'topic_card'];
// every setting the editor of 2.6 offered, as the keys its controls wrote (168; the entities of the slots show for the slots chosen, and are not listed here)
const BEFORE = [...Object.values(PAGES).flat(), ...SLOTS, ...ACTIONS];

describe('the pages of the editor by topic', () => {
  for (const [id, expected] of Object.entries(PAGES)) {
    it(`${id} holds its settings`, async () => {
      const got = await keysBoth(id);
      expect(got, id).toEqual(expect.arrayContaining(expected));
    });
  }
  it('each setting is on one page only, outside the entities of the slots', async () => {
    const seen: Record<string, string[]> = {};
    for (const id of Object.keys(PAGES)) for (const k of await keysBoth(id)) (seen[k] ??= []).push(id);
    const twice = Object.entries(seen).filter(([, ids]) => ids.length > 1).map(([k, ids]) => `${k}: ${ids.join(', ')}`);
    expect(twice).toEqual([]);
  });
  it('the slots keep their page, with the sixteen slots', async () => {
    const el = await editor(FULL);
    expect(keys(await page(el, 'section_slots'))).toEqual(expect.arrayContaining(SLOTS));
  });
  it('no setting is lost: every one of 2.6 is on a page or on the first screen', async () => {
    const el = await editor(FULL);
    const all = new Set<string>(keys(draw(el.render())));
    for (const id of [...Object.keys(PAGES), 'section_slots']) for (const k of await keysBoth(id)) all.add(k);
    expect(BEFORE.filter((k) => !all.has(k))).toEqual([]);
  });
  it('every page has the back arrow and a title', async () => {
    const el = await editor(FULL);
    for (const id of [...Object.keys(PAGES), 'section_slots']) {
      const box = await page(el, id);
      expect(box.querySelector('.back-title'), id).not.toBeNull();
      expect((box.querySelector('.page-title')?.textContent ?? '').trim(), id).not.toBe('');
    }
  });
});

describe('the first screen', () => {
  it('lists the sections, each with its switch, its arrows and one edit button', async () => {
    const el = await editor();
    const box = draw(el.render());
    const rows = [...box.querySelectorAll('.section-flex.section-row')];
    // the sections in their order, and the hourly forecast under the daily one
    expect(rows.length).toBe((el._config.section_order as string[]).length + 1);
    for (const r of rows) {
      expect(r.querySelectorAll('.edit-icon').length, r.textContent ?? '').toBeLessThanOrEqual(1);
      expect(r.querySelector('.option-icon')).toBeNull();
    }
    const edits = rows.map((r) => (r.querySelector('.edit-icon') as unknown as { value?: string } | null)?.value ?? '');
    expect(edits).toEqual(expect.arrayContaining(['section_overview', 'section_slots', 'section_daily_forecast', 'section_hourly_forecast', 'section_charts',
      'section_extended', 'topic_warnings']));
  });
  it('has no Global Options and no Appearance row any more, and the five topics in their order', async () => {
    const el = await editor();
    const box = draw(el.render());
    expect(box.querySelector('[data-topic="global_options"]')).toBeNull();
    const topics = [...box.querySelectorAll('.topic-row')].map((r) => (r as unknown as { value?: string }).value ?? r.getAttribute('data-topic'));
    expect(topics).toEqual(TOPICS);
  });
  it('a topic opens its page, and the arrow leads back', async () => {
    const el = await editor();
    el._editSubmenu({ currentTarget: { value: 'topic_sky' } }); await el.updateComplete;
    expect(keys(draw(el.render()))).toContain('entity_solar_radiation');
    el._goBack(); await el.updateComplete;
    expect(draw(el.render()).querySelector('.topic-row')).not.toBeNull();
  });
  it('ends with the interactions: tap, hold and double tap', async () => {
    const el = await editor();
    const box = draw(el.render());
    const panel = box.querySelector('.interactions');
    expect(panel).not.toBeNull();
    expect(keys(panel as HTMLElement)).toEqual(ACTIONS);
    // and they are the last thing on the screen
    const last = [...box.children].filter((c) => c.tagName !== 'STYLE').pop();
    expect(last === panel || last?.contains(panel as Node)).toBe(true);
  });
});

describe('the fire danger', () => {
  const fireRow = (box: HTMLElement, key: string) => [...box.querySelectorAll('.toggle-row')].find((r) => (r.querySelector('.pwc-switch') as unknown as { value?: string } | null)?.value === key) as HTMLElement;
  it('its colour switches wait, greyed, for a fire danger entity', async () => {
    const el = await editor({ daily_forecast_layout: 'vertical' });
    const box = await page(el, 'topic_warnings');
    for (const k of ['option_color_fire_danger', 'option_daily_color_fire_danger']) {
      const row = fireRow(box, k);
      expect(row, k).toBeTruthy();
      expect(row.classList.contains('disabled'), k).toBe(true);
      // on, as the card has them by default
      expect(row.querySelector('.pwc-switch')!.classList.contains('active'), k).toBe(true);
    }
  });
  // clicked in the editor itself, where a click reaches the editor (drawn apart, a handler has no editor to change, and would change nothing either way)
  const clickIn = async (el: Editor, key: string) => {
    el._editSubmenu({ currentTarget: { value: 'topic_warnings' } }); await el.updateComplete;
    const sw = [...el.shadowRoot!.querySelectorAll('.pwc-switch')].find((x) => (x as unknown as { value?: string }).value === key) as HTMLElement;
    sw.click(); await el.updateComplete;
  };
  it('a click on a greyed one changes nothing', async () => {
    const el = await editor({ daily_forecast_layout: 'vertical' });
    await clickIn(el, 'option_color_fire_danger');
    expect(el._config.option_color_fire_danger).toBeUndefined();
  });
  it('while with its entity the same click turns it off', async () => {
    const el = await editor({ daily_forecast_layout: 'vertical', entity_fire_danger: 'sensor.fd' });
    await clickIn(el, 'option_color_fire_danger');
    expect(el._config.option_color_fire_danger).toBe(false);
  });
  it('with an entity each one can be set', async () => {
    const el = await editor({ daily_forecast_layout: 'vertical', entity_fire_danger: 'sensor.fd', entity_fire_danger_1: 'sensor.fd1' });
    const box = await page(el, 'topic_warnings');
    for (const k of ['option_color_fire_danger', 'option_daily_color_fire_danger']) expect(fireRow(box, k).classList.contains('disabled'), k).toBe(false);
  });
});

describe('the words', () => {
  it('the local forecast is not called Zambretti in any language, as there is Sager too', () => {
    for (const [lang, t] of Object.entries(LANGS as Record<string, { editor: Record<string, string> }>)) {
      expect(t.editor.local_forecast, lang).toBeTruthy();
      expect(t.editor.local_forecast, lang).not.toMatch(/zambretti|замбрети|замбреті/i);
    }
  });
});
