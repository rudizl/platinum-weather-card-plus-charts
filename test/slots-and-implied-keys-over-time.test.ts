import { describe, it, expect } from 'vitest';
import '../src/platinum-weather-card';
import { makeHass, baseConfig, makeForecast } from './helpers';

// Two behaviours that no test held, so that breaking them passed every test (mutations M1 and M14 of the analysis of 2.6.0).

const tick = () => new Promise((r) => setTimeout(r, 5));
const slots = (el: HTMLElement) => [...(el.shadowRoot?.querySelectorAll('li[data-slot]') ?? [])].map((l) => (l as HTMLElement).dataset.slot);

describe('the default chance-of-rain slot, before and after the forecast', () => {
  // Whether a forecast gives a chance or an amount of rain is known only when the forecast comes, a moment after the card. Until then
  // the slot is drawn (most forecasts do give it, and a slot that appears late moves the card); when the forecast comes without it,
  // it is taken away.
  async function mount(forecast: unknown[]) {
    const hass = makeHass({ 'weather.home': { state: 'sunny', attributes: { temperature: 20 } } }, { forecast });
    const el = document.createElement('platinum-weather-card-plus-charts') as HTMLElement & Record<string, any>;
    el.setConfig(baseConfig({ weather_entity: 'weather.home', section_order: ['slots'] }));
    el.hass = hass;
    document.body.appendChild(el);
    await el.updateComplete;
    return el;
  }

  it('is drawn while there is no forecast yet', async () => {
    const el = await mount(makeForecast(6));
    expect(el.forecast1).toBeUndefined();
    expect(slots(el)).toContain('popforecast');
    el.remove();
  });

  it('is taken away when the forecast comes and gives neither a chance nor an amount of rain', async () => {
    const dry = makeForecast(6).map(({ precipitation, precipitation_probability, ...rest }) => rest);
    const el = await mount(dry);
    expect(slots(el)).toContain('popforecast');
    await tick(); await el.updateComplete;
    expect(el.forecast1?.length).toBeGreaterThan(0);
    expect(slots(el)).not.toContain('popforecast');
    el.remove();
  });

  it('and stays when the forecast gives it', async () => {
    const el = await mount(makeForecast(6));
    await tick(); await el.updateComplete;
    expect(el.forecast1?.length).toBeGreaterThan(0);
    expect(slots(el)).toContain('popforecast');
    el.remove();
  });
});

describe('the implied settings follow the latest configuration', () => {
  // The editor's live preview calls setConfig again on every change. A setting implied by the first configuration and set by the user
  // in the next is the user's: a sensor that is not there is warned about.
  it('the settings the card implied itself are not warned about, even when the weather entity is missing', () => {
    const el = document.createElement('platinum-weather-card-plus-charts') as HTMLElement & Record<string, any>;
    el.hass = makeHass({});
    el.setConfig(baseConfig({ weather_entity: 'weather.gone' }));
    expect(el._impliedKeys.size).toBeGreaterThan(10);
    el._checkForErrors();
    expect(el._error.filter((e: string) => /^'entity_/.test(e))).toEqual([]);
  });

  it('a sensor set after a configuration that implied the setting, and missing, is warned about', async () => {
    const el = document.createElement('platinum-weather-card-plus-charts') as HTMLElement & Record<string, any>;
    el.hass = makeHass({ 'weather.home': { state: 'sunny', attributes: { humidity: 60 } } });
    el.setConfig(baseConfig({ weather_entity: 'weather.home' }));
    expect(el._impliedKeys.has('entity_humidity')).toBe(true);
    el.setConfig(baseConfig({ weather_entity: 'weather.home', entity_humidity: 'sensor.x' }));
    expect(el._impliedKeys.has('entity_humidity')).toBe(false);
    el._checkForErrors();
    expect(el._error).toContain("'entity_humidity=sensor.x' not found");
  });
});
