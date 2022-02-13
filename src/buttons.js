/**
 * Buttons
 */

const {isObject} = require('./utils');

const buttons = (items, defaults = {hide: true}) => {
  return {
    buttons: (items || []).filter(Boolean).map(item => valueToButton(item, defaults))
  };
};

const valueToButton = (value, defaults) => {
  value = isObject(value) ? value : {title: String(value)};
  return Object.assign({}, defaults, value);
};

module.exports = {
  buttons,
};
