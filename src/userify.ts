/**
 * Userify.
 *
 * See: https://github.com/vitalets/alice-renderer/issues/1
 */

import {isFunction, isObject} from './utils';
import {getOrCreateSession, setUserId} from './sessions';
import {Response} from "./reply";

/**
 * Userifies function or all methods of object.
 *
 * @param {string} userId
 * @param {function|object} target
 * @returns {function|object}
 */

type TargetFunction<T extends any[] = any[]> = (...args: T) => Response | string

// eslint-disable-next-line max-len
export function userify<U extends any[], T extends TargetFunction<U> | Record<string, any> | string | number>(userId: string, target: T): T {
  void getOrCreateSession(userId);
  if (isFunction(target)) {
    return userifyFn(userId, target as any) as unknown as T;
  } else if (isObject(target)) {
    return userifyObj(userId, target as any) as unknown as T;
  } else {
    return target as unknown as T;
  }
}

/**
 * Userifies function.
 *
 * @param userId
 * @param fn
 * @returns {Function}
 */
const userifyFn = <F extends TargetFunction>(userId: string, fn: F): (...args: Parameters<F>) => Response | string => {
  return (...args: Parameters<F>) => {
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
const userifyObj = <T extends Record<string, any>>(userId: string, obj: T): T => {
  return new Proxy(obj, {
    get: (obj: T, prop: string) => {
      return isFunction(obj[prop])
        ? userifyFn(userId, obj[prop])
        : obj[prop];
    }
  });
};


