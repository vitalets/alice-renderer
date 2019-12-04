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
const removeExtraSpaces = str => str.trim().replace(/\s+/g, ' ');
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

module.exports = {
  stringify,
  isObject,
  isString,
  isFunction,
  getRandomElement,
  removeExtraSpaces,
  truncate,
};
