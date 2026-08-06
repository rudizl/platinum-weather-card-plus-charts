import { describe, it, expect, vi } from 'vitest';
import '../src/editor';
import { makeHass } from './helpers';

// The editor's handlers rewrite the stored configuration and emit config-changed.
// These drive them directly and inspect what would be saved, which is where the
// damage happens: a bad write silently corrupts a live dashboard.

interface EditorEl extends HTMLElement {
  setConfig: (c: Record<string, unknown>) => void;
  hass: unknown;
  _config: Record<string, unknown>;
  updateComplete: Promise<unknown>;
  _valueChanged: (ev: unknown) => void;
  _valueChangedNumber: (ev: unknown) => void;
  _valueChangedPicker: (ev: unknown) => void;
  _toggleVisibility: (ev: unknown) => void;
  _moveUp: (ev: unknown) => void;
  _moveDown: (ev: unknown) => void;
}

async function editor(config: Record<string, unknown> = {}) {
  const el = document.createElement('platinum-weather-card-plus-charts-editor') as EditorEl;
  el.setConfig({ type: 'custom:platinum-weather-card-plus-charts', ...config } as never);
  el.hass = makeHass();
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

// Captures the config the editor would hand back to Home Assistant.
function captureSaved(el: EditorEl): () => Record<string, unknown> | undefined {
  let saved: Record<string, unknown> | undefined;
  el.addEventListener('config-changed', ((e: CustomEvent) => {
    saved = e.detail.config;
  }) as EventListener);
  return () => saved;
}

const target = (props: Record<string, unknown>) => ({ target: { ...props }, currentTarget: { ...props } });

describe('text and select changes', () => {
  it('stores a new value', async () => {
    const el = await editor();
    const saved = captureSaved(el);
    el._valueChanged({ ...target({ configValue: 'text_card_title', value: 'Garden' }) });
    expect(saved()?.text_card_title).toBe('Garden');
  });

  it('removes the key when the value is cleared', async () => {
    // Leaving an empty string in the config would render an empty title rather
    // than no title.
    const el = await editor({ text_card_title: 'Garden' });
    const saved = captureSaved(el);
    el._valueChanged({ ...target({ configValue: 'text_card_title', value: '' }) });
    expect(saved()).toBeDefined();
    expect('text_card_title' in (saved() ?? {})).toBe(false);
  });

  it('ignores a change that would not change anything', async () => {
    const el = await editor({ text_card_title: 'Garden' });
    const saved = captureSaved(el);
    el._valueChanged({ ...target({ configValue: 'text_card_title', value: 'Garden' }) });
    expect(saved()).toBeUndefined();
  });
});

describe('numeric changes', () => {
  it('stores a number, not a string', async () => {
    // A string would break comparisons like `days > 5` elsewhere in the card.
    const el = await editor();
    const saved = captureSaved(el);
    el._valueChangedNumber({ ...target({ configValue: 'option_trend_window_hours', value: '3' }) });
    expect(saved()?.option_trend_window_hours).toBe(3);
  });

  it('removes the key when the field is emptied', async () => {
    const el = await editor({ option_forecast_altitude: 154 });
    const saved = captureSaved(el);
    el._valueChangedNumber({ ...target({ configValue: 'option_forecast_altitude', value: '' }) });
    expect('option_forecast_altitude' in (saved() ?? {})).toBe(false);
  });
});

describe('entity pickers', () => {
  it('stores the chosen entity', async () => {
    const el = await editor();
    const saved = captureSaved(el);
    el._valueChangedPicker({
      target: { configValue: 'entity_temperature' },
      detail: { value: 'sensor.outside' },
    });
    expect(saved()?.entity_temperature).toBe('sensor.outside');
  });

  it('removes the key when the picker is cleared', async () => {
    const el = await editor({ entity_temperature: 'sensor.outside' });
    const saved = captureSaved(el);
    el._valueChangedPicker({
      target: { configValue: 'entity_temperature' },
      detail: { value: '' },
    });
    expect('entity_temperature' in (saved() ?? {})).toBe(false);
  });
});

describe('toggles', () => {
  it('turns an option on', async () => {
    const el = await editor();
    const saved = captureSaved(el);
    el._toggleVisibility({
      currentTarget: { value: 'option_local_forecast', classList: { contains: () => false } },
    });
    expect(saved()?.option_local_forecast).toBe(true);
  });

  it('turns an option off', async () => {
    const el = await editor({ option_local_forecast: true });
    const saved = captureSaved(el);
    el._toggleVisibility({
      currentTarget: { value: 'option_local_forecast', classList: { contains: () => true } },
    });
    expect(saved()?.option_local_forecast).toBe(false);
  });
});

describe('reordering sections', () => {
  const order = ['warnings', 'overview', 'extended', 'slots', 'daily_forecast', 'charts'];

  it('moves a section up', async () => {
    const el = await editor({ section_order: [...order] });
    const saved = captureSaved(el);
    el._moveUp({ currentTarget: { value: 'slots' } });
    const result = saved()?.section_order as string[];
    expect(result.indexOf('slots')).toBe(2);
    expect(result.indexOf('extended')).toBe(3);
  });

  it('moves a section down', async () => {
    const el = await editor({ section_order: [...order] });
    const saved = captureSaved(el);
    el._moveDown({ currentTarget: { value: 'slots' } });
    const result = saved()?.section_order as string[];
    expect(result.indexOf('slots')).toBe(4);
  });

  it('keeps every section when reordering', async () => {
    // A swap that goes out of bounds would leave undefined in the array and the
    // section would disappear from the card entirely.
    const el = await editor({ section_order: [...order] });
    const saved = captureSaved(el);
    el._moveUp({ currentTarget: { value: 'extended' } });
    const result = saved()?.section_order as string[];
    expect(result.length).toBe(order.length);
    expect(result.filter((s) => s === undefined || s === null).length).toBe(0);
    expect([...result].sort()).toEqual([...order].sort());
  });

  it('does not corrupt the list when moving the first section up', async () => {
    const el = await editor({ section_order: [...order] });
    const saved = captureSaved(el);
    el._moveUp({ currentTarget: { value: order[0] } });
    const result = (saved()?.section_order as string[]) ?? order;
    expect(result.filter((s) => s === undefined).length, 'undefined entered the list').toBe(0);
    expect([...result].sort()).toEqual([...order].sort());
  });

  it('does not corrupt the list when moving the last section down', async () => {
    const el = await editor({ section_order: [...order] });
    const saved = captureSaved(el);
    el._moveDown({ currentTarget: { value: order[order.length - 1] } });
    const result = (saved()?.section_order as string[]) ?? order;
    expect(result.filter((s) => s === undefined).length, 'undefined entered the list').toBe(0);
    expect([...result].sort()).toEqual([...order].sort());
  });
});

describe('the saved config stays clean', () => {
  it('sorts keys, so diffs stay readable in the YAML editor', async () => {
    const el = await editor({ text_card_title: 'A' });
    const saved = captureSaved(el);
    el._valueChanged({ ...target({ configValue: 'entity_temperature', value: 'sensor.t' }) });
    const keys = Object.keys(saved() ?? {});
    expect(keys).toEqual([...keys].sort());
  });

  it('never writes an undefined value', async () => {
    const el = await editor();
    const saved = captureSaved(el);
    el._valueChanged({ ...target({ configValue: 'text_card_title', value: 'X' }) });
    for (const [key, value] of Object.entries(saved() ?? {})) {
      expect(value, `${key} was saved as undefined`).not.toBeUndefined();
    }
  });
});
