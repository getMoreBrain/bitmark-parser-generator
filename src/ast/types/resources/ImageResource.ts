import { ImageResourceFormatType } from './ImageResourceFormat';

export interface ImageResource {
  format: ImageResourceFormatType;
  src: string;
  src2x?: string;
  width?: string;
  height?: string;
  alt?: string;
  caption?: string;
  license?: string;
  copyright?: string;
  showInIndex?: boolean;
}
