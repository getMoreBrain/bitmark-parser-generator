import { INFINITE_COUNT } from '../../model/config/TagData';
import { BitType, BitTypeMetadata } from '../../model/enum/BitType';
import { TagType } from '../../model/enum/TagType';

import { TAGS_CHAIN_ANY_RESOURCE } from './generic/resourceChainBitConfigs';
import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

BitType.setMetadata<BitTypeMetadata>(BitType.multipleChoice1, {
  tags: {
    ...TAGS_DEFAULT,
    ...TAGS_CHAIN_ANY_RESOURCE,
    [TagType.True]: { maxCount: INFINITE_COUNT },
    [TagType.False]: { maxCount: INFINITE_COUNT },
  },
  resourceAttachmentAllowed: true,
  bodyAllowed: true,
});
