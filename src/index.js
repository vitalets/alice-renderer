/**
 * Alice renderer module.
 */

const {reply} = require('./reply');
const {text, br} = require('./text');
const {tts, audio, effect, pause} = require('./tts');
const {textTts} = require('./text-tts');
const {buttons} = require('./buttons');
const {plural} = require('./plural');
const {userify} = require('./userify');
const {onceInRange, rand} = require('./onceInRange');
const {configure} = require('./configure');
const {image} = require('./image');

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
  plural,
  userify,
  onceInRange,
  rand,
  configure,
  image,
};
