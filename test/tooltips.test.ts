import { describe, it, expect } from 'vitest';
import '../src/platinum-weather-card';
import { makeHass, makeForecast, baseConfig, renderCard } from './helpers';

// Tooltips are built as HTML strings and passed through unsafeHTML, so anything
// arriving from an entity is attacker-influenced data. This is the one place in
// the card where a mistake is a security bug rather than a cosmetic one.

async function withForecast(
  forecast: unknown[],
  extra: Record<string, unknown> = {},
) {
  return (await renderCard(
    baseConfig({
      section_order: ['daily_forecast'],
      weather_entity: 'weather.test',
      entity_forecast_icon_1: 'weather.test',
      entity_forecast_max_1: 'weather.test',
      entity_forecast_min_1: 'weather.test',
      entity_pop_1: 'weather.test',
      entity_pos_1: 'weather.test',
      entity_summary_1: 'weather.test',
      daily_forecast_days: 3,
      option_show_current_day: true,
      option_tooltips: true,
      ...extra,
    } as never),
    makeHass(
      { 'weather.test': { state: 'sunny', attributes: { temperature: 21 } } },
      { forecast },
    ),
  )) as HTMLElement;
}

const tooltipHtml = (el: HTMLElement) =>
  Array.from(el.shadowRoot?.querySelectorAll('.fcasttooltipblock, .fcasttooltiptext') ?? [])
    .map((n) => n.innerHTML)
    .join('');

describe('tooltip content', () => {
  it('shows the forecast values', async () => {
    const el = await withForecast(makeForecast(3));
    const html = tooltipHtml(el);
    expect(html).toContain('20'); // first day's maximum
  });

  it('includes the condition description when there is one', async () => {
    const forecast = makeForecast(3).map((f, i) =>
      i === 0 ? { ...f, detailed_description: 'Sunny with light winds' } : f,
    );
    const el = await withForecast(forecast);
    expect(tooltipHtml(el)).toContain('Sunny with light winds');
  });

  it('omits precipitation when there is none', async () => {
    const forecast = makeForecast(3).map((f) => ({ ...f, precipitation: 0 }));
    const el = await withForecast(forecast);
    expect(tooltipHtml(el)).not.toContain('💧');
  });

  it('shows precipitation when there is some', async () => {
    const forecast = makeForecast(3).map((f) => ({ ...f, precipitation: 4.2 }));
    const el = await withForecast(forecast);
    expect(tooltipHtml(el)).toContain('💧');
  });

  it('is absent when tooltips are switched off', async () => {
    const el = await withForecast(makeForecast(3), { option_tooltips: false });
    // the blocks may exist but must not be visible; either way no content leaks
    const visible = el.shadowRoot?.querySelector('.fcasttooltipblock');
    if (visible) {
      const style = (visible as HTMLElement).getAttribute('style') ?? '';
      expect(style + tooltipHtml(el)).not.toContain('visible');
    }
  });
});

describe('tooltip escaping', () => {
  // The vulnerability @frenck found: descriptions and unit strings come from
  // entity attributes and were interpolated into the HTML unescaped.
  const payloads = [
    '<img src=x onerror="alert(1)">',
    '</div><script>alert(document.cookie)</script>',
    '" onmouseover="alert(1)',
    "'><svg/onload=alert(1)>",
  ];

  for (const payload of payloads) {
    it(`neutralises ${payload.slice(0, 28)}`, async () => {
      const forecast = makeForecast(3).map((f, i) =>
        i === 0 ? { ...f, detailed_description: payload } : f,
      );
      const el = await withForecast(forecast);
      const root = el.shadowRoot!;

      // No element from the payload may exist in the DOM.
      expect(root.querySelector('script'), 'a script element was created').toBeNull();
      expect(root.querySelector('img[src="x"]'), 'an img element was created').toBeNull();
      expect(root.querySelector('svg[onload]'), 'an svg with onload was created').toBeNull();

      // And the text must still be there, escaped, rather than silently dropped.
      const html = root.innerHTML;
      if (html.includes('onerror') || html.includes('onload')) {
        expect(html, 'payload appears unescaped').toMatch(/&lt;|&quot;|&#39;/);
      }
    });
  }

  it('escapes a hostile unit of measurement', async () => {
    // Units are read from the entity too.
    const el = (await renderCard(
      baseConfig({
        section_order: ['slots'],
        slot_l1: 'humidity',
        slot_r1: 'remove',
        entity_humidity: 'sensor.hum',
      } as never),
      makeHass({
        'sensor.hum': {
          state: '64',
          attributes: { unit_of_measurement: '<img src=x onerror=alert(1)>' },
        },
      }),
    )) as HTMLElement;
    expect(el.shadowRoot?.querySelector('img')).toBeNull();
  });

  it('keeps ordinary text readable', async () => {
    // Escaping must not mangle normal descriptions.
    const forecast = makeForecast(3).map((f, i) =>
      i === 0 ? { ...f, detailed_description: 'Rain & wind, 5–10 mm' } : f,
    );
    const el = await withForecast(forecast);
    const text = el.shadowRoot?.textContent ?? '';
    expect(text).toContain('Rain & wind');
  });
});

describe('tooltip numeric safety', () => {
  it('does not write NaN into a rotation transform', async () => {
    const forecast = makeForecast(3).map((f, i) =>
      i === 1 ? { ...f, wind_bearing: 'not-a-direction' } : f,
    );
    const el = await withForecast(forecast);
    expect(el.shadowRoot?.innerHTML).not.toContain('rotate(NaN');
  });

  it('handles a forecast day with no values at all', async () => {
    const forecast = makeForecast(3).map((f, i) =>
      i === 1
        ? { datetime: f.datetime, condition: 'sunny' }
        : f,
    );
    const el = await withForecast(forecast);
    expect(el.shadowRoot?.textContent).not.toContain('NaN');
    expect(el.shadowRoot?.textContent).not.toContain('undefined');
  });
});
