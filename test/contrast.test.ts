import { describe, it, expect, beforeEach } from 'vitest';
import { readableOn, contrastRatio } from '../src/contrast';
import '../src/platinum-weather-card';
import '../src/editor';
import { makeHass } from './helpers';

// The text of „Опитай“ was the colour of the page: dark on the light blue of a dark theme, but nearly white on the blue of the light one
// (2.6:1). It is white or black now, whichever stands out more against --primary-color.

const STANDARD = {
  light: '#03a9f4',          // the default theme of Home Assistant, light
  dark: 'rgb(138, 180, 216)', // a dark theme with a light blue primary colour, as Rudi's
  deep: '#1565c0',           // a theme whose primary colour is dark
};

describe('the text on a coloured button', () => {
  it('is black on the light blue of the default theme, black on a light primary of a dark theme, white on a dark primary', () => {
    expect(readableOn(STANDARD.light)).toBe('#000000');
    expect(readableOn(STANDARD.dark)).toBe('#000000');
    expect(readableOn(STANDARD.deep)).toBe('#ffffff');
  });

  it('is always the one of the two with the higher contrast, and never below 4.5:1 on these', () => {
    for (const bg of Object.values(STANDARD)) {
      const chosen = readableOn(bg)!;
      const other = chosen === '#000000' ? '#ffffff' : '#000000';
      expect(contrastRatio(chosen, bg)).toBeGreaterThan(contrastRatio(other, bg));
      expect(contrastRatio(chosen, bg)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('reads #rgb, #rrggbb and rgb(); for what it cannot read it says null, and the theme decides', () => {
    expect(readableOn('#fff')).toBe('#000000');
    expect(readableOn(' rgb(0 0 0) ')).toBe('#ffffff');
    expect(readableOn('var(--x)')).toBeNull();
    expect(readableOn('')).toBeNull();
  });
});

describe('„Опитай“ in the editor', () => {
  beforeEach(() => { document.body.innerHTML = ''; });
  type Editor = HTMLElement & { setConfig: (c: unknown) => void; hass: unknown; updateComplete: Promise<unknown> };
  async function primary(colour: string) {
    const el = document.createElement('platinum-weather-card-plus-charts-editor') as Editor;
    el.style.setProperty('--primary-color', colour);
    el.setConfig({ card_config_version: 8, weather_entity: 'weather.home' });
    el.hass = { ...(makeHass({ 'weather.home': { state: 'cloudy' } }) as object), language: 'en' };
    document.body.appendChild(el);
    await el.updateComplete;
    return (el.shadowRoot!.querySelector('.whats-new-primary') as HTMLElement).style.color;
  }
  it('takes white or black from the primary colour of the theme', async () => {
    expect(await primary(STANDARD.light)).toBe('rgb(0, 0, 0)');
    expect(await primary(STANDARD.deep)).toBe('rgb(255, 255, 255)');
  });
});
