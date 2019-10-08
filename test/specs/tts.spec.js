
const {reply, tts, audio, effect, pause} = require('../../src');

describe('tts', () => {
  it('tts in reply', () => {
    const res = reply`Как дела? ${tts('Зд+орово')}`;
    assert.equal(res.text, 'Как дела?');
    assert.equal(res.tts, 'Как дела? Зд+орово');
  });

  it('audio', () => {
    const res = reply`${audio('sounds-game-win-1')} Привет`;
    assert.equal(res.text, 'Привет');
    assert.equal(res.tts, '<speaker audio="alice-sounds-game-win-1.opus"> Привет');
  });

  it('effect', () => {
    const res = reply`${effect('hamster')} Привет`;
    assert.equal(res.text, 'Привет');
    assert.equal(res.tts, '<speaker effect="hamster"> Привет');
  });

  it('pause', () => {
    const res = reply`${pause()} Привет ${pause(200)}`;
    assert.equal(res.text, 'Привет');
    assert.equal(res.tts, 'sil <[500]> Привет sil <[200]>');
  });

  it('falsy values', () => {
    const res = reply`
      п${tts(false)}р${tts(null)}и${tts(undefined)}в${tts(0)}е${tts(NaN)}т
    `;
    assert.equal(res.text, 'привет');
    assert.equal(res.tts, 'прив0ет');
  });

  it('array value', () => {
    sinon.stub(Math, 'random').returns(0.9);
    const res = reply`куку ${tts(['1', '2', '3'])}`;
    assert.equal(res.text, 'куку');
    assert.equal(res.tts, 'куку 3');
  });
});
