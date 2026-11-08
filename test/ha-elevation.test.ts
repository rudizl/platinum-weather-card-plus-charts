import { describe, it, expect } from 'vitest';
import { render } from 'lit';
import '../src/platinum-weather-card';
import '../src/editor';
import { makeHass } from './helpers';
import { TRANSLATIONS } from '../src/translations';

// #46: the local forecast reads the pressure at sea level, and corrects an absolute barometer by the station altitude. Home Assistant knows
// the height of the home (Settings → System → General): the editor offers it beside an empty altitude, to be taken with one press, and never
// fills it in on its own, because a barometer that already gives the relative pressure would be corrected twice.

type Editor = HTMLElement & { setConfig: (c: unknown) => void; hass: unknown; updateComplete: Promise<unknown>; _topicLocalForecast: () => unknown };
async function page(config: Record<string, unknown> = {}, elevation?: number) {
  const el = document.createElement('platinum-weather-card-plus-charts-editor') as Editor;
  el.setConfig({ card_config_version: 8, weather_entity: 'weather.home', option_local_forecast: true, ...config });
  const hass = makeHass({ 'weather.home': { state: 'cloudy' } }) as { config: Record<string, unknown> };
  hass.config = { ...(hass.config ?? {}), elevation };
  el.hass = hass;
  document.body.appendChild(el); await el.updateComplete;
  const box = document.createElement('div'); render(el._topicLocalForecast() as never, box, { host: el });
  return { el, box, offer: box.querySelector('button.offer') as HTMLElement | null };
}

describe('the height of Home Assistant, offered', () => {
  it('beside an empty altitude, in the words of the language', async () => {
    const { offer } = await page({}, 154.4);
    expect(offer?.textContent?.trim()).toBe('Use 154 m from Home Assistant');
  });
  it('taken only with a press, as the number it is', async () => {
    const { el, offer } = await page({}, 154);
    let written: Record<string, unknown> | undefined;
    el.addEventListener('config-changed', (e) => { written = (e as CustomEvent).detail.config; });
    await el.updateComplete;
    expect(written, 'nothing written by drawing the page').toBeUndefined();
    offer!.click();
    expect(written?.option_forecast_altitude).toBe(154);
  });
  it('not offered when an altitude is set, or when Home Assistant has none, or says the sea', async () => {
    expect((await page({ option_forecast_altitude: 200 }, 154)).offer).toBeNull();
    expect((await page({}, undefined)).offer).toBeNull();
    expect((await page({}, 0)).offer).toBeNull();
  });
  it('and the hint says how to tell a relative barometer', async () => {
    const { box } = await page({}, 154);
    expect(box.textContent).toContain('A relative barometer reads about 1013 hPa on an average day');
    // the first sentence ends before the second begins (seen on beta.6: "…pressure A relative barometer…")
    expect(box.textContent?.replace(/\s+/g, ' ')).toMatch(/pressure\. A relative barometer/);
  });
  it('in every language, with the place for the number', () => {
    for (const [lang, t] of Object.entries(TRANSLATIONS)) {
      const e = (t as { editor: Record<string, string> }).editor;
      expect(e.forecast_altitude_use_ha, lang).toContain('{n}');
      expect(e.forecast_altitude_relative, lang).toMatch(/1013/);
    }
    expect((TRANSLATIONS as Record<string, { editor: Record<string, string> }>).bg.editor.forecast_altitude_hint).not.toMatch(/sea-level/);
  });
});
