/**
 * Renders reply for Alice.
 * - convert string to {text, tts}
 * - clear tts markup (+, - - -)
 * - expand arrays to random value
 * - helper for sounds
 */

const BR = '<br>';
const BR_RE = /\s*<br>\s*/g;

/**
 * Converts template literal to Alice response {text, tts, buttons}.
 * See: https://tech.yandex.ru/dialogs/alice/doc/protocol-docpage/
 */
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

const arrayToReply = arr => valueToReply(randomItem(arr));
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

const valueToButton = (value, defaults) => {
  value = isObject(value) ? value : {title: String(value)};
  return Object.assign({}, defaults, value);
};

const stringify = value => (isString(value) || isPrintableNumber(value)) ? String(value) : '';
const removeExtraSpaces = str => str.trim().replace(/\s+/g, ' ');
const removeAccents = str => str.replace(/\+(\S)/g, '$1');
const replaceNewlines = str => str.replace(BR_RE, '\n');
const processText = str => replaceNewlines(removeExtraSpaces(removeAccents(str)));
const processTts = str => removeExtraSpaces(str);


// high level
const text = value => ({text: stringify(value)});
const tts = value => ({tts: stringify(value)});
const textAndTts = value => {
  const str = stringify(value);
  return {text: str, tts: str};
};
const buttons = (items, defaults = {hide: true}) => {
  return {
    buttons: items.filter(Boolean).map(item => valueToButton(item, defaults))
  };
};
const audio = name => tts(`<speaker audio="alice-${name}.opus">`);
const effect = name => tts(`<speaker effect="${name}">`);
const pause = (ms = 500) => tts('- '.repeat(Math.ceil(ms / 75)));
const br = (n = 1) => text(BR.repeat(n));

// utils
const isObject = value => typeof value === 'object' && value !== null;
const isString = value => typeof value === 'string';
const isNumber = value => typeof value === 'number';
const isPrintableNumber = value => isNumber(value) && !Number.isNaN(value);
const randomItem = arr => arr[Math.floor(Math.random() * arr.length)];

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
