import { RootBitType, RootBitTypeMetadata } from '../../model/enum/BitType';
import { ExampleType } from '../../model/enum/ExampleType';
import { PropertyKey } from '../../model/enum/PropertyKey';
import { TagType } from '../../model/enum/TagType';

import { TAGS_CHAIN_ANY_RESOURCE } from './generic/resourceChainBitConfigs';
import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

RootBitType.setMetadata<RootBitTypeMetadata>(RootBitType.trueFalse1, {
  tags: {
    ...TAGS_DEFAULT,
    ...TAGS_CHAIN_ANY_RESOURCE,
    [PropertyKey.labelTrue]: { isProperty: true },
    [PropertyKey.labelFalse]: { isProperty: true },
    [TagType.True]: {},
    [TagType.False]: {},
  },
  resourceAttachmentAllowed: true,
  bodyAllowed: false,
  rootExampleType: ExampleType.boolean,
});
