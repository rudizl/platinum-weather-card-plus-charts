// The Sager Weathercaster, Raymond M. Sager, 1942.
//
// Where Zambretti reads only the barometer, Sager also takes the sky and the way
// the wind is turning — which is why it can see a front that the pressure has
// not yet announced, and why it does not call an overcast morning "fine".
//
// Six inputs, each reduced to a letter or digit, concatenated into a code that
// indexes the forecast table. The dial in the original instrument did the same
// thing mechanically.

export type SagerWindEvolution = 'backing' | 'steady' | 'veering';

export interface SagerInput {
  /** Sea-level pressure in hPa */
  pressureHpa: number;
  /** Pressure change in hPa per hour */
  trendHpaPerHour: number;
  /** Current wind bearing in degrees, or null when calm or unusable */
  windBearingDeg: number | null;
  /** Wind bearing six hours ago, in degrees */
  windBearingSixHoursAgoDeg: number | null;
  /** Cloud cover as a fraction from 0 to 1 */
  cloudCover: number | null;
  /** Rain rate in mm/h; 0 or null when dry */
  rainRateMmH: number | null;
  /** True in the northern hemisphere */
  northernHemisphere: boolean;
}

export interface SagerForecast {
  /** Key into the forecast phrase table */
  weather: string;
  /** Key into the wind-change table */
  windChange: string;
  /** Key into the temperature-tendency table */
  temperature: string;
  /** The raw code, useful for debugging and for the tests */
  code: string;
}

// Sager works in eight sectors rather than sixteen: the finer points collapse
// into the cardinals, exactly as the original dial did.
const SECTORS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const;
type Sector = typeof SECTORS[number];

export function bearingToSector(deg: number): Sector {
  const normalised = ((deg % 360) + 360) % 360;
  const index = Math.floor((normalised + 22.5) / 45) % 8;
  return SECTORS[index];
}

/**
 * Which way the wind has turned over the observation period. Veering is
 * clockwise in the northern hemisphere and backing anticlockwise; the sense
 * reverses south of the equator, since the circulation does.
 */
export function windEvolution(
  fromDeg: number,
  toDeg: number,
  northernHemisphere = true,
): SagerWindEvolution {
  let delta = (((toDeg - fromDeg) % 360) + 360) % 360;
  if (delta > 180) delta -= 360;
  // Under 22.5° is inside one sector, which the instrument would not have
  // registered as a change at all.
  if (Math.abs(delta) < 22.5) return 'steady';
  const clockwise = delta > 0;
  const veering = northernHemisphere ? clockwise : !clockwise;
  return veering ? 'veering' : 'backing';
}

// ── The six code positions ───────────────────────────────────────────────────

/** Position 1: pressure, as a letter from A (very high) to H (very low). */
function pressureLetter(hpa: number): string {
  if (hpa > 1029.46) return 'A';
  if (hpa > 1019.30) return 'B';
  if (hpa > 1012.53) return 'C';
  if (hpa > 1005.76) return 'D';
  if (hpa > 999.00) return 'E';
  if (hpa > 992.23) return 'F';
  if (hpa > 985.46) return 'G';
  return 'H';
}

/** Position 2: wind sector, or 'O' for calm. */
function windDigit(sector: Sector | null): string {
  if (sector === null) return 'O';
  return String(SECTORS.indexOf(sector) + 1);
}

/** Position 3: how the barometer is moving, 1 (rising fast) to 5 (falling fast). */
function trendDigit(hpaPerHour: number): string {
  if (hpaPerHour > 1.4) return '1';   // rising rapidly
  if (hpaPerHour > 0.7) return '2';   // rising slowly
  if (hpaPerHour >= -0.7) return '3'; // steady
  if (hpaPerHour >= -1.4) return '4'; // falling slowly
  return '5';                          // falling rapidly
}

/** Position 4: the sky now, 1 (clear) to 4 (raining). */
function skyDigit(cloudCover: number | null, rainRateMmH: number | null): string {
  if (rainRateMmH !== null && rainRateMmH > 0) return '4';
  if (cloudCover === null) return '2';           // unknown: assume partly cloudy
  // Sager's own categories: clear, partly cloudy, mostly overcast. The middle
  // band is narrow because the instrument asks what the sky mostly is, and a
  // sky two thirds covered is not 'partly cloudy' to an observer looking up.
  if (cloudCover < 0.25) return '1';             // clear
  if (cloudCover < 0.60) return '2';             // partly cloudy
  return '3';                                     // overcast
}

