// The built-in icon packs, loaded one module each (#41). The pictures of a pack are one file beside the card,
// dist/icons-<pack>.js, made by scripts/build-icons.mjs: an object from the name the card has always used for a
// picture (a-clear-day.svg, s-rainy-3.svg, p-rain.webp) to the picture as a data URI. A card loads only the pack it
// shows, once for the page; until it has, the icon is a transparent pixel, and the card is drawn again when it comes.

export type PackName = 'animated' | 'static' | 'photoreal';

// a transparent pixel, for the moment before a pack has come
export const BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

const loaded: Partial<Record<PackName, Record<string, string>>> = {};
const pending: Partial<Record<PackName, Promise<void>>> = {};

// The module is asked for with the version in its address: Home Assistant serves the files beside a card with a cache of
// 31 days, so a pack that changes under the same name would not reach a phone that has the old one.
let loader: (url: string) => Promise<{ default?: Record<string, string> }> = (url) => import(/* @vite-ignore */ url);

export function packOf(file: string): PackName | null {
  if (file.startsWith('a-')) return 'animated';
  if (file.startsWith('s-')) return 'static';
  if (file.startsWith('p-')) return 'photoreal';
  return null;
}

export function packUrl(base: string, pack: PackName, version: string): string {
  return `${base}icons-${pack}.js?v=${encodeURIComponent(version)}`;
}

// The picture for a file of a built-in pack, or null for a file that is not of one. Before its pack has come: the
// transparent pixel, and the pack is asked for; when it comes, onLoad is called so that the card can be drawn again.
// A pack that fails to load is asked for again the next time the card is drawn.
export function iconData(base: string, file: string, version: string, onLoad: () => void): string | null {
  const pack = packOf(file);
  if (!pack) return null;
  const pictures = loaded[pack];
  if (pictures) return pictures[file] ?? BLANK;
  let wait = pending[pack];
  if (!wait) {
    wait = loader(packUrl(base, pack, version))
      .then((m) => { loaded[pack] = m.default ?? {}; })
      .catch((e) => { delete pending[pack]; throw e; });
    pending[pack] = wait;
  }
  wait.then(onLoad, () => undefined);
  return BLANK;
}

// for the tests: a loader of their own, and a clean slate
export function _setLoader(fn: typeof loader): void { loader = fn; }
export function _forgetPacks(): void {
  for (const k of Object.keys(loaded)) delete loaded[k as PackName];
  for (const k of Object.keys(pending)) delete pending[k as PackName];
}
