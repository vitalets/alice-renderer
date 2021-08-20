require = require('esm')(module);

const {configure, config} = require('../../src/configure');

describe('configure', () => {

  it('throw for unknown option', () => {
    const fn = () => configure({foo: 42});
    assert.throws(fn, /Unknown option: foo/);
  });
});
