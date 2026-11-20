// White or black text on a coloured background, whichever stands out more (WCAG 2 contrast). Used for the button of „New in 2.7“, whose
// background is the theme's --primary-color: the default light blue wants black, a dark primary colour wants white.

function channels(colour: string): [number, number, number] | null {
  const c = colour.trim().toLowerCase();
  let m = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/.exec(c);
  if (m) return [m[1], m[2], m[3]].map((h) => parseInt(h + h, 16)) as [number, number, number];
  m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})(?:[0-9a-f]{2})?$/.exec(c);
  if (m) return [m[1], m[2], m[3]].map((h) => parseInt(h, 16)) as [number, number, number];
  m = /^rgba?\(\s*(\d+(?:\.\d+)?)[\s,]+(\d+(?:\.\d+)?)[\s,]+(\d+(?:\.\d+)?)/.exec(c);
  if (m) return [Number(m[1]), Number(m[2]), Number(m[3])];
  return null;
}

function luminance([r, g, b]: [number, number, number]): number {
  const lin = (v: number) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function contrastRatio(a: string, b: string): number {
  const ca = channels(a), cb = channels(b);
  if (!ca || !cb) return 1;
  const [hi, lo] = [luminance(ca), luminance(cb)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// '#000000' or '#ffffff'; null for a colour it cannot read (a var(), a name), and then the theme decides.
export function readableOn(background: string): '#000000' | '#ffffff' | null {
  if (!channels(background)) return null;
  return contrastRatio('#000000', background) >= contrastRatio('#ffffff', background) ? '#000000' : '#ffffff';
}
