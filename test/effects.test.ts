import { describe, it, expect } from 'vitest';
import { effectPlan, effectsHtml, EFFECTS_CSS, type EffectsInput } from '../src/effects';

// What the weather looks like behind the overview: which layers there are, how many, how
// fast and how strong. It is decided here, from the name the card settled on for its icon
// (so the picture and the effect cannot disagree) and from what the sensors measure, and
// drawn by CSS alone. This file tests the decision, not the look.

const base: EffectsInput = { iconName: 'clear-day', night: false, rainRateMmH: null, cloudFraction: null, beaufort: null, lightningKm: null, temperatureC: null, visibilityKm: null, sunElevation: null, sunMorning: null, minutesSinceRain: null, quality: 'full' };
const plan = (over: Partial<EffectsInput>) => effectPlan({ ...base, ...over });

describe('when there is nothing to draw', () => {
  it('is off when it is off', () => {
    expect(plan({ quality: 'off' })).toBeNull();
  });
  it('says nothing for a condition it has no picture of', () => {
    expect(plan({ iconName: 'unknown' })).toBeNull();
    expect(plan({ iconName: '' })).toBeNull();
  });
});

describe('a clear sky', () => {
  it('has a glow by day, and nothing else', () => {
    const p = plan({ iconName: 'clear-day' })!;
    expect(p.sky).toBe('clear');
    expect(p.glow).toBe(true);
    expect(p.stars).toBe(false);
    expect(p.clouds).toBe(0);
    expect(p.rain).toBeNull();
    expect(p.snow).toBeNull();
  });
  it('has stars by night, and no glow', () => {
    const p = plan({ iconName: 'clear-night', night: true })!;
    expect(p.stars).toBe(true);
    expect(p.glow).toBe(false);
    expect(p.night).toBe(true);
  });
  it('is the same for frost', () => {
    expect(plan({ iconName: 'frost-night', night: true })!.sky).toBe('clear');
  });
});

describe('clouds', () => {
  it('are one, two or three by how much of the sky the icon says is covered', () => {
    expect(plan({ iconName: 'cloudy-1-day' })!.clouds).toBe(1);
    expect(plan({ iconName: 'cloudy-2-day' })!.clouds).toBe(2);
    expect(plan({ iconName: 'cloudy' })!.clouds).toBe(3);
    expect(plan({ iconName: 'cloudy-3-night', night: true })!.clouds).toBe(3);
  });
  it('are fewer in the subtle setting, and never more than the sky has', () => {
    expect(plan({ iconName: 'cloudy-2-day', quality: 'subtle' })!.clouds).toBe(1);
    expect(plan({ iconName: 'cloudy', quality: 'subtle' })!.clouds).toBe(2);
    expect(plan({ iconName: 'cloudy-1-day', quality: 'subtle' })!.clouds).toBe(1);
  });
  it('are thicker the more the sky is measured to be covered', () => {
    const thin = plan({ iconName: 'cloudy-2-day', cloudFraction: 0.3 })!.cloudOpacity;
    const thick = plan({ iconName: 'cloudy-2-day', cloudFraction: 0.8 })!.cloudOpacity;
    expect(thick).toBeGreaterThan(thin);
    expect(thin).toBeGreaterThan(0);
    expect(thick).toBeLessThanOrEqual(1);
  });
  it('have an opacity of their own where there is no measurement', () => {
    const o = plan({ iconName: 'cloudy' })!.cloudOpacity;
    expect(o).toBeGreaterThan(0);
    expect(o).toBeLessThanOrEqual(1);
  });
  it('drift faster in a stronger wind, and never stand still or race', () => {
    const calm = plan({ iconName: 'cloudy', beaufort: 0 })!.driftSeconds;
    const brisk = plan({ iconName: 'cloudy', beaufort: 6 })!.driftSeconds;
    const gale = plan({ iconName: 'cloudy', beaufort: 12 })!.driftSeconds;
    expect(brisk).toBeLessThan(calm);
    expect(gale).toBeLessThanOrEqual(brisk);
    expect(gale).toBeGreaterThanOrEqual(30);
    expect(calm).toBeLessThanOrEqual(160);
  });
  it('are not drawn at night as a bright white', () => {
    expect(effectsHtml(plan({ iconName: 'cloudy', night: true })!, 'overview')).toContain('data-night');
    expect(effectsHtml(plan({ iconName: 'cloudy' })!, 'overview')).not.toContain('data-night');
  });
});

