import { RootBitType, RootBitTypeMetadata } from '../../model/enum/BitType';

import { CARD_SET_QUIZ } from './generic/cardSetBitConfigs';
import { TAGS_CHAIN_TRUE_FALSE } from './generic/chainBitConfigs';
import { TAGS_CHAIN_ANY_RESOURCE } from './generic/resourceChainBitConfigs';
import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

RootBitType.setMetadata<RootBitTypeMetadata>(RootBitType.multipleResponse, {
  tags: {
    ...TAGS_DEFAULT,
    ...TAGS_CHAIN_ANY_RESOURCE,
    ...TAGS_CHAIN_TRUE_FALSE, // This is actually for multiple-response-1, but we support it here as well (as many bits are wrong)
  },
  resourceAttachmentAllowed: true,
  cardSet: CARD_SET_QUIZ,
  bodyAllowed: true,
  footerAllowed: true,
});
