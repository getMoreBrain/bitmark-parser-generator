import { ResourceType } from '../../model/enum/ResourceType';
import { TagChainType, TagChainTypeMetadata } from '../../model/enum/TagChainType';
import { TagType } from '../../model/enum/TagType';

// Set metadata on the tag chain keys to describe specific behaviour

TagChainType.setMetadata<TagChainTypeMetadata>(TagChainType.DocumentDownloadResourceChain, {
  startTag: TagType.Resource,
  startTagResource: ResourceType.documentDownload,
  chainedTags: [TagType.Property],
  chainedTagsProperties: [],
  chainedTagsResources: [],
});
