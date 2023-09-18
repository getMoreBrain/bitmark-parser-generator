import { PropertyConfigKey } from '../../model/config/PropertyConfigKey';
import { RootBitType, RootBitTypeMetadata } from '../../model/enum/BitType';
import { ResourceType } from '../../model/enum/ResourceType';

import { TAGS_CHAIN_IMAGE_RESOURCE } from './generic/resourceChainBitConfigs';
import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

RootBitType.setMetadata<RootBitTypeMetadata>(RootBitType.focusImage, {
  tags: {
    ...TAGS_DEFAULT,
    ...TAGS_CHAIN_IMAGE_RESOURCE,
    [PropertyConfigKey._focusX]: { isProperty: true },
    [PropertyConfigKey._focusY]: { isProperty: true },
  },
  resourceAttachmentAllowed: false,
  resourceType: ResourceType.image,
  bodyAllowed: true,
});
