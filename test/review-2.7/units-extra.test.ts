// Three holes the review of 2.7 found in the tests (M05, M06, M24): units that were right, but whose breaking no test caught.
import { describe, it, expect } from 'vitest';
import { kmPer } from '../../src/distance';
import { Any, clean, makeHass, baseConfig, renderCard } from './_util';
clean();

describe('units of distance', () => {
  it('a nautical mile and a foot', () => {
    expect(kmPer('nmi')).toBeCloseTo(1.852, 6);
    expect(kmPer('ft')).toBeCloseTo(0.0003048, 9);
  });
});

describe('visibility in feet', () => {
  it('is read as feet, not as kilometres', async () => {
    const el = (await renderCard(baseConfig({ entity_visibility: 'sensor.vis' } as never),
      makeHass({ 'sensor.vis': { state: '3280.84', attributes: { unit_of_measurement: 'ft' } } }))) as Any;
    expect(el._visibilityKm).toBeCloseTo(1, 2);
  });
});
