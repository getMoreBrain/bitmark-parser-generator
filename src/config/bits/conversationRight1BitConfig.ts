import { BitType, BitTypeMetadata } from '../../model/enum/BitType';

import { TAGS_CHAIN_PARTNER } from './generic/chainBitConfigs';
import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

BitType.setMetadata<BitTypeMetadata>(BitType.conversationRight1, {
  tags: { ...TAGS_DEFAULT, ...TAGS_CHAIN_PARTNER },
  resourceAttachmentAllowed: false,
});
