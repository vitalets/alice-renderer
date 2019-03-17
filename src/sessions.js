/**
 * User sessions for userify.
 */

const {randomElement} = require('./utils');

// TTL for session (after last message from user), 5 min.
// Sessions older than ttl will be removed by cleanup process.
const SESSION_TTL = 5 * 60 * 1000;
const CLEANUP_INTERVAL = 60 * 1000;

const sessions = new Map();
let currentUserId = null;
let lastCleanup = 0;

const setUserId = userId => currentUserId = userId;
const hasUserId = () => Boolean(currentUserId);

/**
 * Updates or creates user session with actual timestamp.
 * Also runs cleanup in next tick if needed.
 */
const touch = userId => {
  void getOrCreateSession(userId);
  if (shouldCleanup()) {
    setTimeout(cleanup, 0);
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
  const session = getOrCreateSession(currentUserId);
  const key = getKey(arr);
  const indexes = arr.map((v, index) => index);
  const usedIndexes = session[key] || [];
  const unusedIndexes = usedIndexes.length < indexes.length
    ? indexes.filter(index => !usedIndexes.includes(index))
    : (usedIndexes.length = 0, indexes);
  const index = randomElement(unusedIndexes);
  session[key] = usedIndexes.concat([index]);
  return arr[index];
};

/**
 * Updates or creates user session with actual timestamp.
 */
const getOrCreateSession = userId => {
  let session = sessions.get(userId);
  if (!session) {
    session = {};
    sessions.set(userId, session);
  }
  session.timestamp = Date.now();
  return session;
};

/**
 * Cleanups outdated sessions.
 */
const cleanup = () => {
  const now = Date.now();
  sessions.forEach((session, key) => {
    const isOutdated = Math.abs(now - session.timestamp) > exports.SESSION_TTL;
    if (isOutdated) {
      sessions.delete(key);
    }
  });
  lastCleanup = now;
};

const shouldCleanup  = () => Math.abs(Date.now() - lastCleanup) > exports.CLEANUP_INTERVAL;
const getSessions = () => sessions;

/**
 * Returns unique key for array instance.
 * Maybe use concat of values (but objects values should be processed)
 * @param {Array} arr
 * @returns {String}
 */
const getKey = arr => JSON.stringify(arr);

Object.assign(exports, {
  SESSION_TTL,
  CLEANUP_INTERVAL,
  touch,
  setUserId,
  hasUserId,
  userRandomElement,
  getSessions,
});
