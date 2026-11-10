// The quality of the air (#42): particulates in µg/m³, banded by the European Air Quality Index of the EEA as revised in 2024 (ETC HE Report
// 2024/17, published July 2025: bands on the guidelines of the WHO of 2021, for hourly values). Six bands, from good to extremely poor; the
// tables give the upper bound of the first five, in whole micrograms.

export type Pollutant = 'pm25' | 'pm10';
export const AIR_BANDS = ['good', 'fair', 'moderate', 'poor', 'very_poor', 'extremely_poor'] as const;
export const AIR_UPPER: Record<Pollutant, number[]> = {
  pm25: [5, 15, 50, 90, 140],
  pm10: [15, 45, 120, 195, 270],
};
// the colours of the UV slot, from green to purple: the number of the slot is coloured, the icon is not
export const AIR_COLOURS = ['#4caf50', '#8bc34a', '#ffc107', '#ff9800', '#f44336', '#9c27b0'];
export const POOR = 3;

// the band of a concentration, 0 (good) to 5 (extremely poor); the tables are in whole micrograms, so a reading is rounded first
export function airBand(p: Pollutant, microgramsPerM3: number): number {
  const v = Math.round(microgramsPerM3);
  const i = AIR_UPPER[p].findIndex((upper) => v <= upper);
  return i === -1 ? 5 : i;
}

// Home Assistant writes the micro with the Greek letter (μg/m³), others with the micro sign (µg/m³), and some in plain letters
export function isMicrograms(unit: unknown): boolean {
  return typeof unit === 'string' && /^\s*[μµu]g\s*\/\s*m(³|3|\^3)\s*$/i.test(unit);
}

// micrograms in one unit of a concentration: 1 for µg/m³, 1000 for mg/m³, null for anything else (an index, say), which is not banded
export function microgramsPer(unit: unknown): number | null {
  if (isMicrograms(unit)) return 1;
  if (typeof unit === 'string' && /^\s*mg\s*\/\s*m(³|3|\^3)\s*$/i.test(unit)) return 1000;
  return null;
}
