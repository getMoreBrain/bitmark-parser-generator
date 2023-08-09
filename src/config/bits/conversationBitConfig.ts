import { RootBitType, RootBitTypeMetadata } from '../../model/enum/BitType';

import { TAGS_CHAIN_PARTNER } from './generic/chainBitConfigs';
import { TAGS_CHAIN_ANY_RESOURCE } from './generic/resourceChainBitConfigs';
import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

RootBitType.setMetadata<RootBitTypeMetadata>(RootBitType.conversationLeft1, {
  tags: { ...TAGS_DEFAULT, ...TAGS_CHAIN_PARTNER, ...TAGS_CHAIN_ANY_RESOURCE },
  resourceAttachmentAllowed: true,
  bodyAllowed: true,
});
