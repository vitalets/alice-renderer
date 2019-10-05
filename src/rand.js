/**
 * Rand.
 * Better name: onceOf
 */

const {hasUserId, getValue, setValue} = require('./sessions');
const {config} = require('./configure');
const {userify} = require('./userify');

/**
 * This user is used only in disableRandom mode in non-userified call.
 * It is required to put somewhere calls count to get reproducable results.
 */
const FAKE_USER_ID = '_FAKE_USER_ID_';

/**
 * Returns response once in N calls where N is randomly between from and to.
 *
 * @param {Number} from
 * @param {Number} to
 * @param {String|Object} response
 * @returns {String|Object}
 */
const rand = (from, to, response) => {
  if (config.disableRandom) {
    return deterministicRand(from, response);
  }
  return hasUserId()
    ? userifiedRand(from, to, response)
    : fallback(from, to, response);
};

/**
 * Returns userified rand or fallback in case of error.
 */
const userifiedRand = (from, to, response) => {
  try {
    return userifiedRandUnsafe(from, to, response);
  } catch(e) {
    // in case of any errors use fallback
    return fallback(from, to, response);
  }
};

const userifiedRandUnsafe = (from, to, response) => {
  const key = getKey(response);
  const remainingCalls = getValue(key) || initRemainingCalls(from, to);
  const newRemainingCalls = remainingCalls - 1;
  const triggered = newRemainingCalls <= 0;
  setValue(key, triggered ? initRemainingCalls(from, to) : newRemainingCalls);
  return triggered ? response : null;
};

/**
 * Fallback: returns response once in (from + to) / 2 calls.
 *
 * @param from
 * @param to
 * @param response
 * @returns {null}
 */
const fallback = (from, to, response) => {
  const avg = 0.5 * (from + to);
  const probability = 1 / avg;
  return Math.random() <= probability ? response : null;
};

/**
 * Rand in disableRandom mode.
 * Returns response once of N calls.
 */
const deterministicRand = (N, response) => {
  return hasUserId()
    ? userifiedRand(N, N, response)
    : userify(FAKE_USER_ID, userifiedRand)(N, N, response);
};

/**
 * Randomly init remaining calls count before returning response.
 *
 * @param from
 * @param to
 * @returns {*}
 */
const initRemainingCalls = (from, to) => {
  return from + Math.floor(Math.random() * (to - from + 1));
};

/**
 * Generate unique key for storing info in user session.
 *
 * @param obj
 * @returns {string}
 */
const getKey = obj => {
  return JSON.stringify(obj);
};

module.exports = {
  rand,
};
