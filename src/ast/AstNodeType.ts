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
  footer: 'footer',
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
  questions: 'questions',
  questionsValue: 'questionsValue',

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

  ids: 'ids',
  idsValue: 'idsValue',
  ageRanges: 'ageRanges',
  ageRangesValue: 'ageRangesValue',
  languages: 'languages',
  languagesValue: 'languagesValue',
  computerLanguages: 'computerLanguages',
  computerLanguagesValue: 'computerLanguagesValue',
  publishers: 'publishers',
  publishersValue: 'publishersValue',
  publications: 'publications',
  publicationsValue: 'publicationsValue',
  authors: 'authors',
  authorsValue: 'authorsValue',
  dates: 'dates',
  datesValue: 'datesValue',
  locations: 'locations',
  locationsValue: 'locationsValue',
  themes: 'themes',
  themesValue: 'themesValue',
  kinds: 'kinds',
  kindsValue: 'kindsValue',
  actions: 'actions',
  actionsValue: 'actionsValue',
  durations: 'durations',
  durationsValue: 'durationsValue',
  deepLinks: 'deepLinks',
  deepLinksValue: 'deepLinksValue',
  videoCallLinks: 'videoCallLinks',
  videoCallLinksValue: 'videoCallLinksValue',
  bots: 'bots',
  botsValue: 'botsValue',
  referenceProperties: 'referenceProperties',
  referencePropertiesValue: 'referencePropertiesValue',

  item: 'item',
  lead: 'lead',
  hint: 'hint',
  instruction: 'instruction',
  example: 'example',

  title: 'title',
  level: 'level',
  toc: 'toc',
  progress: 'progress',
  anchor: 'anchor',
  reference: 'reference',

  bodyText: 'bodyText',
  footerText: 'footerText',
  elementsValue: 'elementsValue',
  solutionsValue: 'solutionsValue',
  prefix: 'prefix',
  postfix: 'postfix',
  isCaseSensitive: 'isCaseSensitive',
  isLongAnswer: 'isLongAnswer',
  isShortAnswer: 'isShortAnswer',
  isCorrect: 'isCorrect',
  key: 'key',
  valuesValue: 'valuesValue',
  question: 'question',
  partialAnswer: 'partialAnswer',
  sampleSolution: 'sampleSolution',
  statementText: 'statementText',
  text: 'text',
  propertyKey: 'propertyKey',
  propertyValue: 'propertyValue',

  // Resources
  type: 'type',
  format: 'format',
  url: 'url',
  src: 'src',
  src1x: 'src1x',
  src2x: 'src2x',
  src3x: 'src3x',
  src4x: 'src4x',
  width: 'width',
  height: 'height',
  duration: 'duration',
  posterImage: 'posterImage',
  thumbnails: 'thumbnails',
  thumbnailsValue: 'thumbnailsValue',
} as const;

export type AstNodeTypeKeys = keyof typeof AstNodeTypeRaw;
const AstNodeType = superenum(AstNodeTypeRaw);

export type AstNodeTypeType = EnumType<typeof AstNodeType>;

export { AstNodeType, AstNodeTypeRaw };
