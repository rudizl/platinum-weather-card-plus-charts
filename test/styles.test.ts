import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

// The style audit that found two names for one thing, a class with no rule at
// all, and rows wasting an empty column — turned into tests, so the next such
// mistake fails the build instead of reaching a screenshot.

const SRC = join(__dirname, '..', 'src');
const editor = readFileSync(join(SRC, 'editor.ts'), 'utf8');
const card = readFileSync(join(SRC, 'platinum-weather-card.ts'), 'utf8');

// Everything inside css`...` blocks
function stylesheet(source: string): string {
  return Array.from(source.matchAll(/css`([\s\S]*?)`/g))
    .map((m) => m[1])
    .join('\n');
}

// Class names appearing in class="..." attributes
function classesInMarkup(source: string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const m of source.matchAll(/class=["']([^"'$]*)["']/g)) {
    for (const c of m[1].split(/\s+/).filter(Boolean)) {
      counts.set(c, (counts.get(c) ?? 0) + 1);
    }
  }
  // and the two-branch form: class=${cond ? "a b" : "a"}
  for (const m of source.matchAll(/class=\$\{[^}]*?["']([\w -]+)["']\s*:\s*["']([\w -]+)["']/g)) {
    for (const group of [m[1], m[2]]) {
      for (const c of group.split(/\s+/).filter(Boolean)) {
        counts.set(c, (counts.get(c) ?? 0) + 1);
      }
    }
  }
  return counts;
}

// Custom-property prefixes this project legitimately uses. A name outside the
// list is almost always a typo — the variable simply does not exist, and only
// the fallback value ever applies.
const KNOWN_PREFIXES = [
  'mdc', 'ha', 'primary', 'secondary', 'paper', 'label', 'card', 'switch',
  'error', 'warning', 'success', 'disabled', 'divider', 'app', 'text', 'state',
  'accent', 'dark', 'light', 'input', 'sidebar', 'table', 'code', 'energy',
  'history', 'markdown', 'rgb', 'shadow', 'pwcc', 'parentWidth',
];

function knownPrefixViolations(css: string): string[] {
  const names = new Set<string>();
  // definitions
  for (const m of css.matchAll(/(--[a-zA-Z][\w-]*)\s*:/g)) names.add(m[1]);
  // references
  for (const m of css.matchAll(/var\(\s*(--[a-zA-Z][\w-]*)/g)) names.add(m[1]);
  return Array.from(names).filter((n) => {
    const prefix = n.slice(2).split('-')[0];
    return !KNOWN_PREFIXES.includes(prefix);
  });
}

function classesInStylesheet(source: string): Set<string> {
  return new Set(Array.from(stylesheet(source).matchAll(/\.([a-zA-Z][\w-]*)/g)).map((m) => m[1]));
}

describe('the editor stylesheet matches its markup', () => {
  // Deliberate exceptions, each with a reason. Anything else that turns up
  // unstyled is a mistake rather than a decision.
  const intentionallyUnstyled = new Set([
    // stable hooks for anyone styling the editor from outside
    'edit-overview-section', 'edit-warnings-section', 'edit-extended-section',
    'edit-slots-section', 'edit-daily-forecast-section', 'edit-charts-section',
    // Home Assistant's own classes, styled by HA
    'mdc-label',
    // fragment of 'toggle-label', picked up by the two-branch class matcher
    'label',
  ]);

  it('styles every class it uses', () => {
    // 'options-icon' existed in the markup with no rule anywhere, so half the
    // submenu buttons rendered at the browser default size and half at 36px.
    const used = classesInMarkup(editor);
    const defined = classesInStylesheet(editor);
    const unstyled = Array.from(used.keys())
      .filter((c) => !defined.has(c) && !intentionallyUnstyled.has(c) && !c.startsWith('ha-'));
    expect(unstyled, 'classes used in markup but never styled').toEqual([]);
  });

  it('has no two names for the same thing', () => {
    // Catches the singular/plural pair that caused the size mismatch.
    const used = Array.from(classesInMarkup(editor).keys());
    const collisions: string[] = [];
    for (const a of used) {
      for (const b of used) {
        if (a >= b) continue;
        if (a + 's' === b || b + 's' === a) collisions.push(`${a} / ${b}`);
      }
    }
    expect(collisions, 'suspiciously similar class names').toEqual([]);
  });

  it('has no CSS variable typos', () => {
    // '--mds-icon-button-size' sat in the source since 2022, silently falling
    // back to its default because that variable never existed. A typo shows up
    // in a var() reference rather than a definition, so check both.
    const suspicious = knownPrefixViolations(stylesheet(editor));
    expect(suspicious, 'CSS variables outside the known prefixes').toEqual([]);
  });
});

describe('the card stylesheet matches its markup', () => {
  it('styles every class it uses', () => {
    const used = classesInMarkup(card);
    const defined = classesInStylesheet(card);
    // Icon names are built as `clear-${dayOrNight}` and end up in class-like
    // strings; they are file names, not styles.
    const isIconName = (c: string) =>
      /^(a-|s-)/.test(c) ||
      /(day|night)$/.test(c) ||
      ['clear', 'cloudy', 'rainy', 'snowy', 'fog', 'wind', 'hail', 'drizzle',
       'dust', 'exceptional', 'thunderstorms', 'tornado', 'unknown'].some((p) => c.startsWith(p));
    // Per-slot '-text' classes and '-section' markers carry no rules on purpose:
    // they are stable hooks so a card-mod user can target one reading without
    // depending on the card's internal structure.
    const isHook = (c: string) => c.endsWith('-text') || c.endsWith('-section')
      || c === 'pressure-trend';
    const unstyled = Array.from(used.keys()).filter(
      (c) => !defined.has(c) && !isIconName(c) && !isHook(c) && !c.startsWith('ha-'),
    );
    expect(unstyled, 'classes used in markup but never styled').toEqual([]);
  });

  it('has no CSS variable typos', () => {
    const suspicious = knownPrefixViolations(stylesheet(card));
    expect(suspicious, 'CSS variables outside the known prefixes').toEqual([]);
  });
});

describe('editor rows use both their columns', () => {
  it('leaves a half empty only where it is justified', () => {
    // An empty half is wasted width on a phone, so most rows should fill both.
    // Two cases are legitimate: the last control in a section has nothing to
    // pair with, and a field carrying a hint is far taller than a switch, which
    // would leave its partner floating at the top of an oversized cell.
    // Column counting itself lives in editor.test.ts, against the rendered DOM —
    // nested blocks and conditional templates defeat any regex here.
    const solo = Array.from(
      editor.matchAll(
        /<div class="side-by-side">\s*<div>((?:(?!<\/div>\s*<div).)*?)<\/div>\s*<div><\/div>\s*<\/div>/gs,
      ),
    );
    const unjustified = solo.filter((m) => !m[1].includes('help-text'));
    expect(unjustified.length, 'rows with an empty half and no hint to justify it')
      .toBeLessThanOrEqual(3);
  });
});

describe('selects can show their stored value', () => {
  it('backs every select with a getter of the matching name', () => {
    // _valueChanged compares the incoming value against `this[_<configValue>]`.
    // Without that getter the comparison reads undefined, the update is skipped,
    // and the field renders blank however the config is set — which is exactly
    // what happened to the wind-decimals and text-alignment selects.
    const configValues = Array.from(
      editor.matchAll(/<select[^>]*\.configValue=\$\{'(\w+)'\}/g),
    ).map((m) => m[1]);
    expect(configValues.length).toBeGreaterThan(5);
    const missing = configValues.filter(
      (key) => !new RegExp(`get _${key}\\s*\\(`).test(editor),
    );
    expect(missing, 'selects whose value getter is missing').toEqual([]);
  });

  it('passes a string to every select, since a number matches no option', () => {
    for (const m of editor.matchAll(/<select[^>]*\.value=\$\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/g)) {
      const expr = m[1];
      const safe = expr.includes('String(') || expr.includes("|| ''")
        || expr.includes("?? ''") || expr.includes("? '' :")
        || /^this\._\w+$/.test(expr.trim());
      expect(safe, `select value not coerced to string: ${expr.slice(0, 70)}`).toBe(true);
    }
  });
});

describe('every section row is the same width', () => {
  it('gives each row four button slots', () => {
    // Rows differ in which buttons they need — Extended has no submenu, Charts
    // has no per-section editor — so without spacers their icons land in
    // different columns and the list looks ragged.
    const rows = ['overview', 'warnings', 'extended', 'slots', 'daily_forecast', 'charts', 'global_options'];
    for (const row of rows) {
      const m = new RegExp(`case '${row}':([\\s\\S]*?)(?=\\n      case '|\\n    \\})`).exec(editor);
      expect(m, `row ${row} not found`).not.toBeNull();
      const body = m![1];
      const buttons = (body.match(/<ha-icon-button/g) ?? []).length;
      const spacers = (body.match(/<div class="no-icon"><\/div>/g) ?? []).length;
      expect(buttons + spacers, `${row}: ${buttons} buttons + ${spacers} spacers`).toBe(4);
    }
  });
});

describe('the section list holds its shape', () => {
  it('keeps the label from wrapping', () => {
    // Without nowrap a two-word name like 'Глобални настройки' breaks onto a
    // second line and pushes the row's buttons out of line with every other
    // row. The label is the only part allowed to give way, by truncating.
    const rule = /\.section-title\s*\{([^}]*)\}/.exec(editor);
    expect(rule, '.section-title rule missing').not.toBeNull();
    const body = rule![1];
    expect(body, 'section title may wrap').toContain('white-space: nowrap');
    expect(body, 'section title cannot shrink').toContain('min-width: 0');
    expect(body, 'a long name would be cut off rather than ellipsised')
      .toContain('text-overflow: ellipsis');
  });

  it('lets the label shrink while the buttons stay put', () => {
    const label = /\.section-label\s*\{([^}]*)\}/.exec(editor);
    expect(label![1], 'label cannot shrink').toContain('min-width: 0');
    const buttons = /\.section-flex > div:last-child\s*\{([^}]*)\}/.exec(editor);
    expect(buttons, 'no rule pinning the button group').not.toBeNull();
    expect(buttons![1], 'buttons may be squeezed').toMatch(/flex:\s*0 0 auto/);
    expect(buttons![1], 'the button group may wrap onto a second line')
      .toContain('white-space: nowrap');
  });
});

