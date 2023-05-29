import { BitType, BitTypeMetadata } from '../../model/enum/BitType';

import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

BitType.setMetadata<BitTypeMetadata>(BitType.learningPathSign, {
  tags: { ...TAGS_DEFAULT },
  resourceAttachmentAllowed: false,
});
