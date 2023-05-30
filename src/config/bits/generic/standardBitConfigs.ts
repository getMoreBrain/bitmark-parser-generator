import { INFINITE_COUNT, TagDataMap } from '../../../model/config/TagData';
import { PropertyKey } from '../../../model/enum/PropertyKey';
import { TagType } from '../../../model/enum/TagType';

const TAGS_STANDARD_PROPERTIES: TagDataMap = {
  [PropertyKey.id]: {
    isProperty: true,
  },
  [PropertyKey.externalId]: {
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
  ...TAGS_STANDARD_PROPERTIES,
  ...TAGS_ITEM_LEAD_INSTRUCTION_HINT,
  ...TAGS_PROPERTY_EXAMPLE,
};

export { TAGS_DEFAULT, TAGS_STANDARD_PROPERTIES, TAGS_ITEM_LEAD_INSTRUCTION_HINT, TAGS_PROPERTY_EXAMPLE };
