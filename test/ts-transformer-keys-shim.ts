// ts-transformer-keys rewrites keys<T>() into a literal array at compile time,
// which Rollup does through its TypeScript plugin but Vite does not. Under
// Vitest the untransformed call reaches the runtime and throws.
//
// The editor uses it to drop configuration keys the card no longer knows about,
// so the shim has to return a real list: it reads the interface out of types.ts.
import { readFileSync } from 'fs';
import { join } from 'path';

let cached: string[] | null = null;

function configKeys(): string[] {
  if (cached) return cached;
  const source = readFileSync(join(__dirname, '..', 'src', 'types.ts'), 'utf8');
  const body = source.match(/export interface WeatherCardConfig[^{]*\{([\s\S]*?)\n\}/)?.[1] ?? '';
  cached = Array.from(body.matchAll(/^\s+(\w+)\??:/gm)).map((m) => m[1]);
  return cached;
}

export function keys<T = unknown>(): string[] {
  void (undefined as T | undefined);
  return configKeys();
}
