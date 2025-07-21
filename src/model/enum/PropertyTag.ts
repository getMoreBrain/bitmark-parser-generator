import { type EnumType, superenum } from '@ncoderz/superenum';

import { propertyConfigKeys } from '../config/enum/PropertyConfigKey.ts';

const PropertyTag = superenum({
  ...propertyConfigKeys,
  tag_mark: 'mark',
  tag_reference: 'reference',
  tag_sampleSolution: 'sampleSolution',
  tag_title: 'title',
});

export type PropertyTagType = EnumType<typeof PropertyTag>;

export { PropertyTag };
