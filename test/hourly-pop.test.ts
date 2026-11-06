import { describe, it, expect, afterEach, vi } from 'vitest';
import '../src/platinum-weather-card';
import { makeHass, makeForecast, baseConfig, renderCard } from './helpers';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

// Discussion #34: the hourly strip says how much rain is expected, and not how likely it is, which is what someone watching
// the washing on the line wants to know. The chance of rain goes under the temperature of an hour that has one.

const H = 'weather.hours';
const NOW = '2026-10-24T08:30:00Z';
type Entry = Record<string, unknown>;
const hours = (chances: Array<number | undefined>, over: (i: number) => Entry = () => ({})): Entry[] =>
  chances.map((c, i) => ({
    datetime: new Date(Date.UTC(2026, 9, 24, 9 + i)).toISOString(), temperature: 14 + i, condition: 'cloudy', precipitation: 0,
    ...(c === undefined ? {} : { precipitation_probability: c }), ...over(i),
  }));

afterEach(() => vi.useRealTimers());

async function mount(data: Entry[], extra: Record<string, unknown> = {}) {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(NOW));
  const hass = makeHass({
    [H]: { state: 'cloudy', attributes: { temperature: 14, supported_features: 3 } },
    'sun.sun': { state: 'above_horizon', attributes: { elevation: 20 } },
  });
  hass.connection.subscribeMessage = (async (cb: (e: unknown) => void, msg: { type: string; forecast_type?: string }) => {
    if (msg.type === 'weather/subscribe_forecast') {
      const forecast = msg.forecast_type === 'hourly' ? data : makeForecast(6, 0);
      setTimeout(() => cb({ type: msg.forecast_type, forecast }), 0);
    }
    return () => undefined;
  }) as never;
  return (await renderCard(baseConfig({
    weather_entity: H, entity_hourly: H, entity_sun: 'sun.sun', show_section_hourly_forecast: true, show_section_daily_forecast: false,
    section_order: ['daily_forecast'], hourly_forecast_hours: 6, hourly_forecast_step: 1, ...extra,
  } as never), hass)) as HTMLElement;
}
const cols = (el: HTMLElement) => [...(el.shadowRoot?.querySelectorAll('.hourly-col') ?? [])];
const pops = (el: HTMLElement) => cols(el).map((c) => (c.querySelector('.hourly-pop')?.textContent ?? '').trim());

describe('the chance of rain under the hours', () => {
  it('is a percentage under each hour that has one, and nothing under the dry ones', async () => {
    expect(pops(await mount(hours([0, 30, 43.6, 80, 0, 5])))).toEqual(['', '30%', '44%', '80%', '', '5%']);
  });
  it('is not there when the whole span is dry, rather than a column of zeroes', async () => {
    const el = await mount(hours([0, 0, 0, 0, 0, 0]));
    expect(cols(el)).toHaveLength(6);
    expect(el.shadowRoot?.querySelector('.hourly-pop')).toBeNull();
  });
  it('is not there when the provider gives no chances', async () => {
    const el = await mount(hours([undefined, undefined, undefined, undefined, undefined, undefined]));
    expect(cols(el)).toHaveLength(6);
    expect(el.shadowRoot?.querySelector('.hourly-pop')).toBeNull();
  });
  it('can be turned off', async () => {
    const el = await mount(hours([10, 20, 30, 40, 50, 60]), { option_hourly_pop: false });
    expect(el.shadowRoot?.querySelector('.hourly-pop')).toBeNull();
  });
  it('is on when nothing is said about it: the strip is new in this version, and this is what it is for', async () => {
    expect(pops(await mount(hours([10, 20, 30, 40, 50, 60]))).every((p) => p !== '')).toBe(true);
  });
  it('sits with the amount of rain and does not replace it, each by its own switch', async () => {
    const data = hours([10, 20, 30, 40, 50, 60], (i) => ({ precipitation: i === 2 ? 1.2 : 0 }));
    const both = await mount(data);
    expect(pops(both)[2]).toBe('30%');
    expect(both.shadowRoot?.querySelectorAll('.hourly-rain').length).toBeGreaterThan(0);
    const onlyChance = await mount(data, { option_hourly_precipitation: false });
    expect(onlyChance.shadowRoot?.querySelector('.hourly-rain')).toBeNull();
    expect(pops(onlyChance)[2]).toBe('30%');
    const onlyAmount = await mount(data, { option_hourly_pop: false });
    expect(onlyAmount.shadowRoot?.querySelector('.hourly-pop')).toBeNull();
    expect(onlyAmount.shadowRoot?.querySelectorAll('.hourly-rain').length).toBeGreaterThan(0);
  });
  it('is the highest of a group of hours, since one of them may well be wet', async () => {
    const el = await mount(hours([10, 70, 20, 5, 5, 40]), { hourly_forecast_hours: 6, hourly_forecast_step: 3, option_hourly_group: true });
    expect(pops(el)).toEqual(['70%', '40%']);
  });
  it('is under the temperature, before the rain, in the order a person reads', async () => {
    const col = cols(await mount(hours([50, 50, 50, 50, 50, 50], () => ({ precipitation: 0.4 }))))[0];
    const order = [...col.children].map((c) => c.className.replace(/hourly-/g, '').trim().split(' ')[0]);
    expect(order.indexOf('temp')).toBeLessThan(order.indexOf('pop'));
    expect(order.indexOf('pop')).toBeLessThan(order.indexOf('rain'));
  });
});

describe('the words for it, in every language', () => {
  const dir = join(__dirname, '..', 'src', 'translations');
  const files = readdirSync(dir).filter((f) => f.endsWith('.ts') && !['index.ts', 'types.ts'].includes(f));
  it('has the switch and its hint in each of the translation files', () => {
    expect(files.length).toBeGreaterThanOrEqual(15);
    for (const f of files) {
      const src = readFileSync(join(dir, f), 'utf8');
      expect(src, f).toMatch(/"hourly_pop":\s*"[^"]{3,}"/);
      expect(src, f).toMatch(/"hourly_pop_hint":\s*"[^"]{3,}"/);
    }
  });
});
