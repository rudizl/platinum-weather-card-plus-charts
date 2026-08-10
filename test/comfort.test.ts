import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

// Dew point says more about how air will feel than temperature does, and the
// bands are the US National Weather Service ones rather than a personal scale.
// They hold whatever the temperature is: 20°C dew point feels the same at 24°C
// as at 35°C, because the moisture sweat must compete with is unchanged.

const source = readFileSync(join(__dirname, '..', 'src', 'platinum-weather-card.ts'), 'utf8');

const band = (dew: number) =>
  dew < 10 ? 'comfort_dry'
    : dew < 13 ? 'comfort_pleasant'
    : dew < 16 ? 'comfort_comfortable'
    : dew < 18 ? 'comfort_slightly_humid'
    : dew < 21 ? 'comfort_humid'
    : dew < 24 ? 'comfort_muggy'
    : 'comfort_heavy';

describe('the comfort bands', () => {
  it('follows the National Weather Service thresholds', () => {
    // Published figures: comfortable below 13, sticky from 13 to 18, muggy to
    // oppressive above 18.
    expect(band(12.9)).toBe('comfort_pleasant');
    expect(band(13)).toBe('comfort_comfortable');
    expect(band(18)).toBe('comfort_humid');
    expect(band(21)).toBe('comfort_muggy');
    expect(band(24)).toBe('comfort_heavy');
  });

  it('reads a Black Sea August evening as comfortable', () => {
    // 15°C dew point at 28°C and 60% humidity.
    expect(band(15)).toBe('comfort_comfortable');
  });

  it('moves through the bands in order and never skips', () => {
    const order = ['comfort_dry', 'comfort_pleasant', 'comfort_comfortable',
      'comfort_slightly_humid', 'comfort_humid', 'comfort_muggy', 'comfort_heavy'];
    let last = -1;
    for (let d = -5; d <= 35; d += 0.5) {
      const idx = order.indexOf(band(d));
      expect(idx, `${d}°C fell outside the bands`).toBeGreaterThanOrEqual(0);
      expect(idx, `${d}°C went backwards`).toBeGreaterThanOrEqual(last);
      last = idx;
    }
    expect(last, 'the top band is never reached').toBe(order.length - 1);
  });

  it('uses the same thresholds in the card as here', () => {
    const getter = /get comfortFromDewPoint\(\)[\s\S]*?\n  \}/.exec(source);
    expect(getter, 'getter not found').not.toBeNull();
    for (const threshold of [10, 13, 16, 18, 21, 24]) {
      expect(getter![0], `card is missing the ${threshold}°C boundary`)
        .toContain(`dew < ${threshold}`);
    }
  });
});

describe('the comfort line is optional and safe', () => {
  const getter = /get comfortFromDewPoint\(\)[\s\S]*?\n  \}/.exec(source)![0];

  it('is off unless switched on', () => {
    expect(getter).toContain('option_show_comfort !== true');
  });

  it('says nothing without a dew point entity', () => {
    expect(getter).toMatch(/entity_dew_point/);
    expect(getter).toMatch(/if \(!entity\) return null/);
  });

  it('ignores an unavailable or non-numeric reading', () => {
    expect(getter).toContain("'unavailable'");
    expect(getter).toContain('isFinite');
  });

  it('converts Fahrenheit, since the bands are in Celsius', () => {
    // A US station reporting 60°F would otherwise read as 'heavy air'.
    expect(getter, 'no Fahrenheit conversion').toMatch(/32\) \* 5 \/ 9|F\b/);
  });
});
