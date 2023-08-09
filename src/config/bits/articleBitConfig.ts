import { RootBitType, RootBitTypeMetadata } from '../../model/enum/BitType';
import { TagType } from '../../model/enum/TagType';

import { TAGS_CHAIN_ANY_RESOURCE } from './generic/resourceChainBitConfigs';
import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

RootBitType.setMetadata<RootBitTypeMetadata>(RootBitType.article, {
  tags: {
    ...TAGS_DEFAULT,
    [TagType.Title]: {},
    ...TAGS_CHAIN_ANY_RESOURCE,
  },
  resourceAttachmentAllowed: true,
  bodyAllowed: true,
});
