/**
 * Userify.
 *
 * See: https://github.com/vitalets/alice-renderer/issues/1
 */

const {getRandomElement, isFunction, isObject} = require('./utils');
const {touch, setUserId, hasUserId, getValue, setValue} = require('./sessions');
const {config} = require('./configure');

/**
 * Userifies function or all methods of object.
 *
 * @param userId
 * @param target
 * @returns {*}
 */
const userify = (userId, target) => {
  touch(userId);
  return isFunction(target)
    ? userifyFn(userId, target)
    : isObject(target)
      ? userifyObj(userId, target)
      : target;
};

/**
 * Userifies function.
 *
 * @param userId
 * @param fn
 * @returns {Function}
 */
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

/**
 * Userifies all methods of object.
 *
 * @param userId
 * @param obj
 * @returns {*}
 */
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
 * Picks random element from array:
 * If userId set - elements are not repeated.
 * If no userId set - just picks random element.
 * @param {Array} arr
 */
const pick = arr => {
  if (arr.length <= 1 || config.disableRandom) {
    return arr[0];
  } else {
    return hasUserId() ? getRandomElementForUser(arr) : getRandomElement(arr);
  }
};

/**
 * Returns not-repeated array element for user.
 */
const getRandomElementForUser = arr => {
  try {
    return getRandomElementForUserUnsafe(arr);
  } catch(e) {
    // in case of any errors just fallback to regular randomElement
    return getRandomElement(arr);
  }
};

const getRandomElementForUserUnsafe = arr => {
  const indexes = arr.map((v, index) => index);
  const key = getKey(arr);
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
const getKey = arr => JSON.stringify(arr);

module.exports = {
  userify,
  pick,
};
