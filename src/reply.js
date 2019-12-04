/**
 * Reply implementation.
 */

const {isObject, isString, stringify} = require('./utils');
const {pick} = require('./userify');
const {processText} = require('./text');
const {processTts} = require('./tts');
const {updateImageText} = require('./image');

/**
 * String literal function for building reply.
 *
 * @param {Array} stringParts
 * @param {Array} injectedValues
 * @returns {*}
 */
const reply = (stringParts, ...injectedValues) => {
  const response = stringParts.reduce((res, stringPart, index) => {
    const stringPartReply = valueToReply(stringPart);
    const injectedValue = getInjectedValue(injectedValues[index]);
    const injectedValueReply = isObject(injectedValue) ? injectedValue : valueToReply(injectedValue);
    return merge(res, stringPartReply, injectedValueReply);
  }, {});

  response.text = processText(response.text);
  response.tts = processTts(response.tts);
  response.end_session = false;

  updateImageText(response);

  return response;
};

reply.end = (...args) => {
  return Object.assign(reply(...args), {end_session: true});
};

/**
 * Merges reply objects by concatenating `text`, `tts` and `buttons` props.
 *
 * @param {Array<{text, tts, buttons, ...}>} objects
 */
const merge = (...objects) => {
  return objects.filter(Boolean).reduce((res, obj) => {
    Object.keys(obj).forEach(key => mergeProp(res, obj, key));
    return res;
  }, {});
};

/**
 * Merges particular prop. Uses concatenation for strings and arrays.
 *
 * @param {object} to
 * @param {object} from
 * @param {string} key
 */
const mergeProp = (to, from, key) => {
  const value = from[key];
  if (isString(value)) {
    // string props are concatenated (text, tts)
    to[key] = `${to[key] || ''}${value}`;
  } else if (Array.isArray(value)) {
    // array props are appended to the end (buttons)
    to[key] = (Array.isArray(to[key]) ? to[key] : []).concat(value);
  } else {
    // all other props are copied as is
    to[key] = from[key];
  }
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
