import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { keys } from 'ts-transformer-keys';
import '../src/editor';
import { makeHass } from './helpers';
import type { WeatherCardConfig } from '../src/types';

// The editor's cleanup deletes every key that WeatherCardConfig does not list, the first time it opens a configuration that has no
// card_config_version: a YAML card, or one from before the version existed. So a setting that the README documents and the type
// leaves out is lost on the first look at the editor (forecast_type: twice_daily went back to daily that way).

// The settings that the README documents: the first column of its tables of settings (the ones headed "| Variable |").
function documentedKeys(): string[] {
  const lines = readFileSync(join(__dirname, '..', 'README.md'), 'utf8').split('\n');
  const out: string[] = [];
  let inTable = false;
  for (const line of lines) {
    if (line.startsWith('| Variable |')) { inTable = true; continue; }
    if (inTable && !line.startsWith('|')) inTable = false;
    const m = inTable ? line.match(/^\| `([a-z0-9_]+)` \|/) : null;
    if (m) out.push(m[1]);
  }
  return out;
}

describe('the keys that the editor keeps', () => {
  it('the README has tables of settings to read', () => {
    expect(documentedKeys().length).toBeGreaterThan(100);
  });

  it('every setting that the README documents is a key of the configuration', () => {
    const known = new Set(keys<WeatherCardConfig>());
    expect(documentedKeys().filter((k) => !known.has(k))).toEqual([]);
  });

  it('a YAML card without card_config_version keeps its settings when the editor is opened', async () => {
    const el = document.createElement('platinum-weather-card-plus-charts-editor') as HTMLElement & {
      setConfig: (c: Record<string, unknown>) => void; hass: unknown; updateComplete: Promise<unknown>;
    };
    const sent: Record<string, unknown>[] = [];
    el.addEventListener('config-changed', (e) => sent.push((e as CustomEvent).detail.config));
    el.setConfig({
      type: 'custom:platinum-weather-card-plus-charts', weather_entity: 'weather.nws', forecast_type: 'twice_daily',
      show_section_charts: false, pressure_units: 'inHg', option_daily_color_fire_danger: true,
    });
    el.hass = makeHass({ 'weather.nws': { state: 'sunny' } });
    document.body.appendChild(el);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 0));
    const written = sent[sent.length - 1];
    expect(written.card_config_version).toBe(8);   // the cleanup did run
    expect(written.forecast_type).toBe('twice_daily');
    expect(written.show_section_charts).toBe(false);
    expect(written.pressure_units).toBe('inHg');
    expect(written.option_daily_color_fire_danger).toBe(true);
    el.remove();
  });
});
