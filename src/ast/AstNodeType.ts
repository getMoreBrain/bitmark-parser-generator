import { EnumType, superenum } from '@ncoderz/superenum';

const AstNodeType = superenum({
  unknown: 'unknown', // unknown

  // Non-terminal
  bitmark: 'bitmark', // bitmark
  bit: 'bit', // bit
  bits: 'bits', // bit plus its child bits

  // Terminal
  bitType: 'bitType', // bit type (e.g. . % ? ! + - _)
  bitBitType: 'bitBitType', // bit bit type (e.g. article, cloze)
  bitKey: 'bitKey', // bitKey (a string that represents the text of a bit after the type)
  bitValue: 'bitValue', // bitValue (a string that represents the text of a bit after the bitKey)
  bitAttachmentType: 'bitAttachmentType', // bit attachment type
});

export type AstNodeTypeType = EnumType<typeof AstNodeType>;

export { AstNodeType };
