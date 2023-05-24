import { PropertyKey } from '../../model/enum/PropertyKey';
import { TagType } from '../../model/enum/TagType';

const TAGS_ID = [PropertyKey.id, PropertyKey.externalId];
const TAGS_ITEM_LEAD_INSTRUCTION_HINT = [TagType.ItemLead, TagType.Instruction, TagType.Hint];
const TAGS_EXAMPLE = [PropertyKey.example];
const TAGS_DEFAULT = [...TAGS_ID, ...TAGS_ITEM_LEAD_INSTRUCTION_HINT, ...TAGS_EXAMPLE];

export { TAGS_ID, TAGS_ITEM_LEAD_INSTRUCTION_HINT, TAGS_EXAMPLE, TAGS_DEFAULT };
