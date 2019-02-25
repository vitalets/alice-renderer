/**
 * Alice renderer module.
 */

const {reply} = require('./reply');
const {text, br} = require('./text');
const {tts, audio, effect, pause} = require('./tts');
const {textTts} = require('./text-tts');
const {buttons} = require('./buttons');

module.exports = {
  reply,
  text,
  tts,
  textTts,
  buttons,
  audio,
  effect,
  pause,
  br,
};
