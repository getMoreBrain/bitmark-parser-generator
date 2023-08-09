import { RootBitType, RootBitTypeMetadata } from '../../model/enum/BitType';
import { ResourceType } from '../../model/enum/ResourceType';

import { TAGS_CHAIN_DOCUMENT_DOWNLOAD_RESOURCE } from './generic/resourceChainBitConfigs';
import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

RootBitType.setMetadata<RootBitTypeMetadata>(RootBitType.documentDownload, {
  tags: { ...TAGS_DEFAULT, ...TAGS_CHAIN_DOCUMENT_DOWNLOAD_RESOURCE },
  resourceAttachmentAllowed: false,
  resourceType: ResourceType.documentDownload,
  bodyAllowed: true,
});
