import { describe, it, expect } from 'vitest';
import '../src/platinum-weather-card';
import { makeHass, baseConfig, renderCard } from './helpers';

// #37: with a Meteocons pack the big icon looked small and low beside the temperature. The Meteocons icons (CDN, Bas Milius) are drawn in a 64 by 64 frame, and the drawing of the usual ones
// (a cloud, rain, snow, wind) lies between 17 and 47 of it: a quarter of the frame is empty above and as much below. The big icon of the Meteocons packs, and of them only, is enlarged and moved up,
// by as much as makes the top of a cloud level with the top of the digits of the temperature (measured: the line pack by 17 px, the fill pack, whose drawing sits lower, by 20 px).

async function bigIcon(pack: string | undefined, layout: string) {
  const hass = makeHass({ 'weather.w': { state: 'cloudy', attributes: { temperature: 9 } }, 'sensor.t': { state: '9', attributes: { unit_of_measurement: '\u00b0C' } } });
  const el = (await renderCard(baseConfig({ weather_entity: 'weather.w', entity_forecast_icon: 'weather.w', entity_temperature: 'sensor.t', section_order: ['overview'], overview_layout: layout,
    ...(pack ? { icon_pack: pack, ...(pack === 'custom' ? { icon_pack_path: '/local/icons/{condition}.svg' } : {}) } : {}) } as never), hass)) as HTMLElement;
  return el.shadowRoot?.querySelector('.big-icon') as HTMLElement | null;
}
// the styles of the card are a getter of the card itself, so that they are read from a card that is drawn
async function styles() {
  const hass = makeHass({ 'weather.w': { state: 'cloudy', attributes: { temperature: 9 } } });
  const el = (await renderCard(baseConfig({ weather_entity: 'weather.w', section_order: ['overview'] } as never), hass)) as unknown as { styles: { cssText: string } };
  return String(el.styles.cssText);
}

