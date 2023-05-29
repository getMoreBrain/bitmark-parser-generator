import { BitType, BitTypeMetadata } from '../../model/enum/BitType';

import { TAGS_CHAIN_GAP } from './generic/chainBitConfigs';
import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

BitType.setMetadata<BitTypeMetadata>(BitType.cloze, {
  tags: { ...TAGS_DEFAULT, ...TAGS_CHAIN_GAP },
  resourceAttachmentAllowed: false,
});
