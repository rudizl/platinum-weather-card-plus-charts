import { describe, it, expect } from 'vitest';
import '../src/platinum-weather-card';
import { makeHass } from './helpers';

// What a new card starts with since 2.7 (Руди, 9 November): the warnings on top, which take no room until there is one; the photoreal pictures;
// the light weather effects over the overview; and the hours beside the days when the provider has them. Only a new card, from the picker:
// a configuration that exists keeps what it had, since the defaults of the card itself do not change.

type CardClass = { getStubConfig: (hass?: unknown) => Record<string, unknown> };
const Card = customElements.get('platinum-weather-card-plus-charts') as unknown as CardClass;
type Suggestion = { label?: string; config: Record<string, unknown> };
const suggest = (hass: unknown, id: string) =>
  ((window as unknown as { customCards: { type: string; getEntitySuggestion: (h: unknown, e: string) => Suggestion | Suggestion[] | null }[] }).customCards
    .find((c) => c.type === 'platinum-weather-card-plus-charts')!).getEntitySuggestion(hass, id);
// supported_features of a weather entity: 1 daily, 2 hourly
const hass = (features: number) => makeHass({ 'weather.home': { state: 'sunny', attributes: { supported_features: features } }, 'sun.sun': { state: 'above_horizon' } });

describe('a new card from the picker', () => {
  it('has the warnings on top, the photoreal pictures and the light effects', () => {
    const c = Card.getStubConfig(hass(1));
    expect((c.section_order as string[])[0]).toBe('warnings');
    expect(c.section_order).toEqual(['warnings', 'overview', 'slots', 'daily_forecast', 'charts']);
    expect(c.icon_pack).toBe('photoreal');
    expect(c.option_effects).toBe('subtle');
    expect(c.option_effects_area ?? 'overview').toBe('overview');
  });
  it('and the hours beside the days when the provider has them, from the same entity', () => {
    const c = Card.getStubConfig(hass(3));
    expect(c.show_section_hourly_forecast).toBe(true);
    expect(c.entity_hourly).toBe('weather.home');
  });
  it('but not when it has none', () => {
    const c = Card.getStubConfig(hass(1));
    expect(c.show_section_hourly_forecast).toBeUndefined();
    expect(c.entity_hourly).toBeUndefined();
  });
});

describe('the suggestions by entity', () => {
  it('keep their two, the days alone and the days with the hours, both with what 2.7 starts with', () => {
    const s = suggest(hass(3), 'weather.home') as Suggestion[];
    expect(s.map((x) => x.label)).toEqual(['Daily forecast and charts', 'Daily and hourly forecast']);
    expect(s[0].config.show_section_hourly_forecast).toBeUndefined();
    expect(s[1].config.show_section_hourly_forecast).toBe(true);
    for (const x of s) {
      expect(x.config.icon_pack).toBe('photoreal');
      expect(x.config.option_effects).toBe('subtle');
      expect((x.config.section_order as string[])[0]).toBe('warnings');
    }
  });
});

describe('a configuration that exists', () => {
  it('keeps the default pack and no effects, as before', async () => {
    const el = document.createElement('platinum-weather-card-plus-charts') as HTMLElement & { setConfig: (c: unknown) => void; hass: unknown; updateComplete: Promise<unknown>; _config: Record<string, unknown> };
    el.setConfig({ type: 'custom:platinum-weather-card-plus-charts', weather_entity: 'weather.home', card_config_version: 8 });
    el.hass = hass(1); document.body.appendChild(el); await el.updateComplete;
    expect(el._config.icon_pack ?? 'default').toBe('default');
    expect(el._config.option_effects ?? 'off').toBe('off');
    expect(el.shadowRoot!.querySelector('.big-icon img')?.getAttribute('data-icon') ?? '').toMatch(/\/a-[a-z0-9-]+\.svg$/);
  });
});
