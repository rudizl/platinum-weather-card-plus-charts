import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { sagerForecast, bearingToSector, windEvolution } from '../src/sager';
import { TRANSLATIONS, tSager } from '../src/translations';

// Sager reads the barometer, the sky and the way the wind has turned. The point
// of it is the case Zambretti cannot see: an overcast morning under a high,
// rising barometer, which a purely barometric method calls fine weather.

const base = {
  pressureHpa: 1015,
  trendHpaPerHour: 0,
  windBearingDeg: 180,
  windBearingSixHoursAgoDeg: 180,
  cloudCover: 0.1,
  rainRateMmH: 0,
  northernHemisphere: true,
};

describe('bearingToSector', () => {
  it('places the cardinals', () => {
    expect(bearingToSector(0)).toBe('N');
    expect(bearingToSector(90)).toBe('E');
    expect(bearingToSector(180)).toBe('S');
    expect(bearingToSector(270)).toBe('W');
  });

  it('rounds to the nearest of eight, as the instrument did', () => {
    // Sager works in eight sectors; the sixteen-point names collapse into them.
    expect(bearingToSector(22)).toBe('N');
    expect(bearingToSector(23)).toBe('NE');
    expect(bearingToSector(337)).toBe('NW');
    expect(bearingToSector(338)).toBe('N');
  });

  it('handles bearings outside 0-360', () => {
    expect(bearingToSector(360)).toBe('N');
    expect(bearingToSector(-90)).toBe('W');
    expect(bearingToSector(450)).toBe('E');
  });
});

describe('windEvolution', () => {
  it('calls a clockwise shift veering in the north', () => {
    expect(windEvolution(180, 270, true)).toBe('veering');
    expect(windEvolution(270, 180, true)).toBe('backing');
  });

  it('mirrors south of the equator, since the circulation does', () => {
    expect(windEvolution(180, 270, false)).toBe('backing');
    expect(windEvolution(270, 180, false)).toBe('veering');
  });

  it('ignores movement within one sector', () => {
    // The dial could not have registered it, and neither should we.
    expect(windEvolution(180, 195, true)).toBe('steady');
    expect(windEvolution(180, 200, true)).toBe('steady');
  });

  it('takes the shorter way round', () => {
    expect(windEvolution(350, 30, true)).toBe('veering');
    expect(windEvolution(30, 350, true)).toBe('backing');
  });
});

describe('the case that prompted this', () => {
  it('calls an overcast morning under a rising high cloudy, not fair', () => {
    // Weather Underground and Zambretti both said fine weather; the sky was
    // two-thirds covered.
    const result = sagerForecast({
      ...base, pressureHpa: 1020, trendHpaPerHour: 0.3,
      windBearingDeg: 225, windBearingSixHoursAgoDeg: 200, cloudCover: 0.68,
    })!;
    expect(result.weather).not.toBe('A');   // 'Fair'
    expect(['D', 'F']).toContain(result.weather); // unsettled
  });

  it('does call a clear sky under the same barometer fair', () => {
    const result = sagerForecast({
      ...base, pressureHpa: 1020, trendHpaPerHour: 0.3, cloudCover: 0.05,
      windBearingDeg: 0, windBearingSixHoursAgoDeg: 0,
    })!;
    // A, B and C are all 'fair'; which one depends on the wind quadrant.
    expect(['A', 'B', 'C']).toContain(result.weather);
  });
});

describe('the sky changes the forecast', () => {
  it('moves from fair through to unsettled as cloud increases', () => {
    const seen = [0.05, 0.4, 0.8].map((cloudCover) =>
      sagerForecast({ ...base, pressureHpa: 1022, cloudCover })!.weather);
    // clear and overcast must not produce the same answer
    expect(seen[0]).not.toBe(seen[2]);
  });

  it('treats rain as its own state, whatever the cloud figure says', () => {
    const dry = sagerForecast({ ...base, rainRateMmH: 0 })!;
    const wet = sagerForecast({ ...base, rainRateMmH: 2 })!;
    expect(wet.code[3]).toBe('4');
    expect(wet.weather).not.toBe(dry.weather);
  });

  it('assumes partly cloudy when there is no sky measurement at all', () => {
    // Without a pyranometer the algorithm should still work, just less sharply.
    const result = sagerForecast({ ...base, cloudCover: null })!;
    expect(result.code[3]).toBe('2');
  });
});

