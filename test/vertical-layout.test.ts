import { describe, it, expect } from 'vitest';
import '../src/platinum-weather-card';
import { makeHass, makeForecast, baseConfig, renderCard } from './helpers';

// The vertical layout is a documented way to show the days, 233 lines of the card, and no
// test had ever rendered it. These run it for a weather entity and for per-day sensors, and
// run the freezing point through both layouts, which is the figure a falsy check loses.

type St = { state: string; attributes?: Record<string, unknown> };
const W = 'weather.home';
const vertical = { section_order: ['daily_forecast'], daily_forecast_layout: 'vertical', daily_forecast_days: 5, option_show_current_day: true, show_section_daily_forecast: true };

async function mount(config: Record<string, unknown>, st: Record<string, St>, forecast: unknown[] = makeForecast(8, 0)) {
  const hass = makeHass(st, { forecast } as never);
  return (await renderCard(baseConfig(config as never), hass)) as HTMLElement;
}
const weather = (): Record<string, St> => ({ [W]: { state: 'cloudy', attributes: { temperature: 12, supported_features: 3, precipitation_unit: 'mm' } } });
const all = (el: HTMLElement, sel: string) => [...(el.shadowRoot?.querySelectorAll(sel) ?? [])];
const txt = (e: Element | undefined) => (e?.textContent ?? '').replace(/\s+/g, ' ').trim();

describe('the vertical layout, from a weather entity', () => {
  const cfg = { ...vertical, weather_entity: W };

  it('is a column of days, in a section of its own, not the horizontal strip', async () => {
    const el = await mount(cfg, weather());
    expect(el.shadowRoot?.querySelector('.daily-forecast-vert-section')).not.toBeNull();
    expect(el.shadowRoot?.querySelector('.daily-forecast-horiz-section')).toBeNull();
    expect(all(el, '.day-vert')).toHaveLength(5);
  });
  it('names each day, today first when the current day is shown', async () => {
    const el = await mount(cfg, weather());
    const names = all(el, '.dayname-vert').map((n) => txt(n));
    for (let i = 0; i < 5; i++) {
      const d = new Date(); d.setDate(d.getDate() + i);
      expect(names[i], `day ${i}`).toContain(d.toLocaleDateString(undefined, { weekday: 'short' }));
    }
  });
  it('starts tomorrow when the current day is left out', async () => {
    const el = await mount({ ...cfg, option_show_current_day: false }, weather());
    const d = new Date(); d.setDate(d.getDate() + 1);
    expect(txt(all(el, '.dayname-vert')[0])).toContain(d.toLocaleDateString(undefined, { weekday: 'short' }));
  });
  it('takes up to seven days, and no more than the forecast has', async () => {
    expect(all(await mount({ ...cfg, daily_forecast_days: 7 }, weather()), '.day-vert')).toHaveLength(7);
    expect(all(await mount({ ...cfg, daily_forecast_days: 5 }, weather(), makeForecast(3, 0)), '.day-vert')).toHaveLength(3);
  });
  it('shows each day\'s high and low from the forecast', async () => {
    const f = makeForecast(8, 0);
    const el = await mount(cfg, weather(), f);
    const highs = all(el, '.high-temp').map((n) => txt(n));
    const lows = all(el, '.low-temp').map((n) => txt(n));
    f.slice(0, 5).forEach((d, i) => { expect(highs[i]).toContain(String(d.temperature)); expect(lows[i]).toContain(String(d.templow)); });
  });
  it('shows the chance of rain and the possible rain, with the unit', async () => {
    const f = makeForecast(8, 0);
    const el = await mount(cfg, weather(), f);
    const pop = all(el, '.pop').map((n) => txt(n));
    const pos = all(el, '.day-vert-rain .f-slot-vert').filter((n) => /Possible rain/.test(txt(n))).map((n) => txt(n));
    expect(pop[2]).toBe(String(f[2].precipitation_probability));
    expect(pos[2]).toContain(String(f[2].precipitation));
    expect(pos[2]).toContain('mm');
  });
  it('says dashes for what the provider does not give', async () => {
    const f = makeForecast(8, 0).map(({ precipitation_probability: _p, precipitation: _r, ...rest }: Record<string, unknown>) => rest);
    const el = await mount(cfg, weather(), f);
    expect(all(el, '.pop').map((n) => txt(n))).toEqual(['---', '---', '---', '---', '---']);
  });
  it('shows an icon for the condition of each day', async () => {
    const f = makeForecast(8, 0).map((d, i) => ({ ...d, condition: i === 1 ? 'rainy' : 'sunny' }));
    const el = await mount(cfg, weather(), f);
    const icons = all(el, '.day-vert-dayicon .icon').map((n) => n.getAttribute('style') ?? '');
    expect(icons[1]).toMatch(/rainy/);
    expect(icons[0]).not.toMatch(/rainy/);
  });
});

