import { describe, it, expect } from 'vitest';
import '../src/platinum-weather-card';
import { makeHass, baseConfig, renderCard } from './helpers';

// The overview has four layouts and the slots two column formats. Each hides or
// shows a different combination, and nothing checked that the right things
// disappear — or, more to the point, that the wrong things do not.

const states = {
  'sensor.temp': { state: '21.5', attributes: { unit_of_measurement: '°C' } },
  'sensor.app': { state: '23.1', attributes: { unit_of_measurement: '°C' } },
  'sensor.summary': { state: 'Partly cloudy' },
  'sensor.condition': { state: 'sunny' },
  'sensor.hum': { state: '64', attributes: { unit_of_measurement: '%' } },
  'sensor.press': { state: '1016', attributes: { unit_of_measurement: 'hPa' } },
  'sensor.wspeed': { state: '12', attributes: { unit_of_measurement: 'km/h' } },
  'sensor.wbear': { state: '180' },
  'sun.sun': { state: 'above_horizon', attributes: { elevation: 35 } },
};

async function overview(layout: string, extra: Record<string, unknown> = {}) {
  return (await renderCard(
    baseConfig({
      section_order: ['overview'],
      overview_layout: layout,
      text_card_title: 'My Station',
      entity_temperature: 'sensor.temp',
      entity_apparent_temp: 'sensor.app',
      entity_summary: 'sensor.summary',
      entity_forecast_icon: 'sensor.condition',
      entity_sun: 'sun.sun',
      ...extra,
    } as never),
    makeHass(states),
  )) as HTMLElement;
}

const text = (el: HTMLElement) => (el.shadowRoot?.textContent ?? '').replace(/\s+/g, ' ');

describe('overview layouts', () => {
  it('complete shows the title, temperature and summary', async () => {
    const el = await overview('complete');
    expect(text(el)).toContain('My Station');
    expect(text(el)).toContain('22');
    expect(text(el)).toContain('Partly cloudy');
  });

  it('observations shows readings but not the forecast text', async () => {
    const el = await overview('observations');
    expect(text(el)).toContain('22');
    expect(text(el)).not.toContain('Partly cloudy');
  });

  it('forecast shows the summary but not the current temperature', async () => {
    const el = await overview('forecast');
    expect(text(el)).toContain('Partly cloudy');
    expect(el.shadowRoot?.querySelector('.temp')).toBeNull();
  });

  it('title only shows the title and nothing else', async () => {
    const el = await overview('title only');
    expect(text(el)).toContain('My Station');
    expect(text(el)).not.toContain('Partly cloudy');
    expect(el.shadowRoot?.querySelector('.temp')).toBeNull();
  });

  it('renders every layout without throwing', async () => {
    for (const layout of ['complete', 'observations', 'forecast', 'title only']) {
      const el = await overview(layout);
      expect(el.shadowRoot, layout).toBeTruthy();
      expect(text(el), `${layout} printed NaN`).not.toContain('NaN');
    }
  });

  it('survives an unrecognised layout', async () => {
    await expect(overview('something-else')).resolves.toBeTruthy();
  });
});

describe('overview options', () => {
  it('shows the apparent temperature', async () => {
    const el = await overview('complete');
    expect(el.shadowRoot?.querySelector('.apparent')).toBeTruthy();
  });

  it('omits it when no entity is configured', async () => {
    const el = (await renderCard(
      baseConfig({
        section_order: ['overview'],
        overview_layout: 'complete',
        entity_temperature: 'sensor.temp',
      } as never),
      makeHass(states),
    )) as HTMLElement;
    expect(el.shadowRoot?.querySelector('.apparent')).toBeNull();
  });

  it('draws the separator only when switched on', async () => {
    // Off by default, so an existing card does not change shape on upgrade.
    const off = await overview('complete');
    const on = await overview('complete', { option_show_overview_separator: true });
    expect(off.shadowRoot?.querySelector('hr')).toBeNull();
    expect(on.shadowRoot?.querySelector('hr')).toBeTruthy();
  });

  it('shows a second title line when given one', async () => {
    const el = await overview('complete', { text_card_title_2: 'Back garden' });
    expect(text(el)).toContain('Back garden');
  });
});

describe('slot column formats', () => {
  const slotConfig = {
    section_order: ['slots'],
    entity_humidity: 'sensor.hum',
    entity_pressure: 'sensor.press',
    entity_wind_speed: 'sensor.wspeed',
    entity_wind_bearing: 'sensor.wbear',
    slot_l1: 'humidity',
    slot_l2: 'pressure',
    slot_r1: 'wind',
    slot_r2: 'remove',
  };

  async function slots(extra: Record<string, unknown> = {}) {
    return (await renderCard(
      baseConfig({ ...slotConfig, ...extra } as never),
      makeHass(states),
    )) as HTMLElement;
  }

  it('uses the modern two-column layout by default', async () => {
    const el = await slots();
    expect(el.shadowRoot?.querySelector('.variations')).toBeTruthy();
    expect(el.shadowRoot?.querySelector('.variations-ugly')).toBeNull();
  });

  it('switches to the old format when asked', async () => {
    const el = await slots({ use_old_column_format: true });
    expect(el.shadowRoot?.querySelector('.variations-ugly')).toBeTruthy();
  });

  it('shows the same readings in both formats', async () => {
    const modern = await slots();
    const old = await slots({ use_old_column_format: true });
    for (const value of ['64', '1,016', '12']) {
      expect(text(modern), `modern missing ${value}`).toContain(value);
      expect(text(old), `old missing ${value}`).toContain(value);
    }
  });

  it('keeps two columns in both formats', async () => {
    for (const cfg of [{}, { use_old_column_format: true }]) {
      const el = await slots(cfg);
      const lists = el.shadowRoot?.querySelectorAll('.slot-list') ?? [];
      expect(lists.length, JSON.stringify(cfg)).toBe(2);
    }
  });
});

describe('section visibility', () => {
  it('omits a section switched off', async () => {
    const el = (await renderCard(
      baseConfig({
        section_order: ['overview', 'slots'],
        overview_layout: 'complete',
        show_section_slots: false,
        entity_temperature: 'sensor.temp',
        entity_humidity: 'sensor.hum',
        slot_l1: 'humidity',
      } as never),
      makeHass(states),
    )) as HTMLElement;
    expect(el.shadowRoot?.querySelector('li[data-slot="humidity"]')).toBeNull();
  });

  it('renders sections in the configured order', async () => {
    const el = (await renderCard(
      baseConfig({
        section_order: ['slots', 'overview'],
        overview_layout: 'complete',
        entity_temperature: 'sensor.temp',
        entity_humidity: 'sensor.hum',
        slot_l1: 'humidity',
        text_card_title: 'My Station',
      } as never),
      makeHass(states),
    )) as HTMLElement;
    const html = el.shadowRoot?.innerHTML ?? '';
    expect(html.indexOf('data-slot="humidity"')).toBeLessThan(html.indexOf('My Station'));
  });

  it('renders nothing gracefully when every section is off', async () => {
    const el = (await renderCard(
      baseConfig({
        section_order: ['overview', 'slots'],
        show_section_overview: false,
        show_section_slots: false,
        entity_temperature: 'sensor.temp',
      } as never),
      makeHass(states),
    )) as HTMLElement;
    expect(el.shadowRoot?.querySelector('ha-card')).toBeTruthy();
  });
});
