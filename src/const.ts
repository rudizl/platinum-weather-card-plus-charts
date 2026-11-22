export const CARD_VERSION = '2.7.0-beta.14';

// What a slot shows when it is not chosen (README: Default slot values). The card and the editor both read this one list: each had its own
// once, and they drifted apart (#61), so the card drew the moon in r4 while the editor offered the field of the fire danger.
export const SLOT_DEFAULTS: Readonly<Record<string, string>> = Object.freeze({
  l1: 'forecast_max', l2: 'forecast_min', l3: 'wind', l4: 'pressure', l5: 'sun_next', l6: 'remove', l7: 'remove', l8: 'remove',
  r1: 'popforecast', r2: 'humidity', r3: 'uv_summary', r4: 'moon', r5: 'sun_following', r6: 'remove', r7: 'remove', r8: 'remove',
});
