import { BitType, BitTypeMetadata } from '../../model/enum/BitType';

import { TAGS_CHAIN_PARTNER } from './generic/chainBitConfigs';
import { TAGS_CHAIN_ANY_RESOURCE } from './generic/resourceChainBitConfigs';
import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

const CONVERSATION_CONFIG: BitTypeMetadata = {
  tags: { ...TAGS_DEFAULT, ...TAGS_CHAIN_PARTNER, ...TAGS_CHAIN_ANY_RESOURCE },
  resourceAttachmentAllowed: true,
  bodyAllowed: true,
};

BitType.setMetadata<BitTypeMetadata>(BitType.conversationLeft1, CONVERSATION_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.conversationLeft1Scream, CONVERSATION_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.conversationLeft1Thought, CONVERSATION_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.conversationRight1, CONVERSATION_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.conversationRight1Scream, CONVERSATION_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.conversationRight1Thought, CONVERSATION_CONFIG);
