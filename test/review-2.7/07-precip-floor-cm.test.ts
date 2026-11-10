// Находка 7: подът на валежните стълбове при единица cm е 10 cm.
import { describe, it, expect } from 'vitest';
import { Any, clean, makeHass, baseConfig, renderCard, makeForecast } from './_util';
clean();

async function bars(unit: string, amounts: number[]) {
  const forecast = makeForecast(amounts.length).map((d, i) => ({ ...d, precipitation: amounts[i] }));
  const el = (await renderCard(baseConfig({ weather_entity: 'weather.home', section_order: ['daily_forecast'], daily_forecast_layout: 'horizontal', daily_forecast_days: amounts.length,
    option_show_current_day: true, show_section_charts: true, option_show_precipitation_chart: true, option_show_temperature_chart: true } as never),
    makeHass({ 'weather.home': { state: 'rainy', attributes: { supported_features: 1, precipitation_unit: unit } } }, { forecast } as never))) as Any;
  await new Promise((r) => setTimeout(r, 20)); await el.updateComplete;
  return [...el.shadowRoot.querySelectorAll('div')].filter((d: Element) => (d.getAttribute('style') ?? '').includes('rgba(151,230,255,0.50)'))
    .map((d: Element) => Number(/height:([\d.]+)px/.exec(d.getAttribute('style') ?? '')![1]));
}

describe('7. the floor of the precipitation bars in centimetres', () => {
  it('the same rain draws the same bars in cm as in mm', async () => {
    const mm = await bars('mm', [1, 2, 4]);
    const cm = await bars('cm', [0.1, 0.2, 0.4]);
    expect(mm.length).toBe(3);
    cm.forEach((h, i) => expect(h).toBeCloseTo(mm[i], 1));
  });
});
