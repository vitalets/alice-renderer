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
 * For strings tries to select element with non-repeated words with prev element.
 */
const selectNextElement = (arr, key) => {
  const indexes = arr.map((v, index) => index);
  const usedIndexes = getValue(key) || [];
  const excludedIndexes = getExcludedIndexes(indexes, usedIndexes);
  const possibleIndexes = getPossibleIndexes(indexes, excludedIndexes);
  const mostDifferentIndexes = getMostDifferentIndexes(excludedIndexes, possibleIndexes, arr);
  const index = getRandomElement(mostDifferentIndexes);
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
 * Get indexes of values most different from alrady used values.
 * Comparison made by common long words.
 */
const getMostDifferentIndexes = (excludedIndexes, possibleIndexes, arr) => {
  let result = possibleIndexes;
  for (let i = excludedIndexes.length - 1; i >= 0; i--) {
    const usedValue = arr[excludedIndexes[i]];
    const usedWords = getLongWordsWithoutEndings(usedValue);
    const newResult = result.filter(index => {
      const words = getLongWordsWithoutEndings(arr[index]);
      const hasCommonWords = words.some(word => usedWords.includes(word));
      return !hasCommonWords;
    });
    switch (newResult.length) {
      case 0: return result;
      case 1: return newResult;
      default: result = newResult;
    }
  }
  return result;
};

const getLongWordsWithoutEndings = str => {
  if (typeof str === 'string') {
    return str
      .split(/\s+/)
      .filter(word => word.length >= 4)
      .map(word => word.substr(0, word.length >= 6 ? 2 : 1));
  } else {
    return [];
  }
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
