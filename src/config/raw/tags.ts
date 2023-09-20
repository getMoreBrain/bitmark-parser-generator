import { _TagsConfig } from '../../model/config/_Config';
import { TagConfigKey } from '../../model/config/enum/TagConfigKey';
import { Tag } from '../../model/enum/Tag';

const TAGS: _TagsConfig = {
  [TagConfigKey._title]: {
    tag: Tag.title,
  },
  [TagConfigKey._anchor]: {
    tag: Tag.anchor,
  },
  [TagConfigKey._reference]: {
    tag: Tag.reference,
  },
  [TagConfigKey._property]: {
    tag: Tag.property,
  },
  [TagConfigKey._itemLead]: {
    tag: Tag.itemLead,
  },
  [TagConfigKey._instruction]: {
    tag: Tag.instruction,
  },
  [TagConfigKey._hint]: {
    tag: Tag.hint,
  },
  [TagConfigKey._true]: {
    tag: Tag.true,
  },
  [TagConfigKey._false]: {
    tag: Tag.false,
  },
  [TagConfigKey._sampleSolution]: {
    tag: Tag.sampleSolution,
  },
  [TagConfigKey._gap]: {
    tag: Tag.gap,
  },
  [TagConfigKey._mark]: {
    tag: Tag.mark,
  },
  [TagConfigKey._resource]: {
    tag: Tag.resource,
  },
  [TagConfigKey._remark]: {
    tag: Tag.remark,
  },
  [TagConfigKey._comment]: {
    tag: Tag.comment,
  },
};

export { TAGS };
