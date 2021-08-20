import {assert} from 'chai';
import * as sinon from 'sinon';

import {reply, textTts} from '../../src';

afterEach(async () => {
  sinon.restore();
});
describe('text-tts', () => {
  it('regular usage', () => {
    const res = reply`Как дела? ${textTts('Зд+орово', 'Шикарно')}!`;
    assert.equal(res.text, 'Как дела? Здорово!');
    assert.equal(res.tts, 'Как дела? Шикарно!');
  });

  it('empty values', () => {
    const res = reply`Как дела? ${textTts('Зд+орово', '')}!`;
    assert.equal(res.text, 'Как дела? Здорово!');
    assert.equal(res.tts, 'Как дела? !');
  });

  it('single argument', () => {
    const res = reply`Как дела? ${textTts('Зд+орово')}`;
    assert.equal(res.text, 'Как дела? Здорово');
    assert.equal(res.tts, 'Как дела?');
  });

  it('array value', () => {
    sinon.stub(Math, 'random').returns(0.9);
    const res = reply`куку ${textTts(['1', '2', '3'], ['да', 'нет'])}`;
    assert.equal(res.text, 'куку 3');
    assert.equal(res.tts, 'куку нет');
  });
});
