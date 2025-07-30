import { type JsonText } from '../ast/TextNodes.ts';
import type { ConfigKeyType } from '../config/enum/ConfigKey.ts';
import type { ResourceTypeType } from '../enum/ResourceType.ts';

export type ResourceDataJson = ImageResourceJson &
  ImageResponsiveResourceJson &
  ImageLinkResourceJson &
  AudioResourceJson &
  AudioEmbedResourceJson &
  AudioLinkResourceJson &
  VideoResourceJson &
  VideoEmbedResourceJson &
  VideoLinkResourceJson &
  StillImageFilmResourceJson &
  StillImageFilmEmbedResourceJson &
  StillImageFilmLinkResourceJson &
  ArticleResourceJson &
  DocumentResourceJson &
  DocumentEmbedResourceJson &
  DocumentLinkResourceJson &
  DocumentDownloadResourceJson &
  AppLinkResourceJson &
  WebsiteLinkResourceJson;

export type ResourceJson =
  | ImageResourceWrapperJson
  | ImageResponsiveResourceWrapperJson
  | ImageLinkResourceWrapperJson
  | AudioResourceWrapperJson
  | AudioEmbedResourceWrapperJson
  | AudioLinkResourceWrapperJson
  | VideoResourceWrapperJson
  | VideoEmbedResourceWrapperJson
  | VideoLinkResourceWrapperJson
  | StillImageFilmResourceWrapperJson
  | StillImageFilmEmbedResourceWrapperJson
  | StillImageFilmLinkResourceWrapperJson
  | ArticleResourceWrapperJson
  | DocumentResourceWrapperJson
  | DocumentEmbedResourceWrapperJson
  | DocumentLinkResourceWrapperJson
  | DocumentDownloadResourceWrapperJson
  | AppLinkResourceWrapperJson
  | WebsiteLinkResourceWrapperJson;

export interface ResourceWrapperJson {
  type: ResourceTypeType; // resource bit type
  __typeAlias: ResourceTypeType;
  __configKey: ConfigKeyType;
  __invalid?: boolean; // true if the resource is invalid
}

export interface ImageResourceWrapperJson extends ResourceWrapperJson {
  type: 'image'; // resource type
  image: ImageResourceJson;
}

export interface ImageResponsiveResourceWrapperJson extends ResourceWrapperJson {
  type: 'image-responsive'; // resource type
  imagePortrait: ImageResourceJson;
  imageLandscape: ImageResourceJson;
}

export interface ImageLinkResourceWrapperJson extends ResourceWrapperJson {
  type: 'image-link'; // resource type
  imageLink: ImageLinkResourceJson;
}

export interface AudioResourceWrapperJson extends ResourceWrapperJson {
  type: 'audio'; // resource type
  audio: AudioResourceJson;
}

export interface AudioEmbedResourceWrapperJson extends ResourceWrapperJson {
  type: 'audio-embed'; // resource type
  audioEmbed: AudioEmbedResourceJson;
}

export interface AudioLinkResourceWrapperJson extends ResourceWrapperJson {
  type: 'audio-link'; // resource type

  audioLink: AudioLinkResourceJson;
}

export interface VideoResourceWrapperJson extends ResourceWrapperJson {
  type: 'video'; // resource type
  video: VideoResourceJson;
}

export interface VideoEmbedResourceWrapperJson extends ResourceWrapperJson {
  type: 'video-embed'; // resource type
  videoEmbed: VideoEmbedResourceJson;
}

export interface VideoLinkResourceWrapperJson extends ResourceWrapperJson {
  type: 'video-link'; // resource type
  videoLink: VideoLinkResourceJson;
}

export interface StillImageFilmResourceWrapperJson extends ResourceWrapperJson {
  type: 'still-image-film'; // resource type
  image: ImageResourceJson;
  audio: AudioResourceJson;
}

export interface StillImageFilmEmbedResourceWrapperJson extends ResourceWrapperJson {
  type: 'still-image-film-embed'; // resource type
  stillImageFilmEmbed: StillImageFilmEmbedResourceJson;
}

export interface StillImageFilmLinkResourceWrapperJson extends ResourceWrapperJson {
  type: 'still-image-film-link'; // resource type
  stillImageFilmLink: StillImageFilmLinkResourceJson;
}

export interface ArticleResourceWrapperJson extends ResourceWrapperJson {
  type: 'article'; // resource type
  article: ArticleResourceJson;
}

// Deprecated ??
export interface DocumentResourceWrapperJson extends ResourceWrapperJson {
  type: 'document'; // resource type
  document: DocumentResourceJson;
}

export interface DocumentEmbedResourceWrapperJson extends ResourceWrapperJson {
  type: 'document-embed'; // resource type
  documentEmbed: DocumentEmbedResourceJson;
}

export interface DocumentLinkResourceWrapperJson extends ResourceWrapperJson {
  type: 'document-link'; // resource type
  documentLink: DocumentLinkResourceJson;
}

