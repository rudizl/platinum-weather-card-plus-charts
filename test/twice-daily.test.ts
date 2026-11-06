import { describe, it, expect } from 'vitest';
import '../src/platinum-weather-card';
import { makeHass, makeForecast, baseConfig, renderCard } from './helpers';

// #35: with a provider that gives only twice_daily (the National Weather Service), the strip and the charts were empty. A date
// has two entries, a day and a night, and the card told them apart by `daytime`, which Home Assistant does not say: it says
// `is_daytime`. And the forecast was cut to the number of days by counting entries, two to a day, so five days kept two and a half.

type Entry = Record<string, unknown>;
const at = (offset: number, hour: number): string => {
  const d = new Date();
  d.setHours(hour, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return d.toISOString();
};
// What the NWS gives: for each date a day entry (is_daytime true) and a night entry (false), the night's temperature being the low.
function twiceDaily(days: number, opts: { firstDayNightOnly?: boolean; flag?: string } = {}): Entry[] {
  const flag = opts.flag ?? 'is_daytime';
  const out: Entry[] = [];
  for (let i = 0; i < days; i++) {
    if (!(i === 0 && opts.firstDayNightOnly)) {
      out.push({ datetime: at(i, 9), [flag]: true, condition: 'sunny', temperature: 20 + i, precipitation_probability: 10 + i, precipitation: 0 });
    }
    out.push({ datetime: at(i, 21), [flag]: false, condition: 'rainy', temperature: i === 0 ? 3 : 8 + i, precipitation_probability: 60, precipitation: 1 });
  }
  return out;
}

async function card(forecast: Entry[], extra: Record<string, unknown> = {}) {
  const hass = makeHass(
    { 'weather.test': { state: 'sunny', attributes: { temperature: 21, friendly_name: 'Test' } } },
    { forecast },
  );
  return (await renderCard(baseConfig({
    section_order: ['daily_forecast'],
    weather_entity: 'weather.test',
    forecast_type: 'twice_daily',
    daily_forecast_layout: 'horizontal',
    daily_forecast_days: 5,
    ...extra,
  } as never), hass)) as HTMLElement & { forecast1?: Entry[] };
}
const dayColumns = (el: HTMLElement) => el.shadowRoot?.querySelectorAll('.dayname').length ?? 0;
const columns = (el: HTMLElement) => [...(el.shadowRoot?.querySelectorAll('ul.f-slot-horiz') ?? [])];
const text = (col: Element, sel: string) => (col.querySelector(sel)?.textContent ?? '').replace(/\s+/g, ' ').trim();
const icon = (col: Element) => col.querySelector('.icon')?.getAttribute('style') ?? '';
const chartPoints = (el: HTMLElement) => {
  const pts = el.shadowRoot?.querySelector('svg polyline')?.getAttribute('points') ?? '';
  return pts.trim() ? pts.trim().split(/\s+/).length : 0;
};

describe('a twice-daily forecast, as the National Weather Service gives it', () => {
  it('fills the strip: a day for each day asked for', async () => {
    const el = await card(twiceDaily(8));
    expect(dayColumns(el)).toBe(5);
  });
  it('the icon is the day entry\u2019s, not the night\u2019s', async () => {
    const cols = columns(await card(twiceDaily(8)));
    expect(cols).toHaveLength(5);
    for (const c of cols) { expect(icon(c)).toMatch(/clear-day/); expect(icon(c)).not.toMatch(/rainy/); }
  });
  it('the high is the day\u2019s temperature and the low is the night\u2019s', async () => {
    // the strip begins tomorrow: day 1 is 21 high and 9 low
    const first = columns(await card(twiceDaily(8)))[0];
    expect(text(first, '.highTemp')).toContain('21');
    expect(text(first, '.lowTemp')).toContain('9');
  });
  it('and the chance of rain is the day\u2019s', async () => {
    const first = columns(await card(twiceDaily(8)))[0];
    expect(text(first, '.pop')).toContain('11');
  });
  it('keeps the days it was asked for, not the entries: five days are not two and a half', async () => {
    const el = await card(twiceDaily(8), { daily_forecast_days: 5 });
    // today and the five after it, each with two entries, and no more
    expect(el.forecast1?.length).toBeLessThanOrEqual(12);
    expect(el.forecast1?.length).toBeGreaterThanOrEqual(10);
    const three = await card(twiceDaily(8), { daily_forecast_days: 3 });
    expect(three.forecast1?.length).toBeLessThanOrEqual(8);
    expect(dayColumns(three)).toBe(3);
  });
  it('the chart has a point for each day of the strip', async () => {
    const el = await card(twiceDaily(8), { show_section_charts: true, option_show_temperature_chart: true });
    expect(dayColumns(el)).toBe(5);
    expect(chartPoints(el)).toBe(5);
  });
  it('a night with no day before it, in the evening, is a low and not a high', async () => {
    // today's day entry is gone by evening: the one entry of today is the night, 3 degrees
    const first = columns(await card(twiceDaily(8, { firstDayNightOnly: true }), { option_show_current_day: true }))[0];
    expect(text(first, '.lowTemp')).toContain('3');
    expect(text(first, '.highTemp')).not.toContain('3');
  });
  it('what an older version of the card read, `daytime`, still works', async () => {
    const cols = columns(await card(twiceDaily(8, { flag: 'daytime' })));
    expect(cols).toHaveLength(5);
    expect(text(cols[0], '.highTemp')).toContain('21');
    expect(text(cols[0], '.lowTemp')).toContain('9');
  });
});

describe('a daily forecast is as it was', () => {
  it('is cut by entries, one to a day, as before', async () => {
    const hass = makeHass(
      { 'weather.test': { state: 'sunny', attributes: { temperature: 21, friendly_name: 'Test' } } },
      { forecast: makeForecast(8, 0) },
    );
    const el = (await renderCard(baseConfig({
      section_order: ['daily_forecast'], weather_entity: 'weather.test', forecast_type: 'daily',
      daily_forecast_layout: 'horizontal', daily_forecast_days: 5,
    } as never), hass)) as HTMLElement & { forecast1?: Entry[] };
    expect(el.forecast1).toHaveLength(6); // the day it starts on (tomorrow, so one before it) and five
    expect(dayColumns(el)).toBe(5);
  });
});
