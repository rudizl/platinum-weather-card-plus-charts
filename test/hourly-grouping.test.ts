import { describe, it, expect } from 'vitest';
import { render } from 'lit';
import '../src/platinum-weather-card';
import '../src/editor';
import { makeHass, makeForecast, baseConfig, renderCard } from './helpers';

// hourly_forecast_step thins the hours. Thinning by taking every nth one loses what
// happens in between: three-hourly, the rain that falls in the hours that were
// skipped is simply not there. Grouping them instead keeps it, and is a choice.

const H = 'weather.hours';
const NOW = () => { const d = new Date(); d.setMinutes(0, 0, 0); return d; };

type Entry = Record<string, unknown>;
function hours(n: number, over: (i: number) => Entry = () => ({})): Entry[] {
  return Array.from({ length: n }, (_, i) => {
    const d = NOW(); d.setHours(d.getHours() + i);
    return { datetime: d.toISOString(), temperature: 14 + i, condition: 'cloudy', ...over(i) };
  });
}
// the first group has the rain and the wind in its second and third hours
const WET = (i: number): Entry => ({
  condition: ['sunny', 'rainy', 'cloudy'][i] ?? 'cloudy',
  precipitation: [0, 1.2, 0.8][i] ?? 0,
  wind_speed: [10, 25, 15][i] ?? 12,
});

async function mount(extra: Record<string, unknown>, data: Entry[]) {
  const hass = makeHass({ [H]: { state: 'cloudy', attributes: { temperature: 12, supported_features: 3 } }, 'sun.sun': { state: 'above_horizon', attributes: { elevation: 30 } } });
  hass.connection.subscribeMessage = (async (cb: (e: unknown) => void, msg: { type: string; forecast_type?: string }) => {
    if (msg.type === 'weather/subscribe_forecast') {
      const forecast = msg.forecast_type === 'hourly' ? data : makeForecast(6, 0);
      setTimeout(() => cb({ type: msg.forecast_type, forecast }), 0);
    }
    return () => undefined;
  }) as never;
  const el = (await renderCard(baseConfig({
    weather_entity: H, entity_hourly: H, show_section_hourly_forecast: true, show_section_daily_forecast: false,
    section_order: ['daily_forecast'], hourly_forecast_hours: 6, hourly_forecast_step: 3,
    option_hourly_wind: true, option_hourly_shade_night: false, ...extra,
  } as never), hass)) as HTMLElement;
  return el;
}
const cols = (el: HTMLElement) => [...(el.shadowRoot?.querySelectorAll('.hourly-col') ?? [])];
const part = (col: Element, cls: string) => (col.querySelector(`.${cls}`)?.textContent ?? '').replace(/\s+/g, ' ').trim();
const icon = (col: Element) => col.querySelector('.hourly-icon')?.getAttribute('style') ?? '';

describe('the hours in a step, with the choice made', () => {
  it('can be added up: the rain of every hour in the group, under the time it starts', async () => {
    const el = await mount({ option_hourly_group: true }, hours(6, WET));
    const c = cols(el);
    expect(c).toHaveLength(2);
    expect(part(c[0], 'hourly-rain')).toBe('2.0mm');
  });
  it('takes the strongest wind in the group', async () => {
    const c = cols(await mount({ option_hourly_group: true }, hours(6, WET)));
    expect(part(c[0], 'hourly-wind')).toContain('25');
  });
  it('shows the worst weather in the group, not the one hour it happens to start on', async () => {
    const c = cols(await mount({ option_hourly_group: true }, hours(6, WET)));
    expect(icon(c[0])).toMatch(/rainy/);
    expect(icon(c[1])).not.toMatch(/rainy/);
  });
  it('keeps the temperature of the hour the group starts', async () => {
    const c = cols(await mount({ option_hourly_group: true }, hours(6, WET)));
    expect(part(c[0], 'hourly-temp')).toBe('14°');
    expect(part(c[1], 'hourly-temp')).toBe('17°');
  });
  it('makes a short last group of what is left', async () => {
    // 8 hours in threes: 0-2, 3-5 and 6-7, with the rain in the last hour of all
    const c = cols(await mount({ option_hourly_group: true, hourly_forecast_hours: 8 }, hours(9, (i) => ({ precipitation: i === 7 ? 0.4 : 0 }))));
    expect(c).toHaveLength(3);
    expect(part(c[2], 'hourly-rain')).toBe('0.4mm');
  });
  it('is quiet about figures the provider does not give', async () => {
    const c = cols(await mount({ option_hourly_group: true }, hours(6)));
    expect(c).toHaveLength(2);
    expect(part(c[0], 'hourly-rain')).toBe('');
    expect(c[0].textContent).not.toMatch(/NaN|undefined/);
  });
  it('changes nothing at a step of one', async () => {
    const c = cols(await mount({ option_hourly_group: true, hourly_forecast_step: 1 }, hours(6, WET)));
    expect(c).toHaveLength(6);
    expect(part(c[1], 'hourly-rain')).toBe('1.2mm');
  });
});

describe('the hours in a step, as before', () => {
  it('takes every nth hour when the choice is not made — the rain between is not shown', async () => {
    const c = cols(await mount({}, hours(6, WET)));
    expect(c).toHaveLength(2);
    expect(part(c[0], 'hourly-rain')).toBe('');
    expect(part(c[0], 'hourly-wind')).toContain('10');
    expect(icon(c[0])).not.toMatch(/rainy/);
  });
  it('and when it is switched off in so many words', async () => {
    const c = cols(await mount({ option_hourly_group: false }, hours(6, WET)));
    expect(part(c[0], 'hourly-rain')).toBe('');
  });
});

describe('the editor offers the choice', () => {
  it('as a switch beside the step', async () => {
    const el = document.createElement('platinum-weather-card-plus-charts-editor') as HTMLElement & { setConfig: (c: unknown) => void; hass: unknown; updateComplete: Promise<unknown>; _hourlyForecastOptions: () => unknown };
    el.setConfig({ card_config_version: 8, weather_entity: H, entity_hourly: H });
    el.hass = makeHass({ [H]: { state: 'cloudy' } });
    document.body.appendChild(el);
    await el.updateComplete;
    const box = document.createElement('div');
    render(el._hourlyForecastOptions() as never, box);
    const values = [...box.querySelectorAll('.pwc-switch')].map((s) => (s as unknown as { value: string }).value);
    expect(values).toContain('option_hourly_group');
    // off unless chosen
    const sw = [...box.querySelectorAll('.pwc-switch')].find((s) => (s as unknown as { value: string }).value === 'option_hourly_group')!;
    expect(sw.classList.contains('active')).toBe(false);
  });
});

describe('the sections view', () => {
  type Card = HTMLElement & { getGridOptions: () => Record<string, unknown> };
  it('is told the size the card has always had, and the least it can do with', async () => {
    const el = (await renderCard(baseConfig({ section_order: ['overview'] } as never), makeHass({}))) as Card;
    expect(el.getGridOptions()).toEqual({ columns: 12, rows: 'auto', min_columns: 6 });
  });
});
