/**
 * Puts first argument to `text` and second argument to `tts`.
 */

const {text} = require('./text');
const {tts} = require('./tts');

const textTts = (textValue, ttsValue) => {
  return {
    ...text(textValue),
    ...tts(ttsValue),
  };
};

module.exports = {
  textTts,
};
