import { PropertyKey } from '../../model/enum/PropertyKey';
import { ResourceType } from '../../model/enum/ResourceType';
import { TagChainType, TagChainTypeMetadata } from '../../model/enum/TagChainType';
import { TagType } from '../../model/enum/TagType';

// Set metadata on the tag chain keys to describe specific behaviour

TagChainType.setMetadata<TagChainTypeMetadata>(TagChainType.PartnerChain, {
  startTag: TagType.Property,
  startTagProperty: PropertyKey.partner,
  chainedTags: [TagType.Resource],
  chainedTagsProperties: [],
  chainedTagsResources: [ResourceType.image],
});
