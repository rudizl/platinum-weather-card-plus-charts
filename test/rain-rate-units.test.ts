import { describe, it, expect, beforeEach } from 'vitest';
import '../src/platinum-weather-card';
import { makeHass, baseConfig, renderCard, forgetSharedState } from './helpers';

// A rain gauge in another unit than mm/h was read as mm/h (found in the review of 2.7, finding 4; the part of the icon is in 2.6 too):
// 0.5 in/h is 12.7 mm/h, heavy rain, and the icon the gauge decides was the light rain. The rate is turned into mm/h for what compares it
// with thresholds in mm/h, the bands of the icon and the forecast; the slot still shows the number in the unit of the sensor.

async function mount(rate: string, unit: string) {
  return (await renderCard(baseConfig({ section_order: ['overview', 'slots'], slot_l1: 'rain_rate', entity_forecast_icon: 'sensor.c', entity_rain_rate: 'sensor.r',
    entity_sun: 'sun.sun', option_cloud_overrides_icon: true } as never),
    makeHass({ 'sensor.c': { state: 'cloudy' }, 'sun.sun': { state: 'above_horizon', attributes: { elevation: 30 } },
      'sensor.r': { state: rate, attributes: { unit_of_measurement: unit } } }))) as HTMLElement & { forecastRainRate: number | null };
}
const icon = (el: HTMLElement) => (el.shadowRoot!.querySelector('.big-icon img')?.getAttribute('src') ?? '').split('/').pop()!.split('?')[0];

describe('a rain gauge in another unit', () => {
  beforeEach(() => forgetSharedState());
  it('in inches an hour: 0.5 in/h is heavy rain, as 12.7 mm/h is', async () => {
    const metric = icon(await mount('12.7', 'mm/h'));
    forgetSharedState();
    expect(icon(await mount('0.5', 'in/h'))).toBe(metric);
    expect(metric).toMatch(/rainy-3/);
  });
  it('in millimetres a minute: 0.2 mm/min is 12 mm/h', async () => {
    expect(icon(await mount('0.2', 'mm/min'))).toMatch(/rainy-3/);
  });
  it('in millimetres a day: 24 mm/d is 1 mm/h, light rain', async () => {
    expect(icon(await mount('24', 'mm/d'))).toMatch(/rainy-1/);
  });
  it('the forecast reads it in mm/h too', async () => {
    expect((await mount('0.5', 'in/h')).forecastRainRate).toBeCloseTo(12.7, 1);
  });
  it('the slot still shows the number in the unit of the sensor', async () => {
    const el = await mount('0.5', 'in/h');
    expect(el.shadowRoot!.querySelector('[data-slot="rain_rate"]')?.textContent?.replace(/\s+/g, ' ')).toContain('0.5');
  });
});
