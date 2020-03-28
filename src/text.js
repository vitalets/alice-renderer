/**
 * Working with text part.
 */

const {stringify} = require('./utils');
const {select} = require('./select');

const text = value => {
  value = Array.isArray(value) ? select(value) : value;
  return {
    text: stringify(value)
  };
};

const removeAccents = str => str.replace(/\+(\S)/g, '$1');

module.exports = {
  text,
  removeAccents,
};
