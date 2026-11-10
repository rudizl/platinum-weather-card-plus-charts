import '../../src/platinum-weather-card';
import { beforeEach } from 'vitest';
import { forgetSharedState } from '../helpers';
import { _setLoader, _forgetPacks } from '../../src/icon-packs';
export { makeHass, baseConfig, renderCard, makeForecast, allText } from '../helpers';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Any = any;
// a clean slate, and packs that load at once and are empty, unless a probe gives a loader of its own
export function clean(): void {
  beforeEach(() => { forgetSharedState(); _forgetPacks(); _setLoader(async () => ({ default: {} })); });
}
export const plan = (el: Any) => el._fxPlan;
