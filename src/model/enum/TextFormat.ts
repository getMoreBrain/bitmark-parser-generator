import { EnumType, superenum } from '@ncoderz/superenum';

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
