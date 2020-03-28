/**
 * onceInRange.
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
const onceInRange = (from, to, response) => {
  if (config.disableRandom) {
    return onceInFixed(from, response);
  }
  if (hasUserId()) {
    try {
      return tryGetResponse(from, to, response);
    } catch (e) {
      // todo: throw in debugMode
    }
  }
  return fallback(from, to, response);
};

/**
 * Returns response once in N calls.
 * Used in disableRandom mode.
 */
const onceInFixed = (N, response) => {
  return hasUserId()
    ? tryGetResponse(N, N, response)
    // FAKE_USER_ID is needed to store number of calls for each key
    : userify(FAKE_USER_ID, tryGetResponse)(N, N, response);
};

const tryGetResponse = (from, to, response) => {
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
  onceInRange,
};
