import { BitType, BitTypeMetadata } from '../../model/enum/BitType';
import { PropertyKey } from '../../model/enum/PropertyKey';
import { ResourceType } from '../../model/enum/ResourceType';

import { TAGS_CHAIN_IMAGE_RESOURCE } from './generic/resourceChainBitConfigs';
import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

BitType.setMetadata<BitTypeMetadata>(BitType.focusImage, {
  tags: {
    ...TAGS_DEFAULT,
    ...TAGS_CHAIN_IMAGE_RESOURCE,
    [PropertyKey.focusX]: { isProperty: true },
    [PropertyKey.focusY]: { isProperty: true },
  },
  resourceAttachmentAllowed: false,
  resourceType: ResourceType.image,
  bodyAllowed: true,
});
