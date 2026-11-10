import { describe, it, expect, beforeEach } from 'vitest';
import '../src/platinum-weather-card';
import { makeHass, baseConfig, renderCard, forgetSharedState } from './helpers';

// The local forecast in two parts (10 November): on a day when Sager foresaw a change of both wind and temperature, four sentences in the
// large type of the forecast took half the card. The forecast stays large; what follows it (the sky, the wind, the temperature, or the
// pressure of Zambretti) is drawn smaller under it. The words are the same, and so is the whole text.

type Card = HTMLElement & { sagerForecastText: string | null; localForecastText: string | null };
const parts = (el: Card) => {
  const box = el.shadowRoot!.querySelector('.forecast-text') as HTMLElement;
  const details = box.querySelector('.forecast-details');
  // the text of the large line only: lit leaves comments among the nodes
  const main = [...box.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join('').trim();
  return { main, details: details?.textContent?.trim() ?? null };
};

async function sager(extra: Record<string, unknown> = {}) {
  return (await renderCard(baseConfig({ section_order: ['overview'], overview_layout: 'complete', option_local_forecast: true,
    option_forecast_algorithm: 'sager', entity_pressure: 'sensor.p', entity_pressure_trend: 'sensor.trend', entity_wind_bearing: 'sensor.wd',
    entity_wind_bearing_6h: 'sensor.wd6', entity_temperature: 'sensor.temp', entity_sun: 'sun.sun', entity_solar_radiation: 'sensor.solar',
    ...extra } as never), makeHass({
      'sensor.p': { state: '1004', attributes: { unit_of_measurement: 'hPa' } }, 'sensor.trend': { state: '-1.5' },
      'sensor.wd': { state: '200' }, 'sensor.wd6': { state: '250' }, 'sensor.temp': { state: '15', attributes: { unit_of_measurement: '°C' } },
      'sensor.solar': { state: '50' }, 'sun.sun': { state: 'above_horizon', attributes: { elevation: 30, azimuth: 150 } },
    }))) as Card;
}
async function zambretti(extra: Record<string, unknown> = {}) {
  return (await renderCard(baseConfig({ section_order: ['overview'], overview_layout: 'complete', option_local_forecast: true,
    entity_pressure: 'sensor.press', entity_pressure_trend: 'sensor.trend', ...extra } as never), makeHass({
      'sensor.press': { state: '1020', attributes: { unit_of_measurement: 'hPa' } }, 'sensor.trend': { state: '2.0', attributes: { unit_of_measurement: 'hPa/h' } },
    }))) as Card;
}

describe('the local forecast, large, and what follows it, small', () => {
  beforeEach(() => forgetSharedState());
  it('Sager: the forecast alone in the large line, the rest under it, the whole text as before', async () => {
    const el = await sager({ option_local_forecast_verbose: true });
    const { main, details } = parts(el);
    expect(details).toBeTruthy();
    expect(main).not.toContain(details!);
    expect(`${main} ${details}`).toBe(el.sagerForecastText);
    // the large line is one sentence: the forecast
    expect(main.split(/[.!?](\s|$)/).filter((x) => x && x.trim()).length).toBe(1);
  });
  it('Zambretti verbose: the forecast large, the pressure small', async () => {
    const { main, details } = parts(await zambretti({ option_local_forecast_verbose: true }));
    expect(details?.toLowerCase()).toContain('pressure');
    expect(main.toLowerCase()).not.toContain('pressure');
  });
  it('Zambretti short: one line, nothing under it', async () => {
    expect(parts(await zambretti()).details).toBeNull();
  });
});
