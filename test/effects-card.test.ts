import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '../src/platinum-weather-card';
import { makeHass, baseConfig, renderCard } from './helpers';

// The effects behind the card, as the card draws them. The decision is tested on its own in
// effects.test.ts; here it is the wiring: when the layer is there, where it sits, and that it
// follows the icon the card settled on, gauge and pyranometer included.

// The gauge, the sky and the provider are remembered on the class for a while, shared by every
// card on a page; two tests must not remember each other's rain.
beforeEach(() => {
  const cls = customElements.get('platinum-weather-card-plus-charts') as unknown as Record<string, unknown>;
  cls._gaugeSeen = null; cls._gaugeRain = null; cls._lastCondition = null; cls._cloudSamples = []; cls._cloudBand = null; cls._lastDaylightCloud = null; cls._lastRain = null;
});
afterEach(() => vi.useRealTimers());

type St = { state: string; attributes?: Record<string, unknown> };
type Card = HTMLElement & { hass: unknown; updateComplete: Promise<unknown> };
interface Scene { condition?: string; rain?: string | null; solar?: string; sunState?: 'above_horizon' | 'below_horizon'; elevation?: number; wind?: string | null }

function states(s: Scene = {}): Record<string, St> {
  const st: Record<string, St> = {
    'sensor.condition': { state: s.condition ?? 'sunny' },
    'sensor.temp': { state: '12', attributes: { unit_of_measurement: '°C' } },
    'sensor.solar': { state: s.solar ?? '300' },
    'sun.sun': { state: s.sunState ?? 'above_horizon', attributes: { elevation: s.elevation ?? 30, azimuth: 150 } },
  };
  if (s.rain !== null) st['sensor.rain'] = { state: s.rain ?? '0.0' };
  if (s.wind !== null && s.wind !== undefined) st['sensor.wind'] = { state: s.wind, attributes: { unit_of_measurement: 'km/h' } };
  return st;
}
const config = (extra: Record<string, unknown> = {}) => baseConfig({
  section_order: ['overview'], overview_layout: 'complete', entity_temperature: 'sensor.temp', entity_forecast_icon: 'sensor.condition',
  entity_sun: 'sun.sun', entity_solar_radiation: 'sensor.solar', entity_rain_rate: 'sensor.rain', entity_wind_speed: 'sensor.wind',
  option_cloud_overrides_icon: true, option_cloud_min_elevation_am: 10, option_cloud_min_elevation_pm: 25,
  ...extra,
} as never);
async function mount(scene: Scene, extra: Record<string, unknown> = {}) {
  return (await renderCard(config(extra), makeHass(states(scene)))) as Card;
}
async function swap(el: Card, scene: Scene) { el.hass = makeHass(states(scene)); await el.updateComplete; await el.updateComplete; }
const fx = (el: HTMLElement) => el.shadowRoot?.querySelector('.fx') ?? null;
const all = (el: HTMLElement, sel: string) => [...(el.shadowRoot?.querySelectorAll(sel) ?? [])];

describe('the effects are an option, and off', () => {
  it('there are none unless asked for', async () => {
    const el = await mount({ condition: 'rainy' });
    expect(fx(el)).toBeNull();
    expect(el.shadowRoot?.innerHTML).not.toContain('fx-host');
  });
  it('and none for off, or for a word it does not know', async () => {
    expect(fx(await mount({ condition: 'rainy' }, { option_effects: 'off' }))).toBeNull();
    expect(fx(await mount({ condition: 'rainy' }, { option_effects: 'bogus' }))).toBeNull();
  });
  it('its stylesheet is not added to a card that does not use it', async () => {
    const off = await mount({}, {});
    expect(off.shadowRoot?.innerHTML).not.toContain('@keyframes fx-fall');
    const on = await mount({ condition: 'rainy' }, { option_effects: 'full' });
    expect(on.shadowRoot?.innerHTML).toContain('@keyframes fx-fall');
  });
});

