/**
 * Exports for ESM
 * See: https://nodejs.org/api/esm.html#esm_approach_1_use_an_es_module_wrapper
 */

import renderer from './index.js';
export default renderer;
export const reply = renderer.reply;
export const text = renderer.text;
export const tts = renderer.tts;
export const textTts = renderer.textTts;
export const buttons = renderer.buttons;
export const audio = renderer.audio;
export const effect = renderer.effect;
export const pause = renderer.pause;
export const br = renderer.br;
export const plural = renderer.plural;
export const userify = renderer.userify;
export const rand = renderer.rand;
export const onceInRange = renderer.onceInRange;
export const configure = renderer.configure;
export const image = renderer.image;
