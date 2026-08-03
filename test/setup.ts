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