describe('the vertical layout, from per-day sensors', () => {
  const sensors = (n: number, over: Record<string, St> = {}): Record<string, St> => {
    const st: Record<string, St> = {};
    for (let i = 1; i <= n; i++) {
      st[`sensor.icon_${i}`] = { state: i === 2 ? 'rainy' : 'sunny' };
      st[`sensor.max_${i}`] = { state: String(20 + i) }; st[`sensor.min_${i}`] = { state: String(10 + i) };
      st[`sensor.pop_${i}`] = { state: String(10 * i) }; st[`sensor.pos_${i}`] = { state: `${i}.5` };
      st[`sensor.sum_${i}`] = { state: `Day ${i}` };
    }
    return { ...st, ...over };
  };
  const cfg = { ...vertical, entity_forecast_icon_1: 'sensor.icon_1', entity_forecast_max_1: 'sensor.max_1', entity_forecast_min_1: 'sensor.min_1', entity_pop_1: 'sensor.pop_1', entity_pos_1: 'sensor.pos_1', entity_summary_1: 'sensor.sum_1' };

  it('steps the number up for each day', async () => {
    const el = await mount(cfg, sensors(5));
    expect(all(el, '.day-vert')).toHaveLength(5);
    expect(all(el, '.high-temp').map((n) => txt(n)).map((t) => parseInt(t.replace(/\D+/g, ''), 10))).toEqual([21, 22, 23, 24, 25]);
    expect(all(el, '.f-summary-vert').map((n) => txt(n))).toEqual(['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5']);
  });
  it('stops at the first day without a sensor', async () => {
    expect(all(await mount(cfg, sensors(3)), '.day-vert')).toHaveLength(3);
  });
  it('stops at a day whose icon sensor is unknown', async () => {
    const el = await mount(cfg, sensors(5, { 'sensor.icon_4': { state: 'unknown' } }));
    expect(all(el, '.day-vert')).toHaveLength(3);
  });
  it('shows the chance and the amount of rain', async () => {
    const el = await mount(cfg, sensors(5));
    expect(all(el, '.pop').map((n) => txt(n))[2]).toBe('30');
    expect(all(el, '.pos').map((n) => txt(n))[2]).toBe('3.5');
  });
  it('shows the fire danger when there is a sensor for it, and nothing when there is not', async () => {
    const st = sensors(3, { 'sensor.fire_1': { state: 'High' }, 'sensor.fire_2': { state: 'Low' }, 'sensor.fire_3': { state: 'Extreme' } });
    const el = await mount({ ...cfg, entity_fire_danger_1: 'sensor.fire_1' }, st);
    // the card sets it in capitals
    expect(all(el, '.f-firedanger-vert').map((n) => txt(n).toLowerCase())).toEqual(['high', 'low', 'extreme']);
    expect(all(await mount(cfg, sensors(3)), '.f-firedanger-vert')).toHaveLength(0);
  });
});

describe('a freezing day', () => {
  // 0 is the figure a "was there a value" check loses: it reads as nothing and prints dashes.
  const zero = () => makeForecast(8, 0).map((d, i) => (i === 1 ? { ...d, temperature: 0, templow: 0 } : d));

  it('is shown as 0, not as dashes, in the vertical layout', async () => {
    const el = await mount({ ...vertical, weather_entity: W }, weather(), zero());
    expect(txt(all(el, '.high-temp')[1])).toContain('0');
    expect(txt(all(el, '.high-temp')[1])).not.toContain('---');
    expect(txt(all(el, '.low-temp')[1])).not.toContain('---');
  });
  it('and in the horizontal one', async () => {
    const el = await mount({ section_order: ['daily_forecast'], daily_forecast_layout: 'horizontal', daily_forecast_days: 5, option_show_current_day: true, show_section_daily_forecast: true, weather_entity: W }, weather(), zero());
    const strip = txt(el.shadowRoot?.querySelector('.daily-forecast-horiz-section') ?? undefined);
    expect(strip).not.toContain('---');
  });
});
