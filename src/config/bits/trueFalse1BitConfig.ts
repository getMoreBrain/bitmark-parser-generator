import { PropertyConfigKey } from '../../model/config/PropertyConfigKey';
import { RootBitType, RootBitTypeMetadata } from '../../model/enum/BitType';
import { ExampleType } from '../../model/enum/ExampleType';
import { TagType } from '../../model/enum/TagType';

import { TAGS_CHAIN_ANY_RESOURCE } from './generic/resourceChainBitConfigs';
import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

RootBitType.setMetadata<RootBitTypeMetadata>(RootBitType.trueFalse1, {
  tags: {
    ...TAGS_DEFAULT,
    ...TAGS_CHAIN_ANY_RESOURCE,
    [PropertyConfigKey._labelTrue]: { isProperty: true },
    [PropertyConfigKey._labelFalse]: { isProperty: true },
    [TagType.True]: {},
    [TagType.False]: {},
  },
  resourceAttachmentAllowed: true,
  bodyAllowed: false,
  rootExampleType: ExampleType.boolean,
});
