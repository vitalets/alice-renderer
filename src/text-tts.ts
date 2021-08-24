/**
 * Puts first argument to `text` and second argument to `tts`.
 */

import {text} from './text';
import {tts} from './tts';
import {Response} from './reply';

export const textTts = (textValue: string | string[], ttsValue?: string | string[]): Pick<Response, 'text' | 'tts'> => {
  return {
    ...text(textValue),
    ...tts(ttsValue),
  };
};
