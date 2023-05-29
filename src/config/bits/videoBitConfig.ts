import { BitType, BitTypeMetadata } from '../../model/enum/BitType';
import { ResourceType } from '../../model/enum/ResourceType';

import { TAGS_CHAIN_VIDEO_RESOURCE } from './generic/resourceChainBitConfigs';
import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

BitType.setMetadata<BitTypeMetadata>(BitType.video, {
  tags: { ...TAGS_DEFAULT, ...TAGS_CHAIN_VIDEO_RESOURCE },
  resourceAttachmentAllowed: false,
  resourceType: ResourceType.video,
});
