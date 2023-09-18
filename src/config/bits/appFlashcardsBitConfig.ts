import { PropertyConfigKey } from '../../model/config/PropertyConfigKey';
import { INFINITE_COUNT } from '../../model/config/TagData';
import { RootBitType, RootBitTypeMetadata } from '../../model/enum/BitType';
import { ExampleType } from '../../model/enum/ExampleType';
import { TagType } from '../../model/enum/TagType';

import { TAGS_CHAIN_ANY_RESOURCE } from './generic/resourceChainBitConfigs';
import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

RootBitType.setMetadata<RootBitTypeMetadata>(RootBitType.appFlashcards, {
  tags: {
    ...TAGS_DEFAULT,
    [TagType.Title]: {},
    [PropertyConfigKey._flashcardSet]: {
      isProperty: true,
      maxCount: INFINITE_COUNT,
    },
    ...TAGS_CHAIN_ANY_RESOURCE,
  },
  resourceAttachmentAllowed: true,
  bodyAllowed: true,
  rootExampleType: ExampleType.string,
});
