import { describe, it, expect } from 'vitest';
import { effectPlan, effectsHtml, EFFECTS_CSS, type EffectsInput } from '../src/effects';

// What the weather looks like behind the overview: which layers there are, how many, how
// fast and how strong. It is decided here, from the name the card settled on for its icon
// (so the picture and the effect cannot disagree) and from what the sensors measure, and
// drawn by CSS alone. This file tests the decision, not the look.

const base: EffectsInput = { iconName: 'clear-day', night: false, rainRateMmH: null, cloudFraction: null, beaufort: null, quality: 'full' };
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
    expect(storm).toBeLessThanOrEqual(30);
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
  it('sways more in a wind', () => {
    expect(plan({ iconName: 'snowy-3', beaufort: 8 })!.snow!.swayPx).toBeGreaterThan(plan({ iconName: 'snowy-3', beaufort: 0 })!.snow!.swayPx);
  });
  it('sleet is snow with some rain in it, and rain and sleet is rain with some snow', () => {
    const a = plan({ iconName: 'snow-and-sleet-mix' })!;
    expect(a.snow).not.toBeNull();
    expect(a.rain).not.toBeNull();
    const b = plan({ iconName: 'rain-and-sleet-mix' })!;
    expect(b.rain!.intensity).toBeGreaterThan(plan({ iconName: 'snow-and-sleet-mix' })!.rain!.intensity);
    expect(b.snow).not.toBeNull();
  });
  it('hail is heavy rain', () => {
    expect(plan({ iconName: 'hail' })!.rain!.intensity).toBeGreaterThan(0.7);
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
