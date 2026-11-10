// Находка 3: сух дъждомер дава по-силен дъжд зад картата от дъждомер, който мери слаб дъжд.
import { describe, it, expect } from 'vitest';
import { Any, clean, plan, makeHass, baseConfig, renderCard } from './_util';
import { forgetSharedState } from '../helpers';
clean();

const mount = async (rate: string) => (await renderCard(baseConfig({ option_effects: 'full', entity_forecast_icon: 'sensor.c', entity_rain_rate: 'sensor.r' } as never),
  makeHass({ 'sensor.c': { state: 'rainy' }, 'sensor.r': { state: rate, attributes: { unit_of_measurement: 'mm/h' } } }))) as Any;

describe('3. the rain behind the card and the gauge (option_cloud_overrides_icon off, the default)', () => {
  it('a gauge that reads nothing does not draw a heavier rain than a gauge that reads a drizzle', async () => {
    const drizzle = plan(await mount('0.6')).rain.intensity; // 0.2
    forgetSharedState(); // no rain in the last fifteen minutes, which the card would hold on to
    const dry = plan(await mount('0.0')).rain?.intensity ?? 0; // 0.9: the name of the icon, as if there were no gauge
    expect(dry).toBeLessThanOrEqual(drizzle);
  });
});