export interface DocumentDownloadResourceWrapperJson extends ResourceWrapperJson {
  type: 'document-download'; // resource type
  documentDownload: DocumentDownloadResourceJson;
}

export interface AppLinkResourceWrapperJson extends ResourceWrapperJson {
  type: 'app-link'; // resource type
  appLink: AppLinkResourceJson;
  // private:{}
}

export interface WebsiteLinkResourceWrapperJson extends ResourceWrapperJson {
  type: 'website-link'; // resource type
  websiteLink: WebsiteLinkResourceJson;
}

export interface BaseResourceJson {
  license: string;
  copyright: string;
  provider: string;
  showInIndex: boolean;
  caption: JsonText;
  search: string;
}

export interface ImageResourceJson extends BaseResourceJson {
  format: string;
  // url: string;
  src: string;
  src1x: string;
  src2x: string;
  src3x: string;
  src4x: string;
  width: string | null;
  height: string | null;
  alt: string;
  zoomDisabled: boolean;
}

export interface ImageLinkResourceJson extends BaseResourceJson {
  format: string;
  url: string;
  // src: string;
  src1x: string;
  src2x: string;
  src3x: string;
  src4x: string;
  width: string | null;
  height: string | null;
  alt: string;
  zoomDisabled: boolean;
}

export interface ImageResponsiveResourceJson extends BaseResourceJson {
  imagePortrait: ImageResourceJson;
  imageLandscape: ImageResourceJson;
}

export interface AudioResourceJson extends BaseResourceJson {
  format: string;
  // url: string;
  src: string;
  duration: number; // string?
  mute: boolean;
  autoplay: boolean;
}

export interface AudioEmbedResourceJson extends BaseResourceJson {
  format: string;
  // url: string;
  src: string;
  duration: number; // string?
  mute: boolean;
  autoplay: boolean;
}

export interface AudioLinkResourceJson extends BaseResourceJson {
  format: string;
  url: string;
  // src: string;
  duration: number; // string?
  mute: boolean;
  autoplay: boolean;
}

export interface VideoResourceJson extends BaseResourceJson {
  format: string;
  // url: string;
  src: string;
  width: string | null;
  height: string | null;
  duration: number; // string?
  mute: boolean;
  autoplay: boolean;
  allowSubtitles: boolean;
  showSubtitles: boolean;
  alt: string;
  posterImage: ImageResourceJson;
  thumbnails: ImageResourceJson[];
}

export interface VideoEmbedResourceJson extends BaseResourceJson {
  format: string;
  url: string;
  // src: string;
  width: string | null;
  height: string | null;
  duration: number; // string?
  mute: boolean;
  autoplay: boolean;
  allowSubtitles: boolean;
  showSubtitles: boolean;
  alt: string;
  posterImage: ImageResourceJson;
  thumbnails: ImageResourceJson[];
}

export interface VideoLinkResourceJson extends BaseResourceJson {
  format: string;
  url: string;
  // src: string;
  width: string | null;
  height: string | null;
  duration: number; // string?
  mute: boolean;
  autoplay: boolean;
  allowSubtitles: boolean;
  showSubtitles: boolean;
  alt: string;
  posterImage: ImageResourceJson;
  thumbnails: ImageResourceJson[];
}

export interface StillImageFilmResourceJson extends BaseResourceJson {
  image: ImageResourceJson;
  audio: AudioResourceJson;
}

export interface StillImageFilmEmbedResourceJson extends BaseResourceJson {
  format: string;
  url: string;
  // src: string;
  width: string | null;
  height: string | null;
  duration: number; // string?
  mute: boolean;
  autoplay: boolean;
  allowSubtitles: boolean;
  showSubtitles: boolean;
  alt: string;
  posterImage: ImageResourceJson;
  thumbnails: ImageResourceJson[];
}

export interface StillImageFilmLinkResourceJson extends BaseResourceJson {
  format: string;
  url: string;
  // src: string;
  width: string | null;
  height: string | null;
  duration: number; // string?
  mute: boolean;
  autoplay: boolean;
  allowSubtitles: boolean;
  showSubtitles: boolean;
  alt: string;
  posterImage: ImageResourceJson;
  thumbnails: ImageResourceJson[];
}

export interface ArticleResourceJson extends BaseResourceJson {
  format: string;
  // url: string;
  // href: string;
  body: string;
}

export interface DocumentResourceJson extends BaseResourceJson {
  format: string;
  url: string;
  // href: string;
  // body: string;
}

export interface DocumentEmbedResourceJson extends BaseResourceJson {
  format: string;
  url: string;
  // href: string;
  // body: string;
}

export interface DocumentLinkResourceJson extends BaseResourceJson {
  format: string;
  url: string;
  // href: string;
  // body: string;
}

export interface DocumentDownloadResourceJson extends BaseResourceJson {
  format: string;
  url: string;
  // href: string;
  // body: string;
}

export interface AppLinkResourceJson extends BaseResourceJson {
  // app: string;
  url: string;
}

export interface WebsiteLinkResourceJson extends BaseResourceJson {
  url: string;
  // siteName: string;
}
