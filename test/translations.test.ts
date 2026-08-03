import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { TRANSLATIONS, tCard, tEditor, tZambretti, tWarning, tMoonPhase, tUnit } from '../src/translations';

const SRC = join(__dirname, '..', 'src');
const languages = Object.keys(TRANSLATIONS);
const sections = ['editor', 'card', 'zambretti', 'zambrettiLong', 'warning'] as const;

describe('translation files', () => {
  it('registers every language file that exists on disk', () => {
    const onDisk = readdirSync(join(SRC, 'translations'))
      .filter((f) => f.endsWith('.ts') && !['index.ts', 'types.ts'].includes(f))
      .map((f) => f.replace('.ts', ''))
      .sort();
    expect(languages.slice().sort()).toEqual(onDisk);
  });

  it('offers every registered language in the editor dropdown', () => {
    // A language nobody can select might as well not exist — this went wrong once
    // when Czech was merged without being added to the picker.
    const editor = readFileSync(join(SRC, 'editor.ts'), 'utf8');
    for (const lang of languages) {
      expect(editor, `${lang} missing from the locale dropdown`).toContain(`value="${lang}"`);
    }
  });

  // Every language must carry exactly the same keys as English. Missing keys fall
  // back silently, so nothing looks broken while half a card stays in English.
  for (const section of sections) {
    it(`has the same ${section} keys in every language`, () => {
      const reference = Object.keys(TRANSLATIONS.en[section]).sort();
      for (const lang of languages) {
        const keys = Object.keys(TRANSLATIONS[lang][section]).sort();
        const missing = reference.filter((k) => !keys.includes(k));
        const extra = keys.filter((k) => !reference.includes(k));
        expect(missing, `${lang}.${section} is missing keys`).toEqual([]);
        expect(extra, `${lang}.${section} has keys English does not`).toEqual([]);
      }
    });
  }

  it('has no empty translations', () => {
    for (const lang of languages) {
      for (const section of sections) {
        for (const [key, value] of Object.entries(TRANSLATIONS[lang][section])) {
          expect(value.trim(), `${lang}.${section}.${key} is empty`).not.toBe('');
        }
      }
    }
  });

  it('covers the full Zambretti table', () => {
    const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
    for (const lang of languages) {
      for (const letter of letters) {
        expect(TRANSLATIONS[lang].zambretti[letter], `${lang} short ${letter}`).toBeTruthy();
        expect(TRANSLATIONS[lang].zambrettiLong[letter], `${lang} long ${letter}`).toBeTruthy();
      }
      for (const clause of ['rising', 'steady', 'falling']) {
        expect(TRANSLATIONS[lang].zambrettiLong[clause], `${lang} ${clause}`).toBeTruthy();
      }
    }
  });

  it('covers every MeteoAlarm hazard type and level', () => {
    // The EUMETNET CAP profile numbers hazards 1-15 and levels 2-4.
    for (const lang of languages) {
      for (let t = 1; t <= 15; t++) {
        if (t === 11) continue; // 11 is not used by the profile; 12 and 13 cover flooding
        expect(TRANSLATIONS[lang].warning[`type_${t}`], `${lang} type_${t}`).toBeTruthy();
      }
      for (const l of [2, 3, 4]) {
        expect(TRANSLATIONS[lang].warning[`level_${l}`], `${lang} level_${l}`).toBeTruthy();
      }
      expect(TRANSLATIONS[lang].warning.until, `${lang} until`).toBeTruthy();
    }
  });
});

describe('keys referenced by the code exist', () => {
  const card = readFileSync(join(SRC, 'platinum-weather-card.ts'), 'utf8');
  const editor = readFileSync(join(SRC, 'editor.ts'), 'utf8');

  it('resolves every tCard key used in the card', () => {
    const used = new Set<string>();
    const re = /tCard\(this\.locale,\s*(?:this\.compact \? )?'([^']+)'(?:\s*:\s*'([^']+)')?\)/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(card)) !== null) {
      used.add(m[1]);
      if (m[2]) used.add(m[2]);
    }
    expect(used.size).toBeGreaterThan(0);
    for (const key of used) {
      // tCard falls back to the key itself, which is how "uv_rating 6" once
      // reached the card instead of "UV 6".
      expect(tCard('en', key), `card key ${key}`).not.toBe(key);
    }
  });

  it('resolves every editor label', () => {
    const used = new Set(
      Array.from(editor.matchAll(/this\._t\("([^"]+)"\)/g)).map((m) => m[1]),
    );
    expect(used.size).toBeGreaterThan(0);
    for (const key of used) {
      expect(tEditor('en', key), `editor key ${key}`).not.toBe(key);
    }
  });
});

describe('lookup helpers', () => {
  it('falls back to English for an unknown language', () => {
    expect(tCard('xx', 'forecast_max')).toBe(tCard('en', 'forecast_max'));
    expect(tZambretti('xx', 'a')).toBe(tZambretti('en', 'a'));
  });

  it('accepts a regional locale', () => {
    expect(tCard('bg-BG', 'forecast_max')).toBe(tCard('bg', 'forecast_max'));
    expect(tCard('EN-GB', 'forecast_max')).toBe(tCard('en', 'forecast_max'));
  });

  it('treats an undefined locale as English', () => {
    expect(tCard(undefined, 'forecast_max')).toBe(tCard('en', 'forecast_max'));
  });

  it('returns the short and long Zambretti variants separately', () => {
    const short = tZambretti('en', 'a');
    const long = tZambretti('en', 'a', true);
    expect(short).toBeTruthy();
    expect(long).toBeTruthy();
    expect(long.length).toBeGreaterThan(short.length);
    expect(long.endsWith('.')).toBe(true);
  });

  it('returns an empty string for an unknown warning key, so the caller can fall back', () => {
    expect(tWarning('en', 'type_999')).toBe('');
  });

  it('translates every moon phase', () => {
    for (const phase of [
      'new_moon', 'waxing_crescent', 'first_quarter', 'waxing_gibbous',
      'full_moon', 'waning_gibbous', 'last_quarter', 'waning_crescent',
    ]) {
      expect(tMoonPhase('en', phase), phase).toBeTruthy();
      expect(tMoonPhase('bg', phase), `bg ${phase}`).toBeTruthy();
    }
  });

  it('localises units', () => {
    expect(tUnit('en', 'mm')).toBeTruthy();
    expect(tUnit('bg', 'mm')).toBeTruthy();
  });
});
