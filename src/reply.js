/**
 * Reply implementation.
 */

const {isObject, isString, stringify} = require('./utils');
const {pick} = require('./userify');
const {processText} = require('./text');
const {processTts} = require('./tts');

/**
 * String literal function for building reply.
 *
 * @param {Array} stringParts
 * @param {Array} injectedValues
 * @returns {*}
 */
const reply = (stringParts, ...injectedValues) => {
  const result = stringParts.reduce((res, stringPart, index) => {
    const stringPartReply = valueToReply(stringPart);
    const injectedValue = getInjectedValue(injectedValues[index]);
    const injectedValueReply = isObject(injectedValue) ? injectedValue : valueToReply(injectedValue);
    return merge(res, stringPartReply, injectedValueReply);
  }, {});

  result.text = processText(result.text);
  result.tts = processTts(result.tts);
  result.end_session = false;

  return result;
};

reply.end = (...args) => {
  return Object.assign(reply(...args), {end_session: true});
};

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

const mergeStringProp = (to, from, prop) => {
  return isString(from[prop])
    ? to[prop] = `${to[prop] || ''}${from[prop]}`
    : null;
};

const mergeArrayProp = (to, from, prop) => {
  return Array.isArray(from[prop])
    ? to[prop] = (Array.isArray(to[prop]) ? to[prop] : []).concat(from[prop])
    : null;
};

const getInjectedValue = value => {
  return Array.isArray(value) ? pick(value) : value;
};

const valueToReply = value => {
  const str = stringify(value);
  return {
    text: str,
    tts: str
  };
};

module.exports = {
  reply,
};
