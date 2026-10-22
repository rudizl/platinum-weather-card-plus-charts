import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// sager.ts is covered to the last line; what no test had ever looked at is the card's
// side of it: which sensor becomes which input, in what unit, and what the card does
// with the sky and the rain when it cannot measure them. Those are the decisions that
// make the forecast say "fair" at night, so they are checked here at the seam.
vi.mock('../src/sager', async (original) => {
  const real = await original<typeof import('../src/sager')>();
  return { ...real, sagerForecast: vi.fn(real.sagerForecast) };
});

import '../src/platinum-weather-card';
import { sagerForecast } from '../src/sager';
import { tidalTrendHpaPerHour } from '../src/zambretti';
import { tSager } from '../src/translations';
import { makeHass, baseConfig, renderCard } from './helpers';

const spy = vi.mocked(sagerForecast);
type St = { state: string; attributes?: Record<string, unknown> };
type Card = HTMLElement & { hass: unknown; updateComplete: Promise<unknown>; sagerForecastText: string | null; locale?: string };

const NOON = new Date('2026-10-17T09:00:00Z').getTime(); // 12:00 in Varna
const minutes = (n: number) => n * 60000;
const hours = (n: number) => n * 3600000;

function states(over: Record<string, St> = {}): Record<string, St> {
  return {
    'sensor.p': { state: '1017.8', attributes: { unit_of_measurement: 'hPa' } },
    'sensor.trend': { state: '0.4' },
    'sensor.wd': { state: '20' },
    'sensor.wd6': { state: '350' },
    'sensor.temp': { state: '15', attributes: { unit_of_measurement: '°C' } },
    'sensor.solar': { state: '0' },
    'sensor.rain': { state: '0.0' },
    'sun.sun': { state: 'below_horizon', attributes: { elevation: -20, azimuth: 300 } },
    ...over,
  };
}
const day = (solar: string): Record<string, St> => ({
  'sensor.solar': { state: solar },
  'sun.sun': { state: 'above_horizon', attributes: { elevation: 30, azimuth: 150 } },
});

async function card(config: Record<string, unknown> = {}, st: Record<string, St> = states(), hassConfig?: Record<string, unknown>) {
  const hass = makeHass(st);
  if (hassConfig) (hass as unknown as { config: Record<string, unknown> }).config = { ...(hass as unknown as { config: Record<string, unknown> }).config, ...hassConfig };
  const el = (await renderCard(baseConfig({
    option_forecast_algorithm: 'sager', entity_pressure: 'sensor.p', entity_pressure_trend: 'sensor.trend',
    entity_wind_bearing: 'sensor.wd', entity_wind_bearing_6h: 'sensor.wd6', entity_temperature: 'sensor.temp',
    entity_sun: 'sun.sun', entity_solar_radiation: 'sensor.solar', entity_rain_rate: 'sensor.rain',
    option_cloud_min_elevation_am: 10, option_cloud_min_elevation_pm: 25,
    ...config,
  } as never), hass)) as Card;
  return el;
}
async function swap(el: Card, st: Record<string, St>) {
  el.hass = makeHass(st);
  await el.updateComplete;
  await el.updateComplete;
}
const args = () => spy.mock.calls[spy.mock.calls.length - 1][0];
const run = (el: Card) => { spy.mockClear(); const text = el.sagerForecastText; return { text, a: spy.mock.calls.length ? args() : null }; };

// The cloud and rain memories live on the class, shared by every card on a page: that is
// the point of them, and it means two cards in one test must be told to forget.
function forget() {
  const cls = customElements.get('platinum-weather-card-plus-charts') as unknown as Record<string, unknown>;
  cls._cloudSamples = []; cls._cloudBand = null; cls._lastDaylightCloud = null; cls._lastRain = null;
}
beforeEach(forget);
afterEach(() => vi.useRealTimers());

describe('when Sager runs, and when it does not', () => {
  it('only when it is the chosen algorithm', async () => {
    const el = await card({ option_forecast_algorithm: 'zambretti' });
    expect(run(el).text).toBeNull();
    expect(spy).not.toHaveBeenCalled();
  });
  it('not without a barometer to read: the card falls back rather than guess', async () => {
    const el = await card({ entity_pressure: undefined });
    expect(run(el).text).toBeNull();
    expect(spy).not.toHaveBeenCalled();
  });
  it('not on a barometer that has no number in it', async () => {
    const el = await card({}, states({ 'sensor.p': { state: 'unavailable', attributes: { unit_of_measurement: 'hPa' } } }));
    expect(run(el).text).toBeNull();
  });
});

describe('the barometer', () => {
  it('is passed in hectopascals as the sensor gives it', async () => {
    expect(run(await card()).a?.pressureHpa).toBeCloseTo(1017.8, 1);
  });
  it('is converted from other units: 30.00 inHg is about 1016 hPa', async () => {
    const el = await card({}, states({ 'sensor.p': { state: '30.00', attributes: { unit_of_measurement: 'inHg' } } }));
    expect(run(el).a?.pressureHpa).toBeCloseTo(1015.9, 0);
  });
  it('is reduced to sea level when the station\'s height is given: a station at 154 m reads about 18 hPa low', async () => {
    const el = await card({ option_forecast_altitude: 154 });
    const p = run(el).a!.pressureHpa;
    expect(p).toBeGreaterThan(1030);
    expect(p).toBeLessThan(1040);
  });
  it('is read from a weather entity\'s attribute when that is the source', async () => {
    const el = await card({ entity_pressure: 'weather.home' }, states({ 'weather.home': { state: 'cloudy', attributes: { pressure: 1004, pressure_unit: 'hPa' } } }));
    expect(run(el).a?.pressureHpa).toBeCloseTo(1004, 1);
  });
});

