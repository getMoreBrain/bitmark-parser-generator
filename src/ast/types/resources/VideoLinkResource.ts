import { ImageResource } from './ImageResource';
import { VideoResourceFormatType } from './VideoResourceFormat';

export interface VideoLinkResource {
  format: VideoResourceFormatType;
  src: string;
  provider?: string;
  width?: string;
  height?: string;
  duration?: string;
  thumbnails?: ImageResource[];
  // alt?: string;
  // caption?: string;
  // license?: string;
  // copyright?: string;
  // showInIndex?: boolean;
}
