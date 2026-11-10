// Находка 8: PM в mg/m³.
import { describe, it, expect } from 'vitest';
import { Any, clean, makeHass, baseConfig, renderCard, allText } from './_util';
clean();

describe('8. particulates in milligrams', () => {
  it('0.2 mg/m³ is not shown as 0', async () => {
    const el = (await renderCard(baseConfig({ section_order: ['warnings', 'slots'], slot_l1: 'pm10', entity_pm10: 'sensor.pm10' } as never),
      makeHass({ 'sensor.pm10': { state: '0.2', attributes: { unit_of_measurement: 'mg/m³' } } }))) as Any;
    expect(allText(el)).not.toMatch(/PM10\s+0\s+mg/);
  });
  it('and 200 µg/m³ written as 0.2 mg/m³ is very poor air: a warning, as for 200 µg/m³', async () => {
    const mount = async (state: string, unit: string) => (await renderCard(baseConfig({ section_order: ['warnings', 'slots'], slot_l1: 'pm10', entity_pm10: 'sensor.pm10' } as never),
      makeHass({ 'sensor.pm10': { state, attributes: { unit_of_measurement: unit } } }))) as Any;
    expect((await mount('200', 'µg/m³')).shadowRoot.querySelector('.air-warning')).not.toBeNull();
    expect((await mount('0.2', 'mg/m³')).shadowRoot.querySelector('.air-warning')).not.toBeNull();
  });
});
