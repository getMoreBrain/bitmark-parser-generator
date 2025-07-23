import { type EnumType, superenum } from '@ncoderz/superenum';

const tags = {
  tag_title: '#',
  tag_anchor: '▼',
  tag_reference: '►',
  tag_property: '@',
  tag_item: '%',
  tag_instruction: '!',
  tag_hint: '?',
  tag_true: '+',
  tag_false: '-',
  tag_sampleSolution: '$',
  tag_gap: '_',
  tag_mark: '=',
  tag_resource: '&',
} as const;

const Tag = superenum(tags);

export type TagType = EnumType<typeof Tag>;

export { Tag, tags };
