import { AppLinkResource } from './AppLinkResource';
import { AppResource } from './AppResource';
import { ArticleLinkResource } from './ArticleLinkResource';
import { ArticleOnlineResource } from './ArticleOnlineResource';
import { ArticleResource } from './ArticleResource';
import { AudioResource } from './AudioResource';
import { ImageLinkResource } from './ImageLinkResource';
import { ImageResource } from './ImageResource';
import { ResourceTypeType } from './ResouceType';
import { StillImageFilmLinkResource } from './StillImageFilmLinkResource';
import { StillImageFilmResource } from './StillImageFilmResource';
import { VideoLinkResource } from './VideoLinkResource';
import { VideoResource } from './VideoResource';
import { WebsiteLinkResource } from './WebsiteLinkResource';

export interface Resource {
  type: ResourceTypeType;
  websiteLink?: WebsiteLinkResource;
  image?: ImageResource;
  imageLink?: ImageLinkResource;
  audio?: AudioResource;
  video?: VideoResource;
  videoLink?: VideoLinkResource;
  stillImageFilm?: StillImageFilmResource;
  stillImageFilmLink?: StillImageFilmLinkResource;
  article?: ArticleResource;
  articleLink?: ArticleLinkResource;
  articleOnline?: ArticleOnlineResource;
  app?: AppResource;
  appLink?: AppLinkResource;
}
