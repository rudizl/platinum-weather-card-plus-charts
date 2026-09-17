import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

// The hourly forecast is a chart rather than a row of columns, because that is
// the shape the data has: twenty-four hours will not fit as columns the way five
// days do, and an hourly temperature is one number rather than a max and a min.

const card = readFileSync(join(__dirname, '..', 'src', 'platinum-weather-card.ts'), 'utf8');
const editor = readFileSync(join(__dirname, '..', 'src', 'editor.ts'), 'utf8');

describe('the hourly section reads its own entity', () => {
  it('subscribes separately from the daily forecast', () => {
    // Not a second forecast type on the same entity: most people already have
    // two providers, and the one that is better at hours is often not the one
    // they prefer for days. It also leaves the daily subscription — the part
    // that already works — completely alone.
    expect(card).toContain('_subscribeHourly');
    expect(card).toMatch(/subscribeForecast\(\s*this\.hass, entity, 'hourly'/);
  });

  it('does not subscribe without an entity, or when the section is off', () => {
    const fn = /async _subscribeHourly\(\)[\s\S]*?\n  \}/.exec(card)![0];
    expect(fn).toMatch(/if \(!this\.isConnected[\s\S]*?!entity\) return;/);
    // Configuring the entity is what turns the hours on; there is no separate
    // switch, because the tabs are absent without it anyway.
    expect(fn, 'a dead show_section flag is still being checked')
      .not.toContain('show_section_hourly_forecast');
  });

  it('unsubscribes before resubscribing, as the daily one does', () => {
    const fn = /async _subscribeHourly\(\)[\s\S]*?\n  \}/.exec(card)![0];
    expect(fn).toMatch(/this\._unsubscribeHourly\(\);/);
  });
});

describe('the hours shown', () => {
  it('drops hours already past', () => {
    // A provider that updates hourly leaves the current hour in its array for
    // most of that hour; anything older is history.
    const getter = /get hourlyForecast\(\)[\s\S]*?\n  \}/.exec(card)![0];
    expect(getter).toContain('cutoff');
    expect(getter).toMatch(/Date\.now\(\) - 3600000/);
  });

  it('defaults to twelve and never exceeds forty-eight', () => {
    // Met.no publishes 48; drawing all of them makes an unreadable chart, and
    // the far end of it is a guess anyway.
    const getter = /get hourlyForecast\(\)[\s\S]*?\n  \}/.exec(card)![0];
    expect(getter).toMatch(/Math\.min\(hours, 48\)/);
    expect(getter).toMatch(/: 12;/);
  });

  it('falls back to the raw array if every entry looks past', () => {
    // Rather than rendering nothing at all when a provider's timestamps are
    // offset or stale.
    const getter = /get hourlyForecast\(\)[\s\S]*?\n  \}/.exec(card)![0];
    expect(getter).toMatch(/upcoming\.length \? upcoming : data/);
  });
});

describe('the hourly view is columns, like the days above it', () => {
  // A line chart came first. Columns read better for this: an hourly
  // temperature is one number and the hours want reading one at a time, which
  // is what a column does. It also keeps one visual language across the card.
  const fn = /_renderHourlyForecastSection\(\)[\s\S]*?\n  \}\n/.exec(card)![0];

  it('draws a time, an icon and a temperature per hour', () => {
    for (const cls of ['hourly-time', 'hourly-icon', 'hourly-temp']) {
      expect(fn, `no ${cls}`).toContain(cls);
    }
  });

  it('uses the card\'s own icon resolution', () => {
    // So the hours follow whichever icon pack is selected, rather than
    // introducing a second set.
    expect(fn).toContain('this._getIconUrl');
    expect(fn).toContain('this._weatherIcon');
  });

  it('shows rainfall only where there is some', () => {
    // A column of zeroes is noise.
    expect(fn).toContain('showRain');
    expect(fn).toMatch(/p > 0/);
  });

  it('drops the rain row entirely when the whole span is dry', () => {
    expect(fn).toMatch(/showRain\s*\?[\s\S]*?: html``/);
  });

  it('falls back rather than printing NaN', () => {
    // Providers do occasionally send a null temperature for a single hour.
    expect(fn).toMatch(/isFinite\(t\)/);
    expect(fn).toContain("'---'");
  });

  it('draws nothing at all with no data', () => {
    expect(fn).toMatch(/if \(!forecast \|\| forecast\.length === 0\) return html``;/);
  });
});

