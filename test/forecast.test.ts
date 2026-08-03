import { describe, it, expect } from 'vitest';
import '../src/platinum-weather-card';
import { makeHass, makeForecast, baseConfig, renderCard } from './helpers';

// The chart and the forecast strip must agree: the chart has no labels of its
// own and aligns under the strip's columns, so a mismatch puts every point under
// the wrong day. v2.2.1 shipped with exactly that, after the strip moved to
// date-based lookup and the chart kept using array indices.

async function forecastCard(
  days: number,
  extra: Record<string, unknown> = {},
  forecastStart = 0,
  forecastLength = 6,
) {
  const hass = makeHass(
    {
      'weather.test': {
        state: 'sunny',
        attributes: { temperature: 21, friendly_name: 'Test' },
      },
    },
    { forecast: makeForecast(forecastLength, forecastStart) },
  );
  return (await renderCard(
    baseConfig({
      section_order: ['daily_forecast'],
      weather_entity: 'weather.test',
      entity_forecast_icon_1: 'weather.test',
      entity_forecast_max_1: 'weather.test',
      entity_forecast_min_1: 'weather.test',
      entity_pop_1: 'weather.test',
      entity_pos_1: 'weather.test',
      entity_summary_1: 'weather.test',
      daily_forecast_layout: 'horizontal',
      daily_forecast_days: days,
      option_show_current_day: true,
      show_section_charts: true,
      option_show_temperature_chart: true,
      option_show_precipitation_chart: true,
      ...extra,
    } as never),
    hass,
  )) as HTMLElement;
}

// .day-horiz appears in the strip and again inside the chart's column overlay,
// so count the strip's own columns via the day name they contain.
const dayColumns = (el: HTMLElement) => el.shadowRoot?.querySelectorAll('.dayname').length ?? 0;
// The chart draws its lines as polylines inside an absolutely positioned svg;
// the wind arrows in the strip are svgs too, so identify the chart by its lines.
const chartSvg = (el: HTMLElement) => el.shadowRoot?.querySelector('svg polyline');
const chartPoints = (el: HTMLElement) => {
  const line = el.shadowRoot?.querySelector('svg polyline');
  const pts = line?.getAttribute('points') ?? '';
  return pts.trim() ? pts.trim().split(/\s+/).length : 0;
};

describe('the forecast strip', () => {
  it('renders the requested number of days', async () => {
    expect(dayColumns(await forecastCard(5))).toBe(5);
    expect(dayColumns(await forecastCard(3))).toBe(3);
  });

  it('stops early when the provider runs out of days', async () => {
    // asking for six days from a four-day forecast must not invent two
    const el = await forecastCard(6, {}, 0, 4);
    expect(dayColumns(el)).toBeLessThanOrEqual(4);
  });

  it('shows the forecast temperatures', async () => {
    const el = await forecastCard(3);
    expect(el.shadowRoot?.textContent).toContain('20');
  });
});

describe('the chart', () => {
  it('renders when enabled', async () => {
    expect(chartSvg(await forecastCard(5))).toBeTruthy();
  });

  it('is absent when the section is off', async () => {
    expect(chartSvg(await forecastCard(5, { show_section_charts: false }))).toBeNull();
  });

  it('is absent when both chart types are off', async () => {
    const el = await forecastCard(5, {
      option_show_temperature_chart: false,
      option_show_precipitation_chart: false,
    });
    expect(chartSvg(el)).toBeNull();
  });

  it('plots the same number of days the strip shows', async () => {
    for (const days of [3, 4, 5]) {
      const el = await forecastCard(days);
      const strip = dayColumns(el);
      // one polyline vertex per day: the invariant the regression broke
      expect(chartPoints(el), `${days} days`).toBe(strip);
    }
  });

  it('stays aligned when the provider array does not start today', async () => {
    // The regression's exact shape: just after midnight the array still begins
    // yesterday, so index 0 is a day the strip will not show.
    const el = await forecastCard(5, {}, -1, 6);
    const strip = dayColumns(el);
    expect(chartPoints(el)).toBe(strip);
  });
});

describe('day labels', () => {
  it('shows a weekday', async () => {
    const el = await forecastCard(3);
    expect((el.shadowRoot?.querySelector('.dayname')?.textContent ?? '').trim().length)
      .toBeGreaterThan(0);
  });

  it('adds the date when asked, and shrinks the label to fit', async () => {
    const el = await forecastCard(3, { option_daily_forecast_date: true });
    expect(el.shadowRoot?.querySelector('.dayname')?.textContent).toMatch(/\d/);
    expect(el.shadowRoot?.querySelector('.dayname-with-date')).toBeTruthy();
  });
});

describe('bad forecast data', () => {
  it('never prints NaN', async () => {
    const hass = makeHass(
      { 'weather.test': { state: 'sunny', attributes: { temperature: 21 } } },
      {
        forecast: makeForecast(5).map((f, i) =>
          i === 2 ? { ...f, temperature: null, precipitation: null } : f,
        ),
      },
    );
    const el = (await renderCard(
      baseConfig({
        section_order: ['daily_forecast'],
        weather_entity: 'weather.test',
        entity_forecast_icon_1: 'weather.test',
        entity_forecast_max_1: 'weather.test',
        entity_forecast_min_1: 'weather.test',
        daily_forecast_days: 5,
        option_show_current_day: true,
        show_section_charts: true,
        option_show_temperature_chart: true,
      } as never),
      hass,
    )) as HTMLElement;
    expect(el.shadowRoot?.textContent).not.toContain('NaN');
  });
});
