// Zambretti forecaster (Negretti & Zambra, 1915).
// Own TypeScript implementation of the classic algorithm as documented at
// meteormetrics.com and popularized by the beteljuice.co.uk JS forecaster.
// Inputs:
//   pressure  — sea-level pressure in hPa
//   month     — 1..12
//   windDeg   — direction the wind is coming FROM in degrees, or null when calm/unknown
//   trend     — pressure change in hPa/hour (>= +0.1 rising, <= -0.1 falling, else steady)
//   north     — true for northern hemisphere
// Returns letter code 'a'..'z' (26 forecast texts), or null when pressure is not usable.

// Pressure offset per 16-point compass sector (N, NNE, NE, ... NNW).
// Wind from the northerly quadrant raises the effective pressure (drier
// continental air), southerly lowers it (moist maritime air).
const WIND_ADJ_HPA = [
  5.2, 4.2, 3.2, 1.05, -1.1, -3.15, -5.2, -8.35,
  -11.5, -9.4, -7.3, -5.25, -3.2, -1.15, 0.9, 3.05,
];

const LUT_RISING = 'abbcfgijlmmqty';
const LUT_STEADY = 'abbbeknnppswwxxxz';
const LUT_FALLING = 'bdhoruvxxz';

export function zambrettiLetter(
  pressure: number,
  month: number,
  windDeg: number | null,
  trend: number,
  north: boolean,
  baroTop = 1050.0,
  baroBottom = 950.0,
): string | null {
  if (!isFinite(pressure) || pressure <= 0) return null;
  // Normalise station's barometer range onto the canonical 950..1050 hPa scale
  let p = 950.0 + (100.0 * (pressure - baroBottom)) / (baroTop - baroBottom);

  // Wind direction correction
  if (windDeg !== null && isFinite(windDeg)) {
    let sector = Math.round((((windDeg % 360) + 360) % 360) / 22.5) % 16;
    if (!north) sector = (sector + 8) % 16; // southern hemisphere: flip 180°
    p += WIND_ADJ_HPA[sector];
  }

  const summer = month >= 4 && month <= 9; // meteorological "summer half" (N hemisphere)
  let f: number;
  let lut: string;
  if (trend >= 0.1) {
    if (north === summer) p += 3.2; // rising in local summer → improve outlook
    f = 0.174 * (1031.4 - p);
    lut = LUT_RISING;
  } else if (trend <= -0.1) {
    if (north === summer) p -= 3.2; // falling in local summer → worsen outlook
    f = 0.1553 * (1029.95 - p);
    lut = LUT_FALLING;
  } else {
    f = 0.2314 * (1030.81 - p);
    lut = LUT_STEADY;
  }
  const idx = Math.min(Math.max(Math.round(f), 0), lut.length - 1);
  return lut.charAt(idx);
}

// Convert a pressure reading to hPa based on its unit of measurement string
export function pressureToHpa(value: number, uom: string | undefined): number {
  const u = (uom || '').toLowerCase().replace(/\s/g, '');
  if (u === 'inhg' || u === '"hg') return value * 33.8639;
  if (u === 'mmhg' || u === 'torr') return value * 1.33322;
  if (u === 'kpa') return value * 10.0;
  if (u === 'psi') return value * 68.9476;
  if (u === 'pa') return value / 100.0;
  return value; // hPa / mbar / mb / unknown → assume hPa
}

// Station (absolute) pressure → sea-level pressure, barometric formula.
// altitude in meters, temperature in °C (defaults to 15 °C when unknown).
export function seaLevelPressure(stationHpa: number, altitude: number, temperatureC = 15): number {
  if (!altitude) return stationHpa;
  const kelvin = temperatureC + 273.15;
  return stationHpa * Math.pow(1 - (0.0065 * altitude) / (kelvin + 0.0065 * altitude), -5.257);
}

// Convert a wind speed reading to km/h based on its unit of measurement string
export function windSpeedToKmh(value: number, uom: string | undefined): number {
  const u = (uom || '').toLowerCase().replace(/\s/g, '');
  if (u === 'm/s' || u === 'ms') return value * 3.6;
  if (u === 'mph' || u === 'mi/h') return value * 1.60934;
  if (u === 'kn' || u === 'kt' || u === 'knots') return value * 1.852;
  if (u === 'ft/s' || u === 'fps') return value * 1.09728;
  return value; // km/h or unknown → assume km/h
}

