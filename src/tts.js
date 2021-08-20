/**
 * Working with voice part.
 */

import {stringify} from './utils.js';
import {select} from './select';

export const tts = (value) => {
  value = Array.isArray(value) ? select(value) : value;
  return {
    tts: stringify(value),
  };
};
export const audio = (name) => tts(`<speaker audio="alice-${name}.opus">`);
export const effect = (name) => tts(`<speaker effect="${name}">`);
export const pause = (ms = 500) => tts(`sil <[${ms}]>`);
