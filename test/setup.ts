// jsdom does not implement ResizeObserver, which the card uses to react to
// width changes. A no-op is enough: the tests assert on rendered content, not
// on responsive behaviour.
class ResizeObserverStub {
  observe(): void {
    /* no-op */
  }
  unobserve(): void {
    /* no-op */
  }
  disconnect(): void {
    /* no-op */
  }
}

(globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver = ResizeObserverStub;

// Home Assistant exposes loadCardHelpers on window; the editor calls it to get
// the helpers for rendering nested cards. Nothing under test needs the real
// ones, but the call must not throw.
(globalThis as unknown as { loadCardHelpers: unknown }).loadCardHelpers = async () => ({
  createCardElement: () => document.createElement('div'),
  createRowElement: () => document.createElement('div'),
  createHuiElement: () => document.createElement('div'),
});
