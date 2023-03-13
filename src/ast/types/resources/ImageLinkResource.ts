import { ImageResourceFormatType } from './ImageResourceFormat';

export interface ImageLinkResource {
  format: ImageResourceFormatType;
  url: string;
  src2x?: string;
  // width?: string;
  // height?: string;
  // alt?: string;
  // caption?: string;
  // license?: string;
  // copyright?: string;
  provider?: string;
  // showInIndex?: boolean;
}
