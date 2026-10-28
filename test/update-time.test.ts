import { describe, it, expect } from 'vitest';
import '../src/platinum-weather-card';
import { makeHass, baseConfig, renderCard } from './helpers';

// #36: the line of the update time showed "00:00 Mon 1 Jan 2001". The card read the state of the update time entity with new Date(state), and a browser reads the number 1 as the first of
// January 2001 (2 is the first of February, 12 the first of December). What is not a date and time is `---`, the card's sign for no value, and not a made-up date or "Invalid Date".

async function line(state: string | undefined, extra: Record<string, unknown> = {}, attrs: Record<string, unknown> = {}) {
  const states: Record<string, { state: string; attributes?: Record<string, unknown> }> = { 'weather.home': { state: 'cloudy' } };
  if (state !== undefined) states['sensor.upd'] = { state, attributes: attrs };
  const el = (await renderCard(baseConfig({ weather_entity: 'weather.home', entity_update_time: 'sensor.upd', time_format: '24hour', locale: 'en-GB', ...extra } as never), makeHass(states))) as HTMLElement;
  return (el.shadowRoot?.querySelector('.updated')?.textContent ?? '').replace(/\s+/g, ' ').trim();
}

describe('a state that is not a date and time is `---`', () => {
  it.each(['1', '2', '12', '01', '9', 'on', 'off', 'unavailable', 'unknown', '', ' ', 'garbage', '2026', '1698400000', '1698400000000', '27.10.2026', '2026-13-45', '2026-10-27T25:61:00'])('%j', async (state) => {
    const t = await line(state);
    expect(t).toBe('---');
  });
  it('and so is an entity that is not there', async () => {
    expect(await line(undefined)).toBe('---');
  });
});

describe('a date and time is shown, as it was', () => {
  it.each(['2026-10-27T12:00:00', '2026-10-27 12:00:00', '2026-10-27T12:00:00.123456+00:00', '2026-10-27T12:00:00Z', 'Tue Oct 27 2026 12:00:00 GMT+0000', '2026/10/27 12:00'])('%s', async (state) => {
    const t = await line(state);
    expect(t).not.toBe('---');
    expect(t).not.toContain('Invalid');
    expect(t).toContain('2026');
  });
  it('in each of the three formats of the time', async () => {
    for (const time_format of ['12hour', '24hour', 'system']) {
      const t = await line('2026-10-27T12:00:00', { time_format });
      expect(t, time_format).toContain('2026');
      expect(t, time_format).not.toBe('---');
    }
  });
  it('with the prefix that is set for it', async () => {
    expect(await line('2026-10-27T12:00:00', { text_update_time_prefix: 'Updated' })).toMatch(/^Updated /);
  });
});

describe('the same with an attribute that holds the time', () => {
  const attr = { update_time_use_attr: true, update_time_name_attr: 'last_seen' };
  it('a date and time in the attribute is shown', async () => {
    const t = await line('anything', attr, { last_seen: '2026-10-27T12:00:00' });
    expect(t).toContain('2026');
    expect(t).not.toBe('---');
  });
  it.each(['1', 'on', 'unavailable', '', 'garbage'])('an attribute that says %j is `---`', async (value) => {
    expect(await line('2026-10-27T12:00:00', attr, { last_seen: value })).toBe('---');
  });
  it('and so is an attribute that is a bare number, or is not there', async () => {
    expect(await line('2026-10-27T12:00:00', attr, { last_seen: 1 })).toBe('---');
    expect(await line('2026-10-27T12:00:00', attr, {})).toBe('---');
  });
});
