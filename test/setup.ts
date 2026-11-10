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

// The icon packs are files beside the card, which the tests do not have: a loader that gives an empty pack, so that a card is not told its
// icons did not load (since the review of 2.7, finding 5, it says so). The tests of the loading give a loader of their own.
import { _setLoader } from '../src/icon-packs';
_setLoader(async () => ({ default: {} }));
