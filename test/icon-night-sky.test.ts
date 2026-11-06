import { describe, it, expect, beforeEach } from 'vitest';
import '../src/platinum-weather-card';
import { makeHass, baseConfig, renderCard, forgetSharedState } from './helpers';

// At night the three things that show the sky read it from different places: the cloud slot and Sager from the cloud cover entity
// (entity_cloud_cover, "used at night when the pyranometer cannot help"), the icon from the provider alone, since the correction of
// the icon read only the pyranometer. On 6 November 2026 at 20:14 a card showed a partly cloudy night (the provider, a station of
// Weather Underground, which measures no cloud) beside a cloud cover of 1% and "the sky is clear" (met.no, 0.8%). With the correction
// on and a cloud cover entity named, the icon at night reads what the slot reads; a forecast of cloud does not overrule a claim of
// rain, snow or a storm, and nothing is guessed from other entities.

type Card = HTMLElement & { updateComplete: Promise<unknown> };
interface Scene { condition?: string; cover?: number | null; elevation?: number; solar?: string; rain?: string; config?: Record<string, unknown> }
async function mount(s: Scene = {}): Promise<Card> {
  const states: Record<string, { state: string; attributes?: Record<string, unknown> }> = {
    'sensor.condition': { state: s.condition ?? 'partlycloudy' },
    'sun.sun': { state: (s.elevation ?? -36) > 0 ? 'above_horizon' : 'below_horizon', attributes: { elevation: s.elevation ?? -36, azimuth: 280 } },
    'sensor.solar': { state: s.solar ?? '0' },
    'sensor.rain': { state: s.rain ?? '0.0' },
    'weather.met': { state: 'clear-night', attributes: s.cover === null ? {} : { cloud_coverage: s.cover ?? 0.8 } },
  };
  const config = baseConfig({
    section_order: ['overview'], overview_layout: 'complete', entity_forecast_icon: 'sensor.condition', entity_sun: 'sun.sun',
    entity_solar_radiation: 'sensor.solar', entity_rain_rate: 'sensor.rain', option_cloud_overrides_icon: true, entity_cloud_cover: 'weather.met', ...s.config,
  } as never);
  return (await renderCard(config, makeHass(states))) as Card;
}
const icon = (el: HTMLElement) => (el.shadowRoot?.querySelector('.big-icon img')?.getAttribute('data-icon') ?? '').split('/').pop();

describe('the icon at night, with the cloud cover entity', () => {
  beforeEach(() => forgetSharedState());
  it('a clear sky by the cloud cover entity is a clear night, whatever the provider says of a plain sky', async () => {
    expect(icon(await mount())).toBe('a-clear-night.svg');
  });
  it('a covered sky is a covered night, in the bands the day uses', async () => {
    expect(icon(await mount({ condition: 'sunny', cover: 40 }))).toBe('a-cloudy-1-night.svg');
    forgetSharedState();
    expect(icon(await mount({ condition: 'sunny', cover: 60 }))).toBe('a-cloudy-2-night.svg');
    forgetSharedState();
    expect(icon(await mount({ condition: 'sunny', cover: 95 }))).toBe('a-cloudy-3-night.svg');
  });
  it('and it is the sky that the cloud slot shows', async () => {
    const el = await mount({ config: { section_order: ['overview', 'slots'], slot_l1: 'cloud_cover' } });
    expect(icon(el)).toBe('a-clear-night.svg');
    expect(el.shadowRoot?.querySelector('[data-slot="cloud_cover"] .cloud-cover-text')?.textContent?.trim()).toBe('1%');
  });
});

describe('the photoreal pack at night', () => {
  beforeEach(() => forgetSharedState());
  it('a sky of 60% from the cloud cover entity is the partly cloudy picture: the broken clouds are for a sky the pyranometer measured', async () => {
    expect(icon(await mount({ condition: 'sunny', cover: 60, config: { icon_pack: 'photoreal' } }))).toBe('p-partlycloudy-night.webp');
  });
});

describe('what it leaves as it was', () => {
  beforeEach(() => forgetSharedState());
  it('with the correction off, the provider', async () => {
    expect(icon(await mount({ config: { option_cloud_overrides_icon: false } }))).toBe('a-cloudy-2-night.svg');
  });
  it('with no cloud cover entity named, the provider: nothing is guessed from the other entities', async () => {
    expect(icon(await mount({ config: { entity_cloud_cover: undefined, entity_hourly: 'weather.met' } }))).toBe('a-cloudy-2-night.svg');
  });
  it('with an entity that gives no number, the provider', async () => {
    expect(icon(await mount({ cover: null }))).toBe('a-cloudy-2-night.svg');
  });
  it('a claim of a storm, of snow or of rain that the gauge does not deny: the provider knows something a forecast of cloud does not', async () => {
    expect(icon(await mount({ condition: 'lightning-rainy' }))).toMatch(/thunder|lightning|storm/);
    forgetSharedState();
    expect(icon(await mount({ condition: 'snowy' }))).toMatch(/snow/);
    forgetSharedState();
    expect(icon(await mount({ condition: 'rainy', rain: '2.0' }))).toMatch(/rain/);
  });
  it('by day the pyranometer, as before, and not the cloud cover entity', async () => {
    // the sun high and the pyranometer near its clear-sky value: a clear day, though the entity says 95%
    const el = await mount({ elevation: 40, solar: '700', cover: 95, condition: 'cloudy' });
    expect(icon(el)).toBe('a-clear-day.svg');
  });
});
