import { RootBitType, RootBitTypeMetadata } from '../../model/enum/BitType';
import { ExampleType } from '../../model/enum/ExampleType';
import { TagType } from '../../model/enum/TagType';

import { TAGS_CHAIN_ANY_RESOURCE } from './generic/resourceChainBitConfigs';
import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

RootBitType.setMetadata<RootBitTypeMetadata>(RootBitType.example, {
  tags: {
    ...TAGS_DEFAULT,
    [TagType.Title]: {},
    ...TAGS_CHAIN_ANY_RESOURCE,
  },
  resourceAttachmentAllowed: true,
  bodyAllowed: true,
  rootExampleType: ExampleType.string,
});
