import { describe, it, expect } from 'vitest';
import '../src/platinum-weather-card';
import { makeHass, makeForecast, baseConfig, renderCard } from './helpers';

// The forecast is the weather entity's, in the units that the entity gives (Home Assistant converts the forecast to them), so the
// tooltips and the rain chart must say those units. They read them from `entity`, a setting the card no longer has (it is
// weather_entity), and fell back to the unit system: a forecast in m/s was labelled km/h, one in inches, mm.

const forecast = makeForecast(5).map((f) => ({ ...f, precipitation: 0.4, wind_speed: 5, wind_bearing: 180 }));

async function card(attributes: Record<string, unknown>, extra: Record<string, unknown> = {}) {
  return (await renderCard(
    baseConfig({
      weather_entity: 'weather.test', section_order: ['daily_forecast'], show_section_charts: true,
      option_show_temperature_chart: true, option_show_precipitation_chart: true,
      daily_forecast_days: 3, option_show_current_day: true, option_tooltips: true, ...extra,
    } as never),
    makeHass({ 'weather.test': { state: 'sunny', attributes: { temperature: 21, ...attributes } } }, { forecast }),
  )) as HTMLElement & Record<string, any>;
}
const blocks = (el: HTMLElement) => [...(el.shadowRoot?.querySelectorAll('.fcasttooltipblock') ?? [])].map((b) => b.textContent ?? '');

describe('the units of the forecast are the weather entity\u2019s', () => {
  it('the wind unit is the one the weather entity gives, in a metric house', async () => {
    expect((await card({ wind_speed_unit: 'm/s' }))._getWindUnit()).toBe('m/s');
    expect((await card({ wind_speed_unit: 'mph' }))._getWindUnit()).toBe('mph');
  });

  it('is the forecast\u2019s, not that of a wind sensor of the station', async () => {
    const el = (await renderCard(
      baseConfig({ weather_entity: 'weather.test', entity_wind_speed: 'sensor.wind' } as never),
      makeHass({
        'weather.test': { state: 'sunny', attributes: { wind_speed_unit: 'm/s' } },
        'sensor.wind': { state: '12', attributes: { unit_of_measurement: 'km/h' } },
      }, { forecast }),
    )) as HTMLElement & Record<string, any>;
    expect(el._getWindUnit()).toBe('m/s');
  });

  it('without one, the unit system decides as before', async () => {
    expect((await card({}))._getWindUnit()).toBe('km/h');
  });

  it('the unit of the rain chart is in', async () => {
    const el = await card({ wind_speed_unit: 'm/s', precipitation_unit: 'in' });
    const text = el.shadowRoot?.textContent ?? '';
    expect(text).toMatch(/0\.4\s*in(?![a-z])/);
    expect(text).not.toMatch(/0\.4\s*mm/);
  });

  it('the tooltips of the strip and of the charts say m/s and in', async () => {
    const el = await card({ wind_speed_unit: 'm/s', precipitation_unit: 'in' });
    const all = blocks(el);
    expect(all.length, 'three days of the strip and three of the charts').toBe(6);
    for (const t of all) {
      expect(t).toContain('m/s');
      expect(t).not.toContain('km/h');
      expect(t).toMatch(/0\.4\s*in(?![a-z])/);
      expect(t).not.toMatch(/0\.4\s*mm/);
    }
  });

  it('the tooltips of the strip say so with a summary entity too', async () => {
    const el = await card({ wind_speed_unit: 'm/s', precipitation_unit: 'in' }, { entity_summary_1: 'weather.test' });
    const strip = blocks(el).slice(0, 3);
    expect(strip.length).toBe(3);
    for (const t of strip) {
      expect(t).toContain('m/s');
      expect(t).toMatch(/0\.4\s*in(?![a-z])/);
    }
  });
});
