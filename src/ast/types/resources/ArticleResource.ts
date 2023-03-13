import { ImageResourceFormatType } from './ImageResourceFormat';

export interface ArticleResource {
  src: string;
  format: ImageResourceFormatType;
  width?: string;
  height?: string;
  alt?: string;
  caption?: string;
  license?: string;
  copyright?: string;
  showInIndex?: boolean;
}
