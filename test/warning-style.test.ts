import { describe, it, expect } from 'vitest';
import { render } from 'lit';
import '../src/platinum-weather-card';
import '../src/editor';
import { TRANSLATIONS } from '../src/translations';
import { makeHass, baseConfig, renderCard } from './helpers';

// The warning bar, seen on a real card: a flat rectangle of fixed yellow over a dark glass background, with
// a hard edge on its left, came out a muddy olive. The soft style is the default now; the old one is a choice.

type St = { state: string; attributes?: Record<string, unknown> };
type Card = HTMLElement & { hass: unknown; updateComplete: Promise<unknown> };

const states = (km: string | null, extra: Record<string, St> = {}): Record<string, St> => ({
  ...(km === null ? {} : { 'sensor.lightning_km': { state: km, attributes: { unit_of_measurement: 'km' } } }),
  'sensor.lightning_az': { state: '200' },
  ...extra,
});
async function mount(km: string | null, config: Record<string, unknown> = {}, extra: Record<string, St> = {}) {
  return (await renderCard(baseConfig({
    section_order: ['warnings'], entity_lightning_distance: 'sensor.lightning_km', entity_lightning_azimuth: 'sensor.lightning_az', ...config,
  } as never), makeHass(states(km, extra)))) as Card;
}
const rows = (el: HTMLElement) => [...(el.shadowRoot?.querySelectorAll('.warning-row') ?? [])] as HTMLElement[];
const pills = (el: HTMLElement) => [...(el.shadowRoot?.querySelectorAll('.warning-pill') ?? [])] as HTMLElement[];
const sev = (e: HTMLElement) => e.style.getPropertyValue('--sev').trim();

