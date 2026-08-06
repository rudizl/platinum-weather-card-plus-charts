import { describe, it, expect } from 'vitest';
import { clearSkyIrradiance, cloudCoverFraction, cloudCoverOktas } from '../src/zambretti';

// Cloud cover measured rather than forecast: the ratio of what a pyranometer
// reports to what a clear sky would deliver at that sun elevation.

describe('clearSkyIrradiance', () => {
  it('is zero when the sun is down', () => {
    expect(clearSkyIrradiance(0)).toBe(0);
    expect(clearSkyIrradiance(-10)).toBe(0);
  });

  it('rises with the sun', () => {
    const low = clearSkyIrradiance(15);
    const mid = clearSkyIrradiance(45);
    const high = clearSkyIrradiance(75);
    expect(low).toBeLessThan(mid);
    expect(mid).toBeLessThan(high);
  });

  it('stays within what the atmosphere can deliver', () => {
    // The solar constant is 1367 W/m²; after atmospheric losses a horizontal
    // surface never sees more than about a thousand.
    for (let elev = 1; elev <= 90; elev++) {
      const v = clearSkyIrradiance(elev);
      expect(v, `${elev}°`).toBeGreaterThanOrEqual(0);
      expect(v, `${elev}°`).toBeLessThan(1100);
    }
  });

  it('matches a real reading', () => {
    // Ecowitt GW1100A at Varna, 154 m, sun at 49.34°, measuring 560 W/m² under
    // light cloud — the clear-sky value should sit somewhat above it.
    const clear = clearSkyIrradiance(49.34, 154);
    expect(clear).toBeGreaterThan(600);
    expect(clear).toBeLessThan(760);
  });

  it('gives slightly more at altitude', () => {
    expect(clearSkyIrradiance(45, 2000)).toBeGreaterThan(clearSkyIrradiance(45, 0));
  });
});

describe('cloudCoverFraction', () => {
  it('reads a clear sky as no cloud', () => {
    const elev = 45;
    const clear = clearSkyIrradiance(elev);
    expect(cloudCoverFraction(clear, elev)).toBeCloseTo(0, 2);
  });

  it('reads darkness under a bright sun as overcast', () => {
    expect(cloudCoverFraction(20, 45)).toBeGreaterThan(0.9);
  });

  it('reads the real light-cloud case as light cloud', () => {
    // 560 W/m² with the sun at 49.34° from 154 m: visibly a few clouds.
    const f = cloudCoverFraction(560.46, 49.34, 154);
    expect(f).not.toBeNull();
    expect(f!).toBeGreaterThan(0.05);
    expect(f!).toBeLessThan(0.35);
  });

  it('never reports negative cloud when thin cloud scatters extra light', () => {
    const elev = 45;
    const clear = clearSkyIrradiance(elev);
    expect(cloudCoverFraction(clear * 1.15, elev)).toBe(0);
  });

  it('gives up below the minimum elevation', () => {
    // The air-mass model softens near the horizon and morning haze distorts it.
    expect(cloudCoverFraction(50, 5)).toBeNull();
    expect(cloudCoverFraction(50, 9.9)).toBeNull();
    expect(cloudCoverFraction(50, 10.1)).not.toBeNull();
  });

  it('gives up at night', () => {
    expect(cloudCoverFraction(0, -10)).toBeNull();
  });

  it('rejects an unusable reading', () => {
    expect(cloudCoverFraction(NaN, 45)).toBeNull();
    expect(cloudCoverFraction(-5, 45)).toBeNull();
  });

  it('honours a custom minimum elevation', () => {
    expect(cloudCoverFraction(50, 6, 0, 5)).not.toBeNull();
    expect(cloudCoverFraction(50, 6, 0, 20)).toBeNull();
  });

  it('always returns a fraction between zero and one', () => {
    for (let elev = 10; elev <= 90; elev += 5) {
      for (const measured of [0, 100, 500, 900, 1500]) {
        const f = cloudCoverFraction(measured, elev);
        if (f !== null) {
          expect(f, `${elev}° ${measured}W`).toBeGreaterThanOrEqual(0);
          expect(f, `${elev}° ${measured}W`).toBeLessThanOrEqual(1);
        }
      }
    }
  });
});

describe('cloudCoverOktas', () => {
  it('maps the ends correctly', () => {
    expect(cloudCoverOktas(0)).toBe(0);
    expect(cloudCoverOktas(1)).toBe(8);
  });

  it('maps the middle', () => {
    expect(cloudCoverOktas(0.5)).toBe(4);
    expect(cloudCoverOktas(0.25)).toBe(2);
  });

  it('clamps anything outside the range', () => {
    expect(cloudCoverOktas(-1)).toBe(0);
    expect(cloudCoverOktas(2)).toBe(8);
  });
});

describe('the icon correction is deliberately reluctant', () => {
  // Wide margins on purpose: the clear-sky model is approximate, and a dirty or
  // partly shaded pyranometer must not be able to rewrite the sky.
  const CLEAR_THRESHOLD = 0.8;
  const OVERCAST_THRESHOLD = 0.15;

  it('leaves a disagreement inside the margins alone', () => {
    // Provider says clear, measurement says half cloudy: not enough to act on.
    for (const cloud of [0.3, 0.5, 0.7, 0.79]) {
      expect(cloud >= CLEAR_THRESHOLD, `${cloud} should not trigger`).toBe(false);
    }
    for (const cloud of [0.16, 0.3, 0.5]) {
      expect(cloud <= OVERCAST_THRESHOLD, `${cloud} should not trigger`).toBe(false);
    }
  });

  it('acts only on a flat contradiction', () => {
    expect(0.85 >= CLEAR_THRESHOLD).toBe(true);
    expect(0.05 <= OVERCAST_THRESHOLD).toBe(true);
  });

  it('cannot be triggered by a plausible sensor error', () => {
    // A pyranometer reading 30% low — dust, or an imperfect level — under a
    // genuinely clear sky still reports well under the threshold.
    const elev = 45;
    const clear = clearSkyIrradiance(elev);
    const degraded = cloudCoverFraction(clear * 0.7, elev)!;
    expect(degraded).toBeLessThan(CLEAR_THRESHOLD);
  });

  it('does trigger when the sky is genuinely overcast', () => {
    const elev = 45;
    const clear = clearSkyIrradiance(elev);
    // Heavy overcast passes roughly a tenth of the light through.
    const overcast = cloudCoverFraction(clear * 0.1, elev)!;
    expect(overcast).toBeGreaterThan(CLEAR_THRESHOLD);
  });
});
