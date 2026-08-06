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
      // The card subscribes to weather/subscribe_forecast and renders from what
      // comes back. Handing the callback a forecast lets the chart and the strip
      // be tested the way they actually work.
      subscribeMessage: async (
        callback: (e: { type: string; forecast: unknown[] }) => void,
        msg: { type: string; forecast_type?: string },
      ) => {
        if (msg.type === 'weather/subscribe_forecast') {
          const forecast = (overrides.forecast as unknown[]) ?? [];
          // deliver on a later turn, as a real subscription would
          setTimeout(() => callback({ type: msg.forecast_type ?? 'daily', forecast }), 0);
        }
        return () => undefined;
      },
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
  // Forecast data arrives through a subscription callback, i.e. after the first
  // render. Give the timers a turn, then let Lit render again.
  await new Promise((resolve) => setTimeout(resolve, 0));
  await el.updateComplete;
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

// Builds a daily forecast array in the shape Home Assistant delivers, starting
// today unless told otherwise.
export function makeForecast(days: number, startOffset = 0) {
  const out = [];
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() + startOffset + i);
    out.push({
      datetime: d.toISOString(),
      condition: 'sunny',
      temperature: 20 + i,
      templow: 10 + i,
      precipitation: i,
      precipitation_probability: i * 5,
      wind_speed: 10 + i,
      wind_bearing: 180,
    });
  }
  return out;
}

export function warnings(el: HTMLElement): string[] {
  return Array.from(el.shadowRoot?.querySelectorAll('hui-warning div') ?? [])
    .map((d) => d.textContent ?? '')
    .filter((t) => t && t !== 'Weather Card');
}
