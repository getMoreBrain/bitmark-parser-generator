import { PropertyConfigKey } from '../../model/config/PropertyConfigKey';
import { RootBitType, RootBitTypeMetadata } from '../../model/enum/BitType';

import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

RootBitType.setMetadata<RootBitTypeMetadata>(RootBitType.vendorPadletEmbed, {
  tags: {
    ...TAGS_DEFAULT,
    [PropertyConfigKey._padletId]: { isProperty: true },
  },
  resourceAttachmentAllowed: false,
  bodyAllowed: true,
});