describe('the lightning bar, soft (the default)', () => {
  it('is a small pill when the storm is far: no bar, almost no room', async () => {
    const el = await mount('42');
    expect(pills(el)).toHaveLength(1);
    expect(rows(el)).toHaveLength(0);
    expect(pills(el)[0].textContent).toMatch(/42/);
    expect(sev(pills(el)[0])).toBe('#ffc107');
  });
  it('and the pill says the whole of it to a screen reader, though it shows only the distance', async () => {
    const pill = pills(await mount('42'))[0];
    expect(pill.getAttribute('aria-label')).toMatch(/42/);
    expect(pill.getAttribute('aria-label')!.length).toBeGreaterThan(pill.textContent!.trim().length);
  });
  it('is a bar from thirty kilometres in, amber, with a stripe that fades and no hard edge', async () => {
    const el = await mount('22');
    expect(pills(el)).toHaveLength(0);
    const r = rows(el)[0];
    expect(r.classList.contains('soft')).toBe(true);
    expect(r.classList.contains('level-orange')).toBe(true);
    expect(sev(r)).toBe('#ff9800');
    // the colour is in the stylesheet, from --sev: nothing fixed is put in the element
    expect(r.getAttribute('style')).not.toMatch(/rgba?\(/);
    expect(r.getAttribute('style')).not.toMatch(/border-left/);
  });
  it('thirty is already a bar, and fifteen is red and bolder', async () => {
    expect(rows(await mount('30'))[0].classList.contains('level-orange')).toBe(true);
    const near = rows(await mount('9'))[0];
    expect(near.classList.contains('level-red')).toBe(true);
    expect(sev(near)).toBe('#f44336');
  });
  it('says what it is, in the bar: the storm, the distance, the direction', async () => {
    const t = rows(await mount('22'))[0].textContent!.replace(/\s+/g, ' ');
    expect(t).toMatch(/22/);
    expect(t.length).toBeGreaterThan(8);
  });
  it('says nothing for a storm beyond the range, or for no reading', async () => {
    const far = await mount('80');
    expect(rows(far).length + pills(far).length).toBe(0);
    const gone = await mount('unavailable');
    expect(rows(gone).length + pills(gone).length).toBe(0);
    const none = await mount(null);
    expect(rows(none).length + pills(none).length).toBe(0);
  });
  it('a different range moves the pill: option_lightning_max_distance', async () => {
    const el = await mount('42', { option_lightning_max_distance: 40 });
    expect(rows(el).length + pills(el).length).toBe(0);
  });
});

describe('the lightning bar, as before', () => {
  const classic = { option_warning_style: 'classic' };
  it('is the flat bar at every distance, with its fixed tint and its edge', async () => {
    for (const km of ['42', '22', '9']) {
      const el = await mount(km, classic);
      expect(pills(el), km).toHaveLength(0);
      const r = rows(el)[0];
      expect(r.classList.contains('soft'), km).toBe(false);
      expect(r.getAttribute('style'), km).toMatch(/border-left-color/);
      expect(r.getAttribute('style'), km).toMatch(/background: rgba\(/);
    }
  });
  it('a word it does not know is the soft style', async () => {
    expect(pills(await mount('42', { option_warning_style: 'bogus' }))).toHaveLength(1);
  });
});

describe('the provider\'s warnings follow the style too', () => {
  const warning: Record<string, St> = {
    'binary_sensor.warning': { state: 'on', attributes: { awareness_type: '3; Thunderstorm', awareness_level: '3; Orange', expires: '2026-10-24T18:00:00Z' } },
  };
  it('soft: a stripe that fades, coloured by its level', async () => {
    const el = await mount(null, { entity_warning: 'binary_sensor.warning' }, warning);
    const r = rows(el)[0];
    expect(r.classList.contains('soft')).toBe(true);
    expect(r.classList.contains('level-orange')).toBe(true);
    expect(sev(r)).toBe('#ff9800');
    expect(r.getAttribute('style')).not.toMatch(/rgba?\(/);
  });
  it('classic: as it was', async () => {
    const el = await mount(null, { entity_warning: 'binary_sensor.warning', option_warning_style: 'classic' }, warning);
    const r = rows(el)[0];
    expect(r.classList.contains('soft')).toBe(false);
    expect(r.getAttribute('style')).toMatch(/background: rgba\(/);
  });
  it('keeps what it said: the icon, the words and when it ends', async () => {
    const r = rows(await mount(null, { entity_warning: 'binary_sensor.warning' }, warning))[0];
    expect(r.querySelector('ha-icon')?.getAttribute('icon')).toBe('mdi:weather-lightning');
    expect(r.querySelector('.warning-expiry')).not.toBeNull();
  });
});

describe('the editor offers the choice', () => {
  type Editor = HTMLElement & { setConfig: (c: unknown) => void; hass: unknown; updateComplete: Promise<unknown>; _optionAppearanceEditor: () => unknown };
  async function panel(config: Record<string, unknown> = {}) {
    const el = document.createElement('platinum-weather-card-plus-charts-editor') as Editor;
    el.setConfig({ card_config_version: 8, weather_entity: 'weather.home', ...config });
    el.hass = makeHass({ 'weather.home': { state: 'cloudy' } });
    document.body.appendChild(el);
    await el.updateComplete;
    const box = document.createElement('div');
    render(el._optionAppearanceEditor() as never, box);
    return box;
  }
  const sel = (box: HTMLElement) => [...box.querySelectorAll('select')].find((s) => (s as unknown as { configValue: string }).configValue === 'option_warning_style') as HTMLSelectElement | undefined;
  it('in Appearance, with the soft style first', async () => {
    const s = sel(await panel());
    expect([...(s?.querySelectorAll('option') ?? [])].map((o) => o.getAttribute('value'))).toEqual(['soft', 'classic']);
  });
  it('showing soft unless the configuration says classic', async () => {
    expect((sel(await panel()) as unknown as { value: string }).value).toBe('soft');
    expect((sel(await panel({ option_warning_style: 'classic' })) as unknown as { value: string }).value).toBe('classic');
    expect((sel(await panel({ option_warning_style: 'bogus' })) as unknown as { value: string }).value).toBe('soft');
  });
  it('and its words are in every language', () => {
    const en = (TRANSLATIONS as Record<string, Record<string, unknown>>).en;
    for (const [lang, t] of Object.entries(TRANSLATIONS as Record<string, Record<string, unknown>>)) {
      const ed = (t.editor ?? t) as Record<string, string>;
      for (const k of ['warning_style', 'warning_style_soft', 'warning_style_classic']) {
        expect(typeof ed[k], `${lang}: ${k}`).toBe('string');
        if (lang !== 'en') expect(ed[k], `${lang}: ${k} is still English`).not.toBe(((en.editor ?? en) as Record<string, string>)[k]);
      }
    }
  });
});
