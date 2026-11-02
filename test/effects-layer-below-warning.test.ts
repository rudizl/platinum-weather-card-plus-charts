import { describe, it, expect } from 'vitest';
import '../src/platinum-weather-card';
import { EFFECTS_CSS } from '../src/effects';
import { makeHass, baseConfig, renderCard } from './helpers';

// The sky of the effects lies behind the overview, and reaches up 14 px past it (and 28 px to each side) to the edges of the card, which clips it,
// so that it does not stop in a box at the top of the section. That is right when the overview is the first section. With a warning above it, the
// layer went over the bottom of the warning's bar (a bar of 34 px was cut 10 px from its bottom, a flat edge under a rounded top): the host of the
// layer is not the first of the sections then, and the layer must not reach up; it fades in at the top instead of starting at an edge.

async function card(withWarning: boolean) {
  const hass = makeHass({
    'weather.w': { state: 'cloudy', attributes: { temperature: 13 } },
    'binary_sensor.alarm': { state: withWarning ? 'on' : 'off', attributes: { awareness_level: '3; orange; Moderate', awareness_type: '10; Rain', expires: '2026-11-04T00:00:00+02:00' } },
  });
  return (await renderCard(baseConfig({ weather_entity: 'weather.w', entity_warning: 'binary_sensor.alarm', option_effects: 'full', option_effects_area: 'overview',
    section_order: ['warnings', 'overview'] } as never), hass)) as HTMLElement;
}

describe('the sky of the effects and a warning above the overview', () => {
  it('with a warning the host of the layer is not the first section, and without one it is', async () => {
    const withIt = await card(true);
    const host = withIt.shadowRoot!.querySelector('.fx-host') as HTMLElement;
    expect(host, 'the overview is the host of the layer').not.toBeNull();
    expect(host.parentElement!.firstElementChild === host).toBe(false);
    expect(host.previousElementSibling!.classList.contains('warning-row')).toBe(true);
    const without = await card(false);
    const host2 = without.shadowRoot!.querySelector('.fx-host') as HTMLElement;
    expect(host2.parentElement!.firstElementChild === host2).toBe(true);
  });

  const css = EFFECTS_CSS.replace(/\s+/g, ' ');
  const rule = (css.match(/\.fx-host:not\(:first-child\) > \.fx-overview \{([^}]*)\}/) ?? [])[1] ?? '';

  it('the layer does not reach up over what is above its host, and fades in at the top', () => {
    expect(rule, 'a rule for a host that is not the first section').not.toBe('');
    expect(rule).toMatch(/inset-block-start:\s*0/);
    // a soft top edge: transparent at the top, then solid, then the same fade out at the bottom as the layer has
    expect(rule).toMatch(/mask-image:\s*linear-gradient\(to bottom,\s*transparent 0,\s*#000 16px,\s*#000 55%,\s*transparent 100%\)/);
    expect(rule).toMatch(/-webkit-mask-image:\s*linear-gradient\(to bottom,\s*transparent 0,\s*#000 16px,\s*#000 55%,\s*transparent 100%\)/);
  });

  it('the first section keeps the reach: the layer still goes 14 px up and 28 px to the sides', () => {
    expect(css).toMatch(/\.fx-overview \{ inset: -14px -28px 0 -28px;/);
  });
});