describe('the barometer still leads', () => {
  it('reads a fast fall as precipitation coming', () => {
    const result = sagerForecast({
      ...base, pressureHpa: 1002, trendHpaPerHour: -1.8, cloudCover: 0.9,
    })!;
    expect(['M', 'G', 'H', 'N']).toContain(result.weather);
  });

  it('reads rain under a fast rise as clearing soon', () => {
    const result = sagerForecast({
      ...base, pressureHpa: 1008, trendHpaPerHour: 1.6, rainRateMmH: 2,
      windBearingDeg: 315, windBearingSixHoursAgoDeg: 250,
    })!;
    expect(['T', 'W', 'R', 'S']).toContain(result.weather);
  });

  it('encodes the trend in the third position', () => {
    expect(sagerForecast({ ...base, trendHpaPerHour: 2 })!.code[2]).toBe('1');
    expect(sagerForecast({ ...base, trendHpaPerHour: 1 })!.code[2]).toBe('2');
    expect(sagerForecast({ ...base, trendHpaPerHour: 0 })!.code[2]).toBe('3');
    expect(sagerForecast({ ...base, trendHpaPerHour: -1 })!.code[2]).toBe('4');
    expect(sagerForecast({ ...base, trendHpaPerHour: -2 })!.code[2]).toBe('5');
  });
});

describe('the wind quadrant matters', () => {
  it('reads a falling barometer worse with a southerly than a northerly', () => {
    // The southerly and easterly quadrants carry moisture ahead of a depression.
    const southerly = sagerForecast({
      ...base, trendHpaPerHour: -1, windBearingDeg: 180,
      windBearingSixHoursAgoDeg: 180, cloudCover: 0.5,
    })!;
    const northerly = sagerForecast({
      ...base, trendHpaPerHour: -1, windBearingDeg: 0,
      windBearingSixHoursAgoDeg: 0, cloudCover: 0.5,
    })!;
    expect(southerly.weather).not.toBe(northerly.weather);
  });

  it('mirrors the quadrants in the southern hemisphere', () => {
    const north = sagerForecast({
      ...base, trendHpaPerHour: -1, windBearingDeg: 180,
      windBearingSixHoursAgoDeg: 180, northernHemisphere: true,
    })!;
    const south = sagerForecast({
      ...base, trendHpaPerHour: -1, windBearingDeg: 0,
      windBearingSixHoursAgoDeg: 0, northernHemisphere: false,
    })!;
    expect(south.weather).toBe(north.weather);
  });
});

describe('robustness', () => {
  it('returns null for an unusable pressure', () => {
    expect(sagerForecast({ ...base, pressureHpa: NaN })).toBeNull();
    expect(sagerForecast({ ...base, pressureHpa: 0 })).toBeNull();
  });

  it('works without a wind bearing at all', () => {
    const result = sagerForecast({
      ...base, windBearingDeg: null, windBearingSixHoursAgoDeg: null,
    });
    expect(result).not.toBeNull();
    expect(result!.code[1]).toBe('O');   // calm
  });

  it('always produces a five-character code', () => {
    for (const p of [980, 1000, 1013, 1030, 1045]) {
      for (const t of [-2, -1, 0, 1, 2]) {
        for (const c of [0, 0.5, 1]) {
          const r = sagerForecast({ ...base, pressureHpa: p, trendHpaPerHour: t, cloudCover: c })!;
          expect(r.code, `${p}/${t}/${c}`).toHaveLength(5);
        }
      }
    }
  });

  it('never produces a forecast letter without a translation', () => {
    const letters = new Set<string>();
    for (const p of [975, 990, 1005, 1015, 1025, 1040]) {
      for (const t of [-2, -1.2, -0.3, 0, 0.3, 1.2, 2]) {
        for (const c of [0, 0.4, 0.9]) {
          for (const rain of [0, 3]) {
            for (const b of [0, 90, 180, 270]) {
              const r = sagerForecast({
                ...base, pressureHpa: p, trendHpaPerHour: t, cloudCover: c,
                rainRateMmH: rain, windBearingDeg: b, windBearingSixHoursAgoDeg: b,
              })!;
              letters.add(r.weather);
            }
          }
        }
      }
    }
    expect(letters.size).toBeGreaterThan(5);
    for (const letter of letters) {
      expect(tSager('en', letter), `no phrase for forecast ${letter}`).not.toBe('');
    }
  });

  it('never produces a wind description without a translation', () => {
    for (const t of [-2, -1, 0, 1, 2]) {
      const r = sagerForecast({ ...base, trendHpaPerHour: t })!;
      expect(tSager('en', `wind_${r.windChange}`), `no phrase for wind ${r.windChange}`)
        .not.toBe('');
    }
  });
});

