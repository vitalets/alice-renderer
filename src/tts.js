/**
 * Working with voice part.
 */

const {stringify} = require('./utils');
const {select} = require('./select');

const tts = value => {
  value = Array.isArray(value) ? select(value) : value;
  return {
    tts: stringify(value)
  };
};
const audio = name => tts(`<speaker audio="alice-${name}.opus">`);
const effect = name => tts(`<speaker effect="${name}">`);
const pause = (ms = 500) => tts(`sil <[${ms}]>`);

module.exports = {
  tts,
  audio,
  effect,
  pause,
};