describe('where the layer sits', () => {
  it('behind the top part of the card, by default', async () => {
    const el = await mount({ condition: 'sunny' }, { option_effects: 'full' });
    const host = el.shadowRoot!.querySelector('.overview-section');
    expect(host?.classList.contains('fx-host')).toBe(true);
    expect([...(host?.children ?? [])].some((c) => c.classList.contains('fx') && c.classList.contains('fx-overview'))).toBe(true);
    expect([...el.shadowRoot!.querySelector('ha-card')!.children].some((c) => c.classList.contains('fx'))).toBe(false);
  });
  it('and it is the first thing in it, so that everything after it sits on top', async () => {
    const host = (await mount({ condition: 'sunny' }, { option_effects: 'full' })).shadowRoot!.querySelector('.overview-section')!;
    expect(host.firstElementChild?.classList.contains('fx')).toBe(true);
  });
  it('behind the whole card when asked', async () => {
    const el = await mount({ condition: 'sunny' }, { option_effects: 'full', option_effects_area: 'card' });
    expect(el.shadowRoot!.querySelector('ha-card')?.classList.contains('fx-host')).toBe(true);
    expect([...el.shadowRoot!.querySelector('ha-card')!.children].some((c) => c.classList.contains('fx-card'))).toBe(true);
    expect(el.shadowRoot!.querySelector('.overview-section .fx')).toBeNull();
  });
  it('and a card that has no top part has none to draw behind', async () => {
    const el = await mount({ condition: 'rainy' }, { option_effects: 'full', section_order: ['slots'] });
    expect(fx(el)).toBeNull();
  });
  it('is hidden from a screen reader', async () => {
    expect(fx(await mount({ condition: 'rainy' }, { option_effects: 'full' }))?.getAttribute('aria-hidden')).toBe('true');
  });
});

describe('it draws what the card says the weather is', () => {
  it('a clear day has a glow, and a clear night has stars', async () => {
    const day = await mount({ condition: 'sunny' }, { option_effects: 'full' });
    expect(all(day, '.fx-glow')).toHaveLength(1);
    expect(all(day, '.fx-stars')).toHaveLength(0);
    const night = await mount({ condition: 'clear-night', solar: '0', sunState: 'below_horizon', elevation: -20 }, { option_effects: 'full' });
    expect(fx(night)?.hasAttribute('data-night')).toBe(true);
    expect(all(night, '.fx-stars').length).toBeGreaterThan(0);
  });
  it('rain falls when the provider says rain and the gauge agrees', async () => {
    const el = await mount({ condition: 'rainy', rain: '1.2' }, { option_effects: 'full' });
    expect(all(el, '.fx-rain').length).toBeGreaterThan(0);
  });
  it('and does not when the gauge has ruled it out: the sky is cloud, with nothing falling', async () => {
    // a dull sky, so that what is left once the rain is denied is cloud
    const el = await mount({ condition: 'rainy', rain: '0.0', solar: '40' }, { option_effects: 'full' });
    expect(all(el, '.fx-rain')).toHaveLength(0);
    expect(all(el, '.fx-cloud').length).toBeGreaterThan(0);
  });
  it('and does when the provider has missed rain the gauge can see', async () => {
    const el = await mount({ condition: 'cloudy', rain: '2.4' }, { option_effects: 'full' });
    expect(all(el, '.fx-rain').length).toBeGreaterThan(0);
  });
  it('snow falls for snow, and a storm flashes', async () => {
    expect(all(await mount({ condition: 'snowy' }, { option_effects: 'full' }), '.fx-snow').length).toBeGreaterThan(0);
    expect(all(await mount({ condition: 'lightning' }, { option_effects: 'full' }), '.fx-flash')).toHaveLength(1);
  });
  it('the flash is left out of the subtle setting', async () => {
    expect(all(await mount({ condition: 'lightning' }, { option_effects: 'subtle' }), '.fx-flash')).toHaveLength(0);
  });
  it('a condition the card has no picture of has no effect either', async () => {
    expect(fx(await mount({ condition: 'exceptional' }, { option_effects: 'full' }))).toBeNull();
  });
});

// jsdom has no Web Animations: a stand-in with a rate to set, one animation for each element
const animations = new WeakMap<Element, { playbackRate: number; animationName: string }[]>();
function stubAnimations() {
  (HTMLElement.prototype as unknown as { getAnimations: () => unknown }).getAnimations = function (this: Element) {
    if (!animations.has(this)) animations.set(this, [{ playbackRate: 1, animationName: 'fx' }]);
    return animations.get(this);
  };
}
afterEach(() => { delete (HTMLElement.prototype as unknown as { getAnimations?: unknown }).getAnimations; });
const rate = (e: Element | undefined) => (e ? animations.get(e)?.[0].playbackRate : undefined) ?? 1;

describe('the wind moves the clouds', () => {
  it('faster in a stronger wind: the rate of the animation, not its length', async () => {
    stubAnimations();
    const calm = await mount({ condition: 'cloudy', wind: '2', solar: '40' }, { option_effects: 'full' });
    const strong = await mount({ condition: 'cloudy', wind: '55', solar: '40' }, { option_effects: 'full' });
    expect(rate(all(strong, '.fx-cloud')[0])).toBeGreaterThan(rate(all(calm, '.fx-cloud')[0]));
  });
  it('and at a pace of their own when the wind is not measured', async () => {
    stubAnimations();
    expect(rate(all(await mount({ condition: 'cloudy', wind: null, solar: '40' }, { option_effects: 'full' }), '.fx-cloud')[0])).toBeGreaterThan(0);
  });
});

