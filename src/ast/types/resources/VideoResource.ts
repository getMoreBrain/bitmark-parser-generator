import { ImageResourceFormatType } from './ImageResourceFormat';
import { VideoResourceFormatType } from './VideoResourceFormat';

export interface VideoResource {
  format: VideoResourceFormatType;
  src: string;
  width?: string;
  height?: string;
  duration?: string;
  mute?: boolean;
  autoplay?: boolean;
  allowSubtitles?: boolean;
  showSubtitles?: boolean;
  alt?: string;
  caption?: string;
  license?: string;
  copyright?: string;
  posterImage?: {
    src: string;
    format?: ImageResourceFormatType;
    width?: string;
    height?: string;
  };
  showInIndex?: boolean;
}
