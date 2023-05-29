import { BitType, BitTypeMetadata } from '../../model/enum/BitType';

import { CARD_SET_QUIZ } from './generic/cardSetBitConfigs';
import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

BitType.setMetadata<BitTypeMetadata>(BitType.multipleChoice, {
  tags: { ...TAGS_DEFAULT },
  resourceAttachmentAllowed: false,
  cardSet: CARD_SET_QUIZ,
});
