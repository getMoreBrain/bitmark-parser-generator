import { RootBitType, RootBitTypeMetadata } from '../../model/enum/BitType';
import { PropertyKey } from '../../model/enum/PropertyKey';

import { CARD_SET_STATEMENTS } from './generic/cardSetBitConfigs';
import { TAGS_CHAIN_ANY_RESOURCE } from './generic/resourceChainBitConfigs';
import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

RootBitType.setMetadata<RootBitTypeMetadata>(RootBitType.trueFalse, {
  tags: {
    ...TAGS_DEFAULT,
    ...TAGS_CHAIN_ANY_RESOURCE,
    [PropertyKey.labelTrue]: { isProperty: true },
    [PropertyKey.labelFalse]: { isProperty: true },
  },
  resourceAttachmentAllowed: true,
  cardSet: CARD_SET_STATEMENTS,
  bodyAllowed: true,
  footerAllowed: true,
});
