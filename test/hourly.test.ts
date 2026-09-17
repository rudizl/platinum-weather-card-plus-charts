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
    expect(fn).toContain('show_section_hourly_forecast === false');
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

describe('the chart', () => {
  const fn = /_renderHourlyForecastSection\(\)[\s\S]*?\n  \}\n/.exec(card)![0];

  it('needs at least two points to draw a line', () => {
    expect(fn).toMatch(/forecast\.length < 2/);
    expect(fn).toMatch(/points\.length < 2/);
  });

  it('gives a flat span room to breathe', () => {
    // A still night would otherwise draw a straight line through the middle
    // with no scale at all.
    expect(fn).toMatch(/hi - lo < 2/);
  });

  it('marks where now falls', () => {
    // Without it the chart does not say which end you are standing at.
    expect(fn).toContain('nowX');
    expect(fn).toContain('stroke-dasharray');
  });

  it('keeps the colours of the daily chart', () => {
    // Orange for temperature and blue for precipitation, so the two sections
    // read as one card rather than two.
    expect(fn).toContain('255,152,0');
    expect(fn).toContain('115,198,239');
  });

  it('always labels both ends', () => {
    // A short span would otherwise get one lonely label in the middle.
    expect(fn).toMatch(/i === 0 \|\| i === n - 1/);
  });

  it('draws nothing rather than an empty frame', () => {
    expect(fn).toMatch(/if \(!forecast \|\| forecast\.length < 2\) return html``;/);
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
    const fn = /_renderForecastTabs\(\)[\s\S]*?\n  \}/.exec(card)![0];
    expect(fn).toMatch(/if \(!this\._config\?\.entity_hourly\) return html``;/);
    expect(fn).toMatch(/if \(!this\.hourlyForecast\) return html``;/);
  });

  it('does not draw the daily chart under the hourly view', () => {
    // Two charts of different things, stacked, with no label saying which.
    expect(card).toMatch(/if \(!this\._showHourly\) sections\.push\(this\._renderChartSection\(\)\)/);
  });

  it('scrolls sideways rather than squeezing every hour in', () => {
    // Forty-eight hours across a phone is a line with no readable labels.
    const fn = /_renderHourlyForecastSection\(\)[\s\S]*?\n  \}\n/.exec(card)![0];
    expect(fn).toContain('MIN_HOUR_PX');
    expect(card).toMatch(/\.hourly-scroll \{[^}]*overflow-x: auto/);
  });

  it('contains the sideways scroll so it does not drag the dashboard', () => {
    expect(card).toMatch(/overscroll-behavior-x: contain/);
  });

  it('fills the card when there are few enough hours to fit', () => {
    const fn = /_renderHourlyForecastSection\(\)[\s\S]*?\n  \}\n/.exec(card)![0];
    expect(fn).toMatch(/min-width:100%/);
    expect(fn).toMatch(/Math\.max\(100/);
  });

  it('has its settings with the forecast it belongs to', () => {
    // Not a panel of its own behind a pencil in the section list — the hours
    // are a view of the forecast, so their entity and span live with it.
    expect(editor).toContain('_hourlyForecastOptions');
    expect(editor).toMatch(/_sectionDailyForecastEditor[\s\S]*?_hourlyForecastOptions\(\)/);
  });

  it('offers only weather entities for the source', () => {
    const panel = /_hourlyForecastOptions\(\)[\s\S]*?\n  \}/.exec(editor)![0];
    expect(panel).toMatch(/includeDomains=\$\{\['weather'\]\}/);
  });
});
