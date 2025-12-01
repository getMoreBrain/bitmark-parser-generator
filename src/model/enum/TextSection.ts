import { type EnumType } from '@ncoderz/superenum';

const TextSection = {
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
} as const;

export type TextSectionType = EnumType<typeof TextSection>;

export { TextSection };
