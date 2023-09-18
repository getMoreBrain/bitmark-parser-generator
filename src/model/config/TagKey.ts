import { EnumType, superenum } from '@ncoderz/superenum';

const TagKey = superenum({
  title: 'title',
  anchor: 'anchor',
  reference: 'reference',
  property: 'property',
  itemLead: 'itemLead',
  instruction: 'instruction',
  hint: 'hint',
  true: 'true',
  false: 'false',
  sampleSolution: 'sampleSolution',
  gap: 'gap',
  mark: 'mark',
  resource: 'resource',
  remark: 'remark',
  comment: 'comment',
});

export type TagKeyType = EnumType<typeof TagKey>;

export { TagKey };
