/**
 * Reply implementation.
 */

const {isObject, isString, randomElement, stringify} = require('./shared');
const {processText} = require('./text');
const {processTts} = require('./tts');

const reply = (parts, ...params) => {
  const result = parts.reduce((res, part, index) => {
    const partReply = textAndTts(part);
    const param = params[index];
    const paramReply = Array.isArray(param) ? arrayToReply(param) : valueToReply(param);
    return merge(res, partReply, paramReply);
  }, {text: '', tts: ''});

  result.text = processText(result.text);
  result.tts = processTts(result.tts);
  result.end_session = false;

  return result;
};

reply.end = (...args) => Object.assign(reply(...args), {end_session: true});

const arrayToReply = arr => valueToReply(randomElement(arr));
const valueToReply = value => isObject(value) ? value : textAndTts(value);

/**
 * Merges reply objects by concatenating `text`, `tts` and `buttons` props.
 * @param {Array<{text, tts, buttons}>} replies
 */
const merge = (...replies) => {
  return replies.filter(Boolean).reduce((res, rep) => {
    mergeStringProp(res, rep, 'text');
    mergeStringProp(res, rep, 'tts');
    mergeArrayProp(res, rep, 'buttons');
    return res;
  }, {});
};

const mergeStringProp = (to, from, prop) => isString(from[prop])
  ? to[prop] = `${to[prop] || ''}${from[prop]}`
  : null;

const mergeArrayProp = (to, from, prop) => Array.isArray(from[prop])
  ? to[prop] = (Array.isArray(to[prop]) || []).concat(from[prop])
  : null;

const textAndTts = value => {
  const str = stringify(value);
  return {text: str, tts: str};
};

module.exports = {
  reply,
};
