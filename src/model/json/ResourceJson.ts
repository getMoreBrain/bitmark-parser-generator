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

export interface ImageEmbedResourceWrapperJson extends ResourceWrapperJson {
  type: 'image-embed'; // resource type
  imageEmbed: ImageLinkResourceJson;
}

export interface AudioResourceWrapperJson extends ResourceWrapperJson {
  type: 'audio'; // resource type
  audio: AudioResourceJson;
}

export interface AudioLinkResourceWrapperJson extends ResourceWrapperJson {
  type: 'audio-link'; // resource type
  audioLink: AudioLinkResourceJson;
}

export interface AudioEmbedResourceWrapperJson extends ResourceWrapperJson {
  type: 'audio-embed'; // resource type
  audioEmbed: AudioLinkResourceJson;
}

export interface VideoResourceWrapperJson extends ResourceWrapperJson {
  type: 'video'; // resource type
  video: VideoResourceJson;
}

export interface VideoLinkResourceWrapperJson extends ResourceWrapperJson {
  type: 'video-link'; // resource type
  videoLink: VideoLinkResourceJson;
}

export interface VideoEmbedResourceWrapperJson extends ResourceWrapperJson {
  type: 'video-embed'; // resource type
  videoEmbed: VideoLinkResourceJson;
}

export interface StillImageFilmResourceWrapperJson extends ResourceWrapperJson {
  type: 'still-image-film'; // resource type
  stillImageFilm: StillImageFilmResourceJson;
}

export interface StillImageFilmLinkResourceWrapperJson extends ResourceWrapperJson {
  type: 'still-image-film-link'; // resource type
  stillImageFilmLink: StillImageFilmLinkResourceJson;
}

export interface StillImageFilmEmbedResourceWrapperJson extends ResourceWrapperJson {
  type: 'still-image-film-embed'; // resource type
  stillImageFilmEmbed: StillImageFilmLinkResourceJson;
}

export interface ArticleResourceWrapperJson extends ResourceWrapperJson {
  type: 'article'; // resource type
  article: ArticleResourceJson;
}

export interface ArticleLinkResourceWrapperJson extends ResourceWrapperJson {
  type: 'article-link'; // resource type
  articleLink: ArticleLinkResourceJson;
}

export interface ArticleEmbedResourceWrapperJson extends ResourceWrapperJson {
  type: 'article-embed'; // resource type
  articleEmbed: ArticleLinkResourceJson;
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

export interface DocumentEmbedResourceWrapperJson extends ResourceWrapperJson {
  type: 'document-embed'; // resource type
  documentEmbed: DocumentLinkResourceJson;
}
export interface DocumentDownloadResourceWrapperJson extends ResourceWrapperJson {
  type: 'document-download'; // resource type
  documentDownload: DocumentDownloadResourceJson;
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
  caption: string;
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
  width: number | null;
  height: number | null;
  alt: string;
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
  width: number | null;
  height: number | null;
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
  duration: string; // Has a default value in JSON, never comes from the bitmark
  autoplay: boolean; // Has a default value in JSON, never comes from the bitmark
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

export interface DocumentDownloadResourceJson extends LinkResourceJson, ArticleLikeResourceJson {
  url: string;
}

export type AppResourceJson = string;

export interface AppLinkResourceJson extends LinkResourceJson, AppLikeResourceJson {
  url: string;
}

export interface WebsiteLinkResourceJson extends BaseResourceJson {
  url: string;
  siteName: string;
}
