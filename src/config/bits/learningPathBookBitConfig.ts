import { BitType, BitTypeMetadata } from '../../model/enum/BitType';
import { PropertyKey } from '../../model/enum/PropertyKey';
import { TagType } from '../../model/enum/TagType';

import { TAGS_DEFAULT } from './_standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

BitType.setMetadata<BitTypeMetadata>(BitType.learningPathBook, {
  tags: {
    ...TAGS_DEFAULT,
    [PropertyKey.action]: { isProperty: true },
    [PropertyKey.duration]: { isProperty: true },
    [PropertyKey.date]: { isProperty: true },
    [PropertyKey.location]: { isProperty: true },
    [PropertyKey.book]: {
      isProperty: true,
      chain: {
        [TagType.Reference]: { maxCount: 2 },
      },
    },
  },
  resourceAttachmentAllowed: false,
});
