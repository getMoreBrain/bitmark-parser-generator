export type ResourceDataJson = ImageResourceJson &
  ImageLinkResourceJson &
  AudioResourceJson &
  AudioLinkResourceJson &
  VideoResourceJson &
  VideoLinkResourceJson &
  StillImageFilmResourceJson &
  StillImageFilmLinkResourceJson &
  ArticleResourceJson &
  ArticleLinkResourceJson &
  DocumentResourceJson &
  DocumentLinkResourceJson &
  // AppResourceJson &
  AppLinkResourceJson &
  WebsiteLinkResourceJson;

export type ResourceJson =
  | ImageResourceWrapperJson
  | ImageLinkResourceWrapperJson
  | AudioResourceWrapperJson
  | AudioLinkResourceWrapperJson
  | VideoResourceWrapperJson
  | VideoLinkResourceWrapperJson
  | StillImageFilmResourceWrapperJson
  | StillImageFilmLinkResourceWrapperJson
  | ArticleResourceWrapperJson
  | ArticleLinkResourceWrapperJson
  | DocumentResourceWrapperJson
  | DocumentLinkResourceWrapperJson
  | AppResourceWrapperJson
  | AppLinkResourceWrapperJson
  | WebsiteLinkResourceWrapperJson;

export interface ResourceWrapperJson {
  type: string; // resource bit type
}

export interface ImageResourceWrapperJson extends ResourceWrapperJson {
  type: 'image'; // resource type
  image: ImageResourceJson;
}
export interface ImageLinkResourceWrapperJson extends ResourceWrapperJson {
  type: 'image-link'; // resource type
  imageLink: ImageLinkResourceJson;
}

export interface AudioResourceWrapperJson extends ResourceWrapperJson {
  type: 'audio'; // resource type
  audio: AudioResourceJson;
}

export interface AudioLinkResourceWrapperJson extends ResourceWrapperJson {
  type: 'audio-link'; // resource type
  audioLink: AudioLinkResourceJson;
}

export interface VideoResourceWrapperJson extends ResourceWrapperJson {
  type: 'video'; // resource type
  video: VideoResourceJson;
}

export interface VideoLinkResourceWrapperJson extends ResourceWrapperJson {
  type: 'video-link'; // resource type
  videoLink: VideoLinkResourceJson;
}

export interface StillImageFilmResourceWrapperJson extends ResourceWrapperJson {
  type: 'still-image-film'; // resource type
  stillImageFilm: StillImageFilmResourceJson;
}

export interface StillImageFilmLinkResourceWrapperJson extends ResourceWrapperJson {
  type: 'still-image-film-link'; // resource type
  stillImageFilmLink: StillImageFilmLinkResourceJson;
}

export interface ArticleResourceWrapperJson extends ResourceWrapperJson {
  type: 'article'; // resource type
  article: ArticleResourceJson;
}

export interface ArticleLinkResourceWrapperJson extends ResourceWrapperJson {
  type: 'article-link'; // resource type
  articleLink: ArticleLinkResourceJson;
}

// Deprecated ??
export interface DocumentResourceWrapperJson extends ResourceWrapperJson {
  type: 'document'; // resource type
  document: DocumentResourceJson;
}

export interface DocumentLinkResourceWrapperJson extends ResourceWrapperJson {
  type: 'document-link'; // resource type
  documentLink: DocumentLinkResourceJson;
}

export interface AppResourceWrapperJson extends ResourceWrapperJson {
  type: 'app'; // resource type
  app: AppResourceJson;
  // private:{}
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
}

export interface LinkResourceJson extends BaseResourceJson {
  url: string;
}

export interface ImageLikeResourceJson extends BaseResourceJson {
  format: string;
  url: string;
  src: string;
  src1x: string;
  src2x: string;
  src3x: string;
  src4x: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
}

export interface AudioLikeResourceJson extends BaseResourceJson {
  format: string;
  url: string;
  src: string;
}

export interface VideoLikeResourceJson extends BaseResourceJson {
  format: string;
  url: string;
  src: string;
  width: number;
  height: number;
  duration: number; // string?
  mute: boolean;
  autoplay: boolean;
  allowSubtitles: boolean;
  showSubtitles: boolean;
  alt: string;
  posterImage: ImageResourceJson;
  thumbnails: ImageResourceJson[];
}

export interface ArticleLikeResourceJson extends BaseResourceJson {
  format: string;
  url: string;
  href: string;
  body: string;
}

export interface AppLikeResourceJson extends BaseResourceJson {
  app: string;
  url: string;
}

export interface ImageResourceJson extends ImageLikeResourceJson {
  //
}

export interface ImageLinkResourceJson extends LinkResourceJson, ImageLikeResourceJson {
  url: string;
}

export interface AudioResourceJson extends AudioLikeResourceJson {
  src: string;
}

export interface AudioLinkResourceJson extends LinkResourceJson, AudioLikeResourceJson {
  url: string;
}

export interface VideoResourceJson extends VideoLikeResourceJson {
  //
}

export interface VideoLinkResourceJson extends LinkResourceJson, VideoLikeResourceJson {
  url: string;
}

export interface StillImageFilmResourceJson extends VideoLikeResourceJson {
  //
}

export interface StillImageFilmLinkResourceJson extends LinkResourceJson, VideoLikeResourceJson {
  url: string;
}

export interface ArticleResourceJson extends ArticleLikeResourceJson {
  //
}

export interface ArticleLinkResourceJson extends LinkResourceJson, ArticleLikeResourceJson {
  url: string;
}

export interface DocumentResourceJson extends ArticleLikeResourceJson {
  //
}

export interface DocumentLinkResourceJson extends LinkResourceJson, ArticleLikeResourceJson {
  url: string;
}

export type AppResourceJson = string;

export interface AppLinkResourceJson extends LinkResourceJson, AppLikeResourceJson {
  url: string;
}

export interface WebsiteLinkResourceJson extends BaseResourceJson {
  siteName: string;
}
