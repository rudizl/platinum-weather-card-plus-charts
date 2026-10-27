import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

// Seen on the card with the photoreal pack: the sun in the big icon was an oval. The box of the big icon is 140 by 120 pixels and the
// picture in it is told to be 100% by 100%. An SVG fits itself into that box and keeps its proportions; a PNG is stretched to it. The
// same is true of every picture of a custom pack that is not an SVG.

const card = readFileSync(join(__dirname, '..', 'src', 'platinum-weather-card.ts'), 'utf8');

describe('the big icon keeps the proportions of its picture', () => {
  const rule = (sel: string) => new RegExp(`${sel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{([^}]*)\\}`).exec(card)?.[1] ?? '';
  it('a picture in the box fits in it and is not stretched to it', () => {
    expect(rule('.big-icon img'), 'no rule for the picture of the big icon').toMatch(/object-fit:\s*contain/);
  });
  it('and sits in the middle of the box, as an SVG does', () => {
    expect(rule('.big-icon img')).toMatch(/object-position:\s*center/);
  });
  it('the box is the one it was, so that nothing around it moves', () => {
    const box = rule('.big-icon');
    expect(box).toMatch(/height:\s*120px/);
    expect(box).toMatch(/width:\s*140px/);
  });
  it('both places that draw the big icon draw the same picture element', () => {
    const uses = card.match(/<div class="big-icon"><img src="\$\{url\.href\}" width="100%" height="100%"/g) ?? [];
    expect(uses).toHaveLength(2);
  });
});
