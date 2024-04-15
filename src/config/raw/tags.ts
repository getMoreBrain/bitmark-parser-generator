import { _TagsConfig } from '../../model/config/_Config';
import { TagConfigKey } from '../../model/config/enum/TagConfigKey';
import { Tag } from '../../model/enum/Tag';

const TAGS: _TagsConfig = {
  [TagConfigKey.title]: {
    tag: Tag.tag_title,
  },
  [TagConfigKey.anchor]: {
    tag: Tag.tag_anchor,
  },
  [TagConfigKey.tag_reference]: {
    tag: Tag.tag_reference,
  },
  [TagConfigKey.property]: {
    tag: Tag.tag_property,
  },
  [TagConfigKey.itemLead]: {
    tag: Tag.tag_itemLead,
  },
  [TagConfigKey.instruction]: {
    tag: Tag.tag_instruction,
  },
  [TagConfigKey.hint]: {
    tag: Tag.tag_hint,
  },
  [TagConfigKey.true]: {
    tag: Tag.tag_true,
  },
  [TagConfigKey.false]: {
    tag: Tag.tag_false,
  },
  [TagConfigKey.sampleSolution]: {
    tag: Tag.tag_sampleSolution,
  },
  [TagConfigKey.gap]: {
    tag: Tag.tag_gap,
  },
  [TagConfigKey.tag_mark]: {
    tag: Tag.tag_mark,
  },
  [TagConfigKey.resource]: {
    tag: Tag.tag_resource,
  },
};

export { TAGS };
