import { EnumType, superenum } from '@ncoderz/superenum';

import { PropertyKeyType } from './PropertyKey';
import { ResourceTypeType } from './ResourceType';
import { TagTypeType } from './TagType';

export interface TagChainTypeMetadata {
  startTag: TagTypeType;
  startTagProperty?: PropertyKeyType;
  startTagResource?: ResourceTypeType;
  chainedTags: TagTypeType[];
  chainedTagsProperties: PropertyKey[];
  chainedTagsResources: ResourceTypeType[];
}

const TagChainType = superenum({
  BookChain: 'BookChain', // [.learning-path-book]
  PartnerChain: 'PartnerChain', // [.conversation-xxx]

  GapChain: 'GapChain', // [.cloze-xxx]
  TrueChain: 'TrueChain', // [.multiple-choice-xxx], [.multliple-response-xxx]
  FalseChain: 'FalseChain', // [.multiple-choice-xxx], [.multliple-response-xxx]

  // Resource chains
  ImageResourceChain: 'ImageResourceChain',
  ImageLinkResourceChain: 'ImageLinkResourceChain',
  AudioResourceChain: 'AudioResourceChain',
  AudioEmbedResourceChain: 'AudioEmbedResourceChain',
  AudioLinkResourceChain: 'AudioLinkResourceChain',
  VideoResourceChain: 'VideoResourceChain',
  VideoEmbedResourceChain: 'VideoEmbedResourceChain',
  VideoLinkResourceChain: 'VideoLinkResourceChain',
  StillImageFilmResourceChain: 'StillImageFilmResourceChain',
  StillImageFilmEmbedResourceChain: 'StillImageFilmEmbedResourceChain',
  StillImageFilmLinkResourceChain: 'StillImageFilmLinkResourceChain',
  ArticleResourceChain: 'ArticleResourceChain',
  DocumentResourceChain: 'DocumentResourceChain',
  DocumentEmbedResourceChain: 'DocumentEmbedResourceChain',
  DocumentLinkResourceChain: 'DocumentLinkResourceChain',
  DocumentDownloadResourceChain: 'DocumentDownloadResourceChain',
  AppLinkResourceChain: 'AppLinkResourceChain',
  WebsiteLinkResourceChain: 'WebsiteLinkResourceChain',
});

export type TagChainTypeType = EnumType<typeof TagChainType>;

export { TagChainType };
