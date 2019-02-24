/**
 * Working with text part.
 */

const {stringify, removeExtraSpaces, randomElement} = require('./shared');

const BR = '<br>';
const BR_RE = /\s*<br>\s*/g;

const text = value => {
  value = Array.isArray(value) ? randomElement(value) : value;
  return {text: stringify(value)};
};
const br = (n = 1) => text(BR.repeat(n));
const processText = str => replaceNewlines(removeExtraSpaces(removeAccents(str)));

const removeAccents = str => str.replace(/\+(\S)/g, '$1');
const replaceNewlines = str => str.replace(BR_RE, '\n');

module.exports = {
  text,
  br,
  processText,
};
