import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '../src/platinum-weather-card';
import { makeHass, baseConfig, renderCard, forgetSharedState } from './helpers';

// What the main icon shows when the sensors and the provider disagree, run
// through the card rather than read out of its source: the correction has two
// halves — deciding the provider is wrong, and choosing what to show instead —
// and a source-level test can see only that each exists.

type Card = HTMLElement & { updateComplete: Promise<unknown>; hass: unknown };

interface Scene {
  condition?: string;
  rain?: string | null; // null = no gauge configured
  solar?: string;
  sunState?: string;
  elevation?: number;
  config?: Record<string, unknown>;
}

function scene(s: Scene = {}) {
  const states: Record<string, { state: string; attributes?: Record<string, unknown> }> = {
    'sensor.temp': { state: '8', attributes: { unit_of_measurement: '°C' } },
    'sensor.condition': { state: s.condition ?? 'rainy' },
    'sun.sun': {
      state: s.sunState ?? 'below_horizon',
      attributes: s.elevation === undefined ? {} : { elevation: s.elevation, azimuth: 100 },
    },
    'sensor.solar': { state: s.solar ?? '0' },
  };
  if (s.rain !== null) states['sensor.rain'] = { state: s.rain ?? '0.0' };
  const config = baseConfig({
    section_order: ['overview'],
    overview_layout: 'complete',
    entity_temperature: 'sensor.temp',
    entity_forecast_icon: 'sensor.condition',
    entity_sun: 'sun.sun',
    entity_solar_radiation: 'sensor.solar',
    option_cloud_overrides_icon: true,
    ...(s.rain === null ? {} : { entity_rain_rate: 'sensor.rain' }),
    ...s.config,
  } as never);
  return { config, hass: makeHass(states) };
}

async function mount(s: Scene = {}): Promise<Card> {
  const { config, hass } = scene(s);
  return (await renderCard(config, hass)) as Card;
}

function iconSrc(el: HTMLElement): string {
  const img = el.shadowRoot?.querySelector('.icon, img, .conditions');
  return (
    img?.getAttribute('src') ??
    (img as HTMLElement | null)?.style?.backgroundImage ??
    el.shadowRoot?.innerHTML.match(/[\w-]+\.svg/)?.[0] ??
    ''
  );
}

async function swapStates(el: Card, s: Scene) {
  el.hass = scene(s).hass;
  await el.updateComplete;
  await el.updateComplete;
}

beforeEach(() => {
  // the held gauge reading and the cloud band live on the class
  forgetSharedState();
});
afterEach(() => vi.useRealTimers());

describe('a provider claiming rain against a dry gauge, with no cloud measurable', () => {
  // Observed 14 and 17 October: provider 'rainy' all evening and at dawn, the
  // gauge reading 0.0 mm/h, and the pyranometer unable to say anything — the
  // sun below the horizon, or under the 10° morning cut-off. The card decided
  // the rain was not real and then had nothing to put in its place.

  it('does not keep the rain icon at night', async () => {
    const el = await mount({ condition: 'rainy', rain: '0.0', solar: '0', sunState: 'below_horizon', elevation: -22 });
    expect(iconSrc(el), 'a dry gauge was overruled by the provider').not.toMatch(/rainy/);
  });

  it('shows plain overcast instead, which is what rain implies', async () => {
    const el = await mount({ condition: 'rainy', rain: '0.0', solar: '0', sunState: 'below_horizon', elevation: -22 });
    expect(iconSrc(el)).toMatch(/cloudy/);
  });

  it('does the same at dawn, with the sun under the morning cut-off', async () => {
    const el = await mount({ condition: 'rainy', rain: '0.0', solar: '21', sunState: 'above_horizon', elevation: 6.3 });
    expect(iconSrc(el)).not.toMatch(/rainy/);
    expect(iconSrc(el)).toMatch(/cloudy/);
  });

  it('prefers the measured sky when there is one', async () => {
    // 20% cloud at 35° under a provider claiming rain: the pyranometer wins.
    const el = await mount({ condition: 'rainy', rain: '0.0', solar: '560', sunState: 'above_horizon', elevation: 35 });
    expect(iconSrc(el)).not.toMatch(/rainy/);
  });

  it('leaves the provider alone when no gauge is configured', async () => {
    const el = await mount({ condition: 'rainy', rain: null, solar: '0', sunState: 'below_horizon', elevation: -22 });
    expect(iconSrc(el)).toMatch(/rainy/);
  });

  it('leaves the provider alone when the gauge reads rain', async () => {
    const el = await mount({ condition: 'rainy', rain: '1.2', solar: '0', sunState: 'below_horizon', elevation: -22 });
    expect(iconSrc(el)).toMatch(/rainy/);
  });

  it('leaves a thunderstorm to the provider', async () => {
    const el = await mount({ condition: 'lightning-rainy', rain: '0.0', solar: '0', sunState: 'below_horizon', elevation: -22 });
    expect(iconSrc(el)).not.toMatch(/cloudy\.svg$/);
  });
});

