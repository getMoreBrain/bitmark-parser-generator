import { type EnumType, superenum } from '@ncoderz/superenum';

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
  languageEmRed: 'languageEmRed',
  languageEmOrange: 'languageEmOrange',
  languageEmYellow: 'languageEmYellow',
  languageEmGreen: 'languageEmGreen',
  languageEmBlue: 'languageEmBlue',
  languageEmPurple: 'languageEmPurple',
  languageEmPink: 'languageEmPink',
  languageEmBrown: 'languageEmBrown',
  languageEmBlack: 'languageEmBlack',
  languageEmWhite: 'languageEmWhite',
  languageEmGray: 'languageEmGray',
  languageEm: 'languageEm',
  userUnderline: 'userUnderline',
  userDoubleUnderline: 'userDoubleUnderline',
  userStrike: 'userStrike',
  userCircle: 'userCircle',
  userHighlight: 'userHighlight',
  notranslate: 'notranslate',

  // Attribute chain
  link: 'link',
  ref: 'ref',
  xref: 'xref',
  extref: 'extref',
  footnote: 'footnote',
  footnoteStar: 'footnote*',
  symbol: 'symbol',
  var: 'var',
  code: 'code',
  timer: 'timer',
  duration: 'duration',
  color: 'color',
  comment: 'comment',
});

export type TextMarkTypeType = EnumType<typeof TextMarkType>;

export { TextMarkType };
