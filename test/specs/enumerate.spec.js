const { enumerate } = require('../../');

describe('enumerate', () => {

  it('throws for non array', () => {
    assert.throws(() => enumerate(), /You should pass array in enumerate/);
    assert.throws(() => enumerate('string'), /You should pass array in enumerate/);
    assert.throws(() => enumerate(null), /You should pass array in enumerate/);
  });

  it('0 elements', () => assert.equal(enumerate([]), ''));
  it('1 element', () => assert.equal(enumerate([ 'foo' ]), 'foo'));
  it('2 elements', () => assert.equal(enumerate([ 'foo', 'bar' ]), 'foo или bar'));
  it('3 elements', () => assert.equal(enumerate([ 'foo', 'bar', 'baz' ]), 'foo, bar или baz'));

  it('filter falsy elements', () => {
    const res = enumerate([ undefined, 'foo', false, 'bar', null, 'baz' ]);
    assert.equal(res, 'foo, bar или baz');
  });

  it('custom separators', () => {
    const res = enumerate([ 'foo', 'bar', 'baz' ], { separator: ' или ', lastSeparator: ', а также ' });
    assert.equal(res, 'foo или bar, а также baz');
  });
});
