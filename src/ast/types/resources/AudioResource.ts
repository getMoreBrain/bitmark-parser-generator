import { AudioResourceFormatType } from './AudioResourceFormat';

export interface AudioResource {
  src: string;
  format: AudioResourceFormatType;
  width?: string;
  height?: string;
  alt?: string;
  caption?: string;
  license?: string;
  copyright?: string;
  showInIndex?: boolean;
}
