import { describe, it, expect } from 'vitest';
import { sunElevation } from '../src/zambretti';

// Whether an hour is night is decided by where the sun is then, for the shading of the nights and for the moon in the
// hourly strip. The formula used to leave out the equation of time, by which the sun is up to a quarter of an hour
// early or late: on 24 October it put the sunrise 22 minutes after Home Assistant's own. The numbers below are
// Home Assistant's, read from sun.sun on 24 October 2026 for Varna.

const LAT = 43.26, LON = 28.01;
const HORIZON = -0.833; // where Home Assistant says it is sunrise and sunset
function crossing(from: string, to: string, rising: boolean): number {
  let prev = sunElevation(new Date(from), LAT, LON);
  for (let t = new Date(from).getTime(); t < new Date(to).getTime(); t += 15000) {
    const v = sunElevation(new Date(t), LAT, LON);
    if (rising ? prev < HORIZON && v >= HORIZON : prev >= HORIZON && v < HORIZON) return t;
    prev = v;
  }
  return NaN;
}
const MIN = 60000;

describe('the sun, against the sun entity of Home Assistant', () => {
  it('rises when Home Assistant says, to within three minutes', () => {
    const ha = new Date('2026-10-24T04:30:34Z').getTime();
    expect(Math.abs(crossing('2026-10-24T03:00:00Z', '2026-10-24T06:00:00Z', true) - ha) / MIN).toBeLessThan(3);
  });
  it('and sets when it says', () => {
    const ha = new Date('2026-10-24T15:13:02Z').getTime();
    expect(Math.abs(crossing('2026-10-24T14:00:00Z', '2026-10-24T17:00:00Z', false) - ha) / MIN).toBeLessThan(3);
  });
  it('and is as high as it says in the dark before dawn', () => {
    // sun.sun said -8.82 at 06:47:28 local, 03:47:28 UTC
    expect(Math.abs(sunElevation(new Date('2026-10-24T03:47:28Z'), LAT, LON) - -8.82)).toBeLessThan(0.6);
  });
  it('an hour that is half past the sunrise is day, and one that is before it night: the edge hours of a strip', () => {
    // sunrise 04:30 UTC: the hour at 05:00 is day, the one at 04:00 is night
    expect(sunElevation(new Date('2026-10-24T05:00:00Z'), LAT, LON)).toBeGreaterThan(HORIZON);
    expect(sunElevation(new Date('2026-10-24T04:00:00Z'), LAT, LON)).toBeLessThan(HORIZON);
    // sunset 15:13 UTC: 15:00 is day, 16:00 night
    expect(sunElevation(new Date('2026-10-24T15:00:00Z'), LAT, LON)).toBeGreaterThan(HORIZON);
    expect(sunElevation(new Date('2026-10-24T16:00:00Z'), LAT, LON)).toBeLessThan(HORIZON);
  });
  it('does not give nonsense where the sun does not set, or does not rise', () => {
    for (const [lat, lon, date] of [[78, 15, '2026-06-21T12:00:00Z'], [78, 15, '2026-12-21T12:00:00Z'], [-33, 151, '2026-01-01T02:00:00Z'], [0, 0, '2026-03-20T12:00:00Z']] as [number, number, string][]) {
      const e = sunElevation(new Date(date), lat, lon);
      expect(Number.isFinite(e), `${lat},${lon},${date}`).toBe(true);
      expect(Math.abs(e)).toBeLessThanOrEqual(90);
    }
    expect(sunElevation(new Date('2026-06-21T12:00:00Z'), 78, 15)).toBeGreaterThan(0);
    expect(sunElevation(new Date('2026-12-21T12:00:00Z'), 78, 15)).toBeLessThan(0);
  });
  it('is highest at noon, and highest in June', () => {
    const noon = sunElevation(new Date('2026-06-21T09:45:00Z'), LAT, LON);
    expect(noon).toBeGreaterThan(sunElevation(new Date('2026-06-21T07:45:00Z'), LAT, LON));
    expect(noon).toBeGreaterThan(sunElevation(new Date('2026-12-21T09:45:00Z'), LAT, LON));
    expect(noon).toBeGreaterThan(65); expect(noon).toBeLessThan(72); // 90 - 43.26 + 23.44 = 70.2
  });
});
