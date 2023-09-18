import { PropertyConfigKey } from '../../model/config/PropertyConfigKey';
import { INFINITE_COUNT, TagDataMap } from '../../model/config/TagData';
import { RootBitType, RootBitTypeMetadata } from '../../model/enum/BitType';
import { TagType } from '../../model/enum/TagType';

import { TAGS_CHAIN_ANY_RESOURCE } from './generic/resourceChainBitConfigs';
import { TAGS_DEFAULT } from './generic/standardBitConfigs';

// Set metadata on the bit types to describe specific behaviour

const TAGS_LEARNING_PATH_RESOURCE: TagDataMap = {
  [PropertyConfigKey._action]: { isProperty: true },
  [PropertyConfigKey._duration]: { isProperty: true },
  [PropertyConfigKey._date]: { isProperty: true },
  [PropertyConfigKey._location]: { isProperty: true },
  [PropertyConfigKey._list]: { isProperty: true, maxCount: INFINITE_COUNT },
  [PropertyConfigKey._textReference]: { isProperty: true },
  [PropertyConfigKey._isTracked]: { isProperty: true },
  [PropertyConfigKey._isInfoOnly]: { isProperty: true },
  // Not sure if @book belongs to all learning paths, but for now assume it does
  [PropertyConfigKey._book]: {
    isProperty: true,
    chain: {
      [TagType.Reference]: { maxCount: 2 },
    },
  },
};
