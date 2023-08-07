import { BitType, BitTypeMetadata } from '../../model/enum/BitType';
import { ExampleType } from '../../model/enum/ExampleType';
import { PropertyKey } from '../../model/enum/PropertyKey';

import { TAGS_CHAIN_ANY_RESOURCE } from './generic/resourceChainBitConfigs';
import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

BitType.setMetadata<BitTypeMetadata>(BitType.essay, {
  tags: {
    ...TAGS_DEFAULT,
    ...TAGS_CHAIN_ANY_RESOURCE,
    [PropertyKey.sampleSolution]: { isProperty: true },
  },
  resourceAttachmentAllowed: true,
  bodyAllowed: true,
  exampleType: ExampleType.string,
});
