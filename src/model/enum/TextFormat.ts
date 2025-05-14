import { EnumType, superenum } from '@ncoderz/superenum';

const TextFormat = superenum({
  tag: 'tag', // tag, [only end of tag `]` will be breakscaped]
  text: 'text', // plain text [only start of new bits `[.` will be breakscaped]
  latex: 'latex', // LaTeX code [breakscaping same as plain text]
  json: 'json', // json as text [breakscaping same as plain text]
  xml: 'xml', // xml as text [breakscaping same as plain text]
  bitmarkMinusMinus: 'bitmark--', // bitmark-- text, all bitmark and bitmark-- text will be breakscaped
  bitmarkPlusPlus: 'bitmark++', // bitmark-- text, all bitmark, bitmark-- and bitmark++ text will be breakscaped
});

export type TextFormatType = EnumType<typeof TextFormat>;

export { TextFormat };
