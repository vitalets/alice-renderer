/**
 * Utility functions.
 */

/**
 * Returns string for printable values or empty string.
 *
 * @param {*} value
 * @returns {string}
 */
export const stringify = (value) =>
  isString(value) || isPrintableNumber(value) ? String(value) : '';
export const isObject = (value) => typeof value === 'object' && value !== null;
export const getRandomElement = (arr) =>
  arr[Math.floor(Math.random() * arr.length)];
const removeMultipleSpaces = (str) =>
  str.replace(/^ +| +$/g, '').replace(/ {2,}/g, ' ');
const removeSpacesAfterNewline = (str) => str.replace(/\n /g, '\n');
export const removeUnneededSpaces = (str) =>
  removeSpacesAfterNewline(removeMultipleSpaces(str));
export const convertNewlinesToSpaces = (str) => str.replace(/\n+/g, ' ');
const isPrintableNumber = (value) => isNumber(value) && !Number.isNaN(value);
const isNumber = (value) => typeof value === 'number';
export const isString = (value) => typeof value === 'string';
export const isFunction = (value) => typeof value === 'function';

/**
 * Truncate string to provided length with adding "...".
 *
 * @param {string} str
 * @param {number} maxLength
 * @returns {string}
 */
export const truncate = (str, maxLength) => {
  str = stringify(str);
  return str.length > maxLength ? `${str.substr(0, maxLength - 3)}...` : str;
};

/**
 * Group by fn.
 */
export const groupBy = (arr, fn) => {
  return arr.reduce((acc, item) => {
    const value = fn(item);
    acc[value] = (acc[value] || []).concat([item]);
    return acc;
  }, {});
};
