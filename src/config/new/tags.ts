import { TagsConfig } from '../../model/config/NewConfig';
import { TagKey } from '../../model/config/TagKey';

const TAGS: TagsConfig = {
  [TagKey.title]: {
    tag: '#',
  },
  [TagKey.anchor]: {
    tag: '▼',
  },
  [TagKey.reference]: {
    tag: '►',
  },
  [TagKey.property]: {
    tag: '@',
  },
  [TagKey.itemLead]: {
    tag: '%',
  },
  [TagKey.instruction]: {
    tag: '!',
  },
  [TagKey.hint]: {
    tag: '?',
  },
  [TagKey.true]: {
    tag: '+',
  },
  [TagKey.false]: {
    tag: '-',
  },
  [TagKey.sampleSolution]: {
    tag: '$',
  },
  [TagKey.gap]: {
    tag: '_',
  },
  [TagKey.mark]: {
    tag: '=',
  },
  [TagKey.resource]: {
    tag: '&',
  },
  [TagKey.remark]: {
    tag: '::',
  },
  [TagKey.comment]: {
    tag: '||',
  },
};

export { TAGS };
