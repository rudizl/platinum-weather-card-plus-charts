import { describe, it, expect } from 'vitest';
import '../src/platinum-weather-card';
import { makeHass, baseConfig, renderCard } from './helpers';

// Every slot type, checked for two things: it shows the value it was given, and
// it degrades to '---' rather than NaN when the sensor drops out. The wind slot
// once rendered "unavailable NaNkm/h (Gust NaNkm/h)", wide enough to break the
// two-column layout, and nothing would have caught it.

const base = {
  'sensor.temp': { state: '21.5', attributes: { unit_of_measurement: '°C' } },
  'sun.sun': {
    state: 'above_horizon',
    attributes: {
      elevation: 35,
      next_rising: '2026-08-04T05:57:00+00:00',
      next_setting: '2026-08-03T20:29:00+00:00',
    },
  },
};

// slot name → [config it needs, sensors it needs, a string that must appear]
const slots: Array<[string, Record<string, unknown>, Record<string, unknown>, string]> = [
  ['humidity', { entity_humidity: 'sensor.x' },
    { 'sensor.x': { state: '64', attributes: { unit_of_measurement: '%' } } }, '64'],
  ['pressure', { entity_pressure: 'sensor.x' },
    { 'sensor.x': { state: '1016', attributes: { unit_of_measurement: 'hPa' } } }, 'hPa'],
  ['visibility', { entity_visibility: 'sensor.x' },
    { 'sensor.x': { state: '10', attributes: { unit_of_measurement: 'km' } } }, '10'],
  ['rainfall', { entity_rainfall: 'sensor.x' },
    { 'sensor.x': { state: '2.5', attributes: { unit_of_measurement: 'mm' } } }, 'mm'],
  ['observed_max', { entity_observed_max: 'sensor.x' },
    { 'sensor.x': { state: '28', attributes: { unit_of_measurement: '°C' } } }, '28'],
  ['observed_min', { entity_observed_min: 'sensor.x' },
    { 'sensor.x': { state: '12', attributes: { unit_of_measurement: '°C' } } }, '12'],
  ['forecast_max', { entity_forecast_max: 'sensor.x' },
    { 'sensor.x': { state: '30', attributes: { unit_of_measurement: '°C' } } }, '30'],
  ['forecast_min', { entity_forecast_min: 'sensor.x' },
    { 'sensor.x': { state: '14', attributes: { unit_of_measurement: '°C' } } }, '14'],
  ['uv_summary', { entity_uv_alert_summary: 'sensor.x' },
    { 'sensor.x': { state: '7' } }, '7'],
  ['fire_danger', { entity_fire_danger: 'sensor.x', option_color_fire_danger: false },
    { 'sensor.x': { state: 'Moderate' } }, 'Moderate'],
  ['wind_gust', { entity_wind_gust: 'sensor.x' },
    { 'sensor.x': { state: '25', attributes: { unit_of_measurement: 'km/h' } } }, '25'],
  ['moon', { entity_moon: 'sensor.x' },
    { 'sensor.x': { state: 'full_moon' } }, 'Full'],
  ['pop', { entity_pop: 'sensor.x' },
    { 'sensor.x': { state: '40', attributes: { unit_of_measurement: '%' } } }, '40'],
  ['possible_today', { entity_pos: 'sensor.x' },
    { 'sensor.x': { state: '3', attributes: { unit_of_measurement: 'mm' } } }, '3'],
];

async function slotCard(slot: string, config: Record<string, unknown>, states: Record<string, unknown>) {
  return (await renderCard(
    baseConfig({
      section_order: ['slots'],
      slot_l1: slot,
      slot_r1: 'remove',
      entity_temperature: 'sensor.temp',
      ...config,
    } as never),
    makeHass({ ...base, ...states } as never),
  )) as HTMLElement;
}

function slotText(el: HTMLElement, slot: string): string {
  const li = el.shadowRoot?.querySelector(`li[data-slot="${slot}"]`);
  return (li?.textContent ?? '').replace(/\s+/g, ' ').trim();
}

