import { describe, it, expect } from 'vitest';
import { render } from 'lit';
import '../src/platinum-weather-card';
import '../src/editor';
import { makeHass, baseConfig, renderCard, choice } from './helpers';
import { TRANSLATIONS } from '../src/translations';

// The wcc-2 pack was the amCharts icons as Weather Chart Card ships them in its own folder: the same drawings as the default pack, with about
// sixteen pictures instead of fifty-four, no levels of cloud or rain, no static set, and the card needed Weather Chart Card installed for it.
// It went in 2.7 (Руди: "remove it entirely"). A configuration that still names it is drawn with the default pack, so that nothing breaks.

const hass = () => makeHass({ 'weather.home': { state: 'partlycloudy' }, 'sun.sun': { state: 'above_horizon', attributes: { elevation: 30 } } });
const big = async (extra: Record<string, unknown>) => {
  const el = (await renderCard(baseConfig({ weather_entity: 'weather.home', entity_sun: 'sun.sun', section_order: ['overview'], ...extra } as never), hass())) as HTMLElement;
  return el.shadowRoot!.querySelector('.big-icon img')!.getAttribute('data-icon') ?? '';
};

describe('a configuration that still says wcc-2', () => {
  it('is drawn with the default pack, from the card itself, not from the folder of Weather Chart Card', async () => {
    const icon = await big({ icon_pack: 'wcc-2' });
    expect(icon).toMatch(/\/a-cloudy-2-day\.svg$/);
    expect(icon).not.toContain('weather-chart-card');
    expect(icon).toBe(await big({ icon_pack: 'default' }));
  });
  it('and its static icons too, as the default pack has them', async () => {
    expect(await big({ icon_pack: 'wcc-2', option_static_icons: true })).toMatch(/\/s-cloudy-2-day\.svg$/);
  });
  it('the editor offers no such pack, and shows the default one as chosen, with the static icons that go with it', async () => {
    type Editor = HTMLElement & { setConfig: (c: unknown) => void; hass: unknown; updateComplete: Promise<unknown>; _topicAppearance: () => unknown };
    const el = document.createElement('platinum-weather-card-plus-charts-editor') as Editor;
    el.setConfig({ card_config_version: 8, weather_entity: 'weather.home', icon_pack: 'wcc-2' });
    el.hass = hass(); document.body.appendChild(el); await el.updateComplete;
    const box = document.createElement('div'); render(el._topicAppearance() as never, box, { host: el });
    const c = choice(box, 'icon_pack')!;
    expect(c.values).not.toContain('wcc-2');
    expect(c.value).toBe('default');
    const row = [...box.querySelectorAll('.toggle-row')].find((r) => (r.querySelector('.pwc-switch') as unknown as { value?: string } | null)?.value === 'option_static_icons')!;
    expect(row.classList.contains('disabled')).toBe(false);
  });
  it('and no language keeps the names of the packs of the old list', () => {
    for (const [lang, t] of Object.entries(TRANSLATIONS)) {
      const keys = Object.keys((t as { editor: Record<string, string> }).editor).filter((k) => k.startsWith('icon_pack_'));
      expect(keys, lang).toEqual([]);
    }
  });
});
