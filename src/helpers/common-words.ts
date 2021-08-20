/**
 * Detecting common words in strings.
 * Used in select().
 */

export const getCommonWordsCount = (words1: string[], words2: string[], charsLimit = 4): number => {
  let count = 0;
  for (const word1 of words1) {
    for (const word2 of words2) {
      const commonCharsCount = getCommonCharsCount(word1, word2);
      if (commonCharsCount >= charsLimit) count++; // eslint-disable-line max-depth
    }
  }
  return count;
};

const getCommonCharsCount = (word1: string, word2: string): number => {
  const l = Math.min(word1.length, word2.length);
  let i = 0;
  while (i < l && word1.charAt(i) === word2.charAt(i)) i++;
  return i;
};

export const getWords = (str: string): string[] => str.match(/[а-яё]+/ig) || [];
export const getLongWords = (str: string): string[] => getWords(str).filter(word => word.length >= 4);
