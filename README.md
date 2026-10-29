<h1 align="center">Platinum Weather Card Plus Charts</h1>

A mashup of [Platinum Weather Card](https://github.com/tommyjlong/platinum-weather-card) and [Weather Chart Card](https://github.com/mlamberts78/weather-chart-card) — two of the best weather cards for Home Assistant, neither of which has seen active development for a while. I used to run Weather Chart Card on my main dashboard and Platinum on a dedicated weather view. At some point it felt pointless to maintain two separate cards with overlapping functionality, so I merged them as far as makes sense.

Based on the original Platinum Weather Card by [@makin-things](https://www.github.com/makin-things), extended by [@tommyjlong](https://github.com/tommyjlong). Weather Chart Card by [@mlamberts78](https://github.com/mlamberts78). Maintained and further developed here by me, [@rudizl](https://github.com/rudizl). If you like my work, you can <a href="https://buymeacoffee.com/rudizl"><img src="https://img.shields.io/badge/-Buy%20me%20a%20beer-FFDD00?style=flat&amp;logo=buymeacoffee&amp;logoColor=black" alt="Buy me a beer" align="absmiddle"></a> and/or [drop a ⭐ on GitHub](https://github.com/rudizl/platinum-weather-card-plus-charts).

[![hacs_badge](https://img.shields.io/badge/HACS-Default-blue.svg?style=flat)](https://github.com/hacs/default)
[![GitHub Release][releases-shield]][releases]
[![Downloads](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Frudizl%2Fplatinum-weather-card-plus-charts%2Fmaster%2Fbadges%2Fdownloads.json&style=flat)](https://github.com/rudizl/platinum-weather-card-plus-charts/releases)
![Maintenance](https://img.shields.io/badge/MAINTAINED-YES-green?style=flat)
![Last Commit](https://img.shields.io/github/last-commit/rudizl/platinum-weather-card-plus-charts?style=flat)
[![License][license-shield]](https://github.com/rudizl/platinum-weather-card-plus-charts/blob/master/LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/rudizl/platinum-weather-card-plus-charts/build.yml?branch=master&style=flat&label=CI)](https://github.com/rudizl/platinum-weather-card-plus-charts/actions/workflows/build.yml)

<p align="center">
  <img src="https://raw.githubusercontent.com/rudizl/platinum-weather-card-plus-charts/master/images/card-daily.png" alt="The card with the Daily tab open, and its Charts section" width="371">
  &nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/rudizl/platinum-weather-card-plus-charts/master/images/card-hourly.png" alt="The same card with the Hourly tab open" width="436">
</p>

## Installation

The card is in the HACS default store. From Home Assistant 2026.11 HACS is built in and called the **Marketplace** (Settings → Marketplace); the steps are the same in both, and the card stays where it is when you upgrade:

1. HACS or the Marketplace → search for **Platinum Weather Card Plus Charts**
2. Download (or Install)
3. Hard-refresh your browser
4. Add the card to a dashboard. In *Add to dashboard*, pick a weather entity under *By entity* and the card is offered under *Community*, already set up for it (Home Assistant 2026.6 or later); under *By card* it has a preview, filled in with one of your weather entities. Or in YAML:

   ```yaml
   type: custom:platinum-weather-card-plus-charts
   weather_entity: weather.home
   section_order: [overview, slots, daily_forecast, charts]
   show_section_charts: true
   option_show_temperature_chart: true
   option_show_precipitation_chart: true
   ```

### With just a weather entity

A card with a `weather_entity` and nothing else to read works. The overview, the slots, the days and the charts all take their figures from it: temperature, feels-like, humidity, pressure, wind and gusts, visibility, UV index, cloud cover, today's high and low, and today's chance of rain and rain amount from its attributes and forecast, the dew point for the comfort word (with the comfort option on), the condition icon from its state, and the days from its forecast. What a provider does not give shows as `---`, and the feels-like line is left out.

Add sensors and they are your choice, one group at a time. Set any one of the measurement settings (`entity_temperature`, `entity_humidity` and the rest, listed on the `weather_entity` row of the YAML reference) and none of the others is filled in for you; the same goes for the six per-day settings (`entity_forecast_icon_1` and its siblings). So a weather station beside a forecast stays exactly what you made it. None of this is written to your configuration.

### Coming from the original Platinum Weather Card?

If you used [Platinum Weather Card](https://github.com/tommyjlong/platinum-weather-card), your configuration carries over: every option and slot name from its documentation is supported here, including the per-day `entity_forecast_*_1` sensors, so the card works without a weather entity, charts included: they are drawn from those sensors.

1. Install this card from HACS or the Marketplace, as above.
2. In your card's YAML, change `type: custom:platinum-weather-card` to `type: custom:platinum-weather-card-plus-charts`.
3. Hard-refresh. The charts and the hourly forecast are extra sections you can switch on in the editor.

The two cards register under different names, so you can try this one beside the old one and switch over card by card.

---

<details>
<summary><strong>Changelog</strong></summary>

**v2.6.0**

**A weather entity is all the card needs.** A card with a `weather_entity` and no sensors showed the daily strip (since 2.5.2) and `---` everywhere else, although the card could already read each figure from a weather entity when each setting was pointed at it by hand. Now, when you have set none of the measurement settings (`entity_forecast_icon`, `entity_temperature`, `entity_apparent_temp`, `entity_humidity`, `entity_pressure`, `entity_visibility`, `entity_wind_bearing`, `entity_wind_speed`, `entity_wind_gust`, `entity_uv_index`, `entity_dew_point`, `entity_cloud_cover`, `entity_forecast_min`, `entity_forecast_max`, `entity_pop` and `entity_pos`), the card treats them as the weather entity, in its own copy of the configuration and never written back to yours. Set any one of them, to a sensor or to the weather entity, and nothing is filled in around it: the same rule as for the six per-day settings, so a weather station beside a forecast stays exactly what you made it. A provider that does not give a figure shows `---`; the feels-like line, and the gusts beside the wind, are left out rather than printed as dashes.

Three readings the card could not take from a weather entity now work: the **UV index**, the **dew point** (for the comfort word) and the **cloud cover**. A weather entity's own **visibility unit** is used, where the card used to assume the system's.

**A card written in YAML without `section_order` now draws its sections** (#27, from @johnnyh1975). The README documents a default order, but the card never applied one: only the editor wrote it, so a card written by hand drew an empty frame with no warning. The default is warnings, overview, extended, slots, daily forecast and charts, in the card's own copy of the configuration and never written back; an order you give, even a shortened one, is left alone.

**Old slot names are renamed again** (#28, from @johnnyh1975). The editor's clean-up renames the pre-2022 slot values `daytime_high` and `daytime_low`, but its loop ran over one string holding all sixteen slot names, so nothing was ever renamed and old configurations kept a value no slot matches.

**Adding the card from the picker now works, both ways in.** In *Add to dashboard*, pick a weather entity under *By entity* and the card is offered under *Community* (Home Assistant 2026.6 and later), set up for the entity you picked: the overview, the slots, the days and the charts, all from that entity. Where the entity can also do hourly forecasts there are two variants, *Daily forecast and charts* and *Daily and hourly forecast*. An entity that cannot do daily forecasts is not offered the card, because the days and the charts would be empty; and nothing is offered for anything that is not a weather entity. Under *By card* the card has a live preview, filled in with one of your weather entities, one that can do days if there is one. Before, a new card came out empty and every field had to be filled in by hand, and it was never offered by entity at all. With no weather entity there is nothing to fill in, and the card shows its sections without data until it is set up.

**Hours combined in a step, as a choice.** `hourly_forecast_step` thins the hours by taking every nth one, and the rain that falls in the hours it skips is not shown at all. A new switch, off by default so that nothing existing changes, combines the hours in each step instead: the rain is added up, the wind is the strongest, the weather is the worst of them, and the time and the temperature stay those of the hour the step starts on.

**The card knows its size in the sections view.** It tells Home Assistant it takes all twelve columns, as it always has there, that its height follows its content, and that it should not be dragged narrower than six columns, where it is unreadable.

**`entity_sun` is `sun.sun` when you do not name one** (#30, from @johnnyh1975). It is the only sun entity Home Assistant has, so a card that names none can only mean that one. A card that never set `entity_sun` used to draw day icons all the time, at night too, because without a sun entity it had nothing to tell day from night; now it follows the sun, and the sunrise and sunset slots have a time to show. Where the sun integration is not loaded nothing changes. Like the other defaults it lives in the card's own copy of the configuration, and is never written back or warned about.

**Two small things in the editor and the picker** (also #30). The UV index and dew point pickers offer weather entities, which the card already read both from. And the card picker prefers a weather entity that no card on the dashboard shows yet, with one that can do daily forecasts still coming first.

**The icon stops flickering in light rain, and at the top of the hour.** The piezo gauge reports in steps of 0.6 mm/h: in a light shower it reads 0.6 for ten minutes and 0.0 between the ticks, and on 19 October, between 20:33 and 23:48, five bursts separated by gaps of two and five minutes and one lull of a hundred made the icon change about ten times. A reading above zero now counts as rain for fifteen minutes, which bridges the gaps and still lets go in a lull. And a weather entity that drops out for a moment, as `weather.ivarna103` does for a fraction of a second at the top of every hour, keeps its last condition for ten seconds instead of flashing a different icon.

**A press on a reading that has an action of its own no longer also runs the card's hold action.** The card listens for presses on its own element, where the browser reports that element rather than what was pressed, so the check for a press that began on such a reading could never match, and a long press on it also ran the card's hold action. It now looks at where the press really began.

**The hourly strip draws a moon at night.** A clear sky at 23:00 was a sun: every forecast icon is made a day icon, which is right for a day and wrong for an hour of the night. Each hour is now day or night by what the provider says of it (`is_daytime`) or, without that, by where the sun is at that hour, worked out for the card's place. The days are as they were. The same sum shades the night hours of the strip, and it was out by up to a quarter of an hour in the autumn, because the sun is not a clock and the formula left out the equation of time: on 24 October it put the sunrise 22 minutes after Home Assistant's own. It is now within two minutes of `sun.sun`'s sunrise and sunset, which a test checks.

**A twice-daily forecast fills the strip and the charts** (#35, from @artbird309, who found the cause and wrote the fix). With the National Weather Service, which gives only `twice_daily` and `hourly`, the strip and the charts stayed empty. A date has two entries there, a day and a night, and the card told them apart by `daytime`, which Home Assistant does not say: it says `is_daytime`. The day's icon, high and chance of rain now come from the day entry and the low from the night entry; the old name is still read, for whatever gave it. The forecast was also cut to the days asked for by counting entries, two to a day, so five days kept two and a half; it is counted by date now, for a twice-daily forecast only. And in the evening, when a date has only its night, that temperature is shown as the low and no longer as the high of the day. Nine new tests run the card with a forecast like the National Weather Service's, and fail on the old code.

**The chance of rain under the hours** (discussion #34, from @ChittyChittyBang). The hourly strip showed how much rain is expected but not how likely it is, which is what someone watching the washing wants to know. A percentage now goes under the temperature of each hour that has one, in the colour of the rain, and the row is dropped when the whole span is dry or the provider gives no chances. For hours grouped by `hourly_forecast_step` it is the highest of the group. It is on, and `option_hourly_pop: false` (or the switch in the editor, in all fifteen languages) takes it off; the amount of rain has its own switch and the two do not depend on each other. Nine new tests.

**An overcast sky and a moderate rain no longer draw a tornado with a custom pack.** The card names the icon for a cloud cover of 85% and over `cloudy-3`, and for a rain of 2.5 to 10 mm/h (measured by the rain gauge) `rainy-2`, with a day or a night, and the table of picture names that the `custom` and `wcc-2` packs use did not have those two: they fell to `exceptional`. Anyone who lets the sensors choose the icon had a tornado under an overcast sky or in a moderate rain. (It is in 2.5.2 too.) Both are in the table now, and a name that the table does not have takes the picture of its family; only what is meant to be exceptional (`dust`, `tropical-storm`, a condition that is not known) still does. Nine new tests go through the real choice, with a solar sensor and a rain gauge, and the four that matter fail on the old table.

**The cloud cover entity can be a weather entity.** The card reads it from the attribute `cloud_coverage` of a weather entity, or from the state of a sensor, but the picker in the editor offered sensors only, so that met.no's weather entity, which gives the number, could not be chosen for the cloud cover shown at night. Both pickers offer weather entities now, and only the ones that can be a sky: a weather entity that gives a cloud cover, and the sensors in per cent that are named for a sky (cloud, overcast, sky, облачност, bewölkung...), or every sensor in per cent when the house has none: not the thousand sensors of a house (anything else can still be typed in). Fourteen new tests.

**Sager has a sky at night.** After dark the pyranometer sees nothing and the last reading is good for six hours; past that Sager had no sky to read and called a covered night *fair* (on 26 October at 21:11 it said *fair and cooler* under a sky that met.no gave as 99% covered). The cloud cover slot already read *Cloud cover entity (night fallback)* (`entity_cloud_cover`), and Sager did not. It reads it now, as the slot does (the attribute `cloud_coverage` of a weather entity, or the state of a sensor, in per cent), and when none is named, or it gives no number, `cloud_coverage` of the entity of the hourly forecast and of the card's weather entity. What the card measured comes first, now and for six hours. Fourteen new tests.

**A name that the card does not know is a cloud, and not a tornado.** With a custom pack (and the wcc-2 one) a condition that the table of picture names did not have, or that a provider called `unknown`, fell to the picture of the tornado: it was what an overcast sky and a moderate rain looked like before beta.8, and it was what any new name looked like after. A tornado is for what is meant to be one (`exceptional`, `tornado`, `hurricane`); a name that is not known is the plain cloud, which says nothing. One new test.

**Slots that nobody chose are not drawn when they have nothing to read.** A card of a weather entity alone drew the ten slots of the defaults, and with a provider that gives no humidity, no pressure or no wind, or in a house with no UV warning, that was rows of `---` that nobody had asked for. A default slot that has no source is not drawn now: the wind, the pressure and the humidity (read from the weather entity, or from the entities that are set), the UV summary (it needs its own entity), and the chance of rain (when the forecast has arrived and gives neither a chance nor an amount). What you chose yourself keeps its `---`, and an entity that you set is a source even while it is unavailable, so that a slot does not come and go. The height that the card reports follows the slots that are drawn. Ten new tests.

**The update time shows `---` when its entity does not give a date** (#36). The line of the update time read the state of its entity with `new Date(state)`, and a browser reads a bare number as a date: 1 is the first of January 2001, 2 the first of February. Someone whose entity was not giving a date saw "00:00 Mon 1 Jan 2001", and with other texts "Invalid Date". A state or an attribute that is not a date and time (a year of four digits and something between the parts, that the browser can read) is `---` now, the card's sign for no value; the dates that were read before are read as they were. The README says what the entity has to give. Thirty-four new tests.

**The slots of today read a twice-daily forecast as the strip does** (#35, the rest of it). The forecast high and low, the chance of rain and the possible rain took the first entry of the forecast as it came, and with the National Weather Service that is a day or, in the evening, a night: the high could be the night's temperature and the low was never there. For a twice-daily forecast they read the first date as the strip reads a day: the high from the day, the low from the night, and a date that has only its night has no high. A daily forecast is read as it was. Five new tests.

**The big icon keeps the proportions of its picture.** The box of the big icon is 140 by 120 pixels and its picture was told to be all of it. An SVG fits itself in and keeps its proportions; a PNG, a custom pack's, was stretched to the box (a disc came out an oval, 1.17 to 1). Four new tests.

**The lists of the editor offer what each field can read.** The pickers of the temperatures (eleven of them), of the humidity, of the pressure and of the wind (six) offered every sensor of the house, and this one has more than a thousand. They offer what the field can read: a sensor by its device class or its unit (a temperature in °C, °F or K, a pressure in hPa and the other units of pressure, a speed in km/h, m/s, mph or knots, a direction in degrees, a humidity in per cent with a name that says so), and a weather entity by the attribute that the field reads. A house that has no sensor that fits a field is offered every sensor for it, anything else can still be typed in, and **Offer every entity in the lists** (`option_editor_all_entities`), in the global options, turns the narrowing off. The pickers of the second batch (thirteen) follow the same rules: the update time (a sensor with the device class timestamp), the solar radiation (irradiance, W/m²), the rain rate (mm/h) and the rain (mm), the UV index, the visibility, the moon, the lightning distance and bearing (a distance or degrees *named for lightning*), and the hourly weather entity (one that gives an hourly forecast). A house that has no hourly weather entity is offered every one. Text fields (icons, summaries, the fire danger) are not narrowed. Twenty-six new tests.

**The editor keeps `forecast_type`, `show_section_charts`, `pressure_units` and `option_daily_color_fire_danger`.** The first time the editor opens a card that has no `card_config_version` (one written in YAML, or one from before the version), it removes the settings that it does not know, and these four, documented here, were among them: a card set to `twice_daily` went back to daily, and hidden charts came back, as soon as the editor was opened. They are known now, and a test checks every setting in the tables below against the ones the editor keeps.

Two hundred and eighty-five new tests run the card itself, seven of them from @johnnyh1975's pull requests. They cover the card's side of the Sager forecast, the rain rate slot, the Beaufort tables, the vertical layout and the tap, double tap and hold actions, as well as each way the picker finds the card. They guard what must not change too: a user's own sensors, a weather entity that is not there, a provider without a feels-like or gusts, an entity that does not say what it can do, the hours as they were when the switch is off, and a gauge that has read 0.0 all along, which is dry at once.

---

**v2.5.2**

**A `weather_entity` on its own is enough for the daily strip** (#24, reported by @alanmilinovic). The strip reads six per-day settings: icon, summary, minimum, maximum, chance of rain and possible rain. Pointed at a weather entity they can only ever be that entity, and leaving them out gave an empty strip that said nothing about why. When you have set none of them, the card now treats them as the weather entity, in its own copy of the configuration and never written back to yours. Set any one of them, to a sensor or to the weather entity, and nothing is filled in, so setups with per-day sensors are untouched. Warnings about forecast attributes are for settings you made, so they are not raised for keys the card supplied.

**`forecast_type: hourly` no longer empties the strip.** The strip takes one forecast entry for each day (two, day and night, for `twice_daily`), and hourly data has up to 24 entries a day, so it was left with nothing, and the charts, which read the same forecast, with it. The card now asks Home Assistant for the daily forecast when `hourly` is stored, and the editor no longer offers *Hourly* as a forecast type: the hours have their own section and their own subscription, which this does not touch. A configuration that still says hourly is read as daily, and shown as daily in the editor.

**The overcast icon with the Meteocons packs.** When the cloud correction picks the thickest band, as it does for a provider's rain overruled by a dry gauge under a thick sky, the two Meteocons packs had no file for it and drew the pack's "not available" icon: N/A where the weather should be. It now maps to Meteocons' own overcast icon. A new test checks, for every icon pack, that every name the card can produce lands on a real icon.

The configuration posted in #24, exactly as it was, now draws its days without any change to it. The reporter confirmed it on his own OpenWeatherMap setup, and I tried it on mine with Met.no. Fourteen new tests run the card itself; eight of them fail on the old code, and the rest guard what must not change: per-day sensors, partly configured keys, `twice_daily` and the hourly view.

**Also**
- The README now starts with the description and the badges, and has a section on where the days come from
- The YAML reference lists the per-day keys by name (`entity_forecast_icon_1` and the rest), which it only did by editor label before, and `card_config_version`

---

**v2.5.1**

**The charts now draw from per-day sensors** (#23, second report, from @BJReplay). A card configured the way the original Platinum Weather Card was — per-day sensors, `entity_forecast_icon_1` and the rest, no weather entity — drew its forecast strip but no chart. The charts read only a weather entity's forecast, found none, and drew nothing, with no message; and because the strip hides its own temperature and rain text when a chart is switched on, someone who had just migrated lost the figures from the columns and got no chart in their place, until they set a weather entity. The charts now read the same sensors as the strip, over the same days. A chart whose sensor is not configured is left out, rather than drawn as a line of zeroes.

**The tab no longer hangs when `entity_hourly` is set without a `weather_entity`** (#23, reported by @hastarin with a complete diagnosis). The hourly subscription shared a condition with the daily one, which is only ever satisfied when there is a weather entity to subscribe to. Without one — or with `forecast_type: legacy` — it was re-issued after every update, and each re-issue is itself a state change that schedules the next update, so the tab never got a turn. It now has a condition of its own, and still retries until the hourly entity exists.

**Fixes to the weather icon**
- **A dry gauge that overrules a claimed rain now has something to show when the sky cannot be measured.** The card decided the rain was not real and then chose the replacement from the measured cloud cover alone. After dark, or with the sun under the 10° morning cut-off, there is none, so the provider's rain icon stayed: `rainy` all evening on 14 October and at dawn on 17 October, against a gauge reading 0.0 mm/h. Rain implies cloud, and plain overcast is the one thing the provider's own report supports, so that is what it shows. Where the sky *can* be measured, the measurement still decides
- **A gauge that drops out for a moment no longer flashes the rain icon back.** The station's gauge reports `unavailable` for between one and seven seconds every so often, which was read as "no gauge" and handed the icon back to the provider for as long as it lasted. The icon now holds the last real reading for a minute; the rain rate slot is unaffected, and a gauge that has really died stops overruling anything after that minute
- **Day and night follow the sun entity.** The card waited for the sun's elevation to clear 0°, but Home Assistant flips `sun.sun` where the upper limb meets the horizon, about 0.83° earlier, and the sunrise and sunset slots count from that instant. For some five minutes at each end the icon said night while the slot beside it said the sun had risen: a moon on the card at 07:23 on 16 October. The icon now uses the entity's own state, and falls back to the elevation at Home Assistant's horizon if the state is anything unexpected

**Also**
- The README now renders in HACS. It shows the file as raw text inside Home Assistant, where a relative image path resolves against Home Assistant rather than GitHub and gives a broken image; all of them are absolute now
- A section for people arriving from the original Platinum Weather Card, which HACS no longer lists, and the step that was missing from the installation: what to put in the YAML
- Twenty-six new tests run the card itself rather than read its source, each written first and shown failing against the old code

---

**v2.5.0**

**An hourly forecast** (#18). Hours and days answer different questions — *will I get wet walking home* against *is the weekend any good* — and a forecast strip of days cannot answer the first. Set **Hourly weather entity** to a provider that publishes hourly data, switch the new **Hourly forecast** row on, and the daily forecast section gains a pair of tabs, **Daily** and **Hourly**, the way Home Assistant's own more-info dialog has them. Met.no is the easy source: forty-eight hours, no API key, works anywhere, and it does not have to be the provider you use for days — the two are separate entities on purpose, and the card subscribes to them independently.

The section list now has an **Hourly forecast** row of its own, directly beneath the daily forecast, with a switch and its own settings. Between the two switches they give days only, both with tabs, or hours only, without a setting for it. The hours are a column each — time, icon, temperature — scrolling sideways instead of being squeezed across a phone. They can show rainfall (the row disappears when the whole span is dry), wind, and a shade behind the night hours, which is worked out from your latitude and longitude because a sun entity only knows where the sun is *now*. A **step** takes every nth hour, so a step of three turns twenty-four hours into eight columns. The temperature and precipitation charts belong to the days and are hidden while the hours are open.

**Serbian**, in both scripts: `sr` (Cyrillic) and `sr-Latn` (Latin), the card, the editor and the forecast texts, including everything above. Contributed by @cpmarexel2f (#22). Region-qualified codes such as `sr-RS` and `sr-Cyrl-RS` now resolve to the right script, and the language lookup lives in one function instead of eight copies — which is what the contribution's first draft showed was too easy to get subtly wrong.

**Fixes**
- **A dry gauge now overrules a provider claiming rain, whatever the sky.** The old rule required full sunshine as well as a dry gauge, because it was written for one case, a claimed thunderstorm over a sunlit garden. It therefore missed the commonest disagreement of all: a grey afternoon, the provider says rain, the gauge reads 0.0 mm/h with nothing all day, and the card drew rain. A pyranometer cannot see rain, so cloud has no say in it; the gauge measures exactly the claim being made. Rain only — snow, hail and storms stay with the provider, and without a gauge configured the provider stands
- Tapping a tab no longer fires the card's own tap action: on a card with `tap_action` set to navigate, switching from Daily to Hourly carried you off to another view
- The hourly wind carries the unit of the entity it came from rather than Home Assistant's system setting. Met.no publishes km/h while a metric system says m/s, so 12 km/h was shown as *12 m/s* — three times the wind, and plausible enough to go unnoticed. The same mistake as #20, made again in new code
- Tests now compare every translation section across all languages, including Sager and the moon phases, a full or empty compass, and unit labels for any language not written in Latin script — a Cyrillic card that kept `km/h` would have passed before

---

**v2.4.0**

**The Sager Weathercaster, as a second forecast algorithm.** Zambretti reads only the barometer, which is why an overcast morning under a rising high comes out as *fine weather* — it has no way to see the sky. Sager (1942) reads six things rather than three, the sky among them. Choose it under **Forecast algorithm**; Zambretti remains the default.

Cloud comes from the pyranometer and rain from the gauge, both already configured if the icon correction is in use. After dark, when a pyranometer says nothing, the forecast falls back to the last daylight reading for six hours. A **Wind bearing six hours ago** helper sharpens one branch — a backing wind under a falling barometer is a warm front arriving — but is not required.

Measured against a real station: of four summer convective events, three were warned an hour ahead with no false alarms, while the barometer stayed silent throughout. Against a front arriving before dawn it added nothing, and that limit is structural — documented rather than papered over.

**A nearby storm warns in the warnings section.** Point **Lightning distance entity** at a strike detector and a storm within range gets a row beside any provider warning, coloured by distance: red within 15 km, amber to 30. Add the bearing and the row says which way it lies.

**Fixes**
- Plain overcast was the one sky state the icon correction could not touch: the guard required a day/night suffix that `cloudy` does not have, which is also the state providers most often get wrong
- A provider claiming a storm over a sunlit, dry garden is now overruled — under 15% cloud and a dry gauge rule out a thunderstorm overhead, whatever the region is doing
- A gap between showers read as fine weather; the forecast now remembers rain for ninety minutes

---

**v2.3.4**
- Four slots existed with no documentation: `cloud_cover`, `rain_rate`, `uv_index` and `wind_gust`. Now in the slot table
- `rain_rate` appeared twice in the slot dropdown, and its duplicate `case` in the editor was unreachable — the empty one won, so the gauge entity was never requested
- Both charts were documented as on by default; they are off
- **The chart stopped a day short of the forecast strip** when *Include today in forecast* was off (discussion #21). The forecast was trimmed to the configured number of days counting from today, while the card displayed from tomorrow — so the last day it went on to ask for had already been discarded. Five columns, four points, and the points spread across the full width rather than lining up beneath the columns. Reported by @safepay
- Documented that each chart hides only its own text row: the temperature chart hides the max/min figures, the precipitation chart hides the millimetres, independently
- The dew point comfort table now shows Fahrenheit alongside Celsius — the boundaries are originally Fahrenheit, which is why the Celsius figures look arbitrary
- Vitest upgraded to 4.1.11, closing a moderate path-traversal advisory in a development dependency

---

**v2.3.3**
- **Units are read from the entity rather than from Home Assistant's global unit system** (#20). The card took the value from one place and the label from the other, so an instance set to US customary printed a Celsius reading from Met.no as °F — the figure was correct and only the suffix was wrong, since nothing is ever converted. Pressure and wind already worked this way; temperature and precipitation now do too, falling back to the system setting only when nothing states a unit of its own. Reported by @BadrexSWE
- **A word for how the air feels**, under the apparent temperature: *dry*, *comfortable*, *muggy*. Relative humidity says little about comfort on its own — 60% at 15°C is pleasant and 60% at 30°C is unbearable — while dew point is the actual moisture content, so its bands hold whatever the temperature is. Seven bands from the US National Weather Service. Off by default; set **Dew point entity** and switch on **Show how the air feels**

---

**v2.3.2**

**New**
- **A rain gauge outranks both the provider and the pyranometer.** Weather Underground reported clear-night while the station's gauge read 1.2 mm/h. Point `entity_rain_rate` at your gauge and measured rain replaces a clear or cloudy icon, with the intensity following the standard bands — light below 2.5 mm/h, moderate to 10, heavy to 50, violent above. It still leaves alone a provider reporting snow, hail or a storm, which knows something about the precipitation a tipping bucket does not, and it is not smoothed the way cloud cover is: rain starting is an event, not a state to average
- **Rain rate slot** — how hard it is raining now, as distinct from the rainfall slot, which totals what has fallen today. Coloured by intensity
- **UV index slot** — the measured number, coloured by the WHO exposure bands, alongside the existing uv_summary slot, which shows a provider's wording
- **A fifth icon pack: Home Assistant's own weather icons.** Every other pack introduces a second visual style to a dashboard; this one is what Home Assistant already draws elsewhere

**Fixes**
- Heavy cloud rendered N/A: the heaviest band returned a name without a day/night suffix, so it matched no file
- A provider reporting rain, snow, fog or a storm could be overridden by the cloud measurement — heavy cloud is exactly when it is most likely to be right
- The UV slot sat higher than the slot beside it: slot icons were never centred within their box, so an icon whose artwork sits high lifted its whole row
- The icon pack and text alignment selects sat in half a row with nothing beside them, truncating their options mid-word
- Bulgarian wording for Zambretti letter k: *вероятни* overstated a band that means showers are possible rather than likely

---

**v2.3.1**
- Cloud cover is the median of the last five minutes, with hysteresis on the band boundaries, and shared across every card on the page rather than measured per card — two cards were showing different icons for the same sky. Broken cloud swings the raw reading across the whole icon range within minutes; on real data from one such morning this cuts the icon changing from eight times in twenty-five minutes to once
- The icon correction follows the ordinary cloud bands — clear below 25%, lightly cloudy to 55%, cloudy to 85%, overcast above. Correcting only at the extremes left the common case wrong: a provider claiming full sun while the pyranometer saw 59% cloud kept its sun icon
- The pyranometer settings moved to Global Options. They were behind the cloud cover slot, which meant the icon correction could not be used without also displaying a reading nobody had asked for — the two are independent and are now configured independently

---

**v2.3.0**

**Local forecast reworked**
- The semidiurnal atmospheric tide is subtracted from the pressure trend. At mid latitudes it reaches 0.32 hPa/h on its own, so an uncorrected forecast deteriorated every afternoon and recovered every morning regardless of the weather. ⚠️ Set **Pressure trend window** to match your Derivative helper — default 3 hours
- Wind direction is used only when steady: gate raised to 8 km/h, plus a circular-concentration test over the last 15 minutes. A vane in light air sweeps the whole compass, and the algorithm applies up to ±8.35 hPa from the bearing
- Thresholds raised to ±0.30 hPa/h in, ±0.20 out — the scale the algorithm was built around
- The tendency clause is read live, so it can no longer contradict the pressure slot's arrow (#12)
- The README now states plainly what a purely barometric method cannot see

**New: warnings section** — an active severe-weather warning from MeteoAlarm or any CAP-compatible integration, in the card's own language rather than the feed's, with visual weight following the severity level

**New: cloud cover from a pyranometer** (#19) — measured rather than forecast, with an optional icon correction that acts only on a flat contradiction

**New: the sun decides day/night icons** — some providers report `clear-night` with the sun 35° above the horizon

**Inherited requests**
- Decimals on wind speed and gust (#15)
- Each source on its own line in the extended section (#16)
- Alignment for the condition text (#17) — honoured by the stylesheet all along, but missing from the editor and documentation

**Fixes**
- Wind slot showed `unavailable NaNkm/h` when its sensors dropped out; six slots printed `NaN` or leaked the raw state
- A single `null` in the forecast poisoned the whole temperature chart rather than leaving one gap
- Precipitation units follow the sensor instead of assuming mm or inches
- `Entity_forecast_max` was capitalised in a 2022 migration, silently discarding the maximum temperature for anyone with an older config
- Moving the first section up wrote `undefined` into `section_order` and the section vanished
- The temperature-decimals migration deleted its own setting
- Wind speed ignored the sensor's unit

**Editor** — section names lost the redundant "section", controls stay on one line on a phone, and the two-column rows are a real grid

**Tests** — the project had none at the start of this cycle and now has 283, run on every build. Eleven of the fixes above were found by writing them

---

**v2.2.3**

The card is now available in the **HACS default store** — no custom repository needed.

**New**
- The current temperature and the apparent ("feels like") temperature open their history in the more-info dialog when tapped, matching the slot values. Requested by @blaal02

**Fixes**
- A long press on a tappable reading also fired the card's own hold action. The tap handlers stop the click, but the card starts its hold timer on `pointerdown`, which has already propagated by then. Affects the slot taps introduced in v2.2.0

**Docs**
- `option_show_gust_in_wind` and `option_show_beaufort` were working but undocumented

---

**v2.2.2**

**Fixes**
- **Charts and daily forecast disappeared** when both sections were enabled (v2.2.1 only). The chart's tooltip code still referenced a variable removed by the v2.2.1 date-alignment fix, throwing `ReferenceError: startIdx is not defined` and aborting the render of both sections. Reported by @jerrymjones (#13)
- **Security: tooltip contents are now escaped.** The chart and forecast tooltips are assembled as HTML strings and passed through `unsafeHTML`. Forecast descriptions and unit strings taken from entity attributes were interpolated unescaped, so crafted attribute data could inject markup into the dashboard. All string values are now HTML-escaped and numeric values are validated before they reach a style attribute. Reported by @frenck during HACS review

**Build**
- Type checking is now part of `npm run build`. It had been silently broken: syntax errors inside `@types/node` aborted `tsc` before it ever reached the card's sources, so the missing variable above shipped without a warning. Node types are excluded and the twenty-one type errors this exposed are fixed

---

**v2.2.1**

**Fixes**
- Chart and daily forecast strip could show a different number of days, with the chart's points landing under the wrong columns. The strip resolves each day by date and stops when one is missing; the chart used plain array indices, so whenever the provider's forecast array had not rolled over yet (just after midnight) the two drifted apart. The chart now walks dates with the same lookup and cut-off rule
- Wind bearings returned as Cyrillic abbreviations were not recognised — Weather Underground mixes them with the Latin ones in the same response (`Ю`, `NNE`, `ESE`, `SE`, `И`). Those days showed no wind arrow, and the local Zambretti forecast silently dropped its wind correction. All 16 Bulgarian abbreviations plus the Russian/Ukrainian `В` family are now parsed
- Three inline copies of the compass table (forecast arrow, both tooltip builders) replaced by the shared one, so a fix in one place can no longer miss the others

**Docs**
- The Zambretti section now warns that the local forecast needs sea-level (relative) pressure, with a ten-second check for an uncalibrated station and the two places the correction can be made

---

**v2.2.0**

**New: Tap on slot value opens history** (#9)
- Tap any slot value (humidity, pressure, wind, ...) and the native more-info dialog opens with the history/statistics graph. Only sensor-backed slots are tappable (pointer cursor + hover highlight); weather-attribute slots stay inert. Card-level tap/hold actions unaffected. `option_slot_tap_more_info`, on by default

**New: Long text can no longer break the slot layout** (#10 follow-up)
- Slot columns are pinned 50/50; long texts (moon phase, UV, fire danger, custom values) truncate with an ellipsis and a hover tooltip instead of collapsing the section to a single column
- Slot layout converted from CSS tables to flex, scoped to the slots section

**New: HA interface language as default** (#8 discussion)
- When Locale is left empty, the card now follows the Home Assistant interface language for texts and dates (previously: English texts + browser-language dates). The Locale dropdown remains a full override

**Translations**
- 🇨🇿 Czech — thanks @VlastiBroucek (#11), the card's first community translation; selectable in the editor dropdown
- English Zambretti texts modernized per @jerrymjones's native review: "fine" → "fair", "Fairly fine" → "Mostly fair", "Changeable, mending" → "Changeable, improving", "Very unsettled" (short + verbose sets)
- German reviewed by a native speaker (@00pi) — no changes needed

**Fixes**
- "uv_rating 6" instead of "UV 6" — translation key lost in the v2.1.0 i18n rework, added in all 13 languages (thanks @00pi)
- Forecast column numbers could overlap (caught by @00pi)
- Language count corrected in docs (13)

---

**v2.1.1**
- New option **"Moon phase: icon only"** (`option_moon_icon_only`) — hides the moon phase text, keeping just the icon. Long phase names (e.g. German "Zunehmender Dreiviertelmond") could force the slot section into a single column (#10, thanks @00pi)
- Moon phase text now shows the full name as a tooltip on hover

---

**v2.1.0**

**New: Local forecast (Zambretti)**
- The card can compute a short local forecast entirely from your own weather station — no internet, no forecast provider. Classic Zambretti forecaster (1915, ~90% accuracy for the next 12h) using barometric pressure, its trend, wind direction and season
- Enable via Overview Section → Options; the computed text replaces `entity_summary`. 26 forecast texts fully translated in all 13 languages
- Optional verbose mode: full-sentence phrasing plus a pressure-tendency clause ("Unsettled weather, with rain expected later. The pressure is falling.")
- Pressure units auto-converted (hPa/mbar, inHg, mmHg, kPa, psi, Pa); optional station-altitude sea-level correction for absolute-pressure sensors; hemisphere auto-detected from HA latitude
- Built-in smoothing for fast-reporting stations: wind direction ignored below 2 km/h, trend hysteresis (±0.12 in / ±0.08 out hPa/h), and a 5-minute debounce before the displayed text changes

**New: Date next to day name**
- Optional locale-formatted date in the daily forecast day labels — "ПН 13.07" (bg), "Mon 7/13" (en-US). Works in both layouts; the day label font shrinks slightly when enabled

**New: Barometric pressure trend indicator** (#7)
- Point `entity_pressure_trend` at a trend sensor and the pressure slot shows a colored arrow next to the value: ↗ green (rising), → gray (steady), ↘ red (falling)
- Accepts a numeric rate of change (hPa/h, e.g. a Derivative helper — recipe in the README) or the text states `rising`/`steady`/`falling`

**New: Wind bearing arrow** (#7)
- `option_wind_bearing_icon` — the wind slot shows a rotating arrow (pointing where the wind blows) instead of compass text; works with both degree and compass-text sensors

**Translation system rework**
- All strings extracted to per-language files (`src/translations/`) — contributions are now a single-file edit
- Editor fully translated in all 12 non-English languages; unit labels moved into the translation system

**Editor overhaul**
- All 28 on/off controls replaced: lock icon-buttons → compact toggle switches (gray off / green on, pure CSS, no HA component dependency)
- Layout consistency pass: labels sit above their dropdowns everywhere, selects match label font size (13px), no more wrapped toggle labels
- Help-text hints now render at 12px in the secondary text color; new hint under Station altitude

**Fixes**
- UV forecast / Fire danger entity picker labels in the Extended section were blank in 11 of 13 editor languages
- Compact Max/Min slot labels now translated in de, es, fr, it, nl, pl, da (previously fell back to English)
- Wind bearing arrow rotation not applied in some setups; gust arrow toggle removed (gusts have no direction data)
- bg: "полумесец" → "луна" for crescent moon phases

**Want the forecasts to sound right in your language?** Native-speaker review is very welcome — see [issue #8](https://github.com/rudizl/platinum-weather-card-plus-charts/issues/8)

---

**v2.0.8**

**Performance: bundle size 508K → 223K (−56%)**
- Removed the dead Material Web Components chain — the editor registered mwc textfield/select/switch/formfield definitions that were never consumed (the ScopedRegistryHost mixin was disabled), yet all @material/* packages were still bundled. The editor exclusively uses `ha-input`/`ha-selector`/native selects since the HA 2026.x compat work.

**Fix: chart tooltip date locale**
- Chart tooltip dates had a hardcoded Bulgarian locale fallback when Locale was set to Auto — now follows browser/HA locale like the forecast tooltips

**Fix: chart precipitation unit label**
- Bar labels were hardcoded to "мм" — imperial users saw a mm label on values that HA had already converted to inches (`precipitation_unit` attribute). Label now resolves the unit the same way the tooltip does: entity attribute → unit-system fallback → localized

**Fix: icon URLs with cache-busting query params**
- `?v=`/`?hacstag=` params from the resource URL were leaking into built icon SVG URLs via `import.meta.url` — query string is now stripped before building icon paths

**Fix: pointer listener leak**
- `connectedCallback` added new bound listeners on every card reattach with no cleanup; now uses stable bound references with `removeEventListener` in `disconnectedCallback`

**Maintenance**
- `CARD_VERSION` and `package.json` version now match release tags (console banner was stuck at "2.0.0-preview")
- Removed 499 lines of dead code: action-handler-directive.ts (replaced by pointer events in v2.0.4), helpers.ts, translations.ts, commented-out debug lines
- Removed unused directories (elements/, rollup-plugins/) and 10 unused dependencies

---

**v2.0.7**

**Fix: missing weather icons for non-Meteocons icon packs**
- The 110 built-in SVG icon files (`Default` icon pack) were never included as release assets — only the JS file was uploaded. HACS only downloads what's present in the release. All icon SVGs are now attached to releases alongside the JS.

**Fix: false "value needs to have a number" warning**
- `entity_pop`, `entity_forecast_min`, `entity_forecast_max` (single "today" values without `_1` suffix) were incorrectly validated against a digit-in-entity-ID regex meant only for the day-increment pattern (`_1`, `_2`, `_3`...). Helper/template sensors without digits in their name now work correctly.

---

**v2.0.6**

**New: Compact slot labels**
- Toggle in Global Options ("Compact slot labels" / `option_compact_slots`) shortens slot section text — "Forecast Max" → "Max", "Forecast Min" → "Min", "Observed Max/Min" → short form, "Forecast" prefix hidden
- Localized for all 12 supported languages

**Fix: BG translation**
- "Локал" → "Език" for the Global Options locale dropdown label

---

**v2.0.5**

**Fix: slot editor layout**
- Slot dropdowns were cramped and truncated — label and dropdown were on the same horizontal line
- Labels are now above their dropdowns, giving each dropdown the full column width

---

**v2.0.4**

**Fix: tap/hold/double-tap actions on mobile**
- Replaced the custom `action-handler-directive` with a `click` + `pointerdown` hybrid that works reliably in HA Companion App (Android WebView / sections view scroll container)
- `click` → tap / double-tap; `pointerdown` + 500ms → hold

**Editor: Actions in Global Options**
- Tap / Hold / Double-tap actions configurable from the visual editor
- Card Title 1 / 2 moved from Overview section to Global Options
- Translations for all 12 supported languages

**Editor: Use Attribute for entity_summary_1**
- Toggle + attribute picker for non-weather sensor entities
- Config keys: `summary_1_use_attr` + `summary_1_name_attr`

---

**v2.0.3**

**Fix: horizontal scroll in dashboard**
- `ha-card`: `overflow: hidden`; `.day-horiz`: removed `float: left`, added `min-width: 0`

---

**v2.0.2**

**Fix: day/night icons broken with non-English HA**
- Use `sun.sun` elevation attribute (numeric, language-independent) instead of translated state string (`above_horizon`/`below_horizon` is translated in non-English setups)

---

**v2.0.1**

- Locale dropdown — full language list in Global Options instead of text field
- GitHub Actions CI with HACS validation (`hacs/action@main`) and build check
- Fix: remove `resize-observer-polyfill` import — use native `ResizeObserver`

---

**v2.0.0**

**New: Charts Section** (merged from Weather Chart Card)
- Temperature lines (max/min) rendered as continuous polylines below the daily forecast
- Precipitation bars with millimetre labels, scaled to the day with highest rainfall
- Configurable independently: toggle temperature chart and precipitation chart separately
- `section_order` support — Charts appears as its own section, reorderable in the editor
- `show_section_charts`, `option_show_temperature_chart`, `option_show_precipitation_chart` config keys

**New: Hover Tooltips**
- CSS `:hover` tooltips on both **forecast columns** and **chart columns** — identical content in both places
- Shows: date (bold), weather description (from `entity_summary_1` sensor), **↑ max°** (red), **↓ min°** (blue), 💧 precipitation, wind direction arrow + speed
- Dark background (`rgba(10,20,40,0.96)`), white text — readable on any dashboard theme
- Wind unit read directly from `weather.*` entity attributes (never falls back to HA system `m/s` for entities that report in `km/h`)
- Units localized to HA app language (`km/h` → `км/ч`, `mm` → `мм` for Bulgarian, etc.)
- Tooltip width spans the full section width, matching forecast section behaviour

**New: Icon Packs**
- `meteocons-fill` / `meteocons-line` — [Meteocons](https://github.com/basmilius/weather-icons) by Bas Milius (MIT, loaded from jsDelivr CDN)
- `wcc-2` — [amCharts Weather Icons](https://www.amcharts.com/free-animated-svg-weather-icons/) via `rudizl/weather-chart-card` (CC BY 4.0)
- `custom` — any icon set via `icon_pack_path` with `{condition}` placeholder
- Selectable from the editor's **Global Options** → **Icon Pack** dropdown

**Editor overhaul**
- Lock/unlock icons for section visibility toggles (replacing `ha-switch`)
- MDI section icons throughout
- Global Options moved to the top of the editor
- i18n framework with 112 translated strings — EN and BG complete

**Other**
- `option_show_current_day` — include today in the forecast/chart strip instead of starting from tomorrow
- Config validation in `setConfig`
- HA 2026.5/2026.6 compatibility: `ha-textfield` → `ha-input`, WebAwesome switch tokens, `ha-switch` removal

---

**Older releases**

**v1.x** — the first year, before the v2.0.0 rewrite

The card began as a merge of Platinum Weather Card and Weather Chart Card, and most of this line went on making that merge hold together against a moving Home Assistant. The editor dropdowns broke three times in a row as HA retired `mwc-list-item`, then `ha-list-item`, then the switch colour tokens; they were finally settled by dropping the HA components altogether for native `<select>` elements, which is why they have not broken since.

The rest was mostly the card learning to say nothing gracefully. Sensors that return `unknown` or `unavailable` had been rendering as `NaN%` and `unknownmm` across a dozen slots, and the extended section printed the raw word below its separator.

Features added along the way: the `moon` slot with its phase icons, `option_show_current_day`, labels on the custom slots, `double_tap_action`, Spanish, wind units read from the weather entity, and time and date formats following the HA profile. The build became a single file, and `resize-observer-polyfill` went — about 30 KB for something every browser HA supports has had natively since 2020.

</details>

---

# Sections

<p align="center">
  <img src="https://raw.githubusercontent.com/rudizl/platinum-weather-card-plus-charts/master/images/editor-sections.png" alt="The section list in the editor" width="720">
</p>

- **Warnings** — weather alerts from a MeteoAlarm-compatible sensor
- **Overview** — the condition icon, temperature and forecast text
- **Extended** — a longer forecast description
- **Slots** — two columns of readings, up to eight each
- **Daily Forecast** — a column per day
- **Hourly Forecast** — a column per hour, as a tab beside the days or on its own
- **Charts** — temperature lines and precipitation bars

Each row has a switch to hide the section entirely and arrows to reorder it. The pencil opens the entities the section reads from; the second icon, where present, opens its display options. **Hourly Forecast** is the exception: it is a view of the daily forecast rather than a section, so it has a switch and one settings button, holding both its entity and its options, and no arrows.

**Global Options** at the top is not a section of the card; it holds the settings that several sections draw on, such as the locale, the icon pack and the station sensors.

## Overview Section

Four layout options are available:

| Layout | Preview |
|--------|---------| 
| **Complete** | ![](https://raw.githubusercontent.com/rudizl/platinum-weather-card-plus-charts/master/images/overview-section-complete.png) |
| **Observations** | ![](https://raw.githubusercontent.com/rudizl/platinum-weather-card-plus-charts/master/images/overview-section-observations.png) |
| **Forecast** | ![](https://raw.githubusercontent.com/rudizl/platinum-weather-card-plus-charts/master/images/overview-section-forecast.png) |
| **Title Only** | ![](https://raw.githubusercontent.com/rudizl/platinum-weather-card-plus-charts/master/images/overview-section-title-only.png) |

| Option | Type | Description |
| ------ | ---- | ----------- |
| Card Title Text Line 1 | String | Optional title line 1 |
| Card Title Text Line 2 | String | Optional title line 2 |
| Entity Update Time | Entity | Entity providing the timestamp (RFC 3339 format) |
| &nbsp;&nbsp;Use Attribute | Boolean | Use an attribute of the above entity for the timestamp |
| &nbsp;&nbsp;Attribute | String | The attribute containing the timestamp |
| Update Time Prefix | String | Text to prepend to the timestamp |
| Entity Current Temperature | Entity | Current temperature |
| Entity Apparent Temperature | Entity | Apparent / feels-like temperature |
| Entity Forecast Icon | Entity | Entity whose state drives the condition icon |
| Entity Forecast Summary | Entity | Entity whose state is shown as the condition text |
| Show Temperature Decimals | Boolean | 1 decimal on current/apparent temperature |
| Show Separator | Boolean | Separator line below the overview section |
| Local forecast (Zambretti) | Boolean | Replace the summary text with a locally computed Zambretti forecast |
| &nbsp;&nbsp;Verbose forecast text | Boolean | Full-sentence forecast with a pressure-tendency clause |
| &nbsp;&nbsp;Station altitude (m) | Number | Only for absolute-pressure sensors — leave empty for relative/sea-level |

Wind bearing sensors may report either numeric degrees or compass text. Both Latin (`NW`, `SSE`) and Cyrillic (`СЗ`, `ЮЮИ`, and the Russian/Ukrainian `В` for east) abbreviations are recognised — some providers return them localized, or mixed in with the Latin ones.

### Tap on a value → history

Tapping a slot value (humidity, pressure, wind, ...) — or the big current temperature and the apparent temperature below it — opens the native more-info dialog with the history/statistics graph. Only slots backed by a real sensor are tappable — a pointer cursor and a subtle hover highlight show where. Slots reading attributes of a `weather.*` entity stay inert (their dialog would show a forecast, not history). The card-level tap/hold actions are unaffected. Controlled by `option_slot_tap_more_info` (Slots section toggle, on by default).

### Local forecast (Zambretti)

The card can compute a short local forecast entirely from your own weather station — no internet, no forecast provider. It implements the classic **Zambretti forecaster** (Negretti & Zambra, 1915), which reads barometric pressure, its trend, wind direction and season. It is reported to be right around 90% of the time for the next 12 hours — but that figure comes from the frontal weather it was designed for, and there are conditions it cannot see at all (see *What it can and cannot do* below).

Enable it in the editor: **Overview Section → Options → Local forecast (Zambretti)**. When enabled, the computed forecast text replaces the `entity_summary` text in the overview section, localized to the card's configured language (one of 26 phrases, e.g. *"Fine weather"*, *"Unsettled, rain later"*, *"Stormy, much rain"*).

A **Verbose forecast text** toggle expands the short phrase into a full sentence with a pressure-tendency clause, e.g. *"Unsettled weather, with rain expected later. The pressure is falling."*

| Short | Verbose |
|-------|---------|
| ![Editor options and short forecast](https://raw.githubusercontent.com/rudizl/platinum-weather-card-plus-charts/master/images/overview-options-zambretti.png) | ![Verbose forecast](https://raw.githubusercontent.com/rudizl/platinum-weather-card-plus-charts/master/images/local-forecast-zambretti.png) |

Inputs used:

- `entity_pressure` — **required.** Sea-level (relative) pressure preferred. Units are auto-converted from the sensor's `unit_of_measurement` (hPa/mbar, inHg, mmHg, kPa, psi, Pa).
- `entity_pressure_trend` — strongly recommended. A numeric derivative sensor in hPa/h gives the best result (±0.1 hPa/h is the rising/falling threshold); text states `rising`/`steady`/`falling` also work.
- `entity_wind_bearing` — optional, refines the forecast (degrees or compass text).
- **Station altitude** — only set this if your pressure sensor reports *absolute* (station) pressure; the card then applies the barometric sea-level correction using the current temperature. Leave empty for relative/sea-level sensors.

The hemisphere is detected automatically from your Home Assistant latitude.

#### The Sager Weathercaster

Zambretti's blindness to the sky is not fixable within Zambretti — but it is precisely what Raymond Sager set out to address in 1942. His instrument reads six things rather than three: pressure, its trend, the wind sector, **how the wind has turned over six hours**, the cloud cover, and whether it is raining. Choose it under **Forecast algorithm**.

The difference shows in the case that prompted this: a morning at 1020 hPa with the barometer rising and the sky two-thirds covered. Zambretti says *fine weather*, because that is what the barometer says. Sager says *unsettled*, because it can also see the cloud.

It needs one thing the card cannot supply itself. Sager compares the wind now with the wind six hours ago, and a dashboard forgets everything when the page reloads — so the history has to come from a helper you create:

```yaml
# Settings → Devices & Services → Helpers → Statistics
# Source: your wind direction sensor
# Characteristic: average
# Sampling size: enough to cover six hours
# Max age: 6 hours
```

Point **Wind bearing six hours ago** at that helper. It is not required: without it the other five inputs still stand, and the sky measurement — the reason to choose Sager at all — is worth more than the one branch the bearing sharpens.

That branch is a backing wind under a falling barometer, which is the classic signature of a warm front arriving. Worth knowing before you rely on it at a coastal site: a sea breeze turns the wind through the same angles every day regardless of the weather, so the signal is noisier there than inland.

The forecasts are Sager's own, with his lettering (A through Y), so the output is comparable with any other implementation of the instrument. His wording is condensed for the card: *"Precipitation or showers/flurries followed by improvement (within 12 hours) and becoming cooler"* was written for a printed manual, not for a phone.

<details>
<summary>The twenty-one forecasts</summary>

| | |
| --- | --- |
| A | Fair |
| B | Fair and warmer |
| C | Fair and cooler |
| D | Unsettled |
| E | Unsettled and warmer |
| F | Unsettled and cooler |
| G | Increasing cloud, then precipitation |
| H | Increasing cloud, then precipitation; warmer |
| J | Showers |
| K | Showers and warmer |
| L | Showers and cooler |
| M | Precipitation |
| N | Precipitation and warmer |
| P | Precipitation, turning cooler; improving within 24 hours |
| R | Precipitation, improving within 12 hours |
| S | Precipitation, improving within 12 hours; cooler |
| T | Precipitation, improving within 6 hours |
| U | Precipitation, improving within 6 hours; cooler |
| W | Precipitation, then fair within 6 hours; cooler |
| X | Unsettled, then fair |
| Y | Unsettled, then fair within 6 hours; cooler |

Every one of them is reachable, which the tests assert — a phrase translated into fourteen languages that no combination of inputs can produce would be fourteen translations wasted.

</details>

In verbose mode a wind clause and a temperature clause follow, but only when they have something to say: *no important change* is Sager's commonest outcome for both, and a line spent reporting that nothing is happening is a line wasted. Several of his forecasts already carry the temperature in their own wording, and the clause is suppressed for those rather than repeating it.

The quadrants mirror south of the equator, since the circulation does — but east stays east, because ahead of a depression the air arrives from the east in both hemispheres.

#### How well it actually does

Measured against a station on the Bulgarian coast over six weeks, because a forecast algorithm that has not been checked against what happened is a decoration.

**Summer convection — where it earns its place.** Of four rain events, three were warned an hour ahead and there were no false alarms at all: the ten hours it called wet were the ten hours it rained. Through all four the barometer said nothing — it was steady or *rising* each time, so a purely barometric forecast read *fine weather* throughout. The whole signal came from the sky: cloud went from 31% to 81% in the hour before the first one.

**Frontal rain — where it does not.** A nine-hour front with an 18 mm/h peak arrived at six in the morning and Sager gave no warning whatever. Three separate reasons, and none of them fixable here:

- the rain arrived before dawn, when a pyranometer can see nothing at all
- the barometer dipped gently and then rose through the entire event
- the wind veered south to north — a *cold* front, where rain falls at the boundary, while Sager's frontal branch is tuned for a warm one, where it falls ahead

A lightning detector covering 100 km recorded no strikes that day, which independently confirms there was no convection to see. A numerical model had the event two days in advance.

The line between the two cases is worth stating plainly: **convection builds over you for hours, and local sensors watch it happen. A front is assembled somewhere else and arrives finished.** For the second kind, a forecast provider will beat any instrument in your garden, and no amount of tuning changes that.

Cloud cover comes from the pyranometer if you have one configured, and rain from the gauge. The forecast holds on to a shower for ninety minutes after it stops, since a dry gap in the middle of a convective spell is not fine weather — on one evening here it rained at eight, stopped for two hours and resumed at eleven, and in the gap the forecast read *fair*. The rain rate slot is unaffected and still reports what the gauge says this minute. Without a pyranometer Sager still works, assuming partly cloudy — it simply loses the advantage that made it worth choosing.

After dark a pyranometer says nothing, which is precisely when that advantage would go missing, so the forecast falls back to the last reading taken in daylight — for six hours. That reaches from dusk into the small hours, where a stale figure is still roughly true. Longer than that it stops being information: on one frontal night here the sky was last measured at 38% on the Saturday afternoon, and by the time rain arrived at six the next morning it had reached 84%, with the old figure still being reported throughout. The cloud cover **slot** is unaffected and still shows `---` at night, since it reports a measurement rather than a forecast input.

When the card has neither a measurement nor a reading from the last six hours, it asks the provider: first the entity named under **Cloud cover entity (night fallback)** (`entity_cloud_cover`), read as the slot reads it, the attribute `cloud_coverage` of a weather entity or the state of a sensor, in per cent; and when none is named, or it gives no number, a weather entity that gives `cloud_coverage` (met.no does), the entity of the hourly forecast first and then the card's own weather entity. A blind forecast is the one to avoid: on 26 October at 21:11 Sager said *fair and cooler* under a sky that met.no gave as 99% covered, and it is *unsettled*, with the sky named, when it can read it. What the card measured, now or in the last six hours, always comes first, and an entity that gives no number leaves the sky unknown as it was. The slot is unaffected here too.

#### What it can and cannot do

Zambretti is **purely barometric**. It infers the weather from the pressure level, which way the pressure is moving, and where the wind is coming from. That works because in the mid-latitude frontal weather it was built for — Britain in 1915 — pressure genuinely leads the weather: fronts announce themselves in the barometer hours before they arrive.

It follows that the algorithm is blind to anything that does not move the barometer:

- **Summer convective storms.** Thunderstorms often form under high pressure with no barometric signature whatsoever. The card can read *"fine weather"* while a storm is building overhead, and it is not wrong about the pressure — it simply has no way to see instability, moisture or lift. In a convective climate, treat the local forecast as one input among several rather than the authority.
- **Fog, frost, and anything driven by radiation or humidity.** No input, no output.
- **Terrain effects.** Sea breezes, valley winds, lake effect — all invisible to it.

Where it does well is the thing your forecast provider is often slowest on: a front arriving earlier or later than the model said. The barometer at your own location knows before the model updates.

None of this is fixable within Zambretti; the missing input is cloud cover, which is what later algorithms use alongside pressure and wind change. That is exactly what [the Sager Weathercaster](#the-sager-weathercaster) below does, and why it is offered as an alternative rather than as a setting on this one — it is a different instrument, not a tweak.

> **Your pressure sensor must report sea-level (relative) pressure — check this first.**
> Zambretti reads the absolute pressure level, so an uncalibrated station throws the forecast off by several categories, permanently. A station at 150 m altitude reads roughly 18 hPa below sea level: the algorithm sees 1002 hPa ("changeable, some rain") when the real sea-level pressure is 1020 hPa ("settled fair"), and the card then predicts rain on a cloudless day.
>
> **Ten-second check:** compare your absolute and relative pressure sensors. If they read *exactly* the same, the station is not applying any correction and you are feeding the card raw station pressure.
>
> Fix it in **one** of these two places, never both:
>
> - **In the station (recommended)** — Ecowitt/WSView Plus → Calibration → **Altitude for REL** (leave *Abs Offset* at 0.0, that field corrects the absolute reading, which is already right). This also fixes what the station uploads to Weather Underground and the like.
>
>   ![Ecowitt calibration](https://raw.githubusercontent.com/rudizl/platinum-weather-card-plus-charts/master/images/ecowitt-altitude-calibration.png)
>
> - **In the card** — fill the *Station altitude (m)* field, and the card applies the barometric correction itself using the current temperature.
>
> To verify, compare the corrected value with the QNH from a nearby airport METAR — they should agree within a hPa or two.

To keep the text stable and honest about its inputs, the card applies three rules:

- **Wind direction is used only when it means something** — the reading is dropped below 8 km/h, and also whenever the bearing has been wandering over the last 15 minutes (measured as circular concentration, R < 0.7). A vane in light air sweeps the whole compass; professional stations report `VRB` for the same reason, and aviation reports state a range such as `040V120` — an 80° spread at 9 knots. Since Zambretti applies up to ±8.35 hPa based on the bearing, an unsteady reading alone can move the forecast several categories.
- **The pressure trend is corrected for the atmospheric tide, then judged conservatively.** Pressure breathes twice a day — maxima near 10:00 and 22:00 local solar time, minima near 04:00 and 16:00 — with an amplitude of about 1.16·cos²(latitude) hPa. At 43°N that is a slope of up to 0.32 hPa/h, several times any sensible "falling" threshold, so an uncorrected forecast deteriorates every afternoon and recovers every morning regardless of the weather. The card subtracts the expected tide (computed from your latitude and longitude, averaged over the trend sensor's window) and then applies hysteresis: rising/falling starts at ±0.30 hPa/h — roughly 0.9 hPa over three hours, the scale the original algorithm was built around — and returns to steady below ±0.20. A changed phrase must also persist for five minutes before it replaces the one on screen.

  The tidal correction has to be averaged over the same window your trend sensor uses — at three hours versus one they differ by up to 0.16 hPa/h, over half the threshold for calling the pressure falling. A Derivative helper does not expose its window on the entity, so set **Pressure trend window** in the editor to match it. Default is 3 hours, which is both the Derivative default and the window the original Zambretti algorithm was built around.
- **The pressure-tendency clause is read live** from the same source as the pressure slot's arrow, so the sentence and the arrow can never contradict each other.

```yaml
type: custom:platinum-weather-card-plus-charts
entity_pressure: sensor.ws_relative_pressure
entity_pressure_trend: sensor.pressure_trend
entity_wind_bearing: sensor.ws_wind_direction
option_local_forecast: true
# option_forecast_altitude: 550   # only for absolute-pressure sensors
```

## Extended Section

Shows today's detailed forecast text.

Where several entities feed it, **Separate sources** puts each on its own line rather than running them into one paragraph — which matters because providers rarely end their text with a full stop, so without it two forecasts collide mid-sentence.

| Option | Type | Description |
| ------ | ---- | ----------- |
| Entity Extended Forecast | Entity | Entity providing the detailed forecast |
| &nbsp;&nbsp;Use Attribute | Boolean | Use an attribute of the entity instead of its state |
| &nbsp;&nbsp;Attribute | String | The attribute containing the forecast text |
| Entity Today's UV Forecast | String | Optional entity appended to the extended forecast |
| Entity Today's Fire Danger | String | Optional entity appended to the extended forecast |

## Slots Section

Each column holds up to eight slots, chosen from the list below and configured here:

<p align="center">
  <img src="https://raw.githubusercontent.com/rudizl/platinum-weather-card-plus-charts/master/images/slots-section-highlighted.png" alt="Slot configuration in the editor" width="720">
</p>

Up to 8 rows of data in 2 columns. The required entities update dynamically based on which slots are selected.

| Slot Value | Description | Example |
| ---------- | ----------- | ------- |
| `humidity` | Current humidity | 36% |
| `rainfall` | Today's recorded rainfall | 5mm |
| `rain_rate` | How hard it is raining now, coloured by intensity | Rate 1.2mm/h |
| `pressure` | Current air pressure | 1018hPa |
| `wind` | Wind direction, speed and gust | SSE 9km/h (Gust 13km/h) |
| `wind_kt` | Wind in knots | SSE 5Kt (Gust 6Kt) |
| `wind_gust` | Gust on its own, without the direction and mean | Gust 13km/h |
| `visibility` | Current visibility | 70km |
| `observed_max` | Today's observed maximum | Observed Max 19°C |
| `observed_min` | Today's observed minimum | Observed Min 4°C |
| `forecast_max` | Today's forecast maximum | Forecast Max 19°C |
| `forecast_min` | Today's forecast minimum | Forecast Min 1°C |
| `temp_next` | Next min or max | Overnight Min 4°C |
| `temp_following` | Following min or max | Tomorrow's Max 20°C |
| `temp_maximums` | Observed and forecast max | Obs Max 15°C (Fore 19°C) |
| `temp_minimums` | Observed and forecast min | Obs Min 13°C (Fore 1°C) |
| `sun_next` | Next sunrise or sunset | 7:10pm |
| `sun_following` | Following sunrise or sunset | Mon 6:35am |
| `moon` | Moon phase with dynamic icon and translated name | Растяща луна |
| `cloud_cover` | Cloud cover measured from a pyranometer, daylight only | Cloud 24% |
| `pop` | Chance of rain | 10% |
| `popforecast` | Rainfall forecast | 10% - 3 to 6mm |
| `possible_today` | Forecast rain today | Forecast 15-25mm |
| `possible_tomorrow` | Forecast rain tomorrow | Fore Tom 5-10mm |
| `uv_summary` | UV forecast, as the provider words it | UV High |
| `uv_index` | Measured UV index, coloured by the WHO exposure bands | UV 7 |
| `fire_danger` | Fire danger | Moderate |
| `custom1`–`custom4` | Custom entity with icon and unit | |
| `empty` | Blank slot (preserves space) | |
| `remove` | Remove slot entirely | |


### Pressure trend indicator

If you point `entity_pressure_trend` at a trend sensor, the pressure slot shows a small colored arrow next to the value: ↗ green (rising), → gray (steady), ↘ red (falling). Accepted sensor values: numeric rate of change (± beyond 0.05 counts as rising/falling) or the text states `rising` / `steady` / `falling`.

The easiest source is a **Derivative helper** (Settings → Devices & Services → Helpers → Create helper → Derivative):

- **Source:** your barometric pressure sensor
- **Time window:** 3 hours (the meteorological standard for pressure tendency)
- **Time unit:** hours (output becomes hPa/h)

Or in YAML:

```yaml
sensor:
  - platform: derivative
    source: sensor.your_pressure_sensor
    name: Pressure trend
    unit_time: h
    time_window: "03:00:00"
    round: 2
```

Then select it in the editor: Slots Section → *Entity Pressure Trend* (the picker appears once a pressure entity is set).

## Warnings Section

Shows an active severe-weather warning as a coloured row. Point it at a [MeteoAlarm](https://www.home-assistant.io/integrations/meteoalarm/) binary sensor (or any integration exposing the same CAP attributes) and the row appears only while a warning is in force — the rest of the time the section takes no space at all.

The wording is the card's own, in the card's language, rather than the provider's: MeteoAlarm reports the hazard as numbered strings following the EUMETNET CAP profile (`awareness_type: "5; high-temperature"`, `awareness_level: "2; yellow; Moderate"`), and the card keys off those numbers. So a Bulgarian card reads *"Жълт код: Високи температури · до сб 00:00"* even though the feed itself is in English. All fifteen hazard types are translated in every language the card supports; unknown types fall back to the provider's own `event` text.

The colour of the row follows the warning level — yellow, orange or red.

A **lightning detector** can add a row of its own. Point **Lightning distance entity** at a strike detector — [Blitzortung](https://github.com/mrk-its/homeassistant-blitzortung) is the usual one, and needs no hardware — and a storm within range gets a row alongside any provider warning, coloured by how close it is: red within 15 km, amber to 30, yellow beyond. Add the bearing entity and the row says which way it lies. **Warn within** sets the range, 50 km by default.

This is deliberately part of the warnings section rather than a slot. An approaching storm is a warning in the same sense a rain alert is, and the section already appears and vanishes on its own, where a slot would sit empty most of the time — six weeks of readings at the station this was built against recorded no strikes at all. **Show expiry time** appends when it lifts; without it the row states the hazard alone.

![Warnings section](https://raw.githubusercontent.com/rudizl/platinum-weather-card-plus-charts/master/images/warnings-section.png)

Two hazard types from the same feed, on a Bulgarian card: high temperature and rain. The icon follows the hazard, the bar follows the level, and the expiry time is formatted in the card's locale.

| Option | Type | Description |
| ------ | ---- | ----------- |
| Warning entity | Entity | MeteoAlarm-compatible binary sensor |
| Show expiry time | Boolean | Append when the warning ends |

```yaml
type: custom:platinum-weather-card-plus-charts
section_order:
  - overview
  - warnings
  - slots
entity_warning: binary_sensor.meteoalarm_varna
```

> The MeteoAlarm integration reports only the first warning when several are active for the same region at once. That is a limitation of the integration rather than the card; a template sensor can work around it if you need every warning.

### How the air feels

Under the apparent temperature the card can show a single word — *dry*, *comfortable*, *muggy* — worked out from the dew point. Point **Dew point entity** at your sensor in the overview options and switch on **Show how the air feels**.

Dew point rather than relative humidity, because relative humidity on its own says very little about comfort: 60% at 15°C is pleasant and 60% at 30°C is unbearable, since warm air holds far more water at the same percentage. Dew point is the actual moisture content, so its bands hold whatever the temperature is — a dew point of 21°C feels muggy at 24°C and at 35°C alike, because the moisture your sweat has to compete with is the same either way. That is why forecasters quote it and why it is the more useful number on a humid coast, where the temperature can look modest while the air does not.

The bands are the US National Weather Service ones:

| Dew point | | |
| --------- | - | - |
| below 10°C | below 50°F | Dry |
| 10–13°C | 50–55°F | Pleasant |
| 13–16°C | 55–60°F | Comfortable |
| 16–18°C | 60–65°F | Slightly humid |
| 18–21°C | 65–70°F | Humid |
| 21–24°C | 70–75°F | Muggy |
| above 24°C | above 75°F | Heavy air |

The Fahrenheit boundaries are the original ones, this being an American scale whose steps were chosen as round numbers there. The Celsius column is the conversion rounded to whole degrees, and it is what the card actually compares against — so a Fahrenheit reading within about half a degree of a boundary may fall on the other side of it.

### Cloud cover from a pyranometer

If your station measures solar radiation, the card can work out the cloud cover from it. How much sunlight *would* arrive under a clear sky depends only on the sun's elevation, the day of year and your altitude — pure geometry, no external data — so the ratio between that and what the sensor actually reports is the cloud cover.

Point **Solar radiation entity** in Global Options at your pyranometer (W/m²); a sun entity is needed too, since the calculation turns on the sun's elevation. The slot reads as a percentage by default; **Show oktas instead of percent** switches it to eighths of the sky, which is how observers and aviation reports state it. From there the measurement is available to two independent things: add the **Cloud cover** slot to show it as a reading, and switch on **Measurement corrects the icon** to let it correct the condition icon. Either without the other is fine.

Worth knowing about its limits:

- **Daylight only.** At night there is no signal at all. The slot falls back to a provider's cloud cover entity if you configure one, and shows `---` otherwise.
- **It stops below 10° of elevation**, where the air-mass model softens and morning haze distorts the reading, rather than reporting confident nonsense at dawn and dusk. The morning and evening cut-offs are set separately, under **Min sun elevation**, because obstructions rarely are symmetrical: a building to the west shades the late sun while the eastern horizon stays clear, and a single threshold then has to be set for the worse side. Five days of measurements here showed cloud reading 41% at six in the evening against 6% at noon, over a cloudless week — all of it the house.
- **The clear-sky model uses a fixed atmospheric transmittance**, so it reads a little high in hazy or dusty air and a little low in very clean air. Good enough to tell clear from overcast; not a radiometric instrument.
- **The sensor must be clean, level and unshaded.** A pyranometer that catches a roof edge each morning will report cloud that isn't there, every morning.

If your station has a rain gauge, point **Rain rate entity** at it too (mm/h). A gauge sees what neither a forecast provider nor a pyranometer can — whether it is raining here, now — and it takes precedence over both: rain reported by the gauge replaces a clear or cloudy icon, with the intensity following the rate. Rain starting is shown at once, because it is an event rather than a state to average; what is held is its end. A reading above zero counts as rain for fifteen minutes. Gauges that report in steps, such as the Ecowitt piezo gauge, which reads 0.6 mm/h, show light rain as short ticks with 0.0 between them, so a 0.0 does not prove that it has stopped, and without the hold the icon changed with every gap: about ten times in three hours on one evening of light showers. A gap of a few minutes is bridged; a lull of an hour is not. A gauge that drops out for a few seconds, as some stations do now and then, is held at its last reading for a minute. The rain rate slot goes on showing the truth throughout.

A weather entity that drops out for a moment, as some providers do at a fixed time every hour, keeps its last condition for ten seconds, so the icon does not flash.

The measurement can also correct the condition icon, under **Measurement corrects the icon**. The icon then follows the ordinary cloud bands — clear below 25%, lightly cloudy to 55%, cloudy to 85%, overcast above — rather than the provider's guess.

Only the plain sky icons are normally touched: rain, snow and fog are things a provider knows about and the sensors cannot see, so those are left alone. There are two exceptions, and they are not the same.

**Sunlit and dry.** Full sunshine on the pyranometer with a dry gauge rules out a thunderstorm overhead, whatever the forecast area as a whole is doing. A provider covers a region; a station covers a garden. Cloud has to be under 15% for this, which is deliberately demanding.

**A dry gauge against claimed rain.** When the provider says it is raining and the gauge says it is not, the gauge wins — whatever the sky is doing. A pyranometer cannot see rain, so cloud has no bearing on that claim; a gauge measures precisely the claim being made, and under an overcast sky it is the only instrument that can settle it. This is the commonest disagreement of all: grey, provider says rain, nothing falling. The icon then follows the measured cloud instead. When the sky cannot be measured — after dark, or with the sun under the elevation cut-off — there is no cloud to follow, and the icon shows plain overcast: rain means cloud, and it is the one thing the provider's own report supports.

It applies to rain only. A tipping bucket reads snow poorly and cannot see lightning at all, so snow, hail and storms stay with the provider. And it needs a gauge configured: with none, the provider stands, rather than an absent sensor being read as a dry one.

Off by default.

The measurement is shared by every card on the page — it describes the sky, not the card — so several cards never disagree about the same moment. Broken cloud swings the instantaneous reading violently — 181 to 513 W/m² inside three minutes on a typical morning, which spans the whole icon range — so the card takes the median of the last five minutes and the band boundaries carry hysteresis. The median rather than the mean because one reading through a gap should not drag the answer toward clear, and five minutes rather than longer because a window that includes a sunny spell from ten minutes ago describes the sky as it was, not as it is. Sun through a gap is still broken cloud, and an icon that changes every few minutes is worse than one that lags by a few.

The bands are the meteorological ones rather than wide safety margins. A sensor reading badly enough to matter is a sensor to clean, and treating it as untrustworthy while still displaying its number in a slot would be the worse of the two positions.

### Which icon the card shows

The provider supplies a condition, and the card draws it — but two things can overrule that, and both are about the card being able to see something the provider only predicts.

**The sun decides day or night.** Providers pick the day or night variant from their own forecast periods, and some switch to the night daypart in mid-afternoon: they report `clear-night` with the sun still 35° up, and the card would dutifully draw a moon. The **sun entity** decides — `sun.sun` unless you name another: the icon is the day variant from the moment Home Assistant's sun entity says `above_horizon`, the same instant the sunrise and sunset slots count from. If the state is anything else, the card falls back to the elevation, taking the sun as up above −0.83°, the horizon Home Assistant uses. This is on by default (**Day/night icon from sun**); switch it off to take the provider's word.

**The measurement can correct the condition itself.** That one is off by default and is described under [Cloud cover from a pyranometer](#cloud-cover-from-a-pyranometer) — briefly, a pyranometer and a rain gauge can contradict a forecast written hours ago for a region rather than a garden.

The two are independent: the sun override only changes day to night and back, never the weather, so it applies whatever else is switched on.

## Icon Packs

<p align="center">
  <img src="https://raw.githubusercontent.com/rudizl/platinum-weather-card-plus-charts/master/images/editor-icon-pack.png" alt="Choosing an icon pack" width="720">
</p>

The card supports multiple icon packs, selectable from the editor's **Global Options → Icon Pack** dropdown.

| Value | Description | Requirement |
|---|---|---|
| `default` | Built-in animated SVG icons (bundled with the card) | None |
| `meteocons-fill` | [Meteocons](https://github.com/basmilius/weather-icons) by Bas Milius — filled style | Internet (jsDelivr CDN) |
| `meteocons-line` | [Meteocons](https://github.com/basmilius/weather-icons) by Bas Milius — line style | Internet (jsDelivr CDN) |
| `wcc-2` | [ammap Weather Icons](https://www.amcharts.com/free-animated-svg-weather-icons/) — included in `rudizl/weather-chart-card` | Install `rudizl/weather-chart-card` via HACS |
| `ha-official` | [Home Assistant's own weather icons](https://github.com/scinos/lovelace-weather-icons) — the card then matches the rest of your dashboard rather than introducing a second style | Internet (jsDelivr CDN) |
| `custom` | Any icon set — set `icon_pack_path` with `{condition}` placeholder | User-provided |

> **Note:** `wcc-1` has been removed — it was byte-for-byte identical to the Meteocons Fill pack. Use `meteocons-fill` instead.

For `custom`, set `icon_pack_path` to a path template such as `/local/my-icons/{condition}.svg`. The `{condition}` placeholder is replaced with the HA weather condition name (e.g. `clear-day`, `partlycloudy`, `rain`).

### Third-party icon licenses

| Icon pack | Author | License |
|---|---|---|
| [basmilius/weather-icons](https://github.com/basmilius/weather-icons) (Meteocons) | [Bas Milius](https://bas.dev) | [MIT](https://github.com/basmilius/weather-icons/blob/master/LICENSE) |
| [scinos/lovelace-weather-icons](https://github.com/scinos/lovelace-weather-icons) (Home Assistant's official icons, `ha-official`) | [scinos](https://github.com/scinos) | [MIT](https://github.com/scinos/lovelace-weather-icons/blob/main/LICENSE) |
| [amCharts Weather Icons](https://www.amcharts.com/free-animated-svg-weather-icons/) (via `rudizl/weather-chart-card`, `wcc-2`) | amCharts / ammap.com | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) — free including commercial use, attribution required |

> **Note:** The card's **default built-in icons** are also based on amCharts weather icons, extended by [@makin-things](https://github.com/Makin-Things/weather-icons).

## Daily Forecast Section

Hovering a column shows the full forecast for that day, including the precipitation amount:

<p align="center">
  <img src="https://raw.githubusercontent.com/rudizl/platinum-weather-card-plus-charts/master/images/tooltip-forecast.png" alt="Forecast tooltip on hover" width="420">
</p>

Two layout options: **Horizontal** (default, up to 5 days) and **Vertical** (up to 7 days).

**Where the days come from.** Either a weather entity or per-day sensors:

- **A weather entity.** Set `weather_entity` and that is all there is to it. The six per-day settings in the table below (icon, summary, minimum, maximum, chance of rain, possible rain) are that entity, unless you set any of them yourself. Set one, to a sensor or to the weather entity, and the card fills in none of the others.
- **Per-day sensors**, the way the original Platinum Weather Card was configured. Set `entity_forecast_icon_1` and its siblings to the first sensor of a numbered series, such as `sensor.forecast_icon_1`, and the card steps the number up for each day.

`forecast_type` is `daily` (the default) or `twice_daily`. An `hourly` in an existing configuration is read as `daily`: the strip needs one forecast entry for each day, and the hours have a section of their own. With `twice_daily` (the National Weather Service gives only that and `hourly`) each date has a day entry and a night entry, told apart by Home Assistant's `is_daytime`: the day's icon, high and chance of rain are the day's, and the low is the night's.

The days can share the section with an hourly view, shown as a second tab or on its own. It has settings of its own, described under [Hourly Forecast Section](#hourly-forecast-section).

Hovering over any forecast day column shows a tooltip with date, weather description, max/min temperatures, precipitation, and wind speed/direction. The tooltip content is identical to the Charts section tooltip.

| Option | Type | Description |
| ------ | ---- | ----------- |
| Weather Entity with Forecasts | String | Main weather entity for forecast data |
| Forecast Type | String | `daily` or `twice_daily` (an existing `hourly` is read as `daily`) |
| Entity Forecast Icon 1 | String | Entity for forecast condition icon |
| Entity Forecast Summary 1 | String | Entity for forecast summary text (also used in hover tooltips) |
| Entity Forecast Min 1 | String | Forecast minimum temperature |
| Entity Forecast Max 1 | String | Forecast maximum temperature |
| Entity Forecast Chance of Rain 1 | String | Precipitation probability |
| Entity Forecast Possible Rain 1 | String | Estimated rainfall amount |
| Entity Extended Forecast 1 | String | Detailed forecast text (vertical only) |
| Entity Fire Danger 1 | String | Fire danger forecast (vertical only) |
| Include Today in Forecast | Boolean | Start the strip from today instead of tomorrow |
| Show date next to day | Boolean | Locale-formatted date after the day name (day label font shrinks to fit) |
| Show forecast wind | Boolean | Wind speed/direction in each forecast column |

With **Show date next to day** enabled, the date follows the day name and the label shrinks to fit:

![Daily forecast with dates](https://raw.githubusercontent.com/rudizl/platinum-weather-card-plus-charts/master/images/daily-forecast-dates.png)

## Hourly Forecast Section

Hours and days answer different questions — *will I get wet walking home* against *is the weekend any good* — which is why the hours are a view of the forecast with settings of their own, rather than a second block of the card. They can sit beside the days as a second tab, or replace them.

### Turning it on

Two things are needed, and nothing changes until both are done:

1. **Set the Hourly weather entity**, a weather entity whose provider publishes hourly forecasts.
2. **Switch the Hourly forecast row on.** It is off by default.

In the editor the row is called **Hourly forecast** and sits directly beneath **Daily forecast** in the section list, with a clock icon. It has a switch and one settings button, which holds both the entity and the options, and no reorder arrows: it is a view of the forecast rather than a section of the card, so it stays beneath the daily forecast wherever that is moved.

The Hourly forecast switch and the Daily forecast switch together give the three useful arrangements, without a setting for it:

| Daily forecast | Hourly forecast | Shows |
| --- | --- | --- |
| on | off | days only |
| on | on | both, with a pair of tabs — **Daily** and **Hourly** — the way Home Assistant's own more-info dialog does it |
| off | on | hours only |

Both off shows nothing, which is what it ought to do. The Hourly forecast switch has no effect while no hourly entity is set: the card behaves as though it were off. The tabs appear once the hourly data has arrived.

### Settings

Opened with the settings button on the **Hourly forecast** row:

<p align="center">
  <img src="https://raw.githubusercontent.com/rudizl/platinum-weather-card-plus-charts/master/images/editor-hourly.png" alt="The Hourly forecast settings in the editor" width="720">
</p>

| Setting | Key | Default | |
| --- | --- | --- | --- |
| Hourly forecast (the row's switch) | `show_section_hourly_forecast` | off | Show the hourly view. Needs an hourly entity |
| Hourly weather entity | `entity_hourly` | none | The weather entity the hours come from |
| Hours to show | `hourly_forecast_hours` | `12` | 1 to 48; anything above 48 is capped at 48 |
| Step (hours) | `hourly_forecast_step` | `1` | Take every nth hour. The span is cut first and then thinned, so 24 hours at a step of 3 is eight columns and 48 hours is sixteen. The first column is always kept, since it is the hour you are standing in |
| Combine the hours in a step | `option_hourly_group` | off | With a step above 1, the hours in each step are combined instead of every nth one being taken: the rain is added up, the wind is the strongest, the weather is the worst of them, and the time and the temperature are those of the hour the step starts on. Without it, the rain that falls in the hours that are skipped is not shown |
| Shade the night hours | `option_hourly_shade_night` | on | A faint wash behind the hours the sun is down, so it is obvious where the day ends |
| Show rainfall | `option_hourly_precipitation` | on | A figure under the hours expecting some; the row vanishes when the whole span is dry, rather than printing a column of zeroes |
| Show chance of rain | `option_hourly_pop` | on | A percentage under the hours where rain is possible, in the colour of the rain; the row vanishes when the whole span is dry or the provider gives none. For grouped hours, the highest of the group |
| Show wind | `option_hourly_wind` | off | Speed under each hour, in the unit the hourly entity reports |

### What it shows

<p align="center">
  <img src="https://raw.githubusercontent.com/rudizl/platinum-weather-card-plus-charts/master/images/card-hourly.png" alt="The card with the Daily and Hourly tabs, Hourly open" width="436">
</p>

A column per hour — time in the card's locale, icon, temperature — starting at the hour in progress. Temperatures follow the same decimals setting as the overview (`option_today_temperature_decimals`). The columns scroll sideways, each keeping a minimum width, so the span stays readable rather than being squeezed across a phone.

The night shading is **calculated, not read**. A sun entity reports where the sun is now, and these are hours that have not happened yet, so the card works the elevation out from your latitude and longitude — using the standard −0.833° horizon, which accounts for refraction and the sun's own width and is what "sunrise" actually means.

It is a **separate weather entity** rather than a second forecast type on the one used for the days, and that is deliberate. Most people already run more than one provider, and the one that is better at hours is often not the one they prefer for days: Met.no publishes forty-eight hours, needs no API key and works anywhere, which makes it a common second source even for people whose daily forecast comes from elsewhere. The card subscribes to the two independently.

Two things follow from having both. The temperature and precipitation charts belong to the days, so they are hidden while the hourly view is open — two unlabelled charts of different things, stacked, would be worse than one. And which tab is open is not written to the dashboard: it is a glance rather than a preference, and saving it on every tap would be both surprising and slow.

### Example

```yaml
show_section_hourly_forecast: true
entity_hourly: weather.forecast_home
hourly_forecast_hours: 48
hourly_forecast_step: 3
option_hourly_wind: true
```

## Charts Section

An integrated chart rendered directly below the daily forecast, showing the same days as the forecast strip.

| Option | Type | Description |
| ------ | ---- | ----------- |
| Show Temperature Chart | Boolean | Show max/min temperature polylines |
| Show Precipitation Chart | Boolean | Show precipitation bars with mm labels |

The chart is drawn from the weather entity's daily forecast, the same subscription the forecast strip uses, so no additional entities are required. A card configured with per-day sensors (`entity_forecast_icon_1` and the like) and no weather entity draws its charts from those instead, over the same days as the strip: the temperature chart from `entity_forecast_max_1` and `entity_forecast_min_1`, the rain chart from `entity_pos_1`. A chart whose sensor isn't configured is left out rather than drawn as zeroes.

Hovering over any chart column shows the same tooltip as hovering over the corresponding forecast column.

### Forecast columns and the Charts section

When the **Charts section is disabled**, max/min temperature and precipitation are shown as text directly in each forecast column:

![Forecast columns without charts](https://raw.githubusercontent.com/rudizl/platinum-weather-card-plus-charts/master/images/forecast-columns-no-charts.png)

When the **Charts section is enabled**, the same data is rendered visually as temperature lines (max in orange, min in blue) and precipitation bars in the chart strip below the forecast. The text values are automatically hidden to avoid duplication — the chart already tells the full story.

![Forecast columns with charts](https://raw.githubusercontent.com/rudizl/platinum-weather-card-plus-charts/master/images/daily-forecast-dates.png)

The same five days either way. The whole card in each mode:

| Without charts | With charts |
|----------------|-------------|
| ![Card without charts](https://raw.githubusercontent.com/rudizl/platinum-weather-card-plus-charts/master/images/classic-weather-forecast.png) | ![Card with charts](https://raw.githubusercontent.com/rudizl/platinum-weather-card-plus-charts/master/images/platinum-weather-card.png) |

The two charts are independent, and each hides only its own row:

| | hides |
| --- | --- |
| `option_show_temperature_chart` | the max/min text in each column |
| `option_show_precipitation_chart` | the millimetre text in each column |

So a card with the precipitation chart on and the temperature chart off shows the temperatures as text and the rainfall as bars. If you would rather have the figures as well as the chart, switch off the chart you want the text for — there is no separate control for the text itself, since the pair are two views of one number.

## Global Options

<p align="center">
  <img src="https://raw.githubusercontent.com/rudizl/platinum-weather-card-plus-charts/master/images/global-options.png" alt="Global options in the editor" width="720">
</p>

| Option | Type | Description |
| ------ | ---- | ----------- |
| Icon Pack | String | `default`, `meteocons-fill`, `meteocons-line`, `ha-official`, `wcc-2`, or `custom` |
| Icon Pack Path | String | Path template for `custom` icon pack (e.g. `/local/icons/{condition}.svg`) |
| Show Static Icons | Boolean | Disable animated icons |
| Time Format | String | `system` (follows HA Settings → Profile), `12hour`, or `24hour` |
| Locale | String | Locale for timestamp and moon phase formatting. Supported: `bg`, `cs`, `da`, `de`, `en`, `es`, `fr`, `he`, `it`, `nl`, `pl`, `ru`, `sr` (Cyrillic), `sr-Latn` (Latin), `ua` — when empty, the card follows the Home Assistant interface language |
| Compact slot labels | Boolean | Shorter slot label wording (`option_compact_slots`) |
| Show Gust in Wind Slot | Boolean | Append the gust value to the wind slot |
| Show Beaufort | Boolean | Prefix the wind slot with the Beaufort force |

---

# YAML Reference

Almost all settings can be configured in the GUI editor. The YAML reference below is for advanced use or bulk configuration. Access it via **Show Code Editor** in the card editor.

## Global Settings

| Variable | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `type` | String | — | Must be `custom:platinum-weather-card-plus-charts` |
| `card_config_version` | Number | — | Written by the editor to record the configuration format it has already migrated. Leave it as it is |
| `section_order` | List | warnings, overview, extended, slots, daily_forecast, charts | Section display order. Left out, this is the order, in the card's own copy of the configuration |
| `show_section_overview` | Boolean | `true` | Show/hide overview section |
| `show_section_extended` | Boolean | `true` | Show/hide extended section |
| `show_section_slots` | Boolean | `true` | Show/hide slots section |
| `show_section_daily_forecast` | Boolean | `true` | Show/hide daily forecast section |
| `show_section_charts` | Boolean | `true` | Show/hide charts section |
| `tap_action` | Action | none | Action on tap |
| `hold_action` | Action | none | Action on hold |
| `double_tap_action` | Action | none | Action on double-tap |
| `option_static_icons` | Boolean | `false` | Use non-animated icons |
| `icon_pack` | String | `default` | Icon pack: `default`, `meteocons-fill`, `meteocons-line`, `ha-official`, `wcc-2`, `custom` |
| `icon_pack_path` | String | — | Path template for custom icon pack |

## Actions

The card supports all standard [HA actions](https://www.home-assistant.io/dashboards/actions/), configurable from **Global Options → Actions** in the editor:

![Editor actions](https://raw.githubusercontent.com/rudizl/platinum-weather-card-plus-charts/master/images/editor-actions.png)

Some YAML examples:

```yaml
# Tap — show more-info for a specific entity
tap_action:
  action: more-info
entity: weather.my_weather

# Hold — navigate to another dashboard view
hold_action:
  action: navigate
  navigation_path: /lovelace/misc

# Double-tap — toggle a light
double_tap_action:
  action: call-service
  service: light.toggle
  target:
    entity_id: light.living_room
```

| `option_time_format` | String | `system` | `system` (follows HA Settings → Profile), `12hour` or `24hour` |
| `option_locale` | String | none | Locale for timestamp and moon phase: `bg`, `cs`, `da`, `de`, `en`, `es`, `fr`, `he`, `it`, `nl`, `pl`, `ru`, `sr`, `sr-Latn`, `ua` |
| `text_update_time_prefix` | String | none | Prefix for the update time display |

## Overview Settings

| Variable | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `overview_layout` | String | `complete` | `complete`, `observations`, `forecast` or `title only` |
| `option_show_overview_decimals` | Boolean | `false` | Show 1 decimal on current/apparent temperature |
| `option_show_overview_separator` | Boolean | `false` | Show separator below overview section |
| `text_card_title` | String | none | Title line 1 |
| `text_card_title_2` | String | none | Title line 2 |
| `entity_update_time` | String | none | Entity providing the update timestamp: a date and time (a sensor with the device class `timestamp`, or an attribute that holds one, with `update_time_use_attr`); a state that is not a date and time shows `---` |
| `update_time_use_attr` | Boolean | `false` | Use attribute for the timestamp |
| `update_time_name_attr` | String | none | Attribute name for the timestamp |
| `entity_temperature` | String | none | Current temperature entity |
| `entity_apparent_temp` | String | none | Apparent temperature entity |
| `entity_forecast_icon` | String | none | Forecast icon entity |
| `entity_summary` | String | none | Forecast summary entity |
| `forecast_text_alignment` | String | `center` | `left`, `center` or `right` for the condition text |
| `option_local_forecast` | Boolean | `false` | Compute a local Zambretti forecast and show it as the overview summary text (uses `entity_pressure`, `entity_pressure_trend`, `entity_wind_bearing`, `entity_wind_speed`) |
| `option_local_forecast_verbose` | Boolean | `false` | Full-sentence forecast text with a pressure-tendency clause |
| `option_forecast_altitude` | Number | none | Station altitude in meters — set only when the pressure sensor reports absolute pressure |
| `option_trend_window_hours` | Number | `3` | Time window of your pressure trend sensor, in hours — the tidal correction is averaged over it |
| `option_forecast_algorithm` | String | `zambretti` | `zambretti` or `sager` |
| `entity_wind_bearing_6h` | String | none | Wind bearing six hours ago, from a statistics helper — optional, sharpens one branch of Sager |
| `option_cloud_min_elevation_am` | Number | `10` | Sun elevation below which the sky is not measured, morning |
| `option_cloud_min_elevation_pm` | Number | `10` | The same for the evening, set separately for obstructions on one side |

## Extended Section

| Variable | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `entity_extended` | String | none | Extended forecast entity |
| `extended_use_attr` | Boolean | `false` | Use attribute of the entity |
| `extended_name_attr` | String | none | Attribute name |
| `option_extended_separator` | Boolean | `true` | Put each source on its own line instead of running them together |
| `entity_todays_uv_forecast` | String | none | UV forecast entity |
| `entity_todays_fire_danger` | String | none | Fire danger entity |

## Slots Section

| Variable | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `slot_l1`–`slot_l8` | Slot | see below | Left column slots 1–8 |
| `slot_r1`–`slot_r8` | Slot | see below | Right column slots 1–8 |
| `entity_pop` | String | none | Required for `pop`, `popforecast` |
| `entity_pos` | String | none | Required for `popforecast`, `possible_today` |
| `entity_possible_tomorrow` | String | none | Required for `possible_tomorrow` |
| `entity_rainfall` | String | none | Required for `rainfall` |
| `entity_humidity` | String | none | Required for `humidity` |
| `entity_pressure` | String | none | Required for `pressure` |
| `entity_pressure_trend` | String | none | Optional trend sensor — shows a colored ↗/→/↘ arrow next to the pressure value |
| `pressure_units` | String | none | Optional pressure unit label |
| `entity_observed_max` | String | none | Required for `observed_max`, `temp_maximums` |
| `entity_observed_min` | String | none | Required for `observed_min`, `temp_minimums` |
| `entity_forecast_max` | String | none | Required for `forecast_max`, `temp_maximums` |
| `entity_forecast_min` | String | none | Required for `forecast_min`, `temp_minimums` |
| `entity_temp_next` | String | none | Required for `temp_next` |
| `entity_temp_next_label` | String | none | Required for `temp_next` |
| `entity_temp_following` | String | none | Required for `temp_following` |
| `entity_temp_following_label` | String | none | Required for `temp_following` |
| `entity_uv_alert_summary` | String | none | Required for `uv_summary` |
| `entity_fire_danger` | String | none | Required for `fire_danger` |
| `entity_wind_bearing` | String | none | Required for `wind`, `wind_kt` |
| `entity_wind_speed` | String | none | Required for `wind`; wind speed unit is read automatically from the weather entity attributes |
| `entity_wind_gust` | String | none | Required for `wind` |
| `entity_wind_speed_kt` | String | none | Required for `wind_kt` |
| `entity_wind_gust_kt` | String | none | Required for `wind_kt` |
| `entity_visibility` | String | none | Required for `visibility` |
| `entity_sun` | String | `sun.sun` | Required for `sun_next`, `sun_following`; also decides day or night for the icon. Left out, it is `sun.sun` |
| `entity_moon` | String | none | Required for `moon` (HA Moon integration sensor) |
| `custom1_value`–`custom4_value` | String | none | Entity for custom slot |
| `custom1_icon`–`custom4_icon` | Icon | none | MDI icon for custom slot |
| `custom1_units`–`custom4_units` | String | none | Unit label for custom slot |
| `custom1_label`–`custom4_label` | String | none | Optional text label shown before the value |
| `option_today_temperature_decimals` | Boolean | `false` | 1 decimal on temperature slots |
| `option_today_rainfall_decimals` | Boolean | `false` | 1 decimal on rainfall slots |
| `option_forecast_decimals` | Boolean | `false` | 1 decimal on forecast temperatures |
| `option_show_forecast_pop` | Boolean | `true` | Show precipitation probability in forecast |
| `option_pressure_decimals` | Number | `0` | Decimal places for pressure: `0`–`3` |
| `option_wind_decimals` | Number | `0` | Decimals on wind speed and gust (0–2) — worth setting in m/s, where whole numbers are coarse |
| `option_color_fire_danger` | Boolean | `true` | Colour fire danger by severity |
| `option_wind_bearing_icon` | Boolean | `false` | Show the wind bearing as a rotating arrow icon instead of compass text |
| `option_compact_slots` | Boolean | `false` | Shorter slot label wording (Max, Min, ...) |
| `option_sun_overrides_icon` | Boolean | `true` | Force the day/night variant of the current condition icon from the sun entity's state (its elevation as a fallback), overriding the provider |
| `option_moon_icon_only` | Boolean | `false` | Show only the moon phase icon, without the text |
| `entity_solar_radiation` | String | none | Pyranometer in W/m², for the cloud cover slot |
| `entity_cloud_cover` | String | none | Provider cloud cover, used at night when the pyranometer cannot help: by the cloud cover slot and by the Sager forecast. A sensor in per cent, or a weather entity that gives `cloud_coverage` (met.no does) |
| `entity_rain_rate` | String | none | Rain gauge in mm/h — measured rain overrides a provider reporting clear sky, and drives the rain rate slot. Intensity follows the standard bands: light below 2.5 mm/h, moderate to 10, heavy to 50, violent above |
| `entity_dew_point` | String | none | Dew point sensor, for the comfort line under the apparent temperature |
| `option_show_comfort` | Boolean | `false` | Show how the air feels, in a word |
| `entity_uv_index` | String | none | UV index sensor for the UV index slot |
| `option_cloud_cover_oktas` | Boolean | `false` | Show oktas instead of a percentage |
| `option_cloud_overrides_icon` | Boolean | `false` | Let the measured cloud cover and rain rate correct the condition icon |
| `option_slot_tap_more_info` | Boolean | `true` | Tap on a slot value opens the more-info history dialog |
| `entity_warning` | String | none | MeteoAlarm-compatible binary sensor for the warnings section |
| `entity_lightning_distance` | String | none | Strike detector distance sensor — adds its own warning row |
| `entity_lightning_azimuth` | String | none | Strike detector bearing sensor, for the direction |
| `option_lightning_max_distance` | Number | `50` | Storms further away than this are ignored |
| `show_section_warnings` | Boolean | `true` | Show the warnings section |
| `option_warning_show_expiry` | Boolean | `true` | Show when the warning expires |
| `option_show_gust_in_wind` | Boolean | `true` | Append the wind gust to the wind slot, e.g. "SE 12 (Gust 20) km/h" |
| `option_show_beaufort` | Boolean | `false` | Prefix the wind slot with the Beaufort force, e.g. "BFT: 4 - SE 12 km/h" |

Default slot values: l1=`forecast_max`, l2=`forecast_min`, l3=`wind`, l4=`pressure`, l5=`sun_next`, l6–l8=`remove`, r1=`popforecast`, r2=`humidity`, r3=`uv_summary`, r4=`moon`, r5=`sun_following`, r6–r8=`remove`.

A slot that you did not choose, and that has nothing to read, is not drawn, and not a row of `---`: the wind, the pressure and the humidity when the weather entity does not give them (and no entity of their own is set), the UV summary when `entity_uv_alert_summary` is not set, the chance of rain when the forecast gives neither a chance nor an amount, as the moon, which was not drawn without its entity, and the sun without `entity_sun`. A slot that you choose is always drawn, with `---` when it finds nothing; and so is one whose entity you set, while it is unavailable.

## Daily Forecast Section

| Variable | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `weather_entity` | String | — | Main weather entity. On its own it is enough: unless you set any of the six `entity_*_1` keys, they are this entity, and unless you set any of `entity_forecast_icon`, `entity_temperature`, `entity_apparent_temp`, `entity_humidity`, `entity_pressure`, `entity_visibility`, `entity_wind_bearing`, `entity_wind_speed`, `entity_wind_gust`, `entity_uv_index`, `entity_dew_point`, `entity_cloud_cover`, `entity_forecast_min`, `entity_forecast_max`, `entity_pop` or `entity_pos`, those are too |
| `forecast_type` | String | `daily` | `daily` or `twice_daily`. An existing `hourly` is read as `daily`: the strip needs one entry for each day |
| `daily_forecast_layout` | String | `horizontal` | `horizontal` or `vertical` |
| `daily_forecast_days` | Number | `5` | Days to show: 1–5 (horizontal), 1–7 (vertical) |
| `option_tooltips` | Boolean | `false` | Enable hover tooltips on horizontal forecast columns |
| `option_show_current_day` | Boolean | `false` | Include today in forecast strip |
| `option_daily_forecast_date` | Boolean | `false` | Show a locale-formatted date (e.g. 13.07) next to the day name |
| `option_show_forecast_wind` | Boolean | `false` | Show forecast wind speed/direction in each column |
| `entity_forecast_icon_1` | String | none | Condition icon for day 1: a weather entity, or the first of a numbered series of sensors (auto-incremented for each day). Unless you set any of the six `entity_*_1` keys, they are `weather_entity` |
| `entity_forecast_min_1` | String | none | Minimum temperature for day 1 (auto-incremented for each day) |
| `entity_forecast_max_1` | String | none | Maximum temperature for day 1 (auto-incremented for each day) |
| `entity_pop_1` | String | none | Chance of rain for day 1 (auto-incremented for each day) |
| `entity_pos_1` | String | none | Possible amount of rain for day 1 (auto-incremented for each day) |
| `entity_summary_1` | String | none | Weather summary for day 1, also used in the hover tooltip (auto-incremented for each day) |
| `entity_fire_danger_1` | String | none | Fire danger for day 1, vertical layout only (auto-incremented for each day) |
| `entity_extended_1` | String | none | Extended forecast text for day 1, vertical layout (auto-incremented for each day) |
| `daily_extended_use_attr` | Boolean | `false` | Read the extended forecast text from an attribute of `entity_extended_1` instead of its state |
| `daily_extended_name_attr` | String | none | Name of that attribute |
| `daily_extended_forecast_days` | Number | `7` | Extended forecast days (vertical only, 0–7) |
| `option_daily_color_fire_danger` | Boolean | `true` | Colour fire danger (vertical only) |
| `old_daily_format` | Boolean | `false` | Stack max/min vertically instead of side by side |
| `tempformat` | String | — | `highlow` = show max before min |

## Hourly Forecast Section

| Variable | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `show_section_hourly_forecast` | Boolean | `false` | Show the hourly view. Has no effect until `entity_hourly` is set; together with `show_section_daily_forecast` it gives days only, both with tabs, or hours only |
| `entity_hourly` | String | none | Weather entity whose provider publishes hourly forecasts |
| `hourly_forecast_hours` | Number | `12` | Hours to show, 1 to 48 |
| `hourly_forecast_step` | Number | `1` | Take every nth hour — 24 hours at 3 is eight columns |
| `option_hourly_group` | Boolean | `false` | Combine the hours in each `hourly_forecast_step` (rain added up, strongest wind, worst weather) instead of taking every nth hour |
| `option_hourly_shade_night` | Boolean | `true` | Shade the hours the sun is down; calculated from `latitude`/`longitude`, not read from a sensor |
| `option_hourly_precipitation` | Boolean | `true` | Rainfall under the hours expecting some |
| `option_hourly_pop` | Boolean | `true` | The chance of rain under the hours that have one |
| `option_editor_all_entities` | Boolean | `false` | Editor only: offer every entity in the lists of the pickers that offer what a field can read, instead of what it can read |
| `option_hourly_wind` | Boolean | `false` | Wind speed under each hour, in the hourly entity's unit |

## Charts Section

| Variable | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `option_show_temperature_chart` | Boolean | `false` | Show max/min temperature lines. Hides the max/min text in the forecast columns while on |
| `option_show_precipitation_chart` | Boolean | `false` | Show precipitation bars. Hides the millimetre text in the forecast columns while on |

The chart uses the same `weather_entity` and `daily_forecast_days` settings as the Daily Forecast section. No additional entities are required.

[license-shield]: https://img.shields.io/github/license/rudizl/platinum-weather-card-plus-charts.svg?style=flat
[releases-shield]: https://img.shields.io/github/v/release/rudizl/platinum-weather-card-plus-charts?style=flat
[releases]: https://github.com/rudizl/platinum-weather-card-plus-charts/releases
