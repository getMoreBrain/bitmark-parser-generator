import { BitType, BitTypeMetadata } from '../../model/enum/BitType';
import { TAGS_CHAIN_ANY_RESOURCE } from './generic/resourceChainBitConfigs';

import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

BitType.setMetadata<BitTypeMetadata>(BitType.blogArticle, {
  tags: { ...TAGS_DEFAULT, ...TAGS_CHAIN_ANY_RESOURCE },
  resourceAttachmentAllowed: true,
  bodyAllowed: true,
});
