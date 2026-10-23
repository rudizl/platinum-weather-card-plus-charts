// The weather behind the overview: clouds that drift, rain that falls, snow, stars, fog and
// the flash of a storm, drawn by CSS alone.
//
import { html, nothing, render, TemplateResult } from 'lit';

// Three decisions are kept apart, so that each can be tested without a browser:
//   effectPlan()   what there is to draw, from the name the card settled on for its icon
//                  and from what the sensors measure
//   effectsHtml()  the layers that plan calls for, as markup
//   EFFECTS_CSS    how those layers look and move
//
// The card asks for the plan with the same icon name it draws, after the gauge and the
// pyranometer have had their say, so the effect cannot show rain behind a cloud icon.
//
// No JavaScript runs per frame: every animation is a CSS animation of transform or
// opacity, which the browser hands to the graphics card, and every one of them is declared
// only for readers who have not asked for less motion.

export type EffectsQuality = 'off' | 'subtle' | 'full';
export type EffectsArea = 'overview' | 'card';
export type EffectsSky = 'clear' | 'partly' | 'cloudy' | 'overcast' | 'storm' | 'fog';

export interface EffectsInput {
  iconName: string;
  night: boolean;
  rainRateMmH: number | null;
  cloudFraction: number | null;
  beaufort: number | null;
  // how far a storm is that a detector has seen, in range, or null: none, no detector, or too far to matter
  lightningKm?: number | null;
  // what else the card measures: the temperature in degrees Celsius, how far one can see in kilometres,
  // how high the sun is (and whether it is morning), and how long ago the gauge last read rain
  temperatureC?: number | null;
  visibilityKm?: number | null;
  sunElevation?: number | null;
  sunMorning?: boolean | null;
  minutesSinceRain?: number | null;
  quality: EffectsQuality;
}

