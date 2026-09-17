import type { Translation } from './types';
import en from './en';
import bg from './bg';
import da from './da';
import de from './de';
import es from './es';
import fr from './fr';
import he from './he';
import it from './it';
import nl from './nl';
import pl from './pl';
import ru from './ru';
import ua from './ua';
import cs from './cs';

export type { Translation };

export const TRANSLATIONS: Record<string, Translation> = { en, bg, da, de, es, fr, he, it, nl, pl, ru, ua, cs };

// Editor string: keyed by HA UI language, falls back to English, then the key itself
export function tEditor(lang: string, key: string): string {
  const l = (lang || 'en').split('-')[0].toLowerCase();
  return TRANSLATIONS[l]?.editor[key] ?? TRANSLATIONS.en.editor[key] ?? key;
}

// Card string: keyed by the card's configured locale (option_locale)
export function tCard(locale: string | undefined, key: string): string {
  const l = (locale || 'en').split('-')[0].toLowerCase();
  return TRANSLATIONS[l]?.card[key] ?? TRANSLATIONS.en.card[key] ?? key;
}

export function tMoonPhase(locale: string | undefined, phase: string): string {
  const l = (locale || 'en').split('-')[0].toLowerCase();
  return TRANSLATIONS[l]?.moonPhases[phase]
    ?? TRANSLATIONS.en.moonPhases[phase]
    ?? phase.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// Unit label localization (e.g. km/h → км/ч for Cyrillic locales)
export function tUnit(locale: string | undefined, unit: string): string {
  const l = (locale || 'en').split('-')[0].toLowerCase();
  return TRANSLATIONS[l]?.units?.[unit] ?? unit;
}

// Zambretti forecast text by letter code 'a'..'z' (or 'rising'/'steady'/'falling'
// clauses in the long set). verbose=true selects the full-sentence variant.
export function tZambretti(locale: string | undefined, letter: string, verbose = false): string {
  const l = (locale || 'en').split('-')[0].toLowerCase();
  const set = verbose ? 'zambrettiLong' : 'zambretti';
  return TRANSLATIONS[l]?.[set]?.[letter] ?? TRANSLATIONS.en[set][letter] ?? '';
}

// Weather-warning wording by key ('type_5', 'level_2', 'until'). Returns an empty
// string for unknown keys so the caller can fall back to the provider's own text.
export function tWarning(locale: string | undefined, key: string): string {
  const l = (locale || 'en').split('-')[0].toLowerCase();
  return TRANSLATIONS[l]?.warning?.[key] ?? TRANSLATIONS.en.warning[key] ?? '';
}

// Sager forecast wording by key: a letter for the forecast itself ('A', 'M'),
// 'wind_' plus a letter for the wind, 'temp_' plus a word for the tendency.
export function tSager(locale: string | undefined, key: string): string {
  const l = (locale || 'en').split('-')[0].toLowerCase();
  return TRANSLATIONS[l]?.sager?.[key] ?? TRANSLATIONS.en.sager[key] ?? '';
}

export function tWindDirections(locale: string | undefined): string[] {
  const l = (locale || 'en').split('-')[0].toLowerCase();
  const dirs = TRANSLATIONS[l]?.windDirections;
  return dirs && dirs.length ? dirs : TRANSLATIONS.en.windDirections;
}
