import { describe, it, expect } from 'vitest';
import '../src/platinum-weather-card';
import { makeHass, baseConfig, renderCard, makeForecast } from './helpers';

// #47 (thefan418): the precipitation bars of the charts were scaled to the wettest day of the period, so its bar always stood at 85% of the
// height, whether it stood for 0.3 mm or 30 mm. The scale is at least 10 mm now (0.4 in): a little rain is a short bar, and a day wetter
// than that still reaches the top, not cut off. option_precip_chart_min sets the amount in the unit of the precipitation; 0 brings back the
// scale of the wettest day. The same as Weather Chart Card does with suggestedMax, which never caps a bar.

type Card = HTMLElement & { updateComplete: Promise<unknown> };
async function bars(forecast: unknown[], extra: Record<string, unknown> = {}, inches = false) {
  // the charts are drawn under the days, as the forecast test draws them
  const el = (await renderCard(baseConfig({ weather_entity: 'weather.home', section_order: ['daily_forecast'], daily_forecast_layout: 'horizontal',
    daily_forecast_days: forecast.length, option_show_current_day: true, show_section_charts: true,
    option_show_precipitation_chart: true, option_show_temperature_chart: true, ...extra } as never), makeHass(
    { 'weather.home': { state: 'rainy', attributes: { supported_features: 1, ...(inches ? { precipitation_unit: 'in' } : {}) } } },
    { forecast } as never))) as Card;
  await new Promise((r) => setTimeout(r, 20)); await el.updateComplete;
  // the bars, by their colour, in the order of the days
  const found = [...el.shadowRoot!.querySelectorAll('div')].filter((d) => (d.getAttribute('style') ?? '').includes('rgba(151,230,255,0.50)'))
    .map((d) => Number(/height:([\d.]+)px/.exec(d.getAttribute('style') ?? '')![1]));
  // one bar for each wet day: a test that found none would compare nothing
  expect(found.length, 'the bars').toBe((forecast as { precipitation: number }[]).filter((d) => d.precipitation > 0).length);
  return found;
}
const days = (mm: number[]) => makeForecast(mm.length).map((d, i) => ({ ...d, precipitation: mm[i] }));
const ratio = (a: number[], b: number[]) => a.map((x, i) => x / b[i]);

describe('the scale of the precipitation bars', () => {
  it('is at least 10 mm: a dry week shows short bars, not full ones', async () => {
    const now = await bars(days([1, 2, 4]));
    const before = await bars(days([1, 2, 4]), { option_precip_chart_min: 0 });
    // against the old scale of the wettest day (4 mm), each is 4/10 of what it was
    for (const r of ratio(now, before)) expect(r).toBeCloseTo(0.4, 2);
  });
  it('a wetter day than the floor still reaches the top, as before: nothing is cut off', async () => {
    const now = await bars(days([5, 20, 35]));
    const before = await bars(days([5, 20, 35]), { option_precip_chart_min: 0 });
    expect(now).toEqual(before);
  });
  it('the amount can be set: 20 mm halves the bars of a 10 mm scale', async () => {
    const ten = await bars(days([1, 2, 4]));
    const twenty = await bars(days([1, 2, 4]), { option_precip_chart_min: 20 });
    for (const r of ratio(twenty, ten)) expect(r).toBeCloseTo(0.5, 2);
  });
  it('in inches the floor is 0.4 in', async () => {
    // the wettest day is 0.3 in: against a floor of 0.4 in each bar is 3/4 of what it was
    const now = await bars(days([0.1, 0.2, 0.3]), {}, true);
    const before = await bars(days([0.1, 0.2, 0.3]), { option_precip_chart_min: 0 }, true);
    for (const r of ratio(now, before)) expect(r).toBeCloseTo(0.75, 2);
  });
});

describe('the field in the editor', () => {
  it('stands under the switch of the precipitation chart, empty by default, in every language', async () => {
    await import('../src/editor');
    const { TRANSLATIONS } = await import('../src/translations');
    type Editor = HTMLElement & { setConfig: (c: unknown) => void; hass: unknown; updateComplete: Promise<unknown>; _optionChartsEditor?: () => unknown };
    const el = document.createElement('platinum-weather-card-plus-charts-editor') as Editor;
    el.setConfig({ card_config_version: 8, weather_entity: 'weather.home', show_section_charts: true, option_show_precipitation_chart: true });
    el.hass = makeHass({ 'weather.home': { state: 'rainy' } });
    document.body.appendChild(el); await el.updateComplete;
    const src = (await import('fs')).readFileSync(require('path').join(__dirname, '..', 'src', 'editor.ts'), 'utf8') as string;
    expect(src).toMatch(/\.configValue=\$\{'option_precip_chart_min'\} @change=\$\{this\._valueChangedNumber\}/);
    for (const [lang, t] of Object.entries(TRANSLATIONS)) {
      const e = (t as { editor: Record<string, string> }).editor;
      expect(e.precip_chart_min, lang).toBeTruthy();
      expect(e.precip_chart_min_hint, lang).toMatch(/10/);
    }
  });
});
