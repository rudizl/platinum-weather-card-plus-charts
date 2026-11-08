import { describe, it, expect } from 'vitest';
import { render } from 'lit';
import '../src/platinum-weather-card';
import '../src/editor';
import { makeHass, baseConfig, renderCard, choice } from './helpers';
import { airBand, isMicrograms } from '../src/air';
import { TRANSLATIONS } from '../src/translations';

// #42: particulates in µg/m³, banded by the European Air Quality Index as the EEA revised it in 2024 (ETC HE Report 2024/17, Table of the
// refined bands, hourly values): PM2.5 good to 5, fair to 15, moderate to 50, poor to 90, very poor to 140; PM10 15, 45, 120, 195, 270.
// The number of a slot is coloured by its band, green for good as the UV; the icon is not. A warning row from poor up, with a note that it may
// be fog above 90% humidity, since cheap sensors read the droplets as dust.

const UG = 'μg/m³'; // as Home Assistant writes it, with the Greek mu
type State = { state: string; attributes?: Record<string, unknown> };
async function card(states: Record<string, State>, extra: Record<string, unknown> = {}) {
  return (await renderCard(baseConfig({ section_order: ['warnings', 'slots'], slot_l1: 'pm25', slot_r1: 'pm10',
    entity_pm25: 'sensor.pm25', entity_pm10: 'sensor.pm10', ...extra } as never), makeHass(states))) as HTMLElement;
}
const pm = (pm25: string, pm10: string, unit: string | null = UG, more: Record<string, State> = {}) => ({
  'sensor.pm25': { state: pm25, attributes: unit === null ? {} : { unit_of_measurement: unit, device_class: 'pm25' } },
  'sensor.pm10': { state: pm10, attributes: unit === null ? {} : { unit_of_measurement: unit, device_class: 'pm10' } },
  ...more,
});
const slotOf = (el: HTMLElement, p: string) => el.shadowRoot!.querySelector(`[data-slot="${p}"]`)!;
const valueOf = (el: HTMLElement, p: string) => slotOf(el, p).querySelector('.air-text') as HTMLElement;
const warning = (el: HTMLElement) => el.shadowRoot!.querySelector('.air-warning') as HTMLElement | null;

describe('the bands of the European index', () => {
  it('PM2.5, at each edge', () => {
    const at = (v: number) => airBand('pm25', v);
    expect([5, 6, 15, 16, 50, 51, 90, 91, 140, 141].map(at)).toEqual([0, 1, 1, 2, 2, 3, 3, 4, 4, 5]);
    expect([5.4, 5.5].map(at)).toEqual([0, 1]);
  });
  it('PM10, at each edge', () => {
    const at = (v: number) => airBand('pm10', v);
    expect([15, 16, 45, 46, 120, 121, 195, 196, 270, 271].map(at)).toEqual([0, 1, 1, 2, 2, 3, 3, 4, 4, 5]);
  });
  it('a concentration is in micrograms however the micro is written', () => {
    for (const u of ['μg/m³', 'µg/m³', 'ug/m3', 'µg/m3']) expect(isMicrograms(u), u).toBe(true);
    for (const u of [undefined, '', 'mg/m³', 'AQI', '%']) expect(isMicrograms(u), String(u)).toBe(false);
  });
});

