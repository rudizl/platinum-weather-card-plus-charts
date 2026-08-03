import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

// Each of these guards a bug that reached users. They are deliberately written
// against the source text rather than a rendered card: the card needs a live
// Home Assistant to render, while these failures were all visible in the source.

const SRC = join(__dirname, '..', 'src');
const card = readFileSync(join(SRC, 'platinum-weather-card.ts'), 'utf8');
const editor = readFileSync(join(SRC, 'editor.ts'), 'utf8');

describe('every unsafeHTML input is escaped or numeric', () => {
  // Found by @frenck in HACS review: forecast descriptions and unit strings come
  // from entity attributes and were interpolated into HTML without escaping.
  it('has an escape helper', () => {
    expect(card).toContain('_escapeHtml');
  });

  it('escapes the values that enter the tooltip markup', () => {
    // The tooltip builder assembles an HTML string; anything originating from an
    // entity must pass through esc() before it lands in it.
    for (const fragment of ['${esc(date)}', '${esc(condition)}']) {
      expect(card, `tooltip interpolation ${fragment} must be escaped`).toContain(fragment);
    }
    // and the unit strings, which come from entity attributes as well
    expect(card).toContain('esc(this._localizeUnit(');
  });

  it('validates wind bearings before they reach a style attribute', () => {
    // A non-finite bearing would otherwise be written straight into
    // style="transform:rotate(NaNdeg)".
    const rotations = card.match(/transform:rotate\(\$\{[^}]*\}/g) ?? [];
    expect(rotations.length).toBeGreaterThan(0);
    for (const r of rotations) {
      expect(r, `unguarded rotation: ${r}`).toContain('Number(');
    }
  });
});

describe('no undefined identifiers in rendering paths', () => {
  // v2.2.1 shipped with `startIdx` referenced but no longer declared, throwing
  // ReferenceError and aborting the render of both the chart and the forecast.
  // The type checker catches this now; this test states the expectation.
  it('does not reference startIdx, removed when the chart moved to date lookup', () => {
    expect(card).not.toContain('startIdx');
  });

  it('runs the type checker as part of the build', () => {
    const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf8'));
    expect(pkg.scripts.build).toContain('typecheck');
    expect(pkg.scripts.typecheck).toContain('tsc');
  });

  it('excludes node types, which silently aborted tsc before it reached src', () => {
    const tsconfig = readFileSync(join(__dirname, '..', 'tsconfig.json'), 'utf8');
    expect(tsconfig).toMatch(/"types"\s*:\s*\[\s*\]/);
  });
});

describe('one compass table, not four', () => {
  // Cyrillic bearings were added to COMPASS_DEG, but three inline copies of the
  // Latin-only map elsewhere meant the forecast arrows stayed blank.
  it('keeps a single compass table', () => {
    const inlineTables = card.match(/NNE\s*:\s*22/g) ?? [];
    expect(inlineTables.length).toBe(1);
  });

  it('understands Cyrillic bearings', () => {
    // Weather Underground mixes them with Latin ones in the same response.
    for (const dir of ['С', 'И', 'Ю', 'З', 'ЮИ', 'ССЗ', 'В']) {
      expect(card, `missing bearing ${dir}`).toContain(`'${dir}'`);
    }
  });
});

describe('slots survive missing data', () => {
  // "unavailable NaNkm/h (Gust NaNkm/h)" was wide enough to break the layout.
  const guarded = [
    'currentHumidity', 'currentRainfall', 'currentPressure', 'currentVisibility',
    'currentWindSpeed', 'currentWindGust', 'currentWindBearing',
  ];

  for (const getter of guarded) {
    it(`${getter} guards against unknown and unavailable`, () => {
      const start = card.indexOf(`get ${getter}(`);
      expect(start, `${getter} not found`).toBeGreaterThan(-1);
      const body = card.slice(start, card.indexOf('\n  }', start));
      expect(body, `${getter} would render NaN`).toContain('unavailable');
    });
  }
});

describe('lifecycle', () => {
  // A second updated() silently replaced the first under JS class semantics,
  // killing the forecast subscription with no warning from tsc or eslint.
  it('declares updated() exactly once', () => {
    const matches = card.match(/^\s{2}(?:protected\s+)?updated\s*\(/gm) ?? [];
    expect(matches.length).toBe(1);
  });

  it('keeps the forecast subscription inside it', () => {
    const start = card.search(/^\s{2}(?:protected\s+)?updated\s*\(/m);
    const body = card.slice(start, card.indexOf('\n  }', start));
    expect(body).toContain('_subscribeForecastEvents');
  });
});

describe('editor stays consistent with the card', () => {
  it('has no dead Material variables for elements the editor no longer uses', () => {
    for (const gone of ['ha-formfield {', 'ha-switch {', '--mds-']) {
      expect(editor, `dead rule: ${gone}`).not.toContain(gone);
    }
  });

  it('registers every section in both the type list and the renderer', () => {
    const types = readFileSync(join(SRC, 'types.ts'), 'utf8');
    const declared = types
      .match(/export const sectionNames = \[([^\]]*)\]/)![1]
      .match(/'([^']+)'/g)!
      .map((s) => s.replace(/'/g, ''));
    for (const section of declared) {
      expect(card, `${section} missing from validSections`).toContain(`'${section}'`);
      if (section !== 'charts') {
        // charts renders alongside daily_forecast rather than from its own case
        expect(card, `${section} has no render case`).toMatch(
          new RegExp(`case '${section}':`),
        );
      }
    }
  });
});
