import { describe, it, expect } from 'vitest';
import '../src/platinum-weather-card';

// The update time was read with new Date(string), which is up to the browser: V8 reads 05.10.2026 10:00 as the 10th of May (month first)
// and 27.10.2026 10:00 as nothing, and 2026-02-31 as the 3rd of March. The card reads the forms that are meant itself: ISO 8601, with a T
// or a space, with or without seconds, fractions and an offset; the European DD.MM.YYYY HH:MM[:SS]; YYYY/MM/DD HH:MM; and the browser's
// own Date.toString(). An impossible date or time is no date. Without an offset the time is the browser's local time, as before.

const Card = customElements.get('platinum-weather-card-plus-charts') as unknown as { _parseUpdateTime: (v: unknown) => Date | null };
const parse = (v: unknown) => Card._parseUpdateTime(v);
const local = (y: number, mo: number, d: number, h = 0, mi = 0, s = 0, ms = 0) => new Date(y, mo - 1, d, h, mi, s, ms).getTime();

describe('the update time is read by the card, not by the browser', () => {
  it.each([
    ['05.10.2026 10:00', local(2026, 10, 5, 10)],
    ['5.10.2026 10:00', local(2026, 10, 5, 10)],
    ['27.10.2026 10:00', local(2026, 10, 27, 10)],
    ['27.10.2026 10:00:30', local(2026, 10, 27, 10, 0, 30)],
    ['01.02.2026 23:59', local(2026, 2, 1, 23, 59)],
  ])('%s is the day first, the month second', (text, t) => {
    expect(parse(text)?.getTime()).toBe(t);
  });

  it.each([
    ['2026-10-27T12:00:00', local(2026, 10, 27, 12)],
    ['2026-10-27 12:00:00', local(2026, 10, 27, 12)],
    ['2026-10-27 12:00', local(2026, 10, 27, 12)],
    ['2026-10-27T12:00:00.5', local(2026, 10, 27, 12, 0, 0, 500)],
    ['2026/10/27 12:00', local(2026, 10, 27, 12)],
    ['2026-10-27T12:00:00Z', Date.UTC(2026, 9, 27, 12)],
    ['2026-10-27T12:00:00.123456+00:00', Date.UTC(2026, 9, 27, 12, 0, 0, 123)],
    ['2026-10-27T15:00:00+03:00', Date.UTC(2026, 9, 27, 12)],
    ['2026-10-27 07:30:00-0430', Date.UTC(2026, 9, 27, 12)],
    ['2026-10-27', Date.UTC(2026, 9, 27)],
    ['Tue Oct 27 2026 12:00:00 GMT+0000', Date.UTC(2026, 9, 27, 12)],
    ['Tue Oct 27 2026 14:00:00 GMT+0200 (Eastern European Standard Time)', Date.UTC(2026, 9, 27, 12)],
  ])('%s is read as before', (text, t) => {
    expect(parse(text)?.getTime()).toBe(t);
  });

  it.each([
    '13.13.2026 10:00', '31.02.2026 10:00', '31.04.2026 10:00', '00.10.2026 10:00', '27.10.2026 24:00', '27.10.2026 10:60',
    '2026-02-31 10:00', '2026-02-29T10:00:00', '2026-13-01T10:00', '2026-10-27T25:61:00', '2026-10-27T12:00:00+25:00',
    '27.10.2026', '10/27/2026 10:00', '27/10/2026 10:00', 'Mon Oct 27 2026', '1698400000', '2026', 'garbage', '', 1, null, undefined,
  ])('%j is no date', (text) => {
    expect(parse(text)).toBeNull();
  });

  it('a date alone is midnight UTC and a time without an offset is local, in any time zone of the browser', () => {
    const before = process.env.TZ;
    try {
      for (const tz of ['Europe/Sofia', 'America/New_York', 'Asia/Tokyo']) {
        process.env.TZ = tz;
        expect(new Date(2026, 9, 27, 12).getTime(), `${tz} is not in effect`).not.toBe(Date.UTC(2026, 9, 27, 12));
        expect(parse('2026-10-27')?.getTime(), tz).toBe(Date.UTC(2026, 9, 27));
        expect(parse('2026-10-27 12:00')?.getTime(), tz).toBe(new Date(2026, 9, 27, 12).getTime());
        expect(parse('27.10.2026 12:00')?.getTime(), tz).toBe(new Date(2026, 9, 27, 12).getTime());
      }
    } finally {
      if (before === undefined) delete process.env.TZ; else process.env.TZ = before;
    }
  });

  it('a leap day is a day', () => {
    expect(parse('29.02.2028 10:00')?.getTime()).toBe(local(2028, 2, 29, 10));
    expect(parse('2028-02-29T10:00:00Z')?.getTime()).toBe(Date.UTC(2028, 1, 29, 10));
  });
});
