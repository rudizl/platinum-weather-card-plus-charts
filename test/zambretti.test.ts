import { describe, it, expect } from 'vitest';
import {
  zambrettiLetter,
  pressureToHpa,
  seaLevelPressure,
  windSpeedToKmh,
  tidalTrendHpaPerHour,
} from '../src/zambretti';

describe('zambrettiLetter', () => {
  // The three branches of the algorithm, at a pressure well inside each one.
  it('reads high steady pressure as settled', () => {
    expect(zambrettiLetter(1030, 7, null, 0, true)).toBe('a');
  });

  it('reads low falling pressure as stormy', () => {
    const letter = zambrettiLetter(995, 1, 225, -0.5, true);
    expect(letter).not.toBeNull();
    // letters are ordered worst-last; anything past 'u' is the stormy end
    expect(letter! >= 'u').toBe(true);
  });

  it('gives a better outlook when pressure is rising than when falling', () => {
    const rising = zambrettiLetter(1010, 7, null, 0.3, true)!;
    const falling = zambrettiLetter(1010, 7, null, -0.3, true)!;
    expect(rising < falling).toBe(true);
  });

  // Wind direction moves the effective pressure by up to ±8.35 hPa, which is
  // the whole reason an unsteady bearing had to be gated out.
  it('treats a southerly wind as worse than a northerly one', () => {
    const north = zambrettiLetter(1015, 7, 0, 0, true)!;
    const south = zambrettiLetter(1015, 7, 180, 0, true)!;
    expect(south > north).toBe(true);
  });

  it('mirrors the wind correction in the southern hemisphere', () => {
    const northN = zambrettiLetter(1015, 7, 0, 0, true);
    const southS = zambrettiLetter(1015, 1, 180, 0, false);
    // a southerly in the south behaves like a northerly in the north
    expect(southS).toBe(northN);
  });

  it('always returns a letter within the table', () => {
    for (let p = 940; p <= 1060; p += 5) {
      for (const trend of [-0.5, 0, 0.5]) {
        for (const month of [1, 7]) {
          const l = zambrettiLetter(p, month, null, trend, true);
          expect(l).not.toBeNull();
          expect(l!).toMatch(/^[a-z]$/);
        }
      }
    }
  });

  it('rejects unusable pressure readings', () => {
    expect(zambrettiLetter(NaN, 7, null, 0, true)).toBeNull();
    expect(zambrettiLetter(0, 7, null, 0, true)).toBeNull();
    expect(zambrettiLetter(-5, 7, null, 0, true)).toBeNull();
  });

  it('ignores a non-finite wind bearing rather than producing garbage', () => {
    expect(zambrettiLetter(1015, 7, NaN, 0, true)).toBe(
      zambrettiLetter(1015, 7, null, 0, true),
    );
  });
});

describe('pressureToHpa', () => {
  it('converts the common units', () => {
    expect(pressureToHpa(29.92, 'inHg')).toBeCloseTo(1013.2, 1);
    expect(pressureToHpa(760, 'mmHg')).toBeCloseTo(1013.2, 0);
    expect(pressureToHpa(101.3, 'kPa')).toBeCloseTo(1013, 0);
    expect(pressureToHpa(101300, 'Pa')).toBeCloseTo(1013, 0);
    expect(pressureToHpa(14.7, 'psi')).toBeCloseTo(1013.4, 0);
  });

  it('passes hPa and mbar through untouched', () => {
    expect(pressureToHpa(1013.2, 'hPa')).toBe(1013.2);
    expect(pressureToHpa(1013.2, 'mbar')).toBe(1013.2);
  });

  it('assumes hPa when the unit is missing or unknown', () => {
    expect(pressureToHpa(1013.2, undefined)).toBe(1013.2);
    expect(pressureToHpa(1013.2, 'nonsense')).toBe(1013.2);
  });

  it('is case and whitespace insensitive', () => {
    expect(pressureToHpa(29.92, ' INHG ')).toBeCloseTo(1013.2, 1);
  });
});

