import { EnumType, superenum } from '@ncoderz/superenum';

const Tag = superenum({
  title: '#',
  anchor: '▼',
  reference: '►',
  property: '@',
  itemLead: '%',
  instruction: '!',
  hint: '?',
  true: '+',
  false: '-',
  sampleSolution: '$',
  gap: '_',
  mark: '=',
  resource: '&',
  remark: '::',
  comment: '||',
});

export type TagType = EnumType<typeof Tag>;

export { Tag };
