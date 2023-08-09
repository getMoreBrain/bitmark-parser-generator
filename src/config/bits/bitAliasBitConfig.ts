import { RootBitType, RootBitTypeMetadata } from '../../model/enum/BitType';
import { TagType } from '../../model/enum/TagType';

import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

RootBitType.setMetadata<RootBitTypeMetadata>(RootBitType.bitAlias, {
  tags: {
    ...TAGS_DEFAULT,
    [TagType.Reference]: {},
    [TagType.Anchor]: {},
  },
  resourceAttachmentAllowed: false,
  bodyAllowed: true,
});
