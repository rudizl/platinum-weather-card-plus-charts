import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '../src/platinum-weather-card';
import { makeHass, baseConfig, forgetSharedState } from './helpers';

// What the card remembers between readings (the samples of the sky, its band, the last daylight sky, the last shower, the held gauge
// reading, the last real condition) is kept on the class, so that two cards of the same sensors agree. It was kept once for all cards,
// whatever their sensors: on a dashboard with two stations, a card that measures no sky showed the sky of the other, a dry gauge gave
// Sager the other's shower, and one pyranometer's samples were dropped as the other's. It is kept per sensor now.

type El = HTMLElement & Record<string, any>;
const forget = forgetSharedState;
const SUN = { 'sun.sun': { state: 'above_horizon', attributes: { elevation: 45, azimuth: 150 } } };
function card(config: Record<string, unknown>, states: Record<string, { state: string; attributes?: Record<string, unknown> }>): El {
  const el = document.createElement('platinum-weather-card-plus-charts') as El;
  el.setConfig(baseConfig({ entity_sun: 'sun.sun', ...config }));
  el.hass = makeHass({ ...SUN, ...states });
  return el;
}
const set = (el: El, states: Record<string, { state: string; attributes?: Record<string, unknown> }>) => { el.hass = makeHass({ ...SUN, ...states }); };

// The solar reading that gives a sky of this fraction at this sun, found on a card of its own.
function solarFor(fraction: number): string {
  forget();
  let lo = 0, hi = 1500;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    const f = card({ entity_solar_radiation: 'sensor.s' }, { 'sensor.s': { state: String(mid) } })._instantCloudFraction as number;
    if (f > fraction) lo = mid; else hi = mid;
  }
  forget();
  return String((lo + hi) / 2);
}

beforeEach(() => { forget(); vi.useFakeTimers({ toFake: ['Date'] }); vi.setSystemTime(new Date('2026-06-21T10:00:00Z')); });
afterEach(() => { vi.useRealTimers(); forget(); });

describe('the sky is the sensor\u2019s, not the page\u2019s', () => {
  it('a card that measures no sky does not report the sky of another card', () => {
    const covered = solarFor(0.84);
    const a = card({ entity_solar_radiation: 'sensor.solar_a' }, { 'sensor.solar_a': { state: covered } });
    const b = card({}, { 'sensor.solar_a': { state: covered } });
    expect(a.measuredCloudFraction).toBeCloseTo(0.84, 2);
    expect(a.forecastCloudFraction).toBeCloseTo(0.84, 2);
    expect(b.measuredCloudFraction).toBeNull();
    expect(b.forecastCloudFraction).toBeNull();   // nothing measured, nothing remembered, no provider
  });

  it('two pyranometers read a moment apart are two skies', () => {
    const covered = solarFor(0.9), clear = solarFor(0.1);
    const states = { 'sensor.solar_a': { state: covered }, 'sensor.solar_b': { state: clear } };
    const a = card({ entity_solar_radiation: 'sensor.solar_a' }, states);
    const b = card({ entity_solar_radiation: 'sensor.solar_b' }, states);
    for (let i = 0; i < 4; i++) {
      expect(a.measuredCloudFraction, `card A, reading ${i}`).toBeCloseTo(0.9, 2);
      expect(b.measuredCloudFraction, `card B, reading ${i}`).toBeCloseTo(0.1, 2);
      vi.setSystemTime(Date.now() + 1000);
    }
  });

  it('two cards of the same pyranometer still share one sky', () => {
    const first = solarFor(0.8), then = solarFor(0.2);
    const a = card({ entity_solar_radiation: 'sensor.solar' }, { 'sensor.solar': { state: first } });
    const b = card({ entity_solar_radiation: 'sensor.solar' }, { 'sensor.solar': { state: first } });
    expect(a.measuredCloudFraction).toBeCloseTo(0.8, 2);
    vi.setSystemTime(Date.now() + 10000);
    set(b, { 'sensor.solar': { state: then } });
    // the median of the two readings of the one sensor, A's and B's
    expect(b.measuredCloudFraction).toBeCloseTo(0.5, 2);
  });

  it('the last daylight sky is the sensor\u2019s too', () => {
    const covered = solarFor(0.7);
    const a = card({ entity_solar_radiation: 'sensor.solar_a' }, { 'sensor.solar_a': { state: covered } });
    expect(a.forecastCloudFraction).toBeCloseTo(0.7, 2);
    const b = card({ entity_solar_radiation: 'sensor.solar_b' }, { 'sensor.solar_b': { state: 'unavailable' } });
    expect(b.forecastCloudFraction).toBeNull();
    set(a, { 'sensor.solar_a': { state: 'unavailable' } });
    vi.setSystemTime(Date.now() + 3600000);
    expect(a.forecastCloudFraction, 'A remembers its own sky for six hours').toBeCloseTo(0.7, 2);
  });

  it('the band of the icon is the sensor\u2019s: a sky near an edge is not held by the band of another sensor', () => {
    const overcast = solarFor(0.95), nearEdge = solarFor(0.53);
    const states = { 'sensor.solar_a': { state: overcast }, 'sensor.solar_b': { state: nearEdge }, 'sensor.cond': { state: 'sunny' } };
    const cfg = { entity_forecast_icon: 'sensor.cond', option_cloud_overrides_icon: true };
    const a = card({ ...cfg, entity_solar_radiation: 'sensor.solar_a' }, states);
    const b = card({ ...cfg, entity_solar_radiation: 'sensor.solar_b' }, states);
    const urlA = a._getIconUrl('cloudy') as string;
    const urlB = b._getIconUrl('cloudy') as string;
    // B alone, with no band remembered from anything
    forget();
    const urlBAlone = card({ ...cfg, entity_solar_radiation: 'sensor.solar_b' }, states)._getIconUrl('cloudy') as string;
    expect(urlA).not.toBe(urlBAlone);
    expect(urlB, 'B took the band of A').toBe(urlBAlone);
  });
});

