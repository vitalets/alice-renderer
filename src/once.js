/**
 * once() - возвращает response не чаще чем 1 раз в заданное кол-во вызовов или секунд.
 */

const { hasUserId, getValue, setValue } = require('./sessions');

/**
 * Возвращает response не чаще чем 1 раз в заданное кол-во вызовов или секунд.
 * Если ни calls, ни seconds не указано - возвращает response только 1 раз за сессию.
 *
 * @param {Object} options
 * @param {Number} [options.calls] вернет response не чаще чем 1 раз в заданное кол-во вызовов
 * @param {Number} [options.seconds] вернет response не чаще чем 1 раз в заданное кол-во секунд
 * @param {Boolean} [options.leading=false] возвращять ли response при первом вызове
 * @param {*} response
 * @returns {*}
 */
const once = (options, response) => {
  if (hasUserId()) {
    const key = getKey(response);
    const triggered = new OnceTrigger(key, options).handleCall();
    return triggered ? response : null;
  }
  throw new Error(`once() is allowed only in userified mode!`);
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

class OnceTrigger {
  /**
   * @param {string} key
   * @param {object} options { calls, seconds, leading }
   */
  constructor(key, options) {
    this._key = key;
    this._options = options;
    const info = getValue(key) || {};
    this._currentCalls = info.currentCalls || 0;
    this._isFirstCall = info.lastTriggerTime === undefined;
    this._lastTriggerTime = this._isFirstCall ? Date.now() : info.lastTriggerTime;
  }

  handleCall() {
    this._currentCalls++;
    const triggered = this._triggerByLeading() || this._triggerByCalls() || this._triggerBySeconds();
    if (triggered) {
      this._reset();
    }
    this._save();
    return triggered;
  }

  _triggerByLeading() {
    return this._options.leading && this._isFirstCall;
  }

  _triggerByCalls() {
    return this._options.calls && this._currentCalls >= this._options.calls;
  }

  _triggerBySeconds() {
    return this._options.seconds && (Date.now() - this._lastTriggerTime) >= this._options.seconds * 1000;
  }

  _reset() {
    this._currentCalls = 0;
    this._lastTriggerTime = Date.now();
  }

  _save() {
    setValue(this._key, {
      currentCalls: this._currentCalls,
      lastTriggerTime: this._lastTriggerTime,
    });
  }
}

module.exports = {
  once,
};
