/**
 * Working with text part.
 */

import {stringify} from './utils';
import {select} from './select';
import {Response} from './reply';

export const text = (value: string | string[]): Pick<Response, 'text'> => {
  value = Array.isArray(value) ? select(value) : value;
  return {
    text: stringify(value)
  };
};

export const removeAccents = (str: string): string => str.replace(/\+(\S)/g, '$1');