describe('translations', () => {
  const languages = Object.keys(TRANSLATIONS);

  it('has the same Sager keys in every language', () => {
    const reference = Object.keys(TRANSLATIONS.en.sager).sort();
    for (const lang of languages) {
      expect(Object.keys(TRANSLATIONS[lang].sager).sort(), `${lang}.sager`).toEqual(reference);
    }
  });

  it('keeps the phrases short enough for a card', () => {
    // Sager wrote for a printed manual: one of his forecasts runs to 96
    // characters, which wraps to three lines on a phone.
    for (const lang of languages) {
      for (const [key, phrase] of Object.entries(TRANSLATIONS[lang].sager)) {
        expect(phrase.length, `${lang}.${key} is ${phrase.length} characters`)
          .toBeLessThan(70);
      }
    }
  });
});

describe('the card falls back rather than guessing', () => {
  const card = readFileSync(join(__dirname, '..', 'src', 'platinum-weather-card.ts'), 'utf8');

  it('takes the six-hour bearing from an explicit entity', () => {
    // A frontend cannot remember six hours across a page reload, so the history
    // has to come from a helper the user creates.
    const getter = /get sagerForecastText\(\)[\s\S]*?\n  \}/.exec(card);
    expect(getter, 'sagerForecastText not found').not.toBeNull();
    expect(getter![0]).toContain('entity_wind_bearing_6h');
  });

  it('runs without it rather than refusing outright', () => {
    // It sharpens one branch; the other five inputs stand on their own, and the
    // sky measurement is the reason to choose Sager at all. Refusing without it
    // threw that away for the sake of an input that only fine-tunes.
    const getter = /get sagerForecastText\(\)[\s\S]*?\n  \}/.exec(card)![0];
    expect(getter, 'still refuses when the bearing is missing')
      .not.toMatch(/if \(!isFinite\(sixHourBearing\)\) return null;/);
    expect(getter, 'the missing case is not passed through as null')
      .toMatch(/isFinite\(sixHourBearing\) \? sixHourBearing : null/);
  });

  it('still falls back to Zambretti when the pressure is unusable', () => {
    expect(card).toContain('this.sagerForecastText ?? this.localForecastText');
  });

  it('lets the six-hour bearing change the forecast, having asked for it', () => {
    // It reached the code string but never the reasoning: for 640 combinations
    // of the other inputs, turning the wind through every sector changed
    // nothing. An input worth demanding a helper for should do something.
    let influential = 0;
    for (const pressureHpa of [995, 1005, 1015, 1025]) {
      for (const trendHpaPerHour of [-2, -1, 0, 1, 2]) {
        for (const cloudCover of [0, 0.3, 0.6, 0.9]) {
          for (const windBearingDeg of [0, 90, 180, 270]) {
            const seen = new Set<string>();
            for (const six of [0, 45, 90, 135, 180, 225, 270, 315]) {
              seen.add(sagerForecast({
                ...base, pressureHpa, trendHpaPerHour, cloudCover, windBearingDeg,
                windBearingSixHoursAgoDeg: six,
              })!.weather);
            }
            if (seen.size > 1) influential += 1;
          }
        }
      }
    }
    expect(influential, 'the six-hour bearing never changes the forecast')
      .toBeGreaterThan(0);
  });

  it('lets it matter only where the sign is real', () => {
    // A backing wind under a falling barometer is a warm front arriving. On a
    // steady or rising barometer the same turn means little, and at a coastal
    // site it is usually just the sea breeze running its daily clock.
    const steady = new Set<string>();
    for (const six of [0, 90, 180, 270]) {
      steady.add(sagerForecast({
        ...base, trendHpaPerHour: 0, windBearingSixHoursAgoDeg: six,
      })!.weather);
    }
    expect(steady.size, 'wind evolution moves the forecast on a steady barometer')
      .toBe(1);
  });

  it('shares the barometer with Zambretti rather than reading it twice', () => {
    // Two readings of the same sensor could disagree after a units change or an
    // altitude correction applied in one place and not the other.
    expect(card).toContain('_forecastPressureHpa');
    const getter = /get sagerForecastText\(\)[\s\S]*?\n  \}/.exec(card)![0];
    expect(getter).toContain('this._forecastPressureHpa');
  });
});

