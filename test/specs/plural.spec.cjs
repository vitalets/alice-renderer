require = require('esm')(module);

const {reply, plural} = require('../../src');

describe('plural', () => {

  describe('three variants', () => {
    const getPlural = count => plural(count, '$1 ответ', '$2 ответа', '$5 ответов');

    it('0', () => assert.equal(getPlural(0), '0 ответов'));
    it('1', () => assert.equal(getPlural(1), '1 ответ'));
    it('2', () => assert.equal(getPlural(2), '2 ответа'));
    it('5', () => assert.equal(getPlural(5), '5 ответов'));
    it('10', () => assert.equal(getPlural(10), '10 ответов'));
    it('11', () => assert.equal(getPlural(11), '11 ответов'));
    it('12', () => assert.equal(getPlural(12), '12 ответов'));
    it('15', () => assert.equal(getPlural(15), '15 ответов'));
    it('21', () => assert.equal(getPlural(21), '21 ответ'));
    it('24', () => assert.equal(getPlural(24), '24 ответа'));
    it('25', () => assert.equal(getPlural(25), '25 ответов'));
    it('100', () => assert.equal(getPlural(100), '100 ответов'));
    it('101', () => assert.equal(getPlural(101), '101 ответ'));
    it('111', () => assert.equal(getPlural(111), '111 ответов'));
    it('-1', () => assert.equal(getPlural(-1), '-1 ответ'));
    it('-2', () => assert.equal(getPlural(-2), '-2 ответа'));
    it('1.5', () => assert.equal(getPlural(1.5), '1.5 ответа'));
    it('NaN', () => assert.equal(getPlural(NaN), 'NaN ответов'));
    it('null', () => assert.equal(getPlural(null), 'null ответов'));
    it('undefined', () => assert.equal(getPlural(undefined), 'undefined ответов'));
  });

  describe('two variants', () => {
    const getPlural = count => plural(count, 'ответ', 'ответы');

    it('0', () => assert.equal(getPlural(0), 'ответы'));
    it('1', () => assert.equal(getPlural(1), 'ответ'));
    it('2', () => assert.equal(getPlural(2), 'ответы'));
    it('-1', () => assert.equal(getPlural(-1), 'ответ'));
    it('-2', () => assert.equal(getPlural(-2), 'ответы'));
    it('1.5', () => assert.equal(getPlural(1.5), 'ответы'));
    it('NaN', () => assert.equal(getPlural(NaN), 'ответы'));
    it('null', () => assert.equal(getPlural(null), 'ответы'));
    it('undefined', () => assert.equal(getPlural(undefined), 'ответы'));
  });

  it('with reply', () => {
    const res = reply`
      ${plural(2, 'доб+авлен $1 бонус', 'доб+авлено $2 бонуса', 'доб+авлено $5 бонусов')}
    `;
    assert.deepEqual(res, {
      text: 'добавлено 2 бонуса',
      tts: 'доб+авлено 2 бонуса',
      end_session: false,
    });
  });

});
