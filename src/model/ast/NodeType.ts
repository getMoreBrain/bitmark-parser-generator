import { EnumType, superenum } from '@ncoderz/superenum';

/**
 * Defines the type of a node in the AST.
 * All valid node types should be defined here.
 *
 * @enum
 */
const NodeType = superenum({
  unknown: 'unknown', // unknown

  bitType: 'bitType', // bit type
  alias: 'alias', // bit type (alias)
  root: 'root', // bit type (root)
  textFormat: 'textFormat',

  bitmarkAst: 'bitmarkAst', // bitmarkAst
  bits: 'bits', // bits
  bitsValue: 'bitsValue', // bit
  properties: 'properties',
  property: 'property',
  propertyValues: 'propertyValues',
  itemLead: 'itemLead',

  body: 'body',
  bodyParts: 'bodyParts',
  bodyPartsValue: 'bodyPartsValue',
  bodyPartText: 'bodyPartText',
  data: 'data',
  bodyText: 'bodyText',
  footer: 'footer',
  footerText: 'footerText',
  gap: 'gap',
  select: 'select',
  highlight: 'highlight',

  cardNode: 'cardNode',
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

  // Properties
  id: 'id',
  idValue: 'idValue',
  externalId: 'externalId',
  externalIdValue: 'externalIdValue',
  spaceId: 'spaceId',
  spaceIdValue: 'spaceIdValue',
  releaseVersion: 'releaseVersion',
  releaseVersionValue: 'releaseVersionValue',
  padletId: 'padletId',
  padletIdValue: 'padletIdValue',
  aiGenerated: 'aiGenerated',
  aiGeneratedValue: 'aiGeneratedValue',
  ageRange: 'ageRange',
  ageRangeValue: 'ageRangeValue',
  language: 'language',
  languageValue: 'languageValue',
  computerLanguage: 'computerLanguage',
  computerLanguageValue: 'computerLanguageValue',
  target: 'target',
  targetValue: 'targetValue',
  tag: 'tag',
  tagValue: 'tagValue',
  icon: 'icon',
  iconValue: 'iconValue',
  iconTag: 'iconTag',
  iconTagValue: 'iconTagValue',
  colorTag: 'colorTag',
  colorTagValue: 'colorTagValue',
  flashcardSet: 'flashcardSet',
  flashcardSetValue: 'flashcardSetValue',
  subtype: 'subtype',
  subtypeValue: 'subtypeValue',
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
  textReference: 'textReference',
  textReferenceValue: 'textReferenceValue',
  isTracked: 'isTracked',
  isTrackedValue: 'isTrackedValue',
  isInfoOnly: 'isInfoOnly',
  isInfoOnlyValue: 'isInfoOnlyValue',
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
  isDefaultExample: 'isDefaultExample',
  isExample: 'isExample',
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
  reaction: 'reaction',
  feedback: 'feedback',

  // Partner
  partner: 'partner',
  name: 'name',
  avatarImage: 'avatarImage',

  // Mark
  markConfig: 'markConfig',
  markConfigValue: 'markConfigValue',
  solution: 'solution',
  mark: 'mark',
  color: 'color',
  emphasis: 'emphasis',

  // Flashcard
  flashcards: 'flashcards',
  flashcardsValue: 'flashcardsValue',
  answer: 'answer',
  alternativeAnswers: 'alternativeAnswers',
  alternativeAnswersValue: 'alternativeAnswersValue',

  // Resources
  resource: 'resource',
  resourceType: 'resourceType',
  image: 'image',
  imagePortrait: 'imagePortrait',
  imageLandscape: 'imageLandscape',
  audio: 'audio',
  type: 'type',
  format: 'format',
  value: 'value',
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

  // Text
  textAst: 'textAst',
  textAstValue: 'textAstValue',
  content: 'contentValue',
  contentValue: 'contentValue',
  contentValueValue: 'contentValueValue',
  attrs: 'attrs',
  section: 'section',
  parent: 'parent',
  marks: 'marks',
  marksValue: 'marksValue',
  comment: 'comment',

  // Parser Info / Errors
  parser: 'parser',
  version: 'version',
  bitmarkVersion: 'bitmarkVersion',
  warnings: 'warnings',
  warningsValue: 'warningsValue',
  errors: 'errors',
  errorsValue: 'errorsValue',
  message: 'message',
  // location: 'location', - NOTE: clash with bit.location / error.location (be careful when walking the tree)
  start: 'start',
  end: 'end',
  offset: 'offset',
  line: 'line',
  column: 'column',

  // Markup
  markup: 'markup', // bitmark markup
});

export type NodeTypeType = EnumType<typeof NodeType>;

export { NodeType };
