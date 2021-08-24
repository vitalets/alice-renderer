/**
 * Buttons
 */

import {isObject} from './utils';
import {Response} from './reply';

export interface Button {
  title: string,
  hide?: boolean,
  url?: string,
  payload?: string | number,
}

export const buttons = (items: Array<Button | string>, defaults = {hide: true}): Pick<Response, 'buttons'> => {
  return {
    buttons: items.filter(Boolean).map(item => valueToButton(item, defaults))
  };
};

const valueToButton = (value: string | Partial<Button>, defaults: Partial<Button>): Button => {
  value = isObject(value) ? value : {title: String(value)};
  return Object.assign({}, defaults, value) as Button;
};