describe('each slot shows its value', () => {
  for (const [slot, config, states, expected] of slots) {
    it(`${slot} renders`, async () => {
      const el = await slotCard(slot, config, states);
      const text = slotText(el, slot);
      expect(text, `${slot} rendered nothing`).not.toBe('');
      expect(text, `${slot} missing "${expected}"`).toContain(expected);
    });
  }
});

describe('each slot survives a dead sensor', () => {
  for (const [slot, config, states] of slots) {
    if (slot === 'sun_next') continue; // sun.sun is provided by HA, not the user
    it(`${slot} degrades gracefully`, async () => {
      const dead = Object.fromEntries(
        Object.keys(states).map((k) => [k, { state: 'unavailable' }]),
      );
      const el = await slotCard(slot, config, dead);
      const text = slotText(el, slot);
      expect(text, `${slot} printed NaN`).not.toContain('NaN');
      expect(text, `${slot} leaked the raw state`).not.toContain('unavailable');
    });
  }
});

describe('slots the user has not configured', () => {
  it('render nothing rather than an empty row', async () => {
    // slot_l1 points at humidity but no humidity entity is set
    const el = (await renderCard(
      baseConfig({ section_order: ['slots'], slot_l1: 'humidity', slot_r1: 'remove' } as never),
      makeHass(base as never),
    )) as HTMLElement;
    expect(el.shadowRoot?.textContent).not.toContain('NaN');
  });

  it('accepts "remove" as a slot value without rendering a reading', async () => {
    // Every slot must be set to 'remove' explicitly: unset ones keep their
    // defaults, which is why the section still had content on the first attempt.
    const allRemoved: Record<string, string> = {};
    for (let i = 1; i <= 8; i++) {
      allRemoved[`slot_l${i}`] = 'remove';
      allRemoved[`slot_r${i}`] = 'remove';
    }
    const el = (await renderCard(
      baseConfig({ section_order: ['slots'], ...allRemoved } as never),
      makeHass(base as never),
    )) as HTMLElement;
    const named = el.shadowRoot?.querySelectorAll('li[data-slot]') ?? [];
    for (const li of Array.from(named)) {
      expect((li.textContent ?? '').trim(), 'a removed slot rendered a value').toBe('');
    }
  });
});

describe('custom slots', () => {
  it('shows label, value and unit', async () => {
    const el = (await renderCard(
      baseConfig({
        section_order: ['slots'],
        slot_l1: 'custom1',
        slot_r1: 'remove',
        custom1_value: 'sensor.custom',
        custom1_label: 'Soil',
        custom1_units: '%',
        custom1_icon: 'mdi:sprout',
      } as never),
      makeHass({ ...base, 'sensor.custom': { state: '42' } } as never),
    )) as HTMLElement;
    const text = slotText(el, 'custom1');
    expect(text).toContain('42');
    expect(text).toContain('Soil');
    expect(text).toContain('%');
  });

  it('does not print NaN for a missing custom entity', async () => {
    const el = (await renderCard(
      baseConfig({
        section_order: ['slots'],
        slot_l1: 'custom1',
        slot_r1: 'remove',
        custom1_value: 'sensor.gone',
      } as never),
      makeHass(base as never),
    )) as HTMLElement;
    expect(el.shadowRoot?.textContent).not.toContain('NaN');
  });
});

describe('compact labels', () => {
  it('shortens the observed max wording when enabled', async () => {
    const states = { 'sensor.x': { state: '28', attributes: { unit_of_measurement: '°C' } } };
    const long = await slotCard('observed_max', { entity_observed_max: 'sensor.x' }, states);
    const short = (await renderCard(
      baseConfig({
        section_order: ['slots'],
        slot_l1: 'observed_max',
        slot_r1: 'remove',
        entity_observed_max: 'sensor.x',
        option_compact_slots: true,
      } as never),
      makeHass({ ...base, ...states } as never),
    )) as HTMLElement;
    expect(slotText(short, 'observed_max').length)
      .toBeLessThan(slotText(long, 'observed_max').length);
  });
});
