import { TagChainType, TagChainTypeMetadata } from '../../model/enum/TagChainType';
import { TagType } from '../../model/enum/TagType';

// Set metadata on the tag chain keys to describe specific behaviour

TagChainType.setMetadata<TagChainTypeMetadata>(TagChainType.GapChain, {
  startTag: TagType.Gap,
  chainedTags: [TagType.ItemLead, TagType.Instruction, TagType.Hint, TagType.Property],
  chainedTagsProperties: [
    // TODO
  ],
  chainedTagsResources: [],
});
