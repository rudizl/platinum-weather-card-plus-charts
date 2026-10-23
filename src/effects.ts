// The weather behind the overview: clouds that drift, rain that falls, snow, stars, fog and
// the flash of a storm, drawn by CSS alone.
//
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
  quality: EffectsQuality;
}

export interface EffectPlan {
  night: boolean;
  sky: EffectsSky;
  clouds: number;
  cloudOpacity: number;
  driftSeconds: number;
  rain: { layers: number; intensity: number; opacity: number; fallSeconds: number; slantDeg: number } | null;
  snow: { layers: number; opacity: number; fallSeconds: number; swayPx: number } | null;
  fog: boolean;
  stars: boolean;
  flash: boolean;
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
}

function lookOf(name: string): Look | null {
  const n = name.toLowerCase();
  const sky = (s: EffectsSky, clouds: [number, number], extra: Partial<Look> = {}): Look =>
    ({ sky: s, rain: null, snow: false, storm: false, fog: false, fast: null, clouds, ...extra });
  if (/^(clear|frost)(-|$)/.test(n)) return sky('clear', [0, 0]);
  if (/^cloudy-1(-|$)/.test(n)) return sky('partly', [1, 1]);
  if (/^cloudy-2(-|$)/.test(n)) return sky('partly', [1, 2]);
  if (/^cloudy(-3)?(-|$)/.test(n)) return sky('overcast', [2, 3]);
  if (/^(fog|haze|dust)(-|$)/.test(n)) return sky('fog', [1, 2], { fog: true });
  if (/^tropical-storm/.test(n)) return sky('storm', [2, 3], { rain: 0.95, storm: true, fast: 40 });
  if (/thunderstorm/.test(n)) return sky('storm', [2, 3], { rain: 0.7, storm: true });
  if (/^hail/.test(n)) return sky('overcast', [2, 3], { rain: 0.9 });
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
  const driftSeconds = look.fast !== null ? Math.min(drift, look.fast) : drift;

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
      slantDeg: round(Math.min(28, 4 + 2.2 * b), 1),
    };
  }
  const snow: EffectPlan['snow'] = look.snow
    ? { layers: full ? 2 : 1, opacity: 0.8, fallSeconds: 10, swayPx: round(Math.min(40, 8 + 3 * b), 0) }
    : null;

  const measured = i.cloudFraction !== null && ['clear', 'partly', 'cloudy', 'overcast'].includes(look.sky);
  const base = { clear: 0.6, partly: 0.6, cloudy: 0.7, overcast: 0.75, storm: 0.9, fog: 0.5 }[look.sky];
  const cloudOpacity = round(measured ? 0.35 + 0.55 * clamp(i.cloudFraction as number, 0, 1) : base);

  const clearish = look.sky === 'clear' || look.sky === 'partly';
  return {
    night: i.night,
    sky: look.sky,
    clouds: look.clouds[full ? 1 : 0],
    cloudOpacity,
    driftSeconds,
    rain,
    snow,
    fog: look.fog,
    stars: i.night && clearish,
    flash: look.storm && full,
    glow: !i.night && look.sky === 'clear',
  };
}

// ── markup ────────────────────────────────────────────────────────────────

// where each cloud sits, how wide it is, how long it takes relative to the others, and how
// far along its way it starts, so that the sky is not a row of copies
const CLOUDS = [
  { y: 4, w: 64, speed: 1, start: 12 },
  { y: 26, w: 52, speed: 1.35, start: 58 },
  { y: 12, w: 58, speed: 0.8, start: 34 },
];

