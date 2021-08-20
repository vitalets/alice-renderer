/**
 * br:
 * - newlines in text
 * - space in tts
 */
import {textTts} from './text-tts';
import {Response} from "./reply";

export const br = (n = 1): Pick<Response, 'tts'> => textTts('\n'.repeat(n), ' ');
