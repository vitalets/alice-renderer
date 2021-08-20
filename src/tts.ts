/**
 * Working with voice part.
 */

import {stringify} from './utils';
import {select} from './select';
import {Response} from "./reply";

export const tts = (value: string | string[]): Pick<Response, 'tts'> => {
  value = Array.isArray(value) ? select(value) : value;
  return {
    tts: stringify(value)
  };
};
export const audio = (name: string): ReturnType<typeof tts> => tts(`<speaker audio="alice-${name}.opus">`);
export const effect = (name: string): ReturnType<typeof tts> => tts(`<speaker effect="${name}">`);
export const pause = (ms = 500): ReturnType<typeof tts> => tts(`sil <[${ms}]>`);



