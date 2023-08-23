import { RootBitType, RootBitTypeMetadata } from '../../model/enum/BitType';
import { ResourceType } from '../../model/enum/ResourceType';

import { TAGS_CHAIN_IMAGE_SOURCE } from './generic/chainBitConfigs';
import { TAGS_CHAIN_IMAGE_RESOURCE } from './generic/resourceChainBitConfigs';
import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

RootBitType.setMetadata<RootBitTypeMetadata>(RootBitType.imageOnDevice, {
  tags: {
    ...TAGS_DEFAULT,
    ...TAGS_CHAIN_IMAGE_RESOURCE,
    ...TAGS_CHAIN_IMAGE_SOURCE,
  },
  resourceAttachmentAllowed: false,
  resourceType: ResourceType.image,
  resourceOptional: true,
  bodyAllowed: true,
});
