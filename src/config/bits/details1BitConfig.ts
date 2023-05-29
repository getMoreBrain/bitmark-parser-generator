import { BitType, BitTypeMetadata } from '../../model/enum/BitType';

import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

BitType.setMetadata<BitTypeMetadata>(BitType.details1, {
  tags: { ...TAGS_DEFAULT },
  resourceAttachmentAllowed: false,
});
