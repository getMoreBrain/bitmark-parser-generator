import { EnumType, superenum } from '@ncoderz/superenum';

const Tag = superenum({
  tag_title: '#',
  tag_anchor: '▼',
  tag_reference: '►',
  tag_property: '@',
  tag_itemLead: '%',
  tag_instruction: '!',
  tag_hint: '?',
  tag_true: '+',
  tag_false: '-',
  tag_sampleSolution: '$',
  tag_gap: '_',
  tag_mark: '=',
  tag_resource: '&',
});

export type TagType = EnumType<typeof Tag>;

export { Tag };
