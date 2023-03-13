import { AppLinkResource } from '../types/resources/AppLinkResource';
import { AppResource } from '../types/resources/AppResource';
import { ArticleLinkResource } from '../types/resources/ArticleLinkResource';
import { ArticleOnlineResource } from '../types/resources/ArticleOnlineResource';
import { ArticleResource } from '../types/resources/ArticleResource';
import { AudioResource } from '../types/resources/AudioResource';
import { ImageLinkResource } from '../types/resources/ImageLinkResource';
import { ImageResource } from '../types/resources/ImageResource';
import { StillImageFilmLinkResource } from '../types/resources/StillImageFilmLinkResource';
import { StillImageFilmResource } from '../types/resources/StillImageFilmResource';
import { VideoLinkResource } from '../types/resources/VideoLinkResource';
import { VideoResource } from '../types/resources/VideoResource';
import { WebsiteLinkResource } from '../types/resources/WebsiteLinkResource';

export interface BaseResourceJson {
  type: string; // resource bit type
}

export interface WebsiteLinkResourceJson extends BaseResourceJson {
  type: 'website-link'; // resource type
  websiteLink: WebsiteLinkResource;
}

export interface ImageResourceJson extends BaseResourceJson {
  type: 'image'; // resource type
  image: ImageResource;
}
export interface ImageLinkResourceJson extends BaseResourceJson {
  type: 'image-link'; // resource type
  imageLink: ImageLinkResource;
}

export interface AudioResourceJson extends BaseResourceJson {
  type: 'audio'; // resource type
  audio: AudioResource;
}

export interface VideoResourceJson extends BaseResourceJson {
  type: 'video'; // resource type
  video: VideoResource;
}

export interface VideoLinkResourceJson extends BaseResourceJson {
  type: 'video-link'; // resource type
  videoLink: VideoLinkResource;
}

export interface StillImageFilmResourceJson extends BaseResourceJson {
  type: 'still-image-film'; // resource type
  stillImageFilm: StillImageFilmResource;
}

export interface StillImageFilmLinkResourceJson extends BaseResourceJson {
  type: 'still-image-film-link'; // resource type
  stillImageFilmLink: StillImageFilmLinkResource;
}

export interface ArticleResourceJson extends BaseResourceJson {
  type: 'article'; // resource type
  article: ArticleResource;
}

export interface ArticleLinkResourceJson extends BaseResourceJson {
  type: 'article-link'; // resource type
  articleLink: ArticleLinkResource;
}

// Deprecated ??
export interface ArticleOnlineResourceJson extends BaseResourceJson {
  type: 'article-online'; // resource type
  articleOnline: ArticleOnlineResource;
}

export interface AppResourceJson extends BaseResourceJson {
  type: 'app'; // resource type
  app: AppResource;
  // private:{}
}

export interface AppLinkResourceJson extends BaseResourceJson {
  type: 'app-link'; // resource type
  appLink: AppLinkResource;
  // private:{}
}

export type ResourceBitJson =
  | WebsiteLinkResourceJson
  | ImageResourceJson
  | ImageLinkResourceJson
  | AudioResourceJson
  | VideoResourceJson
  | VideoLinkResourceJson
  | StillImageFilmResourceJson
  | StillImageFilmLinkResourceJson
  | ArticleResourceJson
  | ArticleLinkResourceJson
  | ArticleOnlineResourceJson
  | AppResourceJson
  | AppLinkResourceJson;
