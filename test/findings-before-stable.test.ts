import { describe, it, expect } from 'vitest';
import '../src/platinum-weather-card';
import { tWarning } from '../src/translations';
import { makeHass, baseConfig, renderCard } from './helpers';

// Three things found while the README pictures were taken, on a real Home Assistant (November 2026).

type State = { state: string; attributes?: Record<string, unknown> };

describe('the lightning row puts a space between the distance and its unit', () => {
  async function row(dist: string, unit: string, az?: string) {
    const states: Record<string, State> = { 'weather.w': { state: 'sunny', attributes: { temperature: 12 } }, 'sensor.ld': { state: dist, attributes: { unit_of_measurement: unit } } };
    if (az !== undefined) states['sensor.la'] = { state: az };
    const el = (await renderCard(baseConfig({ weather_entity: 'weather.w', section_order: ['warnings', 'overview'], show_section_warnings: true,
      entity_lightning_distance: 'sensor.ld', ...(az !== undefined ? { entity_lightning_azimuth: 'sensor.la' } : {}) } as never), makeHass(states))) as HTMLElement;
    return el.shadowRoot!.querySelector('.warning-row .warning-text')?.textContent?.trim();
  }
  it('8 km, with the direction', async () => {
    expect(await row('8', 'km', '45')).toBe(`${tWarning('en', 'type_3')} 8 km NE`);
  });
  it('in miles too, and without a direction', async () => {
    expect(await row('12.4', 'mi')).toBe(`${tWarning('en', 'type_3')} 12 mi`);
  });
});

describe('a time format the card does not know is the one of Home Assistant', () => {
  // `option_time_format` takes `system`, `12hour` or `24hour`. A value such as `24` was passed on as it was, and the times of the sun were
  // drawn as `undefined` (and the update time as `---`): an unknown value now means what `system` means.
  async function fmt(option: string | undefined, ha: string) {
    const hass = makeHass({ 'weather.w': { state: 'sunny', attributes: { temperature: 12 } } });
    (hass as unknown as { locale: Record<string, unknown> }).locale = { ...(hass as unknown as { locale: Record<string, unknown> }).locale, time_format: ha };
    const el = (await renderCard(baseConfig({ weather_entity: 'weather.w', ...(option !== undefined ? { option_time_format: option } : {}) } as never), hass)) as unknown as { timeFormat: string };
    return el.timeFormat;
  }
  it.each([
    ['24', '12', '12hour'], ['12', '24', '24hour'], ['bogus', '24', '24hour'], ['', '12', '12hour'],
  ])('`%s` with Home Assistant at %s is %s', async (option, ha, expected) => {
    expect(await fmt(option, ha)).toBe(expected);
  });
  it('the three that it knows are kept', async () => {
    expect(await fmt('12hour', '24')).toBe('12hour');
    expect(await fmt('24hour', '12')).toBe('24hour');
    expect(await fmt('system', '24')).toBe('24hour');
  });
});

describe('the labels of the chart follow the light or dark mode of Home Assistant', () => {
  // The boxes of the temperatures and of the rain on the chart had a dark background and white text, whatever the theme: in a light theme
  // they were dark patches. In dark mode (and when the mode is not known) they are as they were; in light mode they are light, with the
  // text colour of the theme. Both can be set with --pwcc-chart-label-background and --pwcc-chart-label-color.
  function sensors() {
    const st: Record<string, State> = {};
    for (let i = 1; i <= 5; i++) {
      st[`sensor.icon_${i}`] = { state: 'cloudy' };
      st[`sensor.max_${i}`] = { state: String(15 + i), attributes: { unit_of_measurement: '°C' } };
      st[`sensor.min_${i}`] = { state: String(5 + i), attributes: { unit_of_measurement: '°C' } };
      st[`sensor.pos_${i}`] = { state: `${i}.5`, attributes: { unit_of_measurement: 'mm' } };
    }
    return st;
  }
  async function labels(dark: boolean | undefined) {
    const hass = makeHass(sensors());
    if (dark !== undefined) (hass as unknown as { themes: unknown }).themes = { darkMode: dark };
    else delete (hass as unknown as { themes?: unknown }).themes;
    const el = (await renderCard(baseConfig({ section_order: ['daily_forecast'], entity_forecast_icon_1: 'sensor.icon_1', entity_forecast_max_1: 'sensor.max_1',
      entity_forecast_min_1: 'sensor.min_1', entity_pos_1: 'sensor.pos_1', daily_forecast_layout: 'horizontal', daily_forecast_days: 5, option_show_current_day: true,
      show_section_charts: true, option_show_temperature_chart: true, option_show_precipitation_chart: true } as never), hass)) as HTMLElement;
    return [...el.shadowRoot!.querySelectorAll('div[style]')].map((d) => (d as HTMLElement).getAttribute('style')!).filter((s) => /border:0\.8px solid/.test(s));
  }
  it('in dark mode the boxes are dark with white text, as they were', async () => {
    const ls = await labels(true);
    expect(ls.length).toBeGreaterThanOrEqual(10);
    for (const s of ls) { expect(s).toMatch(/background:var\(--pwcc-chart-label-background, rgba\(10,14,24,0\.(85|9)\)\)/); expect(s).toMatch(/color:var\(--pwcc-chart-label-color, #fff\)/); }
  });
  it('in light mode the boxes are light, with the text colour of the theme', async () => {
    const ls = await labels(false);
    expect(ls.length).toBeGreaterThanOrEqual(10);
    for (const s of ls) { expect(s).toMatch(/background:var\(--pwcc-chart-label-background, rgba\(255,255,255,0\.9\)\)/); expect(s).toMatch(/color:var\(--pwcc-chart-label-color, var\(--primary-text-color, #212121\)\)/); }
  });
  it('when the mode is not known they are dark, as they always were', async () => {
    for (const s of await labels(undefined)) expect(s).toMatch(/rgba\(10,14,24/);
  });
});
