import { BitType, BitTypeMetadata } from '../../model/enum/BitType';
import { CardSetType } from '../../model/enum/CardSetType';

import { TAGS_DEFAULT } from './_standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

BitType.setMetadata<BitTypeMetadata>(BitType.interview, {
  tags: { ...TAGS_DEFAULT },
  resourceAttachmentAllowed: false,
  cardSetType: CardSetType.questions,
});
