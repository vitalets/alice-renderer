/**
 * br:
 * - newlines in text
 * - space in tts
 */
import {textTts} from './text-tts';

export const br = (n = 1) => textTts('\n'.repeat(n), ' ');
