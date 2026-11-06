// Which of MeteoAlarm's hazards the title of a warning names.
//
// A MeteoAlarm warning has one type (1 wind, 2 snow and ice, 3 thunderstorms, 4 fog, 5 heat, 6 cold, 7 coastal, 8 forest fire, 9 avalanches, 10 rain, 12 flooding), but a service can put
// two hazards in one warning: NIMH, for the red warning of 2 November 2026, "Heavy precipitation and strong wind!", whose type is `10; Rain`. The built-in integration reports only the
// first warning that it finds, so a second warning is not there to draw either, and the card drew the type alone: the wind was lost. The words of the title say more than the type does.
//
// The title is in the language that the provider was asked for, so the words that are known are English and Bulgarian. A title in another language names nothing, and the warning is
// drawn as it always was. Only the title is read (the event and the headline), and never the description, which is long and speaks of everything.

const START = '(?<![\\p{L}])';
const END = '(?![\\p{L}])';
const word = (s: string) => new RegExp(`${START}(?:${s})`, 'iu');

const HAZARDS: [number, RegExp][] = [
  [1, word(`wind(?:s|y)?${END}|gusts?${END}|gale|вятър\\p{L}*|ветр\\p{L}*|порив\\p{L}*`)],
  [2, word(`snow\\p{L}*|sleet|blizzard|ice${END}|icy${END}|glaze|сняг\\p{L}*|снеж\\p{L}*|лед${END}|ледов\\p{L}*|поледиц\\p{L}*|виелиц\\p{L}*`)],
  [3, word(`thunder\\p{L}*|lightning|гръмотев\\p{L}*|мълни\\p{L}*|гръм${END}`)],
  [4, word('fog\\p{L}*|мъгл\\p{L}*')],
  [5, word(`heat\\p{L}*|hot${END}|high temp\\p{L}*|жега|горещ\\p{L}*|висок\\p{L}*\\s+температур\\p{L}*`)],
  [6, word(`cold${END}|frost\\p{L}*|freez\\p{L}*|low temp\\p{L}*|студ\\p{L}*|мраз\\p{L}*|ниск\\p{L}*\\s+температур\\p{L}*`)],
  [7, word(`coastal|waves?${END}|tide|вълнен\\p{L}*|крайбрежн\\p{L}*`)],
  [8, word('forest[ -]?fires?|wildfires?|горски\\s+пожар\\p{L}*|пожар\\p{L}*')],
  [9, word('avalanche\\p{L}*|лавин\\p{L}*')],
  [10, word(`rain\\p{L}*|showers?${END}|downpours?|дъжд\\p{L}*|превалявани\\p{L}*|пороен\\p{L}*`)],
  [12, word('flood\\p{L}*|наводнен\\p{L}*')],
];
// precipitation says rain only when it is not said of snow or ice
const PRECIPITATION = word('precipitation|валеж\\p{L}*');

export function hazardsNamedIn(text: string): number[] {
  if (!text) return [];
  const found = new Set<number>();
  for (const [type, re] of HAZARDS) if (re.test(text)) found.add(type);
  if (!found.has(10) && !found.has(2) && PRECIPITATION.test(text)) found.add(10);
  return [...found].sort((a, b) => a - b);
}

// whether a warning of the type `main` already says the hazard `other` (a warning of rain and flooding says both; the two floodings are one)
export function typeCovers(main: number, other: number): boolean {
  if (main === other) return true;
  if (main === 13) return other === 10 || other === 12;
  return (main === 11 || main === 12) && (other === 11 || other === 12);
}

export const WARNING_ICONS: Record<string, string> = {
  '1': 'mdi:weather-windy', '2': 'mdi:snowflake', '3': 'mdi:weather-lightning',
  '4': 'mdi:weather-fog', '5': 'mdi:thermometer-high', '6': 'mdi:thermometer-low',
  '7': 'mdi:waves', '8': 'mdi:fire', '9': 'mdi:image-filter-hdr',
  '10': 'mdi:weather-pouring', '11': 'mdi:home-flood', '12': 'mdi:home-flood',
  '13': 'mdi:home-flood', '14': 'mdi:sail-boat', '15': 'mdi:water-off',
};
