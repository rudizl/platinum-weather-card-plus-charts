import { describe, it, expect, beforeEach } from 'vitest';
import '../src/platinum-weather-card';
import { makeHass, baseConfig, renderCard, forgetSharedState } from './helpers';

// The cloud cover entity is for the night, when a pyranometer has nothing to say (my review of 2.7): read whenever the pyranometer gave
// nothing, it changed the icon by day on a card with no pyranometer at all. A day with the provider's sunny and the entity's 95% drew an overcast
// day. It is read only when the sun is too low for a pyranometer: after dark, or under the cut-off of the morning or the evening.

async function icon(elevation: number, extra: Record<string, unknown> = {}, azimuth = 120) {
  const el = (await renderCard(baseConfig({ section_order: ['overview'], overview_layout: 'complete', entity_forecast_icon: 'sensor.c', entity_sun: 'sun.sun',
    option_cloud_overrides_icon: true, entity_cloud_cover: 'weather.met', ...extra } as never), makeHass({
      'sensor.c': { state: 'sunny' }, 'sun.sun': { state: elevation > 0 ? 'above_horizon' : 'below_horizon', attributes: { elevation, azimuth } },
      'weather.met': { state: 'cloudy', attributes: { cloud_coverage: 95 } } }))) as HTMLElement;
  return (el.shadowRoot!.querySelector('.big-icon img')!.getAttribute('data-icon') ?? '').split('/').pop();
}

describe('the cloud cover entity by day', () => {
  beforeEach(() => forgetSharedState());
  it('does not change the icon when the sun is high, with no pyranometer', async () => {
    expect(await icon(40)).toBe('a-clear-day.svg');
  });
  it('nor with a pyranometer that gives nothing for the moment', async () => {
    expect(await icon(40, { entity_solar_radiation: 'sensor.missing' })).toBe('a-clear-day.svg');
  });
  it('but does under the cut-off of the morning, where a pyranometer cannot help', async () => {
    expect(await icon(5)).toMatch(/cloudy-3/);
  });
  it('and at night, as before', async () => {
    expect(await icon(-20, {}, 300)).toMatch(/cloudy-3-night/);
  });
});
