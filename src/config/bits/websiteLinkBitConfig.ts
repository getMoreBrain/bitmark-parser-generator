import { BitType, BitTypeMetadata } from '../../model/enum/BitType';
import { ResourceType } from '../../model/enum/ResourceType';

import { TAGS_CHAIN_WEBSITE_LINK_RESOURCE } from './_resourceChainBitConfigs';
import { TAGS_DEFAULT } from './_standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

BitType.setMetadata<BitTypeMetadata>(BitType.websiteLink, {
  tags: { ...TAGS_DEFAULT, ...TAGS_CHAIN_WEBSITE_LINK_RESOURCE },
  resourceAttachmentAllowed: false,
  resourceType: ResourceType.websiteLink,
});
