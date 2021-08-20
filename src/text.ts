/**
 * Working with text part.
 */

import {stringify} from './utils.ts';
import {select} from './select';

export const text = (value) => {
  value = Array.isArray(value) ? select(value) : value;
  return {
    text: stringify(value),
  };
};

export const removeAccents = (str) => str.replace(/\+(\S)/g, '$1');
