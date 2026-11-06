import { describe, it, expect } from 'vitest';
import '../src/platinum-weather-card';
import { makeHass, baseConfig, renderCard } from './helpers';

// Two slots no test had ever rendered: the rain rate, which is the readout of the gauge the
// icon correction depends on, and the Beaufort figure in the wind slot.

type St = { state: string; attributes?: Record<string, unknown> };
const REST = Object.fromEntries(['slot_l3', 'slot_l4', 'slot_l5', 'slot_l6', 'slot_l7', 'slot_l8', 'slot_r1', 'slot_r2', 'slot_r3', 'slot_r4', 'slot_r5', 'slot_r6', 'slot_r7', 'slot_r8'].map((k) => [k, 'remove']));

async function mount(states: Record<string, St>, config: Record<string, unknown>) {
  const el = (await renderCard(baseConfig({
    section_order: ['overview', 'slots'], overview_layout: 'complete', slot_l1: 'rain_rate', slot_l2: 'wind', ...REST, ...config,
  } as never), makeHass(states))) as HTMLElement;
  return el;
}
const slot = (el: HTMLElement, name: string) => el.shadowRoot?.querySelector(`[data-slot="${name}"]`) ?? null;
const text = (el: HTMLElement, name: string) => (slot(el, name)?.textContent ?? '').replace(/\s+/g, ' ').trim();

describe('the rain rate slot', () => {
  const rain = (state: string) => mount({ 'sensor.rain': { state } }, { entity_rain_rate: 'sensor.rain' });
  const icon = (el: HTMLElement) => slot(el, 'rain_rate')?.querySelector('ha-icon')?.getAttribute('icon');
  const colour = (el: HTMLElement) => slot(el, 'rain_rate')?.querySelector('.rain-rate-text')?.getAttribute('style') ?? '';

  it('shows the rate to one decimal, with its unit', async () => {
    const el = await rain('0.6');
    expect(text(el, 'rain_rate')).toContain('0.6');
    expect(text(el, 'rain_rate')).toContain('mm/h');
  });
  it('shows dashes and no unit when the gauge is not there to read', async () => {
    for (const state of ['unavailable', 'unknown', 'garbage']) {
      const el = await rain(state);
      expect(text(el, 'rain_rate'), state).toContain('---');
      expect(text(el, 'rain_rate'), state).not.toContain('mm/h');
    }
  });
  it('is a rain icon even at zero: a plain cloud says nothing about rain', async () => {
    expect(icon(await rain('0.0'))).toBe('mdi:water-outline');
    expect(icon(await rain('unavailable'))).toBe('mdi:water-outline');
  });
  it('changes the icon at the standard bands: light under 2.5, moderate to 10, then heavy', async () => {
    expect(icon(await rain('0.6'))).toBe('mdi:weather-rainy');
    expect(icon(await rain('2.4'))).toBe('mdi:weather-rainy');
    expect(icon(await rain('2.5'))).toBe('mdi:weather-pouring');
    expect(icon(await rain('9.9'))).toBe('mdi:weather-pouring');
    expect(icon(await rain('10'))).toBe('mdi:weather-hail');
    expect(icon(await rain('60'))).toBe('mdi:weather-hail');
  });
  it('deepens the colour with the rate, and has none at zero', async () => {
    expect(colour(await rain('0.0'))).toBe('');
    expect(colour(await rain('0.6'))).toContain('#4fc3f7');
    expect(colour(await rain('5'))).toContain('#29b6f6');
    expect(colour(await rain('20'))).toContain('#0288d1');
    expect(colour(await rain('60'))).toContain('#01579b');
  });
  it('is not there without a gauge', async () => {
    const el = await mount({}, {});
    expect(text(el, 'rain_rate')).toContain('---');
  });
});

