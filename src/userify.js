/**
 * Userify.
 * See: https://github.com/vitalets/alice-renderer/issues/1
 */

const {randomElement, isFunction, isObject} = require('./utils');
const {touch, setUserId, hasUserId, getValue, setValue} = require('./sessions');

const userify = (userId, target) => {
  touch(userId);
  return isFunction(target)
    ? userifyFn(userId, target)
    : isObject(target)
      ? userifyObj(userId, target)
      : target;
};

const userifyFn = (userId, fn) => {
  return (...args) => {
    try {
      setUserId(userId);
      return fn(...args);
    } finally {
      setUserId(null);
    }
  };
};

const userifyObj = (userId, obj) => {
  return new Proxy(obj, {
    get: (obj, prop) => {
      return isFunction(obj[prop])
        ? userifyFn(userId, obj[prop])
        : obj[prop];
    }
  });
};

/**
 * Picks random element from array without repeating to current userId.
 * If no userId set - just picks random element as Math.random().
 * @param {Array} arr
 */
const pick = arr => {
  if (arr.length <= 1) {
    return arr[0];
  } else {
    return hasUserId() ? userRandomElement(arr) : randomElement(arr);
  }
};

/**
 * Returns not-repeated array element for user.
 */
const userRandomElement = arr => {
  try {
    return unsafeUserRandomElement(arr);
  } catch(e) {
    // in case of any errors just fallback to regular randomElement
    return randomElement(arr);
  }
};

const unsafeUserRandomElement = arr => {
  const indexes = arr.map((v, index) => index);
  const key = getKey(arr);
  const usedIndexes = getValue(key) || [];
  const excludedIndexes = getExcludedIndexes(indexes, usedIndexes);
  const possibleIndexes = getPossibleIndexes(indexes, excludedIndexes);
  const index = randomElement(possibleIndexes);
  usedIndexes.push(index);
  setValue(key, usedIndexes);
  return arr[index];
};

/**
 * Returns unique key for array instance.
 * Maybe use concat of values (but objects values should be processed)
 * @param {Array} arr
 * @returns {String}
 */
const getKey = arr => JSON.stringify(arr);

const getExcludedIndexes = (indexes, usedIndexes) => {
  if (usedIndexes.length >= indexes.length) {
    // keep last used index to avoid possible repeating
    const lastUsedIndex = usedIndexes[usedIndexes.length - 1];
    usedIndexes.length = 0;
    return [lastUsedIndex];
  } else {
    return usedIndexes;
  }
};

const getPossibleIndexes = (indexes, excludedIndexes) => {
  if (excludedIndexes.length > 0) {
    return indexes.filter(index => !excludedIndexes.includes(index));
  } else {
    return indexes;
  }
};

module.exports = {
  userify,
  pick,
};
