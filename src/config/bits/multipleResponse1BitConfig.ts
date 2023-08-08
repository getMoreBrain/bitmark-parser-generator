import { BitType, BitTypeMetadata } from '../../model/enum/BitType';

import { TAGS_CHAIN_TRUE_FALSE } from './generic/chainBitConfigs';
import { TAGS_CHAIN_ANY_RESOURCE } from './generic/resourceChainBitConfigs';
import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

const MULTIPLE_RESPONSE_1_CONFIG: BitTypeMetadata = {
  tags: {
    ...TAGS_DEFAULT,
    ...TAGS_CHAIN_ANY_RESOURCE,
    ...TAGS_CHAIN_TRUE_FALSE,
  },
  resourceAttachmentAllowed: true,
  bodyAllowed: true,
};

BitType.setMetadata<BitTypeMetadata>(BitType.multipleResponse1, MULTIPLE_RESPONSE_1_CONFIG);

// Aliases

BitType.setMetadata<BitTypeMetadata>(BitType.coachSelfReflectionMultipleResponse1, MULTIPLE_RESPONSE_1_CONFIG);
