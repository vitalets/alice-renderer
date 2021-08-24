/**
 * Selects elements of array ran.
 * No equal values in sequence.
 */

import {getRandomElement, groupBy} from './utils';
import {config} from './configure';
import {hasUserId, getValue, setValue} from './sessions';
import {getLongWords, getCommonWordsCount} from './helpers/common-words';
import {Response} from './reply';

/**
 * Selects random element from array:
 * If userId set - elements are not repeated.
 * If no userId set - just selects random element.
 *
 * @param {Array} arr
 */
export const select = <T extends string | Response>(arr: T[]): T => {
  const key = hasUserId() && getKey(arr);
  const value = key ? selectNextElement(arr, key) : getRandomElement(arr);
  // даже при disableRandom просчитываем value, чтобы в тестах было ближе к проду
  return config.disableRandom ? arr[0] : value;
};

/**
 * Returns not-repeated array element.
 * For strings tries to select element with non-repeated words with prev element.
 */
const selectNextElement = <T extends any>(arr: T[], key: string): T => {
  const indexes = arr.map((_, index) => index);
  const savedIndexes = getValue(key) || [];
  const excludedIndexes = handleRotate(indexes, savedIndexes);
  const allowedIndexes = getAllowedIndexes(indexes, excludedIndexes);
  const mostDifferentIndexes = getMostDifferentIndexes(excludedIndexes, allowedIndexes, arr);
  const index = getRandomElement(mostDifferentIndexes);
  savedIndexes.push(index);
  setValue(key, savedIndexes);
  return arr[index];
};

const handleRotate = (indexes: number[], savedIndexes: number[]): number[] => {
  if (savedIndexes.length >= indexes.length) {
    // keep last used index to avoid possible repeating after clearing usedIndexes
    const lastUsedIndex = savedIndexes[savedIndexes.length - 1];
    savedIndexes.length = 0;
    return indexes.length > 1 ? [lastUsedIndex] : [];
  } else {
    return savedIndexes;
  }
};

const getAllowedIndexes = (indexes, excludedIndexes) => {
  return indexes.filter(index => !excludedIndexes.includes(index));
};

/**
 * Get indexes of values most different from alrady used values.
 * Comparison made by common long words.
 */
// eslint-disable-next-line max-len
const getMostDifferentIndexes = <T extends any>(excludedIndexes: number[], possibleIndexes: number[], arr: T[]): number[] => {
  if (config.disableRandom || !isStrings(arr)) return possibleIndexes;
  let result = possibleIndexes;
  for (let i = excludedIndexes.length - 1; i >= 0; i--) {
    if (result.length <= 1) break;
    const usedValue = arr[excludedIndexes[i]];
    const usedWords = getLongWords(usedValue as string);
    const map = groupBy(result, index => getCommonWordsCount(usedWords, getLongWords(arr[index] as string)));
    const counts = Object.keys(map).map(Number);
    const minCount = Math.min(...counts);
    result = map[minCount];
  }
  return result;
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
    return isStrings(arr)
      ? buildKeyFromStrings(arr)
      : JSON.stringify(arr);
  } catch (e) {
    // in case of error, return empty key to fallback on getRandomElement()
    // eslint-disable-next-line no-console
    console.warn(`[renderer]: Can't create key for ${typeof arr}:`, arr);
  }
};

const isStrings = arr => arr.every(item => typeof item === 'string');
const buildKeyFromStrings = arr => arr.map(s => s.substr(0, 15)).slice(0, 5).join('|');
