
const {configure} = require('../../src');

describe('configure', () => {

  it('throw for unknown option', () => {
    const fn = () => configure({foo: 42});
    assert.throws(fn, /Unknown option: foo/);
  });

});
