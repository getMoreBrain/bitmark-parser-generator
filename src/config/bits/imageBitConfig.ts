import { BitType, BitTypeMetadata } from '../../model/enum/BitType';
import { ResourceType } from '../../model/enum/ResourceType';

import { TAGS_CHAIN_IMAGE_RESOURCE } from './generic/resourceChainBitConfigs';
import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

const IMAGE_CONFIG: BitTypeMetadata = {
  tags: { ...TAGS_DEFAULT, ...TAGS_CHAIN_IMAGE_RESOURCE },
  resourceAttachmentAllowed: false,
  resourceType: ResourceType.image,
  bodyAllowed: true,
};
BitType.setMetadata<BitTypeMetadata>(BitType.image, IMAGE_CONFIG);

// Aliases
BitType.setMetadata<BitTypeMetadata>(BitType.imageLandscape, IMAGE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.imageOnDevice, IMAGE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.imagePortrait, IMAGE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.imagePrototype, IMAGE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.imageSuperWide, IMAGE_CONFIG);
BitType.setMetadata<BitTypeMetadata>(BitType.imageZoom, IMAGE_CONFIG);
