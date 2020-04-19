/**
 * Selects elements of array ran.
 * No equal values in sequence.
 */

const {getRandomElement} = require('./utils');
const {config} = require('./configure');
const {hasUserId, getValue, setValue} = require('./sessions');

/**
 * Selects random element from array:
 * If userId set - elements are not repeated.
 * If no userId set - just selects random element.
 *
 * @param {Array} arr
 */
const select = arr => {
  if (arr.length <= 1 || config.disableRandom) {
    return arr[0];
  } else if (hasUserId()) {
    const key = getKey(arr);
    return key ? selectNextElement(arr, key) : getRandomElement(arr);
  } else {
    return getRandomElement(arr);
  }
};

/**
 * Returns not-repeated array element.
 */
const selectNextElement = (arr, key) => {
  const indexes = arr.map((v, index) => index);
  const usedIndexes = getValue(key) || [];
  const excludedIndexes = getExcludedIndexes(indexes, usedIndexes);
  const possibleIndexes = getPossibleIndexes(indexes, excludedIndexes);
  const index = getRandomElement(possibleIndexes);
  usedIndexes.push(index);
  setValue(key, usedIndexes);
  return arr[index];
};

const getExcludedIndexes = (indexes, usedIndexes) => {
  if (usedIndexes.length >= indexes.length) {
    // keep last used index to avoid possible repeating after clearing usedIndexes
    const lastUsedIndex = usedIndexes[usedIndexes.length - 1];
    usedIndexes.length = 0;
    return [lastUsedIndex];
  } else {
    return usedIndexes;
  }
};

const getPossibleIndexes = (indexes, excludedIndexes) => {
  return indexes.filter(index => !excludedIndexes.includes(index));
};

/**
 * Returns unique key for array instance.
 * Maybe use concat of values (but objects values should be processed)
 * @param {Array} arr
 * @returns {String}
 */
const getKey = arr => {
  try {
    return JSON.stringify(arr);
  } catch(e) {
    // in case of error, return empty key to fallback on getRandomElement()
    // eslint-disable-next-line no-console
    console.warn(`[renderer]: Can't create key for ${typeof arr}:`, arr);
  }
};

module.exports = {
  select,
};
