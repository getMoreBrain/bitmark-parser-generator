import { EnumType, superenum } from '@ncoderz/superenum';

const TagConfigKey = superenum({
  _unknown: '_unknown',

  _title: '_title',
  _anchor: '_anchor',
  _reference: '_reference',
  _property: '_property',
  _itemLead: '_itemLead',
  _instruction: '_instruction',
  _hint: '_hint',
  _true: '_true',
  _false: '_false',
  _sampleSolution: '_sampleSolution',
  _gap: '_gap',
  _mark: '_mark',
  _resource: '_resource',
  _remark: '_remark',
  _comment: '_comment',
});

export type TagConfigKeyType = EnumType<typeof TagConfigKey>;

export { TagConfigKey };
