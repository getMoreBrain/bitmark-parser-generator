import { EnumType, superenum } from '@ncoderz/superenum';

const TextMarkType = superenum({
  bold: 'bold',
  light: 'light',
  italic: 'italic',
  highlight: 'highlight',
});

export type TextMarkTypeType = EnumType<typeof TextMarkType>;

export { TextMarkType };
