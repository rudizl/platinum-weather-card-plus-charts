import { describe, it, expect, beforeEach } from 'vitest';
import '../src/platinum-weather-card';
import { makeHass, baseConfig, renderCard, forgetSharedState } from './helpers';
import { clearSkyIrradiance } from '../src/zambretti';

// The photoreal pack tells the levels apart, which the custom pack cannot: the same sensors as in icon-sensor-levels.test.ts, and a picture of its own for each.
// The levels that the sensors give: the cloud cover from the pyranometer (four bands), and the rain from the gauge (three).
// Seen on 26 October: the overcast band, 85% and over, drew a tornado with a pack that did not know its name, and the moderate
// rain, 2.5 to 10 mm/h, did the same. This goes through the real choice of the icon, with the sensors, and not through a list of names.

type Card = HTMLElement & { _getIconUrl: (n: string, f?: boolean) => string; _weatherIcon: (c: string) => string };
const ELEVATION = 35;

beforeEach(() => {
  // the card remembers the sky and the rain for minutes, in the class, and a test must not inherit what another saw
  forgetSharedState();
});

async function card(opts: { cloud?: number; rain?: number; pack?: Record<string, unknown> }) {
  const measured = clearSkyIrradiance(ELEVATION) * (1 - (opts.cloud ?? 0));
  const hass = makeHass({
    'weather.home': { state: 'cloudy' },
    'sun.sun': { state: 'above_horizon', attributes: { elevation: ELEVATION, azimuth: 150 } },
    'sensor.solar': { state: String(Math.round(measured)) },
    'sensor.rain_rate': { state: String(opts.rain ?? 0) },
  });
  return (await renderCard(baseConfig({
    entity_sun: 'sun.sun', entity_solar_radiation: 'sensor.solar', entity_rain_rate: 'sensor.rain_rate', option_cloud_overrides_icon: true,
    ...(opts.pack ?? { icon_pack: 'photoreal' }),
  } as never), hass)) as unknown as Card;
}
const picture = (el: Card) => el._getIconUrl(el._weatherIcon('cloudy')).split('/').pop()!.split('?')[0].replace(/\.(svg|png)$/, '');

describe('the cloud cover decides the icon, in four bands', () => {
  it.each([[0.10, 'p-clear-day'], [0.40, 'p-mostlysunny-day'], [0.70, 'p-brokenclouds-day'], [0.93, 'p-mostlycloudy-day']])(
    'a cloud cover of %s is %s in the photoreal pack', async (cloud, want) => {
      expect(picture(await card({ cloud }))).toBe(want);
    });
});

describe('and the provider is not the sensors: a partly cloudy that the provider reports is the sun with a cloud, whatever the measured sky', () => {
  it('with the sensors off, the provider\'s partly cloudy is the partly cloudy picture', async () => {
    const hass = makeHass({ 'weather.home': { state: 'partlycloudy' }, 'sun.sun': { state: 'above_horizon', attributes: { elevation: ELEVATION, azimuth: 150 } } });
    const el = (await renderCard(baseConfig({ weather_entity: 'weather.home', entity_sun: 'sun.sun', icon_pack: 'photoreal' } as never), hass)) as unknown as Card;
    expect(el._getIconUrl(el._weatherIcon('partlycloudy')).split('/').pop()!.split('?')[0]).toBe('p-partlycloudy-day.png');
  });
  it('the measured sky does not leak into the icons that come after it: a forecast beside the current conditions is the provider\'s', async () => {
    const el = await card({ cloud: 0.7 });
    expect(picture(el)).toBe('p-brokenclouds-day');
    expect(el._getIconUrl('cloudy-2-day', true).split('/').pop()!.split('?')[0]).toBe('p-partlycloudy-day.png');
    expect(el._getIconUrl('cloudy-2-day', true).split('/').pop()!.split('?')[0]).toBe('p-partlycloudy-day.png');
    expect(picture(el)).toBe('p-brokenclouds-day');
  });
  it('and when the sensors measure 55 to 85 per cent, the sky is the broken clouds, whatever the provider says', async () => {
    expect(picture(await card({ cloud: 0.62 }))).toBe('p-brokenclouds-day');
    expect(picture(await card({ cloud: 0.80 }))).toBe('p-brokenclouds-day');
  });
});

describe('the rain gauge decides the icon, in three levels', () => {
  it.each([[0.8, 'p-lightrain'], [5, 'p-rain'], [12, 'p-rain']])('%s mm/h is %s in the photoreal pack', async (rain, want) => {
    expect(picture(await card({ rain }))).toBe(want);
  });
});
