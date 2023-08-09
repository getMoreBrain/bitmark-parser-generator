import { INFINITE_COUNT } from '../../model/config/TagData';
import { RootBitType, RootBitTypeMetadata } from '../../model/enum/BitType';
import { PropertyKey } from '../../model/enum/PropertyKey';
import { TagType } from '../../model/enum/TagType';

import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

RootBitType.setMetadata<RootBitTypeMetadata>(RootBitType.book, {
  tags: {
    ...TAGS_DEFAULT,
    [PropertyKey.spaceId]: {
      isProperty: true,
      maxCount: INFINITE_COUNT,
    },
    [TagType.Title]: { maxCount: 2 },
    [PropertyKey.subtype]: { isProperty: true },
    [PropertyKey.coverImage]: { isProperty: true },
    [PropertyKey.publisher]: { isProperty: true },
    [PropertyKey.subject]: { isProperty: true },
    [PropertyKey.author]: { isProperty: true },
    [PropertyKey.theme]: { isProperty: true },
  },
  resourceAttachmentAllowed: false,
  bodyAllowed: true,
});
