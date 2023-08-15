import { INFINITE_COUNT, TagDataMap } from '../../../model/config/TagData';
import { PropertyKey } from '../../../model/enum/PropertyKey';
import { TagType } from '../../../model/enum/TagType';

import { TAGS_CHAIN_IMAGE_RESOURCE } from './resourceChainBitConfigs';
import { TAGS_ITEM_LEAD_INSTRUCTION_HINT, TAGS_PROPERTY_EXAMPLE } from './standardBitConfigs';

// Partner

const TAGS_CHAIN_PARTNER: TagDataMap = {
  [PropertyKey.partner]: {
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
  [PropertyKey.mark]: {
    isProperty: true,
    maxCount: INFINITE_COUNT,
    chain: {
      [PropertyKey.color]: { isProperty: true },
      [PropertyKey.emphasis]: { isProperty: true },
    },
  },
};

// Mark

const TAGS_CHAIN_MARK: TagDataMap = {
  [TagType.Mark]: {
    maxCount: INFINITE_COUNT,
    chain: {
      [PropertyKey.mark]: { isProperty: true },
      ...TAGS_PROPERTY_EXAMPLE,
    },
  },
};

export { TAGS_CHAIN_PARTNER, TAGS_CHAIN_GAP, TAGS_CHAIN_TRUE_FALSE, TAGS_CHAIN_MARK_CONFIG, TAGS_CHAIN_MARK };
