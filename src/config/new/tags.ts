import { _TagsConfig } from '../../model/config/RawConfig';
import { TagConfigKey } from '../../model/config/TagConfigKey';

const TAGS: _TagsConfig = {
  [TagConfigKey._title]: {
    tag: '#',
  },
  [TagConfigKey._anchor]: {
    tag: '▼',
  },
  [TagConfigKey._reference]: {
    tag: '►',
  },
  [TagConfigKey._property]: {
    tag: '@',
  },
  [TagConfigKey._itemLead]: {
    tag: '%',
  },
  [TagConfigKey._instruction]: {
    tag: '!',
  },
  [TagConfigKey._hint]: {
    tag: '?',
  },
  [TagConfigKey._true]: {
    tag: '+',
  },
  [TagConfigKey._false]: {
    tag: '-',
  },
  [TagConfigKey._sampleSolution]: {
    tag: '$',
  },
  [TagConfigKey._gap]: {
    tag: '_',
  },
  [TagConfigKey._mark]: {
    tag: '=',
  },
  [TagConfigKey._resource]: {
    tag: '&',
  },
  [TagConfigKey._remark]: {
    tag: '::',
  },
  [TagConfigKey._comment]: {
    tag: '||',
  },
};

export { TAGS };