describe('the big icon of a Meteocons pack', () => {
  it.each(['meteocons-line', 'meteocons-fill'])('%s: it has the class that enlarges it, in the two layouts that draw it', async (pack) => {
    for (const layout of ['complete', 'forecast']) {
      const b = await bigIcon(pack, layout);
      expect(b, `${pack} in ${layout}`).not.toBeNull();
      expect(b!.classList.contains('meteocons'), `${pack} in ${layout}`).toBe(true);
    }
  });
  it('no other pack has it: the default one, which is cut tight, and a custom one', async () => {
    for (const pack of [undefined, 'default', 'custom']) {
      for (const layout of ['complete', 'forecast']) {
        const b = await bigIcon(pack, layout);
        expect(b, `${pack} in ${layout}`).not.toBeNull();
        expect(b!.classList.contains('meteocons'), `${pack} in ${layout}`).toBe(false);
      }
    }
  });
  it('each Meteocons pack has a class of its own, which the other has not', async () => {
    for (const layout of ['complete', 'forecast']) {
      const line = await bigIcon('meteocons-line', layout);
      expect(line!.classList.contains('meteocons-line'), `line in ${layout}`).toBe(true);
      expect(line!.classList.contains('meteocons-fill'), `line in ${layout}`).toBe(false);
      const fill = await bigIcon('meteocons-fill', layout);
      expect(fill!.classList.contains('meteocons-fill'), `fill in ${layout}`).toBe(true);
      expect(fill!.classList.contains('meteocons-line'), `fill in ${layout}`).toBe(false);
    }
  });
  it('the icon is enlarged by 1.3 and moved up by a formula of where its drawing starts', async () => {
    const css = (await styles()).replace(/\s+/g, ' ');
    // translateY = 24.4 px - 2.4375 px x top: the top of the drawing, in the 64 frame, is put level with the top of the digits of the temperature
    expect(css).toMatch(/\.big-icon\.meteocons-line img, \.big-icon\.meteocons-fill img \{ transform: scale\(1\.3\) translateY\(calc\(24\.4px - 2\.4375px \* var\(--pwcc-meteocons-top\)\)\); \}/);
    // nothing of it for the picture of any other big icon
    expect(css.match(/\.big-icon img \{[^}]*\}/g)?.every((r) => !r.includes('scale'))).toBe(true);
  });
  // Where the drawing of each Meteocons icon starts in its 64 by 64 frame, measured on the icons (both styles): the card puts it level with the digits of the temperature,
  // whatever the icon is (a cloud starts at about 17, a sun at 8).
  const STILL_TOP: Record<'line' | 'fill', Record<string, number>> = {
    line: { wind: 16.9, 'dust-wind': 16.9, cloudy: 17, drizzle: 17, hail: 17, sleet: 17, snow: 17, rain: 17, thunderstorms: 17, 'thunderstorms-rain': 17, fog: 17, haze: 17, tornado: 18.5 },
    fill: { wind: 16.9, 'dust-wind': 16.9, cloudy: 18.2, drizzle: 18.2, hail: 18.2, sleet: 18.2, snow: 18.2, rain: 18.2, thunderstorms: 18.2, 'thunderstorms-rain': 18.2, fog: 18.2, haze: 18.2, tornado: 18.5 },
  };
  // The sun, the moon and the partly cloudy icons are animated (rays that turn, a sun that moves), so the top that the card needs is the one seen in a browser (the mean of frames over
  // eight seconds, measured against the digits of the temperature), and not that of the still drawing (8 for the sun, 11.5 for the partly cloudy one, 12.5 and 14 by night).
  const SEEN_TOP: Record<'line' | 'fill', Record<string, number>> = {
    line: { 'clear-day': 10.1, 'overcast-day': 12.8, 'partly-cloudy-day': 12.8, 'overcast-night': 13.4, 'partly-cloudy-night': 13.4, 'clear-night': 14.5 },
    fill: { 'clear-day': 10.1, 'overcast-day': 12.8, 'partly-cloudy-day': 12.8, 'overcast-night': 14, 'partly-cloudy-night': 14, 'clear-night': 15.5 },
  };
  // the value of --pwcc-meteocons-top that the styles give to the picture of a pack and a name: the rule of the pack, then the first rule of a name that the file has
  function resolvedTop(css: string, pack: 'line' | 'fill', name: string): number | null {
    let value: number | null = null;
    const re = /([^{}]+)\{\s*--pwcc-meteocons-top:\s*([0-9.]+);\s*\}/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(css))) {
      for (const sel of m[1].split(',').map((x) => x.trim())) {
        if (!sel.startsWith(`.big-icon.meteocons-${pack} img`)) continue;
        const attr = sel.match(/\[src\*="\/([a-z-]+)"\]/);
        if (!attr) { if (value === null) value = Number(m[2]); }                       // the rule of the pack
        else if (name === attr[1] || name.startsWith(attr[1] + '.')) value = Number(m[2]);   // a rule of a name, which comes after it
      }
    }
    return value;
  }
  it.each(['line', 'fill'] as const)('the %s pack: the icons that do not move are given the top of their drawing, within 1.6 of the 64 frame (4 px)', async (pack) => {
    const css = (await styles()).replace(/\s+/g, ' ').replace(/\} /g, '}\n');
    for (const [name, top] of Object.entries(STILL_TOP[pack])) {
      const got = resolvedTop(css, pack, name);
      expect(got, `${pack} ${name}`).not.toBeNull();
      expect(Math.abs((got as number) - top), `${pack} ${name}: the card says ${got}, measured ${top}`).toBeLessThanOrEqual(1.6);
    }
  });
  it.each(['line', 'fill'] as const)('the %s pack: the animated icons are given the top that is seen in a browser, a sun not that of a cloud', async (pack) => {
    const css = (await styles()).replace(/\s+/g, ' ').replace(/\} /g, '}\n');
    for (const [name, top] of Object.entries(SEEN_TOP[pack])) expect(resolvedTop(css, pack, name), `${pack} ${name}`).toBeCloseTo(top, 5);
    expect(resolvedTop(css, pack, 'clear-day')).toBeLessThan((resolvedTop(css, pack, 'cloudy') as number) - 5);
  });
});
