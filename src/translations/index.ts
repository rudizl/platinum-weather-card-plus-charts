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

export type { Translation };

export const TRANSLATIONS: Record<string, Translation> = { en, bg, da, de, es, fr, he, it, nl, pl, ru, ua };

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

export function tWindDirections(locale: string | undefined): string[] {
  const l = (locale || 'en').split('-')[0].toLowerCase();
  const dirs = TRANSLATIONS[l]?.windDirections;
  return dirs && dirs.length ? dirs : TRANSLATIONS.en.windDirections;
}
