import { PropertyKey } from '../../model/enum/PropertyKey';
import { TagChainType, TagChainTypeMetadata } from '../../model/enum/TagChainType';
import { TagType } from '../../model/enum/TagType';

// Set metadata on the tag chain keys to describe specific behaviour

TagChainType.setMetadata<TagChainTypeMetadata>(TagChainType.BookChain, {
  startTag: TagType.Property,
  startTagProperty: PropertyKey.book,
  chainedTags: [TagType.ItemLead, TagType.Instruction, TagType.Hint, TagType.Property],
  chainedTagsProperties: [],
  chainedTagsResources: [],
});
