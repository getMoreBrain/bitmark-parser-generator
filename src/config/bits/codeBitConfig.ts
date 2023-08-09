import { RootBitType, RootBitTypeMetadata } from '../../model/enum/BitType';
import { PropertyKey } from '../../model/enum/PropertyKey';

import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

RootBitType.setMetadata<RootBitTypeMetadata>(RootBitType.code, {
  tags: {
    ...TAGS_DEFAULT,
    [PropertyKey.computerLanguage]: { isProperty: true },
  },
  resourceAttachmentAllowed: false,
  bodyAllowed: true,
});
