import { INFINITE_COUNT, TagDataMap } from '../../../model/config/TagData';
import { PropertyKey } from '../../../model/enum/PropertyKey';
import { TagType } from '../../../model/enum/TagType';

const TAGS_ALL_BITS: TagDataMap = {
  [PropertyKey.id]: {
    isProperty: true,
    maxCount: INFINITE_COUNT,
  },
  [PropertyKey.externalId]: {
    isProperty: true,
    maxCount: INFINITE_COUNT,
  },
  [PropertyKey.aiGenerated]: {
    isProperty: true,
  },
  [PropertyKey.ageRange]: {
    isProperty: true,
    maxCount: INFINITE_COUNT,
  },
  [PropertyKey.language]: {
    isProperty: true,
    maxCount: INFINITE_COUNT,
  },
  [PropertyKey.target]: {
    isProperty: true,
    maxCount: INFINITE_COUNT,
  },
  [PropertyKey.tag]: {
    isProperty: true,
    maxCount: INFINITE_COUNT,
  },
  [PropertyKey.icon]: {
    isProperty: true,
  },
  [PropertyKey.iconTag]: {
    isProperty: true,
  },
  [PropertyKey.colorTag]: {
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
  [PropertyKey.example]: {
    isProperty: true,
  },
};

const TAGS_DEFAULT: TagDataMap = {
  ...TAGS_ALL_BITS,
  ...TAGS_ITEM_LEAD_INSTRUCTION_HINT,
  ...TAGS_PROPERTY_EXAMPLE,
};

export { TAGS_DEFAULT, TAGS_ALL_BITS, TAGS_ITEM_LEAD_INSTRUCTION_HINT, TAGS_PROPERTY_EXAMPLE };
