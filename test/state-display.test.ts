import { describe, it, expect } from 'vitest';
import { entityComputeStateDisplay, stringComputeStateDisplay } from '../src/compute_state_display';

// Translates entity states for display, falling back through Home Assistant's
// localisation keys to the raw state. The fallback chain matters: an untranslated
// state must still be readable rather than showing a translation key.

type Localize = (key: string, ...args: unknown[]) => string;

// Stands in for HA's localize: knows a few keys, returns '' for the rest, which
// is what HA does for a missing translation.
const known: Record<string, string> = {
  'state.default.unavailable': 'Unavailable',
  'state.default.unknown': 'Unknown',
  'component.weather.entity_component._.state.sunny': 'Sunny',
  'component.weather.entity_component._.state.rainy': 'Rainy',
};
const localize: Localize = (key) => known[key] ?? '';

const entity = (
  state: string,
  attributes: Record<string, unknown> = {},
  entity_id = 'sensor.test',
) => ({ state, attributes, entity_id }) as never;

const locale = { language: 'en', number_format: 'language', time_format: 'language' } as never;

describe('entityComputeStateDisplay', () => {
  it('translates unavailable and unknown', () => {
    expect(entityComputeStateDisplay(localize, entity('unavailable'), locale)).toBe('Unavailable');
    expect(entityComputeStateDisplay(localize, entity('unknown'), locale)).toBe('Unknown');
  });

  it('appends the unit when the entity has one', () => {
    expect(
      entityComputeStateDisplay(localize, entity('21.5', { unit_of_measurement: '°C' }), locale),
    ).toBe('21.5°C');
  });

  it('prefers the unit over any translation', () => {
    // A numeric reading with a unit is not a state to translate.
    expect(
      entityComputeStateDisplay(
        localize,
        entity('sunny', { unit_of_measurement: '%' }, 'weather.test'),
        locale,
      ),
    ).toBe('sunny%');
  });

  it('translates a known weather state', () => {
    expect(
      entityComputeStateDisplay(localize, entity('sunny', {}, 'weather.test'), locale),
    ).toBe('Sunny');
  });

  it('falls back to the raw state when there is no translation', () => {
    // Better a readable English word than a translation key on the card.
    expect(
      entityComputeStateDisplay(localize, entity('hurricane', {}, 'weather.test'), locale),
    ).toBe('hurricane');
  });

  it('handles an empty state without throwing', () => {
    expect(() => entityComputeStateDisplay(localize, entity(''), locale)).not.toThrow();
  });

  it('handles a state that looks numeric but has no unit', () => {
    expect(entityComputeStateDisplay(localize, entity('42'), locale)).toBe('42');
  });
});

describe('stringComputeStateDisplay', () => {
  it('translates a known weather condition', () => {
    expect(stringComputeStateDisplay(localize, 'sunny')).toBe('Sunny');
    expect(stringComputeStateDisplay(localize, 'rainy')).toBe('Rainy');
  });

  it('returns the input when there is no translation', () => {
    expect(stringComputeStateDisplay(localize, 'exceptional')).toBe('exceptional');
  });

  it('does not throw on an empty string', () => {
    expect(() => stringComputeStateDisplay(localize, '')).not.toThrow();
  });
});
