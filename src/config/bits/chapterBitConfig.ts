import { BitType, BitTypeMetadata } from '../../model/enum/BitType';
import { TagType } from '../../model/enum/TagType';

import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

BitType.setMetadata<BitTypeMetadata>(BitType.chapter, {
  tags: {
    ...TAGS_DEFAULT,
    [TagType.Anchor]: {},
    [TagType.Title]: {},
  },
  resourceAttachmentAllowed: false,
  bodyAllowed: true,
});
