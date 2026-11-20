import { describe, it, expect, vi, afterEach } from 'vitest';
import '../src/platinum-weather-card';
import { makeHass, baseConfig, renderCard } from './helpers';

// The sunrise and sunset slots (Руди, 14 November, 06:58): both said „нд“, Sunday, on a Saturday morning, the sunset of that same day
// included, and the sunrise came first. Home Assistant counts the sun as risen at -0.83 degrees (refraction) and moves next_rising to the
// next day then; the card counted it as risen at 0 degrees, so for about four minutes at dawn and at dusk it took the morning for night and
// gave both times the day of the next sunrise. The card goes by the times of Home Assistant now: the earlier of the two is next, and each
// time has its own day, only when that day is not today.

const at = (d: number, h: number, m: number) => new Date(2026, 10, d, h, m); // 14 November 2026 is a Saturday
async function slots(now: Date, rising: Date, setting: Date, state: string, elevation: number) {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(now);
  const el = (await renderCard(baseConfig({ section_order: ['slots'], slot_l1: 'sun_next', slot_r1: 'sun_following', entity_sun: 'sun.sun',
    option_locale: 'en', option_time_format: '24hour' } as never), makeHass({
      'sun.sun': { state, attributes: { elevation, next_rising: rising.toISOString(), next_setting: setting.toISOString() } } }))) as HTMLElement;
  const r = el.shadowRoot!;
  const get = (cls: string, id: string) => ({ text: r.querySelector(cls)?.textContent?.trim() ?? '', icon: r.querySelector(id)?.getAttribute('icon') ?? '' });
  return { next: get('.sun-next-text', '#sun-next-icon'), following: get('.sun-following-text', '#sun-following-icon') };
}
const day = (d: Date) => d.toLocaleDateString('en', { weekday: 'short' });
afterEach(() => vi.useRealTimers());

describe('the times of the sun', () => {
  it('at dawn, risen for Home Assistant though not yet at 0 degrees: the sunset of today, then the sunrise of tomorrow', async () => {
    const s = await slots(at(14, 6, 58), at(15, 6, 59), at(14, 16, 46), 'above_horizon', -0.5);
    expect(s.next.text).toBe('16:46');
    expect(s.next.icon).toBe('mdi:weather-sunset-down');
    expect(s.following.text).toBe(`${day(at(15, 0, 0))} 06:59`);
  });
  it('and the same just before, with the state still below the horizon', async () => {
    const s = await slots(at(14, 6, 55), at(14, 6, 58), at(14, 16, 46), 'below_horizon', -1.2);
    expect(s.next.text).toBe('06:58');
    expect(s.following.text).toBe('16:46');
  });
  it('in the evening after sunset: both tomorrow, each with its day', async () => {
    const s = await slots(at(14, 22, 0), at(15, 6, 59), at(15, 16, 45), 'below_horizon', -40);
    expect(s.next.text).toBe(`${day(at(15, 0, 0))} 06:59`);
    expect(s.next.icon).toBe('mdi:weather-sunset-up');
    expect(s.following.text).toBe(`${day(at(15, 0, 0))} 16:45`);
  });
  it('after midnight: both today, no day', async () => {
    const s = await slots(at(15, 2, 0), at(15, 6, 59), at(15, 16, 45), 'below_horizon', -50);
    expect(s.next.text).toBe('06:59');
    expect(s.following.text).toBe('16:45');
  });
  it('at noon: the sunset of today, then the sunrise of tomorrow', async () => {
    const s = await slots(at(14, 12, 0), at(15, 6, 59), at(14, 16, 46), 'above_horizon', 25);
    expect(s.next.text).toBe('16:46');
    expect(s.following.text).toBe(`${day(at(15, 0, 0))} 06:59`);
  });
});