describe('a gauge that drops out for a moment', () => {
  // The station's gauge goes 'unavailable' for one to seven seconds every so
  // often (20:14:58 on 14 October, 08:06:09 on 17 October). Read as 'no gauge',
  // each blip sent the provider's rain icon back for as long as it lasted.
  const night: Scene = { condition: 'rainy', solar: '0', sunState: 'below_horizon', elevation: -22 };

  it('keeps the correction through the blip', async () => {
    const el = await mount({ ...night, rain: '0.0' });
    expect(iconSrc(el)).not.toMatch(/rainy/);
    await swapStates(el, { ...night, rain: 'unavailable' });
    expect(iconSrc(el), 'the rain icon flashed back').not.toMatch(/rainy/);
  });

  it('keeps a real shower through the blip too', async () => {
    const el = await mount({ ...night, condition: 'cloudy', rain: '2.0' });
    expect(iconSrc(el)).toMatch(/rainy/);
    await swapStates(el, { ...night, condition: 'cloudy', rain: 'unavailable' });
    expect(iconSrc(el)).toMatch(/rainy/);
  });

  it('forgets the reading after a minute, so a dead gauge cannot overrule for ever', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-10-17T05:00:00Z'));
    const el = await mount({ ...night, rain: '0.0' });
    expect(iconSrc(el)).not.toMatch(/rainy/);
    vi.setSystemTime(new Date('2026-10-17T05:01:30Z'));
    await swapStates(el, { ...night, rain: 'unavailable' });
    expect(iconSrc(el), 'a ninety-second-old reading still in charge').toMatch(/rainy/);
  });

  it('does not invent a reading it never had', async () => {
    const el = await mount({ ...night, rain: 'unavailable' });
    expect(iconSrc(el)).toMatch(/rainy/);
  });
});

describe('day and night follow the sun entity, as Home Assistant does', () => {
  // Home Assistant flips sun.sun at -0.83°, where the upper limb meets the
  // horizon. The card used to wait for the centre to clear 0°, about five
  // minutes later: at 07:23 on 16 October the icon was a moon while the sun
  // slot beside it already counted the sun as risen.
  const sunny = (sunState: string, elevation?: number) =>
    mount({ condition: 'sunny', rain: null, solar: '0', sunState, elevation, config: { option_cloud_overrides_icon: false } });

  it('is day from the moment the sun entity says above_horizon', async () => {
    const el = await sunny('above_horizon', -0.5);
    expect(iconSrc(el), 'a moon with the sun above the horizon').not.toMatch(/night/);
  });

  it('is night from the moment it says below_horizon', async () => {
    const el = await sunny('below_horizon', 0.3);
    expect(iconSrc(el)).toMatch(/night/);
  });

  it('falls back to the elevation, at the horizon Home Assistant uses, if the state is unusable', async () => {
    expect(iconSrc(await sunny('unknown', -0.5))).not.toMatch(/night/);
    expect(iconSrc(await sunny('unknown', -2))).toMatch(/night/);
  });
});

describe('the icon packs and the names the card can produce', () => {
  // The correction chooses its own icon names — plain overcast among them — and each
  // pack has a table from those names to its files. The Meteocons tables had no entry
  // for the overcast band, so a provider's rain overruled by a dry gauge under a thick
  // sky drew the pack's "not available" icon: N/A where the weather should be, on the
  // card of anyone using Meteocons (22 October, 09:49).
  const CONDITIONS = ['sunny', 'clear-night', 'partlycloudy', 'cloudy', 'rainy', 'pouring', 'snowy', 'snowy-rainy', 'fog', 'hail', 'lightning', 'lightning-rainy', 'windy', 'windy-variant', 'exceptional'];
  const BANDS = ['clear', 'cloudy-1', 'cloudy-2', 'cloudy-3'].flatMap((b) => [`${b}-day`, `${b}-night`]);
  const PACKS = ['default', 'photoreal', 'meteocons-fill', 'meteocons-line', 'ha-official', 'wcc-2'];

  it('every pack has a real icon for every name the card can produce', async () => {
    const lost: string[] = [];
    for (const pack of PACKS) {
      const el = (await mount({ config: { icon_pack: pack } })) as unknown as Record<string, (n: string) => string>;
      const names = new Set<string>([...BANDS, 'cloudy']);
      for (const c of CONDITIONS) names.add(el._weatherIcon(c));
      // 'unknown' is the card's own name for a condition it does not recognise, and is meant to show N/A
      for (const n of names) if (n !== 'unknown' && /not-available|unknown/.test(el._getIconUrl(n))) lost.push(`${pack}: ${n}`);
    }
    expect(lost, 'names that land on the "unknown" icon').toEqual([]);
  });

  it('draws overcast, not N/A, for rain overruled by a dry gauge under a thick sky — in both Meteocons packs', async () => {
    for (const pack of ['meteocons-fill', 'meteocons-line']) {
      const el = await mount({ condition: 'rainy', rain: '0.0', solar: '27.6', sunState: 'above_horizon', elevation: 22, config: { icon_pack: pack } });
      expect(iconSrc(el), pack).not.toMatch(/not-available/);
      expect(iconSrc(el), pack).toMatch(/overcast|cloudy/);
    }
  });

  it('and the same after dark, when the sky cannot be measured', async () => {
    for (const pack of ['meteocons-fill', 'meteocons-line']) {
      const el = await mount({ condition: 'rainy', rain: '0.0', solar: '0', sunState: 'below_horizon', elevation: -22, config: { icon_pack: pack } });
      expect(iconSrc(el), pack).not.toMatch(/not-available/);
    }
  });
});

