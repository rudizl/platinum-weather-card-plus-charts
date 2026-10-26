import { describe, it, expect, beforeEach } from 'vitest';
import '../src/platinum-weather-card';
import { makeHass, baseConfig, renderCard } from './helpers';
import { clearSkyIrradiance } from '../src/zambretti';

// The levels that the sensors give: the cloud cover from the pyranometer (four bands), and the rain from the gauge (three).
// Seen on 26 October: the overcast band, 85% and over, drew a tornado with a pack that did not know its name, and the moderate
// rain, 2.5 to 10 mm/h, did the same. This goes through the real choice of the icon, with the sensors, and not through a list of names.

type Card = HTMLElement & { _getIconUrl: (n: string, f?: boolean) => string; _weatherIcon: (c: string) => string };
const statics = () => customElements.get('platinum-weather-card-plus-charts') as unknown as Record<string, unknown>;
const ELEVATION = 35;

beforeEach(() => {
  // the card remembers the sky and the rain for minutes, in the class, and a test must not inherit what another saw
  Object.assign(statics(), { _cloudSamples: [], _cloudBand: null, _gaugeSeen: null, _gaugeRain: null, _lastRain: null, _lastDaylightCloud: null });
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
    ...(opts.pack ?? { icon_pack: 'custom', icon_pack_path: '/pack/{condition}.svg' }),
  } as never), hass)) as unknown as Card;
}
const picture = (el: Card) => el._getIconUrl(el._weatherIcon('cloudy')).split('/').pop()!.split('?')[0].replace(/\.(svg|png)$/, '');

describe('the cloud cover decides the icon, in four bands', () => {
  it.each([[0.10, 'clear-day'], [0.40, 'partlycloudy-day'], [0.70, 'partlycloudy-day'], [0.93, 'cloudy']])(
    'a cloud cover of %s is %s in a custom pack, and never the tornado', async (cloud, want) => {
      expect(picture(await card({ cloud }))).toBe(want);
    });
});

describe('the rain gauge decides the icon, in three levels', () => {
  it.each([[0.8], [5], [12]])('%s mm/h is a rain in a custom pack, and not the tornado', async (rain) => {
    expect(picture(await card({ rain }))).toBe('rain');
  });
});
