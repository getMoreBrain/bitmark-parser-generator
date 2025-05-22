import { EnumType, superenum } from '@ncoderz/superenum';

// TODO: https://github.com/getMoreBrain/cosmic/issues/7941 Drop bitmark--
// replace bitmark-- and bitmark++ with bitmarkText - there is only one type
// For breakscaping, bitmarkText in the body is bitmark++ and bitmarkText in a tag is bitmark+

const TextFormat = superenum({
  // plain text
  // [only start of new bits at start of lines `[.` will be (un)breakscaped]
  //  - breakscaping: only start of new bits at start of lines `[.` will be breakscaped
  //  - unbreakscaping: only start of new bits at start of lines `[^.`, `[^^.`, etc will be unbreakscaped
  text: 'text',
  latex: 'latex', // LaTeX code, alias for text
  json: 'json', // json, alias for text
  xml: 'xml', // xml, alias for text

  // bitmark-- text
  //  - breakscaping: bitmark tags and bitmark-- text tags will be breakscaped
  //  - unbreakscaping: every `^` will be unbreakscaped
  bitmarkMinusMinus: 'bitmark--',

  // bitmark++ text
  //  - breakscaping: bitmark tags and bitmark--/++ text tags will be breakscaped
  //  - unbreakscaping: every `^` will be unbreakscaped
  bitmarkPlusPlus: 'bitmark++',
});

export type TextFormatType = EnumType<typeof TextFormat>;

export { TextFormat };
