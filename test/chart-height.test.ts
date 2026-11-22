import { describe, it, expect } from 'vitest';
import '../src/platinum-weather-card';
import { makeHass, baseConfig, renderCard, makeForecast } from './helpers';

// #73 (chriscortez1976): the chart under the days was 75 px high, fixed. On a wall tablet, as a tile beside others, the lines were flat and
// the card shorter than its neighbours; card_mod could not help, since the labels and the bars are placed with pixels taken from that 75.
// option_chart_height sets it, and everything is taken from it: the margins of the lines, the bars, the labels and the strip under them.
// The labels grow with the height, from 8 px at 75 to at most 13 px.

type Card = HTMLElement & { updateComplete: Promise<unknown> };
const ORANGE = 'rgba(255,152,0,0.9)';
const BLUE = 'rgba(90,150,210,0.9)';
const RAIN = 'rgba(115,198,239,0.85)';
const BAR = 'rgba(151,230,255,0.50)';

async function chart(extra: Record<string, unknown> = {}, temp = true, precip = true) {
  const forecast = makeForecast(5).map((d, i) => ({ ...d, precipitation: [0, 2, 5, 8, 12][i] }));
  const el = (await renderCard(baseConfig({ weather_entity: 'weather.home', section_order: ['daily_forecast'], daily_forecast_layout: 'horizontal',
    daily_forecast_days: 5, option_show_current_day: true, show_section_charts: true,
    option_show_precipitation_chart: precip, option_show_temperature_chart: temp, ...extra } as never), makeHass(
    { 'weather.home': { state: 'rainy', attributes: { supported_features: 1 } } }, { forecast } as never))) as Card;
  await new Promise((r) => setTimeout(r, 20)); await el.updateComplete;
  // the section of the charts is the one with the lines in it; the days above it have columns of the same class
  const root = [...el.shadowRoot!.querySelectorAll('.daily-forecast-horiz-section')].find((s) => [...s.children].some((c) => /height:\d/.test(c.getAttribute('style') ?? '')))!;
  const st = (d: Element) => d.getAttribute('style') ?? '';
  const px = (d: Element, prop: string) => Number(new RegExp(`(?:^|;)${prop}:(-?[\\d.]+)px`).exec(st(d))![1]);
  const divs = [...root.querySelectorAll('.day-horiz div')];
  const labels = (border: string) => divs.filter((d) => st(d).includes(`border:0.8px solid ${border}`));
  const line = (stroke: string) => (root.querySelector(`polyline[stroke="${stroke}"]`)?.getAttribute('points') ?? '')
    .split(' ').filter(Boolean).map((p) => Number(p.split(',')[1]));
  return {
    columns: [...root.children].filter((c) => c.classList.contains('day-horiz')).map((c) => px(c, 'height')),
    svgHeight: Number(/height:([\d.]+)px/.exec([...root.children].find((c) => c.tagName.toLowerCase() === 'svg')?.getAttribute('style') ?? '')?.[1]),
    maxLine: line(ORANGE), minLine: line(BLUE),
    maxTops: labels(ORANGE).map((d) => px(d, 'top')), minTops: labels(BLUE).map((d) => px(d, 'top')),
    rainTops: labels(RAIN).map((d) => px(d, 'top')),
    fonts: [...new Set([...labels(ORANGE), ...labels(BLUE), ...labels(RAIN)].map((d) => px(d, 'font-size')))],
    bars: divs.filter((d) => st(d).includes(BAR)).map((d) => ({ top: px(d, 'top'), height: px(d, 'height') })),
  };
}

