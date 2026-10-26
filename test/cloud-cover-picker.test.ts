import { describe, it, expect } from 'vitest';
import { render } from 'lit';
import '../src/platinum-weather-card';
import '../src/editor';
import { makeHass } from './helpers';

// The filter of the cloud cover picker was tested as a function and as text, and not as what the picker is given: on 26 October it was reported
// that the picker still showed everything. What reaches the element that Home Assistant draws is what counts, so this reads it there.

type Editor = HTMLElement & { setConfig: (c: unknown) => void; hass: unknown; updateComplete: Promise<unknown> };
type Picker = HTMLElement & { configValue?: string; includeDomains?: string[]; entityFilter?: (e: unknown) => boolean };

async function editor(config: Record<string, unknown> = {}) {
  const el = document.createElement('platinum-weather-card-plus-charts-editor') as Editor;
  el.setConfig({ card_config_version: 8, weather_entity: 'weather.home', ...config });
  el.hass = makeHass({ 'weather.home': { state: 'cloudy' } });
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}
const draw = (t: unknown) => { const box = document.createElement('div'); render(t as never, box); return box; };
const pickers = (box: HTMLElement) => [...box.querySelectorAll('*')].filter((e) => (e as Picker).configValue === 'entity_cloud_cover') as Picker[];
const st = (entity_id: string, attributes: Record<string, unknown>) => ({ entity_id, state: 'x', attributes });

describe('the cloud cover pickers, as the elements are given them', () => {
  it('in the global options: a picker with the filter, offering sensors and weather entities', async () => {
    const el = await editor();
    const p = pickers(draw((el as unknown as { _optionGlobalOptionsEditor: () => unknown })._optionGlobalOptionsEditor()));
    expect(p).toHaveLength(1);
    expect(typeof p[0].entityFilter, 'entityFilter on the element').toBe('function');
    expect(p[0].includeDomains).toEqual(['sensor', 'weather']);
  });
  it('among the sources, when the cloud cover slot is chosen: a picker with the same filter', async () => {
    const el = await editor({ slot_l1: 'cloud_cover' });
    const p = pickers(draw((el as unknown as { _sectionSlotsEditor: () => unknown })._sectionSlotsEditor()));
    expect(p.length, 'a picker for the cloud cover among the sources').toBeGreaterThan(0);
    for (const one of p) expect(typeof one.entityFilter).toBe('function');
  });
  it('and what the filter lets through is what it should', async () => {
    const el = await editor();
    const f = pickers(draw((el as unknown as { _optionGlobalOptionsEditor: () => unknown })._optionGlobalOptionsEditor()))[0].entityFilter!;
    const house = [
      st('weather.forecast_varna', { cloud_coverage: 99.2 }), st('weather.ivarna103', { temperature: 13 }),
      st('sensor.cloud', { unit_of_measurement: '%' }), st('sensor.battery', { unit_of_measurement: '%', device_class: 'battery' }),
      st('sensor.temp', { unit_of_measurement: '\u00b0C', device_class: 'temperature' }), st('sensor.plain', {}),
    ];
    expect(house.filter(f).map((e) => e.entity_id)).toEqual(['weather.forecast_varna', 'sensor.cloud']);
  });
});
