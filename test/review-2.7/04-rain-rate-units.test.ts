// Находка 4: дъждомер в in/h се чете като mm/h.
import { describe, it, expect } from 'vitest';
import { Any, clean, plan, makeHass, baseConfig, renderCard } from './_util';
import { forgetSharedState } from '../helpers';
clean();

const mount = async (rate: string, unit: string, extra: Record<string, unknown> = {}) => (await renderCard(baseConfig({ option_effects: 'full', entity_forecast_icon: 'sensor.c', entity_rain_rate: 'sensor.r', entity_sun: 'sun.sun', ...extra } as never),
  makeHass({ 'sensor.c': { state: 'rainy' }, 'sun.sun': { state: 'above_horizon' }, 'sensor.r': { state: rate, attributes: { unit_of_measurement: unit } } }))) as Any;

describe('4. a gauge in inches an hour', () => {
  it('0.5 in/h is 12.7 mm/h: the rain behind the card is as heavy as for 12.7 mm/h', async () => {
    const metric = plan(await mount('12.7', 'mm/h')).rain.intensity;
    forgetSharedState();
    expect(plan(await mount('0.5', 'in/h')).rain.intensity).toBe(metric);
  });
  it('and under a provider that says cloudy, the icon the gauge decides is the heavy rain, as for 12.7 mm/h', async () => {
    const icon = async (rate: string, unit: string) => {
      forgetSharedState();
      const el = (await renderCard(baseConfig({ entity_forecast_icon: 'sensor.c', entity_rain_rate: 'sensor.r', entity_sun: 'sun.sun', option_cloud_overrides_icon: true } as never),
        makeHass({ 'sensor.c': { state: 'cloudy' }, 'sun.sun': { state: 'above_horizon' }, 'sensor.r': { state: rate, attributes: { unit_of_measurement: unit } } }))) as Any;
      return String(el.shadowRoot.querySelector('.overview-section img')?.getAttribute('data-icon')).split('/').pop();
    };
    expect(await icon('12.7', 'mm/h')).toBe('a-rainy-3-day.svg');
    expect(await icon('0.5', 'in/h')).toBe('a-rainy-3-day.svg');
  });
});
