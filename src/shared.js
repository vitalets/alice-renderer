/**
 * Utility functions.
 */

const stringify = value => (isString(value) || isPrintableNumber(value)) ? String(value) : '';
const isObject = value => typeof value === 'object' && value !== null;
const randomElement = arr => arr[Math.floor(Math.random() * arr.length)];
const removeExtraSpaces = str => str.trim().replace(/\s+/g, ' ');
const isPrintableNumber = value => isNumber(value) && !Number.isNaN(value);
const isNumber = value => typeof value === 'number';
const isString = value => typeof value === 'string';

module.exports = {
  stringify,
  isObject,
  isString,
  randomElement,
  removeExtraSpaces,
};