describe('a sky more than half covered is not fair weather', () => {
  // At 59% cloud the card said 'Fair', because the threshold sat at 60%. No
  // observer looking at a sky that covered would call it fine.
  it('calls anything past half cover cloudy', () => {
    for (const cloudCover of [0.5, 0.59, 0.7, 0.9]) {
      const result = sagerForecast({
        ...base, pressureHpa: 1020, trendHpaPerHour: 0.3, cloudCover,
      })!;
      expect(result.code[3], `${Math.round(cloudCover * 100)}% should be overcast`).toBe('3');
      expect(result.weather, `${Math.round(cloudCover * 100)}% should not be fair`)
        .not.toBe('A');
    }
  });

  it('still calls a genuinely clear sky fair', () => {
    const result = sagerForecast({
      ...base, pressureHpa: 1020, trendHpaPerHour: 0.3, cloudCover: 0.1,
      windBearingDeg: 0, windBearingSixHoursAgoDeg: 0,
    })!;
    expect(result.code[3]).toBe('1');
    expect(['A', 'B', 'C']).toContain(result.weather);
  });

  it('places the bands on the oktas an observer would report', () => {
    // 0-2 oktas clear, 3-4 partly cloudy, 5 and up cloudy.
    expect(sagerForecast({ ...base, cloudCover: 0.24 })!.code[3]).toBe('1');
    expect(sagerForecast({ ...base, cloudCover: 0.26 })!.code[3]).toBe('2');
    expect(sagerForecast({ ...base, cloudCover: 0.49 })!.code[3]).toBe('2');
    expect(sagerForecast({ ...base, cloudCover: 0.51 })!.code[3]).toBe('3');
  });
});

describe('the forecast reads as a sentence', () => {
  const card = readFileSync(join(__dirname, '..', 'src', 'platinum-weather-card.ts'), 'utf8');

  it('ends the forecast before the wind clause begins', () => {
    // Sager's forecasts are phrases, not sentences: without a full stop the
    // card rendered 'Fair Wind: little change.'
    const getter = /get sagerForecastText\(\)[\s\S]*?\n  \}/.exec(card)![0];
    expect(getter, 'no full stop is added after the forecast')
      .toMatch(/\[.!\?\]\$\/\.test\(text\)|text \+= '\.'/);
  });

  it('does not double the full stop when the phrase already has one', () => {
    const getter = /get sagerForecastText\(\)[\s\S]*?\n  \}/.exec(card)![0];
    expect(getter).toContain('!/[.!?]$/.test(text)');
  });
});

describe('the wind clause earns its line', () => {
  const card = readFileSync(join(__dirname, '..', 'src', 'platinum-weather-card.ts'), 'utf8');

  it('is omitted when the wind is not expected to change', () => {
    // 'U' is Sager's 'no important change' and the commonest outcome: printing
    // it every time spends half a line reporting that nothing is happening.
    const getter = /get sagerForecastText\(\)[\s\S]*?\n  \}/.exec(card)![0];
    expect(getter, 'the no-change case is not filtered out')
      .toMatch(/result\.windChange !== 'U'/);
  });

  it('still shows the cases that matter', () => {
    // A falling barometer tightens the gradient, and on a coast that is worth
    // knowing before it arrives.
    const falling = sagerForecast({ ...base, trendHpaPerHour: -1.5 })!;
    expect(falling.windChange).not.toBe('U');
    const rising = sagerForecast({ ...base, trendHpaPerHour: 2 })!;
    expect(rising.windChange).not.toBe('U');
  });

  it('reports no change on a steady barometer', () => {
    expect(sagerForecast({ ...base, trendHpaPerHour: 0 })!.windChange).toBe('U');
  });
});

