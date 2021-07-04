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
  const key = hasUserId() && getKey(arr);
  return key
    ? selectNextElement(arr, key)
    : selectRandomElement(arr);
};

/**
 * Like getRandomElement, but returns first item if disableRandom = true
 */
const selectRandomElement = arr => {
  return config.disableRandom ? arr[0] : getRandomElement(arr);
};

/**
 * Returns not-repeated array element.
 * For strings tries to select element with non-repeated words with prev element.
 */
const selectNextElement = (arr, key) => {
  const indexes = arr.map((_, index) => index);
  const usedIndexes = getValue(key) || [];
  const excludedIndexes = getExcludedIndexes(indexes, usedIndexes);
  const possibleIndexes = getPossibleIndexes(indexes, excludedIndexes);
  const mostDifferentIndexes = getMostDifferentIndexes(excludedIndexes, possibleIndexes, arr);
  const index = selectRandomElement(mostDifferentIndexes);
  usedIndexes.push(index);
  setValue(key, usedIndexes);
  return arr[index];
};

const getExcludedIndexes = (indexes, usedIndexes) => {
  if (usedIndexes.length >= indexes.length) {
    // keep last used index to avoid possible repeating after clearing usedIndexes
    const lastUsedIndex = usedIndexes[usedIndexes.length - 1];
    usedIndexes.length = 0;
    return indexes.length > 1 ? [lastUsedIndex] : [];
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
  if (config.disableRandom) {
    return possibleIndexes;
  }
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
    const words = str.match(/[а-яё]+/ig) || [];
    return words
      .filter(word => word.length >= 4)
      .map(word => removeWordEnding(word));
  } else {
    return [];
  }
};

/**
 * Remove word ending (depending on word length)
 */
const removeWordEnding = word => {
  const l = word.length;
  const removeChars = l <= 5 ? 1 : (l <= 7 ? 2 : 3);
  return word.substring(0, l - removeChars);
};

/**
 * Returns unique key for array instance.
 * Maybe use concat of values (but objects values should be processed)
 * @param {Array} arr
 * @returns {String}
 */
const getKey = arr => {
  try {
    // For array of strings build shorter key than JSON.stringify
    return isStrings(arr) ? buildKeyFromStrings(arr) : JSON.stringify(arr);
  } catch(e) {
    // in case of error, return empty key to fallback on getRandomElement()
    // eslint-disable-next-line no-console
    console.warn(`[renderer]: Can't create key for ${typeof arr}:`, arr);
  }
};

const isStrings = arr => arr.every(item => typeof item === 'string');
const buildKeyFromStrings = arr => arr.map(s => s.substr(0, 15)).slice(0, 5).join('|');

module.exports = {
  select,
};
