/**
 * Alice renderer module.
 */

const {reply} = require('./reply');
const {text, br} = require('./text');
const {tts, audio, effect, pause} = require('./tts');
const {buttons} = require('./buttons');

module.exports = {
  reply,
  text,
  tts,
  buttons,
  audio,
  effect,
  pause,
  br,
};