describe('the sentence reads as prose', () => {
  const card = readFileSync(join(__dirname, '..', 'src', 'platinum-weather-card.ts'), 'utf8');
  const getter = /get sagerForecastText\(\)[\s\S]*?\n  \}/.exec(card)![0];

  it('names the sky, since Sager\'s phrases alone are very terse', () => {
    // 'Fair' on its own is a poor showing next to Zambretti's full sentence,
    // and the card has measured the sky anyway.
    expect(getter).toContain('sky_clear');
    expect(getter).toContain('forecastCloudFraction');
  });

  it('gives the sky its own sentence', () => {
    // Several forecasts end in a temperature clause, so appending the sky to
    // them produced 'cooler under overcast' — one muddled thought.
    expect(getter, 'the sky is appended rather than made its own sentence')
      .toMatch(/text \+= ` \$\{sky\}\.`/);
  });

  it('does not repeat a tendency the forecast already states', () => {
    // 'Precipitation and warmer. Temperature: warmer.' is clumsy.
    expect(getter).toContain('alreadySaid');
    const withTendency = ['B', 'C', 'E', 'F', 'H', 'K', 'L', 'N', 'S', 'W', 'Y'];
    for (const letter of withTendency) {
      expect(tSager('en', letter), `${letter} should carry a tendency`)
        .toMatch(/warmer|cooler/i);
    }
  });

  it('drops both optional clauses when neither says anything', () => {
    const calm = sagerForecast({ ...base, trendHpaPerHour: 0, cloudCover: 0.1 })!;
    expect(calm.windChange).toBe('U');
    expect(calm.temperature).toBe('steady');
  });
});

describe('the forecast keeps a sky reading overnight', () => {
  const card = readFileSync(join(__dirname, '..', 'src', 'platinum-weather-card.ts'), 'utf8');

  it('falls back to the last daylight reading rather than nothing', () => {
    // A pyranometer says nothing after dark, which is exactly when Sager loses
    // the advantage it was chosen for. The sky seldom turns over completely
    // between dusk and dawn, so yesterday's is better than none.
    const getter = /get forecastCloudFraction\(\)[\s\S]*?\n  \}/.exec(card);
    expect(getter, 'no forecast-specific cloud getter').not.toBeNull();
    expect(getter![0]).toContain('_lastDaylightCloud');
  });

  it('gives up on a reading over a day old', () => {
    // Beyond that it is a guess about a different weather system.
    const getter = /get forecastCloudFraction\(\)[\s\S]*?\n  \}/.exec(card)![0];
    expect(getter).toContain('86400000');
  });

  it('shares the remembered reading across cards', () => {
    // Same reason the averaging buffer is static: it describes the sky.
    expect(card).toMatch(/private static _lastDaylightCloud/);
  });

  it('leaves the slot showing dashes at night', () => {
    // The slot reports a measurement, and there is none after dark — only the
    // forecast is better served by a stale figure than by nothing.
    const slot = /get slotCloudCover\(\)[\s\S]*?\n  \}/.exec(card)![0];
    expect(slot).toContain('measuredCloudFraction');
    expect(slot).not.toContain('forecastCloudFraction');
  });
});

describe('a clear sky is not unsettled weather', () => {
  // 'Unsettled. The sky is clear.' reads as a contradiction because it was one:
  // the pressure was merely below average, not low and falling.
  it('calls a clear sky on a steady barometer fair, whatever the pressure', () => {
    for (const pressureHpa of [995, 1005, 1008.9, 1015, 1030]) {
      const result = sagerForecast({
        ...base, pressureHpa, trendHpaPerHour: 0, cloudCover: 0.05,
      })!;
      expect(['A', 'B', 'C'], `${pressureHpa} hPa clear and steady`)
        .toContain(result.weather);
    }
  });

  it('still warns when the barometer is falling, clear sky or not', () => {
    // A front announces itself in the barometer before it appears overhead.
    const result = sagerForecast({
      ...base, pressureHpa: 1002, trendHpaPerHour: -1, cloudCover: 0.05,
      windBearingDeg: 180, windBearingSixHoursAgoDeg: 180,
    })!;
    expect(['A', 'B', 'C']).not.toContain(result.weather);
  });

  it('reserves unsettled for a genuinely low barometer under cloud', () => {
    const result = sagerForecast({
      ...base, pressureHpa: 1003, trendHpaPerHour: 0, cloudCover: 0.35,
    })!;
    expect(['D', 'E', 'F']).toContain(result.weather);
  });

  it('never pairs a fair forecast with an overcast sky', () => {
    // The reverse of the same mistake: high pressure with the sky covered is
    // anticyclonic gloom, not fine weather.
    const result = sagerForecast({
      ...base, pressureHpa: 1025, trendHpaPerHour: 0, cloudCover: 0.8,
    })!;
    expect(['A', 'B', 'C']).not.toContain(result.weather);
  });
});

