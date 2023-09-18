import { PropertyConfigKey } from '../../../model/config/PropertyConfigKey';
import { INFINITE_COUNT, TagDataMap } from '../../../model/config/TagData';
import { TagType } from '../../../model/enum/TagType';

const TAGS_ALL_BITS: TagDataMap = {
  [PropertyConfigKey._id]: {
    isProperty: true,
    maxCount: INFINITE_COUNT,
  },
  [PropertyConfigKey._externalId]: {
    isProperty: true,
    maxCount: INFINITE_COUNT,
  },
  [PropertyConfigKey._aiGenerated]: {
    isProperty: true,
  },
  [PropertyConfigKey._ageRange]: {
    isProperty: true,
    maxCount: INFINITE_COUNT,
  },
  [PropertyConfigKey._language]: {
    isProperty: true,
    maxCount: INFINITE_COUNT,
  },
  [PropertyConfigKey._target]: {
    isProperty: true,
    maxCount: INFINITE_COUNT,
  },
  [PropertyConfigKey._tag]: {
    isProperty: true,
    maxCount: INFINITE_COUNT,
  },
  [PropertyConfigKey._icon]: {
    isProperty: true,
  },
  [PropertyConfigKey._iconTag]: {
    isProperty: true,
  },
  [PropertyConfigKey._colorTag]: {
    isProperty: true,
    maxCount: INFINITE_COUNT,
  },
  [TagType.Anchor]: {},
};
const TAGS_ITEM_LEAD_INSTRUCTION_HINT: TagDataMap = {
  [TagType.ItemLead]: {
    maxCount: 2,
  },
  [TagType.Instruction]: {},
  [TagType.Hint]: {},
};
const TAGS_PROPERTY_EXAMPLE: TagDataMap = {
  [PropertyConfigKey._example]: {
    isProperty: true,
  },
};

const TAGS_DEFAULT: TagDataMap = {
  ...TAGS_ALL_BITS,
  ...TAGS_ITEM_LEAD_INSTRUCTION_HINT,
  ...TAGS_PROPERTY_EXAMPLE,
};

export { TAGS_DEFAULT, TAGS_ALL_BITS, TAGS_ITEM_LEAD_INSTRUCTION_HINT, TAGS_PROPERTY_EXAMPLE };
