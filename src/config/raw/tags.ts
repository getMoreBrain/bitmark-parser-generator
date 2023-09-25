import { _TagsConfig } from '../../model/config/_Config';
import { ConfigKey } from '../../model/config/enum/ConfigKey';
import { Tag } from '../../model/enum/Tag';

const TAGS: _TagsConfig = {
  [ConfigKey._tag_title]: {
    tag: Tag.title,
  },
  [ConfigKey._tag_anchor]: {
    tag: Tag.anchor,
  },
  [ConfigKey._tag_reference]: {
    tag: Tag.reference,
  },
  [ConfigKey._tag_property]: {
    tag: Tag.property,
  },
  [ConfigKey._tag_itemLead]: {
    tag: Tag.itemLead,
  },
  [ConfigKey._tag_instruction]: {
    tag: Tag.instruction,
  },
  [ConfigKey._tag_hint]: {
    tag: Tag.hint,
  },
  [ConfigKey._tag_true]: {
    tag: Tag.true,
  },
  [ConfigKey._tag_false]: {
    tag: Tag.false,
  },
  [ConfigKey._tag_sampleSolution]: {
    tag: Tag.sampleSolution,
  },
  [ConfigKey._tag_gap]: {
    tag: Tag.gap,
  },
  [ConfigKey._tag_mark]: {
    tag: Tag.mark,
  },
  [ConfigKey._tag_resource]: {
    tag: Tag.resource,
  },
  [ConfigKey._tag_remark]: {
    tag: Tag.remark,
  },
  [ConfigKey._tag_comment]: {
    tag: Tag.comment,
  },
};

export { TAGS };