describe('rain', () => {
  it('has a strength by the name of the icon: light, moderate, heavy', () => {
    const light = plan({ iconName: 'rainy-1-day' })!.rain!.intensity;
    const mid = plan({ iconName: 'rainy-2' })!.rain!.intensity;
    const heavy = plan({ iconName: 'rainy-3-day' })!.rain!.intensity;
    expect(light).toBeLessThan(mid);
    expect(mid).toBeLessThan(heavy);
  });
  it('follows the gauge where there is one, whatever the icon says', () => {
    const drizzle = plan({ iconName: 'rainy-3-day', rainRateMmH: 0.6 })!.rain!.intensity;
    const downpour = plan({ iconName: 'rainy-1-day', rainRateMmH: 14 })!.rain!.intensity;
    expect(drizzle).toBeLessThan(0.35);
    expect(downpour).toBe(1);
  });
  it('falls faster and thicker the harder it rains', () => {
    const light = plan({ iconName: 'rainy-1-day' })!.rain!;
    const heavy = plan({ iconName: 'rainy-3-day' })!.rain!;
    expect(heavy.fallSeconds).toBeLessThan(light.fallSeconds);
    expect(heavy.opacity).toBeGreaterThan(light.opacity);
  });
  it('has one layer in the subtle setting, and two when it is heavy in the full one', () => {
    expect(plan({ iconName: 'rainy-3-day', quality: 'subtle' })!.rain!.layers).toBe(1);
    expect(plan({ iconName: 'rainy-3-day', quality: 'full' })!.rain!.layers).toBe(2);
    expect(plan({ iconName: 'rainy-1-day', quality: 'full' })!.rain!.layers).toBe(1);
  });
  it('slants with the wind, and no more than a gale slants it', () => {
    const calm = plan({ iconName: 'rainy-2', beaufort: 0 })!.rain!.slantDeg;
    const windy = plan({ iconName: 'rainy-2', beaufort: 7 })!.rain!.slantDeg;
    const storm = plan({ iconName: 'rainy-2', beaufort: 12 })!.rain!.slantDeg;
    expect(windy).toBeGreaterThan(calm);
    expect(storm).toBeLessThanOrEqual(45);
    expect(storm).toBeGreaterThan(windy);
  });
  it('sits under a sky of cloud, never a clear one', () => {
    const p = plan({ iconName: 'rainy-2-day' })!;
    expect(p.clouds).toBeGreaterThanOrEqual(2);
    expect(p.glow).toBe(false);
    expect(p.stars).toBe(false);
  });
  it('is the same by night', () => {
    expect(plan({ iconName: 'rainy-2-night', night: true })!.rain).not.toBeNull();
  });
});

describe('snow, sleet and hail', () => {
  it('snow falls slowly, sways, and has no rain in it', () => {
    const p = plan({ iconName: 'snowy-3' })!;
    expect(p.snow).not.toBeNull();
    expect(p.rain).toBeNull();
    expect(p.snow!.fallSeconds).toBeGreaterThan(6);
    expect(p.snow!.swayPx).toBeGreaterThan(0);
  });
  it('sways more in a wind, until it is a blizzard', () => {
    expect(plan({ iconName: 'snowy-3', beaufort: 5 })!.snow!.swayPx).toBeGreaterThan(plan({ iconName: 'snowy-3', beaufort: 0 })!.snow!.swayPx);
  });
  it('sleet is snow with some rain in it, and rain and sleet is rain with some snow', () => {
    const a = plan({ iconName: 'snow-and-sleet-mix' })!;
    expect(a.snow).not.toBeNull();
    expect(a.rain).not.toBeNull();
    const b = plan({ iconName: 'rain-and-sleet-mix' })!;
    expect(b.rain!.intensity).toBeGreaterThan(plan({ iconName: 'snow-and-sleet-mix' })!.rain!.intensity);
    expect(b.snow).not.toBeNull();
  });
  it('hail is pellets, with some rain among them', () => {
    const p = plan({ iconName: 'hail' })!;
    expect(p.hail).not.toBeNull();
    expect(p.hail!.fallSeconds).toBeLessThan(2);
    expect(p.rain).not.toBeNull();
    expect(p.rain!.intensity).toBeLessThan(0.7);
  });
});

describe('storms', () => {
  it('flash, in the full setting only', () => {
    expect(plan({ iconName: 'scattered-thunderstorms-day', quality: 'full' })!.flash).toBe(true);
    expect(plan({ iconName: 'scattered-thunderstorms-day', quality: 'subtle' })!.flash).toBe(false);
    expect(plan({ iconName: 'isolated-thunderstorms-night', night: true })!.flash).toBe(true);
  });
  it('bring rain and a dark sky', () => {
    const p = plan({ iconName: 'scattered-thunderstorms-day' })!;
    expect(p.sky).toBe('storm');
    expect(p.rain).not.toBeNull();
    expect(p.clouds).toBeGreaterThanOrEqual(2);
  });
  it('a tropical storm is heavier, and fast', () => {
    const p = plan({ iconName: 'tropical-storm' })!;
    expect(p.rain!.intensity).toBeGreaterThan(0.8);
    expect(p.driftSeconds).toBeLessThanOrEqual(45);
  });
  it('no flash for rain without a storm', () => {
    expect(plan({ iconName: 'rainy-3-day' })!.flash).toBe(false);
  });
});

