import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import '../src/platinum-weather-card';
import '../src/editor';
import { makeHass, baseConfig, renderCard } from './helpers';

const editor = readFileSync(join(__dirname, '../src/editor.ts'), 'utf8');

// The card reads uv_index and dew_point from a weather entity's attributes, so
// the editor should let one be chosen for them, as it does for humidity or pressure.
describe('the UV index and dew point pickers', () => {
  for (const key of ['entity_uv_index', 'entity_dew_point']) {
    it(`offer weather entities for ${key}`, () => {
      const picker = new RegExp(`configValue=\\$\\{'${key}'\\}[^>]*includeDomains=\\$\\{\\[([^\\]]*)\\]\\}`).exec(editor);
      expect(picker, key).not.toBeNull();
      expect(picker![1]).toContain("'weather'");
      expect(picker![1]).toContain("'sensor'");
    });
  }
});

type Card = HTMLElement & { _config: Record<string, unknown> };
const sun = { 'sun.sun': { state: 'above_horizon', attributes: { elevation: 30, next_rising: '2026-10-23T05:30:00Z', next_setting: '2026-10-22T16:20:00Z' } } };

describe('entity_sun left out', () => {
  it('is sun.sun', async () => {
    const el = (await renderCard(baseConfig({ section_order: ['slots'], slot_l1: 'sun_next' } as never), makeHass(sun))) as Card;
    expect(el._config.entity_sun).toBe('sun.sun');
    expect(el.shadowRoot?.querySelector('.sun-next-text')).not.toBeNull();
  });

  it('is not written back', async () => {
    const stored = baseConfig({ section_order: ['slots'] } as never) as unknown as Record<string, unknown>;
    await renderCard(stored as never, makeHass(sun));
    expect(stored.entity_sun).toBeUndefined();
  });

  it('without the sun integration, behaves as before: no sun slots and no warning', async () => {
    const el = (await renderCard(baseConfig({ section_order: ['slots'], slot_l1: 'sun_next', slot_r1: 'sun_following' } as never), makeHass({}))) as Card;
    expect(el.shadowRoot?.querySelector('.sun-next-text')).toBeNull();
    expect(el.shadowRoot?.innerHTML ?? '').not.toContain('not found');
  });

  it('leaves a sun entity the user chose alone', async () => {
    const el = (await renderCard(baseConfig({ section_order: ['slots'], entity_sun: 'sensor.my_sun' } as never), makeHass(sun))) as Card;
    expect(el._config.entity_sun).toBe('sensor.my_sun');
  });
});

// The cloud cover entity is read from a weather entity's attribute cloud_coverage (the cloud cover slot), and the picker offered only sensors: met.no's
// weather entity, which gives the number, could not be chosen for it. The picker is drawn in two places, and both have to offer it.
describe('the cloud cover pickers', () => {
  const all = [...editor.matchAll(/configValue=\$\{'entity_cloud_cover'\}[^>]*includeDomains=\$\{\[([^\]]*)\]\}/g)].map((m) => m[1]);
  it('are two, in the card\u2019s sources and in the global options', () => {
    expect(all).toHaveLength(2);
  });
  it('offer weather entities, and sensors', () => {
    for (const domains of all) { expect(domains).toContain("'weather'"); expect(domains).toContain("'sensor'"); }
  });
});

// And it does not offer the whole house: this one has more than a thousand sensors, and a list that long is no help in choosing a sky.
describe('what the cloud cover pickers offer', () => {
  type St = { entity_id: string; attributes: Record<string, unknown> };
  const e = (id: string, attributes: Record<string, unknown> = {}): St => ({ entity_id: id, attributes });
  const Editor = customElements.get('platinum-weather-card-plus-charts-editor') as unknown as new () => { _cloudCoverFilter: (s: St) => boolean };
  const keep = (s: St) => new Editor()._cloudCoverFilter(s);
  it('both pickers filter, with the same function', () => {
    expect([...editor.matchAll(/configValue=\$\{'entity_cloud_cover'\}[^>]*\.entityFilter=\$\{this\._cloudCoverFilter\}/g)]).toHaveLength(2);
  });
  it('a weather entity that gives a cloud cover is offered, and one that does not is not', () => {
    expect(keep(e('weather.forecast_varna', { cloud_coverage: 99.2 }))).toBe(true);
    expect(keep(e('weather.forecast_varna', { cloud_coverage: 0 }))).toBe(true);
    expect(keep(e('weather.ivarna103', { temperature: 13 }))).toBe(false);
    expect(keep(e('weather.x', { cloud_coverage: 'unknown' }))).toBe(false);
  });
  it('a sensor in per cent is offered', () => {
    expect(keep(e('sensor.cloud', { unit_of_measurement: '%' }))).toBe(true);
    expect(keep(e('sensor.cloud', { unit_of_measurement: '%', device_class: undefined }))).toBe(true);
  });
  it('a sensor that is a battery, a humidity or a moisture is not a sky, in per cent as it is', () => {
    for (const device_class of ['battery', 'humidity', 'moisture', 'power_factor', 'signal_strength']) {
      expect(keep(e('sensor.x', { unit_of_measurement: '%', device_class })), device_class).toBe(false);
    }
  });
  it('a sensor in anything else is not', () => {
    expect(keep(e('sensor.temperature', { unit_of_measurement: '\u00b0C', device_class: 'temperature' }))).toBe(false);
    expect(keep(e('sensor.no_unit', {}))).toBe(false);
  });
});
