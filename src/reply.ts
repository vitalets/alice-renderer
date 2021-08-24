/**
 * Reply implementation.
 */

import {isObject, isString, stringify, removeUnneededSpaces, convertNewlinesToSpaces} from './utils';
import {select} from './select';
import {removeAccents} from './text';
import {CardImage, updateImageText} from './image';
import {Button} from './buttons';

/**
 * String literal function for building reply.
 *
 * @param {Array} stringParts
 * @param {Array} injectedValues
 * @returns {*}
 */

export interface Response extends Record<string, any> {
  text: string,
  tts: string,
  buttons?: Button[],
  end_session: boolean,
  card?: CardImage | {
    type: 'ItemsList',
    items: string[]
  }
}

export const reply = (stringParts: TemplateStringsArray, ...injectedValues: Array<Partial<Response> | any>):
  Response => {
  const response = stringParts.reduce((res, stringPart, index) => {
    // replace '\n' in string parts to allow newlines in IDE
    const stringPartReply = convertSimpleValueToReply(convertNewlinesToSpaces(stringPart));
    let injectedValue = injectedValues[index];
    if (Array.isArray(injectedValue)) {
      injectedValue = select(injectedValue);
    }
    const injectedValueReply = isObject(injectedValue)
      ? injectedValue
      : convertSimpleValueToReply(injectedValue);
    return merge(res, stringPartReply, injectedValueReply);
  }, {});

  response.text = removeUnneededSpaces(removeAccents(response.text));
  response.tts = removeUnneededSpaces(response.tts);
  response.end_session = false;

  updateImageText(response);

  return response;
};

/**
 * Reply and end session.
 *
 * @param {TemplateStringsArray} stringParts
 * @param {Array} args
 * @returns {*}
 */
reply.end = (stringParts: TemplateStringsArray, ...args: Array<Partial<Response>>) => {
  return Object.assign(reply(stringParts, ...args), {end_session: true});
};

/**
 * Merges reply objects by concatenating `text`, `tts` and `buttons` props.
 *
 * @param {Array<{text, tts, buttons, ...}>} objects
 */
const merge = (...objects) => {
  return objects.filter(Boolean).reduce((res, obj) => {
    Object.keys(obj).forEach(key => mergeProp(res, obj, key));
    return res;
  }, {});
};

/**
 * Merges particular prop. Uses concatenation for strings and arrays.
 *
 * @param {object} to
 * @param {object} from
 * @param {string} key
 */
const mergeProp = (to, from, key) => {
  const value = from[key];
  if (isString(value)) {
    // string props are concatenated (text, tts)
    to[key] = `${to[key] || ''}${value}`;
  } else if (Array.isArray(value)) {
    // array props are appended to the end (buttons)
    to[key] = (Array.isArray(to[key]) ? to[key] : []).concat(value);
  } else {
    // all other props are copied as is
    to[key] = from[key];
  }
};

const convertSimpleValueToReply = value => {
  const str = stringify(value);
  return {
    text: str,
    tts: str
  };
};
