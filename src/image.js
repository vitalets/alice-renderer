/**
 * Insert image (BigImage)
 */
const {truncate} = require('./utils');

const MAX_TITLE_LENGTH = 128;
const MAX_DESCRIPTION_LENGTH = 256;

// Use symbol to ignore these keys in JSON.stringify
const hasOriginalTitle = Symbol('hasOriginalTitle');
const hasOriginalDescription = Symbol('hasOriginalDescription');

/**
 * Insert image into response.
 * If title and description not defined - response.text is written to title (if length < 128),
 * then to description (if length < 256), then split to both title + description and truncated to 128+256.
 * If title or description is defined - it is not updated by response text.
 *
 * @param {string} imageId
 * @param {?string} [title]
 * @param {?string} [description]
 * @param {?object} [button]
 * @returns {object}
 */
const image = (imageId, {title, description, button} = {}) => {
  const card = {
    type: 'BigImage',
    image_id: imageId,
  };
  if (title !== undefined && title !== null) {
    card.title = truncate(title, MAX_TITLE_LENGTH);
    card[hasOriginalTitle] = true;
  }
  if (description !== undefined && description !== null) {
    card.description = truncate(description, MAX_DESCRIPTION_LENGTH);
    card[hasOriginalDescription] = true;
  }
  if (button) {
    card.button = button;
  }
  return {
    card
  };
};

/**
 * Updates title/description of image from response text.
 * - appends text to title until length < 128
 * - appends text to description until length < 256
 * - appends text to both title + description and truncate length to 128 + 256 (otherwise Alice exits skill)
 *
 * @param {object} card
 * @param {string} text
 */
const updateImageText = ({card, text}) => {
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

const tryUpdateTitle = (card, text) => {
  if (card[hasOriginalTitle]) {
    return;
  }

  card.title = truncate(text, MAX_TITLE_LENGTH);

  return text.length <= MAX_TITLE_LENGTH;
};

const tryUpdateDescription = (card, text) => {
  if (card[hasOriginalDescription]) {
    return;
  }

  if (!card[hasOriginalTitle]) {
    card.title = '';
  }

  card.description = truncate(text, MAX_DESCRIPTION_LENGTH);

  return text.length <= MAX_DESCRIPTION_LENGTH;
};

const splitToTitleAndDescription = (card, text) => {
  if (card[hasOriginalTitle] || card[hasOriginalDescription]) {
    return;
  }

  const titleMaxChunk = text.substr(0, MAX_TITLE_LENGTH);
  const lastSentenceStartIndex = findLastSentenceStartIndex(titleMaxChunk);
  const titleChunkLength = lastSentenceStartIndex ? lastSentenceStartIndex - 1 : 0;
  card.title = text.substr(0, titleChunkLength).trim();
  card.description = truncate(text.substr(titleChunkLength), MAX_DESCRIPTION_LENGTH);
};

const findLastSentenceStartIndex = str => {
  const strReversed = str.split('').reverse().join('');
  const matches = strReversed.match(/[А-ЯЁ]\s+/);
  return matches ? str.length - matches.index : 0;
};

module.exports = {
  image,
  updateImageText,
};