describe('the algorithm holds together across its whole input range', () => {
  // Sweeping the inputs catches the contradictions that spot checks miss —
  // 'Unsettled. The sky is clear.' survived several rounds of manual testing.
  const FAIR = ['A', 'B', 'C'];
  const MIXED = ['D', 'E', 'F', 'X', 'Y'];
  const rank = (letter: string) =>
    FAIR.includes(letter) ? 0 : MIXED.includes(letter) ? 1 : 2;

  const pressures = [975, 990, 1000, 1008, 1015, 1022, 1035];
  const trends = [-2, -1, -0.3, 0, 0.3, 1, 2];
  const clouds = [0, 0.3, 0.6, 0.95];
  const bearings = [0, 45, 90, 135, 180, 225, 270, 315];

  it('never calls it fair while it is raining', () => {
    for (const pressureHpa of pressures) {
      for (const trendHpaPerHour of trends) {
        for (const windBearingDeg of bearings) {
          const r = sagerForecast({
            ...base, pressureHpa, trendHpaPerHour, windBearingDeg,
            windBearingSixHoursAgoDeg: windBearingDeg, cloudCover: 0.9, rainRateMmH: 2,
          })!;
          expect(FAIR, `${pressureHpa}/${trendHpaPerHour} raining`).not.toContain(r.weather);
        }
      }
    }
  });

  it('never calls it fair under an overcast sky', () => {
    for (const pressureHpa of pressures) {
      for (const trendHpaPerHour of trends) {
        const r = sagerForecast({
          ...base, pressureHpa, trendHpaPerHour, cloudCover: 0.95,
        })!;
        expect(FAIR, `${pressureHpa}/${trendHpaPerHour} overcast`).not.toContain(r.weather);
      }
    }
  });

  it('never improves the forecast as cloud increases', () => {
    for (const pressureHpa of pressures) {
      for (const trendHpaPerHour of trends) {
        for (const windBearingDeg of bearings) {
          let previous = -1;
          for (const cloudCover of [0, 0.2, 0.4, 0.6, 0.8, 1]) {
            const r = sagerForecast({
              ...base, pressureHpa, trendHpaPerHour, cloudCover, windBearingDeg,
              windBearingSixHoursAgoDeg: windBearingDeg,
            })!;
            expect(rank(r.weather), `more cloud gave a better forecast at ${pressureHpa} hPa`)
              .toBeGreaterThanOrEqual(previous);
            previous = rank(r.weather);
          }
        }
      }
    }
  });

  it('never improves the forecast as the barometer falls', () => {
    for (const pressureHpa of pressures) {
      for (const cloudCover of clouds) {
        for (const windBearingDeg of bearings) {
          let previous = -1;
          for (const trendHpaPerHour of [2, 1, 0, -1, -2]) {
            const r = sagerForecast({
              ...base, pressureHpa, trendHpaPerHour, cloudCover, windBearingDeg,
              windBearingSixHoursAgoDeg: windBearingDeg,
            })!;
            expect(rank(r.weather), `a falling barometer improved the forecast at ${pressureHpa} hPa`)
              .toBeGreaterThanOrEqual(previous);
            previous = rank(r.weather);
          }
        }
      }
    }
  });

  it('mirrors between hemispheres about the north-south axis', () => {
    // East stays east: ahead of a depression the air arrives from the east in
    // both hemispheres. Only the poleward and equatorward sides swap.
    const mirrored: Record<number, number> = {
      0: 180, 45: 135, 90: 90, 135: 45, 180: 0, 225: 315, 270: 270, 315: 225,
    };
    for (const pressureHpa of [1000, 1015, 1030]) {
      for (const trendHpaPerHour of [-1, 0, 1]) {
        for (const cloudCover of [0, 0.5, 0.9]) {
          for (const windBearingDeg of bearings) {
            const north = sagerForecast({
              ...base, pressureHpa, trendHpaPerHour, cloudCover, windBearingDeg,
              windBearingSixHoursAgoDeg: windBearingDeg, northernHemisphere: true,
            })!;
            const south = sagerForecast({
              ...base, pressureHpa, trendHpaPerHour, cloudCover,
              windBearingDeg: mirrored[windBearingDeg],
              windBearingSixHoursAgoDeg: mirrored[windBearingDeg],
              northernHemisphere: false,
            })!;
            expect(south.weather, `${windBearingDeg}° north vs ${mirrored[windBearingDeg]}° south`)
              .toBe(north.weather);
          }
        }
      }
    }
  });

  it('can reach every forecast it has a phrase for', () => {
    // Three of Sager's twenty-one were unreachable: the logic had no path to
    // 'showers and warmer', or to either of the two 'improving' variants that
    // also turn cooler. A phrase that can never appear is a phrase that was
    // translated thirteen times for nothing.
    const reached = new Set<string>();
    for (const pressureHpa of pressures) {
      for (const trendHpaPerHour of trends) {
        for (const cloudCover of clouds) {
          for (const rainRateMmH of [0, 1, 5, 15]) {
            for (const windBearingDeg of bearings) {
              for (const windBearingSixHoursAgoDeg of [0, 90, 180, 270]) {
                reached.add(sagerForecast({
                  ...base, pressureHpa, trendHpaPerHour, cloudCover, rainRateMmH,
                  windBearingDeg, windBearingSixHoursAgoDeg,
                })!.weather);
              }
            }
          }
        }
      }
    }
    const translated = Object.keys(TRANSLATIONS.en.sager)
      .filter((k) => /^[A-Z]$/.test(k));
    const unreachable = translated.filter((letter) => !reached.has(letter));
    expect(unreachable, 'forecasts with a phrase but no path to them').toEqual([]);
  });
});

