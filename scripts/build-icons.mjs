// The built-in icon packs, one module each beside the card (#41). A release carried 136 files, one picture each, because the
// Marketplace installs a card from the files of its release one by one; now each pack is one file, and a card loads only the
// pack it shows. The pictures are kept in icons/ and written here into dist/icons-<pack>.js as data URIs, keyed by the
// name the card has always used for the file.
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const TYPES = { '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png' };
export const PACKS = ['animated', 'static', 'photoreal'];

// the pictures of a pack: file name to data URI, in the order of the names
export function buildPack(pack, root = ROOT) {
  const dir = join(root, 'icons', pack);
  const out = {};
  for (const file of readdirSync(dir).sort()) {
    const ext = file.slice(file.lastIndexOf('.'));
    const type = TYPES[ext];
    if (!type) continue;
    const bytes = readFileSync(join(dir, file));
    // An SVG goes in as text, escaped as a URI component (# would end it, a quote would end the attribute or the CSS around it), with
    // a few characters that are safe inside a quoted url() given back: as text it compresses to less than half of base64. A WebP is binary, and base64.
    out[file] = type === 'image/svg+xml'
      ? `data:${type};charset=utf-8,${encodeURIComponent(bytes.toString('utf8')).replace(/%20/g, ' ').replace(/%3D/g, '=').replace(/%3A/g, ':').replace(/%2F/g, '/').replace(/%3B/g, ';').replace(/%2C/g, ',')}`
      : `data:${type};base64,${bytes.toString('base64')}`;
  }
  return out;
}

export function packSource(pack, root = ROOT) {
  return `// ${pack} icons of Platinum Weather Card Plus Charts, made by scripts/build-icons.mjs from icons/${pack}/\nexport default ${JSON.stringify(buildPack(pack, root))};\n`;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  mkdirSync(join(ROOT, 'dist'), { recursive: true });
  for (const pack of PACKS) {
    const src = packSource(pack);
    writeFileSync(join(ROOT, 'dist', `icons-${pack}.js`), src);
    console.log(`dist/icons-${pack}.js: ${Object.keys(buildPack(pack)).length} pictures, ${Math.round(src.length / 1024)} KB`);
  }
}
