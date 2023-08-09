import { RootBitType, RootBitTypeMetadata } from '../../model/enum/BitType';

import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

RootBitType.setMetadata<RootBitTypeMetadata>(RootBitType.rating, {
  tags: { ...TAGS_DEFAULT },
  resourceAttachmentAllowed: false,
  bodyAllowed: true,
});
