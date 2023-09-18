import { PropertyConfigKey } from '../../model/config/PropertyConfigKey';
import { RootBitType, RootBitTypeMetadata } from '../../model/enum/BitType';

import { CARD_SET_STATEMENTS } from './generic/cardSetBitConfigs';
import { TAGS_CHAIN_ANY_RESOURCE } from './generic/resourceChainBitConfigs';
import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

RootBitType.setMetadata<RootBitTypeMetadata>(RootBitType.trueFalse, {
  tags: {
    ...TAGS_DEFAULT,
    ...TAGS_CHAIN_ANY_RESOURCE,
    [PropertyConfigKey._labelTrue]: { isProperty: true },
    [PropertyConfigKey._labelFalse]: { isProperty: true },
  },
  resourceAttachmentAllowed: true,
  cardSet: CARD_SET_STATEMENTS,
  bodyAllowed: true,
  footerAllowed: true,
});