export function effectsHtml(plan: EffectPlan, area: EffectsArea): string {
  const out: string[] = [];
  const attrs = `class="fx fx-${area}" aria-hidden="true" data-sky="${plan.sky}"${plan.night ? ' data-night' : ''}`
    + ` style="--fx-cloud-op:${plan.cloudOpacity}"`;
  out.push(`<div ${attrs}>`);
  out.push('<div class="fx-sky"></div>');
  if (plan.glow) out.push('<div class="fx-glow"></div>');
  if (plan.stars) out.push('<div class="fx-stars"></div><div class="fx-stars fx-stars-2"></div>');
  for (let c = 0; c < plan.clouds; c++) {
    const k = CLOUDS[c % CLOUDS.length];
    const dur = round(plan.driftSeconds * k.speed, 0);
    out.push(`<div class="fx-cloud" style="--y:${k.y}%;--w:${k.w}%;--dur:${dur}s;--delay:-${round(dur * k.start / 100, 0)}s;--x0:${k.start}%"></div>`);
  }
  if (plan.fog) out.push('<div class="fx-fog"></div><div class="fx-fog fx-fog-2"></div>');
  if (plan.rain) {
    const r = plan.rain;
    const layers = [1, 2].slice(0, r.layers).map((n) =>
      `<div class="fx-rain fx-rain-${n}" style="--op:${round(r.opacity * (n === 1 ? 1 : 0.65))};--fall:${round(r.fallSeconds * (n === 1 ? 1 : 1.3))}s"></div>`);
    out.push(`<div class="fx-rain-wrap" style="--fx-slant:${r.slantDeg}deg">${layers.join('')}</div>`);
  }
  if (plan.snow) {
    const s = plan.snow;
    const layers = [1, 2].slice(0, s.layers).map((n) =>
      `<div class="fx-snow fx-snow-${n}" style="--op:${round(s.opacity * (n === 1 ? 1 : 0.6))};--fall:${round(s.fallSeconds * (n === 1 ? 1 : 1.4))}s"></div>`);
    out.push(`<div class="fx-snow-wrap" style="--fx-sway:${s.swayPx}px">${layers.join('')}</div>`);
  }
  if (plan.flash) out.push('<div class="fx-flash"></div>');
  out.push('</div>');
  return out.join('');
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

const RAIN_1 = svg(160, 200, scatter(14, 160, 200, 7).map(([x, y, r]) =>
  `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${x.toFixed(1)}" y2="${(y + 14 + r * 22).toFixed(1)}" stroke="rgba(205,222,255,0.85)" stroke-width="${(1 + r * 0.6).toFixed(1)}" stroke-linecap="round"/>`).join(''));
const RAIN_2 = svg(96, 130, scatter(10, 96, 130, 21).map(([x, y, r]) =>
  `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${x.toFixed(1)}" y2="${(y + 8 + r * 12).toFixed(1)}" stroke="rgba(205,222,255,0.8)" stroke-width="0.9" stroke-linecap="round"/>`).join(''));
const SNOW_1 = svg(200, 200, scatter(12, 200, 200, 33).map(([x, y, r]) =>
  `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(1.3 + r * 1.7).toFixed(1)}" fill="rgba(255,255,255,0.92)"/>`).join(''));
const SNOW_2 = svg(130, 130, scatter(9, 130, 130, 55).map(([x, y, r]) =>
  `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(0.8 + r * 1.0).toFixed(1)}" fill="rgba(255,255,255,0.85)"/>`).join(''));
const STARS_1 = svg(240, 160, scatter(15, 240, 160, 91).map(([x, y, r]) =>
  `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(0.5 + r * 0.9).toFixed(1)}" fill="rgba(255,255,255,0.95)"/>`).join(''));
const STARS_2 = svg(180, 130, scatter(11, 180, 130, 123).map(([x, y, r]) =>
  `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(0.4 + r * 0.7).toFixed(1)}" fill="rgba(210,225,255,0.9)"/>`).join(''));

export const EFFECTS_CSS = `
.fx {
  position: absolute; inset: 0; overflow: hidden; pointer-events: none; border-radius: inherit;
  z-index: 0; contain: paint; isolation: isolate;
  --fx-cloud: rgba(255, 255, 255, 0.92);
  --fx-rain-1: ${RAIN_1}; --fx-rain-2: ${RAIN_2};
  --fx-snow-1: ${SNOW_1}; --fx-snow-2: ${SNOW_2};
  --fx-stars-1: ${STARS_1}; --fx-stars-2: ${STARS_2};
}
.fx[data-night] { --fx-cloud: rgba(120, 134, 168, 0.9); }
.fx[data-sky="overcast"] { --fx-cloud: rgba(176, 186, 200, 0.92); }
.fx[data-sky="overcast"][data-night] { --fx-cloud: rgba(78, 88, 112, 0.92); }
.fx[data-sky="storm"] { --fx-cloud: rgba(104, 114, 134, 0.95); }
.fx[data-sky="storm"][data-night] { --fx-cloud: rgba(58, 64, 84, 0.95); }
.fx > * { position: absolute; }

.fx-sky { inset: 0; }
.fx[data-night] .fx-sky { background: linear-gradient(180deg, rgba(8, 16, 48, 0.5), rgba(8, 16, 48, 0) 88%); }
.fx[data-sky="overcast"] .fx-sky { background: linear-gradient(180deg, rgba(118, 128, 144, 0.22), rgba(118, 128, 144, 0) 85%); }
.fx[data-sky="overcast"][data-night] .fx-sky { background: linear-gradient(180deg, rgba(6, 10, 28, 0.55), rgba(6, 10, 28, 0) 90%); }
.fx[data-sky="storm"] .fx-sky { background: linear-gradient(180deg, rgba(22, 28, 44, 0.5), rgba(22, 28, 44, 0) 90%); }
.fx[data-sky="fog"] .fx-sky { background: rgba(205, 210, 216, 0.14); }

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
  top: var(--y); left: 0; width: var(--w); height: 46%; opacity: var(--fx-cloud-op);
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
  background-image: linear-gradient(90deg, rgba(225, 230, 235, 0), rgba(225, 230, 235, 0.42) 45%, rgba(225, 230, 235, 0) 100%);
}
.fx-fog:not(.fx-fog-2) { top: 32%; height: 42%; }
.fx-fog-2 { top: 54%; height: 46%; opacity: 0.8; }

.fx-rain-wrap { inset: -30%; transform: rotate(var(--fx-slant)); }
.fx-rain, .fx-snow {
  left: 0; right: 0; opacity: var(--op);
  background-repeat: repeat;
}
.fx-rain-1 { --tile-w: 160px; --tile-h: 200px; background-image: var(--fx-rain-1); }
.fx-rain-2 { --tile-w: 96px; --tile-h: 130px; background-image: var(--fx-rain-2); }
.fx-snow-wrap { inset: -10% -10% 0 -10%; }
.fx-snow-1 { --tile-w: 200px; --tile-h: 200px; background-image: var(--fx-snow-1); }
.fx-snow-2 { --tile-w: 130px; --tile-h: 130px; background-image: var(--fx-snow-2); }
.fx-rain, .fx-snow {
  top: calc(var(--tile-h) * -1); height: calc(100% + var(--tile-h));
  background-size: var(--tile-w) var(--tile-h);
}

.fx-flash {
  inset: 0; opacity: 0;
  background: radial-gradient(ellipse 70% 60% at 50% 14%, rgba(255, 255, 255, 0.85), rgba(210, 225, 255, 0) 75%);
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
  92% { opacity: 0.85; }
  93.5% { opacity: 0.12; }
  95% { opacity: 0.6; }
  97.5% { opacity: 0; }
  100% { opacity: 0; }
}
@keyframes fx-fogdrift {
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(-50%, 0, 0); }
}

@media (prefers-reduced-motion: no-preference) {
  .fx-cloud { animation: fx-drift var(--dur) linear infinite; animation-delay: var(--delay); will-change: transform; }
  .fx-rain, .fx-snow { animation: fx-fall var(--fall) linear infinite; will-change: transform; }
  .fx-snow-wrap { animation: fx-sway 4.5s ease-in-out infinite alternate; will-change: transform; }
  .fx-stars { animation: fx-twinkle 5s ease-in-out infinite alternate; }
  .fx-stars-2 { animation-duration: 7s; animation-delay: -2s; }
  .fx-glow { animation: fx-breathe 9s ease-in-out infinite alternate; }
  .fx-flash { animation: fx-flash 9s linear infinite; }
  .fx-fog { animation: fx-fogdrift 70s linear infinite; will-change: transform; }
  .fx-fog-2 { animation-duration: 110s; animation-direction: reverse; }
}

/* what the effect sits behind must sit above it */
.fx-host { position: relative; overflow: hidden; border-radius: 12px; }
.fx-host > :not(.fx) { position: relative; z-index: 1; }
`;
