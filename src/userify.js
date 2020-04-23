/**
 * Userify.
 *
 * See: https://github.com/vitalets/alice-renderer/issues/1
 */

const {isFunction, isObject} = require('./utils');
const {getOrCreateSession, setUserId} = require('./sessions');

/**
 * Userifies function or all methods of object.
 *
 * @param {string} userId
 * @param {function|object} target
 * @returns {function|object}
 */
const userify = (userId, target) => {
  void getOrCreateSession(userId);
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

module.exports = {
  userify,
};
