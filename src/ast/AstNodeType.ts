import { EnumType, superenum } from '@ncoderz/superenum';

const AstNodeType = superenum({
  unknown: 'unknown', // unknown

  // Non-terminal
  bitmark: 'bitmark', // bitmark
  bit: 'bit', // bit
  bitHeader: 'bitHeader', // bit header, e.g. [.article:bitmark++&image:jpg]
  bitElementArray: 'bitElementArray', // array of bit elements
  property: 'property',
  // article: 'article',
  // op: 'op', // Open  [ ... ]
  // opd: 'opd', // Open dot  [. ... ]
  // opa: 'opa', // Open at [@ ... ]
  // cl: 'cl', // ]

  // Terminal
  bitType: 'bitType', // bit type
  textFormat: 'textFormat', // text format
  attachmentType: 'attachmentType', // attachment type
  key: 'key', // key (a string that represents a key)
  value: 'value', // value (a string that represents a value)
  item: 'item', // item (a string that represents a item)
  instruction: 'instruction', // instruction (a string that represents a instruction)
  text: 'text', // text (maybe needs to be split up???)
  // nl: 'nl', // new-line
});

export type AstNodeTypeType = EnumType<typeof AstNodeType>;

export { AstNodeType };
