/**
 * Detecting common words in strings.
 * Used in select().
 */

const getCommonWordsCount = (words1, words2, charsLimit = 4) => {
  let count = 0;
  for (const word1 of words1) {
    for (const word2 of words2) {
      const commonCharsCount = getCommonCharsCount(word1, word2);
      if (commonCharsCount >= charsLimit) count++; // eslint-disable-line max-depth
    }
  }
  return count;
};

const getCommonCharsCount = (word1, word2) => {
  // see: https://mathiasbynens.be/notes/javascript-unicode#accounting-for-astral-symbols
  const codePoints1 = Array.from(word1 || '');
  const codePoints2 = Array.from(word2 || '');
  const l = Math.min(codePoints1.length, codePoints2.length);
  let i = 0;
  while (i < l && codePoints1[i] === codePoints2[i]) i++;
  return i;
};

const getWords = str => str.match(/[а-яё]+/ig) || [];
const getLongWords = str => getWords(str).filter(word => word.length >= 4);

module.exports = {
  getCommonWordsCount,
  getCommonCharsCount,
  getLongWords,
};