describe('the two views share one section', () => {
  // First attempt made hours a section of their own, sitting under the days.
  // Home Assistant's own more-info dialog uses tabs, and so should this: hours
  // and days answer different questions — "will I get wet walking home"
  // against "is the weekend any good" — and you want one at a time.

  it('switches with tabs rather than stacking', () => {
    expect(card).toContain('_renderForecastTabs');
    expect(card).toMatch(/forecast-tab/);
    expect(card, 'hours are still dispatched as their own section')
      .not.toMatch(/case 'hourly_forecast':/);
  });

  it('keeps the choice in component state, not config', () => {
    // A glance is not a preference; writing it to the dashboard on every tap
    // would be surprising and slow.
    expect(card).toMatch(/@state\(\) private _showHourly/);
    expect(card, 'the tab choice is being written to config')
      .not.toMatch(/_config\.\w*show_hourly/);
  });

  it('shows no tabs at all without an hourly entity', () => {
    // Most people will not configure one, and a single lonely tab is worse
    // than none.
    // Tabs are for choosing: with one view configured they would be a
    // control that does nothing, so they appear only in 'both'.
    const fn = /_renderForecastTabs\(\)[\s\S]*?\n  \}/.exec(card)![0];
    expect(fn).toMatch(/this\._forecastMode !== 'both'/);
    expect(fn).toMatch(/if \(!this\.hourlyForecast\) return html``;/);
  });

  it('does not draw the daily chart under the hourly view', () => {
    // Two charts of different things, stacked, with no label saying which.
    expect(card).toMatch(/if \(!showingHours\) sections\.push\(this\._renderChartSection\(\)\)/);
  });

  it('scrolls sideways rather than squeezing every hour in', () => {
    // Forty-eight columns across a phone would be unreadable; each keeps a
    // minimum width and the strip slides instead.
    expect(card).toMatch(/\.hourly-scroll \{[^}]*overflow-x: auto/);
    expect(card).toMatch(/\.hourly-col \{[^}]*min-width/);
  });

  it('contains the sideways scroll so it does not drag the dashboard', () => {
    expect(card).toMatch(/overscroll-behavior-x: contain/);
  });

  it('has a row of its own, under the forecast it belongs to', () => {
    // Buried inside the Daily Forecast panel it was unfindable: you had to know
    // to open that pencil and scroll. It is its own row now, pushed directly
    // after the daily forecast rather than at the end of the list.
    expect(editor).toMatch(/case 'hourly_forecast':/);
    expect(editor).toMatch(/if \(slot === 'daily_forecast'\) \{\s*\n\s*htmlConfig\.push\(this\.getConfigBlock\('hourly_forecast'/);
    expect(editor).toMatch(/case 'option_hourly_forecast':/);
  });

  it('has no reorder arrows or visibility switch on that row', () => {
    // It is a view of the forecast, not a section: there is nothing to reorder
    // and nothing to hide, since the mode select decides which view shows.
    const row = /case 'hourly_forecast':[\s\S]*?\n        `;/.exec(editor)![0];
    expect(row).not.toContain('down-icon');
    expect(row).not.toContain('pwc-switch');
    expect(row).toContain('edit-icon');
  });

  it('offers only weather entities for the source', () => {
    const panel = /_hourlyForecastOptions\(\)[\s\S]*?\n  \}/.exec(editor)![0];
    expect(panel).toMatch(/includeDomains=\$\{\['weather'\]\}/);
  });
});

describe('the hourly settings', () => {
  it('offers days, hours, or both', () => {
    const panel = /_hourlyForecastOptions\(\)[\s\S]*?\n  \}/.exec(editor)![0];
    for (const mode of ['daily', 'hourly', 'both']) {
      expect(panel, `no '${mode}' option`).toContain(`value="${mode}"`);
    }
  });

  it('gives that select a getter, like every other one', () => {
    // A select without one renders blank however the config reads — the fault
    // that left two dropdowns permanently empty back in v2.2.2.
    expect(editor).toMatch(/get _hourly_forecast_mode\(\): string \{/);
    expect(editor).toMatch(/\.value=\$\{this\._hourly_forecast_mode\}/);
  });

  it('falls back to daily for an unrecognised mode', () => {
    // Someone editing YAML by hand can write anything at all.
    const fn = /private get _forecastMode\(\)[\s\S]*?\n  \}/.exec(card)![0];
    expect(fn).toMatch(/mode === 'hourly' \|\| mode === 'both' \? mode : 'daily'/);
  });

  it('forces daily when no hourly entity is configured', () => {
    // Otherwise a leftover mode: 'hourly' would leave the card showing nothing.
    const fn = /private get _forecastMode\(\)[\s\S]*?\n  \}/.exec(card)![0];
    expect(fn).toMatch(/if \(!this\._config\?\.entity_hourly\) return 'daily';/);
  });

  it('thins the columns with a step rather than shortening the span', () => {
    // Two days at three-hourly is the same eight columns as eight hours at one,
    // and says a great deal more.
    const getter = /get hourlyForecast\(\)[\s\S]*?\n  \}/.exec(card)![0];
    expect(getter).toContain('hourly_forecast_step');
    expect(getter).toMatch(/i % Math\.round\(step\) === 0/);
  });

  it('always keeps the first hour when stepping', () => {
    // It is the hour you are standing in; dropping it would be odd.
    const getter = /get hourlyForecast\(\)[\s\S]*?\n  \}/.exec(card)![0];
    expect(getter).toMatch(/i % Math\.round\(step\) === 0/);
    expect([0, 3, 6].every((i) => i % 3 === 0)).toBe(true);
  });

  it('ignores a step of one or less', () => {
    const getter = /get hourlyForecast\(\)[\s\S]*?\n  \}/.exec(card)![0];
    expect(getter).toMatch(/!isFinite\(step\) \|\| step <= 1/);
  });
});

describe('night shading', () => {
  it('computes the sun rather than reading it', () => {
    // The sun entity says where the sun is now; these are hours that have not
    // happened yet, and nothing in Home Assistant publishes that.
    const fn = /_renderHourlyForecastSection\(\)[\s\S]*?\n  \}\n/.exec(card)![0];
    expect(fn).toContain('sunElevation');
    expect(card).toMatch(/import \{[^}]*sunElevation[^}]*\} from '\.\/zambretti'/);
  });

  it('uses the standard horizon, not zero', () => {
    // -0.833° accounts for refraction and the sun's own width: it is the
    // definition of sunrise, and using 0 would call the golden hour night.
    const fn = /_renderHourlyForecastSection\(\)[\s\S]*?\n  \}\n/.exec(card)![0];
    expect(fn).toContain('-0.833');
  });

  it('does nothing without coordinates', () => {
    const fn = /_renderHourlyForecastSection\(\)[\s\S]*?\n  \}\n/.exec(card)![0];
    expect(fn).toMatch(/typeof lat === 'number'/);
    expect(fn).toMatch(/typeof lon === 'number'/);
  });

  it('shades rather than blanks', () => {
    // Night hours should stay as readable as the rest; the wash says where the
    // day ends, it does not hide anything.
    const rule = /\.hourly-night \{([^}]*)\}/.exec(card);
    expect(rule, 'no night style').not.toBeNull();
    const alpha = /rgba\([^)]*,\s*([\d.]+)\)/.exec(rule![1]);
    expect(Number(alpha![1])).toBeLessThan(0.35);
  });
});
