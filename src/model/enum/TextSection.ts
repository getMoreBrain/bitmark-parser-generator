import { type EnumType, superenum } from '@ncoderz/superenum';

const TextSection = superenum({
  unknown: '',
  note: 'note',
  remark: 'remark',
  info: 'info',
  hint: 'hint',
  help: 'help',
  warning: 'warning',
  danger: 'danger',
  example: 'example',
  sideNote: 'side-note',
});

export type TextSectionType = EnumType<typeof TextSection>;

export { TextSection };
