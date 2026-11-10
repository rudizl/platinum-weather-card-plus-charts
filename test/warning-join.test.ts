import { describe, it, expect } from 'vitest';
import '../src/platinum-weather-card';
import { makeHass, baseConfig, renderCard } from './helpers';
import { TRANSLATIONS } from '../src/translations';

// How a language writes the hazards of a warning after its level (10 November, after the review of the Bulgarian texts): "Оранжев код: Значителни
// валежи + Силен вятър" is not Bulgarian; "Оранжев код: значителни валежи и силен вятър" is. Each language says how it joins them (warning.join)
// and whether a hazard after the level begins with a small letter (warning.lower_after_level). English keeps "Red warning: Rain + Wind".

async function bar(lang: string, attrs: Record<string, unknown> = {}) {
  const hass = makeHass({
    'weather.w': { state: 'cloudy', attributes: { temperature: 13 } },
    'binary_sensor.alarm': { state: 'on', attributes: { awareness_level: '3; orange; Severe', awareness_type: '10; Rain', expires: '2026-11-04T00:00:00+02:00', ...attrs } },
  });
  const el = (await renderCard(baseConfig({ weather_entity: 'weather.w', entity_warning: 'binary_sensor.alarm', section_order: ['warnings', 'overview'], option_locale: lang } as never), hass)) as HTMLElement;
  return el.shadowRoot!.querySelector('.warning-row .warning-text')!.textContent!.trim();
}

describe('the hazards of a warning, as each language writes them', () => {
  it('in Bulgarian: small letters after the level, joined by "и"', async () => {
    expect(await bar('bg', { event: 'Heavy precipitation and strong wind!' })).toBe('Оранжев код: значителни валежи и силен вятър');
  });
  it('three are a list: commas, and "и" before the last', async () => {
    expect(await bar('bg', { event: 'Heavy rain, strong wind, fog' })).toBe('Оранжев код: значителни валежи, силен вятър и мъгла');
  });
  it('one alone after the level, small too', async () => {
    expect(await bar('bg', { event: 'Rain' })).toBe('Оранжев код: значителни валежи');
  });
  it('in English as before: capitals and "+"', async () => {
    expect(await bar('en', { event: 'Heavy precipitation and strong wind!' })).toBe('Orange warning: Rain + Wind');
  });
  it('every language says how it joins them', () => {
    for (const [lang, t] of Object.entries(TRANSLATIONS)) {
      const w = (t as { warning: Record<string, string> }).warning;
      expect(w.join, lang).toBeTruthy();
      expect(['yes', 'no'], lang).toContain(w.lower_after_level);
    }
  });
});
