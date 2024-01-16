import { EnumType, superenum } from '@ncoderz/superenum';

const TextMarkType = superenum({
  // Styles
  bold: 'bold',
  light: 'light',
  italic: 'italic',
  highlight: 'highlight',

  // Inline only styles
  strike: 'strike',
  subscript: 'subscript',
  superscript: 'superscript',
  ins: 'ins',
  del: 'del',
  underline: 'underline',
  doubleUnderline: 'doubleUnderline',
  circle: 'circle',
  languageEm: 'languageEm',
  userUnderline: 'userUnderline',
  userDoubleUnderline: 'userDoubleUnderline',
  userStrike: 'userStrike',
  userCircle: 'userCircle',
  userHighlight: 'userHighlight',

  link: 'link',
  var: 'var',
  code: 'code',
  timer: 'timer',
  duration: 'duration',
  color: 'color',
  hash: '#',
  comment: 'comment',
});

export type TextMarkTypeType = EnumType<typeof TextMarkType>;

export { TextMarkType };
