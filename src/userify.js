/**
 * Userify.
 * See: https://github.com/vitalets/alice-renderer/issues/1
 */

const {randomElement, isFunction, isObject} = require('./utils');
const {touch, setUserId, hasUserId, userRandomElement} = require('./sessions');

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
  return hasUserId() ? userRandomElement(arr) : randomElement(arr);
};

module.exports = {
  userify,
  pick,
};
