
const {isObject} = require('../../src/utils');
const {getCommonCharsCount} = require('../../src/helpers/common-words');

describe('utils', () => {
  describe('isObject', () => {
    it('return true for objects', () => {
      assert.equal(isObject({}), true);
      assert.equal(isObject([]), true);
    });
    it('return false for non objects', () => {
      assert.equal(isObject(42), false);
      assert.equal(isObject('foo'), false);
      assert.equal(isObject(null), false);
      assert.equal(isObject(undefined), false);
    });
  });

  describe('getCommonCharsCount', () => {
    it('simple letters', () => {
      assert.equal(getCommonCharsCount('привет', 'пример'), 3);
    });

    it('emoji with common prefix', () => {
      // '\uD83C\uDF1F', '\uD83C\uDFAF'
      assert.equal(getCommonCharsCount('привет🎯', 'привет🌟'), 6);
    });
  });


});
