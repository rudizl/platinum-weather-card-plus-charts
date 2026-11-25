import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

// Home Assistant is taking the Material web components out of its frontend: the mwc- elements first, and in 2026.12 ha-list,
// ha-list-item, ha-check-list-item and ha-radio-list-item. A card that uses one shows nothing where it stood once HA no longer defines
// it, with no error. The back arrow of the editor was an mwc-icon-button; it is Home Assistant's ha-icon-button now, as the arrows of the
// rows. No element of either kind may come back, in markup or in CSS.

const files = (dir: string): string[] => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f);
  return statSync(p).isDirectory() ? files(p) : /\.(ts|js)$/.test(f) ? [p] : [];
});

describe('the elements Home Assistant is removing', () => {
  it('are used nowhere in src/', () => {
    const found: string[] = [];
    for (const f of files(join(__dirname, '..', 'src'))) {
      readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
        // a tag (<mwc-x, </ha-list) or a CSS selector (mwc-x {, .a ha-list-item)
        if (/<\/?(mwc-[a-z-]+|ha-list|ha-list-item|ha-check-list-item|ha-radio-list-item)\b|(^|[\s,>+~])(mwc-[a-z-]+|ha-list(-item)?|ha-(check|radio)-list-item)\s*[{,:.[]/.test(line)) {
          found.push(`${f.split('/src/')[1]}:${i + 1}: ${line.trim()}`);
        }
      });
    }
    expect(found).toEqual([]);
  });
});

describe('the back arrow of the editor', () => {
  it('is a ha-icon-button with the arrow and a name, and takes the editor back', async () => {
    await import('../src/editor');
    const { makeHass } = await import('./helpers');
    type Editor = HTMLElement & { setConfig: (c: unknown) => void; hass: unknown; updateComplete: Promise<unknown>; _subElementEditor?: string | null; requestUpdate: () => void };
    const el = document.createElement('platinum-weather-card-plus-charts-editor') as Editor;
    el.setConfig({ card_config_version: 8, weather_entity: 'weather.home', show_section_charts: true });
    el.hass = makeHass({ 'weather.home': { state: 'rainy' } });
    document.body.appendChild(el); await el.updateComplete;
    el._subElementEditor = 'section_charts'; el.requestUpdate(); await el.updateComplete;
    const btn = el.shadowRoot!.querySelector('.back-title ha-icon-button') as (HTMLElement & { path?: string; label?: string }) | null;
    expect(btn, 'the button').not.toBeNull();
    expect(btn!.path).toMatch(/^M20,11V13H8L13\.5,18\.5/); // mdiArrowLeft
    expect(btn!.label).toBeTruthy();
    btn!.click(); await el.updateComplete;
    expect(el._subElementEditor ?? null).toBeNull();
    el.remove();
  });
});
