import { RootBitType, RootBitTypeMetadata } from '../../model/enum/BitType';
import { ResourceType } from '../../model/enum/ResourceType';

import { TAGS_CHAIN_DOCUMENT_LINK_RESOURCE } from './generic/resourceChainBitConfigs';
import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

RootBitType.setMetadata<RootBitTypeMetadata>(RootBitType.documentLink, {
  tags: { ...TAGS_DEFAULT, ...TAGS_CHAIN_DOCUMENT_LINK_RESOURCE },
  resourceAttachmentAllowed: false,
  resourceType: ResourceType.documentLink,
  bodyAllowed: true,
});
