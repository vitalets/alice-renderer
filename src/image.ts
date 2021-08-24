/**
 * Insert image (BigImage)
 */
import {truncate} from './utils';

const MAX_TITLE_LENGTH = 128;
const MAX_DESCRIPTION_LENGTH = 256;

// Use symbols to ignore these keys in JSON.stringify
const hasInitialTitle = Symbol('hasInitialTitle');
const hasInitialDescription = Symbol('hasInitialDescription');
const appendDescriptionSymbol = Symbol('appendDescriptionSymbol');

/**
 * Insert image into response.
 * If title and description not defined - response.text is written to title (if length < 128),
 * then to description (if length < 256), then split to both title + description and truncated to 128+256.
 * If title or description is defined - it is not updated by response text.
 *
 * @param {string} imageId
 * @param {?string} [title]
 * @param {?string} [description]
 * @param {?string} [appendDescription] text that will be appended to description field
 * @param {?object} [button]
 * @returns {object}
 */

export interface CardImage {
  type: string,
  image_id: string,
  title?: string,
  description?: string,
  button?: {
    text?: string,
    url?: string,
    payload?: any
  }
}

export const image = (imageId: string, {
    title,
    description,
    appendDescription,
    button
    // eslint-disable-next-line max-len
  }: Partial<Pick<CardImage, 'title' | 'description' | 'button'> & { appendDescription: string }> = {}): { card: CardImage } => {
    const card: Partial<CardImage> = {
      type: 'BigImage',
      image_id: imageId,
    };
    setInitialTitle(card, title);
    setInitialDescription(card, description);
    setAppendDescription(card, appendDescription);
    setButton(card, button);
    return {
      card
    } as { card: CardImage };
  }
;

/**
 * Updates title/description of image from response text.
 * - appends text to title until length < 128
 * - appends text to description until length < 256
 * - appends text to both title + description and truncate length to 128 + 256 (otherwise Alice exits skill)
 *
 * @param {object} card
 * @param {string} text
 */
export const updateImageText = ({card, text}: { card: CardImage, text: string }): void => {
  if (!card || card.type !== 'BigImage' || !text) {
    return;
  }

  const fns = [
    tryUpdateTitle,
    tryUpdateDescription,
    splitToTitleAndDescription,
  ];

  for (const fn of fns) {
    if (fn(card, text)) {
      return;
    }
  }
};

const tryUpdateTitle = (card: CardImage, text): boolean => {
  if (card[hasInitialTitle]) {
    return;
  }

  card.title = truncate(text, MAX_TITLE_LENGTH);

  return text.length <= MAX_TITLE_LENGTH;
};

const tryUpdateDescription = (card: CardImage, text: string): boolean | number => {
  if (card[hasInitialDescription]) {
    return;
  }

  // if title overfilled - clear it and move everything to description
  if (!card[hasInitialTitle]) {
    card.title = '';
  }

  const fullText = getFullText(card, text);
  card.description = truncate(fullText, MAX_DESCRIPTION_LENGTH);

  return fullText.length <= MAX_DESCRIPTION_LENGTH;
};

const splitToTitleAndDescription = (card: CardImage, text: string): boolean | void => {
  if (card[hasInitialTitle] || card[hasInitialDescription]) {
    return;
  }
  const fullText = getFullText(card, text);
  const titleMaxChunk = fullText.substr(0, MAX_TITLE_LENGTH);
  const lastSentenceStartIndex = findLastSentenceStartIndex(titleMaxChunk);
  const titleChunkLength = lastSentenceStartIndex ? lastSentenceStartIndex - 1 : 0;
  card.title = fullText.substr(0, titleChunkLength).trim();
  card.description = truncate(fullText.substr(titleChunkLength), MAX_DESCRIPTION_LENGTH);
};

const findLastSentenceStartIndex = str => {
  const strReversed = str.split('').reverse().join('');
  const matches = strReversed.match(/[А-ЯЁ]\s+/);
  return matches ? str.length - matches.index : 0;
};

/**
 * Returns full text for image concerning appendDescription property
 */
const getFullText = (card, text) => {
  return card[appendDescriptionSymbol]
    ? `${text} ${card[appendDescriptionSymbol]}`.trim()
    : text;
};

const setInitialTitle = (card, title) => {
  if (title !== undefined && title !== null) {
    card.title = truncate(title, MAX_TITLE_LENGTH);
    card[hasInitialTitle] = true;
  }
};

const setInitialDescription = (card, description) => {
  if (description !== undefined && description !== null) {
    card.description = truncate(description, MAX_DESCRIPTION_LENGTH);
    card[hasInitialDescription] = true;
  }
};

const setAppendDescription = (card, appendDescription) => {
  // todo: warn if there are both description and appendDescription
  if (appendDescription !== undefined && appendDescription !== null && !card[hasInitialDescription]) {
    card.description = truncate(appendDescription, MAX_DESCRIPTION_LENGTH);
    card[appendDescriptionSymbol] = card.description;
  }
};

const setButton = (card, button) => {
  if (button) {
    card.button = button;
  }
};