describe('a gauge that only ticks', () => {
  // The piezo gauge reports in steps of 0.6 mm/h: in a light shower it shows 0.6 for ten minutes
  // and 0.0 between the ticks. On 19 October, 20:33 to 23:48, it made five bursts with gaps of
  // two and five minutes and a lull of a hundred. Read as it stands, each gap handed the icon
  // back to the provider's rain and the next tick took it away again: ten changes in three hours.
  const night: Scene = { condition: 'rainy', solar: '0', sunState: 'below_horizon', elevation: -22 };
  const minutes = (n: number) => n * 60000;
  const T0 = new Date('2026-10-19T17:33:00Z').getTime();

  it('counts a tick as raining for fifteen minutes, so a gap between ticks is not a dry spell', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(T0);
    const el = await mount({ ...night, rain: '0.6' });
    expect(iconSrc(el)).toMatch(/rainy/);
    vi.setSystemTime(T0 + minutes(5));
    await swapStates(el, { ...night, rain: '0.0' });
    expect(iconSrc(el), 'the icon changed in a five-minute gap').toMatch(/rainy/);
    vi.setSystemTime(T0 + minutes(14));
    await swapStates(el, { ...night, rain: '0.0' });
    expect(iconSrc(el)).toMatch(/rainy/);
  });

  it('and lets go after that: a lull of an hour is a dry spell', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(T0);
    const el = await mount({ ...night, rain: '0.6' });
    vi.setSystemTime(T0 + minutes(16));
    await swapStates(el, { ...night, rain: '0.0' });
    expect(iconSrc(el), 'sixteen minutes after the tick').not.toMatch(/rainy/);
  });

  it('starts the fifteen minutes again at every tick', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(T0);
    const el = await mount({ ...night, rain: '0.6' });
    vi.setSystemTime(T0 + minutes(12));
    await swapStates(el, { ...night, rain: '0.6' });
    vi.setSystemTime(T0 + minutes(25));
    await swapStates(el, { ...night, rain: '0.0' });
    expect(iconSrc(el), 'thirteen minutes after the second tick').toMatch(/rainy/);
  });

  it('keeps a shower the provider missed for as long, too', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(T0);
    const el = await mount({ ...night, condition: 'cloudy', rain: '0.6' });
    expect(iconSrc(el)).toMatch(/rainy/);
    vi.setSystemTime(T0 + minutes(8));
    await swapStates(el, { ...night, condition: 'cloudy', rain: '0.0' });
    expect(iconSrc(el)).toMatch(/rainy/);
  });

  it('invents no hold for rain it never saw: a gauge that has read 0.0 all along is dry at once', async () => {
    const el = await mount({ ...night, rain: '0.0' });
    expect(iconSrc(el)).not.toMatch(/rainy/);
  });
});

describe('a provider that drops out for a moment', () => {
  // weather.ivarna103 goes 'unavailable' for 0.2 to 0.5 seconds at the top of every hour,
  // and the card drew the unknown icon, N/A, for as long as it lasted.
  const day: Scene = { condition: 'cloudy', rain: null, solar: '300', sunState: 'above_horizon', elevation: 30 };

  it('keeps showing the last weather through it', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-10-19T09:00:00Z'));
    const el = await mount(day);
    const before = iconSrc(el);
    expect(before).not.toMatch(/unknown/);
    vi.setSystemTime(new Date('2026-10-19T09:00:03Z'));
    await swapStates(el, { ...day, condition: 'unavailable' });
    expect(iconSrc(el), 'the icon changed while the provider was out').toBe(before);
  });

  it('lets go after ten seconds: a provider that has gone has gone', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-10-19T09:00:00Z'));
    const el = await mount(day);
    vi.setSystemTime(new Date('2026-10-19T09:00:11Z'));
    await swapStates(el, { ...day, condition: 'unavailable' });
    expect(iconSrc(el)).toMatch(/unknown/);
  });

  it('invents no weather it never had', async () => {
    const el = await mount({ ...day, condition: 'unavailable' });
    expect(iconSrc(el)).toMatch(/unknown/);
  });
});