describe('the slots', () => {
  it('show whole micrograms, the number coloured by its band and named in its title, the icon not coloured', async () => {
    const el = await card(pm('5.35', '7.03'));
    const v = valueOf(el, 'pm25');
    expect(v.textContent?.trim()).toBe('5');
    expect(v.getAttribute('style')).toMatch(/#4caf50/);
    expect(v.getAttribute('title')).toBe('Good');
    expect(slotOf(el, 'pm25').querySelector('.unit')?.textContent).toBe('µg/m³');
    expect(slotOf(el, 'pm25').querySelector('ha-icon')!.getAttribute('style') ?? '').not.toMatch(/color/);
    expect(slotOf(el, 'pm25').textContent).toContain('PM2.5');
    expect(slotOf(el, 'pm10').textContent).toContain('PM10');
  });
  it('a decimal when asked for', async () => {
    expect(valueOf(await card(pm('5.35', '7.03'), { option_air_decimals: true }), 'pm25').textContent?.trim()).toBe('5.4');
  });
  it('each band its colour: PM10 at 130 is poor, orange', async () => {
    const v = valueOf(await card(pm('20', '130')), 'pm10');
    expect(v.getAttribute('style')).toMatch(/#ff9800/);
    expect(v.getAttribute('title')).toBe('Poor');
  });
  it('a reading not in µg/m³, as the indices of WAQI, is shown as it comes, without a colour or a unit', async () => {
    const el = await card(pm('42', '20', null));
    expect(valueOf(el, 'pm25').textContent?.trim()).toBe('42');
    expect(valueOf(el, 'pm25').getAttribute('style') ?? '').not.toMatch(/color/);
    expect(slotOf(el, 'pm25').querySelector('.unit')).toBeNull();
  });
  it('no reading is ---', async () => {
    expect(valueOf(await card(pm('unavailable', 'unknown')), 'pm25').textContent?.trim()).toBe('---');
  });
  it('a press opens the history of the sensor, as the other slots', async () => {
    const el = await card(pm('5', '7'));
    expect((el as unknown as { _slotTapEntity: (s: string) => string | null })._slotTapEntity('pm25')).toBe('sensor.pm25');
    expect((el as unknown as { _slotTapEntity: (s: string) => string | null })._slotTapEntity('pm10')).toBe('sensor.pm10');
  });
});

describe('the warning', () => {
  it('says nothing while the air is moderate or better', async () => {
    expect(warning(await card(pm('50', '120')))).toBeNull();
  });
  it('a row when it is poor: orange, the band, the particulates and the number', async () => {
    const w = warning(await card(pm('60', '30')))!;
    expect(w.classList.contains('level-orange')).toBe(true);
    expect(w.textContent?.replace(/\s+/g, ' ').trim()).toBe('Air quality: Poor · PM2.5 60 µg/m³');
  });
  it('red when very poor or worse, and the worse of the two speaks', async () => {
    const w = warning(await card(pm('60', '200')))!;
    expect(w.classList.contains('level-red')).toBe(true);
    expect(w.textContent).toContain('Very poor · PM10 200');
  });
  it('above 90% humidity it says it may be fog; at 90 it does not', async () => {
    const hum = (v: string) => ({ 'sensor.h': { state: v, attributes: { unit_of_measurement: '%' } } });
    expect(warning(await card(pm('60', '30', UG, hum('95')), { entity_humidity: 'sensor.h' }))!.textContent).toContain('may be fog');
    expect(warning(await card(pm('60', '30', UG, hum('90')), { entity_humidity: 'sensor.h' }))!.textContent).not.toContain('fog');
  });
  it('in the classic style as well, and none at all when it is switched off', async () => {
    expect(warning(await card(pm('60', '30'), { option_warning_style: 'classic' }))!.getAttribute('style')).toMatch(/border-left-color/);
    expect(warning(await card(pm('60', '30'), { option_air_warning: false }))).toBeNull();
  });
  it('and none for a reading not in µg/m³, which cannot be banded', async () => {
    expect(warning(await card(pm('200', '400', null)))).toBeNull();
  });
});

describe('the editor', () => {
  type Editor = HTMLElement & { setConfig: (c: unknown) => void; hass: unknown; updateComplete: Promise<unknown>; _topicWarnings: () => unknown; _filterFor: (k: string) => (e: unknown) => boolean };
  async function editor(config: Record<string, unknown>) {
    const el = document.createElement('platinum-weather-card-plus-charts-editor') as Editor;
    el.setConfig({ card_config_version: 8, weather_entity: 'weather.home', ...config });
    el.hass = makeHass({ 'weather.home': { state: 'cloudy' }, ...pm('5', '7'), 'sensor.t': { state: '10', attributes: { unit_of_measurement: '°C', device_class: 'temperature' } } });
    document.body.appendChild(el); await el.updateComplete;
    return el;
  }
  it('offers PM2.5 and PM10 among the slots, and their sensors once chosen', async () => {
    const el = await editor({ slot_l1: 'pm25', slot_r1: 'pm10' });
    (el as unknown as { _editSubmenu: (e: unknown) => void })._editSubmenu({ currentTarget: { value: 'section_slots' } });
    await el.updateComplete;
    const html = el.shadowRoot!.innerHTML;
    expect(html).toContain('value="pm25"');
    expect(html).toContain('value="pm10"');
    const pickers = [...el.shadowRoot!.querySelectorAll('ha-entity-picker')].map((p) => (p as unknown as { configValue: string }).configValue);
    expect(pickers).toEqual(expect.arrayContaining(['entity_pm25', 'entity_pm10']));
  });
  it('the picker offers sensors of particulates, not others', async () => {
    const el = await editor({});
    const f = el._filterFor('entity_pm25');
    expect(f({ entity_id: 'sensor.pm25', attributes: { unit_of_measurement: UG, device_class: 'pm25' } })).toBe(true);
    expect(f({ entity_id: 'sensor.t', attributes: { unit_of_measurement: '°C', device_class: 'temperature' } })).toBe(false);
  });
  it('the switch of the warning shows once a sensor is chosen', async () => {
    const box = (el: Editor) => { const b = document.createElement('div'); render(el._topicWarnings() as never, b, { host: el }); return b; };
    const has = (b: Element) => [...b.querySelectorAll('.pwc-switch')].some((s) => (s as unknown as { value: string }).value === 'option_air_warning');
    expect(has(box(await editor({})))).toBe(false);
    expect(has(box(await editor({ entity_pm25: 'sensor.pm25' })))).toBe(true);
    void choice;
  });
  it('every language has the bands and the words of the editor', () => {
    for (const [lang, t] of Object.entries(TRANSLATIONS)) {
      const card = (t as { card: Record<string, string> }).card;
      const ed = (t as { editor: Record<string, string> }).editor;
      for (const k of ['air_good', 'air_fair', 'air_moderate', 'air_poor', 'air_very_poor', 'air_extremely_poor', 'air_quality', 'air_fog']) expect(card[k], `${lang} ${k}`).toBeTruthy();
      for (const k of ['entity_pm25', 'entity_pm10', 'air_warning', 'air_warning_hint', 'air_decimals']) expect(ed[k], `${lang} ${k}`).toBeTruthy();
    }
  });
});
