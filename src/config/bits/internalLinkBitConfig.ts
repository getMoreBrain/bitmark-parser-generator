import { BitType, BitTypeMetadata } from '../../model/enum/BitType';
import { TagType } from '../../model/enum/TagType';

import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

BitType.setMetadata<BitTypeMetadata>(BitType.internalLink, {
  tags: {
    ...TAGS_DEFAULT,
    [TagType.Reference]: {},
  },
  resourceAttachmentAllowed: false,
  bodyAllowed: true,
});
