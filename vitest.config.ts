import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    dedupe: ['lit', 'lit-html', 'lit-element', '@lit/reactive-element'],
    alias: {
      // The card imports 'lit/decorators', which Rollup resolves but Vite does
      // not — lit's exports map only lists the .js specifier. Aliasing here keeps
      // the production imports untouched.
      // see the shim for why this is needed
      'ts-transformer-keys': new URL('./test/ts-transformer-keys-shim.ts', import.meta.url).pathname,
      'lit/decorators': 'lit/decorators.js',
      'lit/directives/if-defined': 'lit/directives/if-defined.js',
      'lit/directives/unsafe-html': 'lit/directives/unsafe-html.js',
    },
  },
  // Lit must be a single instance: if the card's html`` templates come from a
  // different copy of lit than the LitElement rendering them, the result is
  // rendered as literal text instead of DOM.
  test: {
    include: ['test/**/*.test.ts'],
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
  },
});
