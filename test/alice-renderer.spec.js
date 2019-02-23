
const {reply, audio, pause, buttons, br, text, tts} = require('../src/alice-renderer');

describe('alice-renderer', () => {
  it('reply: all features together', () => {
    sinon.stub(Math, 'random').returns(0.9);
    const res = reply`
      ${audio('sounds-game-win-1')} ${['Привет', 'Здор+ово']}! ${pause(500)} Как твои дел+а?
      ${buttons(['Отлично', 'Супер'])}
    `;

    assert.deepEqual(res,  {
      text: 'Здорово! Как твои дела?',
      tts: '<speaker audio="alice-sounds-game-win-1.opus"> Здор+ово! - - - - - - - Как твои дел+а?',
      buttons: [
        {title: 'Отлично', hide: true},
        {title: 'Супер', hide: true},
      ],
      end_session: false,
    });
  });

  it('reply with string arg', () => {
    const res = reply`Привет ${null}!`;
    assert.deepEqual(res,  {
      text: 'Привет !',
      tts: 'Привет !',
      end_session: false,
    });
  });

  it('reply nested', () => {
    const res1 = reply`Прив+ет!\n`;
    const res2 = reply`${res1} Как дел+а?`;
    assert.deepEqual(res2,  {
      text: 'Привет! Как дела?',
      tts: 'Прив+ет! Как дел+а?',
      end_session: false,
    });
  });

  it('reply: spaces', () => {
    const res = reply`Привет! :)`;
    assert.deepEqual(res,  {
      text: 'Привет! :)',
      tts: 'Привет! :)',
      end_session: false,
    });
  });

  it('reply: newlines', () => {
    const res = reply`
      Привет! ${br()} Как жизнь? :)
      Как  \nдела?
    `;
    assert.equal(res.text, 'Привет!\nКак жизнь? :) Как дела?');
    assert.equal(res.tts, 'Привет! Как жизнь? :) Как дела?');
  });

  it('reply: falsy values', () => {
    const res = reply`
      п${false}р${null}и${undefined}в${0}е${NaN}т
      п${text(false)}р${text(null)}и${text(undefined)}в${text(0)}е${text(NaN)}т
      п${tts(false)}р${tts(null)}и${tts(undefined)}в${tts(0)}е${tts(NaN)}т
    `;
    assert.equal(res.text, 'прив0ет прив0ет привет');
    assert.equal(res.tts, 'прив0ет привет прив0ет');
  });

  it('buttons', () => {
    const res = buttons(['Отлично', 'Супер']);
    assert.deepEqual(res,  {
      buttons: [
        {title: 'Отлично', hide: true},
        {title: 'Супер', hide: true},
      ]
    });
  });

  it('buttons in reply', () => {
    const res = reply`${buttons(['Отлично', 'Супер'])}`;
    assert.deepEqual(res,  {
      text: '',
      tts: '',
      buttons: [
        {title: 'Отлично', hide: true},
        {title: 'Супер', hide: true},
      ],
      end_session: false,
    });
  });


  it('pause', () => {
    const res = reply`ф${pause(200)}ы${pause()}`;
    assert.equal(res.text, 'прив0ет прив0ет привет');
    assert.equal(res.tts, 'прив0ет привет прив0ет');
  });

});