describe('seaLevelPressure', () => {
  // The real case that started this: a station at 154 m reading 1002.5 hPa
  // while the nearby airport reported QNH 1020.
  it('matches the observed station-versus-airport difference', () => {
    expect(seaLevelPressure(1002.5, 154, 25)).toBeCloseTo(1020, 0);
  });

  it('returns the reading unchanged at sea level', () => {
    expect(seaLevelPressure(1013.2, 0, 15)).toBe(1013.2);
  });

  it('corrects upward, and more so the higher the station', () => {
    const low = seaLevelPressure(1000, 100, 15);
    const high = seaLevelPressure(1000, 500, 15);
    expect(low).toBeGreaterThan(1000);
    expect(high).toBeGreaterThan(low);
  });

  it('needs less correction in warmer air', () => {
    const cold = seaLevelPressure(1000, 300, -10);
    const warm = seaLevelPressure(1000, 300, 30);
    expect(cold).toBeGreaterThan(warm);
  });
});

describe('windSpeedToKmh', () => {
  it('converts the units a station might report', () => {
    expect(windSpeedToKmh(10, 'm/s')).toBeCloseTo(36, 5);
    expect(windSpeedToKmh(10, 'mph')).toBeCloseTo(16.09, 1);
    expect(windSpeedToKmh(10, 'kn')).toBeCloseTo(18.52, 1);
    expect(windSpeedToKmh(10, 'ft/s')).toBeCloseTo(10.97, 1);
  });

  it('assumes km/h when the unit is missing or unknown', () => {
    expect(windSpeedToKmh(10, undefined)).toBe(10);
    expect(windSpeedToKmh(10, 'km/h')).toBe(10);
  });
});

describe('tidalTrendHpaPerHour', () => {
  const lat = 43.26;
  const lon = 28.01;

  it('stays within the amplitude the latitude allows', () => {
    // A = 1.16·cos²(lat) ≈ 0.62 hPa at 43°N, so the hourly slope cannot
    // exceed A·2π/12 ≈ 0.33 hPa/h whatever the hour.
    const max = (1.16 * Math.cos((lat * Math.PI) / 180) ** 2 * 2 * Math.PI) / 12;
    for (let h = 0; h < 24; h++) {
      const v = tidalTrendHpaPerHour(new Date(2026, 6, 1, h, 0, 0), lat, lon, 1);
      expect(Math.abs(v)).toBeLessThanOrEqual(max + 1e-9);
    }
  });

  it('is smaller near the equator than at mid latitudes', () => {
    const d = new Date(2026, 6, 1, 8, 0, 0);
    const equator = Math.abs(tidalTrendHpaPerHour(d, 0, lon, 1));
    const mid = Math.abs(tidalTrendHpaPerHour(d, 55, lon, 1));
    expect(equator).toBeGreaterThan(mid);
  });

  it('averages over the window, so a longer window is gentler at the extremes', () => {
    // The tide peaks near 10:00 and 22:00 solar time; at the steepest point a
    // three-hour mean must be less extreme than a one-hour mean.
    let maxOne = 0;
    let maxThree = 0;
    for (let h = 0; h < 24; h++) {
      const d = new Date(2026, 6, 1, h, 0, 0);
      maxOne = Math.max(maxOne, Math.abs(tidalTrendHpaPerHour(d, lat, lon, 1)));
      maxThree = Math.max(maxThree, Math.abs(tidalTrendHpaPerHour(d, lat, lon, 3)));
    }
    expect(maxThree).toBeLessThan(maxOne);
  });

  it('completes two full cycles a day', () => {
    // Sign changes mark the turning points: four of them in 24 hours.
    let changes = 0;
    let prev = Math.sign(tidalTrendHpaPerHour(new Date(2026, 6, 1, 0, 0, 0), lat, lon, 1));
    for (let m = 15; m < 24 * 60; m += 15) {
      const d = new Date(2026, 6, 1, Math.floor(m / 60), m % 60, 0);
      const s = Math.sign(tidalTrendHpaPerHour(d, lat, lon, 1));
      if (s !== 0 && s !== prev) {
        changes += 1;
        prev = s;
      }
    }
    expect(changes).toBe(4);
  });
});
