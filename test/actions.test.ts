import { describe, it, expect, vi, afterEach } from 'vitest';

// Tap, double tap and hold are what make the card open a more-info dialog or a view. The
// handlers are 40 lines of timers and flags, and no test had ever fired a click at the card.
// Home Assistant's own handleAction is replaced by a spy: what matters here is which action
// the card asks for, and when.
vi.mock('custom-card-helpers', async (original) => {
  const real = await original<typeof import('custom-card-helpers')>();
  return { ...real, handleAction: vi.fn() };
});

import '../src/platinum-weather-card';
import { handleAction } from 'custom-card-helpers';
import { makeHass, baseConfig, renderCard } from './helpers';

const spy = vi.mocked(handleAction);
type Card = HTMLElement & { updateComplete: Promise<unknown> };
const NAV = { action: 'navigate', navigation_path: '/lovelace/weather' };
const MORE = { action: 'more-info' };

async function card(config: Record<string, unknown>) {
  const el = (await renderCard(baseConfig({ section_order: ['overview', 'slots'], ...config } as never), makeHass({}))) as Card;
  const target = el.shadowRoot!.querySelector('ha-card') as HTMLElement;
  spy.mockClear();
  // only now: drawing the card waits on a real timer
  vi.useFakeTimers();
  return { el, target };
}
const click = (t: Element) => t.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
const pointer = (t: Element, type: string, extra: Record<string, unknown> = {}) =>
  t.dispatchEvent(Object.assign(new MouseEvent(type, { bubbles: true, composed: true }), { isPrimary: true }, extra));
const asked = () => spy.mock.calls.map((c) => c[3]);

afterEach(() => vi.useRealTimers());

describe('a tap', () => {
  it('asks for the tap action', async () => {
    const { target } = await card({ tap_action: NAV });
    click(target);
    expect(asked()).toEqual(['tap']);
  });
  it('asks for nothing when there is no tap action', async () => {
    const { target } = await card({});
    click(target);
    expect(spy).not.toHaveBeenCalled();
  });
  it('asks for nothing when the action is "none"', async () => {
    const { target } = await card({ tap_action: { action: 'none' } });
    click(target);
    expect(spy).not.toHaveBeenCalled();
  });
  it('can be reached from the keyboard when it has a tap action', async () => {
    expect((await card({ tap_action: NAV })).target.getAttribute('tabindex')).toBe('0');
  });
  it('is left out of the tab order when it has none', async () => {
    expect((await card({})).target.getAttribute('tabindex')).toBeNull();
  });
});

describe('a double tap', () => {
  it('waits to see whether a second tap follows, and then taps', async () => {
    const { target } = await card({ tap_action: NAV, double_tap_action: MORE });
    click(target);
    expect(spy, 'at once').not.toHaveBeenCalled();
    vi.advanceTimersByTime(249);
    expect(spy, 'just before the wait is over').not.toHaveBeenCalled();
    vi.advanceTimersByTime(2);
    expect(asked()).toEqual(['tap']);
  });
  it('is a double tap, and not a tap too, when the second comes in time', async () => {
    const { target } = await card({ tap_action: NAV, double_tap_action: MORE });
    click(target);
    vi.advanceTimersByTime(100);
    click(target);
    vi.advanceTimersByTime(1000);
    expect(asked()).toEqual(['double_tap']);
  });
  it('starts again afterwards: a tap, then a double tap, then a tap', async () => {
    const { target } = await card({ tap_action: NAV, double_tap_action: MORE });
    click(target); vi.advanceTimersByTime(300);
    click(target); click(target); vi.advanceTimersByTime(300);
    click(target); vi.advanceTimersByTime(300);
    expect(asked()).toEqual(['tap', 'double_tap', 'tap']);
  });
  it('does not delay a plain tap when there is no double tap action', async () => {
    const { target } = await card({ tap_action: NAV });
    click(target);
    expect(asked()).toEqual(['tap']);
  });
});

describe('a hold', () => {
  it('asks for the hold action after half a second', async () => {
    const { target } = await card({ hold_action: MORE });
    pointer(target, 'pointerdown');
    vi.advanceTimersByTime(499);
    expect(spy).not.toHaveBeenCalled();
    vi.advanceTimersByTime(2);
    expect(asked()).toEqual(['hold']);
  });
  it('is not a tap as well, when the finger lifts and the click arrives', async () => {
    const { target } = await card({ tap_action: NAV, hold_action: MORE });
    pointer(target, 'pointerdown');
    vi.advanceTimersByTime(600);
    click(target);
    vi.advanceTimersByTime(1000);
    expect(asked()).toEqual(['hold']);
    // and the next tap is a tap again
    click(target);
    expect(asked()).toEqual(['hold', 'tap']);
  });
  it('is cancelled when the press is, as it is when a scroll takes the finger', async () => {
    const { target } = await card({ hold_action: MORE });
    pointer(target, 'pointerdown');
    vi.advanceTimersByTime(300);
    target.dispatchEvent(new Event('pointercancel', { bubbles: true, composed: true }));
    vi.advanceTimersByTime(1000);
    expect(spy).not.toHaveBeenCalled();
  });
  it('ignores a second finger', async () => {
    const { target } = await card({ hold_action: MORE });
    pointer(target, 'pointerdown', { isPrimary: false });
    vi.advanceTimersByTime(1000);
    expect(spy).not.toHaveBeenCalled();
  });
  it('is not started by a press on a reading that has an action of its own', async () => {
    const { el, target } = await card({ hold_action: MORE });
    const reading = document.createElement('li');
    reading.className = 'slot-tappable';
    target.appendChild(reading);
    pointer(reading, 'pointerdown');
    vi.advanceTimersByTime(1000);
    expect(spy).not.toHaveBeenCalled();
    void el;
  });
  it('is not started without a hold action', async () => {
    const { target } = await card({ tap_action: NAV });
    pointer(target, 'pointerdown');
    vi.advanceTimersByTime(1000);
    expect(spy).not.toHaveBeenCalled();
  });
});
