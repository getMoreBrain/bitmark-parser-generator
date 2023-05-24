import { BitType, BitTypeMetadata } from '../../model/enum/BitType';
import { TagChainType } from '../../model/enum/TagChainType';

import { TAGS_DEFAULT } from './_standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

BitType.setMetadata<BitTypeMetadata>(BitType.trueFalse1, {
  tags: [...TAGS_DEFAULT, TagChainType.TrueChain, TagChainType.FalseChain],
  resourceAttachmentAllowed: false,
});
