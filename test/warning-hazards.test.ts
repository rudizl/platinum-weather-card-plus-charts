import { describe, it, expect } from 'vitest';
import '../src/platinum-weather-card';
import { hazardsNamedIn } from '../src/warning_hazards';
import { tWarning } from '../src/translations';
import { makeHass, baseConfig, renderCard } from './helpers';

// MeteoAlarm warns of one hazard in a warning (a type, 1 wind, 10 rain...), but a service can put two in one: NIMH, for the red warning of 2 November, "Heavy precipitation and
// strong wind!", whose type is `10; Rain`. The built-in integration reports only the first warning it finds, and the card drew the type alone: the wind was lost (it was only in
// the description, which is the tooltip). The title is in the provider's language, so the words that are known are English and Bulgarian; a title in another language names nothing.

describe('the hazards that the title of a warning names', () => {
  it.each([
    ['Heavy precipitation and strong wind!', [1, 10]],
    ['Силен вятър и значителни валежи', [1, 10]],
    ['Orange warning for wind gusts and thunderstorms', [1, 3]],
    ['Опасно време: гръмотевични бури и пориви на вятъра', [1, 3]],
    ['Dense fog and ice on the roads', [2, 4]],
    ['Мъгла и поледица', [2, 4]],
    ['Extreme heat', [5]],
    ['Силен студ и мраз', [6]],
    ['Forest fire danger', [8]],
    ['Flooding after heavy rain', [10, 12]],
    ['Наводнения от пороен дъжд', [10, 12]],
  ])('%s names %j', (text, types) => {
    expect(hazardsNamedIn(text)).toEqual(types);
  });
  it('gives them in the order of the types, whichever the title said first', () => {
    expect(hazardsNamedIn('Flooding after heavy precipitation')).toEqual([10, 12]);
    expect(hazardsNamedIn('Fog, then wind, then rain')).toEqual([1, 4, 10]);
  });
  it('names nothing in a title in a language that is not known, or without a hazard', () => {
    expect(hazardsNamedIn('Ισχυροί άνεμοι και βροχές')).toEqual([]);
    expect(hazardsNamedIn('Stiprus vėjas ir liūtys')).toEqual([]);
    expect(hazardsNamedIn('Severe weather warning')).toEqual([]);
    expect(hazardsNamedIn('')).toEqual([]);
  });
  it('does not take a word that only starts like one: a window is not a wind, an iceberg is not ice, a firework is not a fire', () => {
    expect(hazardsNamedIn('Window cleaning, an iceberg, a firework and training in the terrain')).toEqual([]);
  });
  it('precipitation with snow or ice is not a rain', () => {
    expect(hazardsNamedIn('Heavy precipitation and snow')).toEqual([2]);
    expect(hazardsNamedIn('Heavy precipitation')).toEqual([10]);
  });
});

async function bar(attrs: Record<string, unknown>, style?: string) {
  const hass = makeHass({
    'weather.w': { state: 'cloudy', attributes: { temperature: 13 } },
    'binary_sensor.alarm': { state: 'on', attributes: { awareness_level: '4; red; Extreme', awareness_type: '10; Rain', expires: '2026-11-04T00:00:00+02:00', ...attrs } },
  });
  const el = (await renderCard(baseConfig({ weather_entity: 'weather.w', entity_warning: 'binary_sensor.alarm', section_order: ['warnings', 'overview'], ...(style ? { option_warning_style: style } : {}) } as never), hass)) as HTMLElement;
  const row = el.shadowRoot!.querySelector('.warning-row') as HTMLElement;
  return { text: row.querySelector('.warning-text')!.textContent!.trim(), icons: [...row.querySelectorAll('.warning-icon')].map((i) => i.getAttribute('icon')), multi: row.classList.contains('multi'), el };
}

