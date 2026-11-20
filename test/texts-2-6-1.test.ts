import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { TRANSLATIONS } from '../src/translations';

// Small things found in the review of 9 November: the hint of a custom icon path was written in English in the editor while its translation
// sat unused in every language; two Bulgarian texts had a misspelt word and an English one; and the README gave the bands of the icon as 55%
// and 85%, when the card has used 50% and 75% since 2.6.0.

const read = (p: string) => readFileSync(join(__dirname, '..', p), 'utf8');
const editorTexts = (lang: string) => (TRANSLATIONS as Record<string, { editor: Record<string, string> }>)[lang].editor;

describe('2.6.1: words', () => {
  it('the hint of a custom icon path is the translation, not English for everyone', () => {
    expect(read('src/editor.ts')).not.toContain('Use {condition} as placeholder');
    expect(read('src/editor.ts')).toContain('this._t("icon_path_hint")');
    for (const lang of Object.keys(TRANSLATIONS)) expect(editorTexts(lang).icon_path_hint, lang).toContain('{condition}');
  });
  it('the Bulgarian texts say it in Bulgarian, and spell it right', () => {
    const bg = editorTexts('bg');
    expect(bg.icon_path_hint).not.toMatch(/плейсхол/);
    expect(bg.forecast_altitude_hint).not.toMatch(/sea-level/);
  });
  it('the README gives the bands of the icon the card uses', () => {
    const readme = read('README.md');
    expect(readme).toContain('lightly cloudy to 50%, cloudy to 75%');
    expect(readme).not.toContain('lightly cloudy to 55%');
  });
});
