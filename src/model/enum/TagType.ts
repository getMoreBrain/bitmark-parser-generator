import { EnumType, superenum } from '@ncoderz/superenum';

const TagType = superenum({
  Title: 'Title',
  Anchor: 'Anchor',
  Reference: 'Reference',
  Property: 'Property',
  ItemLead: 'ItemLead',
  Instruction: 'Instruction',
  Hint: 'Hint',
  True: 'True',
  False: 'False',
  SampleSolution: 'SampleSolution',
  Gap: 'Gap',
  Resource: 'Resource',
  Remark: 'Remark',
  Comment: 'Comment',
});

export type TagTypeType = EnumType<typeof TagType>;

export { TagType };
