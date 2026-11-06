import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

// The big icon of the default pack starts at the top of the figures of the temperature for every condition (#40). The drawings of
// amCharts leave the place of the sun empty when there is none, so a plain cloud, the wind, fog, snow, a storm, the moon by night sat
// lower than the figures: the wind by 22.5 px, fog by 40. Each such icon has a viewBox now that raises the drawing by exactly that,
// and keeps its size (a viewBox of the same width and height as the icon, so nothing is scaled).
//
// Measured in Chromium as the card draws the icon, in the 140 by 120 box of the big icon on the background of a dark card, the first
// row that differs from it as an eye would see; over ten frames of the animation for an animated icon, so that a part that rises
// while it moves is not cut: the hurricane spins, and at some moment fills the box, so the animated one is not raised. After the fix
// every one of the 108 starts within a pixel of the sun, and in the card the top of the drawing is 0 to 2 px from the top of the
// figures for every condition. The amounts below are those of that measurement, in the units of each icon.

// in 2.7 the icons are in icons/ and the build puts them in the modules of the packs (#41)
const DIR = (name: string) => join(__dirname, '..', 'icons', name.startsWith('a-') ? 'animated' : 'static');
const RAISED: Record<number, string[]> = {
  1.5: ["a-cloudy", "s-cloudy"],
  2.1: ["a-cloudy-2-night"],
  2.2: ["a-clear-night", "a-cloudy-1-night", "a-cloudy-3-night", "a-fog-night", "a-frost-night", "a-haze-night", "a-isolated-thunderstorms-night", "a-rainy-1-night", "a-rainy-2-night", "a-rainy-3-night", "a-scattered-thunderstorms-night", "a-snowy-1-night", "a-snowy-2-night", "a-snowy-3-night", "s-clear-night", "s-cloudy-1-night", "s-cloudy-2-night", "s-cloudy-3-night", "s-fog-night", "s-frost-night", "s-haze-night", "s-isolated-thunderstorms-night", "s-rainy-1-night", "s-rainy-2-night", "s-rainy-3-night", "s-scattered-thunderstorms-night", "s-snowy-1-night", "s-snowy-2-night", "s-snowy-3-night"],
  2.4: ["a-tropical-storm"],
  2.5: ["a-tornado"],
  3.5: ["a-severe-thunderstorm", "a-thunderstorms", "s-severe-thunderstorm", "s-thunderstorms", "s-tornado"],
  4.8: ["a-unknown", "s-unknown"],
  6.65: ["a-rainy-2"],
  6.9: ["a-hail", "a-isolated-thunderstorms", "a-rain-and-sleet-mix", "a-rain-and-snow-mix", "a-rainy-1", "a-rainy-3", "a-scattered-thunderstorms", "a-snow-and-sleet-mix", "a-snowy-1", "a-snowy-2", "a-snowy-3", "s-hail", "s-isolated-thunderstorms", "s-rain-and-sleet-mix", "s-rain-and-snow-mix", "s-rainy-1", "s-rainy-2", "s-rainy-3", "s-scattered-thunderstorms", "s-snow-and-sleet-mix", "s-snowy-1", "s-snowy-2", "s-snowy-3"],
  7.1: ["s-hurricane", "s-tropical-storm"],
  9.0: ["a-dust", "a-frost", "a-wind", "s-dust", "s-frost", "s-wind"],
  16.0: ["a-fog", "a-haze", "s-fog", "s-haze"],
};
function svgTag(name: string) {
  const s = readFileSync(join(DIR(name), name + '.svg'), 'utf8');
  const tag = /<svg\b[^>]*>/.exec(s)![0];
  const num = (a: string) => { const m = new RegExp(`\\b${a}="([\\d.]+)"`).exec(tag); return m ? Number(m[1]) : null; };
  const vb = /\bviewBox="([^"]+)"/.exec(tag)?.[1].split(/\s+/).map(Number) ?? null;
  return { w: num('width'), h: num('height'), vb };
}
const icons = ['animated', 'static'].flatMap((d) => readdirSync(join(__dirname, '..', 'icons', d))).filter((f) => /^[as]-.*\.svg$/.test(f)).map((f) => f.slice(0, -4));

describe('the icons of the default pack start where the sun does', () => {
  it('each icon that was lower is raised by its measured amount', () => {
    for (const [shift, names] of Object.entries(RAISED)) for (const n of names) {
      const t = svgTag(n);
      expect(t.vb, n).not.toBeNull();
      expect(t.vb![1], n).toBeCloseTo(Number(shift), 2);
    }
  });
  it('and none other is moved: the sun, and every icon that has a sun or a moon where it should be', () => {
    const raised = new Set(Object.values(RAISED).flat());
    for (const n of icons.filter((x) => !raised.has(x))) {
      const t = svgTag(n);
      if (t.vb) expect([n, t.vb[1]]).toEqual([n, 0]);
    }
    expect(raised.has('a-clear-day') || raised.has('s-clear-day')).toBe(false);
    expect(raised.has('a-cloudy-2-day')).toBe(false);
  });
  it('nothing is scaled: a viewBox has the width and the height of its icon', () => {
    for (const n of icons) {
      const t = svgTag(n);
      if (!t.vb) continue;
      expect([n, t.vb[0], t.vb[2], t.vb[3]]).toEqual([n, 0, t.w, t.h]);
    }
  });
  it('the plain cloud, the wind, fog, snow and the moon by night are among them; the spinning hurricane is not', () => {
    const raised = new Set(Object.values(RAISED).flat());
    for (const n of ['a-cloudy', 'a-wind', 'a-fog', 'a-snowy-3', 'a-clear-night', 's-wind', 's-fog', 's-hurricane']) expect(raised.has(n), n).toBe(true);
    expect(raised.has('a-hurricane'), 'the animated hurricane spins through the whole box').toBe(false);
    expect(svgTag('a-wind').vb![1]).toBe(9);
  });
  it('all 108 icons are here, so that a new one cannot go in unmeasured', () => {
    expect(icons.length).toBe(108);
  });
});
