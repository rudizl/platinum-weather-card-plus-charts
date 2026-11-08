import { describe, it, expect } from 'vitest';
import '../src/platinum-weather-card';
import { makeHass, baseConfig, renderCard } from './helpers';

// The UV slot colours its number by the exposure bands of the WHO. It coloured its icon too, which no other slot does, and which made a green
// sun beside a UV of 0 at night (Руди, 8 November: it annoys him). The icon is the colour of the other icons now; the number keeps its colour.

async function slot(state: string) {
  const el = (await renderCard(baseConfig({ section_order: ['slots'], slot_l1: 'uv_index', entity_uv_index: 'sensor.uv' } as never),
    makeHass({ 'sensor.uv': { state } }))) as HTMLElement;
  const li = el.shadowRoot!.querySelector('[data-slot="uv_index"]')!;
  return { icon: li.querySelector('ha-icon')!.getAttribute('style') ?? '', value: (li.querySelector('.uv-index-text') as HTMLElement).getAttribute('style') ?? '' };
}

describe('the UV slot', () => {
  it('leaves its icon the colour of the other icons, whatever the UV', async () => {
    for (const uv of ['0', '4', '7', '9', '12']) expect((await slot(uv)).icon, uv).not.toMatch(/color/);
  });
  it('colours its number by the bands of the WHO', async () => {
    expect((await slot('0')).value).toMatch(/#4caf50/);
    expect((await slot('4')).value).toMatch(/#ffc107/);
    expect((await slot('7')).value).toMatch(/#ff9800/);
    expect((await slot('9')).value).toMatch(/#f44336/);
    expect((await slot('12')).value).toMatch(/#9c27b0/);
  });
  it('and a reading it cannot use is not coloured', async () => {
    expect((await slot('unavailable')).value).not.toMatch(/color/);
  });
});
