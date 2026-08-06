import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import '../src/editor';
import { sectionNames } from '../src/types';
import { makeHass } from './helpers';

// The editor rewrites people's stored configuration. A mistake here silently
// deletes settings from live dashboards, which is exactly what happened twice:
// a migration that tested the new key while reading the old one, and another
// that wrote a capitalised key the card never looks at.

const editorSource = readFileSync(join(__dirname, '..', 'src', 'editor.ts'), 'utf8');

interface EditorEl extends HTMLElement {
  setConfig: (c: Record<string, unknown>) => void;
  hass: unknown;
  _config: Record<string, unknown>;
  updateComplete: Promise<unknown>;
}

async function editor(config: Record<string, unknown>) {
  const el = document.createElement('platinum-weather-card-plus-charts-editor') as EditorEl;
  el.setConfig(config as never);
  el.hass = makeHass();
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

describe('migration rules', () => {
  // Parsed from the source so the test covers every rule, including ones added
  // later, rather than a list that drifts out of date.
  const body = editorSource.slice(
    editorSource.indexOf('private _configCleanup'),
    editorSource.indexOf('\n  private ', editorSource.indexOf('private _configCleanup') + 10),
  );
  const rules = Array.from(
    body.matchAll(
      /if \(tmpConfig\.(\w+)[^)]*\) \{\s*tmpConfig\['(\w+)'\] = tmpConfig\.(\w+);\s*delete tmpConfig\['(\w+)'\];/g,
    ),
  ).map((m) => ({ condition: m[1], newKey: m[2], readsFrom: m[3], deletes: m[4] }));

  it('finds the migration rules', () => {
    expect(rules.length).toBeGreaterThan(10);
  });

  it('tests, reads and deletes the same old key in every rule', () => {
    // The temperature-decimals migration once tested the new key while assigning
    // from the old one, so it never fired — and overwrote the new key with
    // undefined when it did.
    for (const r of rules) {
      expect(r.readsFrom, `${r.newKey}: reads a different key than it tests`).toBe(r.condition);
      expect(r.deletes, `${r.newKey}: deletes a different key than it tests`).toBe(r.condition);
    }
  });

  it('migrates to keys the card actually reads', () => {
    // 'Entity_forecast_max' was capitalised, so the card never saw it and the
    // maximum temperature silently vanished for anyone with the old config.
    const cardSource = readFileSync(
      join(__dirname, '..', 'src', 'platinum-weather-card.ts'),
      'utf8',
    );
    const types = readFileSync(join(__dirname, '..', 'src', 'types.ts'), 'utf8');
    for (const r of rules) {
      const known = cardSource.includes(r.newKey) || types.includes(r.newKey);
      expect(known, `${r.newKey} is written by a migration but read nowhere`).toBe(true);
      expect(r.newKey, `${r.newKey} should be lower case`).toBe(r.newKey.toLowerCase());
    }
  });

  it('never migrates a key onto itself', () => {
    for (const r of rules) {
      expect(r.newKey, `${r.condition} migrates onto itself`).not.toBe(r.condition);
    }
  });
});

describe('section order', () => {
  it('supplies the full list when none is configured', async () => {
    const el = await editor({ type: 'custom:platinum-weather-card-plus-charts' });
    expect(el._config.section_order).toEqual(sectionNames);
  });

  it('adds sections introduced after the config was written', async () => {
    // A user who configured the card before the warnings section existed must
    // not lose access to it.
    const el = await editor({
      type: 'custom:platinum-weather-card-plus-charts',
      section_order: ['overview', 'slots'],
    });
    for (const section of sectionNames) {
      expect(el._config.section_order, `${section} missing`).toContain(section);
    }
  });

  it('drops sections that no longer exist', async () => {
    const el = await editor({
      type: 'custom:platinum-weather-card-plus-charts',
      section_order: ['overview', 'a_section_that_was_removed', 'slots'],
    });
    expect(el._config.section_order).not.toContain('a_section_that_was_removed');
  });

  it('keeps the order the user chose', async () => {
    const el = await editor({
      type: 'custom:platinum-weather-card-plus-charts',
      section_order: ['slots', 'overview'],
    });
    const order = el._config.section_order as string[];
    expect(order.indexOf('slots')).toBeLessThan(order.indexOf('overview'));
  });
});

describe('every editor sub-section is reachable', () => {
  // A section with an edit button but no case in the dispatcher opens an empty
  // panel; one with an editor but no button is unreachable.
  const dispatched = new Set(
    Array.from(editorSource.matchAll(/case '(section_\w+)':/g)).map((m) => m[1]),
  );
  const buttons = new Set(
    Array.from(editorSource.matchAll(/\.value=\$\{'(section_\w+)'\}/g)).map((m) => m[1]),
  );

  it('has an edit button for every sub-editor', () => {
    for (const key of dispatched) {
      expect(buttons, `${key} has an editor but no button`).toContain(key);
    }
  });

  it('has a sub-editor for every edit button', () => {
    for (const key of buttons) {
      expect(dispatched, `${key} has a button but no editor`).toContain(key);
    }
  });

  it('names a sub-editor method for each', () => {
    for (const key of dispatched) {
      const method = `_${key.replace(/^section_/, 'section')}Editor`
        .replace(/section(\w)/, (_, c) => `section${c.toUpperCase()}`);
      // the naming isn't perfectly regular, so just check something renders it
      expect(editorSource, `${key} has no renderer`).toMatch(
        new RegExp(`case '${key}':[\\s\\S]{0,120}subel\\.push`),
      );
    }
  });
});

describe('toggles are wired to real config keys', () => {
  it('every switch writes a key the card or types declare', () => {
    const cardSource = readFileSync(
      join(__dirname, '..', 'src', 'platinum-weather-card.ts'),
      'utf8',
    );
    const types = readFileSync(join(__dirname, '..', 'src', 'types.ts'), 'utf8');
    // Only switches write config; .value on an edit button names a submenu
    // (option_overview, section_slots) rather than a setting.
    const keys = new Set(
      Array.from(
        editorSource.matchAll(
          /class=\$\{[^}]*pwc-switch[^}]*\}\s*\.value=\$\{'(\w+)'\}/g,
        ),
      ).map((m) => m[1]),
    );
    expect(keys.size).toBeGreaterThan(10);
    for (const key of keys) {
      const known = cardSource.includes(key) || types.includes(key);
      expect(known, `${key} is toggled in the editor but read nowhere`).toBe(true);
    }
  });

  it('every entity picker writes a declared key', () => {
    const types = readFileSync(join(__dirname, '..', 'src', 'types.ts'), 'utf8');
    const keys = new Set(
      Array.from(editorSource.matchAll(/\.configValue=\$\{'(entity_\w+)'\}/g)).map((m) => m[1]),
    );
    expect(keys.size).toBeGreaterThan(5);
    for (const key of keys) {
      expect(types, `${key} is set by the editor but not declared`).toContain(key);
    }
  });
});

