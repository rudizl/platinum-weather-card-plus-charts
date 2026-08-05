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
  it('has no more than two rows with an empty half', () => {
    // Each empty half is wasted width on a phone. A couple are legitimate —
    // the last control in a section has nothing to pair with — but a growing
    // number means options were appended without thought for the layout.
    const solo = Array.from(
      editor.matchAll(
        /<div class="side-by-side">\s*<div>(?:(?!<\/div>\s*<div).)*?<\/div>\s*<div><\/div>\s*<\/div>/gs,
      ),
    );
    expect(solo.length, 'rows with an empty right-hand column').toBeLessThanOrEqual(2);
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
