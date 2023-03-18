import { EnumType, superenum } from '@ncoderz/superenum';

const AstNodeTypeRaw = {
  unknown: 'unknown', // unknown

  // Non-terminal
  bitmark: 'bitmark', // bitmark
  bits: 'bits', // bits
  bitsValue: 'bitsValue', // bit
  properties: 'properties',
  property: 'property',
  propertyValues: 'propertyValues',
  itemLead: 'itemLead',
  body: 'body',
  bodyValue: 'bodyValue',
  gap: 'gap',
  select: 'select',
  elements: 'elements',
  solutions: 'solutions',
  options: 'options',
  optionsValue: 'optionsValue',
  statements: 'statements',
  statementsValue: 'statementsValue',
  choices: 'choices',
  choicesValue: 'choicesValue',
  responses: 'responses',
  responsesValue: 'responsesValue',
  quizzes: 'quizzes',
  quiz: 'quiz',
  pairs: 'pairs',
  pairsValue: 'pairsValue',
  values: 'values',

  resource: 'resource',
  resourceType: 'resourceType',
  imageResource: 'imageResource',
  audioResource: 'audioResource',
  videoResource: 'videoResource',

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
  elementsValue: 'elementsValue',
  solutionsValue: 'solutionsValue',
  prefix: 'prefix',
  postfix: 'postfix',
  isCaseSensitive: 'isCaseSensitive',
  isLongAnswer: 'isLongAnswer',
  isCorrect: 'isCorrect',
  key: 'key',
  valuesValue: 'valuesValue',
  statementText: 'statementText',
  text: 'text',
  propertyKey: 'propertyKey',
  propertyValue: 'propertyValue',
  ids: 'ids',
  idsValue: 'idsValue',
  ageRanges: 'ageRanges',
  ageRangesValue: 'ageRangesValue',
  languages: 'languages',
  languagesValue: 'languagesValue',
  // number: 'number',
  // boolean: 'boolean',
} as const;

export type AstNodeTypeKeys = keyof typeof AstNodeTypeRaw;
const AstNodeType = superenum(AstNodeTypeRaw);

export type AstNodeTypeType = EnumType<typeof AstNodeType>;

export { AstNodeType, AstNodeTypeRaw };