describe('markup patterns stay consistent', () => {
  it('gives every select the shared class', () => {
    const total = (editor.match(/<select /g) ?? []).length;
    const styled = (editor.match(/<select class='ha-select-compat'/g) ?? []).length;
    expect(styled, 'selects without the shared class').toBe(total);
  });

  it('uses one icon-button class per role', () => {
    const classes = new Set(
      Array.from(editor.matchAll(/<ha-icon-button class="([\w-]+)"/g)).map((m) => m[1]),
    );
    // down, up, edit, submenu — four roles, four names
    expect(classes.size, `icon-button classes: ${Array.from(classes).join(', ')}`).toBeLessThanOrEqual(4);
  });

  it('pairs every switch with a label', () => {
    // Section rows label their switch with .section-title instead, so count
    // those separately rather than demanding one shape everywhere.
    const switches = (editor.match(/@click=\$\{this\._toggleVisibility\}/g) ?? []).length;
    const toggleLabels = (editor.match(/<span class="toggle-label">/g) ?? []).length;
    const sectionTitles = (editor.match(/<span class="section-title">/g) ?? []).length;
    expect(toggleLabels + sectionTitles).toBeGreaterThanOrEqual(switches);
  });
});

describe('slot icons sit on the same line as their neighbours', () => {
  // The UV alert icon lifted its whole row above the slot beside it: .slot-icon
  // was display:block with a fixed height, so an icon whose artwork sits high in
  // its own box was never centred within it.
  const card = readFileSync(join(__dirname, '..', 'src', 'platinum-weather-card.ts'), 'utf8');

  it('centres the icon inside its box', () => {
    const rule = /\.slot-icon\s*\{([^}]*)\}/.exec(card);
    expect(rule, '.slot-icon rule missing').not.toBeNull();
    expect(rule![1], 'icons are not vertically centred').toContain('align-items: center');
    expect(rule![1], 'block display leaves the icon wherever its artwork falls')
      .not.toMatch(/display:\s*block/);
  });

  it('pins the icon size, so one pack cannot shift the rows', () => {
    expect(card).toMatch(/\.slot-icon ha-icon\s*\{[^}]*--mdc-icon-size/);
  });
});
