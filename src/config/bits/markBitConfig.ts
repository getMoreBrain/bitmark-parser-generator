import { BitType, BitTypeMetadata } from '../../model/enum/BitType';

import { TAGS_CHAIN_MARK, TAGS_CHAIN_MARK_CONFIG } from './generic/chainBitConfigs';
import { TAGS_CHAIN_ANY_RESOURCE } from './generic/resourceChainBitConfigs';
import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

BitType.setMetadata<BitTypeMetadata>(BitType.mark, {
  tags: {
    ...TAGS_DEFAULT,
    ...TAGS_CHAIN_ANY_RESOURCE,
    ...TAGS_CHAIN_MARK_CONFIG,
    ...TAGS_CHAIN_MARK,
  },
  resourceAttachmentAllowed: true,
  bodyAllowed: true,
});