describe('the bar of a warning that names a second hazard', () => {
  // On a phone the text of a bar with two hazards does not fit beside the time that the warning ends ("Red code: Rain + Str..."): it goes on to a second line there instead of being cut.
  it.each(['soft', 'classic'])('the row of two hazards is marked, so that its text may take a second line (%s)', async (style) => {
    const two = await bar({ event: 'Heavy precipitation and strong wind!' }, style);
    expect(two.multi).toBe(true);
    const one = await bar({ event: 'Heavy precipitation' }, style);
    expect(one.multi).toBe(false);
  });
  it('the marked row lets its text wrap, and the other rows keep the cut that they had', async () => {
    const { el } = await bar({ event: 'Heavy precipitation and strong wind!' });
    const css = String((el as unknown as { styles: { cssText: string } }).styles.cssText).replace(/\s+/g, ' ');
    expect(css).toMatch(/\.warning-row\.multi \.warning-text \{ white-space: normal; overflow: visible; text-overflow: clip; line-height: 1\.25; \}/);
    const plain = (css.match(/(?:^|\})\s*\.warning-text \{([^}]*)\}/) ?? [])[1] ?? '';   // the rule of the text itself, not the ones of a level
    expect(plain).toContain('white-space: nowrap');
    expect(plain).toContain('text-overflow: ellipsis');
  });

  const level = tWarning('en', 'level_4'), rain = tWarning('en', 'type_10'), wind = tWarning('en', 'type_1');
  it('shows both hazards, with the icon of each (the case of 2 November)', async () => {
    const b = await bar({ event: 'Heavy precipitation and strong wind!', headline: 'Heavy precipitation and strong wind!' });
    expect(b.text).toBe(`${level}: ${rain} + ${wind}`);
    expect(b.icons).toEqual(['mdi:weather-pouring', 'mdi:weather-windy']);
  });
  it.each(['soft', 'classic'])('draws the second icon in the %s style of the bar (the soft one is the default where there is one)', async (style) => {
    const b = await bar({ event: 'Heavy precipitation and strong wind!' }, style);
    expect(b.icons).toEqual(['mdi:weather-pouring', 'mdi:weather-windy']);
    expect(b.text).toBe(`${level}: ${rain} + ${wind}`);
  });
  it('is as it was when the title names only the type', async () => {
    const b = await bar({ event: 'Heavy precipitation', headline: 'Heavy precipitation' });
    expect(b.text).toBe(`${level}: ${rain}`);
    expect(b.icons).toEqual(['mdi:weather-pouring']);
  });
  it('is as it was when the title is in a language that is not known', async () => {
    const b = await bar({ event: 'Ισχυροί άνεμοι και βροχές', headline: 'Ισχυροί άνεμοι και βροχές' });
    expect(b.text).toBe(`${level}: ${rain}`);
    expect(b.icons).toEqual(['mdi:weather-pouring']);
  });
  it('reads the title, and not the description (which is long and speaks of everything)', async () => {
    const b = await bar({ event: 'Heavy precipitation', headline: 'Heavy precipitation', description: 'During the night a strong wind will blow from the north-northeast, with fog and thunderstorms.' });
    expect(b.text).toBe(`${level}: ${rain}`);
  });
  it('does not name the type twice, and names at most two more', async () => {
    const one = await bar({ event: 'Rain, heavy rain and showers', headline: 'Rain' });
    expect(one.text).toBe(`${level}: ${rain}`);
    const many = await bar({ event: 'Heavy rain, strong wind, thunderstorms, fog and snow' });
    expect(many.icons!.length).toBe(3);
    expect(many.text.split(' + ').length).toBe(3);
  });
  it('a warning of the type rain and flooding already says both, and the two floodings are one', async () => {
    const both = await bar({ awareness_type: '13; Rain-Flood', event: 'Heavy rain and floods', headline: 'Heavy rain and floods' });
    expect(both.text).toBe(`${level}: ${tWarning('en', 'type_13')}`);
    expect(both.icons).toEqual(['mdi:home-flood']);
    const flood = await bar({ awareness_type: '12; Flooding', event: 'Flooding', headline: 'Flooding' });
    expect(flood.icons).toEqual(['mdi:home-flood']);
    const eleven = await bar({ awareness_type: '11; Flooding', event: 'Flooding', headline: 'Flooding' });   // the title names the type 12, the warning is of the type 11
    expect(eleven.icons).toEqual(['mdi:home-flood']);
  });
  it('adds nothing to a type that the card does not know: the provider\'s own words stand, and the icon is the alert', async () => {
    const b = await bar({ awareness_type: '99; Other', event: 'Wind and rain warning', headline: 'Wind and rain warning' });
    expect(b.text).toBe(`${level}: Wind and rain warning`);
    expect(b.icons).toEqual(['mdi:alert']);
  });
  it('reads the title in Bulgarian too, and names the hazards in the language of the card', async () => {
    const hass = makeHass({ 'weather.w': { state: 'cloudy', attributes: { temperature: 13 } },
      'binary_sensor.alarm': { state: 'on', attributes: { awareness_level: '4; red; Extreme', awareness_type: '10; Rain', event: 'Силен вятър и значителни валежи', expires: '2026-11-04T00:00:00+02:00' } } });
    (hass as unknown as { locale: { language: string } }).locale = { language: 'bg' };
    const el = (await renderCard(baseConfig({ weather_entity: 'weather.w', entity_warning: 'binary_sensor.alarm', section_order: ['warnings', 'overview'], option_locale: 'bg' } as never), hass)) as HTMLElement;
    const text = el.shadowRoot!.querySelector('.warning-row .warning-text')!.textContent!.trim();
    // in Bulgarian after the level: small letters, joined by "и" (see warning-join.test.ts)
    expect(text).toBe('Червен код: значителни валежи и силен вятър');
  });
});
