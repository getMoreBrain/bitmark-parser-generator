import { BitType, BitTypeMetadata } from '../../model/enum/BitType';
import { ExampleType } from '../../model/enum/ExampleType';
import { PropertyKey } from '../../model/enum/PropertyKey';

import { TAGS_CHAIN_ANY_RESOURCE } from './generic/resourceChainBitConfigs';
import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

const ESSAY_CONFIG: BitTypeMetadata = {
  tags: {
    ...TAGS_DEFAULT,
    ...TAGS_CHAIN_ANY_RESOURCE,
    [PropertyKey.sampleSolution]: { isProperty: true },
  },
  resourceAttachmentAllowed: true,
  bodyAllowed: true,
  rootExampleType: ExampleType.string,
};

BitType.setMetadata<BitTypeMetadata>(BitType.essay, ESSAY_CONFIG);

// Aliases
BitType.setMetadata<BitTypeMetadata>(BitType.coachSelfReflectionEssay, ESSAY_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.coachCallToActionEssay, ESSAY_CONFIG);
