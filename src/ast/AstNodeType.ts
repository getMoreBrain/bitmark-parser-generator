import { EnumType, superenum } from '@ncoderz/superenum';

const AstNodeType = superenum({
  unknown: 'unknown', // unknown

  // Non-terminal
  bitmark: 'bitmark', // bitmark
  bit: 'bit', // bit
  properties: 'properties',
  property: 'property',
  propertyValues: 'propertyValues',
  itemLead: 'itemLead',
  body: 'body',
  gap: 'gap',
  select: 'select',
  elements: 'elements',
  solutions: 'solutions',
  selectOptions: 'selectOptions',
  selectOption: 'selectOption',
  statements: 'statements',
  statement: 'statement',
  choices: 'choices',
  choice: 'choice',
  responses: 'responses',
  response: 'response',
  quizzes: 'quizzes',
  quiz: 'quiz',

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
  element: 'element',
  solution: 'solution',
  prefix: 'prefix',
  postfix: 'postfix',
  isCaseSensitive: 'isCaseSensitive',
  isCorrect: 'isCorrect',
  text: 'text',
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
