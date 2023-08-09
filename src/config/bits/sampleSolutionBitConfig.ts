import { RootBitType, RootBitTypeMetadata } from '../../model/enum/BitType';
import { TagType } from '../../model/enum/TagType';

import { TAGS_CHAIN_ANY_RESOURCE } from './generic/resourceChainBitConfigs';
import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

RootBitType.setMetadata<RootBitTypeMetadata>(RootBitType.sampleSolution, {
  tags: {
    ...TAGS_DEFAULT,
    ...TAGS_CHAIN_ANY_RESOURCE,
    // Not sure if these are actually valid here, but include them as they are in the test bit.
    [TagType.Anchor]: {},
    [TagType.Reference]: {},
  },
  resourceAttachmentAllowed: true,
  bodyAllowed: true,
});