describe('the rain is the gauge\u2019s, not the page\u2019s', () => {
  const states = { 'sensor.rain_a': { state: '5' }, 'sensor.rain_b': { state: '0' } };
  it('a card with a dry gauge of its own does not get the shower of another card', () => {
    const a = card({ entity_rain_rate: 'sensor.rain_a' }, states);
    const b = card({ entity_rain_rate: 'sensor.rain_b' }, states);
    expect(a.forecastRainRate).toBe(5);
    expect(b.forecastRainRate).toBe(0);
  });
  it('nor does a card with no gauge at all', () => {
    const a = card({ entity_rain_rate: 'sensor.rain_a' }, states);
    const c = card({}, states);
    expect(a.forecastRainRate).toBe(5);
    expect(c.forecastRainRate).toBeNull();
  });
  it('a shower is still held for the forecast of the cards of that gauge', () => {
    const a = card({ entity_rain_rate: 'sensor.rain_a' }, states);
    const d = card({ entity_rain_rate: 'sensor.rain_a' }, states);
    expect(a.forecastRainRate).toBe(5);
    vi.setSystemTime(Date.now() + 60000);
    set(d, { 'sensor.rain_a': { state: '0' } });
    expect(d.forecastRainRate, 'a minute after the shower, on the same gauge').toBe(1);
  });
  it('the gauge reading held for the icon is not lost to another gauge that rains', () => {
    const a = card({ entity_rain_rate: 'sensor.rain_a' }, { 'sensor.rain_a': { state: '3' } });
    const b = card({ entity_rain_rate: 'sensor.rain_b' }, { 'sensor.rain_b': { state: '6' } });
    expect(a._gaugeRateForIcon()).toBe(3);
    expect(b._gaugeRateForIcon()).toBe(6);
    vi.setSystemTime(Date.now() + 60000);
    set(a, { 'sensor.rain_a': { state: '0' } });
    expect(a._gaugeRateForIcon(), 'A, a minute after its tick: still raining for the icon').toBe(3);
    set(a, { 'sensor.rain_a': { state: 'unavailable' } });
    set(b, { 'sensor.rain_b': { state: '6' } });
    b._gaugeRateForIcon();
    expect(a._gaugeRateForIcon(), 'A, its gauge gone for a moment').toBe(0);
  });
});

describe('the condition held over a provider\u2019s blink is the provider\u2019s', () => {
  it('a weather entity that blinks shows its own last condition, not that of another card', () => {
    const states = { 'weather.a': { state: 'rainy' }, 'weather.b': { state: 'sunny' } };
    const a = card({ entity_forecast_icon: 'weather.a' }, states);
    const b = card({ entity_forecast_icon: 'weather.b' }, states);
    expect(a.forecastIcon).toBe('rainy');
    expect(b.forecastIcon).toBe('sunny');
    vi.setSystemTime(Date.now() + 2000);
    set(a, { 'weather.a': { state: 'unavailable' }, 'weather.b': { state: 'sunny' } });
    expect(a.forecastIcon).toBe('rainy');
  });
});