export interface EffectPlan {
  night: boolean;
  sky: EffectsSky;
  clouds: number;
  cloudOpacity: number;
  driftSeconds: number;
  rain: { layers: number; intensity: number; opacity: number; fallSeconds: number; slantDeg: number } | null;
  snow: { layers: number; opacity: number; fallSeconds: number; swayPx: number; slantDeg: number } | null;
  hail: { opacity: number; fallSeconds: number } | null;
  blizzard: boolean; // snow driven by a strong wind: no provider has a word for it, so it is worked out
  freezing: boolean; // rain at or below freezing
  frost: boolean; // a clear sky at or below freezing
  heat: boolean; // a hot day
  golden: number; // 0 to 1: how much of a golden hour; 0 for none
  goldenMorning: boolean;
  rainbow: number; // 0 to 1: how much of a rainbow; 0 for none
  fog: boolean;
  fogOpacity: number; // how thick the fog is, or the whiteout of a blizzard
  tint: 'plain' | 'dust';
  stars: boolean;
  flash: boolean;
  flashPeak: number; // how bright, 0 to 1
  flashSeconds: number; // how often: one flash in about this many
  glow: boolean;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const round = (v: number, d = 2) => Math.round(v * 10 ** d) / 10 ** d;

// What the name of an icon says about the sky and about what falls from it.
interface Look {
  sky: EffectsSky;
  rain: number | null; // 0..1
  snow: boolean;
  storm: boolean;
  fog: boolean;
  fast: number | null; // a ceiling, in seconds, on how long a cloud takes to cross
  clouds: [subtle: number, full: number];
  hail: boolean;
  dust: boolean;
}

function lookOf(name: string): Look | null {
  const n = name.toLowerCase();
  const sky = (s: EffectsSky, clouds: [number, number], extra: Partial<Look> = {}): Look =>
    ({ sky: s, rain: null, snow: false, storm: false, fog: false, fast: null, clouds, hail: false, dust: false, ...extra });
  if (/^(clear|frost)(-|$)/.test(n)) return sky('clear', [0, 0]);
  if (/^cloudy-1(-|$)/.test(n)) return sky('partly', [1, 1]);
  if (/^cloudy-2(-|$)/.test(n)) return sky('partly', [1, 2]);
  if (/^cloudy(-3)?(-|$)/.test(n)) return sky('overcast', [2, 3]);
  if (/^dust(-|$)/.test(n)) return sky('fog', [0, 1], { fog: true, dust: true });
  if (/^(fog|haze)(-|$)/.test(n)) return sky('fog', [0, 1], { fog: true });
  if (/^tropical-storm/.test(n)) return sky('storm', [2, 3], { rain: 0.95, storm: true, fast: 40 });
  if (/thunderstorm/.test(n)) return sky('storm', [2, 3], { rain: 0.7, storm: true });
  if (/^hail/.test(n)) return sky('overcast', [2, 3], { rain: 0.5, hail: true });
  if (/^rain-and-sleet/.test(n)) return sky('overcast', [2, 3], { rain: 0.5, snow: true });
  if (/^snow-and-sleet/.test(n)) return sky('overcast', [2, 3], { rain: 0.25, snow: true });
  const rainy = /^rainy-(\d)/.exec(n);
  if (rainy) return sky('overcast', [2, 3], { rain: ({ '1': 0.3, '2': 0.6, '3': 0.9 } as Record<string, number>)[rainy[1]] ?? 0.6 });
  if (/^snowy(-|$)/.test(n)) return sky('overcast', [2, 3], { snow: true });
  if (/^wind(y)?(-|$)/.test(n)) return sky('cloudy', [2, 3], { fast: 50 });
  return null;
}

export function effectPlan(i: EffectsInput): EffectPlan | null {
  if (i.quality === 'off') return null;
  const look = lookOf(i.iconName || '');
  if (!look) return null;
  const full = i.quality === 'full';
  const b = i.beaufort ?? 2;

  const drift = clamp(150 - 11 * b, 36, 150);
  const blizzardWind = look.snow && look.rain === null && i.beaufort !== null && i.beaufort >= 6;
  const driftSeconds = look.fast !== null ? Math.min(drift, look.fast) : blizzardWind ? Math.min(drift, 45) : drift;

  // A gauge that reads rain says how hard; otherwise the name of the icon does.
  // Sleet and snow are not the gauge's to judge: a tipping bucket reads them poorly.
  let rain: EffectPlan['rain'] = null;
  if (look.rain !== null) {
    const fromGauge = !look.snow && i.rainRateMmH !== null && i.rainRateMmH > 0;
    const intensity = fromGauge ? clamp(0.15 + (i.rainRateMmH as number) / 12, 0.15, 1) : look.rain;
    rain = {
      layers: !full ? 1 : intensity >= 0.45 ? 2 : 1,
      intensity: round(intensity),
      opacity: round((0.22 + 0.55 * intensity) * (full ? 1 : 0.85)),
      fallSeconds: round(1.3 - 0.7 * intensity),
      // a gale drives rain nearly flat; the slant follows the wind as far as 45 degrees
      slantDeg: round(Math.min(45, 4 + 2.6 * b), 1),
    };
  }
  // Snow with a wind of force six or more is a blizzard. Home Assistant has no state for one and the
  // providers say snow, so it is worked out: the snow flies nearly sideways, faster and thicker, the sky
  // goes white, and the clouds race. Sleet and snow with rain in it are not one.
  const blizzard = look.snow && look.rain === null && i.beaufort !== null && i.beaufort >= 6;
  const snow: EffectPlan['snow'] = look.snow
    ? blizzard
      ? { layers: full ? 2 : 1, opacity: 0.9, fallSeconds: 3.2, swayPx: 0, slantDeg: round(clamp(50 + (b - 6) * 4, 50, 72), 0) }
      : { layers: full ? 2 : 1, opacity: 0.8, fallSeconds: 10, swayPx: round(Math.min(40, 8 + 3 * b), 0), slantDeg: 0 }
    : null;
  const hail: EffectPlan['hail'] = look.hail ? { opacity: 0.85, fallSeconds: 1.4 } : null;

  // How thick a fog is: as far as one can see, where something measures it; the provider's word alone
  // makes it middling. A blizzard's whiteout is the same.
  const vis = i.visibilityKm ?? null;
  const seen = vis !== null && isFinite(vis);
  const fogOpacity = round(
    !(look.fog || blizzard) ? 0
      : !seen ? (blizzard ? 0.55 : 0.5)
      : blizzard ? ((vis as number) <= 0.3 ? 0.85 : (vis as number) <= 1 ? 0.72 : (vis as number) <= 3 ? 0.55 : 0.4)
      : (vis as number) <= 0.5 ? 0.85 : (vis as number) <= 1 ? 0.7 : (vis as number) <= 2 ? 0.55 : (vis as number) <= 5 ? 0.4 : 0.25,
  );

  // Ice, heat and the hours of the sun
  const temp = i.temperatureC ?? null;
  const known = temp !== null && isFinite(temp);
  const freezing = rain !== null && !look.snow && known && (temp as number) <= 0;
  const frost = look.sky === 'clear' && known && (temp as number) <= 0;
  const clearish0 = look.sky === 'clear' || look.sky === 'partly';
  const heat = !i.night && clearish0 && known && (temp as number) >= 33;
  // golden hour: the sun between a little under the horizon and eight degrees above, strongest at two;
  // weaker under cloud, and weaker still in rain and fog, where the sun is not seen
  const elev = i.sunElevation ?? null;
  const skyFactor = { clear: 1, partly: 1, cloudy: 0.6, overcast: 0.35, storm: 0.25, fog: 0.3 }[look.sky] * (rain !== null ? 0.8 : 1);
  const golden = elev !== null && isFinite(elev) && elev >= -4 && elev <= 8
    ? round(clamp(1 - Math.abs(elev - 2) / 8, 0, 1) * skyFactor)
    : 0;
  // a rainbow: the rain has stopped, the sun is out and neither too high nor too low, and the sky is not all cloud;
  // it fades over forty minutes, of which the first fifteen the card still holds the rain on its icon
  const since = i.minutesSinceRain ?? null;
  const rainbow = !i.night && rain === null && since !== null && since >= 0 && since <= 40
      && elev !== null && elev >= 3 && elev <= 42 && look.sky !== 'overcast' && look.sky !== 'storm' && look.sky !== 'fog'
    ? round(0.6 * (1 - since / 40))
    : 0;

  const measured = i.cloudFraction !== null && ['clear', 'partly', 'cloudy', 'overcast'].includes(look.sky);
  const base = { clear: 0.66, partly: 0.66, cloudy: 0.7, overcast: 0.65, storm: 0.62, fog: 0.35 }[look.sky];
  const cloudOpacity = round(measured ? 0.32 + 0.38 * clamp(i.cloudFraction as number, 0, 1) : base);

  // Lightning: the provider's storm flashes in the full setting only, as it did. A storm that a detector
  // has seen flashes under any sky and in both settings, as a distant storm does: the nearer, the
  // brighter and the more often, and a long way off a faint flicker now and then. Both together are
  // the stronger of the two.
  const km = i.lightningKm ?? null;
  const detected = km !== null && isFinite(km) && km >= 0;
  const stormFlash = look.storm && full;
  const flash = stormFlash || detected;
  const detectorPeak = detected ? clamp(0.85 - (km as number) / 55, 0.2, 0.65) : 0;
  const detectorSeconds = detected ? clamp(6 + (km as number) / 4, 7, 18) : Infinity;

  const clearish = look.sky === 'clear' || look.sky === 'partly';
  return {
    night: i.night,
    sky: look.sky,
    clouds: look.clouds[full ? 1 : 0],
    cloudOpacity,
    driftSeconds,
    rain,
    snow,
    hail,
    blizzard,
    freezing,
    frost,
    heat,
    golden,
    goldenMorning: i.sunMorning === true,
    rainbow,
    fog: look.fog || blizzard,
    fogOpacity,
    tint: look.dust ? 'dust' : 'plain',
    stars: i.night && clearish,
    flash,
    flashPeak: flash ? round(Math.max(stormFlash ? 0.65 : 0, detectorPeak)) : 0,
    flashSeconds: flash ? round(Math.min(stormFlash ? 9 : Infinity, detectorSeconds)) : 0,
    glow: !i.night && look.sky === 'clear',
  };
}

// ── markup ────────────────────────────────────────────────────────────────

// where each cloud sits, how wide it is, how long it takes relative to the others, and how
// far along its way it starts, so that the sky is not a row of copies
const CLOUDS = [
  { y: 6, w: 64, speed: 1, start: 12 },
  { y: 78, w: 52, speed: 1.35, start: 58 },
  { y: 36, w: 58, speed: 0.8, start: 34 },
];

// The lengths of the trips are fixed, once and for all. What the wind and the rain change is how
// fast the animation runs (its playbackRate, below), never how long it is: change the length of a
// running CSS animation and it keeps its time but not its place, so everything jumps; change the
// element and it begins again, so everything jumps back to its start. Neither is seen this way.
const BASE_DRIFT = 100; // seconds for a cloud to cross, at the pace of a light wind
const BASE_FALL = 1; // seconds for one tile of rain to fall, at the pace of a moderate rain
const BASE_FLASH = 10; // seconds from one flash to the next, at the pace of a storm that is not far
const BASE_SNOW = 10; // seconds for one tile of snow to fall, in a light snow
const BASE_HAIL = 1.4; // seconds for one tile of hail

// The layers, as a template. Lit changes only what differs from the last time, so a number that
// moves (the sky is thicker, the wind has risen) is a property on an element that stays, and a
// layer that comes or goes (the rain starts) does not touch the others.
export function effectsTemplate(plan: EffectPlan, area: EffectsArea): TemplateResult {
  const cloudOp = round(plan.cloudOpacity * (area === 'card' ? 0.85 : 1)); // over the whole card there is more text
  const rain = plan.rain;
  const snow = plan.snow;
  return html`<div class="fx fx-${area}" aria-hidden="true" data-sky=${plan.sky} data-tint=${plan.tint}
      ?data-night=${plan.night} ?data-freezing=${plan.freezing} style="--fx-cloud-op:${cloudOp}">
    <div class="fx-sky"></div>
    ${plan.glow ? html`<div class="fx-glow"></div>` : nothing}
    ${plan.heat ? html`<div class="fx-heat"></div>` : nothing}
    ${plan.golden > 0 ? html`<div class="fx-golden" ?data-morning=${plan.goldenMorning} style="--g:${plan.golden}"></div>` : nothing}
    ${plan.frost ? html`<div class="fx-frost"></div>` : nothing}
    ${plan.stars ? html`<div class="fx-stars"></div><div class="fx-stars fx-stars-2"></div>` : nothing}
    ${plan.rainbow > 0 ? html`<div class="fx-rainbow" style="--rb:${plan.rainbow}"></div>` : nothing}
    ${CLOUDS.slice(0, plan.clouds).map((k) => {
      const dur = round(BASE_DRIFT * k.speed, 0);
      return html`<div class="fx-cloud" style="--y:${k.y}px;--w:${k.w}%;--dur:${dur}s;--delay:-${round(dur * k.start / 100, 0)}s;--x0:${k.start}%"></div>`;
    })}
    ${plan.fog ? html`<div class="fx-fog" style="--fog-op:${plan.fogOpacity}"></div><div class="fx-fog fx-fog-2" style="--fog-op:${round(plan.fogOpacity * 0.8)}"></div>` : nothing}
    ${rain ? html`<div class="fx-rain-wrap" style="--fx-slant:${rain.slantDeg}deg">
      <div class="fx-rain fx-rain-1" style="--op:${round(rain.opacity)};--fall:${BASE_FALL}s"></div>
      ${rain.layers > 1 ? html`<div class="fx-rain fx-rain-2" style="--op:${round(rain.opacity * 0.65)};--fall:${round(BASE_FALL * 1.3)}s"></div>` : nothing}
    </div>` : nothing}
    ${plan.hail ? html`<div class="fx-hail-wrap"><div class="fx-hail" style="--op:${plan.hail.opacity};--fall:${BASE_HAIL}s"></div></div>` : nothing}
    ${snow ? html`<div class="fx-snow-rot" style="--fx-snow-slant:${snow.slantDeg}deg"><div class="fx-snow-wrap" style="--fx-sway:${snow.swayPx}px">
      <div class="fx-snow fx-snow-1" style="--op:${round(snow.opacity)};--fall:${BASE_SNOW}s"></div>
      ${snow.layers > 1 ? html`<div class="fx-snow fx-snow-2" style="--op:${round(snow.opacity * 0.6)};--fall:${round(BASE_SNOW * 1.4)}s"></div>` : nothing}
    </div></div>` : nothing}
    ${plan.flash ? html`<div class="fx-flash" style="--flash-peak:${plan.flashPeak}"></div>` : nothing}
  </div>`;
}

// Markup as a string, for a test or a page that has no use for a template.
export function effectsHtml(plan: EffectPlan, area: EffectsArea): string {
  const box = document.createElement('div');
  render(effectsTemplate(plan, area), box);
  return box.innerHTML;
}

// How fast the layers run: the wind moves the clouds, the rain falls faster the harder it rains.
// Set on the animations that are already running, so that they go on from where they are.
export function applyEffectRates(root: Element | null, plan: EffectPlan): void {
  if (!root) return;
  const setRate = (selector: string, rate: number) => {
    root.querySelectorAll(selector).forEach((el) => {
      const get = (el as Element & { getAnimations?: () => { playbackRate: number; animationName?: string }[] }).getAnimations;
      if (typeof get !== 'function') return; // no animations to speak of, or a browser that has none to give
      for (const a of get.call(el)) {
        // the animations, not the transitions of opacity that share the element
        if (a.animationName !== undefined && a.playbackRate !== rate) a.playbackRate = rate;
      }
    });
  };
  setRate('.fx-cloud', BASE_DRIFT / plan.driftSeconds);
  if (plan.rain) setRate('.fx-rain', BASE_FALL / plan.rain.fallSeconds);
  if (plan.flash) setRate('.fx-flash', BASE_FLASH / plan.flashSeconds);
  if (plan.snow) setRate('.fx-snow', BASE_SNOW / plan.snow.fallSeconds);
  if (plan.hail) setRate('.fx-hail', BASE_HAIL / plan.hail.fallSeconds);
}

// For a page that draws the layer by itself, as the demo does: draw, then set the rates.
export function renderEffects(container: HTMLElement, plan: EffectPlan | null, area: EffectsArea): void {
  render(plan ? effectsTemplate(plan, area) : nothing, container);
  if (plan) applyEffectRates(container.querySelector('.fx'), plan);
}

// ── stylesheet ────────────────────────────────────────────────────────────

// Small repeating pictures, drawn here rather than shipped: a handful of streaks, flakes
// or stars scattered by a fixed sequence, so every card shows the same sky.
function scatter(count: number, w: number, h: number, seed: number): [number, number, number][] {
  let s = seed;
  const next = () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; };
  return Array.from({ length: count }, () => [next() * w, next() * h, next()] as [number, number, number]);
}
const svg = (w: number, h: number, body: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`)}")`;

const RAIN_1 = svg(160, 200, scatter(30, 160, 200, 7).map(([x, y, r]) =>
  `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${x.toFixed(1)}" y2="${(y + 9 + r * 20).toFixed(1)}" stroke="rgb(150,176,226)" stroke-opacity="${(0.3 + r * 0.55).toFixed(2)}" stroke-width="${(0.8 + r * 0.6).toFixed(1)}" stroke-linecap="round"/>`).join(''));
const RAIN_2 = svg(96, 130, scatter(22, 96, 130, 21).map(([x, y, r]) =>
  `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${x.toFixed(1)}" y2="${(y + 6 + r * 11).toFixed(1)}" stroke="rgb(150,176,226)" stroke-opacity="${(0.25 + r * 0.45).toFixed(2)}" stroke-width="0.8" stroke-linecap="round"/>`).join(''));
const SNOW_1 = svg(200, 200, scatter(26, 200, 200, 33).map(([x, y, r]) =>
  `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(0.9 + r * 1.4).toFixed(1)}" fill="rgb(255,255,255)" fill-opacity="${(0.7 + r * 0.3).toFixed(2)}" stroke="rgb(120,140,172)" stroke-opacity="0.45" stroke-width="0.6"/>`).join(''));
const SNOW_2 = svg(130, 130, scatter(18, 130, 130, 55).map(([x, y, r]) =>
  `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(0.6 + r * 0.9).toFixed(1)}" fill="rgb(255,255,255)" fill-opacity="${(0.6 + r * 0.3).toFixed(2)}" stroke="rgb(120,140,172)" stroke-opacity="0.4" stroke-width="0.5"/>`).join(''));
const ICE_1 = svg(160, 200, scatter(30, 160, 200, 7).map(([x, y, r], k) =>
  k % 5 === 0
    ? `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.1" fill="rgb(235,248,255)" fill-opacity="0.95" stroke="rgb(110,160,205)" stroke-opacity="0.5" stroke-width="0.5"/>`
    : `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${x.toFixed(1)}" y2="${(y + 8 + r * 14).toFixed(1)}" stroke="rgb(140,190,235)" stroke-opacity="${(0.4 + r * 0.5).toFixed(2)}" stroke-width="${(0.8 + r * 0.4).toFixed(1)}" stroke-linecap="round"/>`).join(''));
const ICE_2 = svg(96, 130, scatter(22, 96, 130, 21).map(([x, y, r]) =>
  `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${x.toFixed(1)}" y2="${(y + 5 + r * 8).toFixed(1)}" stroke="rgb(150,195,235)" stroke-opacity="${(0.3 + r * 0.4).toFixed(2)}" stroke-width="0.8" stroke-linecap="round"/>`).join(''));
const HAIL = svg(140, 180, scatter(16, 140, 180, 77).map(([x, y, r]) =>
  `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(1.6 + r * 1.8).toFixed(1)}" fill="rgb(245,250,255)" fill-opacity="0.95" stroke="rgb(110,135,170)" stroke-opacity="0.55" stroke-width="0.7"/>`).join(''));
// a glint is a four-pointed star, a little cross with a bright middle
const FROST = svg(200, 140, scatter(11, 200, 140, 311).map(([x, y, r]) => {
  const a = (2.2 + r * 2.6).toFixed(1);
  return `<path d="M${x.toFixed(1)} ${(y - +a).toFixed(1)} L${(x + 0.5).toFixed(1)} ${(y - 0.5).toFixed(1)} L${(x + +a).toFixed(1)} ${y.toFixed(1)} L${(x + 0.5).toFixed(1)} ${(y + 0.5).toFixed(1)} L${x.toFixed(1)} ${(y + +a).toFixed(1)} L${(x - 0.5).toFixed(1)} ${(y + 0.5).toFixed(1)} L${(x - +a).toFixed(1)} ${y.toFixed(1)} L${(x - 0.5).toFixed(1)} ${(y - 0.5).toFixed(1)} Z" fill="rgb(225,243,255)" fill-opacity="${(0.7 + r * 0.3).toFixed(2)}" stroke="rgb(110,160,205)" stroke-opacity="0.35" stroke-width="0.4"/>`;
}).join(''));
const STARS_1 = svg(240, 160, scatter(15, 240, 160, 91).map(([x, y, r]) =>
  `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(0.5 + r * 0.9).toFixed(1)}" fill="rgba(255,255,255,0.95)"/>`).join(''));
const STARS_2 = svg(180, 130, scatter(11, 180, 130, 123).map(([x, y, r]) =>
  `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(0.4 + r * 0.7).toFixed(1)}" fill="rgba(210,225,255,0.9)"/>`).join(''));

export const EFFECTS_CSS = `
.fx {
  position: absolute; inset: 0; overflow: hidden; pointer-events: none; border-radius: inherit;
  z-index: 0; contain: paint; isolation: isolate;
  /* a cloud is a little of the text colour in the card's own background: lighter than the card in a
     dark theme, darker in a light one, and never a white that the text has to be read against */
  --fx-ink: var(--primary-text-color, #fff);
  --fx-bg: var(--ha-card-background, var(--card-background-color, #1c1c1c));
  --fx-cloud: color-mix(in srgb, var(--fx-ink) 38%, var(--fx-bg));
  /* the card's own colour, darkened, for a tint of the sky; and a fog, which is cloud on the ground */
  --fx-dim: color-mix(in srgb, #000 55%, var(--fx-bg));
  --fx-fog: color-mix(in srgb, var(--fx-ink) 30%, var(--fx-bg));
  --fx-rain-1: ${RAIN_1}; --fx-rain-2: ${RAIN_2};
  --fx-snow-1: ${SNOW_1}; --fx-snow-2: ${SNOW_2};
  --fx-stars-1: ${STARS_1}; --fx-stars-2: ${STARS_2};
  --fx-hail: ${HAIL}; --fx-frost: ${FROST};
}
.fx[data-freezing] { --fx-rain-1: ${ICE_1}; --fx-rain-2: ${ICE_2}; }
.fx[data-tint="dust"] { --fx-fog: color-mix(in srgb, #b8935a 42%, var(--fx-bg)); }
.fx[data-night] { --fx-cloud: color-mix(in srgb, #000 22%, color-mix(in srgb, var(--fx-ink) 38%, var(--fx-bg))); }
.fx[data-sky="overcast"] { --fx-cloud: color-mix(in srgb, var(--fx-ink) 36%, var(--fx-bg)); }
.fx[data-sky="overcast"][data-night] { --fx-cloud: color-mix(in srgb, #000 30%, color-mix(in srgb, var(--fx-ink) 35%, var(--fx-bg))); }
.fx[data-sky="storm"] { --fx-cloud: color-mix(in srgb, #000 12%, color-mix(in srgb, var(--fx-ink) 30%, var(--fx-bg))); }
.fx[data-sky="storm"][data-night] { --fx-cloud: color-mix(in srgb, #000 24%, color-mix(in srgb, var(--fx-ink) 30%, var(--fx-bg))); }
.fx > * { position: absolute; }
/* Behind the top part the layer does not stop at the section, which would show as a box:
   it reaches past it to the edges of the card, which clips it, and fades out downwards. */
.fx-overview {
  inset: -14px -28px 0 -28px;
  -webkit-mask-image: linear-gradient(to bottom, #000 55%, transparent 100%);
  mask-image: linear-gradient(to bottom, #000 55%, transparent 100%);
}

.fx-sky { inset: 0; }
.fx[data-night] .fx-sky { background: linear-gradient(180deg, color-mix(in srgb, var(--fx-dim) 45%, transparent), transparent 88%); }
.fx[data-sky="overcast"] .fx-sky { background: linear-gradient(180deg, color-mix(in srgb, var(--fx-dim) 22%, transparent), transparent 85%); }
.fx[data-sky="overcast"][data-night] .fx-sky { background: linear-gradient(180deg, color-mix(in srgb, var(--fx-dim) 48%, transparent), transparent 90%); }
.fx[data-sky="storm"] .fx-sky { background: linear-gradient(180deg, color-mix(in srgb, var(--fx-dim) 40%, transparent), transparent 90%); }
.fx[data-sky="fog"] .fx-sky { background: color-mix(in srgb, var(--fx-fog) 22%, transparent); }

.fx-glow {
  inset: 0; opacity: 0.7;
  background: radial-gradient(ellipse 60% 70% at 85% 6%, rgba(255, 214, 120, 0.5), rgba(255, 214, 120, 0) 70%);
}
.fx-stars {
  inset: 0; background-image: var(--fx-stars-1); background-size: 240px 160px;
  -webkit-mask-image: linear-gradient(#000, transparent 92%); mask-image: linear-gradient(#000, transparent 92%);
}
.fx-stars-2 { background-image: var(--fx-stars-2); background-size: 180px 130px; background-position: 60px 40px; }

.fx-cloud {
  top: var(--y); left: 0; width: var(--w); aspect-ratio: 2.6 / 1; opacity: var(--fx-cloud-op);
  transform: translate3d(var(--x0), 0, 0);
  background:
    radial-gradient(closest-side, var(--fx-cloud), transparent) 0% 52% / 42% 62% no-repeat,
    radial-gradient(closest-side, var(--fx-cloud), transparent) 20% 14% / 44% 80% no-repeat,
    radial-gradient(closest-side, var(--fx-cloud), transparent) 46% 30% / 40% 72% no-repeat,
    radial-gradient(closest-side, var(--fx-cloud), transparent) 64% 56% / 38% 60% no-repeat,
    radial-gradient(closest-side, var(--fx-cloud) 25%, transparent) 8% 74% / 92% 38% no-repeat;
}

.fx-fog {
  left: 0; width: 200%; background-repeat: repeat-x; background-size: 50% 100%;
  background-image: linear-gradient(90deg, transparent, color-mix(in srgb, var(--fx-fog) 55%, transparent) 45%, transparent 100%);
}
.fx-fog {
  -webkit-mask-image: linear-gradient(to bottom, transparent, #000 32%, #000 68%, transparent);
  mask-image: linear-gradient(to bottom, transparent, #000 32%, #000 68%, transparent);
}
.fx-fog { opacity: var(--fog-op, 1); }
.fx-fog:not(.fx-fog-2) { top: 26%; height: 52%; }
.fx-fog-2 { top: 50%; height: 56%; }

.fx-rain-wrap { inset: -30%; transform: rotate(var(--fx-slant)); }
.fx-rain, .fx-snow, .fx-hail {
  left: 0; right: 0; opacity: var(--op);
  background-repeat: repeat;
}
.fx-rain-1 { --tile-w: 160px; --tile-h: 200px; background-image: var(--fx-rain-1); }
.fx-rain-2 { --tile-w: 96px; --tile-h: 130px; background-image: var(--fx-rain-2); }
.fx-snow-rot { inset: -30%; transform: rotate(var(--fx-snow-slant, 0deg)); }
.fx-snow-wrap { inset: 0; }
.fx-snow-1 { --tile-w: 200px; --tile-h: 200px; background-image: var(--fx-snow-1); }
.fx-snow-2 { --tile-w: 130px; --tile-h: 130px; background-image: var(--fx-snow-2); }
.fx-hail { --tile-w: 140px; --tile-h: 180px; background-image: var(--fx-hail); }
.fx-hail-wrap { inset: -10% -10% 0 -10%; }
.fx-rain, .fx-snow, .fx-hail {
  top: calc(var(--tile-h) * -1); height: calc(100% + var(--tile-h));
  background-size: var(--tile-w) var(--tile-h);
}

.fx-frost {
  inset: 0; background-image: var(--fx-frost); background-size: 200px 140px;
  -webkit-mask-image: linear-gradient(#000, transparent 90%); mask-image: linear-gradient(#000, transparent 90%);
}
.fx-heat {
  left: 0; right: 0; bottom: 0; height: 70%;
  background: linear-gradient(to top, color-mix(in srgb, #ff9a3c 24%, transparent), transparent);
}
.fx-golden {
  inset: 0; opacity: var(--g);
  background: linear-gradient(to top, color-mix(in srgb, #ff8a3d 50%, transparent), color-mix(in srgb, #ff7a50 22%, transparent) 38%, transparent 72%);
}
.fx-golden[data-morning] {
  background: linear-gradient(to top, color-mix(in srgb, #ff7aa8 42%, transparent), color-mix(in srgb, #ffb36b 20%, transparent) 38%, transparent 72%);
}
/* a rainbow is a ring of colours, half of which shows: an ellipse as wide as the box and twice as high as it is */
.fx-rainbow {
  left: 8%; width: 84%; top: 10px; aspect-ratio: 2 / 1; opacity: var(--rb);
  background: radial-gradient(ellipse 50% 100% at 50% 100%, transparent 60%,
    rgba(255, 70, 70, 0.55) 61%, rgba(255, 160, 50, 0.55) 64%, rgba(255, 235, 70, 0.5) 67%,
    rgba(80, 200, 110, 0.5) 70%, rgba(60, 150, 255, 0.5) 73%, rgba(140, 90, 220, 0.5) 76%, transparent 78%);
}
.fx-flash {
  inset: 0; opacity: 0;
  background: radial-gradient(ellipse 70% 60% at 50% 14%, rgba(255, 255, 255, var(--flash-peak, 0.85)), rgba(210, 225, 255, 0) 75%);
}

@keyframes fx-drift {
  from { transform: translate3d(-90%, 0, 0); }
  to { transform: translate3d(160%, 0, 0); }
}
@keyframes fx-fall {
  from { transform: translate3d(0, calc(var(--tile-h) * -1), 0); }
  to { transform: translate3d(0, 0, 0); }
}
@keyframes fx-sway {
  from { transform: translate3d(calc(var(--fx-sway) * -1), 0, 0); }
  to { transform: translate3d(var(--fx-sway), 0, 0); }
}
@keyframes fx-twinkle {
  from { opacity: 0.35; }
  to { opacity: 1; }
}
@keyframes fx-breathe {
  from { opacity: 0.5; }
  to { opacity: 0.85; }
}
@keyframes fx-flash {
  0%, 91% { opacity: 0; }
  92% { opacity: 1; }
  93.5% { opacity: 0.14; }
  95% { opacity: 0.7; }
  97.5% { opacity: 0; }
  100% { opacity: 0; }
}
@keyframes fx-fogdrift {
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(-50%, 0, 0); }
}

@media (prefers-reduced-motion: no-preference) {
  .fx-cloud { animation: fx-drift var(--dur) linear infinite; animation-delay: var(--delay); will-change: transform; transition: opacity 4s linear; }
  .fx-rain, .fx-snow { animation: fx-fall var(--fall) linear infinite; will-change: transform; transition: opacity 2s linear; }
  .fx-rain-wrap { transition: transform 3s ease-out; }
  .fx-snow-wrap { animation: fx-sway 4.5s ease-in-out infinite alternate; will-change: transform; }
  .fx-snow-rot { transition: transform 3s ease-out; }
  .fx-hail { animation: fx-fall var(--fall) linear infinite; will-change: transform; }
  .fx-frost { animation: fx-twinkle 3.5s ease-in-out infinite alternate; }
  .fx-heat { animation: fx-breathe 6s ease-in-out infinite alternate; }
  .fx-golden, .fx-rainbow { transition: opacity 20s linear; }
  .fx-stars { animation: fx-twinkle 5s ease-in-out infinite alternate; }
  .fx-stars-2 { animation-duration: 7s; animation-delay: -2s; }
  .fx-glow { animation: fx-breathe 9s ease-in-out infinite alternate; }
  .fx-flash { animation: fx-flash 10s linear infinite; }
  .fx-fog { animation: fx-fogdrift 70s linear infinite; will-change: transform; }
  .fx-fog-2 { animation-duration: 110s; animation-direction: reverse; }
}

/* what the effect sits behind must sit above it */
.fx-host { position: relative; }
.fx-host > :not(.fx) { position: relative; z-index: 1; }
`;
