import { describe, it, expect } from 'vitest';
import '../src/platinum-weather-card';
import { makeHass, makeForecast, baseConfig, renderCard } from './helpers';

// A card that has a weather entity and nothing else to read: the overview and the
// slots take their figures from the entity's attributes, as the card can already
// do when each key is pointed at it by hand. And the card picker's stub is made of it.

const W = 'weather.home';
const attrs = {
  temperature: 12.3, apparent_temperature: 10.4, humidity: 71, pressure: 1013, wind_speed: 17,
  wind_bearing: 200, wind_gust_speed: 29, visibility: 23, uv_index: 4, dew_point: 8, cloud_coverage: 77,
  temperature_unit: '°C', pressure_unit: 'hPa', wind_speed_unit: 'km/h', visibility_unit: 'km',
  precipitation_unit: 'mm', friendly_name: 'Home', supported_features: 3,
};

function states(over: Record<string, { state: string; attributes?: Record<string, unknown> }> = {}, w: Record<string, unknown> = {}, condition = 'cloudy') {
  return {
    [W]: { state: condition, attributes: { ...attrs, ...w } },
    'sun.sun': { state: 'above_horizon', attributes: { elevation: 30, azimuth: 150 } },
    ...over,
  };
}
const SLOTS = {
  slot_l1: 'humidity', slot_l2: 'pressure', slot_l3: 'wind', slot_l4: 'wind_gust', slot_l5: 'visibility', slot_l6: 'uv_index',
  slot_r1: 'cloud_cover', slot_r2: 'remove', slot_r3: 'remove', slot_r4: 'remove', slot_r5: 'remove', slot_r6: 'remove',
};
async function mount(config: Record<string, unknown>, st = states(), forecast = makeForecast(6, 0)) {
  const hass = makeHass(st, { forecast } as never);
  const el = (await renderCard(baseConfig(config as never), hass)) as HTMLElement & { _config: Record<string, unknown> };
  return el;
}
const slot = (el: HTMLElement, name: string) => (el.shadowRoot?.querySelector(`[data-slot="${name}"]`)?.textContent ?? '').replace(/\s+/g, ' ');
const q = (el: HTMLElement, sel: string) => (el.shadowRoot?.querySelector(sel)?.textContent ?? '').replace(/\s+/g, ' ').trim();
const html = (el: HTMLElement) => el.shadowRoot?.innerHTML ?? '';
const text = (el: HTMLElement) => (el.shadowRoot?.textContent ?? '').replace(/\s+/g, ' ');
const only = { weather_entity: W, section_order: ['overview', 'slots'], overview_layout: 'complete', ...SLOTS };

describe('a weather_entity and nothing else to read from', () => {
  it('shows the temperature and the feels-like in the overview', async () => {
    const el = await mount(only);
    expect(q(el, '#current-temp-text')).toBe('12');
    expect(q(el, '.apparent')).toContain('10');
  });
  it('fills the slots from the entity: humidity, pressure, wind, gust, visibility', async () => {
    const el = await mount(only);
    expect(slot(el, 'humidity')).toContain('71');
    expect(slot(el, 'pressure')).toContain('1,013');
    expect(slot(el, 'wind')).toContain('17');
    expect(slot(el, 'wind_gust')).toContain('29');
    expect(slot(el, 'visibility')).toContain('23');
  });
  it('fills the UV index and the cloud cover too', async () => {
    const el = await mount(only);
    expect(slot(el, 'uv_index')).toContain('4');
    expect(slot(el, 'cloud_cover')).toContain('77');
  });
  it('gives the visibility the unit the entity gives it', async () => {
    const el = await mount(only, states({}, { visibility: 14, visibility_unit: 'mi' }));
    expect(slot(el, 'visibility')).toContain('mi');
  });
  it('draws the condition icon from the entity\'s state', async () => {
    const rainy = await mount(only, states({}, {}, 'rainy'));
    expect(rainy.shadowRoot?.querySelector('.big-icon img')?.getAttribute('src')).toMatch(/rainy/);
  });
  it('uses the dew point for the comfort word', async () => {
    const el = await mount({ ...only, option_show_comfort: true });
    // a dew point of 8 is the "dry" band
    expect(q(el, '.comfort').toLowerCase()).toMatch(/dry|сухо/);
  });
  it('leaves the feels-like out when the provider does not give one, rather than printing dashes', async () => {
    const { apparent_temperature: _a, ...rest } = attrs;
    const el = await mount(only, { [W]: { state: 'cloudy', attributes: rest }, 'sun.sun': states()['sun.sun'] });
    expect(el.shadowRoot?.querySelector('.apparent'), 'a feels-like of dashes').toBeNull();
  });
  it('does not warn about keys it supplied, whatever the provider leaves out', async () => {
    const { pressure: _p, visibility: _v, uv_index: _u, ...rest } = attrs;
    const el = await mount(only, { [W]: { state: 'cloudy', attributes: rest }, 'sun.sun': states()['sun.sun'] });
    expect(html(el)).not.toMatch(/not found|attribute/i);
  });
});

