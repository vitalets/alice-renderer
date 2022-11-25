/**
 * Utility functions.
 */

/**
 * Returns string for printable values or empty string.
 *
 * @param {*} value
 * @returns {string}
 */
const stringify = value => (isString(value) || isPrintableNumber(value)) ? String(value) : '';
const isObject = value => typeof value === 'object' && value !== null;
const getRandomElement = arr => arr[Math.floor(Math.random() * arr.length)];
const removeMultipleSpaces = str => str.replace(/^ +| +$/g, '').replace(/ {2,}/g, ' ');
const removeSpacesAfterNewline = str => str.replace(/\n /g, '\n');
const removeUnneededSpaces = str => removeSpacesAfterNewline(removeMultipleSpaces(str));
const convertNewlinesToSpaces = str => str.replace(/\n+/g, ' ');
const isPrintableNumber = value => isNumber(value) && !Number.isNaN(value);
const isNumber = value => typeof value === 'number';
const isString = value => typeof value === 'string';
const isFunction = value => typeof value === 'function';

/**
 * Truncate string to provided length with adding "...".
 *
 * @param {string} str
 * @param {number} maxLength
 * @returns {string}
 */
const truncate = (str, maxLength) => {
  str = stringify(str);
  return str.length > maxLength
    ? `${str.substr(0, maxLength - 3)}...`
    : str;
};

/**
 * Group by fn.
 */
const groupBy = (arr, fn) => {
  return arr.reduce((acc, item) => {
    const value = fn(item);
    acc[value] = (acc[value] || []).concat([item]);
    return acc;
  }, {});
};

module.exports = {
  stringify,
  isObject,
  isString,
  isFunction,
  getRandomElement,
  removeUnneededSpaces,
  convertNewlinesToSpaces,
  truncate,
  groupBy,
};
