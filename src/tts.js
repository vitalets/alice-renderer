/**
 * Working with voice part.
 */

const {stringify, removeExtraSpaces} = require('./utils');
const {pick} = require('./userify');

const tts = value => {
  value = Array.isArray(value) ? pick(value) : value;
  return {tts: stringify(value)};
};
const audio = name => tts(`<speaker audio="alice-${name}.opus">`);
const effect = name => tts(`<speaker effect="${name}">`);
const pause = (ms = 500) => tts('- '.repeat(Math.ceil(ms / 75)));
const processTts = str => removeExtraSpaces(str);

module.exports = {
  tts,
  audio,
  effect,
  pause,
  processTts,
};
