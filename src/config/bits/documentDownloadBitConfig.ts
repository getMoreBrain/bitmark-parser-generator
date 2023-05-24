import { BitType, BitTypeMetadata } from '../../model/enum/BitType';
import { ResourceType } from '../../model/enum/ResourceType';
import { TagChainType } from '../../model/enum/TagChainType';

import { TAGS_DEFAULT } from './_standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

BitType.setMetadata<BitTypeMetadata>(BitType.documentDownload, {
  tags: [...TAGS_DEFAULT, TagChainType.DocumentDownloadResourceChain],
  resourceAttachmentAllowed: false,
  resourceType: ResourceType.documentDownload,
});
