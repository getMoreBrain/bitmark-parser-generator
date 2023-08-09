import { RootBitType, RootBitTypeMetadata } from '../../model/enum/BitType';

import { CARD_SET_QUESTIONS } from './generic/cardSetBitConfigs';
import { TAGS_CHAIN_ANY_RESOURCE } from './generic/resourceChainBitConfigs';
import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

RootBitType.setMetadata<RootBitTypeMetadata>(RootBitType.interview, {
  tags: { ...TAGS_DEFAULT, ...TAGS_CHAIN_ANY_RESOURCE },
  resourceAttachmentAllowed: true,
  cardSet: CARD_SET_QUESTIONS,
  bodyAllowed: true,
  footerAllowed: true,
});
