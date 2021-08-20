/**
 * Utility functions.
 */

/**
 * Returns string for printable values or empty string.
 *
 * @param {*} value
 * @returns {string}
 */
export const stringify = (value: any): string => (isString(value) || isPrintableNumber(value)) ? String(value) : '';
export const isObject = (value: any): boolean => typeof value === 'object' && value !== null;
export const getRandomElement = <T extends any>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const removeMultipleSpaces = (str: string): string => str.replace(/^ +| +$/g, '').replace(/ {2,}/g, ' ');
const removeSpacesAfterNewline = (str: string): string => str.replace(/\n /g, '\n');
export const removeUnneededSpaces = (str: string): string => removeSpacesAfterNewline(removeMultipleSpaces(str));
export const convertNewlinesToSpaces = (str: string): string => str.replace(/\n+/g, ' ');
const isPrintableNumber = (value: any): boolean => isNumber(value) && !Number.isNaN(value);
const isNumber = (value: any): boolean => typeof value === 'number';
export const isString = (value: any): boolean => typeof value === 'string';
export const isFunction = <T extends (...args: any[]) => any>(value: T | any): boolean => typeof value === 'function';

/**
 * Truncate string to provided length with adding "...".
 *
 * @param {string} str
 * @param {number} maxLength
 * @returns {string}
 */
export const truncate = (str: string, maxLength: number): string => {
  str = stringify(str);
  return str.length > maxLength
    ? `${str.substr(0, maxLength - 3)}...`
    : str;
};

/**
 * Group by fn.T
 */
export const groupBy = <T extends string | number>(arr: T[], fn: (...args: T[]) => T
  ): Record<string, T[]> => {
    return arr.reduce((acc: Record<string | number, T[]>, item: T) => {
      const value = fn(item);
      acc[value] = (acc[value] || []).concat([item]);
      return acc;
    }, {});
  }
;