describe('the trend', () => {
  it('is the sensor\'s own figure where the card does not know where it is', async () => {
    const el = await card({}, states(), { latitude: undefined, longitude: undefined });
    expect(run(el).a?.trendHpaPerHour).toBeCloseTo(0.4, 5);
  });
  it('has the atmospheric tide taken off, where it does', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(NOON);
    const el = await card({}, states(), { latitude: 43.2, longitude: 27.9 });
    const tide = tidalTrendHpaPerHour(new Date(NOON), 43.2, 27.9, 3);
    expect(tide).not.toBe(0);
    expect(run(el).a?.trendHpaPerHour).toBeCloseTo(0.4 - tide, 5);
  });
  it('is a steady barometer when there is no trend sensor, not a guess', async () => {
    const el = await card({ entity_pressure_trend: undefined });
    expect(run(el).a?.trendHpaPerHour).toBe(0);
  });
});

describe('the wind', () => {
  it('goes in as the bearing now and the bearing six hours ago', async () => {
    const a = run(await card()).a!;
    expect(a.windBearingDeg).toBe(20);
    expect(a.windBearingSixHoursAgoDeg).toBe(350);
  });
  it('is left out, not zero, when the sensor is unavailable', async () => {
    const el = await card({}, states({ 'sensor.wd': { state: 'unavailable' }, 'sensor.wd6': { state: 'unknown' } }));
    const a = run(el).a!;
    expect(a.windBearingDeg).toBeNull();
    expect(a.windBearingSixHoursAgoDeg).toBeNull();
  });
  it('is left out when there is no sensor for the earlier bearing, and the forecast still runs', async () => {
    const el = await card({ entity_wind_bearing_6h: undefined });
    const { a, text } = run(el);
    expect(a?.windBearingSixHoursAgoDeg).toBeNull();
    expect(text).not.toBeNull();
  });
});

describe('the hemisphere', () => {
  it('is north at the card\'s latitude, and when it does not know it', async () => {
    expect(run(await card({}, states(), { latitude: 43.2 })).a?.northernHemisphere).toBe(true);
    expect(run(await card({}, states(), { latitude: undefined })).a?.northernHemisphere).toBe(true);
  });
  it('is south below the equator', async () => {
    expect(run(await card({}, states(), { latitude: -33.9 })).a?.northernHemisphere).toBe(false);
  });
});

describe('the sky', () => {
  it('is measured by day, from the pyranometer', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(NOON);
    const bright = run(await card({}, states(day('620')))).a?.cloudCover;
    expect(bright, 'a clear midday').not.toBeNull();
    expect(bright as number).toBeLessThan(0.25);
    forget();
    const dull = run(await card({}, states(day('40')))).a?.cloudCover;
    expect(dull as number).toBeGreaterThan(0.85);
  });
  it('is not known after dark, and Sager is told so rather than a number', async () => {
    expect(run(await card()).a?.cloudCover).toBeNull();
  });
  it('is remembered from the last measurement for six hours, and no longer', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(NOON);
    const el = await card({}, states(day('300')));
    const seen = run(el).a?.cloudCover as number;
    expect(seen).not.toBeNull();
    vi.setSystemTime(NOON + hours(5));
    await swap(el, states());
    expect(run(el).a?.cloudCover, 'five hours on, in the dark').toBeCloseTo(seen, 5);
    vi.setSystemTime(NOON + hours(6) + minutes(1));
    await swap(el, states());
    expect(run(el).a?.cloudCover, 'past six hours').toBeNull();
  });
  it('is named in a sentence of its own when it is known', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(NOON);
    const clear = await card({}, states(day('620')));
    expect(run(clear).text).toContain(tSager(clear.locale, 'sky_clear'));
    forget();
    const grey = await card({}, states(day('40')));
    expect(run(grey).text).toContain(tSager(grey.locale, 'sky_overcast'));
  });
  it('and not mentioned when it is not', async () => {
    const el = await card();
    const t = run(el).text!;
    for (const k of ['sky_clear', 'sky_partly', 'sky_cloudy', 'sky_overcast']) expect(t).not.toContain(tSager(el.locale, k));
  });
});

describe('the rain', () => {
  it('goes in as the gauge reads it', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(NOON);
    expect(run(await card({}, states({ 'sensor.rain': { state: '0.6' } }))).a?.rainRateMmH).toBeCloseTo(0.6, 5);
  });
  it('is held for ninety minutes after it stops, as showers rather than at full strength', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(NOON);
    const el = await card({}, states({ 'sensor.rain': { state: '2.4' } }));
    expect(run(el).a?.rainRateMmH).toBeCloseTo(2.4, 5);
    vi.setSystemTime(NOON + minutes(60));
    await swap(el, states({ 'sensor.rain': { state: '0.0' } }));
    expect(run(el).a?.rainRateMmH, 'an hour after the rain stopped').toBe(1);
    vi.setSystemTime(NOON + minutes(95));
    await swap(el, states({ 'sensor.rain': { state: '0.0' } }));
    expect(run(el).a?.rainRateMmH, 'ninety-five minutes after').toBe(0);
  });
  it('is dry for a gauge that has read nothing, and unknown, not dry, for a card with no gauge', async () => {
    expect(run(await card()).a?.rainRateMmH).toBe(0);
    expect(run(await card({ entity_rain_rate: undefined })).a?.rainRateMmH).toBeNull();
  });
});
