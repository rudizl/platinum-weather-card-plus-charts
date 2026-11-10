import { describe, it, expect } from 'vitest';
import { render } from 'lit';
import '../src/platinum-weather-card';
import '../src/editor';
import { makeHass } from './helpers';

// Two switches of the air quality in the editor (my review of 2.7): the warning shows only on a card that has the warnings section, where it
// does something; and the decimals only once a sensor is chosen (M33, which no test held).

type Editor = HTMLElement & { setConfig: (c: unknown) => void; hass: unknown; updateComplete: Promise<unknown>; _topicWarnings: () => unknown; _topicAppearance: () => unknown };
async function editor(config: Record<string, unknown>) {
  const el = document.createElement('platinum-weather-card-plus-charts-editor') as Editor;
  el.setConfig({ card_config_version: 8, weather_entity: 'weather.home', ...config });
  el.hass = makeHass({ 'weather.home': { state: 'cloudy' }, 'sensor.pm25': { state: '5', attributes: { unit_of_measurement: 'µg/m³' } } });
  document.body.appendChild(el); await el.updateComplete;
  return el;
}
const has = (el: Editor, page: () => unknown, key: string) => {
  const box = document.createElement('div'); render(page.call(el) as never, box, { host: el });
  return [...box.querySelectorAll('.pwc-switch')].some((s) => (s as unknown as { value: string }).value === key);
};

describe('the switches of the air in the editor', () => {
  it('the warning, only where the card shows its warnings', async () => {
    const withSection = await editor({ entity_pm25: 'sensor.pm25', section_order: ['warnings', 'overview'] });
    expect(has(withSection, withSection._topicWarnings, 'option_air_warning')).toBe(true);
    const hidden = await editor({ entity_pm25: 'sensor.pm25', section_order: ['warnings', 'overview'], show_section_warnings: false });
    expect(has(hidden, hidden._topicWarnings, 'option_air_warning')).toBe(false);
  });
  it('the decimals, only once a sensor is chosen', async () => {
    const none = await editor({});
    expect(has(none, none._topicAppearance, 'option_air_decimals')).toBe(false);
    const one = await editor({ entity_pm25: 'sensor.pm25' });
    expect(has(one, one._topicAppearance, 'option_air_decimals')).toBe(true);
  });
});
