import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import '../src/platinum-weather-card';
import { makeHass, baseConfig, makeForecast } from './helpers';

// The hourly forecast is a subscription of its own (entity_hourly) that Home Assistant can refuse ("Weather entity not found": an integration
// that is off, or has not loaded yet; its entity is then still in the states, as `unavailable`). A refusal was kept as the subscription: the
// card took it for one that was made, never asked again, and stayed without the hours until the page was reloaded (found by switching the
// integration off, reloading the page, and switching it on). It asks again when the entity changes, the refusal is handled, and it does not
// ask in a loop (#23 was such a loop).

type El = HTMLElement & Record<string, any>;
const tick = () => new Promise((r) => setTimeout(r, 5));
let unhandled: unknown[] = [];
const onUnhandled = (e: unknown) => { unhandled.push(e); };
beforeEach(() => { unhandled = []; process.on('unhandledRejection', onUnhandled); });
afterEach(() => { process.off('unhandledRejection', onUnhandled); });

// A card that asks again on every refusal loops without end and starves the timers, so the test would hang rather than fail: past twenty
// tries the mock stops refusing, the loop ends, and the count of tries says what happened.
function hassWith(states: Record<string, { state: string; attributes?: Record<string, unknown> }>, refuse: () => boolean, tries: { n: number }, delay = 0) {
  const hass = makeHass(states) as ReturnType<typeof makeHass> & { connection: any };
  hass.connection.subscribeMessage = async (cb: (e: unknown) => void, msg: { forecast_type: string }) => {
    if (msg.forecast_type !== 'hourly') return () => undefined;
    tries.n += 1;
    if (delay) await new Promise((r) => setTimeout(r, delay));
    if (refuse() && tries.n <= 20) throw { code: 'not_found', message: 'Weather entity not found' };
    setTimeout(() => cb({ type: 'hourly', forecast: makeForecast(24) }), 0);
    return () => undefined;
  };
  return hass;
}
async function settle(el: El) { for (let i = 0; i < 4; i++) { await el.updateComplete; await tick(); } }
const card = (hass: unknown, entity = 'weather.home') => {
  const el = document.createElement('platinum-weather-card-plus-charts') as El;
  el.setConfig(baseConfig({ entity_hourly: entity, show_section_hourly_forecast: true } as never));
  el.hass = hass;
  document.body.appendChild(el);
  return el;
};

describe('an hourly forecast subscription that Home Assistant refuses', () => {
  it('is not asked for while the hourly entity is not there, and is when it appears', async () => {
    const tries = { n: 0 };
    const el = card(hassWith({}, () => false, tries), 'weather.late');
    await settle(el);
    expect(tries.n).toBe(0);
    el.hass = hassWith({ 'weather.late': { state: 'sunny' } }, () => false, tries);
    await settle(el);
    expect(tries.n).toBe(1);
    expect(el._hourlyEvent?.forecast?.length).toBeGreaterThan(0);
    el.remove(); await tick();
    expect(unhandled).toEqual([]);
  });

  it('is refused without an unhandled rejection, and is not asked for again in a loop', async () => {
    const tries = { n: 0 };
    const hass = hassWith({ 'weather.home': { state: 'sunny' } }, () => true, tries);
    const el = card(hass);
    await settle(el);
    // the same state of the entity, five new hass objects (other entities changing): no new try
    for (let i = 0; i < 5; i++) { el.hass = { ...hass, states: { ...hass.states } }; await settle(el); }
    expect(tries.n).toBe(1);
    el.remove(); await tick(); await tick();
    expect(unhandled).toEqual([]);
  });

  it('a card that leaves the page before the refusal comes leaves no unhandled rejection', async () => {
    const tries = { n: 0 };
    const el = card(hassWith({ 'weather.home': { state: 'sunny' } }, () => true, tries, 30));
    await el.updateComplete;
    expect(tries.n).toBe(1);
    el.remove();
    await new Promise((r) => setTimeout(r, 60));
    expect(unhandled).toEqual([]);
  });

  it('is asked for again when the entity comes back (the page loaded while it was unavailable), and then the hours come', async () => {
    const tries = { n: 0 };
    let refuse = true;
    const el = card(hassWith({ 'weather.home': { state: 'unavailable' } }, () => refuse, tries));
    await settle(el);
    expect(tries.n).toBe(1);
    expect(el._hourlyEvent?.forecast?.length ?? 0).toBe(0);
    refuse = false;
    el.hass = hassWith({ 'weather.home': { state: 'sunny' } }, () => refuse, tries);
    await settle(el);
    expect(tries.n).toBe(2);
    expect(el._hourlyEvent?.forecast?.length).toBeGreaterThan(0);
    el.remove(); await tick();
    expect(unhandled).toEqual([]);
  });
  it('is not asked for while the entity is gone again after a refusal, and is when it comes back', async () => {
    const tries = { n: 0 };
    let refuse = true;
    const el = card(hassWith({ 'weather.home': { state: 'unavailable' } }, () => refuse, tries));
    await settle(el);
    expect(tries.n).toBe(1);
    // the entity is removed from the states altogether (the integration is removed): nothing to ask for
    el.hass = hassWith({}, () => refuse, tries);
    await settle(el);
    expect(tries.n).toBe(1);
    refuse = false;
    el.hass = hassWith({ 'weather.home': { state: 'sunny' } }, () => refuse, tries);
    await settle(el);
    expect(tries.n).toBe(2);
    expect(el._hourlyEvent?.forecast?.length).toBeGreaterThan(0);
    el.remove(); await tick();
    expect(unhandled).toEqual([]);
  });
});
