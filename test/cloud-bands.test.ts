import { describe, it, expect, beforeEach } from 'vitest';
import '../src/platinum-weather-card';
import { clearSkyIrradiance } from '../src/zambretti';
import { makeHass, baseConfig, renderCard, forgetSharedState } from './helpers';

// The bands of the measured sky, asked of the card (the older tests of the bands copy the formula into the test, and so cannot see the card's own edges).
// The card reads a cloud cover as 1 - (measured radiation / what a clear sky gives), and that is not the cover of the sky: a thick overcast lets through
// 10 to 25 per cent of a clear sky's light, so a sky that is wholly covered measures as 75 to 90 per cent. With the edges at 55 and 85, a sky of 84 per
// cent (44 W/m2 with the sun 23 degrees up, one morning in November) drew the sun with two thin streaks of cloud. The edges are 25, 50 and 75 per cent now.
beforeEach(() => forgetSharedState());

const ELEVATION = 30;
const CLEAR = clearSkyIrradiance(ELEVATION, 0);

async function iconAt(cloud: number, elevation = ELEVATION, solar?: number) {
  const states = {
    'sensor.temp': { state: '8', attributes: { unit_of_measurement: '\u00b0C' } },
    'sensor.condition': { state: 'sunny' },
    'sun.sun': { state: 'above_horizon', attributes: { elevation, azimuth: 100 } },
    'sensor.solar': { state: String(solar ?? (1 - cloud) * clearSkyIrradiance(elevation, 0)) },
  };
  const config = baseConfig({ section_order: ['overview'], overview_layout: 'complete', entity_temperature: 'sensor.temp', entity_forecast_icon: 'sensor.condition',
    entity_sun: 'sun.sun', entity_solar_radiation: 'sensor.solar', option_cloud_overrides_icon: true, icon_pack: 'default' } as never);
  const el = (await renderCard(config, makeHass(states))) as HTMLElement;
  const m = (el.shadowRoot?.innerHTML ?? '').match(/a-(clear|cloudy-[123])-day\.svg/);
  return m ? m[1] : null;
}

describe('the bands of the measured sky, in the card', () => {
  it.each([
    [0.0, 'clear'], [0.1, 'clear'], [0.24, 'clear'],
    [0.26, 'cloudy-1'], [0.35, 'cloudy-1'], [0.49, 'cloudy-1'],
    [0.51, 'cloudy-2'], [0.6, 'cloudy-2'], [0.74, 'cloudy-2'],
    [0.76, 'cloudy-3'], [0.84, 'cloudy-3'], [1.0, 'cloudy-3'],
  ])('a cover of %s is the band %s', async (cloud, band) => {
    expect(await iconAt(cloud)).toBe(band);
  });

  it('the reading that was wrong: 44 W/m2 with the sun 23 degrees up is a covered sky, not broken clouds', async () => {
    // the card's clear sky at 23 degrees is about 268 W/m2, so 44 is 16 per cent of it: a cover of 84 per cent
    expect(await iconAt(0, 22.8, 44)).toBe('cloudy-3');
  });

  it('the edges are where they are said to be: a sky of 52 per cent, which was lightly cloudy, is broken now, and one of 80, which was broken, is heavy', async () => {
    expect(await iconAt(0.52)).toBe('cloudy-2');
    forgetSharedState();       // the card takes the median of the readings of five minutes, shared by the cards of a sensor: one reading at a time
    expect(await iconAt(0.8)).toBe('cloudy-3');
  });
});

describe('a value that sits on an edge does not flip the icon', () => {
  // The band that the card is in is kept while the reading stays within 5 points of the edge it crossed. The band is remembered per sensor and shared
  // by the cards of a page, so it is set here before the card is drawn (the card takes the median of five minutes of readings, which would blur a test
  // that fed it readings one after the other).
  const bandMemory = () => (customElements.get('platinum-weather-card-plus-charts') as unknown as { _cloudBand: Map<string, number> })._cloudBand;
  it.each([
    [2, 0.77, 'cloudy-2'],     // in the broken band, 2 points over the new edge of 75: stays
    [2, 0.82, 'cloudy-3'],     // 7 points over it: goes
    [3, 0.72, 'cloudy-3'],     // in the heavy band, 3 points under it: stays
    [3, 0.68, 'cloudy-2'],     // 7 points under it: goes
    [1, 0.52, 'cloudy-1'],     // in the lightly cloudy band, 2 points over the new edge of 50: stays
    [1, 0.58, 'cloudy-2'],     // 8 points over it: goes
  ])('in the band %s, a cover of %s shows %s', async (from, cloud, shown) => {
    bandMemory().set('sensor.solar', from);
    expect(await iconAt(cloud)).toBe(shown);
  });
});
