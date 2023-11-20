import { EnumType, superenum } from '@ncoderz/superenum';

/**
 * Config keys for tags
 */
const tagConfigKeys = {
  title: 'title',
  anchor: 'anchor',
  tag_reference: 'tag_reference',
  property: 'property',
  itemLead: 'itemLead',
  instruction: 'instruction',
  hint: 'hint',
  true: 'true',
  false: 'false',
  sampleSolution: 'sampleSolution',
  gap: 'gap',
  tag_mark: 'tag_mark',
  resource: 'resource',
} as const;

const TagConfigKey = superenum(tagConfigKeys);

export type TagConfigKeyType = EnumType<typeof TagConfigKey>;

export { TagConfigKey, tagConfigKeys };
