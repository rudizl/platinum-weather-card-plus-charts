import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import '../src/platinum-weather-card';
import { makeHass, baseConfig, makeForecast } from './helpers';

// The daily forecast is a subscription that Home Assistant can refuse ("Weather entity not found": an integration that has not loaded
// yet, or has failed). The refusal went unhandled, twice (once more when the card left the page), and the card never asked again: it
// stayed without a forecast until the page was reloaded. It asks when the entity is there, asks again when the entity changes, and does
// not ask in a loop (a refusal must not be a state change that schedules the next refusal: #23 was such a loop, for the hourly one).

type El = HTMLElement & Record<string, any>;
const tick = () => new Promise((r) => setTimeout(r, 5));
let unhandled: unknown[] = [];
const onUnhandled = (e: unknown) => { unhandled.push(e); };
beforeEach(() => { unhandled = []; process.on('unhandledRejection', onUnhandled); });
afterEach(() => { process.off('unhandledRejection', onUnhandled); });

// A card that asks again on every refusal loops without end and starves the timers, so the test would hang rather than fail: past
// twenty tries the mock stops refusing, the loop ends, and the count of tries says what happened.
function hassWith(states: Record<string, { state: string; attributes?: Record<string, unknown> }>, refuse: () => boolean, tries: { n: number }, delay = 0) {
  const hass = makeHass(states) as ReturnType<typeof makeHass> & { connection: any };
  hass.connection.subscribeMessage = async (cb: (e: unknown) => void, msg: { forecast_type: string }) => {
    if (msg.forecast_type === 'hourly') return () => undefined;
    tries.n += 1;
    if (delay) await new Promise((r) => setTimeout(r, delay));
    if (refuse() && tries.n <= 20) throw { code: 'not_found', message: 'Weather entity not found' };
    setTimeout(() => cb({ type: msg.forecast_type, forecast: makeForecast(5) }), 0);
    return () => undefined;
  };
  return hass;
}
async function settle(el: El) { for (let i = 0; i < 4; i++) { await el.updateComplete; await tick(); } }

describe('a daily forecast subscription that Home Assistant refuses', () => {
  it('is not asked for while the weather entity is not there, and is when it appears', async () => {
    const tries = { n: 0 };
    const el = document.createElement('platinum-weather-card-plus-charts') as El;
    el.setConfig(baseConfig({ weather_entity: 'weather.late' }));
    el.hass = hassWith({}, () => false, tries);
    document.body.appendChild(el);
    await settle(el);
    expect(tries.n).toBe(0);
    el.hass = hassWith({ 'weather.late': { state: 'sunny' } }, () => false, tries);
    await settle(el);
    expect(tries.n).toBe(1);
    expect(el.forecast1?.length).toBeGreaterThan(0);
    el.remove(); await tick();
    expect(unhandled).toEqual([]);
  });

  it('is refused without an unhandled rejection, and is not asked for again in a loop', async () => {
    const tries = { n: 0 };
    const states = { 'weather.home': { state: 'sunny' } };
    const hass = hassWith(states, () => true, tries);
    const el = document.createElement('platinum-weather-card-plus-charts') as El;
    el.setConfig(baseConfig({ weather_entity: 'weather.home' }));
    el.hass = hass;
    document.body.appendChild(el);
    await settle(el);
    // the same state of the entity, five new hass objects (other entities changing): no new try
    for (let i = 0; i < 5; i++) { el.hass = { ...hass, states: { ...hass.states } }; await settle(el); }
    expect(tries.n).toBe(1);
    el.remove(); await tick(); await tick();
    expect(unhandled).toEqual([]);
  });

  it('a card that leaves the page before the refusal comes leaves no unhandled rejection', async () => {
    const tries = { n: 0 };
    const el = document.createElement('platinum-weather-card-plus-charts') as El;
    el.setConfig(baseConfig({ weather_entity: 'weather.home' }));
    el.hass = hassWith({ 'weather.home': { state: 'sunny' } }, () => true, tries, 30);
    document.body.appendChild(el);
    await el.updateComplete;
    expect(tries.n).toBe(1);
    el.remove();
    await new Promise((r) => setTimeout(r, 60));
    expect(unhandled).toEqual([]);
  });

  it('is asked for again when the entity changes, and then it comes', async () => {
    const tries = { n: 0 };
    let refuse = true;
    const el = document.createElement('platinum-weather-card-plus-charts') as El;
    el.setConfig(baseConfig({ weather_entity: 'weather.home' }));
    el.hass = hassWith({ 'weather.home': { state: 'unavailable' } }, () => refuse, tries);
    document.body.appendChild(el);
    await settle(el);
    expect(tries.n).toBe(1);
    refuse = false;
    el.hass = hassWith({ 'weather.home': { state: 'sunny' } }, () => refuse, tries);
    await settle(el);
    expect(tries.n).toBe(2);
    expect(el.forecast1?.length).toBeGreaterThan(0);
    el.remove(); await tick();
    expect(unhandled).toEqual([]);
  });
});
