import { EnumType, superenum } from '@ncoderz/superenum';

const AstNodeType = superenum({
  unknown: 'unknown', // unknown

  // Non-terminal
  bitmark: 'bitmark', // bitmark
  bit: 'bit', // bit
  bitHeader: 'bitHeader', // bit header, e.g. [.article:bitmark++&image:jpg]
  bitElementArray: 'bitElementArray', // array of bit elements
  // article: 'article',
  // op: 'op', // Open  [ ... ]
  // opd: 'opd', // Open dot  [. ... ]
  // opa: 'opa', // Open at [@ ... ]
  // cl: 'cl', // ]

  // Terminal
  type: 'type', // bit type
  format: 'format', // text format
  attachmentType: 'attachmentType', // attachment type
  instruction: 'instruction',
  text: 'text', // text (maybe needs to be split up???)
  // nl: 'nl', // new-line
});

export type AstNodeTypeType = EnumType<typeof AstNodeType>;

export { AstNodeType };
