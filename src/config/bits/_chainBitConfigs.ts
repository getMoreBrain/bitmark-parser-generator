import { TagDataMap } from '../../model/config/TagData';
import { PropertyKey } from '../../model/enum/PropertyKey';

import { TAGS_CHAIN_IMAGE_RESOURCE } from './_resourceChainBitConfigs';

// Partner

const TAGS_CHAIN_PARTNER: TagDataMap = {
  [PropertyKey.partner]: {
    isProperty: true,
    chain: {
      ...TAGS_CHAIN_IMAGE_RESOURCE,
    },
  },
};

export { TAGS_CHAIN_PARTNER };
