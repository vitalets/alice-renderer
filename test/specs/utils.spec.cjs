require = require('esm')(module);

const {isObject} = require('../../src/utils');

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
});