describe('the height of the chart', () => {
  it('is 75 px with 8 px labels when it is not set, as before, and the same when it is set to 75', async () => {
    const now = await chart();
    // 75 for the lines and the bars, 16 for the strip of the rain labels under them
    expect(now.columns.every((h) => h === 91)).toBe(true);
    expect(now.svgHeight).toBe(91);
    expect(now.fonts).toEqual([8]);
    expect(Math.min(...now.maxLine)).toBe(16);
    expect(Math.max(...now.minLine)).toBe(59);
    expect(now.rainTops.every((t) => t === 69)).toBe(true);
    expect(await chart({ option_chart_height: 75 })).toEqual(now);
  });

  it('is taken from option_chart_height for the lines, the bars, the labels and the strip under them', async () => {
    const base = await chart();
    const tall = await chart({ option_chart_height: 300 });
    const k = 4;
    // 13 px labels in a box of 18 px, and a strip of 21 px under the 300
    expect(tall.fonts).toEqual([13]);
    expect(tall.columns.every((h) => h === 321)).toBe(true);
    expect(tall.svgHeight).toBe(321);
    // the lines span the height, within its margins
    expect(Math.min(...tall.maxLine)).toBeCloseTo(16 * k, 6);
    expect(Math.max(...tall.minLine)).toBeCloseTo(300 - 16 * k, 6);
    // each label stands on its point of the line, at any height
    tall.maxLine.forEach((y, i) => expect(tall.maxTops[i] + 18 / 2, `max ${i}`).toBeCloseTo(y, 6));
    tall.minLine.forEach((y, i) => expect(tall.minTops[i] + 18 / 2, `min ${i}`).toBeCloseTo(y, 6));
    // the bars grow in proportion and rise from the bottom of the 300; the rain labels sit on that line
    expect(tall.bars.length).toBe(4);
    tall.bars.forEach((b, i) => {
      expect(b.height, `bar ${i}`).toBeCloseTo(base.bars[i].height * k, 6);
      expect(b.top + b.height, `bar ${i}`).toBeCloseTo(300, 6);
    });
    expect(tall.rainTops.every((t) => t === 300 - 9)).toBe(true);
  });

  it('the chart of rain alone grows by the same measure', async () => {
    const base = await chart({}, false, true);
    const tall = await chart({ option_chart_height: 150 }, false, true);
    expect(base.columns[0]).toBe(52 + 16);
    // 52 × 2, and the strip of 13 px labels (a box of 18, and 3) under it
    expect(tall.columns[0]).toBe(104 + 21);
    tall.bars.forEach((b, i) => expect(b.height).toBeCloseTo(base.bars[i].height * 2, 6));
  });

  it('the labels grow with the height, from 8 to 13 px', async () => {
    expect((await chart({ option_chart_height: 40 })).fonts).toEqual([8]);
    expect((await chart({ option_chart_height: 100 })).fonts).toEqual([11]);
    expect((await chart({ option_chart_height: 1000 })).fonts).toEqual([13]);
  });

  it('a height that is not a number, or 0, is the 75 of before', async () => {
    const base = await chart();
    expect(await chart({ option_chart_height: 'tall' })).toEqual(base);
    expect(await chart({ option_chart_height: 0 })).toEqual(base);
  });
});

describe('the field of the height in the editor', () => {
  it('stands with the charts when either is on, empty by default, marked new, in every language', async () => {
    await import('../src/editor');
    const { TRANSLATIONS } = await import('../src/translations');
    type Editor = HTMLElement & { setConfig: (c: unknown) => void; hass: unknown; updateComplete: Promise<unknown>; _optionChartsEditor: () => unknown };
    const { render } = await import('lit');
    const field = async (cfg: Record<string, unknown>) => {
      const el = document.createElement('platinum-weather-card-plus-charts-editor') as Editor;
      el.setConfig({ card_config_version: 8, weather_entity: 'weather.home', show_section_charts: true, ...cfg });
      el.hass = makeHass({ 'weather.home': { state: 'rainy' } });
      document.body.appendChild(el); await el.updateComplete;
      const box = document.createElement('div');
      render(el._optionChartsEditor() as never, box);
      el.remove();
      return [...box.querySelectorAll('ha-input')].find((i) => (i as unknown as { configValue: string }).configValue === 'option_chart_height') as
        (HTMLElement & { value: unknown }) | undefined;
    };
    expect(await field({})).toBeUndefined();
    expect((await field({ option_show_temperature_chart: true }))?.value).toBe('');
    expect((await field({ option_show_precipitation_chart: true }))?.value).toBe('');
    expect((await field({ option_show_temperature_chart: true, option_chart_height: 200 }))?.value).toBe(200);
    for (const [lang, t] of Object.entries(TRANSLATIONS)) {
      const e = (t as { editor: Record<string, string> }).editor;
      expect(e.chart_height, lang).toBeTruthy();
      expect(e.chart_height_hint, lang).toMatch(/75/);
    }
  });
});
