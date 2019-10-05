
const {reply, audio, pause, buttons, br, text, tts} = require('../../src');

describe('reply', () => {
  it('render string', () => {
    const res = reply`Здор+ово`;
    assert.deepEqual(res,  {
      text: 'Здорово',
      tts: 'Здор+ово',
      end_session: false,
    });
  });

  it('random element from array', () => {
    sinon.stub(Math, 'random').returns(0.9);
    const res = reply`${['Привет', 'Здор+ово']}! Как дел+а?`;
    assert.deepEqual(res,  {
      text: 'Здорово! Как дела?',
      tts: 'Здор+ово! Как дел+а?',
      end_session: false,
    });
  });

  it('nested reply', () => {
    const res1 = reply`Здор+ово!\n`;
    const res2 = reply`${res1} Как дел+а?`;
    assert.deepEqual(res2,  {
      text: 'Здорово! Как дела?',
      tts: 'Здор+ово! Как дел+а?',
      end_session: false,
    });
  });

  it('spaces', () => {
    const res = reply`  Привет
      \n\t
    `;
    assert.equal(res.text, 'Привет');
    assert.equal(res.tts, 'Привет');
  });

  it('falsy values', () => {
    const res = reply`
      п${false}р${null}и${undefined}в${0}е${NaN}т
    `;
    assert.equal(res.text, 'прив0ет');
    assert.equal(res.tts, 'прив0ет');
  });

  it('ignore empty array', () => {
    const res = reply`Привет! ${[]} Как дел+а?`;
    assert.deepEqual(res,  {
      text: 'Привет! Как дела?',
      tts: 'Привет! Как дел+а?',
      end_session: false,
    });
  });

  it('only text', () => {
    const res = reply`${text('Привет')}`;
    assert.deepEqual(res,  {
      text: 'Привет',
      tts: '',
      end_session: false,
    });
  });

  it('all together', () => {
    sinon.stub(Math, 'random').returns(0.9);
    const res = reply`
      ${audio('sounds-game-win-1')} ${['Привет', 'Здор+ово']}! ${pause(500)} ${br()} Как дел+а?
      ${text('Хорошо')}${tts('Супер')}.
      ${buttons(['Отлично', 'Супер'])}
    `;
    assert.deepEqual(res,  {
      text: 'Здорово!\nКак дела? Хорошо.',
      tts: '<speaker audio="alice-sounds-game-win-1.opus"> Здор+ово! - - - - - - - Как дел+а? Супер.',
      buttons: [
        {title: 'Отлично', hide: true},
        {title: 'Супер', hide: true},
      ],
      end_session: false,
    });
  });

  it('end', () => {
    const res = reply.end`Здор+ово`;
    assert.deepEqual(res,  {
      text: 'Здорово',
      tts: 'Здор+ово',
      end_session: true,
    });
  });

  it('empty string', () => {
    const res = reply``;
    assert.deepEqual(res,  {
      text: '',
      tts: '',
      end_session: false,
    });
  });
});
