import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

// The Bulgarian texts had English words in them: "Binary sensor", "Statistics помощник", "Tooltip-ове", "Weather entity". A Bulgarian text
// says it in Bulgarian. The names of Home Assistant's helpers come first as Home Assistant itself shows them in Bulgarian, with the
// English name after them in brackets, so that they can be found in a Home Assistant in any language: „Статистика“ (Statistics).

// Names of products and methods, abbreviations and units, which are written so in Bulgarian too.
const ANYWHERE = new Set([
  'Home', 'Assistant', 'MeteoAlarm', 'Sager', 'Zambretti', 'UV', 'PM2.5', 'PM10',
  'hPa', 'mm', 'in', 'kn', 'W', 'm', 'h', 's', 'g', 'n', // units, and the n of „n-ти“
]);
// The English names of helpers and domains of Home Assistant: only in brackets, after the Bulgarian name.
const IN_BRACKETS = new Set(['Statistics', 'Derivative', 'Trend', 'weather']);
// Values that are settings for the code, not text.
const NOT_TEXT = new Set(['lower_after_level']);

const src = readFileSync(join(__dirname, '..', 'src', 'translations', 'bg.ts'), 'utf8');

describe('the Bulgarian texts', () => {
  it('have no English words but names, units and helper names in brackets', () => {
    const found: string[] = [];
    src.split('\n').forEach((line, i) => {
      const m = /^\s*"([a-z0-9_]+)":\s*"((?:[^"\\]|\\.)*)"/.exec(line);
      if (!m || NOT_TEXT.has(m[1])) return;
      const text = m[2]
        .replace(/\{[a-z_]+\}/g, '')         // {n}, {condition}
        .replace(/\/[\w./{}-]+/g, '');       // paths such as /local/icons/x.svg
      // a name alone in its brackets, as in „Статистика“ (Statistics); a longer bracket that names it in passing does not count
      const bracketed = new Set([...text.matchAll(/\(([^()]*)\)/g)].map((b) => b[1].trim()));
      for (const w of text.match(/[A-Za-z][A-Za-z0-9.]*/g) ?? []) {
        const word = w.replace(/\.$/, '');
        if (ANYWHERE.has(word)) continue;
        if (IN_BRACKETS.has(word) && bracketed.has(word)) continue;
        found.push(`bg.ts:${i + 1} ${m[1]}: ${word}`);
      }
    });
    expect(found).toEqual([]);
  });

  // The words of the national weather service (NIMH): „барична тенденция“, not „тренд“; „дъждомер“, not „валежомер“.
  it('use the terms of NIMH', () => {
    const wrong = src.split('\n').map((l, i) => [i + 1, l] as const).filter(([, l]) => /тренд|валежомер/i.test(l)).map(([n, l]) => `bg.ts:${n}: ${l.trim()}`);
    expect(wrong).toEqual([]);
  });
});
