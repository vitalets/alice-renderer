/**
 * br:
 * - newlines in text
 * - space in tts
 */
const {textTts} = require('./text-tts');

const br = (n = 1) => textTts('\n'.repeat(n), ' ');

module.exports = {
  br,
};
