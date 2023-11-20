import { _TagsConfig } from '../../model/config/_Config';
import { TagConfigKey } from '../../model/config/enum/TagConfigKey';
import { Tag } from '../../model/enum/Tag';

const TAGS: _TagsConfig = {
  [TagConfigKey.title]: {
    tag: Tag.title,
  },
  [TagConfigKey.anchor]: {
    tag: Tag.anchor,
  },
  [TagConfigKey.tag_reference]: {
    tag: Tag.reference,
  },
  [TagConfigKey.property]: {
    tag: Tag.property,
  },
  [TagConfigKey.itemLead]: {
    tag: Tag.itemLead,
  },
  [TagConfigKey.instruction]: {
    tag: Tag.instruction,
  },
  [TagConfigKey.hint]: {
    tag: Tag.hint,
  },
  [TagConfigKey.true]: {
    tag: Tag.true,
  },
  [TagConfigKey.false]: {
    tag: Tag.false,
  },
  [TagConfigKey.sampleSolution]: {
    tag: Tag.sampleSolution,
  },
  [TagConfigKey.gap]: {
    tag: Tag.gap,
  },
  [TagConfigKey.tag_mark]: {
    tag: Tag.mark,
  },
  [TagConfigKey.resource]: {
    tag: Tag.resource,
  },
};

export { TAGS };
