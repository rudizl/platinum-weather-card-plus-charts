// Находка 10: единици, които kmPer не познава, са километри.
import { describe, it, expect } from 'vitest';
import { kmPer } from '../../src/distance';

describe('10. units of distance', () => {
  it('a mile spelled out is a mile', () => {
    expect(kmPer('miles')).toBeCloseTo(1.609344, 6);
    expect(kmPer('mile')).toBeCloseTo(1.609344, 6);
  });
  it('millimetres and inches, which Home Assistant has as units of distance, are not kilometres', () => {
    expect(kmPer('mm')).toBeCloseTo(0.000001, 9);
    expect(kmPer('in')).toBeCloseTo(0.0000254, 9);
  });
});
