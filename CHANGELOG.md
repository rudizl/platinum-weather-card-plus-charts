# Changelog

All notable changes to Platinum Weather Card Plus Charts. The newest version is at the top. Each version lists what was **added**, what **changed** and what was **fixed**; the notes of every release, with the same text, are on the [releases page](https://github.com/rudizl/platinum-weather-card-plus-charts/releases).

## 2.7.0 (unreleased)

**In short:** the weather moves behind the card, a pack of photographic icons, and softer warnings. Everything of 2.6.0 is in it too.

### Added

- **Weather effects** (experimental). `option_effects` (`off`, `subtle` or `full`) and `option_effects_area` (`overview` or `card`): clouds drift across at the speed of the wind, rain falls in three strengths and slants with the wind, snow sways and flies nearly sideways in a blizzard, stars come out on a clear night, fog and dust roll in, a storm flashes with the lightning detector, frost glints, heat shimmers, a golden hour warms the morning and the evening, and a rainbow comes after the rain with the sun out. The effect is chosen from the name the card settles on for its icon, after the rain gauge and the pyranometer have corrected the provider. Every movement is a CSS animation; nothing runs in JavaScript for each frame. Off unless you turn it on, still when the device asks for less motion, hidden from screen readers and out of the way of clicks.
- **The `photoreal` icon pack.** Twenty-five pictures, generated with Google's Gemini by the card's author and cut out by hand, bundled with the card (WebPs of 384 pixels, 0.6 MB in all), with the skies of 25 to 55 per cent and of broken clouds drawn for what a pyranometer measures.
- **A soft style for the warning rows**, the default (`option_warning_style`: `soft` or `classic`). The row is a stripe on the left in the colour of the level, fading out to the right; a storm beyond 30 km is a small pill with its distance and direction, a bar from 30 km in, a bolder one from 15 km. The classic style is the flat tinted bar of 2.6.0.

### Changed

- **The editor by topic.** The editor had nine blocks on its first screen and 162 settings under them, and a topic was spread over several: the warnings in three places, the fire danger in five, the sky between the title and the language in Global Options, the local forecast split between the Overview, the first screen and Global Options. Each section keeps its row, with its switch, its arrows and one pencil for where it takes its data from; everything else is on five pages by topic, **Appearance**, **Warnings**, **Sky and rain from sensors**, **Local forecast** and **Card and language**; and the actions are a group of their own, **Interactions**, at the bottom of the first screen, as in the cards of Home Assistant. Global Options and the second button of the sections are gone. No key changes, so a configuration written for 2.6 works as it is. The colour of the fire danger waits, greyed, for a fire danger entity, and the local forecast is called that in every language, since there is Sager as well as Zambretti. Each row says, in a line under its title, what it is set to: the icon pack and the effects, the warning entity and the range of the lightning, the sensors of the sky, Zambretti or Sager, the title and the language, the days and the hours, so that a setting can be seen without opening its page. The English labels are in sentence case, as in Home Assistant, the classic style of the warnings is called classic, and a choice left empty is called the default. Thirty-two tests, among them one that every setting of 2.6 is still on a page, one that none is on two, and one that every language has the placeholders of English.

- **The icons come in four files, not 136** (#41). A release carried a file for every picture, because the Marketplace installs a card from the files of its release one by one: 54 animated icons, 54 static ones, 25 photoreal pictures and two that nothing used. Each built-in pack is one file beside the card now, `icons-animated.js`, `icons-static.js` and `icons-photoreal.js`, which the build makes from the folder `icons/`, and a card loads only the pack it shows; a card with a pack from a CDN or a path of its own loads none. The photoreal pictures are WebPs, 0.6 MB instead of 2.3 MB, with the transparency byte for byte what it was and no difference to see at three times their size. A pack is asked for with the version of the card in its address, which keeps a phone from an older picture (it was a revision number in the address of each picture). Until the pack has come, the icon is a transparent pixel, for a moment, once. If you pointed another card or a custom pack at one of the old files (`a-clear-day.svg` and the like), copy the pictures you use to `/local`. Eleven tests, five breakages caught.

### Fixed

- **The big icon of the default pack starts at the top of the figures for every condition** (#40). The drawings leave the place of the sun empty when there is none, so a plain cloud, the wind, fog, snow, rain without a sun, a storm and the moon by night sat lower than the figures of the temperature: the wind by 22 px, fog by 40, the moon by 5. Each of those 77 icons (in `icons/animated` and `icons/static`, which go into the modules of the packs) has a viewBox now that raises the drawing by exactly that and keeps its size; measured in the card, the top of the drawing is 0 to 2 px from the top of the figures for every condition. The animated hurricane is left as it is: it spins, and at some moment fills the box. The days and the hours use the same files, so their icons line up at the top as well. Five tests; the measurement is in `scripts/measure-icon-tops.py`.
- **"Use attribute" for the summary of the days is read by the tooltip of the charts too** (#39). With the switch on, the text of each day comes from an attribute of its sensor instead of its state; the tooltip of the days across and the text of the days down read it, and the tooltip of the days drawn with the charts read the state alone. All three read it now. Eight tests: the three places with and without the switch, and the switch in the editor.
- **A lightning detector in miles is read in miles** (#38). The distance was compared, as it came, with limits written for kilometres, so with a detector in miles (Blitzortung follows the unit system of Home Assistant) the default range of 50 was 50 miles, the row turned red within 15 miles and amber within 30, and the editor said *Warn within (km)*. The colours work in kilometres whatever the unit: red within 15 km (9 mi), amber to 30 km (19 mi). The range stays in the unit of the entity, as it has always been compared, so a value someone set keeps meaning what it meant; left unset, it is 50 km in that unit (31 mi). The editor names the unit of the chosen detector, and the default in it, in the 15 languages. A distance without a unit is read in kilometres, as before. The flashes of the weather effects, which read the same distance and took it for kilometres, are worked out in kilometres too. Ten tests, four breakages caught.
- **At night the icon shows the sky the cloud slot shows.** The cloud slot and Sager read the sky after dark from the cloud cover entity (`entity_cloud_cover`), while the correction of the icon read only the pyranometer, so at night the icon was the provider's alone: on 6 November at 20:14 a card drew a partly cloudy night (a station of Weather Underground, which measures no cloud) beside a cloud cover of 1% and "the sky is clear" (met.no). With **Measurement corrects the icon** on and a cloud cover entity named, the icon at night follows its bands, the ones the day uses; a forecast of cloud does not overrule a claim of rain, snow or a storm, nothing is guessed from other entities, and the photoreal pack keeps its broken clouds for a sky that was measured. The README also had the bands of the icon at 55 and 85%; they are 50 and 75% since 2.6.0. Nine tests, four breakages caught.
- **The sky of the effects no longer goes over a warning that is above the overview.** The layer of the effects reaches 14 pixels up past the overview and 28 to each side, to the edges of the card, so that it does not stop in a box at the top of the section. With a warning above the overview it went over the bottom of the warning's bar: in a browser the bar ended at 52 pixels and the layer began at 42, so the bar was cut ten pixels from its bottom, with a flat edge under a rounded top. A section that is not the first no longer has that reach, and the layer fades in at its top instead. Three new tests.

## 2.6.0 (2026-11-06)

**In short:** one weather entity is enough for a whole card, and the card offers itself under *Add to dashboard → By entity*; the lists of the editor offer what each field can read; a twice-daily forecast fills the strip and the charts; the hourly strip has the chance of rain and a moon at night; Sager has a sky at night; a warning that names two hazards shows both; a sky that is wholly covered is drawn as one; and the fixes below.

### Added

- **A weather entity is all the card needs.** A card with a `weather_entity` and no sensors showed the daily strip (since 2.5.2) and `---` everywhere else, although the card could already read each figure from a weather entity when each setting was pointed at it by hand. Now, when you have set none of the measurement settings (`entity_forecast_icon`, `entity_temperature`, `entity_apparent_temp`, `entity_humidity`, `entity_pressure`, `entity_visibility`, `entity_wind_bearing`, `entity_wind_speed`, `entity_wind_gust`, `entity_uv_index`, `entity_dew_point`, `entity_forecast_min`, `entity_forecast_max`, `entity_pop` and `entity_pos`), the card treats them as the weather entity, in its own copy of the configuration and never written back to yours. Set any one of them to a sensor, and nothing is filled in around it, so a weather station beside a forecast stays exactly what you made it; one set to the weather entity itself changes nothing. The provider's cloud cover for the night (`entity_cloud_cover`) is filled in with them, and naming it changes nothing else. A provider that does not give a figure shows `---`; the feels-like line, and the gusts beside the wind, are left out rather than printed as dashes.

  Three readings the card could not take from a weather entity now work: the **UV index**, the **dew point** (for the comfort word) and the **cloud cover**. A weather entity's own **visibility unit** is used, where the card used to assume the system's.
- **Adding the card from the picker now works, both ways in.** In *Add to dashboard*, pick a weather entity under *By entity* and the card is offered under *Community* (Home Assistant 2026.6 and later), set up for the entity you picked: the overview, the slots, the days and the charts, all from that entity. Where the entity can also do hourly forecasts there are two variants, *Daily forecast and charts* and *Daily and hourly forecast*. An entity that cannot do daily forecasts is not offered the card, because the days and the charts would be empty; and nothing is offered for anything that is not a weather entity. Under *By card* the card has a live preview, filled in with one of your weather entities, one that can do days if there is one. Before, a new card came out empty and every field had to be filled in by hand, and it was never offered by entity at all. With no weather entity there is nothing to fill in, and the card shows its sections without data until it is set up.
- **Hours combined in a step, as a choice.** `hourly_forecast_step` thins the hours by taking every nth one, and the rain that falls in the hours it skips is not shown at all. A new switch, off by default so that nothing existing changes, combines the hours in each step instead: the rain is added up, the wind is the strongest, the weather is the worst of them, and the time and the temperature stay those of the hour the step starts on.
- **The card knows its size in the sections view.** It tells Home Assistant it takes all twelve columns, as it always has there, that its height follows its content, and that it should not be dragged narrower than six columns, where it is unreadable.
- **The hourly strip draws a moon at night.** A clear sky at 23:00 was a sun: every forecast icon is made a day icon, which is right for a day and wrong for an hour of the night. Each hour is now day or night by what the provider says of it (`is_daytime`) or, without that, by where the sun is at that hour, worked out for the card's place. The days are as they were. The same sum shades the night hours of the strip, and it was out by up to a quarter of an hour in the autumn, because the sun is not a clock and the formula left out the equation of time: on 24 October it put the sunrise 22 minutes after Home Assistant's own. It is now within two minutes of `sun.sun`'s sunrise and sunset, which a test checks.
- **The chance of rain under the hours** (discussion #34, from @ChittyChittyBang). The hourly strip showed how much rain is expected but not how likely it is, which is what someone watching the washing wants to know. A percentage now goes under the temperature of each hour that has one, in the colour of the rain, and the row is dropped when the whole span is dry or the provider gives no chances. For hours grouped by `hourly_forecast_step` it is the highest of the group. It is on, and `option_hourly_pop: false` (or the switch in the editor, in all fifteen languages) takes it off; the amount of rain has its own switch and the two do not depend on each other. Nine new tests.
- **A warning that names two hazards shows both.** MeteoAlarm warns of one hazard in a warning, but a service can put two in one: the red warning of 2 November 2026 for Varna, from the national institute, was "Heavy precipitation and strong wind!", of the type `10; Rain`, and the card drew *Red code: Rain*: the wind was in the description, which is only the tooltip. The card names now the hazards that the title of a warning says besides its type, with an icon for each, at most two: *Red code: Rain + Wind*. It reads the title (`event` and `headline`) and not the description, and knows English and Bulgarian words (precipitation says rain only when it is not said of snow); a title in another language, or a type that the card does not know, is drawn as it was. On a phone the text of such a bar does not fit beside the time that the warning ends, and it takes a second line instead of being cut. Twenty-eight new tests.
- **The cloud cover entity can be a weather entity.** The card reads it from the attribute `cloud_coverage` of a weather entity, or from the state of a sensor, but the picker in the editor offered sensors only, so that met.no's weather entity, which gives the number, could not be chosen for the cloud cover shown at night. Both pickers offer weather entities now, and only the ones that can be a sky: a weather entity that gives a cloud cover, and the sensors in per cent that are named for a sky (cloud, overcast, sky, облачност, bewölkung...), or every sensor in per cent when the house has none: not the thousand sensors of a house (anything else can still be typed in). Fourteen new tests.
- **Sager has a sky at night.** After dark the pyranometer sees nothing and the last reading is good for six hours; past that Sager had no sky to read and called a covered night *fair* (on 26 October at 21:11 it said *fair and cooler* under a sky that met.no gave as 99% covered). The cloud cover slot already read *Cloud cover entity (night fallback)* (`entity_cloud_cover`), and Sager did not. It reads it now, as the slot does (the attribute `cloud_coverage` of a weather entity, or the state of a sensor, in per cent), and when none is named, or it gives no number, `cloud_coverage` of the entity of the hourly forecast and of the card's weather entity. What the card measured comes first, now and for six hours. Fourteen new tests.
- **The lists of the editor offer what each field can read.** The pickers of the temperatures (eleven of them), of the humidity, of the pressure and of the wind (six) offered every sensor of the house, and this one has more than a thousand. They offer what the field can read: a sensor by its device class or its unit (a temperature in °C, °F or K, a pressure in hPa and the other units of pressure, a speed in km/h, m/s, mph or knots, a direction in degrees, a humidity in per cent with a name that says so), and a weather entity by the attribute that the field reads. A house that has no sensor that fits a field is offered every sensor for it, anything else can still be typed in, and **Offer every entity in the lists** (`option_editor_all_entities`), in the global options, turns the narrowing off. The pickers of the second batch (thirteen) follow the same rules: the update time (a sensor with the device class timestamp), the solar radiation (irradiance, W/m²), the rain rate (mm/h) and the rain (mm), the UV index, the visibility, the moon, the lightning distance and bearing (a distance or degrees *named for lightning*), and the hourly weather entity (one that gives an hourly forecast). A house that has no hourly weather entity is offered every one. Text fields (icons, summaries, the fire danger) are not narrowed. Twenty-six new tests.

### Changed

- **`entity_sun` is `sun.sun` when you do not name one** (#30, from @johnnyh1975). It is the only sun entity Home Assistant has, so a card that names none can only mean that one. A card that never set `entity_sun` used to draw day icons all the time, at night too, because without a sun entity it had nothing to tell day from night; now it follows the sun, and the sunrise and sunset slots have a time to show. Where the sun integration is not loaded nothing changes. Like the other defaults it lives in the card's own copy of the configuration, and is never written back or warned about.
- **Two small things in the editor and the picker** (also #30). The UV index and dew point pickers offer weather entities, which the card already read both from. And the card picker prefers a weather entity that no card on the dashboard shows yet, with one that can do daily forecasts still coming first.
- **An entity that is missing no longer hides the card.** A setting that names an entity Home Assistant does not have (deleted, renamed, or not loaded yet when Home Assistant starts) put a warning box above the card, and in the sections view the box pushed the card itself out of its place: one missing optional sensor, and all that was seen was the warning. The card is drawn now, with what it has, and the warning is a short row at its top that names each missing entity, for as long as it is missing. Five new tests.
- **A sky that is wholly covered is no longer drawn as broken clouds.** The card reads a cloud cover from the pyranometer as 1 less the radiation that it measures over what a clear sky would give, and that is not the cover of the sky: a thick overcast lets through only 10 to 25% of a clear sky's light, so a sky that is wholly covered measures as 75 to 90%. With the edges of the bands at 25, 55 and 85%, a morning in November with 44 W/m² under a sun 23 degrees up (84%, an overcast and rain) was drawn as the sun with two thin streaks of cloud. The edges of the measured sky are 25, 50 and 75% now, with the same hysteresis, for every icon pack and for the effects behind the icon; the number in the cloud cover slot is the same as before. The older tests of the bands copied the formula into the test, and so could not see the card's own edges: twenty new tests ask the card.
- **Slots that nobody chose are not drawn when they have nothing to read.** A card of a weather entity alone drew the ten slots of the defaults, and with a provider that gives no humidity, no pressure or no wind, or in a house with no UV warning, that was rows of `---` that nobody had asked for. A default slot that has no source is not drawn now: the wind, the pressure and the humidity (read from the weather entity, or from the entities that are set), the UV summary (it needs its own entity), and the chance of rain (when the forecast has arrived and gives neither a chance nor an amount). What you chose yourself keeps its `---`, and an entity that you set is a source even while it is unavailable, so that a slot does not come and go. The height that the card reports follows the slots that are drawn. Ten new tests.

### Fixed

- **A card written in YAML without `section_order` now draws its sections** (#27, from @johnnyh1975). The README documents a default order, but the card never applied one: only the editor wrote it, so a card written by hand drew an empty frame with no warning. The default is warnings, overview, extended, slots, daily forecast and charts, in the card's own copy of the configuration and never written back; an order you give, even a shortened one, is left alone.
- **Old slot names are renamed again** (#28, from @johnnyh1975). The editor's clean-up renames the pre-2022 slot values `daytime_high` and `daytime_low`, but its loop ran over one string holding all sixteen slot names, so nothing was ever renamed and old configurations kept a value no slot matches.
- **The icon stops flickering in light rain, and at the top of the hour.** The piezo gauge reports in steps of 0.6 mm/h: in a light shower it reads 0.6 for ten minutes and 0.0 between the ticks, and on 19 October, between 20:33 and 23:48, five bursts separated by gaps of two and five minutes and one lull of a hundred made the icon change about ten times. A reading above zero now counts as rain for fifteen minutes, which bridges the gaps and still lets go in a lull. And a weather entity that drops out for a moment, as `weather.ivarna103` does for a fraction of a second at the top of every hour, keeps its last condition for ten seconds instead of flashing a different icon.
- **A press on a reading that has an action of its own no longer also runs the card's hold action.** The card listens for presses on its own element, where the browser reports that element rather than what was pressed, so the check for a press that began on such a reading could never match, and a long press on it also ran the card's hold action. It now looks at where the press really began.
- **A twice-daily forecast fills the strip and the charts** (#35, from @artbird309, who found the cause and wrote the fix). With the National Weather Service, which gives only `twice_daily` and `hourly`, the strip and the charts stayed empty. A date has two entries there, a day and a night, and the card told them apart by `daytime`, which Home Assistant does not say: it says `is_daytime`. The day's icon, high and chance of rain now come from the day entry and the low from the night entry; the old name is still read, for whatever gave it. The forecast was also cut to the days asked for by counting entries, two to a day, so five days kept two and a half; it is counted by date now, for a twice-daily forecast only. And in the evening, when a date has only its night, that temperature is shown as the low and no longer as the high of the day. Nine new tests run the card with a forecast like the National Weather Service's, and fail on the old code.
- **The helper for the wind six hours ago takes the circular mean.** The recipe for Sager said `average`, and a plain mean of a direction is wrong around north: 350° and 10° make 180°, a south wind made of two northerly ones. On the station this card was built against it read 170° for six hours that averaged 28°. Home Assistant's Statistics helper has `mean_circular` for directions. Its characteristic cannot be changed once the helper exists, so if yours takes a mean, make a new one with the circular mean and give it the old entity ID; the card needs no change.
- **Three small things found while the pictures of this README were taken.** The lightning row puts a space between the distance and its unit (`8 km`, not `8km`). A time format that the card does not know (`option_time_format: 24`, say, where it takes `12hour` or `24hour`) means the one of Home Assistant, where the times of the sun were drawn as `undefined`. And the boxes of the values on the chart follow the mode of Home Assistant: in a light theme they were dark patches, and now they are light, with the text colour of the theme; dark mode is as it was, and `--pwcc-chart-label-background` and `--pwcc-chart-label-color` set them by hand. Ten new tests.
- **An overcast sky and a moderate rain no longer draw a tornado with a custom pack.** The card names the icon for a cloud cover of 75% and over `cloudy-3` (it was 85% in 2.5.2: see the paragraph on the bands of the measured sky), and for a rain of 2.5 to 10 mm/h (measured by the rain gauge) `rainy-2`, with a day or a night, and the table of picture names that the `custom` and `wcc-2` packs use did not have those two: they fell to `exceptional`. Anyone who lets the sensors choose the icon had a tornado under an overcast sky or in a moderate rain. (It is in 2.5.2 too.) Both are in the table now, and a name that the table does not have takes the picture of its family; only what is meant to be exceptional (`dust`, `tropical-storm`, a condition that is not known) still does. Nine new tests go through the real choice, with a solar sensor and a rain gauge, and the four that matter fail on the old table.
- **The big icon of the Meteocons packs is enlarged and moved up** (#37). The Meteocons icons (`meteocons-line` and `meteocons-fill`, from a CDN) are drawn in a 64 by 64 frame, and the drawing of the usual ones (a cloud, rain, snow, wind) lies between 17 and 47 of it: a quarter of the frame is empty above and as much below. In the card the big icon looked small and low, a good thirty pixels under the top of the temperature. Their big icon is enlarged by 1.3 and moved up now, so that the top of its drawing is level with the top of the digits of the temperature: each icon by its own amount, since the drawing of a sun starts higher in the frame than that of a cloud, and the fill style sits a little lower than the line style (measured on the icons of both styles and checked in a browser, frames over eight seconds for the icons that move); the other packs are cut tight and are not touched. Nine new tests.
- **A name that the card does not know is a cloud, and not a tornado.** With a custom pack (and the wcc-2 one) a condition that the table of picture names did not have, or that a provider called `unknown`, fell to the picture of the tornado: it was what an overcast sky and a moderate rain looked like (see the paragraph above), and what any new name still looked like. A tornado is for what is meant to be one (`exceptional`, `tornado`, `hurricane`); a name that is not known is the plain cloud, which says nothing. One new test.
- **The update time shows `---` when its entity does not give a date** (#36). The line of the update time read the state of its entity with `new Date(state)`, and a browser reads a bare number as a date: 1 is the first of January 2001, 2 the first of February. Someone whose entity was not giving a date saw "00:00 Mon 1 Jan 2001", and with other texts "Invalid Date". A state or an attribute that is not a date and time (a year of four digits and something between the parts, that the browser can read) is `---` now, the card's sign for no value; the dates that were read before are read as they were. The README says what the entity has to give. Thirty-four new tests.
- **The slots of today read a twice-daily forecast as the strip does** (#35, the rest of it). The forecast high and low, the chance of rain and the possible rain took the first entry of the forecast as it came, and with the National Weather Service that is a day or, in the evening, a night: the high could be the night's temperature and the low was never there. For a twice-daily forecast they read the first date as the strip reads a day: the high from the day, the low from the night, and a date that has only its night has no high. A daily forecast is read as it was. Five new tests.
- **The big icon keeps the proportions of its picture.** The box of the big icon is 140 by 120 pixels and its picture was told to be all of it. An SVG fits itself in and keeps its proportions; a PNG, a custom pack's, was stretched to the box (a disc came out an oval, 1.17 to 1). Four new tests.
- **The editor keeps `forecast_type`, `show_section_charts`, `pressure_units` and `option_daily_color_fire_danger`.** The first time the editor opens a card that has no `card_config_version` (one written in YAML, or one from before the version), it removes the settings that it does not know, and these four, documented here, were among them: a card set to `twice_daily` went back to daily, and hidden charts came back, as soon as the editor was opened. They are known now, and a test checks every setting in the tables below against the ones the editor keeps.
- **A card that leaves the page ends its hourly subscription too.** When a card was taken off the page (a change of view, of edit mode, a save of the editor: Home Assistant makes the cards again each time), it ended its subscription to the daily forecast and not the one to the hourly forecast, which went on sending forecasts to a card that was gone and kept it in memory.
- **The tooltips of the forecast say the wind in the unit of the weather entity.** They read the unit from a setting the card no longer has, and fell back to the unit system: a forecast in m/s was labelled km/h in a metric house.
- **Ukrainian is chosen when Home Assistant is in Ukrainian.** Home Assistant names the language `uk`, and the card keeps its Ukrainian as `ua`, so a house in Ukrainian had the card and its editor in English.
- **The update time is read by the card, not by the browser.** A date with dots was read month first: `05.10.2026 10:00` was the 10th of May, and `27.10.2026 10:00` nothing at all; and `2026-02-31` was the 3rd of March. The card now reads ISO 8601 (with a `T` or a space, with or without an offset), `DD.MM.YYYY HH:MM`, `YYYY/MM/DD HH:MM` and the form that a browser writes; a date or time that cannot be is `---`, and US-style dates with slashes (`10/27/2026`) are `---`, not guessed.
- **A pressure of null is no pressure.** A weather entity that gives its pressure as `null` showed a pressure of 0 in the slot, and gave the forecasts 0 hPa; it is `---` now, and the forecasts have no pressure to read, as with an empty value.
- **Two stations on one dashboard no longer share a sky.** What the card remembers between readings (the samples of the pyranometer, the band of the icon, the last daylight sky, the last shower, the held gauge reading, the last condition of a provider that blinks) was kept once for every card on the page, whatever its sensors: a card that measures no sky showed the sky of another, a dry gauge gave Sager the shower of another, and of two pyranometers read a moment apart one was dropped. It is kept per sensor now, and the cards of the same sensor still share it.
- **A forecast that Home Assistant refuses is asked for again.** When the weather entity was not there yet (an integration that loads after the dashboard, or one that failed and was mended), Home Assistant refused the subscription to its forecast, the card never asked again and stayed without a forecast until the page was reloaded. It waits for the entity now, asks again when the entity changes, and the refusal is no longer an error in the browser's console.
- **The hourly forecast is asked for again too.** The hourly forecast is a subscription of its own, to `entity_hourly`, and the card kept a refusal of it as if it were the subscription that was made: a page loaded while the integration was off (its entity is then `unavailable`) stayed without the hours until it was reloaded, even after the integration was back. It asks again when the entity changes now, as the daily forecast does, and the refusal is no longer an error in the browser's console. Five new tests.
- **The pressure trend is read in the unit of its sensor.** A trend sensor in inHg/h, mmHg/h or Pa/min was read as hPa/h: -0.06 inHg/h, a barometer falling fast, was steady for Sager, for Zambretti and for the arrow of the pressure slot. The unit of the sensor is converted now (hPa/3h too); a sensor with no unit is hPa/h, as before.
- **The sea-level correction reads the temperature in its unit.** With an altitude set, both forecasts correct the pressure to sea level by the temperature of the air, and Sager read 68 °F as 68 °C (about 5 hPa off at 300 m, enough to change its forecast) and a weather entity as no temperature at all. Both forecasts now read the temperature of the sensor in its unit, or the temperature of the weather entity in its own, and judge the same pressure.
- **A card set to Ukrainian writes its days and numbers in Ukrainian.** The language list of the editor names Ukrainian `ua`, but its language code is `uk`, and the browser, not knowing `ua`, wrote the days, the dates and the numbers in English.
- **Naming the cloud cover entity no longer empties a card of a weather entity.** `entity_cloud_cover`, the provider's sky for the night that Sager reads, was one of the measurement settings, and setting any of those means that nothing is filled in from the weather entity: a card that named it, as this README recommends, lost its temperature, its icon and its slots, with no warning, even when it named the weather entity itself. It is a fallback now and not a choice, and a measurement setting pointed at the weather entity itself is no choice either.

  Four hundred and seventy-seven new tests run the card itself, seven of them from @johnnyh1975's pull requests. They cover the card's side of the Sager forecast, the rain rate slot, the Beaufort tables, the vertical layout and the tap, double tap and hold actions, as well as each way the picker finds the card. They guard what must not change too: a user's own sensors, a weather entity that is not there, a provider without a feels-like or gusts, an entity that does not say what it can do, the hours as they were when the switch is off, and a gauge that has read 0.0 all along, which is dry at once.

## 2.5.2 (2026-10-22)

### Added

- **A `weather_entity` on its own is enough for the daily strip** (#24, reported by @alanmilinovic). The strip reads six per-day settings: icon, summary, minimum, maximum, chance of rain and possible rain. Pointed at a weather entity they can only ever be that entity, and leaving them out gave an empty strip that said nothing about why. When you have set none of them, the card now treats them as the weather entity, in its own copy of the configuration and never written back to yours. Set any one of them, to a sensor or to the weather entity, and nothing is filled in, so setups with per-day sensors are untouched. Warnings about forecast attributes are for settings you made, so they are not raised for keys the card supplied.

### Changed

- The README now starts with the description and the badges, and has a section on where the days come from
- The YAML reference lists the per-day keys by name (`entity_forecast_icon_1` and the rest), which it only did by editor label before, and `card_config_version`

### Fixed

- **`forecast_type: hourly` no longer empties the strip.** The strip takes one forecast entry for each day (two, day and night, for `twice_daily`), and hourly data has up to 24 entries a day, so it was left with nothing, and the charts, which read the same forecast, with it. The card now asks Home Assistant for the daily forecast when `hourly` is stored, and the editor no longer offers *Hourly* as a forecast type: the hours have their own section and their own subscription, which this does not touch. A configuration that still says hourly is read as daily, and shown as daily in the editor.
- **The overcast icon with the Meteocons packs.** When the cloud correction picks the thickest band, as it does for a provider's rain overruled by a dry gauge under a thick sky, the two Meteocons packs had no file for it and drew the pack's "not available" icon: N/A where the weather should be. It now maps to Meteocons' own overcast icon. A new test checks, for every icon pack, that every name the card can produce lands on a real icon.

  The configuration posted in #24, exactly as it was, now draws its days without any change to it. The reporter confirmed it on his own OpenWeatherMap setup, and I tried it on mine with Met.no. Fourteen new tests run the card itself; eight of them fail on the old code, and the rest guard what must not change: per-day sensors, partly configured keys, `twice_daily` and the hourly view.

## 2.5.1 (2026-10-19)

### Changed

- The README now renders in HACS. It shows the file as raw text inside Home Assistant, where a relative image path resolves against Home Assistant rather than GitHub and gives a broken image; all of them are absolute now
- A section for people arriving from the original Platinum Weather Card, which HACS no longer lists, and the step that was missing from the installation: what to put in the YAML
- Twenty-six new tests run the card itself rather than read its source, each written first and shown failing against the old code

### Fixed

- **The charts now draw from per-day sensors** (#23, second report, from @BJReplay). A card configured the way the original Platinum Weather Card was — per-day sensors, `entity_forecast_icon_1` and the rest, no weather entity — drew its forecast strip but no chart. The charts read only a weather entity's forecast, found none, and drew nothing, with no message; and because the strip hides its own temperature and rain text when a chart is switched on, someone who had just migrated lost the figures from the columns and got no chart in their place, until they set a weather entity. The charts now read the same sensors as the strip, over the same days. A chart whose sensor is not configured is left out, rather than drawn as a line of zeroes.
- **The tab no longer hangs when `entity_hourly` is set without a `weather_entity`** (#23, reported by @hastarin with a complete diagnosis). The hourly subscription shared a condition with the daily one, which is only ever satisfied when there is a weather entity to subscribe to. Without one — or with `forecast_type: legacy` — it was re-issued after every update, and each re-issue is itself a state change that schedules the next update, so the tab never got a turn. It now has a condition of its own, and still retries until the hourly entity exists.
- **A dry gauge that overrules a claimed rain now has something to show when the sky cannot be measured.** The card decided the rain was not real and then chose the replacement from the measured cloud cover alone. After dark, or with the sun under the 10° morning cut-off, there is none, so the provider's rain icon stayed: `rainy` all evening on 14 October and at dawn on 17 October, against a gauge reading 0.0 mm/h. Rain implies cloud, and plain overcast is the one thing the provider's own report supports, so that is what it shows. Where the sky *can* be measured, the measurement still decides
- **A gauge that drops out for a moment no longer flashes the rain icon back.** The station's gauge reports `unavailable` for between one and seven seconds every so often, which was read as "no gauge" and handed the icon back to the provider for as long as it lasted. The icon now holds the last real reading for a minute; the rain rate slot is unaffected, and a gauge that has really died stops overruling anything after that minute
- **Day and night follow the sun entity.** The card waited for the sun's elevation to clear 0°, but Home Assistant flips `sun.sun` where the upper limb meets the horizon, about 0.83° earlier, and the sunrise and sunset slots count from that instant. For some five minutes at each end the icon said night while the slot beside it said the sun had risen: a moon on the card at 07:23 on 16 October. The icon now uses the entity's own state, and falls back to the elevation at Home Assistant's horizon if the state is anything unexpected

## 2.5.0 (2026-10-15)

### Added

- **An hourly forecast** (#18). Hours and days answer different questions — *will I get wet walking home* against *is the weekend any good* — and a forecast strip of days cannot answer the first. Set **Hourly weather entity** to a provider that publishes hourly data, switch the new **Hourly forecast** row on, and the daily forecast section gains a pair of tabs, **Daily** and **Hourly**, the way Home Assistant's own more-info dialog has them. Met.no is the easy source: forty-eight hours, no API key, works anywhere, and it does not have to be the provider you use for days — the two are separate entities on purpose, and the card subscribes to them independently.

  The section list now has an **Hourly forecast** row of its own, directly beneath the daily forecast, with a switch and its own settings. Between the two switches they give days only, both with tabs, or hours only, without a setting for it. The hours are a column each — time, icon, temperature — scrolling sideways instead of being squeezed across a phone. They can show rainfall (the row disappears when the whole span is dry), wind, and a shade behind the night hours, which is worked out from your latitude and longitude because a sun entity only knows where the sun is *now*. A **step** takes every nth hour, so a step of three turns twenty-four hours into eight columns. The temperature and precipitation charts belong to the days and are hidden while the hours are open.
- **Serbian**, in both scripts: `sr` (Cyrillic) and `sr-Latn` (Latin), the card, the editor and the forecast texts, including everything above. Contributed by @cpmarexel2f (#22). Region-qualified codes such as `sr-RS` and `sr-Cyrl-RS` now resolve to the right script, and the language lookup lives in one function instead of eight copies — which is what the contribution's first draft showed was too easy to get subtly wrong.

### Fixed

- **A dry gauge now overrules a provider claiming rain, whatever the sky.** The old rule required full sunshine as well as a dry gauge, because it was written for one case, a claimed thunderstorm over a sunlit garden. It therefore missed the commonest disagreement of all: a grey afternoon, the provider says rain, the gauge reads 0.0 mm/h with nothing all day, and the card drew rain. A pyranometer cannot see rain, so cloud has no say in it; the gauge measures exactly the claim being made. Rain only — snow, hail and storms stay with the provider, and without a gauge configured the provider stands
- Tapping a tab no longer fires the card's own tap action: on a card with `tap_action` set to navigate, switching from Daily to Hourly carried you off to another view
- The hourly wind carries the unit of the entity it came from rather than Home Assistant's system setting. Met.no publishes km/h while a metric system says m/s, so 12 km/h was shown as *12 m/s* — three times the wind, and plausible enough to go unnoticed. The same mistake as #20, made again in new code
- Tests now compare every translation section across all languages, including Sager and the moon phases, a full or empty compass, and unit labels for any language not written in Latin script — a Cyrillic card that kept `km/h` would have passed before

## 2.4.0 (2026-09-17)

### Added

- **The Sager Weathercaster, as a second forecast algorithm.** Zambretti reads only the barometer, which is why an overcast morning under a rising high comes out as *fine weather* — it has no way to see the sky. Sager (1942) reads six things rather than three, the sky among them. Choose it under **Forecast algorithm**; Zambretti remains the default.

  Cloud comes from the pyranometer and rain from the gauge, both already configured if the icon correction is in use. After dark, when a pyranometer says nothing, the forecast falls back to the last daylight reading for six hours. A **Wind bearing six hours ago** helper sharpens one branch — a backing wind under a falling barometer is a warm front arriving — but is not required.

  Measured against a real station: of four summer convective events, three were warned an hour ahead with no false alarms, while the barometer stayed silent throughout. Against a front arriving before dawn it added nothing, and that limit is structural — documented rather than papered over.
- **A nearby storm warns in the warnings section.** Point **Lightning distance entity** at a strike detector and a storm within range gets a row beside any provider warning, coloured by distance: red within 15 km, amber to 30. Add the bearing and the row says which way it lies.

### Fixed

- Plain overcast was the one sky state the icon correction could not touch: the guard required a day/night suffix that `cloudy` does not have, which is also the state providers most often get wrong
- A provider claiming a storm over a sunlit, dry garden is now overruled — under 15% cloud and a dry gauge rule out a thunderstorm overhead, whatever the region is doing
- A gap between showers read as fine weather; the forecast now remembers rain for ninety minutes

## 2.3.4 (2026-09-10)

### Changed

- Four slots existed with no documentation: `cloud_cover`, `rain_rate`, `uv_index` and `wind_gust`. Now in the slot table
- Documented that each chart hides only its own text row: the temperature chart hides the max/min figures, the precipitation chart hides the millimetres, independently
- The dew point comfort table now shows Fahrenheit alongside Celsius — the boundaries are originally Fahrenheit, which is why the Celsius figures look arbitrary
- Vitest upgraded to 4.1.11, closing a moderate path-traversal advisory in a development dependency

### Fixed

- `rain_rate` appeared twice in the slot dropdown, and its duplicate `case` in the editor was unreachable — the empty one won, so the gauge entity was never requested
- Both charts were documented as on by default; they are off
- **The chart stopped a day short of the forecast strip** when *Include today in forecast* was off (discussion #21). The forecast was trimmed to the configured number of days counting from today, while the card displayed from tomorrow — so the last day it went on to ask for had already been discarded. Five columns, four points, and the points spread across the full width rather than lining up beneath the columns. Reported by @safepay

## 2.3.3 (2026-09-06)

### Added

- **A word for how the air feels**, under the apparent temperature: *dry*, *comfortable*, *muggy*. Relative humidity says little about comfort on its own — 60% at 15°C is pleasant and 60% at 30°C is unbearable — while dew point is the actual moisture content, so its bands hold whatever the temperature is. Seven bands from the US National Weather Service. Off by default; set **Dew point entity** and switch on **Show how the air feels**

### Fixed

- **Units are read from the entity rather than from Home Assistant's global unit system** (#20). The card took the value from one place and the label from the other, so an instance set to US customary printed a Celsius reading from Met.no as °F — the figure was correct and only the suffix was wrong, since nothing is ever converted. Pressure and wind already worked this way; temperature and precipitation now do too, falling back to the system setting only when nothing states a unit of its own. Reported by @BadrexSWE

## 2.3.2 (2026-08-10)

### Added

- **A rain gauge outranks both the provider and the pyranometer.** Weather Underground reported clear-night while the station's gauge read 1.2 mm/h. Point `entity_rain_rate` at your gauge and measured rain replaces a clear or cloudy icon, with the intensity following the standard bands — light below 2.5 mm/h, moderate to 10, heavy to 50, violent above. It still leaves alone a provider reporting snow, hail or a storm, which knows something about the precipitation a tipping bucket does not, and it is not smoothed the way cloud cover is: rain starting is an event, not a state to average
- **Rain rate slot** — how hard it is raining now, as distinct from the rainfall slot, which totals what has fallen today. Coloured by intensity
- **UV index slot** — the measured number, coloured by the WHO exposure bands, alongside the existing uv_summary slot, which shows a provider's wording
- **A fifth icon pack: Home Assistant's own weather icons.** Every other pack introduces a second visual style to a dashboard; this one is what Home Assistant already draws elsewhere

### Fixed

- Heavy cloud rendered N/A: the heaviest band returned a name without a day/night suffix, so it matched no file
- A provider reporting rain, snow, fog or a storm could be overridden by the cloud measurement — heavy cloud is exactly when it is most likely to be right
- The UV slot sat higher than the slot beside it: slot icons were never centred within their box, so an icon whose artwork sits high lifted its whole row
- The icon pack and text alignment selects sat in half a row with nothing beside them, truncating their options mid-word
- Bulgarian wording for Zambretti letter k: *вероятни* overstated a band that means showers are possible rather than likely

## 2.3.1 (2026-08-07)

### Changed

- Cloud cover is the median of the last five minutes, with hysteresis on the band boundaries, and shared across every card on the page rather than measured per card — two cards were showing different icons for the same sky. Broken cloud swings the raw reading across the whole icon range within minutes; on real data from one such morning this cuts the icon changing from eight times in twenty-five minutes to once
- The icon correction follows the ordinary cloud bands — clear below 25%, lightly cloudy to 50%, cloudy to 75%, overcast above (they were 25, 55 and 85 in 2.5.2). Correcting only at the extremes left the common case wrong: a provider claiming full sun while the pyranometer saw 59% cloud kept its sun icon
- The pyranometer settings moved to Global Options. They were behind the cloud cover slot, which meant the icon correction could not be used without also displaying a reading nobody had asked for — the two are independent and are now configured independently

## 2.3.0 (2026-08-06)

### Added

- **Warnings section** — an active severe-weather warning from MeteoAlarm or any CAP-compatible integration, in the card's own language rather than the feed's, with visual weight following the severity level
- **Cloud cover from a pyranometer** (#19) — measured rather than forecast, with an optional icon correction that acts only on a flat contradiction
- **The sun decides day/night icons** — some providers report `clear-night` with the sun 35° above the horizon
- Decimals on wind speed and gust (#15)
- Each source on its own line in the extended section (#16)
- Alignment for the condition text (#17) — honoured by the stylesheet all along, but missing from the editor and documentation

### Changed

- The semidiurnal atmospheric tide is subtracted from the pressure trend. At mid latitudes it reaches 0.32 hPa/h on its own, so an uncorrected forecast deteriorated every afternoon and recovered every morning regardless of the weather. ⚠️ Set **Pressure trend window** to match your Derivative helper — default 3 hours
- Wind direction is used only when steady: gate raised to 8 km/h, plus a circular-concentration test over the last 15 minutes. A vane in light air sweeps the whole compass, and the algorithm applies up to ±8.35 hPa from the bearing
- Thresholds raised to ±0.30 hPa/h in, ±0.20 out — the scale the algorithm was built around
- The tendency clause is read live, so it can no longer contradict the pressure slot's arrow (#12)
- The README now states plainly what a purely barometric method cannot see
- **Editor** — section names lost the redundant "section", controls stay on one line on a phone, and the two-column rows are a real grid
- **Tests** — the project had none at the start of this cycle and now has 283, run on every build. Eleven of the fixes above were found by writing them

### Fixed

- Wind slot showed `unavailable NaNkm/h` when its sensors dropped out; six slots printed `NaN` or leaked the raw state
- A single `null` in the forecast poisoned the whole temperature chart rather than leaving one gap
- Precipitation units follow the sensor instead of assuming mm or inches
- `Entity_forecast_max` was capitalised in a 2022 migration, silently discarding the maximum temperature for anyone with an older config
- Moving the first section up wrote `undefined` into `section_order` and the section vanished
- The temperature-decimals migration deleted its own setting
- Wind speed ignored the sensor's unit

## 2.2.3 (2026-08-01)

The card is now available in the **HACS default store** — no custom repository needed.

### Added

- The current temperature and the apparent ("feels like") temperature open their history in the more-info dialog when tapped, matching the slot values. Requested by @blaal02

### Changed

- `option_show_gust_in_wind` and `option_show_beaufort` were working but undocumented

### Fixed

- A long press on a tappable reading also fired the card's own hold action. The tap handlers stop the click, but the card starts its hold timer on `pointerdown`, which has already propagated by then. Affects the slot taps introduced in v2.2.0

## 2.2.2 (2026-07-31)

### Changed

- Type checking is now part of `npm run build`. It had been silently broken: syntax errors inside `@types/node` aborted `tsc` before it ever reached the card's sources, so the missing variable above shipped without a warning. Node types are excluded and the twenty-one type errors this exposed are fixed

### Fixed

- **Charts and daily forecast disappeared** when both sections were enabled (v2.2.1 only). The chart's tooltip code still referenced a variable removed by the v2.2.1 date-alignment fix, throwing `ReferenceError: startIdx is not defined` and aborting the render of both sections. Reported by @jerrymjones (#13)
- **Security: tooltip contents are now escaped.** The chart and forecast tooltips are assembled as HTML strings and passed through `unsafeHTML`. Forecast descriptions and unit strings taken from entity attributes were interpolated unescaped, so crafted attribute data could inject markup into the dashboard. All string values are now HTML-escaped and numeric values are validated before they reach a style attribute. Reported by @frenck during HACS review

## 2.2.1 (2026-07-31)

### Changed

- The Zambretti section now warns that the local forecast needs sea-level (relative) pressure, with a ten-second check for an uncalibrated station and the two places the correction can be made

### Fixed

- Chart and daily forecast strip could show a different number of days, with the chart's points landing under the wrong columns. The strip resolves each day by date and stops when one is missing; the chart used plain array indices, so whenever the provider's forecast array had not rolled over yet (just after midnight) the two drifted apart. The chart now walks dates with the same lookup and cut-off rule
- Wind bearings returned as Cyrillic abbreviations were not recognised — Weather Underground mixes them with the Latin ones in the same response (`Ю`, `NNE`, `ESE`, `SE`, `И`). Those days showed no wind arrow, and the local Zambretti forecast silently dropped its wind correction. All 16 Bulgarian abbreviations plus the Russian/Ukrainian `В` family are now parsed
- Three inline copies of the compass table (forecast arrow, both tooltip builders) replaced by the shared one, so a fix in one place can no longer miss the others

## 2.2.0 (2026-07-20)

### Added

- **Tap on slot value opens history** (#9)
  - Tap any slot value (humidity, pressure, wind, ...) and the native more-info dialog opens with the history/statistics graph. Only sensor-backed slots are tappable (pointer cursor + hover highlight); weather-attribute slots stay inert. Card-level tap/hold actions unaffected. `option_slot_tap_more_info`, on by default
- **Long text can no longer break the slot layout** (#10 follow-up)
  - Slot columns are pinned 50/50; long texts (moon phase, UV, fire danger, custom values) truncate with an ellipsis and a hover tooltip instead of collapsing the section to a single column
  - Slot layout converted from CSS tables to flex, scoped to the slots section
- **HA interface language as default** (#8 discussion)
  - When Locale is left empty, the card now follows the Home Assistant interface language for texts and dates (previously: English texts + browser-language dates). The Locale dropdown remains a full override
- 🇨🇿 Czech — thanks @VlastiBroucek (#11), the card's first community translation; selectable in the editor dropdown
- English Zambretti texts modernized per @jerrymjones's native review: "fine" → "fair", "Fairly fine" → "Mostly fair", "Changeable, mending" → "Changeable, improving", "Very unsettled" (short + verbose sets)
- German reviewed by a native speaker (@00pi) — no changes needed

### Fixed

- "uv_rating 6" instead of "UV 6" — translation key lost in the v2.1.0 i18n rework, added in all 13 languages (thanks @00pi)
- Forecast column numbers could overlap (caught by @00pi)
- Language count corrected in docs (13)

## 2.1.1 (2026-07-16)

### Added

- New option **"Moon phase: icon only"** (`option_moon_icon_only`) — hides the moon phase text, keeping just the icon. Long phase names (e.g. German "Zunehmender Dreiviertelmond") could force the slot section into a single column (#10, thanks @00pi)
- Moon phase text now shows the full name as a tooltip on hover

## 2.1.0 (2026-07-14)

### Added

- **Local forecast (Zambretti)**
  - The card can compute a short local forecast entirely from your own weather station — no internet, no forecast provider. Classic Zambretti forecaster (1915, ~90% accuracy for the next 12h) using barometric pressure, its trend, wind direction and season
  - Enable via Overview Section → Options; the computed text replaces `entity_summary`. 26 forecast texts fully translated in all 13 languages
  - Optional verbose mode: full-sentence phrasing plus a pressure-tendency clause ("Unsettled weather, with rain expected later. The pressure is falling.")
  - Pressure units auto-converted (hPa/mbar, inHg, mmHg, kPa, psi, Pa); optional station-altitude sea-level correction for absolute-pressure sensors; hemisphere auto-detected from HA latitude
  - Built-in smoothing for fast-reporting stations: wind direction ignored below 2 km/h, trend hysteresis (±0.12 in / ±0.08 out hPa/h), and a 5-minute debounce before the displayed text changes
- **Date next to day name**
  - Optional locale-formatted date in the daily forecast day labels — "ПН 13.07" (bg), "Mon 7/13" (en-US). Works in both layouts; the day label font shrinks slightly when enabled
- **Barometric pressure trend indicator** (#7)
  - Point `entity_pressure_trend` at a trend sensor and the pressure slot shows a colored arrow next to the value: ↗ green (rising), → gray (steady), ↘ red (falling)
  - Accepts a numeric rate of change (hPa/h, e.g. a Derivative helper — recipe in the README) or the text states `rising`/`steady`/`falling`
- **Wind bearing arrow** (#7)
  - `option_wind_bearing_icon` — the wind slot shows a rotating arrow (pointing where the wind blows) instead of compass text; works with both degree and compass-text sensors

### Changed

- All strings extracted to per-language files (`src/translations/`) — contributions are now a single-file edit
- Editor fully translated in all 12 non-English languages; unit labels moved into the translation system
- All 28 on/off controls replaced: lock icon-buttons → compact toggle switches (gray off / green on, pure CSS, no HA component dependency)
- Layout consistency pass: labels sit above their dropdowns everywhere, selects match label font size (13px), no more wrapped toggle labels
- Help-text hints now render at 12px in the secondary text color; new hint under Station altitude

### Fixed

- UV forecast / Fire danger entity picker labels in the Extended section were blank in 11 of 13 editor languages
- Compact Max/Min slot labels now translated in de, es, fr, it, nl, pl, da (previously fell back to English)
- Wind bearing arrow rotation not applied in some setups; gust arrow toggle removed (gusts have no direction data)
- bg: "полумесец" → "луна" for crescent moon phases

**Want the forecasts to sound right in your language?** Native-speaker review is very welcome — see [issue #8](https://github.com/rudizl/platinum-weather-card-plus-charts/issues/8)

## 2.0.8 (2026-07-06)

### Changed

- **Performance: bundle size 508K → 223K (−56%)**
  - Removed the dead Material Web Components chain — the editor registered mwc textfield/select/switch/formfield definitions that were never consumed (the ScopedRegistryHost mixin was disabled), yet all @material/* packages were still bundled. The editor exclusively uses `ha-input`/`ha-selector`/native selects since the HA 2026.x compat work.
- `CARD_VERSION` and `package.json` version now match release tags (console banner was stuck at "2.0.0-preview")
- Removed 499 lines of dead code: action-handler-directive.ts (replaced by pointer events in v2.0.4), helpers.ts, translations.ts, commented-out debug lines
- Removed unused directories (elements/, rollup-plugins/) and 10 unused dependencies

### Fixed

- **Chart tooltip date locale**
  - Chart tooltip dates had a hardcoded Bulgarian locale fallback when Locale was set to Auto — now follows browser/HA locale like the forecast tooltips
- **Chart precipitation unit label**
  - Bar labels were hardcoded to "мм" — imperial users saw a mm label on values that HA had already converted to inches (`precipitation_unit` attribute). Label now resolves the unit the same way the tooltip does: entity attribute → unit-system fallback → localized
- **Icon URLs with cache-busting query params**
  - `?v=`/`?hacstag=` params from the resource URL were leaking into built icon SVG URLs via `import.meta.url` — query string is now stripped before building icon paths
- **Pointer listener leak**
  - `connectedCallback` added new bound listeners on every card reattach with no cleanup; now uses stable bound references with `removeEventListener` in `disconnectedCallback`

## 2.0.7 (2026-07-01)

### Fixed

- **Missing weather icons for non-Meteocons icon packs**
  - The 110 built-in SVG icon files (`Default` icon pack) were never included as release assets — only the JS file was uploaded. HACS only downloads what's present in the release. All icon SVGs are now attached to releases alongside the JS.
- **False "value needs to have a number" warning**
  - `entity_pop`, `entity_forecast_min`, `entity_forecast_max` (single "today" values without `_1` suffix) were incorrectly validated against a digit-in-entity-ID regex meant only for the day-increment pattern (`_1`, `_2`, `_3`...). Helper/template sensors without digits in their name now work correctly.

## 2.0.6 (2026-07-01)

### Added

- **Compact slot labels**
  - Toggle in Global Options ("Compact slot labels" / `option_compact_slots`) shortens slot section text — "Forecast Max" → "Max", "Forecast Min" → "Min", "Observed Max/Min" → short form, "Forecast" prefix hidden
  - Localized for all 12 supported languages

### Fixed

- **BG translation**
  - "Локал" → "Език" for the Global Options locale dropdown label

## 2.0.5 (2026-06-15)

### Fixed

- **Slot editor layout**
  - Slot dropdowns were cramped and truncated — label and dropdown were on the same horizontal line
  - Labels are now above their dropdowns, giving each dropdown the full column width

## 2.0.4 (2026-06-13)

### Added

- **Actions in Global Options**
  - Tap / Hold / Double-tap actions configurable from the visual editor
  - Card Title 1 / 2 moved from Overview section to Global Options
  - Translations for all 12 supported languages
- **Use Attribute for entity_summary_1**
  - Toggle + attribute picker for non-weather sensor entities
  - Config keys: `summary_1_use_attr` + `summary_1_name_attr`

### Fixed

- **Tap/hold/double-tap actions on mobile**
  - Replaced the custom `action-handler-directive` with a `click` + `pointerdown` hybrid that works reliably in HA Companion App (Android WebView / sections view scroll container)
  - `click` → tap / double-tap; `pointerdown` + 500ms → hold

## 2.0.3 (2026-06-12)

### Fixed

- **Horizontal scroll in dashboard**
  - `ha-card`: `overflow: hidden`; `.day-horiz`: removed `float: left`, added `min-width: 0`

## 2.0.2 (2026-06-12)

### Fixed

- **Day/night icons broken with non-English HA**
  - Use `sun.sun` elevation attribute (numeric, language-independent) instead of translated state string (`above_horizon`/`below_horizon` is translated in non-English setups)

## 2.0.1 (2026-06-12)

### Changed

- Locale dropdown — full language list in Global Options instead of text field
- GitHub Actions CI with HACS validation (`hacs/action@main`) and build check

### Fixed

- Fix: remove `resize-observer-polyfill` import — use native `ResizeObserver`

## 2.0.0 (2026-06-11)

### Added

- **Charts Section** (merged from Weather Chart Card)
  - Temperature lines (max/min) rendered as continuous polylines below the daily forecast
  - Precipitation bars with millimetre labels, scaled to the day with highest rainfall
  - Configurable independently: toggle temperature chart and precipitation chart separately
  - `section_order` support — Charts appears as its own section, reorderable in the editor
  - `show_section_charts`, `option_show_temperature_chart`, `option_show_precipitation_chart` config keys
- **Hover Tooltips**
  - CSS `:hover` tooltips on both **forecast columns** and **chart columns** — identical content in both places
  - Shows: date (bold), weather description (from `entity_summary_1` sensor), **↑ max°** (red), **↓ min°** (blue), 💧 precipitation, wind direction arrow + speed
  - Dark background (`rgba(10,20,40,0.96)`), white text — readable on any dashboard theme
  - Wind unit read directly from `weather.*` entity attributes (never falls back to HA system `m/s` for entities that report in `km/h`)
  - Units localized to HA app language (`km/h` → `км/ч`, `mm` → `мм` for Bulgarian, etc.)
  - Tooltip width spans the full section width, matching forecast section behaviour
- **Icon Packs**
  - `meteocons-fill` / `meteocons-line` — [Meteocons](https://github.com/basmilius/weather-icons) by Bas Milius (MIT, loaded from jsDelivr CDN)
  - `wcc-2` — [amCharts Weather Icons](https://www.amcharts.com/free-animated-svg-weather-icons/) via `rudizl/weather-chart-card` (CC BY 4.0)
  - `custom` — any icon set via `icon_pack_path` with `{condition}` placeholder
  - Selectable from the editor's **Global Options** → **Icon Pack** dropdown

### Changed

- Lock/unlock icons for section visibility toggles (replacing `ha-switch`)
- MDI section icons throughout
- Global Options moved to the top of the editor
- i18n framework with 112 translated strings — EN and BG complete
- `option_show_current_day` — include today in the forecast/chart strip instead of starting from tomorrow
- Config validation in `setConfig`
- HA 2026.5/2026.6 compatibility: `ha-textfield` → `ha-input`, WebAwesome switch tokens, `ha-switch` removal

## 1.x

The first year, before the v2.0.0 rewrite.

The card began as a merge of Platinum Weather Card and Weather Chart Card, and most of this line went on making that merge hold together against a moving Home Assistant. The editor dropdowns broke three times in a row as HA retired `mwc-list-item`, then `ha-list-item`, then the switch colour tokens; they were finally settled by dropping the HA components altogether for native `<select>` elements, which is why they have not broken since.

The rest was mostly the card learning to say nothing gracefully. Sensors that return `unknown` or `unavailable` had been rendering as `NaN%` and `unknownmm` across a dozen slots, and the extended section printed the raw word below its separator.

Features added along the way: the `moon` slot with its phase icons, `option_show_current_day`, labels on the custom slots, `double_tap_action`, Spanish, wind units read from the weather entity, and time and date formats following the HA profile. The build became a single file, and `resize-observer-polyfill` went — about 30 KB for something every browser HA supports has had natively since 2020.
