import { describe, it, expect } from 'vitest';
import { render } from 'lit';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import '../src/platinum-weather-card';
import '../src/editor';
import { makeHass } from './helpers';

// What a slot shows when it is not chosen was written down in two places, the card and the editor, and they drifted apart (#61): the card
// drew the moon in r4 and the editor offered the field of the fire danger. The defaults live in one list now, SLOT_DEFAULTS in const.ts.
// These tests catch the whole class: a second list anywhere in src, an editor that offers other fields for an unset slot than for the
// same slot set to its default, and a README that says something else.

const SRC = join(__dirname, '..', 'src');
const POSITIONS = ['l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'l7', 'l8', 'r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8'];

// The defaults as the README gives them to users: "Default slot values: l1=`forecast_max`, ..., l6–l8=`remove`, ..."
function readmeDefaults(): Record<string, string> {
  const line = readFileSync(join(__dirname, '..', 'README.md'), 'utf8').split('\n').find((l) => l.startsWith('Default slot values:'))!;
  const out: Record<string, string> = {};
  for (const m of line.matchAll(/([lr])(\d)(?:[–-]\1?(\d))?=`([a-z_0-9]+)`/g)) {
    const [, side, from, to, value] = m;
    for (let i = Number(from); i <= Number(to ?? from); i++) out[`${side}${i}`] = value;
  }
  return out;
}

type Editor = HTMLElement & { setConfig: (c: unknown) => void; hass: unknown; updateComplete: Promise<unknown>; _optional_entities: unknown };
async function offered(config: Record<string, unknown>): Promise<string[]> {
  const el = document.createElement('platinum-weather-card-plus-charts-editor') as Editor;
  el.setConfig({ card_config_version: 8, weather_entity: 'weather.home', ...config });
  el.hass = makeHass({ 'weather.home': { state: 'cloudy' } });
  document.body.appendChild(el);
  await el.updateComplete;
  const box = document.createElement('div');
  render(el._optional_entities as never, box);
  el.remove();
  const keys = [...box.querySelectorAll('*')].map((e) => (e as { configValue?: unknown }).configValue).filter((v): v is string => typeof v === 'string');
  return [...new Set(keys)].sort();
}

describe('the defaults of the slots, in one place (#61)', () => {
  it('no list of slot defaults in src but SLOT_DEFAULTS in const.ts', () => {
    const offenders: string[] = [];
    for (const file of readdirSync(SRC).filter((f) => f.endsWith('.ts') && f !== 'const.ts')) {
      readFileSync(join(SRC, file), 'utf8').split('\n').forEach((line, i) => {
        // a fallback for one slot (slot_r4 || 'fire_danger'; an empty '' is the blank of a field, not a default) or an entry of a map of positions (r4: 'moon')
        if (/slot_[lr][1-8]\b\s*(\|\||\?\?)\s*['"`][a-z]/.test(line) || /\b[lr][1-8]\s*:\s*['"`][a-z_0-9]+['"`]/.test(line)) offenders.push(`${file}:${i + 1}: ${line.trim()}`);
      });
    }
    expect(offenders).toEqual([]);
  });

  it('SLOT_DEFAULTS is what the README tells users, for all sixteen positions', async () => {
    const { SLOT_DEFAULTS } = await import('../src/const') as { SLOT_DEFAULTS?: Record<string, string> };
    expect(SLOT_DEFAULTS).toBeDefined();
    expect(Object.keys(SLOT_DEFAULTS!).sort()).toEqual([...POSITIONS].sort());
    expect({ ...SLOT_DEFAULTS }).toEqual(readmeDefaults());
  });

  it('for an unset slot the editor offers the fields of its default, at every position', async () => {
    const readme = readmeDefaults();
    for (const p of POSITIONS) {
      const unset = await offered({});
      const set = await offered({ [`slot_${p}`]: readme[p] });
      expect(unset, `slot_${p} unset vs slot_${p}: ${readme[p]}`).toEqual(set);
    }
  });

  it('slot_r4 unset: the field of the moon, not that of the fire danger', async () => {
    const fields = await offered({});
    expect(fields).toContain('entity_moon');
    expect(fields).not.toContain('entity_fire_danger');
  });
});
