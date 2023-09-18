import { PropertyConfigKey } from '../../model/config/PropertyConfigKey';
import { RootBitType, RootBitTypeMetadata } from '../../model/enum/BitType';

import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

RootBitType.setMetadata<RootBitTypeMetadata>(RootBitType.botActionSend, {
  tags: {
    ...TAGS_DEFAULT,
    [PropertyConfigKey._date]: { isProperty: true },
  },
  resourceAttachmentAllowed: false,
  bodyAllowed: true,
});
