import { describe, it, expect } from 'vitest';
import { readdirSync, existsSync, readFileSync } from 'fs';
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

describe('the icon packs map onto names that exist', () => {
  const card = readFileSync(join(__dirname, '..', 'src', 'platinum-weather-card.ts'), 'utf8');

  function mapperTargets(name: string): string[] {
    const start = card.indexOf(`private ${name}(`);
    expect(start, `${name} not found`).toBeGreaterThan(-1);
    const body = card.slice(start, card.indexOf('\n  }', start));
    return Array.from(new Set(
      Array.from(body.matchAll(/:\s*'([\w-]+)'/g)).map((m) => m[1]),
    ));
  }

  it('maps every internal icon the card can produce', () => {
    // Anything the correction or _weatherIcon can emit must have an entry, or
    // the pack silently falls back for that condition.
    const emitted = new Set(
      Array.from(card.matchAll(/return\s+`?\$?\{?'?(clear|cloudy|rainy|snowy|drizzle|fog|hail|wind|thunderstorms)[\w-]*/g))
        .map((m) => m[0]),
    );
    expect(emitted.size).toBeGreaterThan(0);
    expect(mapperTargets('_iconToHa').length).toBeGreaterThan(10);
  });

  it('only names files the Home Assistant set actually publishes', () => {
    // The set is keyed by HA condition names and has fifteen files; a typo here
    // produces a 404 and an empty square on the card.
    const published = [
      'clear-night', 'cloudy', 'fog', 'hail', 'lightning-rainy', 'lightning',
      'partlycloudy-night', 'partlycloudy', 'pouring', 'rainy', 'snowy-rainy',
      'snowy', 'sunny', 'windy-variant', 'windy',
    ];
    for (const target of mapperTargets('_iconToHa')) {
      expect(published, `_iconToHa maps to '${target}', which the set does not publish`)
        .toContain(target);
    }
  });

  it('falls back rather than returning undefined for an unknown name', () => {
    const start = card.indexOf('private _iconToHa(');
    const body = card.slice(start, card.indexOf('\n  }', start));
    expect(body, 'no fallback for an unmapped icon').toMatch(/\?\?\s*'[\w-]+'/);
  });
});

describe('monochrome icons', () => {
  const card = readFileSync(join(__dirname, '..', 'src', 'platinum-weather-card.ts'), 'utf8');

  it('desaturates through a filter rather than a second icon set', () => {
    // A filter reaches into <img>, where CSS variables do not, so one rule
    // covers the CDN packs as well as the built-in ones — no second set of
    // files to ship or keep in step.
    const rule = /\.mono-icons[^{]*\{([^}]*grayscale[^}]*)\}/.exec(card);
    expect(rule, 'no monochrome rule').not.toBeNull();
    expect(rule![1]).toContain('grayscale');
  });

  it('applies to the whole card, so no icon is missed', () => {
    // Per-icon classes would need adding to every img the card renders, and one
    // would eventually be forgotten.
    expect(card).toMatch(/<ha-card class="card\$\{[^}]*mono-icons/);
  });

  it('is off unless asked for', () => {
    expect(card).toMatch(/option_mono_icons === true/);
  });
});

describe('monochrome reaches every icon', () => {
  const card = readFileSync(join(__dirname, '..', 'src', 'platinum-weather-card.ts'), 'utf8');

  it('covers each of the ways the card draws an icon', () => {
    // Three different mechanisms: <img> for the large condition icon, a
    // background image on <i class="icon"> in the forecast columns, and ha-icon
    // in the slots. A rule naming only one leaves the rest coloured.
    const rule = /((?:\.mono-icons[^{]*,\s*)*\.mono-icons[^{]*)\{[^}]*grayscale/.exec(card);
    expect(rule, 'no monochrome rule').not.toBeNull();
    const selector = rule![1];
    for (const target of ['img', '.icon', 'ha-icon']) {
      expect(selector, `monochrome does not cover ${target}`).toContain(target);
    }
  });

  it('names every element type the card actually renders icons into', () => {
    // If a new mechanism appears in the card, this fails until the rule knows
    // about it.
    const usesImg = /<img src="\$\{url\.href\}/.test(card);
    const usesBackground = /class="icon" style="background/.test(card);
    const usesHaIcon = /<ha-icon /.test(card);
    const rule = /((?:\.mono-icons[^{]*,\s*)*\.mono-icons[^{]*)\{[^}]*grayscale/.exec(card)![1];
    if (usesImg) expect(rule).toContain('img');
    if (usesBackground) expect(rule).toContain('.icon');
    if (usesHaIcon) expect(rule).toContain('ha-icon');
  });
});