describe('a gap between showers is not fine weather', () => {
  // 27 August: rain at 20:00, nothing at 21:00 and 22:00, rain again at 23:00.
  // In the gap the forecast read 'fair, cooler' — the card was reading the
  // instantaneous rate and nothing else.
  const card = readFileSync(join(__dirname, '..', 'src', 'platinum-weather-card.ts'), 'utf8');

  it('holds on to a recent shower for the forecast', () => {
    const getter = /get forecastRainRate\(\)[\s\S]*?\n  \}/.exec(card);
    expect(getter, 'no forecast-specific rain getter').not.toBeNull();
    expect(getter![0]).toContain('_lastRain');
  });

  it('lets go after ninety minutes', () => {
    // About the length of a gap within one convective spell; beyond that the
    // shower is over and holding on would be wishful.
    const getter = /get forecastRainRate\(\)[\s\S]*?\n  \}/.exec(card)![0];
    expect(getter).toContain('5400000');
  });

  it('reports the remembered rain as showery, not at full strength', () => {
    // It is not raining this minute. Carrying 12 mm/h forward would forecast a
    // downpour from a puddle.
    const getter = /get forecastRainRate\(\)[\s\S]*?\n  \}/.exec(card)![0];
    expect(getter).toMatch(/Math\.min\(last\.rate, 1\)/);
  });

  it('leaves the slot reading the true rate', () => {
    // The slot reports what the gauge says now; only the forecast has reason to
    // remember.
    const slot = /get slotRainRate\(\)[\s\S]*?\n  \}/.exec(card)![0];
    expect(slot).toContain('measuredRainRate');
    expect(slot).not.toContain('forecastRainRate');
  });

  it('changes the forecast in the gap', () => {
    // The conditions of that evening: 1018.4 hPa, rising slowly, sky unknown
    // after dark.
    const base = {
      pressureHpa: 1018.4, trendHpaPerHour: 0.17, windBearingDeg: 337,
      windBearingSixHoursAgoDeg: 197, cloudCover: null, northernHemisphere: true,
    };
    const forgotten = sagerForecast({ ...base, rainRateMmH: 0 })!;
    const remembered = sagerForecast({ ...base, rainRateMmH: 1 })!;
    expect(remembered.weather, 'remembering the shower changed nothing')
      .not.toBe(forgotten.weather);
    expect(['A', 'B', 'C'], 'still calls a showery evening fair')
      .not.toContain(remembered.weather);
  });
});
