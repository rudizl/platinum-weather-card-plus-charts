import { describe, it, expect } from 'vitest';
import '../src/platinum-weather-card';
import { makeHass, baseConfig, renderCard } from './helpers';

// "Use attribute" for the summary of the days (summary_1_use_attr, with the attribute in summary_1_name_attr) takes the text of each day from
// an attribute of its sensor instead of its state, as the same switch does for the extended forecast. It worked in two of the three places
// the summary is shown, the tooltip of the days across and the text of the days down; the tooltip of the days drawn with the charts read the
// state alone (#39). The three are checked here together, so that none can drift from the others again.

type State = { state: string; attributes?: Record<string, unknown> };
function sensors(days = 3): Record<string, State> {
  const st: Record<string, State> = {};
  for (let i = 1; i <= days; i++) {
    st[`sensor.icon_${i}`] = { state: 'cloudy' };
    st[`sensor.max_${i}`] = { state: String(15 + i), attributes: { unit_of_measurement: '°C' } };
    st[`sensor.min_${i}`] = { state: String(5 + i), attributes: { unit_of_measurement: '°C' } };
    st[`sensor.pos_${i}`] = { state: '0', attributes: { unit_of_measurement: 'mm' } };
    // the state is a short word, the attribute the whole text: as some providers give it
    st[`sensor.sum_${i}`] = { state: `STATE${i}`, attributes: { text: `Attribute text ${i}` } };
  }
  return st;
}
async function mount(extra: Record<string, unknown>) {
  const cfg = {
    section_order: ['daily_forecast'], entity_forecast_icon_1: 'sensor.icon_1', entity_forecast_max_1: 'sensor.max_1', entity_forecast_min_1: 'sensor.min_1',
    entity_pos_1: 'sensor.pos_1', entity_summary_1: 'sensor.sum_1', daily_forecast_days: 3, option_show_current_day: true,
    summary_1_use_attr: true, summary_1_name_attr: 'text', ...extra,
  };
  return (await renderCard(baseConfig(cfg as never), makeHass(sensors()))) as HTMLElement;
}
const html = (el: HTMLElement) => el.shadowRoot?.innerHTML ?? '';

describe('the summary of the days from an attribute', () => {
  it('the tooltip of the days across', async () => {
    const el = await mount({ daily_forecast_layout: 'horizontal', show_section_charts: false, option_tooltips: true });
    expect(html(el)).toContain('Attribute text 2');
    expect(html(el)).not.toContain('STATE2');
  });
  it('the text of the days down', async () => {
    const el = await mount({ daily_forecast_layout: 'vertical', show_section_charts: false });
    expect(html(el)).toContain('Attribute text 2');
    expect(html(el)).not.toContain('STATE2');
  });
  it('the tooltip of the days drawn with the charts', async () => {
    const el = await mount({ daily_forecast_layout: 'horizontal', show_section_charts: true, option_show_temperature_chart: true });
    expect(html(el)).toContain('Attribute text 2');
    expect(html(el)).not.toContain('STATE2');
  });
});

describe('and without it, the state, in all three', () => {
  for (const [name, extra] of [
    ['across', { daily_forecast_layout: 'horizontal', show_section_charts: false, option_tooltips: true }],
    ['down', { daily_forecast_layout: 'vertical', show_section_charts: false }],
    ['with the charts', { daily_forecast_layout: 'horizontal', show_section_charts: true, option_show_temperature_chart: true }],
  ] as const) {
    it(name, async () => {
      const el = await mount({ ...extra, summary_1_use_attr: false });
      expect(html(el)).toContain('STATE2');
      expect(html(el)).not.toContain('Attribute text 2');
    });
  }
  it('the switch on and no attribute named is the state, as in the other two places', async () => {
    const el = await mount({ daily_forecast_layout: 'horizontal', show_section_charts: true, option_show_temperature_chart: true, summary_1_name_attr: undefined });
    expect(html(el)).toContain('STATE2');
  });
});

describe('the switch in the editor', () => {
  it('writes summary_1_use_attr, and then offers the attribute', async () => {
    await import('../src/editor');
    type Editor = HTMLElement & { setConfig: (c: unknown) => void; hass: unknown; updateComplete: Promise<unknown>; _config: Record<string, unknown> };
    const el = document.createElement('platinum-weather-card-plus-charts-editor') as Editor;
    el.setConfig({ card_config_version: 8, entity_summary_1: 'sensor.sum_1', _page: 'section_daily_forecast' });
    el.hass = makeHass(sensors());
    document.body.appendChild(el); await el.updateComplete;
    (el as unknown as { _editSubmenu: (e: unknown) => void })._editSubmenu({ currentTarget: { value: 'section_daily_forecast' } });
    await el.updateComplete;
    const sw = [...el.shadowRoot!.querySelectorAll('.pwc-switch')].find((x) => (x as unknown as { value: string }).value === 'summary_1_use_attr') as HTMLElement;
    expect(sw, 'the switch is on the page of the daily forecast').toBeTruthy();
    let written: Record<string, unknown> | undefined;
    el.addEventListener('config-changed', (e) => { written = (e as CustomEvent).detail.config; });
    sw.click(); await el.updateComplete;
    expect(written?.summary_1_use_attr).toBe(true);
    expect([...el.shadowRoot!.querySelectorAll('ha-selector')].some((x) => (x as unknown as { configValue: string }).configValue === 'summary_1_name_attr')).toBe(true);
    el.remove();
  });
});
