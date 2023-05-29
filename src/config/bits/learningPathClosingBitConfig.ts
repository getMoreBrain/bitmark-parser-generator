import { BitType, BitTypeMetadata } from '../../model/enum/BitType';

import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

BitType.setMetadata<BitTypeMetadata>(BitType.learningPathClosing, {
  tags: { ...TAGS_DEFAULT },
  resourceAttachmentAllowed: false,
});
