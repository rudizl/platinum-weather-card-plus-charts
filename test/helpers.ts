import type { WeatherCardConfig } from '../src/types';

// A Home Assistant stub with only what the card actually reads. Anything the
// card touches that isn't here will throw, which is the point: it keeps the
// fake honest about the card's real dependencies.
export interface FakeState {
  state: string;
  attributes?: Record<string, unknown>;
  last_changed?: string;
  last_updated?: string;
  entity_id?: string;
}

export function makeHass(states: Record<string, FakeState> = {}, overrides: Record<string, unknown> = {}) {
  const full: Record<string, FakeState> = {};
  for (const [id, s] of Object.entries(states)) {
    full[id] = {
      entity_id: id,
      last_changed: '2026-08-03T12:00:00+00:00',
      last_updated: '2026-08-03T12:00:00+00:00',
      attributes: {},
      ...s,
    };
  }
  return {
    states: full,
    config: {
      latitude: 43.26,
      longitude: 28.01,
      unit_system: { length: 'km', mass: 'g', temperature: '°C', volume: 'L', pressure: 'Pa', wind_speed: 'm/s', accumulated_precipitation: 'mm' },
      time_zone: 'Europe/Sofia',
      ...(overrides.config as object ?? {}),
    },
    locale: { language: 'en', number_format: 'language', time_format: 'language' },
    language: 'en',
    themes: { darkMode: false },
    localize: (key: string) => key,
    formatEntityState: (stateObj: FakeState) => String(stateObj.state),
    formatEntityAttributeValue: (_s: FakeState, _a: string) => '',
    callWS: async () => ({}),
    connection: {
      subscribeMessage: async () => () => undefined,
    },
    ...overrides,
  };
}

// The smallest configuration the card will accept without complaining.
export function baseConfig(extra: Partial<WeatherCardConfig> = {}): WeatherCardConfig {
  return {
    type: 'custom:platinum-weather-card-plus-charts',
    card_config_version: 8,
    section_order: ['overview'],
    ...extra,
  } as WeatherCardConfig;
}

// Renders the card and waits for Lit to finish, returning the shadow root.
export async function renderCard(config: WeatherCardConfig, hass: ReturnType<typeof makeHass>) {
  const el = document.createElement('platinum-weather-card-plus-charts') as HTMLElement & {
    setConfig: (c: WeatherCardConfig) => void;
    hass: unknown;
    updateComplete: Promise<unknown>;
  };
  el.setConfig(config);
  el.hass = hass;
  document.body.appendChild(el);
  await el.updateComplete;
  // a second turn lets any state set during the first update settle
  await el.updateComplete;
  return el;
}

export function textOf(el: HTMLElement, selector: string): string {
  return (el.shadowRoot?.querySelector(selector)?.textContent ?? '').replace(/\s+/g, ' ').trim();
}

export function allText(el: HTMLElement): string {
  // ha-card is a Home Assistant element and renders as an unknown tag here, but
  // its light DOM children are the card's actual content.
  const card = el.shadowRoot?.querySelector('ha-card');
  return ((card ?? el.shadowRoot)?.textContent ?? '').replace(/\s+/g, ' ').trim();
}

export function query(el: HTMLElement, selector: string): Element | null {
  return el.shadowRoot?.querySelector(selector) ?? null;
}

export function queryAll(el: HTMLElement, selector: string): Element[] {
  return Array.from(el.shadowRoot?.querySelectorAll(selector) ?? []);
}

export function warnings(el: HTMLElement): string[] {
  return Array.from(el.shadowRoot?.querySelectorAll('hui-warning div') ?? [])
    .map((d) => d.textContent ?? '')
    .filter((t) => t && t !== 'Weather Card');
}
