import { describe, it, expect } from 'vitest';
import '../src/editor';

// The rows of the first screen had no air of their own: a row whose hint ran to two lines was as tall as its text, and its title met the
// hint of the row above („Разширена“, „Слотове“, „Дневна прогноза“ in Bulgarian). The text of a row has 4 px above and below now; a row
// of one line is as tall as its buttons and keeps its height, and only a row whose text is taller grows.

describe('the rows of the first screen of the editor', () => {
  it('have room above and below their text', () => {
    const Editor = customElements.get('platinum-weather-card-plus-charts-editor') as unknown as { styles: { cssText: string } | { cssText: string }[] };
    const text = [Editor.styles].flat().map((s) => s.cssText).join('\n');
    const rule = (sel: string) => new RegExp(`\\${sel}\\s*\\{([^}]*)\\}`).exec(text)?.[1] ?? '';
    expect(rule('.title-stack'), 'the text of a row').toMatch(/padding:\s*4px 0/);
    // the row itself has no padding, so a row of one line does not grow
    expect(rule('.section-row')).toMatch(/min-height:\s*48px/);
    expect(rule('.section-row')).not.toMatch(/padding/);
  });
});
