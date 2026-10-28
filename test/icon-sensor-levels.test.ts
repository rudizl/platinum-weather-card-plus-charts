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

describe('no name the card can produce is a tornado, unless it is meant to be', () => {
  // the names that every condition of Home Assistant gives, by day and by night, and the ones the two sensors give
  it('is true of the table of picture names that the custom and wcc-2 packs use', async () => {
    const ON_PURPOSE = new Set(['unknown', 'dust', 'tropical-storm']);
    const names = new Set<string>(['cloudy']);
    for (const state of ['above_horizon', 'below_horizon']) {
      const hass = makeHass({ 'weather.home': { state: 'cloudy' }, 'sun.sun': { state, attributes: { elevation: state === 'above_horizon' ? 35 : -20, azimuth: 150 } } });
      const el = (await renderCard(baseConfig({ entity_sun: 'sun.sun' } as never), hass)) as unknown as Record<string, unknown> & Card;
      for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(el))) {
        if (/^icon[A-Z]/.test(key)) names.add(String(el[key]));
      }
    }
    for (const t of ['day', 'night']) for (const b of ['clear', 'cloudy-1', 'cloudy-2', 'cloudy-3', 'rainy-1', 'rainy-2', 'rainy-3']) names.add(`${b}-${t}`);
    expect(names.size).toBeGreaterThan(30);
    const el = (await card({})) as Card & { _iconToWcc: (n: string) => string };
    const tornado = [...names].filter((n) => el._iconToWcc(n) === 'exceptional' && !ON_PURPOSE.has(n));
    expect(tornado, 'names that are a tornado without meaning to be').toEqual([]);
  });
  it('and a name that is new takes the look of its family', async () => {
    const el = (await card({})) as Card & { _iconToWcc: (n: string) => string };
    for (const [n, want] of [['cloudy-4-day', 'cloudy'], ['rainy-9-night', 'rain'], ['snowy-7', 'snow'], ['clear-night', 'clear-night']] as const) expect(el._iconToWcc(n), n).toBe(want);
    expect(el._iconToWcc('tornado')).toBe('exceptional');
  });
  // A tornado is for a tornado: a name that the card does not know, or that a provider calls 'unknown', is the cloud that says nothing, and not the alarming picture.
  it('the tornado is for what is meant to be one, and not for a name that is not known', async () => {
    const el = (await card({})) as Card & { _iconToWcc: (n: string) => string };
    for (const n of ['exceptional', 'tornado', 'hurricane']) expect(el._iconToWcc(n), n).toBe('exceptional');
    for (const n of ['unknown', 'something-new', 'xyz', '', 'qwerty-day']) expect(el._iconToWcc(n), JSON.stringify(n)).toBe('cloudy');
  });
});
