import { describe, it, expect } from 'vitest';
import '../src/platinum-weather-card';
import { makeHass, makeForecast, baseConfig, renderCard } from './helpers';

// #35 was the strip and the charts; the slots of today's figures took the first entry of the forecast as it came: with the National Weather Service that is a day or, in the evening, a night,
// so the high could be the night's temperature and the low was never there. The slots read today as the strip reads a day: the high from the day, the low from the night.

type Entry = Record<string, unknown>;
const at = (offset: number, hour: number): string => { const d = new Date(); d.setHours(hour, 0, 0, 0); d.setDate(d.getDate() + offset); return d.toISOString(); };
function twiceDaily(days: number, opts: { firstDayNightOnly?: boolean } = {}): Entry[] {
  const out: Entry[] = [];
  for (let i = 0; i < days; i++) {
    if (!(i === 0 && opts.firstDayNightOnly)) out.push({ datetime: at(i, 9), is_daytime: true, condition: 'sunny', temperature: 20 + i, precipitation_probability: 10 + i, precipitation: 1.5 });
    out.push({ datetime: at(i, 21), is_daytime: false, condition: 'rainy', temperature: i === 0 ? 3 : 8 + i, precipitation_probability: 60, precipitation: 4 });
  }
  return out;
}
async function card(forecast: Entry[], type: 'twice_daily' | 'daily' = 'twice_daily') {
  const hass = makeHass({ 'weather.test': { state: 'sunny', attributes: { temperature: 21, friendly_name: 'Test' } } }, { forecast });
  return (await renderCard(baseConfig({
    section_order: ['overview', 'slots'], weather_entity: 'weather.test', forecast_type: type,
    slot_l1: 'forecast_max', slot_l2: 'forecast_min', slot_r1: 'pop', slot_r2: 'possible_today',
  } as never), hass)) as HTMLElement;
}
const slot = (el: HTMLElement, name: string, cls: string) => (el.shadowRoot?.querySelector(`[data-slot="${name}"] .${cls}`)?.textContent ?? '').replace(/\s+/g, ' ').trim();
const high = (el: HTMLElement) => slot(el, 'forecast_max', 'forecast-max-text');
const low = (el: HTMLElement) => slot(el, 'forecast_min', 'forecast-min-text');
const pop = (el: HTMLElement) => slot(el, 'pop', 'pop-text');
const pos = (el: HTMLElement) => slot(el, 'possible_today', 'possible_today-text');

describe('the slots of today, with a twice-daily forecast', () => {
  it('the high is the day\u2019s and the low is the night\u2019s', async () => {
    const el = await card(twiceDaily(5));
    expect(high(el)).toBe('20');
    expect(low(el)).toBe('3');
  });
  it('the chance of rain and the amount are the day\u2019s', async () => {
    const el = await card(twiceDaily(5));
    expect(pop(el)).toBe('10');
    expect(pos(el)).toBe('1.5');
  });
  it('in the evening, when today is only a night: the night is the low, and there is no high', async () => {
    const el = await card(twiceDaily(5, { firstDayNightOnly: true }));
    expect(low(el)).toBe('3');
    expect(high(el)).toBe('---');
    expect(pop(el)).toBe('60');
  });
});

describe('the slots of today, with a daily forecast, are as they were', () => {
  it('even when a provider gives two entries for one date and does not say which is the day: the first, as it was', async () => {
    const forecast: Entry[] = [
      { datetime: at(0, 9), condition: 'sunny', temperature: 17, templow: 6, precipitation_probability: 25, precipitation: 0.5 },
      { datetime: at(0, 21), condition: 'rainy', temperature: 9, templow: 4, precipitation_probability: 80, precipitation: 3 },
      { datetime: at(1, 9), condition: 'sunny', temperature: 18, templow: 7 },
    ];
    const el = await card(forecast, 'daily');
    expect(high(el)).toBe('17');
    expect(low(el)).toBe('6');
    expect(pop(el)).toBe('25');
  });
  it('the first entry: its high and its low', async () => {
    const forecast = makeForecast(5, 0) as unknown as Entry[];
    const el = await card(forecast, 'daily');
    const first = forecast[0];
    expect(high(el)).toBe(String(Math.round(Number(first.temperature))));
    expect(low(el)).toBe(String(Math.round(Number(first.templow))));
  });
});