describe('the Beaufort figure in the wind slot', () => {
  const bft = async (state: string, unit: string | undefined, key = 'entity_wind_speed', slotName = 'wind', option = true) => {
    const el = await mount(
      { 'sensor.wind': { state, attributes: unit ? { unit_of_measurement: unit } : {} } },
      { [key]: 'sensor.wind', slot_l2: slotName, ...(option ? { option_show_beaufort: true } : {}) },
    );
    return /BFT:\s*([0-9]+|---)/.exec(text(el, slotName))?.[1];
  };
  // a value inside each of the thirteen bands of the standard table, in each unit
  const TABLES: Record<string, [number, string][]> = {
    'km/h': [[0, '0'], [3, '1'], [8, '2'], [15, '3'], [25, '4'], [33, '5'], [45, '6'], [55, '7'], [70, '8'], [80, '9'], [95, '10'], [110, '11'], [130, '12']],
    mph: [[0, '0'], [2, '1'], [6, '2'], [10, '3'], [15, '4'], [22, '5'], [28, '6'], [35, '7'], [42, '8'], [50, '9'], [58, '10'], [68, '11'], [80, '12']],
    'm/s': [[0.2, '0'], [1.0, '1'], [2.5, '2'], [4.5, '3'], [6.5, '4'], [9, '5'], [12, '6'], [15, '7'], [19, '8'], [22, '9'], [26, '10'], [30, '11'], [35, '12']],
  };
  for (const [unit, rows] of Object.entries(TABLES)) {
    it(`is the right force at every step of the scale, in ${unit}`, async () => {
      for (const [value, force] of rows) expect(await bft(String(value), unit), `${value} ${unit}`).toBe(force);
    });
  }
  // the lower edge of forces 2 to 12 (and 1, where the card agrees with the table), and just under it
  const EDGES: Record<string, { unit: string; key?: string; slot?: string; first: number | null; lows: number[] }> = {
    'km/h': { unit: 'km/h', first: null, lows: [6, 12, 20, 29, 39, 50, 62, 75, 89, 103, 118] },
    mph: { unit: 'mph', first: 1, lows: [4, 8, 13, 19, 25, 32, 39, 47, 55, 64, 73] },
    'm/s': { unit: 'm/s', first: 0.5, lows: [1.6, 3.4, 5.5, 8.0, 10.8, 13.9, 17.2, 20.8, 24.5, 28.5, 32.7] },
    kn: { unit: 'kn', key: 'entity_wind_speed_kt', slot: 'wind_kt', first: 1, lows: [4, 7, 11, 17, 22, 28, 34, 41, 48, 56, 64] },
  };
  for (const [name, e] of Object.entries(EDGES)) {
    it(`changes force exactly where the table does, in ${name}`, async () => {
      const at = (v: number) => bft(String(v), e.unit, e.key, e.slot);
      if (e.first !== null) {
        expect(await at(e.first), `${e.first} ${name}`).toBe('1');
        expect(await at(+(e.first - 0.1).toFixed(1)), `just under ${e.first} ${name}`).toBe('0');
      }
      for (let i = 0; i < e.lows.length; i++) {
        const low = e.lows[i];
        expect(await at(low), `${low} ${name}`).toBe(String(i + 2));
        expect(await at(+(low - 0.1).toFixed(1)), `just under ${low} ${name}`).toBe(String(i + 1));
      }
    });
  }
  it('takes a speed with no unit for kilometres an hour', async () => {
    expect(await bft('45', undefined)).toBe('6');
  });
  it('has its own table for knots, from the knots sensor', async () => {
    const rows: [number, string][] = [[0, '0'], [2, '1'], [5, '2'], [9, '3'], [14, '4'], [19, '5'], [25, '6'], [30, '7'], [37, '8'], [44, '9'], [52, '10'], [60, '11'], [70, '12']];
    for (const [value, force] of rows) expect(await bft(String(value), 'kn', 'entity_wind_speed_kt', 'wind_kt'), `${value} kt`).toBe(force);
  });
  it('says dashes, not a number, when the wind sensor has nothing', async () => {
    expect(await bft('unavailable', 'km/h')).toBe('---');
  });
  it('is not shown unless it is asked for', async () => {
    expect(await bft('45', 'km/h', 'entity_wind_speed', 'wind', false)).toBeUndefined();
  });
});
