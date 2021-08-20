import {assert} from 'chai';

import {configure, config} from '../../src/configure';

describe('configure', () => {

  it('configure empty option', () => {
    // @ts-ignore
    configure();
    assert.deepEqual(config, {
      disableRandom: false
    });
  });

  it('throw for unknown option', () => {
    const fn = () => configure({foo: 42});
    assert.throws(fn, /Unknown option: foo/);
  });


});
