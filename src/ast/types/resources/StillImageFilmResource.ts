import { VideoResourceFormatType } from './VideoResourceFormat';

export interface StillImageFilmResource {
  src: string;
  format: VideoResourceFormatType;
  width?: string;
  height?: string;
  alt?: string;
  caption?: string;
  license?: string;
  copyright?: string;
  showInIndex?: boolean;
}
