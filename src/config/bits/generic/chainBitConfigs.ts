import { PropertyConfigKey } from '../../../model/config/PropertyConfigKey';
import { INFINITE_COUNT, TagDataMap } from '../../../model/config/TagData';
import { TagType } from '../../../model/enum/TagType';

import { TAGS_CHAIN_IMAGE_RESOURCE } from './resourceChainBitConfigs';
import { TAGS_ITEM_LEAD_INSTRUCTION_HINT, TAGS_PROPERTY_EXAMPLE } from './standardBitConfigs';

// ImageSource ([.image-on-device])

const TAGS_CHAIN_IMAGE_SOURCE: TagDataMap = {
  [PropertyConfigKey._imageSource]: {
    isProperty: true,
    chain: {
      [PropertyConfigKey._mockupId]: { isProperty: true },
      [PropertyConfigKey._size]: { isProperty: true },
      [PropertyConfigKey._format]: { isProperty: true },
      [PropertyConfigKey._trim]: { isProperty: true },
    },
  },
};

// Partner

const TAGS_CHAIN_PARTNER: TagDataMap = {
  [PropertyConfigKey._partner]: {
    isProperty: true,
    chain: {
      ...TAGS_CHAIN_IMAGE_RESOURCE,
    },
  },
};

// Gap (cloze)

const TAGS_CHAIN_GAP: TagDataMap = {
  [TagType.Gap]: {
    maxCount: INFINITE_COUNT,
    chain: {
      [TagType.Gap]: {
        maxCount: INFINITE_COUNT,
      },
      ...TAGS_ITEM_LEAD_INSTRUCTION_HINT,
      ...TAGS_PROPERTY_EXAMPLE,
      // [PropertyKey.caseSensitive]: {
      //   isProperty: true,
      // },
    },
  },
};

// TrueFalse (mutliple-choice1, multiple-response1, highlightText)

const TAGS_CHAIN_TRUE_FALSE: TagDataMap = {
  [TagType.True]: {
    maxCount: INFINITE_COUNT,
    chain: {
      [TagType.True]: {
        maxCount: INFINITE_COUNT,
      },
      [TagType.False]: {
        maxCount: INFINITE_COUNT,
      },
      ...TAGS_ITEM_LEAD_INSTRUCTION_HINT,
      ...TAGS_PROPERTY_EXAMPLE,
      // [PropertyKey.caseSensitive]: {
      //   isProperty: true,
      // },
    },
  },
  [TagType.False]: {
    maxCount: INFINITE_COUNT,
    chain: {
      [TagType.True]: {
        maxCount: INFINITE_COUNT,
      },
      [TagType.False]: {
        maxCount: INFINITE_COUNT,
      },
      ...TAGS_ITEM_LEAD_INSTRUCTION_HINT,
      ...TAGS_PROPERTY_EXAMPLE,
      // [PropertyKey.caseSensitive]: {
      //   isProperty: true,
      // },
    },
  },
};

// Mark configuration

const TAGS_CHAIN_MARK_CONFIG: TagDataMap = {
  [PropertyConfigKey._mark]: {
    isProperty: true,
    maxCount: INFINITE_COUNT,
    chain: {
      [PropertyConfigKey._color]: { isProperty: true },
      [PropertyConfigKey._emphasis]: { isProperty: true },
    },
  },
};

// Mark

const TAGS_CHAIN_MARK: TagDataMap = {
  [TagType.Mark]: {
    maxCount: INFINITE_COUNT,
    chain: {
      [PropertyConfigKey._mark]: { isProperty: true },
      ...TAGS_PROPERTY_EXAMPLE,
    },
  },
};

export {
  TAGS_CHAIN_IMAGE_SOURCE,
  TAGS_CHAIN_PARTNER,
  TAGS_CHAIN_GAP,
  TAGS_CHAIN_TRUE_FALSE,
  TAGS_CHAIN_MARK_CONFIG,
  TAGS_CHAIN_MARK,
};