describe('a weather_entity that is not there', () => {
  it('does not turn into a warning for every key the card would have supplied', async () => {
    // a typo, or an integration that has not loaded: fourteen lines about keys the user never wrote would be noise
    const el = await mount({ ...only, weather_entity: 'weather.typo' }, states());
    expect(html(el)).not.toMatch(/entity_temperature|entity_humidity|entity_pressure|entity_forecast_icon/);
  });
});

describe('what a weather entity gives, and what it does not', () => {
  it('fills the chance of rain and the rain amount from today\'s forecast', async () => {
    // seen in the card picker's preview: the slot was all dashes while the strip beside it had the figures
    const el = await mount({ ...only, slot_r2: 'popforecast' });
    const first = makeForecast(6, 0)[0] as { precipitation_probability: number };
    expect(slot(el, 'popforecast')).toMatch(new RegExp(`${first.precipitation_probability}\\s*%`));
    expect(slot(el, 'popforecast')).not.toContain('---');
  });
  it('leaves out "(Gust ---)" when the provider has no gusts, rather than printing dashes', async () => {
    const { wind_gust_speed: _g, ...rest } = attrs;
    const el = await mount(only, { [W]: { state: 'cloudy', attributes: rest }, 'sun.sun': states()['sun.sun'] });
    expect(slot(el, 'wind')).toContain('17');
    expect(slot(el, 'wind')).not.toMatch(/gust/i);
  });
  it('still shows the gusts where the provider has them', async () => {
    const el = await mount(only);
    expect(slot(el, 'wind')).toMatch(/gust/i);
    expect(slot(el, 'wind')).toContain('29');
  });
  it('leaves a gust setting the user wrote alone, dashes and all', async () => {
    const { wind_gust_speed: _g, ...rest } = attrs;
    const el = await mount({ ...only, entity_wind_speed: W, entity_wind_gust: W }, { [W]: { state: 'cloudy', attributes: rest }, 'sun.sun': states()['sun.sun'] });
    expect(slot(el, 'wind')).toMatch(/gust/i);
  });
  it('counts a rain sensor the user set as theirs: nothing else is filled in around it', async () => {
    const el = await mount({ ...only, entity_pop: 'sensor.chance' }, states({ 'sensor.chance': { state: '40' } }));
    expect(el._config.entity_humidity).toBeUndefined();
  });
});

describe('when any measurement is the user\'s own', () => {
  it('fills in none of the others — a station beside a forecast is a choice', async () => {
    const el = await mount({ ...only, entity_temperature: 'sensor.station' }, states({ 'sensor.station': { state: '9.5', attributes: { unit_of_measurement: '°C' } } }));
    for (const k of ['entity_humidity', 'entity_pressure', 'entity_wind_speed', 'entity_uv_index', 'entity_forecast_icon']) {
      expect(el._config[k], k).toBeUndefined();
    }
    expect(slot(el, 'humidity')).toContain('---');
  });
  it('and never writes into the stored configuration', async () => {
    const stored: Record<string, unknown> = { ...only };
    const el = await mount(stored);
    expect(el._config.entity_humidity).toBe(W);
    for (const k of ['entity_temperature', 'entity_humidity', 'entity_pressure', 'entity_wind_speed']) expect(stored[k], k).toBeUndefined();
  });
  it('and does nothing without a weather entity', async () => {
    const el = await mount({ section_order: ['overview', 'slots'], ...SLOTS }, states());
    expect(el._config.entity_humidity).toBeUndefined();
  });
});

