import { BitType, BitTypeMetadata } from '../../model/enum/BitType';

import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

const RATING_CONFIG: BitTypeMetadata = {
  tags: { ...TAGS_DEFAULT },
  resourceAttachmentAllowed: false,
  bodyAllowed: true,
};

BitType.setMetadata<BitTypeMetadata>(BitType.rating, RATING_CONFIG);

// Aliases
BitType.setMetadata<BitTypeMetadata>(BitType.coachSelfReflectionRating, RATING_CONFIG);
