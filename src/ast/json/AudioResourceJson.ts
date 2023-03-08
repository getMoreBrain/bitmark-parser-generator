import { AudioResourceFormatType } from '../types/AudioResourceFormat';

import { ResourceJson } from './ResourceJson';

export interface AudioResourceJson extends ResourceJson {
  type: 'audio';
  src: string;
  format: AudioResourceFormatType;
}
