/**
 * Working with text part.
 */

const {stringify} = require('./utils');
const {pick} = require('./userify');

const text = value => {
  value = Array.isArray(value) ? pick(value) : value;
  return {
    text: stringify(value)
  };
};

const removeAccents = str => str.replace(/\+(\S)/g, '$1');

module.exports = {
  text,
  removeAccents,
};
