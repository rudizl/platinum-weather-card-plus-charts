import { describe, it, expect, afterEach, vi } from 'vitest';
import '../src/platinum-weather-card';
import { makeHass, makeForecast, baseConfig, renderCard } from './helpers';

// Seen on the card on the night of 23 October: the hourly strip, with 23:00 and 01:00 in it, drew a sun. Forecast icons are
// made day icons on purpose (a day's icon is the day's), and the hourly strip took that over, though its hours are
// night as well as day. The card already works out where the sun is for each hour, to shade the nights; the icon asks it too.

const H = 'weather.hours';
const NOW = '2026-10-23T19:30:00Z'; // 22:30 in Varna (UTC+3 until the 25th): night
// Varna on 24 October: the sun rises about 07:30 and sets about 18:13 local, so about 04:30 and 15:13 UTC
const HOURS: Record<string, string> = {
  night1: '2026-10-23T20:00:00Z', // 23:00
  night2: '2026-10-23T22:00:00Z', // 01:00
  night3: '2026-10-24T00:00:00Z', // 03:00
  night4: '2026-10-24T02:00:00Z', // 05:00
  day1: '2026-10-24T05:00:00Z',   // 08:00
  day2: '2026-10-24T07:00:00Z',   // 10:00
};
type Entry = Record<string, unknown>;
const entries = (over: (k: string) => Entry = () => ({})): Entry[] =>
  Object.entries(HOURS).map(([k, datetime], i) => ({ datetime, temperature: 10 + i, condition: 'sunny', ...over(k) }));

afterEach(() => vi.useRealTimers());

async function mount(data: Entry[], extra: Record<string, unknown> = {}, config: Record<string, unknown> = {}) {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(NOW));
  const hass = makeHass({
    [H]: { state: 'sunny', attributes: { temperature: 12, supported_features: 3 } },
    'sun.sun': { state: 'below_horizon', attributes: { elevation: -30, azimuth: 330 } },
  });
  // the helper's overrides replace the whole configuration, so the place is changed on the one it made
  hass.config = { ...hass.config, ...config };
  hass.connection.subscribeMessage = (async (cb: (e: unknown) => void, msg: { type: string; forecast_type?: string }) => {
    if (msg.type === 'weather/subscribe_forecast') {
      const forecast = msg.forecast_type === 'hourly' ? data : makeForecast(6, 0);
      setTimeout(() => cb({ type: msg.forecast_type, forecast }), 0);
    }
    return () => undefined;
  }) as never;
  return (await renderCard(baseConfig({
    weather_entity: H, entity_hourly: H, entity_sun: 'sun.sun', show_section_hourly_forecast: true, show_section_daily_forecast: false,
    section_order: ['daily_forecast'], hourly_forecast_hours: 6, hourly_forecast_step: 1,
    // the shading of the nights is off: the icon must not depend on it
    option_hourly_shade_night: false, ...extra,
  } as never), hass)) as HTMLElement & { _getIconUrl: (n: string, f?: boolean) => string };
}
const cols = (el: HTMLElement) => [...(el.shadowRoot?.querySelectorAll('.hourly-col') ?? [])];
const icon = (col: Element) => col.querySelector('.hourly-icon')?.getAttribute('style') ?? '';

describe('the icon of an hour is the icon of its sky', () => {
  it('a clear sky at night is the moon, and by day the sun', async () => {
    const c = cols(await mount(entries()));
    expect(c).toHaveLength(6);
    for (let i = 0; i < 4; i++) expect(icon(c[i]), `hour ${i}`).toMatch(/clear-night/);
    for (let i = 4; i < 6; i++) expect(icon(c[i]), `hour ${i}`).toMatch(/clear-day/);
  });
  it('whatever the card thinks of the time now: it is the hour that decides', async () => {
    // the sun entity says day, and the strip begins at night all the same
    const el = await mount(entries());
    const hass = (el as unknown as { hass: { states: Record<string, { state: string }> } }).hass;
    hass.states['sun.sun'].state = 'above_horizon';
    (el as unknown as { hass: unknown }).hass = { ...hass };
    await (el as unknown as { updateComplete: Promise<unknown> }).updateComplete;
    const c = cols(el);
    expect(icon(c[0])).toMatch(/clear-night/);
    expect(icon(c[5])).toMatch(/clear-day/);
  });
  it('and for the other skies that have a night: partly cloudy is a moon behind a cloud', async () => {
    const c = cols(await mount(entries(() => ({ condition: 'partlycloudy' }))));
    expect(icon(c[1])).toMatch(/cloudy-2-night/);
    expect(icon(c[4])).toMatch(/cloudy-2-day/);
  });
  it('a sky that has no night is the same by night: rain, snow, cloud', async () => {
    const c = cols(await mount(entries(() => ({ condition: 'snowy' }))));
    expect(icon(c[1])).toBe(icon(c[4]));
  });
  it('a provider that says the hour is day or night is believed, over the sun', async () => {
    const c = cols(await mount(entries((k) => (k === 'day2' ? { is_daytime: false } : k === 'night1' ? { is_daytime: true } : {}))));
    expect(icon(c[5]), 'noon that the provider calls night').toMatch(/clear-night/);
    expect(icon(c[0]), 'midnight that the provider calls day').toMatch(/clear-day/);
  });
  it('the shading of the nights is another choice, and the icon does not follow it', async () => {
    const off = cols(await mount(entries(), { option_hourly_shade_night: false }));
    const on = cols(await mount(entries(), { option_hourly_shade_night: true }));
    for (let i = 0; i < 6; i++) expect(icon(on[i])).toBe(icon(off[i]));
  });
  it('without a place on Earth there is no night to work out: as it was, the day icon', async () => {
    const c = cols(await mount(entries(), {}, { latitude: undefined, longitude: undefined }));
    for (let i = 0; i < 6; i++) expect(icon(c[i]), `hour ${i}`).toMatch(/clear-day/);
  });
  it('a group of hours is a night or a day by the hour it begins', async () => {
    const c = cols(await mount(entries(), { hourly_forecast_step: 3, option_hourly_group: true }));
    expect(icon(c[0])).toMatch(/clear-night/);
  });
});

describe('the days stay the days', () => {
  it('a daily forecast is a day icon, as it has always been: the sky of the day', async () => {
    const el = await mount(entries());
    expect(el._getIconUrl('clear-night', true)).toMatch(/clear-day/);
    expect(el._getIconUrl('cloudy-2-night', true)).toMatch(/cloudy-2-day/);
  });
});
