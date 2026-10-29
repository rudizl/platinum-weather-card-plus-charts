import { describe, it, expect } from 'vitest';
import '../src/platinum-weather-card';
import { makeHass, baseConfig, renderCard } from './helpers';

// #37: with a Meteocons pack the big icon looked small and low beside the temperature. The Meteocons icons (CDN, Bas Milius) are drawn in a 64 by 64 frame, and the drawing of the usual ones
// (a cloud, rain, snow, wind) lies between 17 and 47 of it: a quarter of the frame is empty above and as much below. The big icon of the Meteocons packs, and of them only, is enlarged and moved up.

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
  it('the icon is enlarged by 1.3 and moved up by 10 px, and only under that class', async () => {
    const css = (await styles()).replace(/\s+/g, ' ');
    expect(css).toMatch(/\.big-icon\.meteocons img \{ transform: scale\(1\.3\) translateY\(-10px\); \}/);
    // nothing of it for the picture of any other big icon
    expect(css.match(/\.big-icon img \{[^}]*\}/g)?.every((r) => !r.includes('scale'))).toBe(true);
  });
});