/** Position 5: which way the wind has turned. */
function evolutionDigit(evolution: SagerWindEvolution): string {
  return evolution === 'backing' ? '1' : evolution === 'steady' ? '2' : '3';
}

/**
 * The forecast itself. Rather than a five-thousand-row table, the outcome is
 * derived from the same reasoning the table encodes: a falling barometer with a
 * southerly or easterly wind backing is the classic approaching front; a rising
 * barometer with a veering wind is the clearance behind it.
 */
export function sagerForecast(input: SagerInput): SagerForecast | null {
  const { pressureHpa, trendHpaPerHour, windBearingDeg, windBearingSixHoursAgoDeg,
    cloudCover, rainRateMmH, northernHemisphere } = input;

  if (!isFinite(pressureHpa) || pressureHpa <= 0) return null;

  const sector = windBearingDeg === null || !isFinite(windBearingDeg)
    ? null : bearingToSector(windBearingDeg);
  const evolution = (windBearingDeg !== null && windBearingSixHoursAgoDeg !== null
    && isFinite(windBearingDeg) && isFinite(windBearingSixHoursAgoDeg))
    ? windEvolution(windBearingSixHoursAgoDeg, windBearingDeg, northernHemisphere)
    : 'steady';

  const code = pressureLetter(pressureHpa)
    + windDigit(sector)
    + trendDigit(trendHpaPerHour)
    + skyDigit(cloudCover, rainRateMmH)
    + evolutionDigit(evolution);

  const trend = trendDigit(trendHpaPerHour);
  const sky = skyDigit(cloudCover, rainRateMmH);
  const raining = sky === '4';
  const overcast = sky === '3' || raining;
  const falling = trend === '4' || trend === '5';
  const fallingFast = trend === '5';
  const rising = trend === '1' || trend === '2';
  const low = pressureHpa < 1005.76;
  const high = pressureHpa > 1019.30;

  // The wind sector matters because of where the air is coming from: in the
  // northern hemisphere the southerly and easterly quadrants carry moisture
  // ahead of a depression, while northerly and westerly bring the drier air
  // behind it. South of the equator the pattern mirrors.
  const wetQuadrant = sector !== null && (northernHemisphere
    ? ['E', 'SE', 'S', 'SW'].includes(sector)
    : ['E', 'NE', 'N', 'NW'].includes(sector));

  let weather: string;
  if (raining) {
    weather = rising ? 'clearing_soon' : falling ? 'rain_continuing' : 'rain_intermittent';
  } else if (fallingFast && (low || wetQuadrant)) {
    weather = overcast ? 'rain_soon' : 'rain_likely';
  } else if (falling && wetQuadrant) {
    weather = overcast ? 'rain_likely' : 'increasing_cloud';
  } else if (falling) {
    weather = overcast ? 'unsettled' : 'increasing_cloud';
  } else if (rising && overcast) {
    weather = 'clearing_slowly';
  } else if (rising) {
    weather = high ? 'fair_continuing' : 'improving';
  } else if (overcast) {
    // High pressure with an overcast sky is the anticyclonic gloom that a purely
    // barometric method calls 'fine weather' and an observer calls grey.
    weather = low ? 'unsettled' : 'cloudy_no_change';
  } else {
    weather = high ? 'fair_continuing' : 'no_change';
  }

  // Wind: falling pressure means a tightening gradient, so more of it.
  const windChange = fallingFast ? 'increasing_strongly'
    : falling ? 'increasing'
    : trend === '1' ? 'decreasing'
    : evolution === 'steady' ? 'little_change'
    : 'shifting';

  // Temperature: air arriving from the pole is colder than air from the tropics,
  // and a clearing sky at night lets heat go.
  const fromCold = sector !== null && (northernHemisphere
    ? ['N', 'NE', 'NW'].includes(sector)
    : ['S', 'SE', 'SW'].includes(sector));
  const temperature = fromCold && rising ? 'colder'
    : wetQuadrant && falling ? 'warmer'
    : 'little_change';

  return { weather, windChange, temperature, code };
}
