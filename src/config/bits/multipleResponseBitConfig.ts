import { BitType, BitTypeMetadata } from '../../model/enum/BitType';

import { CARD_SET_QUIZ } from './generic/cardSetBitConfigs';
import { TAGS_CHAIN_ANY_RESOURCE } from './generic/resourceChainBitConfigs';
import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

BitType.setMetadata<BitTypeMetadata>(BitType.multipleResponse, {
  tags: { ...TAGS_DEFAULT, ...TAGS_CHAIN_ANY_RESOURCE },
  resourceAttachmentAllowed: true,
  cardSet: CARD_SET_QUIZ,
  bodyAllowed: true,
  footerAllowed: true,
});
