/**
 * Puts first argument to `text` and second argument to `tts`.
 */

import {text} from './text';
import {tts} from './tts';

export const textTts = (textValue, ttsValue) => {
  return {
    ...text(textValue),
    ...tts(ttsValue),
  };
};
