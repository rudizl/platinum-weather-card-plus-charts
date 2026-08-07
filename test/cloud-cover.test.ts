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

describe('the icon correction has three bands', () => {
  // Correcting only at the extremes left the common case wrong: a provider
  // claiming full sun while the sensor reads half the expected light.
  const band = (cloud: number, wasClear: boolean): string => {
    if (wasClear && cloud >= 0.8) return 'overcast';
    if (wasClear && cloud >= 0.45) return 'partly';
    if (!wasClear && cloud <= 0.15) return 'clear';
    if (!wasClear && cloud <= 0.45) return 'partly';
    return 'unchanged';
  };

  it('leaves a clear claim alone under light cloud', () => {
    expect(band(0.2, true)).toBe('unchanged');
    expect(band(0.44, true)).toBe('unchanged');
  });

  it('softens a clear claim to partly cloudy in between', () => {
    // The case that prompted this: 58% cloud measured under a 'sunny' claim.
    expect(band(0.45, true)).toBe('partly');
    expect(band(0.58, true)).toBe('partly');
    expect(band(0.79, true)).toBe('partly');
  });

  it('goes all the way to overcast only past 80%', () => {
    expect(band(0.8, true)).toBe('overcast');
    expect(band(0.95, true)).toBe('overcast');
  });

  it('corrects an overcast claim in the other direction too', () => {
    expect(band(0.05, false)).toBe('clear');
    expect(band(0.3, false)).toBe('partly');
    expect(band(0.6, false)).toBe('unchanged');
  });
});

describe('the icon correction follows ordinary cloud bands', () => {
  // Wide safety margins were the wrong instinct: correcting only at the extremes
  // left the common case wrong — a provider claiming full sun while the sky is
  // half covered — and a sensor reading badly enough to matter is one to clean,
  // not a reason to distrust it while still showing its number in a slot.
  const band = (cloud: number) =>
    cloud < 0.25 ? 'clear' : cloud < 0.55 ? 'cloudy-1' : cloud < 0.85 ? 'cloudy-2' : 'cloudy-3';

  it('calls a nearly clear sky clear', () => {
    expect(band(0)).toBe('clear');
    expect(band(0.2)).toBe('clear');
  });

  it('calls a half-covered sky cloudy rather than sunny or overcast', () => {
    // The reading that prompted this: 150 W/m² where a clear sky at 29° of
    // elevation gives 370, so 59% — visibly cloudy, and the provider said sunny.
    expect(band(0.59)).toBe('cloudy-2');
  });

  it('reserves the heaviest icon for genuine overcast', () => {
    expect(band(0.9)).toBe('cloudy-3');
    expect(band(1)).toBe('cloudy-3');
  });

  it('moves through the bands in order', () => {
    const order = ['clear', 'cloudy-1', 'cloudy-2', 'cloudy-3'];
    let last = -1;
    for (let c = 0; c <= 1.001; c += 0.05) {
      const idx = order.indexOf(band(Math.min(c, 1)));
      expect(idx, `${c} produced an unknown band`).toBeGreaterThanOrEqual(0);
      expect(idx, `${c} went backwards`).toBeGreaterThanOrEqual(last);
      last = idx;
    }
  });

  it('matches the measurement the slot would show', () => {
    // Slot and icon must agree: both read measuredCloudFraction.
    const elev = 29;
    const clear = clearSkyIrradiance(elev);
    const f = cloudCoverFraction(clear * 0.41, elev)!;
    expect(Math.round(f * 100)).toBeGreaterThan(50);
    expect(band(f)).toBe('cloudy-2');
  });
});

describe('the icon does not flicker in broken cloud', () => {
  // Real readings from a morning of broken cloud, thirty seconds apart: the
  // instantaneous value swings from 181 to 513 W/m² within three minutes, which
  // is the whole icon range. The sky is not changing that fast — sun through a
  // gap is still broken cloud — so the measurement is averaged and the band
  // boundaries carry hysteresis.
  const readings = [
    335.91, 264.56, 237.81, 270.32, 440.41, 470.17, 271.98, 252.25, 243.73,
    404.97, 378.85, 217.92, 211.76, 203.55, 198.42, 193.37, 188.56, 184.37,
    181.61, 180.98, 181.85, 184.37, 188.16, 193.29, 198.74, 207.34, 212.0,
    215.47, 218.31, 220.6, 227.31, 227.94, 242.38, 394.95, 300.0, 413.34,
    355.49, 238.67, 286.42, 393.29, 480.19, 504.03, 511.6, 512.63, 460.62,
    509.55, 500.71, 448.38, 310.34, 412.94, 296.92,
  ];
  const CLEAR_SKY = 387; // sun at about 30° of elevation

  function countSwitches(average: boolean, hysteresis: boolean): number {
    const EDGES = [0.25, 0.55, 0.85];
    const MARGIN = 0.05;
    const window: number[] = [];
    let band: number | null = null;
    let previous: number | null = null;
    let switches = 0;
    for (const reading of readings) {
      const instant = Math.max(0, Math.min(1, 1 - reading / CLEAR_SKY));
      window.push(instant);
      if (window.length > 30) window.shift();
      const cloud = average ? window.reduce((a, b) => a + b, 0) / window.length : instant;
      let target = EDGES.filter((e) => cloud >= e).length;
      if (hysteresis && band !== null && target !== band) {
        const edge = EDGES[Math.min(band, target)];
        if (Math.abs(cloud - edge) < MARGIN) target = band;
      }
      band = target;
      if (previous !== null && target !== previous) switches += 1;
      previous = target;
    }
    return switches;
  }

  it('would flicker without smoothing', () => {
    // Establishes that the test data genuinely exercises the problem.
    expect(countSwitches(false, false)).toBeGreaterThan(5);
  });

  it('settles down once the reading is averaged and the bands hold', () => {
    expect(countSwitches(true, true)).toBeLessThanOrEqual(2);
  });

  it('needs both: averaging alone still leaves it restless', () => {
    expect(countSwitches(true, false)).toBeGreaterThan(countSwitches(true, true));
  });
});
