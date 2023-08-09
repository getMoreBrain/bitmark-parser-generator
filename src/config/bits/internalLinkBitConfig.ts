import { RootBitType, RootBitTypeMetadata } from '../../model/enum/BitType';
import { TagType } from '../../model/enum/TagType';

import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

RootBitType.setMetadata<RootBitTypeMetadata>(RootBitType.internalLink, {
  tags: {
    ...TAGS_DEFAULT,
    [TagType.Reference]: {},
  },
  resourceAttachmentAllowed: false,
  bodyAllowed: true,
});
