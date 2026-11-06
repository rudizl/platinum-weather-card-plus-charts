import { describe, it, expect } from 'vitest';
import '../src/platinum-weather-card';
import { makeHass, makeForecast, baseConfig, renderCard } from './helpers';
import { TRANSLATIONS } from '../src/translations';

// The editor offers Ukrainian as `ua`, the card's code for its Ukrainian; but the language code of Ukrainian is `uk`, and Intl does not
// know `ua`: it falls back to English, so a card set to Ukrainian wrote its days and dates in English. Intl is given `uk`; the
// translations of the card are as before.

type El = HTMLElement & Record<string, any>;
const day = new Date('2026-10-29T12:00:00Z');
const ukWeekday = day.toLocaleDateString('uk', { weekday: 'long' });
const enWeekday = day.toLocaleDateString('en', { weekday: 'long' });

async function card(option_locale: string): Promise<El> {
  const forecast = makeForecast(5);
  return (await renderCard(
    baseConfig({ weather_entity: 'weather.home', section_order: ['daily_forecast'], option_locale, daily_forecast_days: 4, option_show_current_day: true } as never),
    makeHass({ 'weather.home': { state: 'sunny', attributes: { temperature: 21.5, humidity: 60 } } }, { forecast }),
  )) as El;
}

describe('a card set to Ukrainian writes its dates in Ukrainian', () => {
  it('the Ukrainian of Intl is not the English one (the test means something)', () => {
    expect(ukWeekday).not.toBe(enWeekday);
  });

  it('the days of the strip are Ukrainian', async () => {
    const el = await card('ua');
    const text = el.shadowRoot?.textContent ?? '';
    const days = Array.from({ length: 7 }, (_, i) => new Date(Date.UTC(2026, 9, 26 + i, 12)));
    expect(days.some((d) => text.includes(d.toLocaleDateString('uk', { weekday: 'short' })))).toBe(true);
    expect(days.some((d) => text.includes(d.toLocaleDateString('en', { weekday: 'short' })))).toBe(false);
  });

  it('a number is written as Ukrainian writes it', async () => {
    const el = await card('ua');
    expect((21.5).toLocaleString(el.locale)).toBe((21.5).toLocaleString('uk'));
  });

  it('the translations of the card stay Ukrainian', async () => {
    const el = await card('ua');
    const key = Object.keys(TRANSLATIONS.ua.card).find((k) => TRANSLATIONS.ua.card[k] !== TRANSLATIONS.en.card[k])!;
    const { tCard } = await import('../src/translations');
    expect(tCard(el.locale, key)).toBe(TRANSLATIONS.ua.card[key]);
  });

  it('the other languages are passed on as they are', async () => {
    expect((await card('bg')).locale).toBe('bg');
    expect((await card('sr-Latn')).locale).toBe('sr-Latn');
  });
});
