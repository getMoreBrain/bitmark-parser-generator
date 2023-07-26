import { BitType, BitTypeMetadata } from '../../model/enum/BitType';
import { ResourceType } from '../../model/enum/ResourceType';

import { TAGS_CHAIN_VIDEO_RESOURCE } from './generic/resourceChainBitConfigs';
import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

const VIDEO_CONFIG: BitTypeMetadata = {
  tags: { ...TAGS_DEFAULT, ...TAGS_CHAIN_VIDEO_RESOURCE },
  resourceAttachmentAllowed: false,
  resourceType: ResourceType.video,
  bodyAllowed: true,
};
BitType.setMetadata<BitTypeMetadata>(BitType.video, VIDEO_CONFIG);

// Aliases
BitType.setMetadata<BitTypeMetadata>(BitType.videoLandscape, VIDEO_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.videoPortrait, VIDEO_CONFIG);
