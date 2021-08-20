/**
 * In-memory user sessions for storing userified data.
 */

// TTL for session (after last message from user), 5 min.
// Sessions older than ttl will be removed by cleanup process.
const SESSION_TTL = 5 * 60 * 1000;
// periodically cleanup session data of non-active users
const CLEANUP_INTERVAL = 60 * 1000;

const sessions = new Map();

// Global value for userId.
let currentUserId = null;

let cleanupTimer = null;

export const setUserId = (userId) => (currentUserId = userId);
export const hasUserId = () => Boolean(currentUserId);

/**
 * Updates or creates user session with actual timestamp.
 */
export const getOrCreateSession = (userId) => {
  let session = sessions.get(userId);
  if (!session) {
    session = {};
    sessions.set(userId, session);
  }
  // update timestamp on any user activity with session
  // use $ to avoid conflicts with user data keys
  session.$timestamp = Date.now();
  return session;
};

/**
 * Gets value for current user with provided key
 * @param {String} key
 * @returns {*}
 */
export const getValue = (key) => {
  const session = getOrCreateSession(currentUserId);
  return session[key];
};

/**
 * Sets value for current user with provided key.
 * @param {String} key
 * @param {*} value
 * @returns {*}
 */
export const setValue = (key, value) => {
  const session = getOrCreateSession(currentUserId);
  session[key] = value;
};

/**
 * Starts cleanup service.
 */
export const startCleanupService = () => {
  if (cleanupTimer) {
    clearInterval(cleanupTimer);
  }
  cleanupTimer = setInterval(cleanup, CLEANUP_INTERVAL);

  /* istanbul ignore next */
  if (cleanupTimer.unref) {
    cleanupTimer.unref();
  }
};

/**
 * Cleanups outdated sessions.
 */
const cleanup = () => {
  const now = Date.now();
  sessions.forEach((session, key) => {
    const isOutdated = Math.abs(now - session.$timestamp) >= SESSION_TTL;
    if (isOutdated) {
      sessions.delete(key);
    }
  });
};

export const getSessions = () => sessions;
