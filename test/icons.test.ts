import { describe, it, expect } from 'vitest';
import { readdirSync, existsSync } from 'fs';
import { join } from 'path';
import '../src/platinum-weather-card';
import { makeHass, baseConfig, renderCard } from './helpers';

// Icons are the one part of the card a user notices instantly when it is wrong:
// a moon at midday, or a missing file leaving an empty square.

const DIST = join(__dirname, '..', 'dist');
const cardSource = join(__dirname, '..', 'src', 'platinum-weather-card.ts');

async function cardWithCondition(
  condition: string,
  elevation = 35,
  extra: Record<string, unknown> = {},
) {
  return (await renderCard(
    baseConfig({
      section_order: ['overview'],
      overview_layout: 'complete',
      entity_temperature: 'sensor.temp',
      entity_forecast_icon: 'sensor.condition',
      entity_sun: 'sun.sun',
      ...extra,
    } as never),
    makeHass({
      'sensor.temp': { state: '21', attributes: { unit_of_measurement: '°C' } },
      'sensor.condition': { state: condition },
      'sun.sun': {
        state: elevation > 0 ? 'above_horizon' : 'below_horizon',
        attributes: { elevation },
      },
    }),
  )) as HTMLElement;
}

function iconSrc(el: HTMLElement): string {
  const img = el.shadowRoot?.querySelector('.icon, img, .conditions');
  return (
    img?.getAttribute('src') ??
    (img as HTMLElement | null)?.style?.backgroundImage ??
    el.shadowRoot?.innerHTML.match(/[\w-]+\.svg/)?.[0] ??
    ''
  );
}

describe('day and night variants', () => {
  it('picks a day icon while the sun is up', async () => {
    const el = await cardWithCondition('sunny', 35);
    expect(iconSrc(el)).toMatch(/day|clear/);
    expect(iconSrc(el)).not.toMatch(/night/);
  });

  it('picks a night icon after sunset', async () => {
    const el = await cardWithCondition('sunny', -10);
    expect(iconSrc(el)).toMatch(/night/);
  });

  it('lets the sun override a provider claiming night in daylight', async () => {
    // Weather Underground switches to its night daypart in mid-afternoon and
    // reports clear-night with the sun well up.
    const el = await cardWithCondition('clear-night', 35);
    expect(iconSrc(el), 'a moon while the sun is 35° up').not.toMatch(/night/);
  });

  it('overrides in the other direction too', async () => {
    const el = await cardWithCondition('clear-day', -20);
    expect(iconSrc(el)).toMatch(/night/);
  });

  it('respects the provider when the override is switched off', async () => {
    const el = await cardWithCondition('clear-night', 35, { option_sun_overrides_icon: false });
    expect(iconSrc(el)).toMatch(/night/);
  });

  it('leaves the provider alone when no sun entity is configured', async () => {
    const el = (await renderCard(
      baseConfig({
        section_order: ['overview'],
        overview_layout: 'complete',
        entity_temperature: 'sensor.temp',
        entity_forecast_icon: 'sensor.condition',
      } as never),
      makeHass({
        'sensor.temp': { state: '21' },
        'sensor.condition': { state: 'clear-night' },
      }),
    )) as HTMLElement;
    expect(iconSrc(el)).toMatch(/night/);
  });
});

describe('every condition resolves to an icon', () => {
  // The set Home Assistant's weather platform can report.
  const conditions = [
    'clear-night', 'cloudy', 'exceptional', 'fog', 'hail', 'lightning',
    'lightning-rainy', 'partlycloudy', 'pouring', 'rainy', 'snowy',
    'snowy-rainy', 'sunny', 'windy', 'windy-variant',
  ];

  for (const condition of conditions) {
    it(`${condition} has an icon`, async () => {
      const el = await cardWithCondition(condition);
      const src = iconSrc(el);
      expect(src, `${condition} resolved to nothing`).not.toBe('');
    });
  }

  it('does not throw on a condition it has never heard of', async () => {
    await expect(cardWithCondition('meteor-shower')).resolves.toBeTruthy();
  });
});

describe('the icon files exist', () => {
  it('ships every icon the card can ask for', () => {
    if (!existsSync(DIST)) return; // nothing built yet
    const shipped = new Set(readdirSync(DIST).filter((f) => f.endsWith('.svg')));
    expect(shipped.size, 'no icons in dist').toBeGreaterThan(50);

    // Both variants must exist for anything with a day/night form: a missing
    // night file leaves an empty square after sunset.
    const missing: string[] = [];
    for (const name of shipped) {
      if (name.includes('-day.svg')) {
        const night = name.replace('-day.svg', '-night.svg');
        if (!shipped.has(night)) missing.push(night);
      }
    }
    expect(missing, 'day icons without a night counterpart').toEqual([]);
  });

  it('ships both icon sets', () => {
    if (!existsSync(DIST)) return;
    const files = readdirSync(DIST).filter((f) => f.endsWith('.svg'));
    // 'a-' animated and 's-' static
    expect(files.some((f) => f.startsWith('a-')), 'no animated icons').toBe(true);
    expect(files.some((f) => f.startsWith('s-')), 'no static icons').toBe(true);
  });
});

describe('static icons option', () => {
  it('switches to the static set when asked', async () => {
    const animated = await cardWithCondition('sunny', 35);
    const staticEl = await cardWithCondition('sunny', 35, { option_static_icons: true });
    expect(iconSrc(animated)).not.toBe(iconSrc(staticEl));
  });
});
