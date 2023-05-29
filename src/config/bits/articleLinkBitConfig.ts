import { BitType, BitTypeMetadata } from '../../model/enum/BitType';
import { ResourceType } from '../../model/enum/ResourceType';

import { TAGS_CHAIN_ARTICLE_LINK_RESOURCE } from './_resourceChainBitConfigs';
import { TAGS_DEFAULT } from './_standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

BitType.setMetadata<BitTypeMetadata>(BitType.articleLink, {
  tags: {
    ...TAGS_DEFAULT,
    ...TAGS_CHAIN_ARTICLE_LINK_RESOURCE,
  },
  resourceAttachmentAllowed: false,
  resourceType: ResourceType.articleLink,
});
