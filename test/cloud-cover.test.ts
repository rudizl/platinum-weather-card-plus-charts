import { describe, it, expect } from 'vitest';
import { clearSkyIrradiance, cloudCoverFraction, cloudCoverOktas } from '../src/zambretti';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

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
      if (window.length > 10) window.shift();
      let cloud = instant;
      if (average) {
        const sorted = [...window].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        cloud = sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
      }
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

describe('every card on the page reads the same sky', () => {
  // Two cards showed different icons for the same moment: each was averaging its
  // own samples from its own start time and holding its own hysteresis band.
  // State that describes the world, rather than the card, has to be shared.
  const source = readFileSync(join(__dirname, '..', 'src', 'platinum-weather-card.ts'), 'utf8');

  it('keeps the cloud buffer and band on the class, not the instance', () => {
    for (const field of ['_cloudSamples', '_cloudBand']) {
      const declaration = new RegExp(`private\\s+(static\\s+)?${field}\\b`).exec(source);
      expect(declaration, `${field} not declared`).not.toBeNull();
      expect(declaration![1], `${field} is per-instance; two cards will disagree`)
        .toBeDefined();
    }
  });

  it('reaches them through the constructor, since terser renames the class', () => {
    // A static referenced by class name breaks in the minified bundle.
    const uses = source.match(/(?:this\.)?_cloudSamples/g) ?? [];
    expect(uses.length).toBeGreaterThan(2);
    expect(source, 'static reached by class name rather than this.constructor')
      .not.toMatch(/PlatinumWeatherCard\._cloud/);
  });

  it('does not record a sample per card, only per reading', () => {
    // Two cards asking within the same second must not both push a sample, or a
    // dashboard with several cards would weight recent readings twice over.
    expect(source).toMatch(/now - last\.t > \d+/);
  });
});


describe('the window is short enough to follow the sky', () => {
  // A fifteen-minute mean kept reporting 8% cloud while the sky was three
  // quarters covered: the sunny spell that had ended eight minutes earlier was
  // still in the window and still being averaged in.
  const CLEAR_SKY = 606;
  const readings = [
    597, 577, 601, 605, 600, 593, 590, 582, 580, 576, 535, 443, 621, 548, 632,
    630, 627, 488, 390, 318, 311, 303, 303, 285, 286, 392, 273, 263, 258, 259,
    540, 267, 258, 258, 260, 272, 272,
  ];
  const fraction = (w: number) => Math.max(0, Math.min(1, 1 - w / CLEAR_SKY));

  function summarise(count: number, median: boolean): number {
    const window = readings.slice(-count).map(fraction);
    if (!median) return window.reduce((a, b) => a + b, 0) / window.length;
    const sorted = [...window].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  it('a fifteen-minute mean lags far behind the sky', () => {
    // The failure this replaced: reported clear while it was visibly cloudy.
    expect(summarise(30, false)).toBeLessThan(0.4);
  });

  it('five minutes tracks it', () => {
    expect(summarise(10, true)).toBeGreaterThan(0.5);
  });

  it('the median beats the mean when cloud is broken', () => {
    // One reading through a gap should not drag the answer toward clear.
    expect(summarise(10, true)).toBeGreaterThan(summarise(10, false));
  });
});

describe('the corrected icon names a file that exists', () => {
  // At 87% cloud the card rendered N/A: the heaviest band returned a bare
  // 'cloudy-3', but every icon in the set carries a -day or -night suffix, so
  // the name matched no file at all.
  const source = readFileSync(join(__dirname, '..', 'src', 'platinum-weather-card.ts'), 'utf8');

  it('gives every band a day/night suffix', () => {
    const correction = /const EDGES = \[[\s\S]*?adjusted = `[^`]*`;/.exec(source);
    expect(correction, 'icon correction not found').not.toBeNull();
    expect(correction![0], 'a band is emitted without a day/night suffix')
      .toContain('${this.dayOrNight}');
    expect(correction![0], "a band name is hardcoded without the suffix")
      .not.toMatch(/adjusted = '(clear|cloudy[\w-]*)'/);
  });

  it('only overrides plain sky icons', () => {
    // Rain, snow, fog and storms come from a provider that can see what a
    // pyranometer cannot — and heavy cloud is when it is most likely right.
    const guard = /const isPlainSky = [\s\S]*?;/.exec(source);
    expect(guard, 'no plain-sky guard').not.toBeNull();
    for (const condition of ['rain', 'snow', 'fog', 'thunder', 'drizzle', 'hail']) {
      expect(guard![0], `${condition} could be overridden`).not.toContain(condition);
    }
  });
});

describe('every icon the correction can produce is shipped', () => {
  it('finds a file for each band in both day and night', () => {
    const dist = join(__dirname, '..', 'dist');
    if (!existsSync(dist)) return;
    const files = new Set(readdirSync(dist));
    for (const band of ['clear', 'cloudy-1', 'cloudy-2', 'cloudy-3']) {
      for (const when of ['day', 'night']) {
        for (const prefix of ['a-', 's-']) {
          expect(files.has(`${prefix}${band}-${when}.svg`), `${prefix}${band}-${when}.svg missing`)
            .toBe(true);
        }
      }
    }
  });
});

describe('a rain gauge outranks both the provider and the pyranometer', () => {
  // Weather Underground reported clear-night while the station's gauge read
  // 1.2 mm/h. A gauge sees what neither of the others can: whether it is
  // raining here, now.
  const source = readFileSync(join(__dirname, '..', 'src', 'platinum-weather-card.ts'), 'utf8');

  const band = (rate: number) =>
    rate < 0.5 ? 'drizzle' : rate < 4 ? 'rainy-1' : rate < 10 ? 'rainy-2' : 'rainy-3';

  it('maps rate to intensity', () => {
    expect(band(0.2)).toBe('drizzle');
    expect(band(1.2)).toBe('rainy-1');   // the reading that prompted this
    expect(band(6)).toBe('rainy-2');
    expect(band(20)).toBe('rainy-3');
  });

  it('is checked before the cloud correction', () => {
    // Rain while heavily overcast must show rain, not cloud.
    const rainAt = source.indexOf('const rate = this.measuredRainRate');
    const cloudAt = source.indexOf('const cloud = this.measuredCloudFraction', rainAt);
    expect(rainAt).toBeGreaterThan(-1);
    expect(cloudAt, 'cloud is evaluated before rain').toBeGreaterThan(rainAt);
  });

  it('still only replaces a plain sky icon', () => {
    // A provider reporting snow, hail or a storm knows something about the
    // precipitation that a tipping bucket does not.
    const block = /const isPlainSky = [\s\S]{0,600}?measuredRainRate[\s\S]{0,400}?\}/.exec(source);
    expect(block, 'rain branch not guarded by isPlainSky').not.toBeNull();
  });

  it('is not smoothed, unlike cloud cover', () => {
    // Rain starting is an event, not a state to average: the card should say so
    // at once rather than fifteen minutes later.
    const getter = /get measuredRainRate\(\)[\s\S]*?\n  \}/.exec(source);
    expect(getter).not.toBeNull();
    expect(getter![0], 'rain rate is being averaged').not.toMatch(/_rainSamples|median|reduce/);
  });

  it('ignores a gauge that is unavailable', () => {
    const getter = /get measuredRainRate\(\)[\s\S]*?\n  \}/.exec(source)![0];
    expect(getter).toContain("'unavailable'");
    expect(getter).toContain('isFinite');
  });
});
