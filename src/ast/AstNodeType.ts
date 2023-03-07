import { EnumType, superenum } from '@ncoderz/superenum';

const AstNodeType = superenum({
  unknown: 'unknown', // unknown

  // Non-terminal
  bitmark: 'bitmark', // bitmark
  bit: 'bit', // bit
  bits: 'bits', // bit plus its child bits
  bitsArray: 'bitsArray', // array of bit plus its child bits
  bitArray: 'bitArray', // array of bits
  bitHeader: 'bitHeader', // bit header, e.g. [.article:bitmark++&image:jpg]
  bitElements: 'bitElements', // array of bit elements
  property: 'property',
  textElements: 'textElements', // array of text elements
  placeholder: 'placeholder', // placeholder that is replaced in text (naming ???)
  placeholderHeader: 'placeholderHeader', // placeholder header, e.g. cloze gap [_Klassenbester]

  // Terminal
  bitType: 'bitType', // bit type (e.g. . % ? ! + - _)
  bitBitType: 'bitBitType', // bit bit type (e.g. article, cloze)
  bitKey: 'bitKey', // bitKey (a string that represents the text of a bit after the type)
  bitValue: 'bitValue', // bitValue (a string that represents the text of a bit after the bitKey)
  bitAttachmentType: 'bitAttachmentType', // bit attachment type
  textFormat: 'textFormat', // text format
  key: 'key', // key (a string that represents a key)
  value: 'value', // value (a string that represents a value)
  item: 'item', // item (a string that represents a item)
  lead: 'lead', // lead (a string that represents a lead)
  statement: 'statement', // statement (a string that represents a true/false statement)
  hint: 'hint', // hint (a string that represents a hint)
  instruction: 'instruction', // instruction (a string that represents a instruction)
  text: 'text', // text (bitmark++ or bitmark-- ???)
  placeholderType: 'placeholderType', // placeholder type
  // nl: 'nl', // new-line
});

export type AstNodeTypeType = EnumType<typeof AstNodeType>;

export { AstNodeType };
