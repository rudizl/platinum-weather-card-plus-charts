import { describe, it, expect } from 'vitest';
import '../src/platinum-weather-card';
import { makeHass, baseConfig, makeForecast } from './helpers';

// The card subscribes to the daily forecast and, for the hourly strip, to the hourly one. Both must end when the card leaves the page:
// Home Assistant re-creates cards on every change of view, of edit mode, and on every save of the editor, and a subscription that
// outlives its card keeps the card in memory and keeps sending it forecasts.

function countingHass() {
  const live: Record<string, number> = { daily: 0, hourly: 0 };
  const hass = makeHass({ 'weather.home': { state: 'sunny' } }) as ReturnType<typeof makeHass> & { connection: any };
  hass.connection.subscribeMessage = async (cb: (e: unknown) => void, msg: { forecast_type: string }) => {
    live[msg.forecast_type] = (live[msg.forecast_type] ?? 0) + 1;
    setTimeout(() => cb({ type: msg.forecast_type, forecast: makeForecast(5) }), 0);
    return () => { live[msg.forecast_type] -= 1; };
  };
  return { hass, live };
}
const tick = () => new Promise((r) => setTimeout(r, 5));

async function mount(hass: unknown) {
  const el = document.createElement('platinum-weather-card-plus-charts') as HTMLElement & Record<string, any>;
  el.setConfig(baseConfig({ weather_entity: 'weather.home', entity_hourly: 'weather.home', show_section_hourly_forecast: true }));
  el.hass = hass;
  document.body.appendChild(el);
  await el.updateComplete; await tick(); await el.updateComplete; await tick();
  return el;
}

describe('the forecast subscriptions and the life of the card', () => {
  it('a card on the page has one daily and one hourly subscription', async () => {
    const { hass, live } = countingHass();
    const el = await mount(hass);
    expect(live).toEqual({ daily: 1, hourly: 1 });
    el.remove();
  });

  it('a removed card leaves no subscription behind, daily or hourly', async () => {
    const { hass, live } = countingHass();
    const el = await mount(hass);
    el.remove(); await tick();
    expect(live).toEqual({ daily: 0, hourly: 0 });
  });

  it('a card removed and put back three times has one of each again', async () => {
    const { hass, live } = countingHass();
    const el = await mount(hass);
    for (let i = 0; i < 3; i++) {
      el.remove(); await tick();
      document.body.appendChild(el); await el.updateComplete; await tick(); await el.updateComplete; await tick();
    }
    expect(live).toEqual({ daily: 1, hourly: 1 });
    el.remove(); await tick();
    expect(live).toEqual({ daily: 0, hourly: 0 });
  });
});
