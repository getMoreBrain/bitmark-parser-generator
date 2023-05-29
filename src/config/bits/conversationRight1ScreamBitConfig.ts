import { BitType, BitTypeMetadata } from '../../model/enum/BitType';

import { TAGS_CHAIN_PARTNER } from './_chainBitConfigs';
import { TAGS_DEFAULT } from './_standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

BitType.setMetadata<BitTypeMetadata>(BitType.conversationRight1Scream, {
  tags: { ...TAGS_DEFAULT, ...TAGS_CHAIN_PARTNER },
  resourceAttachmentAllowed: false,
});
