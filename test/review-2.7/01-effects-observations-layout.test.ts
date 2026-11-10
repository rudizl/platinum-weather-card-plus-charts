// Находка 1: ефектите при overview_layout: observations.
import { describe, it, expect, afterEach } from 'vitest';
import { Any, clean, makeHass, baseConfig, renderCard } from './_util';
clean();

const states = { 'sensor.c': { state: 'cloudy' }, 'sensor.t': { state: '5', attributes: { unit_of_measurement: '°C' } }, 'sensor.w': { state: '60', attributes: { unit_of_measurement: 'km/h' } } };
const mount = async () => (await renderCard(baseConfig({ overview_layout: 'observations', option_effects: 'full', entity_forecast_icon: 'sensor.c',
  entity_temperature: 'sensor.t', entity_wind_speed: 'sensor.w', text_card_title: 'Title' } as never), makeHass(states))) as Any;

// the animations of an element, as a browser gives them: one each, at the pace it was made with
const animations = new WeakMap<Element, { playbackRate: number; animationName: string }[]>();
afterEach(() => { delete (HTMLElement.prototype as Any).getAnimations; });

describe('1. the effects in the observations layout', () => {
  it('one layer behind the overview, as in the other layouts, not two', async () => {
    const el = await mount();
    expect(el.shadowRoot.querySelectorAll('.fx').length).toBe(1);
  });

  it('the title block stays position: absolute (.stacked), with the effects as without', async () => {
    const el = await mount();
    el._cardWidth = 400; el.requestUpdate(); await el.updateComplete; // jsdom measures a width of 0; from 344 px the title block is stacked
    const title = el.shadowRoot.querySelector('.overview-section.stacked') as HTMLElement;
    expect(title, 'the stacked title block').not.toBeNull();
    // The two rules that decide its position, taken from the stylesheet of the card in the order they stand there. jsdom drops part of the
    // whole sheet (color-mix, masks), so the two rules are given to it alone: same specificity, the later one wins, as in a browser.
    const css = el.shadowRoot.querySelector('style').textContent as string;
    const stacked = /\.stacked\s*\{[^}]*\}/.exec(css)!;
    const host = /\.fx-host\s*\{[^}]*\}/.exec(css)!;
    const st = document.createElement('style');
    st.textContent = stacked.index < host.index ? `${stacked[0]}\n${host[0]}` : `${host[0]}\n${stacked[0]}`;
    document.head.appendChild(st);
    const copy = document.createElement('div'); copy.className = title.className; document.body.appendChild(copy);
    const position = getComputedStyle(copy).position;
    st.remove(); copy.remove();
    expect(position).toBe('absolute');
  });

  it('every cloud of the card runs at the pace of the wind, not only those of the first layer', async () => {
    (HTMLElement.prototype as Any).getAnimations = function (this: Element) {
      if (!animations.has(this)) animations.set(this, [{ playbackRate: 1, animationName: 'fx-drift' }]);
      return animations.get(this);
    };
    const el = await mount();
    el.hass = makeHass(states); await el.updateComplete;
    const rates = [...el.shadowRoot.querySelectorAll('.fx-cloud')].map((c: Element) => animations.get(c)?.[0].playbackRate ?? 1);
    expect(rates.length).toBeGreaterThan(0);
    // 60 km/h is force 7: the clouds cross in 73 s, a rate of 100/73
    for (const r of rates) expect(r).toBeCloseTo(100 / el._fxPlan.driftSeconds, 5);
  });
});
