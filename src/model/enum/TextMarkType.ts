import { EnumType, superenum } from '@ncoderz/superenum';

const TextMarkType = superenum({
  // Styles
  bold: 'bold',
  light: 'light',
  italic: 'italic',
  highlight: 'highlight',

  // Inline only styles
  strike: 'strike',
  sub: 'sub',
  super: 'super',
  ins: 'ins',
  del: 'del',

  link: 'link',
  var: 'var',
  code: 'code',
  color: 'color',
  hash: '#',
  comment: 'comment',
});

export type TextMarkTypeType = EnumType<typeof TextMarkType>;

export { TextMarkType };