describe('when the numbers change, the picture goes on', () => {
  // seen on the card, in a recording: at the moment a sensor changed (the feels-like went from 15.0 to
  // 14.0) the clouds jumped to where they start. A change in any number the effect is made of replaced
  // the whole layer, and every animation in it began again.
  it('the clouds are the same elements after a sensor update, so nothing starts again', async () => {
    const el = await mount({ condition: 'cloudy', wind: '10', solar: '40' }, { option_effects: 'full' });
    const before = all(el, '.fx-cloud');
    expect(before.length).toBeGreaterThan(0);
    await swap(el, { condition: 'cloudy', wind: '30', solar: '90' });
    const after = all(el, '.fx-cloud');
    expect(after).toHaveLength(before.length);
    after.forEach((c, i) => expect(c, `cloud ${i} was made again`).toBe(before[i]));
  });
  it('the wind changes how fast they go, and not how long a trip they make', async () => {
    stubAnimations();
    const el = await mount({ condition: 'cloudy', wind: '10', solar: '40' }, { option_effects: 'full' });
    const dur = (e: Element) => /--dur:(\d+)s/.exec(e.getAttribute('style') ?? '')?.[1];
    const first = all(el, '.fx-cloud')[0];
    const d0 = dur(first); const r0 = rate(first);
    await swap(el, { condition: 'cloudy', wind: '60', solar: '40' });
    expect(all(el, '.fx-cloud')[0]).toBe(first);
    expect(dur(first), 'the length of the trip changed').toBe(d0);
    expect(rate(first), 'the rate did not').toBeGreaterThan(r0);
  });
  it('rain starting does not start the clouds again', async () => {
    const el = await mount({ condition: 'rainy', rain: '0.0', solar: '40' }, { option_effects: 'full' });
    const clouds = all(el, '.fx-cloud');
    expect(all(el, '.fx-rain')).toHaveLength(0);
    await swap(el, { condition: 'rainy', rain: '2.4', solar: '40' });
    expect(all(el, '.fx-rain').length).toBeGreaterThan(0);
    all(el, '.fx-cloud').slice(0, clouds.length).forEach((c, i) => expect(c, `cloud ${i} was made again`).toBe(clouds[i]));
  });
  it('and the rain, once it falls, goes on falling when it falls harder', async () => {
    stubAnimations();
    const el = await mount({ condition: 'rainy', rain: '1.2', solar: '40' }, { option_effects: 'full' });
    const layer = all(el, '.fx-rain-1')[0];
    const r0 = rate(layer);
    await swap(el, { condition: 'rainy', rain: '9', solar: '40' });
    expect(all(el, '.fx-rain-1')[0]).toBe(layer);
    expect(rate(layer)).toBeGreaterThan(r0);
  });
  it('the card does not mind a browser that has no animations to give', async () => {
    const el = await mount({ condition: 'cloudy', wind: '10', solar: '40' }, { option_effects: 'full' });
    await swap(el, { condition: 'cloudy', wind: '30', solar: '90' });
    expect(all(el, '.fx-cloud').length).toBeGreaterThan(0);
  });
});

describe('when the weather changes', () => {
  it('the picture changes with it, and there is only ever one layer', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-10-19T09:00:00Z'));
    const el = await mount({ condition: 'rainy', rain: '2.4' }, { option_effects: 'full' });
    expect(all(el, '.fx-rain').length).toBeGreaterThan(0);
    // the gauge's last tick counts for fifteen minutes; this is after them
    vi.setSystemTime(new Date('2026-10-19T09:20:00Z'));
    await swap(el, { condition: 'sunny', rain: '0.0' });
    expect(all(el, '.fx')).toHaveLength(1);
    expect(all(el, '.fx-rain')).toHaveLength(0);
    expect(all(el, '.fx-glow')).toHaveLength(1);
  });
  it('and goes when it is switched off', async () => {
    const el = await mount({ condition: 'rainy', rain: '2.4' }, { option_effects: 'full' });
    el.hass = makeHass(states({ condition: 'rainy', rain: '2.4' }));
    (el as unknown as { setConfig: (c: unknown) => void }).setConfig(config({ option_effects: 'off' }));
    await el.updateComplete;
    expect(fx(el)).toBeNull();
  });
});
