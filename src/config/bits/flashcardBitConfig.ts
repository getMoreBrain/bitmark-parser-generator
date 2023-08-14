import { RootBitType, RootBitTypeMetadata } from '../../model/enum/BitType';

import { CARD_SET_FLASHCARDS } from './generic/cardSetBitConfigs';
import { TAGS_CHAIN_ANY_RESOURCE } from './generic/resourceChainBitConfigs';
import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

RootBitType.setMetadata<RootBitTypeMetadata>(RootBitType.flashcard, {
  tags: {
    ...TAGS_DEFAULT,
    ...TAGS_CHAIN_ANY_RESOURCE,
  },
  resourceAttachmentAllowed: true,
  cardSet: CARD_SET_FLASHCARDS,
  bodyAllowed: true,
  footerAllowed: true,
});
