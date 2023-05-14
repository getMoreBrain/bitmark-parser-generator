import { EnumType, superenum } from '@ncoderz/superenum';

/**
 *
 * @enum
 */
const NodeType = superenum({
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
  highlight: 'highlight',
  elements: 'elements',
  solutions: 'solutions',
  options: 'options',
  optionsValue: 'optionsValue',
  texts: 'texts',
  textsValue: 'textsValue',
  statement: 'statement',
  statements: 'statements',
  statementsValue: 'statementsValue',
  choices: 'choices',
  choicesValue: 'choicesValue',
  responses: 'responses',
  responsesValue: 'responsesValue',
  quizzes: 'quizzes',
  quizzesValue: 'quizzesValue',
  heading: 'heading',
  forValues: 'forValues',
  pairs: 'pairs',
  pairsValue: 'pairsValue',
  values: 'values',
  matrix: 'matrix',
  matrixValue: 'matrixValue',
  cells: 'cells',
  cellsValue: 'cellsValue',
  questions: 'questions',
  questionsValue: 'questionsValue',
  botResponses: 'botResponses',
  botResponsesValue: 'botResponsesValue',

  resource: 'resource',
  resourceType: 'resourceType',
  imageResource: 'imageResource',
  audioResource: 'audioResource',
  videoResource: 'videoResource',

  // Terminal (leaf)
  markup: 'markup', // bitmark markup
  bitType: 'bitType', // bit type
  textFormat: 'textFormat',

  // Properties
  id: 'id',
  idValue: 'idValue',
  externalId: 'externalId',
  externalIdValue: 'externalIdValue',
  ageRange: 'ageRange',
  ageRangeValue: 'ageRangeValue',
  language: 'language',
  languageValue: 'languageValue',
  computerLanguage: 'computerLanguage',
  computerLanguageValue: 'computerLanguageValue',
  coverImage: 'coverImage',
  coverImageValue: 'coverImageValue',
  publisher: 'publisher',
  publisherValue: 'publisherValue',
  publications: 'publications',
  publicationsValue: 'publicationsValue',
  author: 'author',
  authorValue: 'authorValue',
  subject: 'subject',
  subjectValue: 'subjectValue',
  date: 'date',
  dateValue: 'dateValue',
  location: 'location',
  locationValue: 'locationValue',
  theme: 'theme',
  themeValue: 'themeValue',
  kind: 'kind',
  kindValue: 'kindValue',
  action: 'action',
  actionValue: 'actionValue',
  thumbImage: 'thumbImage',
  thumbImageValue: 'thumbImageValue',
  focusX: 'focusX',
  focusXValue: 'focusXValue',
  focusY: 'focusY',
  focusYValue: 'focusYValue',
  duration: 'duration',
  durationValue: 'durationValue',
  deeplink: 'deeplink',
  deeplinkValue: 'deeplinkValue',
  externalLink: 'externalLink',
  externalLinkText: 'externalLinkText',
  videoCallLink: 'videoCallLink',
  videoCallLinkValue: 'videoCallLinkValue',
  bot: 'bot',
  botValue: 'botValue',
  referenceProperty: 'referenceProperty',
  referencePropertyValue: 'referencePropertyValue',
  list: 'list',
  listValue: 'listValue',
  labelTrue: 'labelTrue',
  labelFalse: 'labelFalse',
  quotedPerson: 'quotedPerson',
  partialAnswer: 'partialAnswer',
  partialAnswerValue: 'partialAnswerValue',

  book: 'book',

  item: 'item',
  lead: 'lead',
  hint: 'hint',
  instruction: 'instruction',
  example: 'example',
  exampleValue: 'exampleValue',

  extraProperties: 'extraProperties',

  title: 'title',
  subtitle: 'subtitle',
  level: 'level',
  toc: 'toc',
  tocValue: 'tocValue',
  progress: 'progress',
  progressValue: 'progressValue',
  levelProperty: 'levelProperty',
  levelPropertyValue: 'LevelPropertyValue',
  anchor: 'anchor',
  reference: 'reference',
  referenceEnd: 'referenceEnd',

  bodyText: 'bodyText',
  footerText: 'footerText',
  elementsValue: 'elementsValue',
  solutionsValue: 'solutionsValue',
  prefix: 'prefix',
  postfix: 'postfix',
  isCaseSensitive: 'isCaseSensitive',
  isShortAnswer: 'isShortAnswer',
  isCorrect: 'isCorrect',
  forKeys: 'forKeys',
  forValuesValue: 'forValuesValue',
  key: 'key',
  valuesValue: 'valuesValue',
  question: 'question',
  sampleSolution: 'sampleSolution',
  sampleSolutionValue: 'sampleSolutionValue',
  statementText: 'statementText',
  text: 'text',
  propertyKey: 'propertyKey',
  propertyValue: 'propertyValue',
  keyAudio: 'keyAudio',
  keyImage: 'keyImage',
  response: 'response',
  feedback: 'feedback',

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
  alt: 'alt',
  license: 'license',
  copyright: 'copyright',
  provider: 'provider',
  showInIndex: 'showInIndex',
  caption: 'caption',
  // duration: 'duration', - NOTE: clash with bit.duration / resource...duration (be careful when walking the tree)
  posterImage: 'posterImage',
  thumbnails: 'thumbnails',
  thumbnailsValue: 'thumbnailsValue',

  // Parser Info / Errors
  parser: 'parser',
  errors: 'errors',
  errorsValue: 'errorsValue',
  message: 'message',
  // location: 'location', - NOTE: clash with bit.location / error.location (be careful when walking the tree)
  start: 'start',
  end: 'end',
  offset: 'offset',
  line: 'line',
  column: 'column',
});

export type NodeTypeType = EnumType<typeof NodeType>;

export { NodeType };
