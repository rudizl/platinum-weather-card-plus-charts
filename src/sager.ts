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
  // Oktas, as an observer would report them: clear or nearly so up to 2/8,
  // partly cloudy to 4/8, more than half covered is 'cloudy' — which is the
  // point at which calling it fine weather stops being defensible.
  if (cloudCover < 0.25) return '1';             // 0-2 oktas
  if (cloudCover < 0.50) return '2';             // 3-4 oktas
  return '3';                                     // 5 oktas and up
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

  const trend = trendDigit(trendHpaPerHour);
  const sky = skyDigit(cloudCover, rainRateMmH);
  const code = pressureLetter(pressureHpa) + windDigit(sector) + trend + sky
    + evolutionDigit(evolution);

  const raining = sky === '4';
  const overcast = sky === '3' || raining;
  const clear = sky === '1';
  const fallingFast = trend === '5';
  const falling = trend === '4' || fallingFast;
  const risingFast = trend === '1';
  const rising = trend === '2' || risingFast;
  const low = pressureHpa < 1005.76;
  const high = pressureHpa > 1019.30;

  // Where the air is coming from. In the northern hemisphere the southerly and
  // easterly quadrants carry moisture ahead of a depression; northerly and
  // westerly bring the drier air behind it. South of the equator it mirrors.
  const wetQuadrant = sector !== null && (northernHemisphere
    ? ['E', 'SE', 'S', 'SW'].includes(sector)
    : ['E', 'NE', 'N', 'NW'].includes(sector));
  const coldQuadrant = sector !== null && (northernHemisphere
    ? ['N', 'NE', 'NW'].includes(sector)
    : ['S', 'SE', 'SW'].includes(sector));

  // Sager's own letters, so the output is comparable with any other
  // implementation of the instrument rather than particular to this card.
  let weather: string;
  if (raining) {
    if (risingFast) weather = coldQuadrant ? 'W' : 'T';   // clearing within 6 hours
    else if (rising) weather = coldQuadrant ? 'S' : 'R';  // clearing within 12
    else if (falling) weather = wetQuadrant ? 'N' : 'M';  // precipitation continuing
    else weather = coldQuadrant ? 'L' : 'J';              // showers
  } else if (fallingFast) {
    weather = overcast ? 'M' : wetQuadrant ? 'H' : 'G';
  } else if (falling) {
    if (overcast) weather = wetQuadrant ? 'G' : 'D';
    else weather = wetQuadrant ? 'H' : 'E';
  } else if (rising && overcast) {
    weather = coldQuadrant ? 'Y' : 'X';                   // unsettled then fair
  } else if (rising) {
    weather = coldQuadrant ? 'C' : 'B';                   // fair, cooler or warmer
  } else if (overcast) {
    weather = low ? 'D' : coldQuadrant ? 'F' : 'D';       // unsettled
  } else if (clear) {
    // A clear sky on a steady barometer is settled weather, whatever the
    // absolute pressure. Calling it unsettled because the reading is merely
    // below average produced 'Unsettled. The sky is clear.' — which reads as a
    // contradiction because it is one. Only a low and falling barometer
    // justifies the word, and a falling one is handled above.
    weather = coldQuadrant ? 'C' : 'A';
  } else {
    // Partly cloudy: unsettled only when the pressure is genuinely low.
    weather = low ? 'D' : coldQuadrant ? 'C' : 'A';
  }

  // Wind velocity, again with Sager's letters.
  const windChange = fallingFast ? (low ? 'S' : 'N')
    : falling ? 'N'
    : risingFast ? 'D'
    : 'U';

  const temperature = coldQuadrant && rising ? 'cooler'
    : wetQuadrant && falling ? 'warmer'
    : 'steady';

  return { weather, windChange, temperature, code };
}
