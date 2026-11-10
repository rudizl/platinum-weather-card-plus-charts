// Находка 6: icon_pack_path към файл в папката на картата с име a-/s-/p-.
import { describe, it, expect } from 'vitest';
import { Any, clean, makeHass, baseConfig, renderCard } from './_util';
import { BLANK } from '../../src/icon-packs';
clean();

describe('6. a custom pack whose files lie beside the card', () => {
  it('is shown from its address, not looked for in a built-in pack and left blank', async () => {
    const Card = customElements.get('platinum-weather-card-plus-charts') as Any;
    const base = Card.prototype._iconBaseUrl.call({}) as string;
    const el = (await renderCard(baseConfig({ entity_forecast_icon: 'sensor.c', icon_pack: 'custom', icon_pack_path: `${base}p-{condition}.png` } as never),
      makeHass({ 'sensor.c': { state: 'sunny' }, 'sun.sun': { state: 'above_horizon' } }))) as Any;
    await new Promise((r) => setTimeout(r, 5)); await el.updateComplete;
    const img = el.shadowRoot.querySelector('.overview-section img');
    expect(img.getAttribute('data-icon')).toBe(`${base}p-clear-day.png`);
    expect(img.getAttribute('src')).not.toBe(BLANK);
    expect(img.getAttribute('src')).toBe(`${base}p-clear-day.png`);
  });
});
