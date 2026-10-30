import { describe, it, expect } from 'vitest';
import { tCard, tEditor, tSager, tMoonPhase, TRANSLATIONS } from '../src/translations';

// Home Assistant names Ukrainian `uk` (ISO 639-1); the card keeps its Ukrainian as `ua`, so a house in Ukrainian got English.
const ua = TRANSLATIONS.ua;
const cardKey = Object.keys(ua.card).find((k) => ua.card[k] !== TRANSLATIONS.en.card[k])!;
const editorKey = Object.keys(ua.editor).find((k) => ua.editor[k] !== TRANSLATIONS.en.editor[k])!;
const sagerKey = Object.keys(ua.sager).find((k) => ua.sager[k] !== TRANSLATIONS.en.sager[k])!;

describe('Ukrainian, as Home Assistant names it', () => {
  it('the keys chosen differ from the English ones', () => {
    expect([cardKey, editorKey, sagerKey].every(Boolean)).toBe(true);
  });
  for (const lang of ['uk', 'uk-UA', 'UK', 'ua']) {
    it(`${lang} is the Ukrainian of the card, of the editor and of Sager`, () => {
      expect(tCard(lang, cardKey)).toBe(ua.card[cardKey]);
      expect(tEditor(lang, editorKey)).toBe(ua.editor[editorKey]);
      expect(tSager(lang, sagerKey)).toBe(ua.sager[sagerKey]);
      expect(tMoonPhase(lang, 'full_moon')).toBe(ua.moonPhases.full_moon);
    });
  }
  it('the other languages are as before', () => {
    expect(tCard('bg', cardKey)).toBe(TRANSLATIONS.bg.card[cardKey]);
    expect(tCard('sr-Latn', cardKey)).toBe(TRANSLATIONS['sr-Latn'].card[cardKey]);
    expect(tCard('sr', cardKey)).toBe(TRANSLATIONS.sr.card[cardKey]);
    expect(tCard('en-GB', cardKey)).toBe(TRANSLATIONS.en.card[cardKey]);
  });
});
