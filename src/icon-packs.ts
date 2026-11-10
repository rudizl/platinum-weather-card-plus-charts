// The built-in icon packs, loaded one module each (#41). The pictures of a pack are one file beside the card,
// dist/icons-<pack>.js, made by scripts/build-icons.mjs: an object from the name the card has always used for a
// picture (a-clear-day.svg, s-rainy-3.svg, p-rain.webp) to the picture as a data URI. A card loads only the pack it
// shows, once for the page; until it has, the icon is a transparent pixel, and the card is drawn again when it comes.

export type PackName = 'animated' | 'static' | 'photoreal';

// a transparent pixel, for the moment before a pack has come
export const BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

const loaded: Partial<Record<PackName, Record<string, string>>> = {};
const pending: Partial<Record<PackName, Promise<void>>> = {};
// A pack that failed is asked for again after a pause, not at every redraw of the card (found in the review of 2.7, finding 5); each new try
// has an address of its own, since a browser keeps a module that failed to load under its address and would fail it again without asking.
export const RETRY_MS = 30_000;
const failedAt: Partial<Record<PackName, number>> = {};
const tries: Partial<Record<PackName, number>> = {};
const warned = new Set<PackName>();

// The module is asked for with the version in its address: Home Assistant serves the files beside a card with a cache of
// 31 days, so a pack that changes under the same name would not reach a phone that has the old one.
let loader: (url: string) => Promise<{ default?: Record<string, string> }> = (url) => import(/* @vite-ignore */ url);

export function packOf(file: string): PackName | null {
  if (file.startsWith('a-')) return 'animated';
  if (file.startsWith('s-')) return 'static';
  if (file.startsWith('p-')) return 'photoreal';
  return null;
}

export function packUrl(base: string, pack: PackName, version: string, attempt = 0): string {
  return `${base}icons-${pack}.js?v=${encodeURIComponent(version)}${attempt > 0 ? `&try=${attempt}` : ''}`;
}

// the packs that failed to load and are waiting for their next try: the card says so rather than draw invisible icons
export function failedPacks(): PackName[] {
  return (Object.keys(failedAt) as PackName[]).filter((p) => !loaded[p]);
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
  const failed = failedAt[pack];
  if (!wait && failed !== undefined && Date.now() - failed < RETRY_MS) return BLANK;
  if (!wait) {
    const attempt = tries[pack] ?? 0;
    tries[pack] = attempt + 1;
    wait = loader(packUrl(base, pack, version, attempt))
      .then((m) => {
        // a module without its pictures is a failure too, not a pack of no pictures kept until the page is reloaded
        if (!m || typeof m.default !== 'object' || m.default === null) throw new Error(`icons-${pack}.js has no pictures`);
        loaded[pack] = m.default;
        delete failedAt[pack];
      })
      .catch((e) => {
        delete pending[pack];
        failedAt[pack] = Date.now();
        if (!warned.has(pack)) {
          warned.add(pack);
          // eslint-disable-next-line no-console
          console.warn(`platinum-weather-card: icons-${pack}.js did not load; trying again in ${RETRY_MS / 1000} s`, e);
        }
        throw e;
      });
    pending[pack] = wait;
  }
  // drawn again either way: with the pictures, or with the row that says they did not come
  wait.then(onLoad, () => onLoad());
  return BLANK;
}

// for the tests: a loader of their own, and a clean slate
export function _setLoader(fn: typeof loader): void { loader = fn; }
export function _forgetPacks(): void {
  for (const k of Object.keys(failedAt)) delete failedAt[k as PackName];
  for (const k of Object.keys(tries)) delete tries[k as PackName];
  warned.clear();
  for (const k of Object.keys(loaded)) delete loaded[k as PackName];
  for (const k of Object.keys(pending)) delete pending[k as PackName];
}
