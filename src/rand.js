/**
 * Rand.
 */

const {hasUserId, getValue, setValue} = require('./sessions');

/**
 * @param {Number} from
 * @param {Number} to
 * @param {String|Object} response
 * @returns {String|Object}
 */
const rand = (from, to, response) => {
  return hasUserId() ? userRand(from, to, response) : fallback(from, to, response);
};

const userRand = (from, to, response) => {
  try {
    return unsafeUserRand(from, to, response);
  } catch(e) {
    // in case of any errors use fallback
    return fallback(from, to, response);
  }
};

const unsafeUserRand = (from, to, response) => {
  const key = getKey(response);
  let remainingCalls = getValue(key) || initRemainingCalls(from, to);
  remainingCalls--;
  const triggered = remainingCalls <= 0;
  if (triggered) {
    remainingCalls = initRemainingCalls(from, to);
  }
  setValue(key, remainingCalls);
  return triggered ? response : null;
};

const fallback = (from, to, response) => {
  const avg = 0.5 * (from + to);
  const probability = 1 / avg;
  return Math.random() <= probability ? response : null;
};

const initRemainingCalls = (from, to) => from + Math.floor(Math.random() * (to - from + 1));
const getKey = obj => JSON.stringify(obj);

module.exports = {
  rand,
};
