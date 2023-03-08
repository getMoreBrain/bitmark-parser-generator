import { ImageResourceFormatType } from '../types/ImageResourceFormat';

import { ResourceJson } from './ResourceJson';

export interface ImageResourceJson extends ResourceJson {
  type: 'image';
  src: string;
  format: ImageResourceFormatType;
  width?: string | null; //??
  height?: string | null; //??
  alt?: string;
  caption?: string;
  license?: string;
  copyright?: string;
}
