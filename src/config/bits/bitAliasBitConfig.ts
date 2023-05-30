import { BitType, BitTypeMetadata } from '../../model/enum/BitType';
import { TagType } from '../../model/enum/TagType';

import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

BitType.setMetadata<BitTypeMetadata>(BitType.bitAlias, {
  tags: {
    ...TAGS_DEFAULT,
    [TagType.Reference]: {},
    [TagType.Anchor]: {},
  },
  resourceAttachmentAllowed: false,
  bodyAllowed: true,
});