describe('lightning that a detector has seen', () => {
  // The icon is the provider's word for a storm; the detector says one is there, and how far. It flashes
  // on a clear sky too, because the storm is somewhere else.
  it('flashes under any sky, when a storm is in range, in both settings', () => {
    for (const quality of ['subtle', 'full'] as const) {
      expect(plan({ iconName: 'clear-day', lightningKm: 22, quality })!.flash, quality).toBe(true);
    }
    expect(plan({ iconName: 'cloudy', lightningKm: 22, quality: 'subtle' })!.flash).toBe(true);
    expect(plan({ iconName: 'clear-night', night: true, lightningKm: 30 })!.flash).toBe(true);
  });
  it('does not, when there is no storm, or no detector', () => {
    expect(plan({ iconName: 'clear-day', lightningKm: null })!.flash).toBe(false);
    expect(plan({ iconName: 'cloudy', lightningKm: null, quality: 'subtle' })!.flash).toBe(false);
  });
  it('is brighter and more often the closer it is, and no more than it is', () => {
    const at = (km: number) => plan({ iconName: 'clear-day', lightningKm: km })!;
    expect(at(8).flashPeak).toBeGreaterThan(at(22).flashPeak);
    expect(at(22).flashPeak).toBeGreaterThan(at(45).flashPeak);
    expect(at(8).flashSeconds).toBeLessThan(at(22).flashSeconds);
    expect(at(22).flashSeconds).toBeLessThan(at(45).flashSeconds);
    for (const km of [0, 8, 22, 45, 49, 200]) {
      // never so bright that it bleaches white text for the moment it lasts
      expect(at(km).flashPeak, `${km} km`).toBeLessThanOrEqual(0.65);
      expect(at(km).flashPeak, `${km} km`).toBeGreaterThanOrEqual(0.2);
      expect(at(km).flashSeconds, `${km} km`).toBeGreaterThanOrEqual(7);
      expect(at(km).flashSeconds, `${km} km`).toBeLessThanOrEqual(18);
    }
  });
  it('a distant storm is a faint, rare flicker: a long way off it hardly shows', () => {
    const far = plan({ iconName: 'clear-day', lightningKm: 45 })!;
    expect(far.flashPeak).toBeLessThan(0.35);
    expect(far.flashSeconds).toBeGreaterThan(14);
  });
  it('and the provider\'s storm and the detector\'s together flash as the stronger of the two', () => {
    const both = plan({ iconName: 'scattered-thunderstorms-day', lightningKm: 45 })!;
    const only = plan({ iconName: 'scattered-thunderstorms-day' })!;
    expect(both.flashPeak).toBe(only.flashPeak);
    expect(both.flashSeconds).toBe(only.flashSeconds);
  });
  it('a storm in the icon alone: full only, as it was, and as bright as the closest detected one', () => {
    const p = plan({ iconName: 'scattered-thunderstorms-day' })!;
    expect(p.flash).toBe(true);
    expect(p.flashPeak).toBe(0.65);
    expect(p.flashSeconds).toBe(9);
    expect(plan({ iconName: 'scattered-thunderstorms-day', quality: 'subtle' })!.flash).toBe(false);
  });
  it('is off when everything is, and a condition with no picture has none', () => {
    expect(plan({ iconName: 'clear-day', lightningKm: 5, quality: 'off' })).toBeNull();
    expect(plan({ iconName: 'unknown', lightningKm: 5 })).toBeNull();
  });
  it('the flash layer is there, with its strength as a property, and no stray numbers', () => {
    const html = effectsHtml(plan({ iconName: 'clear-day', lightningKm: 22 })!, 'overview');
    expect(html).toContain('fx-flash');
    expect(html).toMatch(/--flash-peak:0\.\d+/);
    expect(html).not.toMatch(/undefined|NaN|null/);
  });
  it('and it is one trip of ten seconds, whose speed is set on it, not its length', () => {
    expect(EFFECTS_CSS).toMatch(/animation:\s*fx-flash\s+10s\s+linear\s+infinite/);
    expect(EFFECTS_CSS).toMatch(/rgba\(255,\s*255,\s*255,\s*var\(--flash-peak/);
  });
});

describe('a blizzard, which no provider has a word for: snow, and a wind', () => {
  const snow = (over: Partial<EffectsInput>) => plan({ iconName: 'snowy-3', ...over })!;
  it('is snow driven by a strong wind: from force six', () => {
    expect(snow({ beaufort: 5 }).blizzard).toBe(false);
    expect(snow({ beaufort: 6 }).blizzard).toBe(true);
    expect(snow({ beaufort: 11 }).blizzard).toBe(true);
    expect(snow({ beaufort: null }).blizzard).toBe(false);
  });
  it('and only snow: rain in a wind is not one, nor is sleet', () => {
    expect(plan({ iconName: 'rainy-3-day', beaufort: 9 })!.blizzard).toBe(false);
    expect(plan({ iconName: 'snow-and-sleet-mix', beaufort: 9 })!.blizzard).toBe(false);
  });
  it('flies almost sideways, faster and thicker, and does not sway', () => {
    const calm = snow({ beaufort: 2 }).snow!;
    const b = snow({ beaufort: 8 }).snow!;
    expect(calm.slantDeg).toBe(0);
    expect(b.slantDeg).toBeGreaterThanOrEqual(50);
    expect(b.slantDeg).toBeLessThanOrEqual(72);
    expect(b.fallSeconds).toBeLessThan(calm.fallSeconds);
    expect(b.opacity).toBeGreaterThan(calm.opacity);
    expect(b.swayPx).toBe(0);
  });
  it('slants more in a harder wind, and no more than that', () => {
    expect(snow({ beaufort: 10 }).snow!.slantDeg).toBeGreaterThan(snow({ beaufort: 6 }).snow!.slantDeg);
    expect(snow({ beaufort: 12 }).snow!.slantDeg).toBeLessThanOrEqual(72);
  });
  it('whites the sky out, the more the less one can see', () => {
    const at = (km: number | null) => snow({ beaufort: 8, visibilityKm: km });
    expect(at(0.3).fog).toBe(true);
    expect(at(0.3).fogOpacity).toBeGreaterThan(at(2).fogOpacity);
    expect(at(2).fogOpacity).toBeGreaterThan(at(8).fogOpacity);
    expect(at(null).fogOpacity).toBeGreaterThan(0.3);
    expect(snow({ beaufort: 2 }).fog).toBe(false);
  });
  it('and the clouds go over fast', () => {
    expect(snow({ beaufort: 9 }).driftSeconds).toBeLessThanOrEqual(45);
  });
});

describe('fog that is as thick as it is measured', () => {
  const fog = (km: number | null) => plan({ iconName: 'fog-day', visibilityKm: km })!;
  it('is thicker the less one can see, and thin where one can see far', () => {
    expect(fog(0.2).fogOpacity).toBeGreaterThan(fog(1).fogOpacity);
    expect(fog(1).fogOpacity).toBeGreaterThan(fog(3).fogOpacity);
    expect(fog(3).fogOpacity).toBeGreaterThan(fog(9).fogOpacity);
    expect(fog(9).fogOpacity).toBeGreaterThan(0);
  });
  it('is of a middling thickness where nothing measures it', () => {
    expect(fog(null).fogOpacity).toBeGreaterThan(0.3);
    expect(fog(null).fogOpacity).toBeLessThan(0.7);
  });
  it('is never so thick that it hides the card', () => {
    expect(fog(0).fogOpacity).toBeLessThanOrEqual(0.9);
  });
  it('is sand-coloured for dust, and plain for the rest', () => {
    expect(plan({ iconName: 'dust' })!.tint).toBe('dust');
    for (const n of ['fog-day', 'haze-night', 'clear-day', 'rainy-2']) expect(plan({ iconName: n })!.tint, n).toBe('plain');
  });
});

describe('ice: freezing rain and frost', () => {
  it('rain at or below freezing is freezing rain', () => {
    expect(plan({ iconName: 'rainy-3-day', temperatureC: 0 })!.freezing).toBe(true);
    expect(plan({ iconName: 'rainy-1-day', temperatureC: -4 })!.freezing).toBe(true);
    expect(plan({ iconName: 'rainy-3-day', temperatureC: 1 })!.freezing).toBe(false);
    expect(plan({ iconName: 'rainy-3-day', temperatureC: null })!.freezing).toBe(false);
  });
  it('and nothing else is: snow and a clear sky have no freezing rain', () => {
    expect(plan({ iconName: 'snowy-3', temperatureC: -5 })!.freezing).toBe(false);
    expect(plan({ iconName: 'clear-day', temperatureC: -5 })!.freezing).toBe(false);
  });
  it('a clear sky at or below freezing has frost, day or night', () => {
    expect(plan({ iconName: 'clear-day', temperatureC: -2 })!.frost).toBe(true);
    expect(plan({ iconName: 'clear-night', night: true, temperatureC: 0 })!.frost).toBe(true);
    expect(plan({ iconName: 'frost-night', night: true, temperatureC: -3 })!.frost).toBe(true);
  });
  it('and not above it, nor under cloud, nor without a temperature', () => {
    expect(plan({ iconName: 'clear-day', temperatureC: 1 })!.frost).toBe(false);
    expect(plan({ iconName: 'cloudy', temperatureC: -5 })!.frost).toBe(false);
    expect(plan({ iconName: 'clear-day', temperatureC: null })!.frost).toBe(false);
  });
});

describe('heat', () => {
  it('a clear or half clear day from thirty-three degrees shimmers', () => {
    expect(plan({ iconName: 'clear-day', temperatureC: 33 })!.heat).toBe(true);
    expect(plan({ iconName: 'cloudy-1-day', temperatureC: 38 })!.heat).toBe(true);
    expect(plan({ iconName: 'clear-day', temperatureC: 32.9 })!.heat).toBe(false);
  });
  it('not at night, not under cloud, not without a temperature', () => {
    expect(plan({ iconName: 'clear-night', night: true, temperatureC: 36 })!.heat).toBe(false);
    expect(plan({ iconName: 'cloudy', temperatureC: 36 })!.heat).toBe(false);
    expect(plan({ iconName: 'clear-day', temperatureC: null })!.heat).toBe(false);
  });
});

describe('golden hour', () => {
  const g = (elev: number | null, over: Partial<EffectsInput> = {}) => plan({ iconName: 'clear-day', sunElevation: elev, ...over })!.golden;
  it('is strongest with the sun just above the horizon, and gone high up or far below', () => {
    expect(g(2)).toBeGreaterThan(g(7));
    expect(g(2)).toBeGreaterThan(g(-3));
    expect(g(2)).toBeLessThanOrEqual(1);
    expect(g(25)).toBe(0);
    expect(g(-10)).toBe(0);
    expect(g(null)).toBe(0);
  });
  it('is weaker under cloud, and fainter still in rain and fog', () => {
    expect(g(2, { iconName: 'cloudy' })).toBeLessThan(g(2));
    expect(g(2, { iconName: 'rainy-3-day' })).toBeLessThan(g(2, { iconName: 'cloudy' }));
    expect(g(2, { iconName: 'fog-day' })).toBeLessThan(g(2, { iconName: 'cloudy' }));
  });
  it('knows a morning from an evening', () => {
    expect(plan({ iconName: 'clear-day', sunElevation: 2, sunMorning: true })!.goldenMorning).toBe(true);
    expect(plan({ iconName: 'clear-day', sunElevation: 2, sunMorning: false })!.goldenMorning).toBe(false);
  });
  it('comes also with the sun a little under the horizon, at dawn and dusk, when the sky is lit', () => {
    expect(plan({ iconName: 'clear-night', night: true, sunElevation: -2 })!.golden).toBeGreaterThan(0);
  });
});

describe('a rainbow', () => {
  const rb = (over: Partial<EffectsInput>) => plan({ iconName: 'cloudy-2-day', sunElevation: 20, minutesSinceRain: 4, ...over })!.rainbow;
  // The card holds rain on its icon for fifteen minutes after the last tick of the gauge; a rainbow cannot
  // sit behind a rain icon, so it has the time after that: from fifteen to forty minutes.
  it('comes when the rain has stopped and the sun is out, and fades over forty minutes', () => {
    expect(rb({})).toBeGreaterThan(0);
    expect(rb({ minutesSinceRain: 1 })).toBeGreaterThan(rb({ minutesSinceRain: 10 }));
    expect(rb({ minutesSinceRain: 10 })).toBeGreaterThan(rb({ minutesSinceRain: 19 }));
    expect(rb({ minutesSinceRain: 39 })).toBeGreaterThan(0);
    expect(rb({ minutesSinceRain: 41 })).toBe(0);
  });
  it('and never so strong that it is the first thing on the card', () => {
    expect(rb({ minutesSinceRain: 0 })).toBeLessThanOrEqual(0.6);
  });
  it('not while it rains, nor if the rain was long ago, nor if it is not known', () => {
    expect(rb({ minutesSinceRain: null })).toBe(0);
    expect(plan({ iconName: 'rainy-3-day', sunElevation: 20, minutesSinceRain: 3 })!.rainbow).toBe(0);
  });
  it('only with the sun high enough to make one, and low enough', () => {
    expect(rb({ sunElevation: 1 })).toBe(0);
    expect(rb({ sunElevation: 60 })).toBe(0);
    expect(rb({ sunElevation: null })).toBe(0);
  });
  it('only by day, and not under a sky that is all cloud', () => {
    expect(rb({ night: true })).toBe(0);
    expect(rb({ iconName: 'cloudy' })).toBe(0);
    expect(rb({ iconName: 'clear-day' })).toBeGreaterThan(0);
  });
});

describe('what the new layers say in the markup', () => {
  const html = (iconName: string, over: Partial<EffectsInput> = {}) => effectsHtml(plan({ iconName, ...over })!, 'card');
  it('each is there when it is wanted, and not when it is not', () => {
    expect(html('hail')).toContain('fx-hail');
    expect(html('rainy-3-day')).not.toContain('fx-hail');
    expect(html('clear-day', { temperatureC: -3 })).toContain('fx-frost');
    expect(html('clear-day', { temperatureC: 12 })).not.toContain('fx-frost');
    expect(html('clear-day', { temperatureC: 36 })).toContain('fx-heat');
    expect(html('clear-day', { sunElevation: 2 })).toContain('fx-golden');
    expect(html('clear-day', { sunElevation: 30 })).not.toContain('fx-golden');
    expect(html('cloudy-2-day', { sunElevation: 20, minutesSinceRain: 3 })).toContain('fx-rainbow');
    expect(html('cloudy-2-day', { sunElevation: 20 })).not.toContain('fx-rainbow');
  });
  it('freezing rain and dust are said on the layer, for the stylesheet', () => {
    expect(html('rainy-3-day', { temperatureC: -2 })).toContain('data-freezing');
    expect(html('rainy-3-day', { temperatureC: 6 })).not.toContain('data-freezing');
    expect(html('dust')).toContain('data-tint="dust"');
  });
  it('a blizzard has its snow slanted, and its whiteout, and no stray numbers', () => {
    const h = html('snowy-3', { beaufort: 9, visibilityKm: 0.5 });
    expect(h).toMatch(/--fx-snow-slant:\d+(\.\d+)?deg/);
    expect(h).toContain('fx-fog');
    expect(h).not.toMatch(/undefined|NaN|null/);
  });
  it('no new layer leaves a stray number in', () => {
    for (const n of ['hail', 'clear-day', 'cloudy-2-day', 'snowy-3', 'rainy-3-day', 'dust', 'fog-day']) {
      expect(html(n, { temperatureC: -3, visibilityKm: 1, sunElevation: 3, sunMorning: true, minutesSinceRain: 5, beaufort: 9 }), n).not.toMatch(/undefined|NaN|null/);
    }
  });
});

describe('fog, haze, dust and wind', () => {
  it('fog, haze and dust are a bank of fog', () => {
    for (const n of ['fog-day', 'haze-night', 'dust']) expect(plan({ iconName: n })!.fog, n).toBe(true);
  });
  it('and have no rain, no snow, no stars', () => {
    const p = plan({ iconName: 'fog-night', night: true })!;
    expect(p.rain).toBeNull();
    expect(p.stars).toBe(false);
  });
  it('wind is clouds that move fast', () => {
    const p = plan({ iconName: 'wind', beaufort: 2 })!;
    expect(p.clouds).toBeGreaterThanOrEqual(2);
    expect(p.driftSeconds).toBeLessThanOrEqual(60);
  });
});

describe('the markup', () => {
  const all = ['clear-day', 'clear-night', 'cloudy-1-day', 'cloudy', 'rainy-3-day', 'rainy-1-night', 'snowy-3', 'snow-and-sleet-mix', 'scattered-thunderstorms-day', 'fog-day', 'wind', 'hail'];
  it('is hidden from a screen reader, and is not something to click', () => {
    for (const n of all) {
      const html = effectsHtml(plan({ iconName: n, night: /night/.test(n) })!, 'overview');
      expect(html, n).toContain('aria-hidden="true"');
    }
    expect(EFFECTS_CSS).toMatch(/\.fx\s*\{[^}]*pointer-events:\s*none/);
  });
  it('has exactly the layers the plan asks for', () => {
    const html = effectsHtml(plan({ iconName: 'rainy-3-day' })!, 'overview');
    expect(html.match(/class="fx-rain fx-rain-\d"/g)).toHaveLength(2);
    expect(html.match(/class="fx-cloud"/g)!.length).toBeGreaterThanOrEqual(2);
    expect(html).not.toContain('fx-snow');
    expect(html).not.toContain('fx-flash');
    const clear = effectsHtml(plan({ iconName: 'clear-day' })!, 'overview');
    expect(clear).not.toContain('class="fx-cloud"');
    expect(clear).toContain('fx-glow');
  });
  it('says which part of the card it covers', () => {
    expect(effectsHtml(plan({})!, 'overview')).toContain('fx-overview');
    expect(effectsHtml(plan({})!, 'card')).toContain('fx-card');
  });
  it('carries the numbers as properties, with no stray undefined or NaN', () => {
    for (const n of all) {
      const html = effectsHtml(plan({ iconName: n, beaufort: 5, rainRateMmH: 1.2, cloudFraction: 0.6, night: /night/.test(n) })!, 'card');
      expect(html, n).not.toMatch(/undefined|NaN|null/);
    }
  });
});

describe('the look of the edges', () => {
  it('the layer behind the top part reaches past the section and fades out downwards: no box', () => {
    expect(EFFECTS_CSS).toMatch(/\.fx-overview\s*\{[^}]*inset:\s*-\d+px\s+-\d+px\s+0\s+-\d+px/);
    expect(EFFECTS_CSS).toMatch(/\.fx-overview\s*\{[^}]*mask-image:\s*linear-gradient\(to bottom,[^)]*transparent/);
  });
  it('the host does not clip it: the card does', () => {
    const host = /\.fx-host\s*\{([^}]*)\}/.exec(EFFECTS_CSS)![1];
    expect(host).toContain('position: relative');
    expect(host).not.toContain('overflow');
  });
  it('fog fades at the top and the bottom, so that it has no edge', () => {
    expect(EFFECTS_CSS).toMatch(/\.fx-fog\s*\{[^}]*mask-image:\s*linear-gradient\(to bottom,\s*transparent/);
  });
});

describe('clouds that suit a card of any height and any theme', () => {
  // seen on a whole card: sized by the card's height they became two huge blurred blobs, and white
  // ones, behind white text
  it('are sized by their width, not by the height of what they sit in', () => {
    const cloud = /\.fx-cloud\s*\{([^}]*)\}/.exec(EFFECTS_CSS)![1];
    expect(cloud).toMatch(/aspect-ratio:/);
    expect(cloud).not.toMatch(/height:\s*\d+%/);
  });
  it('sit in the sky: a distance from the top in pixels, so a tall card does not spread them down it', () => {
    const html = effectsHtml(plan({ iconName: 'cloudy' })!, 'card');
    const ys = [...html.matchAll(/--y:(\d+)(\w+)/g)];
    expect(ys.length).toBeGreaterThan(0);
    for (const m of ys) { expect(m[2]).toBe('px'); expect(+m[1]).toBeLessThan(120); }
  });
  it('take their colour from the card\'s own theme, so they sit under its text and not against it', () => {
    expect(EFFECTS_CSS).toMatch(/--fx-cloud:[^;]*color-mix\([^;]*var\(--fx-ink/);
    expect(EFFECTS_CSS).toMatch(/--fx-ink:\s*var\(--primary-text-color/);
    expect(EFFECTS_CSS).toMatch(/--fx-bg:\s*var\(--ha-card-background/);
    // never a plain white
    expect(EFFECTS_CSS).not.toMatch(/--fx-cloud:\s*rgba\(\s*255,\s*255,\s*255/);
  });
  it('are fainter over the whole card than behind the top part, where there is more text over them', () => {
    const op = (area: 'overview' | 'card') => +(/--fx-cloud-op:([\d.]+)/.exec(effectsHtml(plan({ iconName: 'cloudy' })!, area))![1]);
    expect(op('card')).toBeLessThan(op('overview'));
  });
  it('are never so thick that they cover what they sit behind', () => {
    for (const n of ['cloudy', 'cloudy-3-day', 'rainy-3-day', 'scattered-thunderstorms-day']) {
      expect(plan({ iconName: n, cloudFraction: 1 })!.cloudOpacity, n).toBeLessThanOrEqual(0.7);
    }
  });
});

describe('a tint and a fog that suit the theme', () => {
  // measured on the demo: white-ish fog gave white text 2.6:1, and a fixed dark navy tint behind dark text
  // in a light theme 3.8:1; a reader needs 4.5:1
  it('the sky\'s tint is the card\'s own colour, darkened: no fixed colour in it', () => {
    const rules = EFFECTS_CSS.split('\n').filter((l) => /\.fx-sky/.test(l) && /background/.test(l));
    expect(rules.length).toBeGreaterThan(3);
    for (const r of rules) expect(r, r).not.toMatch(/rgba?\(/);
    expect(EFFECTS_CSS).toMatch(/--fx-dim:\s*color-mix\(in srgb,\s*#000[^;]*var\(--fx-bg\)/);
  });
  it('fog is a tint of the theme too, not a fixed pale colour', () => {
    expect(EFFECTS_CSS).toMatch(/--fx-fog:\s*color-mix\(in srgb,\s*var\(--fx-ink\)/);
    const fog = /\.fx-fog\s*\{[^}]*background-image:([^;]*);/.exec(EFFECTS_CSS)![1];
    expect(fog).toContain('var(--fx-fog)');
    expect(fog).not.toMatch(/rgba\(\s*22\d/);
  });
  it('a storm cloud has only a little black in it by day, so that dark text can still be read over it', () => {
    const n = +/data-sky="storm"\]\s*\{\s*--fx-cloud:\s*color-mix\(in srgb,\s*#000\s+(\d+)%/.exec(EFFECTS_CSS)![1];
    expect(n).toBeLessThanOrEqual(15);
  });
});

describe('rain and snow on a light card as well as a dark one', () => {
  const tile = (name: string) => decodeURIComponent(new RegExp(`--fx-${name}:\\s*url\\("data:image/svg\\+xml,([^"]+)"\\)`).exec(EFFECTS_CSS)![1]);
  it('rain is a mid blue, which shows on both, not a pale one that vanishes on white', () => {
    for (const n of ['rain-1', 'rain-2']) {
      const colours = [...tile(n).matchAll(/stroke="rgb\((\d+),(\d+),(\d+)\)"/g)];
      expect(colours.length, n).toBeGreaterThan(0);
      for (const c of colours) expect(+c[1], `${n}: red channel`).toBeLessThanOrEqual(190);
    }
  });
  it('snow has an outline, so that a white flake shows on a light card', () => {
    for (const n of ['snow-1', 'snow-2']) expect(tile(n), n).toMatch(/stroke="rgb\(\d+,\d+,\d+\)"/);
  });
});

describe('a whiteout that shows', () => {
  it('a blizzard says so on the layer, and its fog is paler than an ordinary one', () => {
    expect(effectsHtml(plan({ iconName: 'snowy-3', beaufort: 9 })!, 'card')).toContain('data-blizzard');
    expect(effectsHtml(plan({ iconName: 'snowy-3', beaufort: 2 })!, 'card')).not.toContain('data-blizzard');
    expect(effectsHtml(plan({ iconName: 'fog-day' })!, 'card')).not.toContain('data-blizzard');
    const mix = (sel: string) => +new RegExp(`${sel}\\s*\\{\\s*--fx-fog:\\s*color-mix\\(in srgb,\\s*var\\(--fx-ink\\)\\s+(\\d+)%`).exec(EFFECTS_CSS)![1];
    expect(mix('\\.fx\\[data-blizzard\\]')).toBeGreaterThan(30);
  });
});

describe('layers that sit inside another', () => {
  // seen on the demo: the snow wrapper was moved into a rotating one and stopped being a direct child of
  // the layer, which is what made every layer absolute, so the snow had no height and was not there
  it('every layer that is not a direct child of the effect is positioned by a rule of its own', () => {
    const html = effectsHtml(plan({ iconName: 'snowy-3', beaufort: 9, visibilityKm: 1 })!, 'card');
    const box = document.createElement('div'); box.innerHTML = html;
    const nested = [...box.querySelectorAll('.fx *')].filter((e) => e.parentElement && !e.parentElement.classList.contains('fx'));
    const wrappers = nested.filter((e) => e.children.length > 0).map((e) => [...e.classList][0]);
    expect(wrappers).toContain('fx-snow-wrap');
    for (const cls of wrappers) {
      const rule = new RegExp(`\\.${cls}\\s*\\{([^}]*)\\}`).exec(EFFECTS_CSS);
      expect(rule, `${cls} has no rule`).not.toBeNull();
      expect(rule![1], `${cls} is not positioned`).toMatch(/position:\s*absolute|inset:/);
    }
  });
  it('and the snow wrapper is absolute, with a size', () => {
    const rule = /\.fx-snow-wrap\s*\{([^}]*)\}/.exec(EFFECTS_CSS)![1];
    expect(rule).toMatch(/position:\s*absolute/);
    expect(rule).toMatch(/inset:\s*0/);
  });
});

describe('the stylesheet', () => {
  it('moves nothing when the reader asks for less motion: every animation sits inside a no-preference query', () => {
    const outside = EFFECTS_CSS.replace(/@media \(prefers-reduced-motion: no-preference\)\s*\{([\s\S]*?)\n\}\n?/g, '');
    expect(outside, 'an animation outside the query').not.toMatch(/animation\s*:/);
    expect(EFFECTS_CSS).toMatch(/@media \(prefers-reduced-motion: no-preference\)/);
  });
  it('animates only transform and opacity, which the graphics card does by itself', () => {
    const keyframes = [...EFFECTS_CSS.matchAll(/@keyframes\s+[\w-]+\s*\{([\s\S]*?)\n\s*\}\s*(?=@|\n|$)/g)].map((m) => m[1]);
    expect(keyframes.length).toBeGreaterThan(4);
    for (const body of keyframes) {
      const props = [...body.matchAll(/([a-z-]+)\s*:/g)].map((m) => m[1]);
      for (const prop of props) expect(['transform', 'opacity'], `keyframes animate ${prop}`).toContain(prop);
    }
  });
  it('has a keyframe for every animation it names', () => {
    const named = new Set([...EFFECTS_CSS.matchAll(/animation\s*:\s*([\w-]+)/g)].map((m) => m[1]));
    const defined = new Set([...EFFECTS_CSS.matchAll(/@keyframes\s+([\w-]+)/g)].map((m) => m[1]));
    for (const n of named) expect(defined.has(n), n).toBe(true);
  });
});
