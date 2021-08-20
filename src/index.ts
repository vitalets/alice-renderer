/**
 * Alice renderer module.
 */

import {reply} from './reply';
import {text} from './text';
import {br} from './br';
import {tts, audio, effect, pause} from './tts';
import {textTts} from './text-tts';
import {buttons} from './buttons';
import {plural} from './plural';
import {userify} from './userify';
import {select} from './select';
import {once} from './once';
import {configure} from './configure';
import {image} from './image';
import {enumerate} from './enumerate';
import {startCleanupService, getSessions} from './sessions';

export {reply} from './reply';
export {text} from './text';
export {tts, audio, effect, pause} from './tts';
export {textTts} from './text-tts';
export {buttons} from './buttons';
export {br} from './br';
export {plural} from './plural';
export {userify} from './userify';
export {select} from './select';
export {once} from './once';
export {configure} from './configure';
export {image} from './image';
export {enumerate} from './enumerate';
export {getSessions} from './sessions';

startCleanupService();

export default {
  reply,
  text,
  br,
  tts,
  audio,
  effect,
  pause,
  textTts,
  buttons,
  plural,
  userify,
  select,
  once,
  configure,
  image,
  enumerate,
  getSessions,
};
