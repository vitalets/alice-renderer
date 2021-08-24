import {assert} from 'chai';

import {getLongWords, getWords, getCommonWordsCount} from '../../src/helpers/common-words';

function shuffleArray<T extends any>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

describe('Common words', () => {
  it('the maximum word length is less than', () => {
    const words: string[] = ['съешь', 'ещё', 'этих', 'мягких', 'французских', 'булок'];
    assert.equal(getCommonWordsCount(shuffleArray(words), shuffleArray(words), 8), 1);
  });


  it('return long words', () => {
    assert.deepEqual(getLongWords('Ела маша уху'), ['маша']);
  });

  it('return worlds', () => {
    assert.deepEqual(getWords('Алиса привет'), ['Алиса', 'привет']);
    assert.deepEqual(getWords(''), []);
  });
});
