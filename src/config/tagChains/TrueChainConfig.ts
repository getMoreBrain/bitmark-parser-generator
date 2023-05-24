import { TagChainType, TagChainTypeMetadata } from '../../model/enum/TagChainType';
import { TagType } from '../../model/enum/TagType';

// Set metadata on the tag chain keys to describe specific behaviour

TagChainType.setMetadata<TagChainTypeMetadata>(TagChainType.TrueChain, {
  startTag: TagType.True,
  chainedTags: [TagType.ItemLead, TagType.Instruction, TagType.Hint, TagType.Property],
  chainedTagsProperties: [],
  chainedTagsResources: [],
});
