import { PropertyConfigKey } from '../../model/config/PropertyConfigKey';
import { INFINITE_COUNT } from '../../model/config/TagData';
import { RootBitType, RootBitTypeMetadata } from '../../model/enum/BitType';
import { TagType } from '../../model/enum/TagType';

import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

RootBitType.setMetadata<RootBitTypeMetadata>(RootBitType.book, {
  tags: {
    ...TAGS_DEFAULT,
    [PropertyConfigKey._spaceId]: {
      isProperty: true,
      maxCount: INFINITE_COUNT,
    },
    [TagType.Title]: { maxCount: 2 },
    [PropertyConfigKey._subtype]: { isProperty: true },
    [PropertyConfigKey._coverImage]: { isProperty: true },
    [PropertyConfigKey._publisher]: { isProperty: true },
    [PropertyConfigKey._subject]: { isProperty: true },
    [PropertyConfigKey._author]: { isProperty: true },
    [PropertyConfigKey._theme]: { isProperty: true },
  },
  resourceAttachmentAllowed: false,
  bodyAllowed: true,
});
