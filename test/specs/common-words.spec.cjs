require = require('esm')(module);

const {getLongWords, getWords} = require('../../src/helpers/common-words');

describe('Common words', () => {

  it('return long words', () => {
    assert.deepEqual(getLongWords('Ела маша уху'), ['маша']);
  });

  it('return worlds', () => {
    assert.deepEqual(getWords('Алиса привет'), ['Алиса', 'привет']);
    assert.deepEqual(getWords(''), []);
  });
});