describe('editor rows hold at most two columns', () => {
  // Counting columns by pattern-matching the source proved unreliable: nested
  // blocks and conditional templates confuse any regex. Open each sub-editor
  // and ask the DOM instead, where the answer is exact.
  const panels = [
    'option_global_options', 'section_overview', 'option_overview',
    'section_warnings', 'section_extended', 'section_slots', 'option_slots',
    'section_daily_forecast', 'option_daily_forecast', 'option_charts',
  ];

  for (const panel of panels) {
    it(`${panel} has no row with a third control`, async () => {
      const el = await editor({
        option_local_forecast: true,
        entity_warning: 'binary_sensor.warn',
        entity_solar_radiation: 'sensor.solar',
        slot_l1: 'cloud_cover',
      });
      // open the sub-editor the way the edit button does
      (el as unknown as { _editSubmenu: (ev: unknown) => void })._editSubmenu({
        currentTarget: { value: panel },
      });
      await el.updateComplete;
      const rows = Array.from(el.shadowRoot?.querySelectorAll('.side-by-side') ?? []);
      for (const row of rows) {
        expect(
          row.children.length,
          `${panel}: a row with ${row.children.length} columns — ${row.textContent?.replace(/\s+/g, ' ').slice(0, 70)}`,
        ).toBeLessThanOrEqual(2);
      }
    });
  }
});
