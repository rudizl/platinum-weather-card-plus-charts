import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { TRANSLATIONS } from '../src/translations';

// Every text of the editor and the card is translated into fifteen languages, so a key that nothing reads any more is fifteen texts that
// translators keep up for nothing (hourly_mode_hint, u_v_rating and ten more were left behind by 2.6 and 2.7). A key is read when the code
// names it in quotes, or builds it from a prefix (`effects_${v}`, `air_${band}`).

const SRC = join(__dirname, '..', 'src');
const code = readdirSync(SRC).filter((f) => f.endsWith('.ts')).map((f) => readFileSync(join(SRC, f), 'utf8')).join('\n');
const prefixes = [...code.matchAll(/[`'"]([a-z0-9_]+?)_\$\{/g)].map((m) => m[1]);
const read = (key: string) => new RegExp(`['"\`]${key}['"\`]`).test(code) || prefixes.some((p) => key.startsWith(`${p}_`));

describe('the keys of the translations', () => {
  for (const section of ['editor', 'card'] as const) {
    it(`of the ${section}: each is read somewhere in the code`, () => {
      const en = (TRANSLATIONS as unknown as Record<string, Record<string, Record<string, unknown>>>).en[section];
      expect(Object.keys(en).length).toBeGreaterThan(20);
      expect(Object.keys(en).filter((k) => !read(k))).toEqual([]);
    });
  }
});
