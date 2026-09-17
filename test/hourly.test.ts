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

describe('the section is wired in like any other', () => {
  it('is dispatched from section_order', () => {
    expect(card).toMatch(/case 'hourly_forecast':/);
  });

  it('has a row in the editor with the usual controls', () => {
    const row = /case 'hourly_forecast':[\s\S]*?`;/.exec(editor)![0];
    for (const control of ['pwc-switch', 'down-icon', 'up-icon', 'edit-icon']) {
      expect(row, `the row is missing ${control}`).toContain(control);
    }
  });

  it('has a settings panel behind the pencil', () => {
    expect(editor).toContain('_sectionHourlyForecastEditor');
    expect(editor).toMatch(/case 'section_hourly_forecast':/);
  });

  it('offers only weather entities for the source', () => {
    const panel = /_sectionHourlyForecastEditor\(\)[\s\S]*?\n  \}/.exec(editor)![0];
    expect(panel).toMatch(/includeDomains=\$\{\['weather'\]\}/);
  });
});

describe('the section list agrees with itself', () => {
  // Adding a section means touching four places. setConfig rejects anything not
  // on its allow-list, so forgetting that one turns the whole card into a
  // config error the moment the section is used — which is what happened.
  it('accepts every section the card can render', () => {
    const allowed = /const validSections = \[([^\]]+)\]/.exec(card);
    expect(allowed, 'no validSections list').not.toBeNull();
    const names = Array.from(allowed![1].matchAll(/'(\w+)'/g)).map((m) => m[1]);
    const rendered = Array.from(card.matchAll(/^\s+case '(\w+)':\n\s+sections\.push/gm))
      .map((m) => m[1]);
    expect(rendered.length).toBeGreaterThan(4);
    for (const section of rendered) {
      expect(names, `'${section}' renders but setConfig rejects it`).toContain(section);
    }
  });

  it('offers every allowed section in the editor', () => {
    const allowed = /const validSections = \[([^\]]+)\]/.exec(card)![1];
    const names = Array.from(allowed.matchAll(/'(\w+)'/g)).map((m) => m[1]);
    for (const section of names) {
      // 'charts' has no row of its own — it is drawn with the daily forecast
      if (section === 'charts') continue;
      expect(editor, `'${section}' has no row in the editor`)
        .toContain(`case '${section}':`);
    }
  });
});
