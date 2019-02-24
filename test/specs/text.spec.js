
const {reply, text, br} = require('../../src');

describe('text', () => {
  it('text in reply', () => {
    const res = reply`Как дела? ${text('Зд+орово')}`;
    assert.equal(res.text, 'Как дела? Здорово');
    assert.equal(res.tts, 'Как дела?');
  });

  it('falsy values', () => {
    const res = reply`
      п${text(false)}р${text(null)}и${text(undefined)}в${text(0)}е${text(NaN)}т
    `;
    assert.equal(res.text, 'прив0ет');
    assert.equal(res.tts, 'привет');
  });

  it('array value', () => {
    sinon.stub(Math, 'random').returns(0.9);
    const res = reply`куку ${text(['1', '2', '3'])}`;
    assert.equal(res.text, 'куку 3');
    assert.equal(res.tts, 'куку');
  });

  it('br', () => {
    const res = reply`
      Привет! ${br()} Как ${br(2)}жизнь? :)
      Как  \nдела?
    `;
    assert.equal(res.text, 'Привет!\nКак\n\nжизнь? :) Как дела?');
    assert.equal(res.tts, 'Привет! Как жизнь? :) Как дела?');
  });
});
