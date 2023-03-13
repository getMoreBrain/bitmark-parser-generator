import { EnumType, superenum } from '@ncoderz/superenum';

const AstNodeType = superenum({
  unknown: 'unknown', // unknown

  // Non-terminal
  bitmark: 'bitmark', // bitmark
  bit: 'bit', // bit
  bitHeader: 'bitHeader', // bitHeader
  properties: 'properties',
  property: 'property',
  propertyValues: 'propertyValues',
  itemLead: 'itemLead',
  body: 'body',
  gap: 'gap',
  select: 'select',
  solutions: 'solutions',
  selectOptions: 'selectOptions',
  selectOption: 'selectOption',
  choices: 'choices',
  choice: 'choice',

  // Terminal (leaf)
  markup: 'markup', // bitmark markup
  bitType: 'bitType', // bit type
  attachmentType: 'attachmentType', // bit attachment type
  textFormat: 'textFormat',
  item: 'item',
  lead: 'lead',
  hint: 'hint',
  instruction: 'instruction',
  example: 'example',
  bodyText: 'bodyText',
  solution: 'solution',
  prefix: 'prefix',
  postfix: 'postfix',
  isCaseSensitive: 'isCaseSensitive',
  isCorrect: 'isCorrect',
  selectOptionText: 'selectOptionText',
  choiceText: 'choiceText',
  propertyKey: 'propertyKey',
  propertyValue: 'propertyValue',
  ids: 'ids',
  ageRanges: 'ageRanges',
  languages: 'languages',
  resource: 'resource',
  // resourceType: 'resourceType',
  // imageResource: 'imageResource',
  // audioResource: 'audioResource',
  // videoResource: 'videoResource',
  // text: 'text',
  // number: 'number',
  // boolean: 'boolean',
});

export type AstNodeTypeType = EnumType<typeof AstNodeType>;

export { AstNodeType };