// Expected rate of change of the semidiurnal atmospheric tide, in hPa/hour.
//
// Atmospheric pressure breathes twice a day: maxima near 10:00 and 22:00 local
// solar time, minima near 04:00 and 16:00. The amplitude scales with latitude,
// roughly 1.16·cos²(lat) hPa — about ±0.6 hPa at 43°N, which means a slope of
// up to 0.32 hPa/h. That is several times the threshold a naive implementation
// uses to call the pressure "falling", so without this correction the forecast
// deteriorates every afternoon and improves every morning on its own, whatever
// the weather is doing.
//
// date      — the moment to evaluate
// latitude  — station latitude in degrees
// longitude — station longitude in degrees (used to convert clock time to solar time)
// windowHours must match the averaging window of the trend sensor: the tidal
// slope swings from -0.32 to -0.02 hPa/h within three hours, so the instantaneous
// value would be the wrong thing to subtract from an hour-averaged trend.
export function tidalTrendHpaPerHour(
  date: Date,
  latitude: number,
  longitude: number,
  windowHours = 3,
): number {
  const amplitude = 1.16 * Math.pow(Math.cos((latitude * Math.PI) / 180), 2);
  const utcOffsetHours = -date.getTimezoneOffset() / 60;
  const solarHoursAt = (d: Date): number =>
    d.getHours() + d.getMinutes() / 60 + d.getSeconds() / 3600 - utcOffsetHours + longitude / 15;
  // P(t) = A·cos(2π(t − 10)/12); the mean slope over the window is simply the
  // pressure difference across it divided by its length.
  const tideAt = (t: number): number => amplitude * Math.cos((2 * Math.PI * (t - 10)) / 12);
  const now = solarHoursAt(date);
  return (tideAt(now) - tideAt(now - windowHours)) / windowHours;
}

// Clear-sky irradiance on a horizontal surface, in W/m². Depends only on where
// the sun is and how much atmosphere its light crosses, so it can be computed
// without any external data.
//
// The 0.7 transmittance is the standard clear-atmosphere constant. Real skies
// vary with aerosol and humidity, so this reads slightly high in hazy places and
// slightly low in very clean air; good enough to tell clear from overcast, not a
// radiometric instrument.
export function clearSkyIrradiance(sunElevationDeg: number, altitudeM = 0): number {
  if (sunElevationDeg <= 0) return 0;
  const zenithRad = ((90 - sunElevationDeg) * Math.PI) / 180;
  // Kasten-Young air mass: the plain 1/cos(z) blows up near the horizon
  const airMass =
    1 / (Math.cos(zenithRad) + 0.50572 * Math.pow(96.07995 - (90 - sunElevationDeg), -1.6364));
  const solarConstant = 1367;
  return (
    solarConstant *
    Math.pow(0.7, Math.pow(airMass, 0.678)) *
    Math.cos(zenithRad) *
    (1 + altitudeM * 0.00008)
  );
}

// Cloud cover as a fraction from 0 (clear) to 1 (overcast), or null when the sun
// is too low for the measurement to mean anything — below about 10° the air mass
// model softens and morning haze distorts the reading, and at night there is no
// signal at all.
export function cloudCoverFraction(
  measuredWm2: number,
  sunElevationDeg: number,
  altitudeM = 0,
  minElevationDeg = 10,
): number | null {
  if (!isFinite(measuredWm2) || measuredWm2 < 0) return null;
  if (sunElevationDeg < minElevationDeg) return null;
  const clear = clearSkyIrradiance(sunElevationDeg, altitudeM);
  if (clear <= 0) return null;
  const ratio = measuredWm2 / clear;
  // Thin cloud can scatter more onto a horizontal surface than a clear sky
  // delivers, so a ratio slightly above 1 is normal rather than an error.
  return Math.min(Math.max(1 - ratio, 0), 1);
}

// Cloud cover in oktas, the eighths meteorologists report.
export function cloudCoverOktas(fraction: number): number {
  return Math.round(Math.min(Math.max(fraction, 0), 1) * 8);
}
