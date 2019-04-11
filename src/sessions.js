/**
 * User sessions for userify.
 */

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
 * Gets value for current user with provided key
 * @param {String} key
 * @returns {*}
 */
const getValue = key => {
  const session = getOrCreateSession(currentUserId);
  return session[key];
};

/**
 * Sets value for current user with provided key.
 * @param {String} key
 * @param {*} value
 * @returns {*}
 */
const setValue = (key, value) => {
  const session = getOrCreateSession(currentUserId);
  session[key] = value;
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

Object.assign(exports, {
  SESSION_TTL,
  CLEANUP_INTERVAL,
  touch,
  setUserId,
  hasUserId,
  getValue,
  setValue,
  getSessions,
});