describe('the card picker, by entity', () => {
  // Home Assistant 2026.6 asks every window.customCards entry for getEntitySuggestion(hass, entityId)
  // when an entity is picked in "Add to dashboard > By entity", and lists the cards that answer under
  // Community. A card that has no such function is simply not there.
  type Suggestion = { label?: string; config: Record<string, unknown> };
  type Entry = { type: string; getEntitySuggestion?: (hass: unknown, entityId: string) => Suggestion | Suggestion[] | null };
  const entry = () => (window as unknown as { customCards: Entry[] }).customCards.find((c) => c.type === 'platinum-weather-card-plus-charts')!;
  const suggest = (hass: unknown, id: string) => entry().getEntitySuggestion?.(hass, id);
  const hassWith = (features?: number) => makeHass({
    'weather.other': { state: 'cloudy', attributes: { supported_features: 3 } },
    [W]: { state: 'cloudy', attributes: features === undefined ? { temperature: 12 } : { temperature: 12, supported_features: features } },
    'sun.sun': { state: 'above_horizon', attributes: { elevation: 30 } },
  });

  it('is there at all, which is what puts the card in the list', () => {
    expect(typeof entry().getEntitySuggestion).toBe('function');
  });
  it('is quiet about everything that is not a weather entity', () => {
    const hass = makeHass({ 'light.lamp': { state: 'on' }, 'sensor.t': { state: '3' } });
    expect(suggest(hass, 'light.lamp')).toBeNull();
    expect(suggest(hass, 'sensor.t')).toBeNull();
  });
  it('suggests a card for the entity that was picked, not the first one it finds', () => {
    const s = suggest(hassWith(1), W) as Suggestion;
    expect(s.config.type).toBe('custom:platinum-weather-card-plus-charts');
    expect(s.config.weather_entity).toBe(W);
  });
  it('answers at once: Home Assistant does not wait for it', () => {
    expect(suggest(hassWith(1), W)).not.toBeInstanceOf(Promise);
  });
  it('offers one variant for days only, and two where the entity can also do hours', () => {
    expect(Array.isArray(suggest(hassWith(1), W))).toBe(false);
    const both = suggest(hassWith(3), W) as Suggestion[];
    expect(both).toHaveLength(2);
    expect(both.every((v) => typeof v.label === 'string' && v.label.length > 0), 'a variant without a label').toBe(true);
    expect(both[0].config.entity_hourly).toBeUndefined();
    expect(both[1].config.entity_hourly).toBe(W);
    expect(both[1].config.show_section_hourly_forecast).toBe(true);
  });
  it('has nothing to suggest for an entity that cannot do days, where the strip and the charts would be empty', () => {
    expect(suggest(hassWith(2), W)).toBeNull();
  });
  it('assumes it can, if the entity does not say', () => {
    expect(suggest(hassWith(undefined), W)).not.toBeNull();
  });
  it('is a card that works as it stands, each variant', async () => {
    const hass = makeHass(states(), { forecast: makeForecast(6, 0) } as never);
    const variants = ([] as Suggestion[]).concat(suggest(hass, W) as Suggestion | Suggestion[]);
    expect(variants.length).toBeGreaterThan(0);
    for (const v of variants) {
      const el = (await renderCard(baseConfig({ ...v.config } as never), hass)) as HTMLElement;
      expect(q(el, '#current-temp-text'), v.label).toBe('12');
      expect(el.shadowRoot?.querySelectorAll('.daily-forecast-horiz-section [class*=day]').length, `${v.label}: no days`).toBeGreaterThan(0);
    }
  });
});

describe('the card picker', () => {
  type Card = { getStubConfig: (hass?: unknown, unused?: string[], all?: string[]) => Record<string, unknown> };
  const cls = () => customElements.get('platinum-weather-card-plus-charts') as unknown as Card;

  it('is offered a live preview', () => {
    const entry = (window as unknown as { customCards: { type: string; preview?: boolean }[] }).customCards.find((c) => c.type === 'platinum-weather-card-plus-charts');
    expect(entry?.preview).toBe(true);
  });
  it('is given the weather entity that can do days', () => {
    const hass = makeHass({
      'weather.hours_only': { state: 'cloudy', attributes: { supported_features: 2 } },
      'weather.days': { state: 'cloudy', attributes: { supported_features: 3 } },
    });
    expect(cls().getStubConfig(hass).weather_entity).toBe('weather.days');
  });
  it('prefers a weather entity the dashboard does not use yet', () => {
    const hass = makeHass({
      'weather.shown': { state: 'cloudy', attributes: { supported_features: 3 } },
      'weather.free': { state: 'cloudy', attributes: { supported_features: 3 } },
    });
    expect(cls().getStubConfig(hass, ['weather.free'], ['weather.shown', 'weather.free']).weather_entity).toBe('weather.free');
  });
  it('still puts days before being unused', () => {
    const hass = makeHass({
      'weather.days': { state: 'cloudy', attributes: { supported_features: 3 } },
      'weather.hours_free': { state: 'cloudy', attributes: { supported_features: 2 } },
    });
    expect(cls().getStubConfig(hass, ['weather.hours_free']).weather_entity).toBe('weather.days');
  });
  it('takes the entity lists when hass has no states', () => {
    expect(cls().getStubConfig(undefined, ['weather.free'], ['weather.shown', 'weather.free']).weather_entity).toBe('weather.free');
  });
  it('falls back to the first weather entity when none says it can do days', () => {
    const hass = makeHass({ 'weather.a': { state: 'cloudy' }, 'weather.b': { state: 'cloudy' } });
    expect(cls().getStubConfig(hass).weather_entity).toBe('weather.a');
  });
  it('is given nothing to preview where there is no weather entity', () => {
    expect(cls().getStubConfig(makeHass({ 'sensor.x': { state: '1' } }))).toEqual({});
    expect(cls().getStubConfig()).toEqual({});
  });
  it('is a card that shows the weather, the days and the charts', async () => {
    const hass = makeHass(states(), { forecast: makeForecast(6, 0) } as never);
    const stub = cls().getStubConfig(hass);
    const el = (await renderCard(baseConfig({ ...stub } as never), hass)) as HTMLElement;
    expect(q(el, '#current-temp-text')).toBe('12');
    expect(el.shadowRoot?.querySelectorAll('.daily-forecast-horiz-section [class*=day]').length, 'no days').toBeGreaterThan(0);
    expect(el.shadowRoot?.querySelectorAll('svg polyline').length, 'no chart').toBeGreaterThan(0);
  });
});
