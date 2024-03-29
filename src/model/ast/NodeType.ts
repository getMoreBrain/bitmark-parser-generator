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
  isCommented: 'isCommented',

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
  cardBits: 'cardBits',
  cardBitsValue: 'cardBitsValue',

  // Properties
  id: 'id',
  idValue: 'idValue',
  internalComment: 'internalComment',
  internalCommentValue: 'internalCommentValue',
  externalId: 'externalId',
  externalIdValue: 'externalIdValue',
  spaceId: 'spaceId',
  spaceIdValue: 'spaceIdValue',
  releaseVersion: 'releaseVersion',
  releaseVersionValue: 'releaseVersionValue',
  releaseKind: 'releaseKind',
  releaseKindValue: 'releaseKindValue',
  releaseDate: 'releaseDate',
  releaseDateValue: 'releaseDateValue',
  padletId: 'padletId',
  padletIdValue: 'padletIdValue',
  jupyterId: 'jupyterId',
  jupyterIdValue: 'jupyterIdValue',
  jupyterExecutionCount: 'jupyterExecutionCount',
  jupyterExecutionCountValue: 'jupyterExecutionCountValue',
  aiGenerated: 'aiGenerated',
  aiGeneratedValue: 'aiGeneratedValue',
  ageRange: 'ageRange',
  ageRangeValue: 'ageRangeValue',
  lang: 'lang',
  langValue: 'langValue',
  language: 'language',
  languageValue: 'languageValue',
  publisher: 'publisher',
  publisherValue: 'publisherValue',
  publisherName: 'publisherName',
  publisherNameValue: 'publisherNameValue',
  theme: 'theme',
  themeValue: 'themeValue',
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
  bookAlias: 'bookAlias',
  bookAliasValue: 'bookAliasValue',
  coverImage: 'coverImage',
  coverImageValue: 'coverImageValue',
  coverColor: 'coverColor',
  coverColorValue: 'coverColorValue',
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
  kind: 'kind',
  kindValue: 'kindValue',
  blockId: 'blockId',
  blockIdValue: 'blockIdValue',
  pageNo: 'pageNo',
  pageNoValue: 'pageNoValue',
  x: 'x',
  xValue: 'xValue',
  y: 'y',
  yValue: 'yValue',
  width: 'width',
  widthValue: 'widthValue',
  height: 'height',
  heightValue: 'heightValue',
  index: 'index',
  indexValue: 'indexValue',
  classification: 'classification',
  classificationValue: 'classificationValue',
  availableClassifications: 'availableClassifications',
  availableClassificationsValue: 'availableClassificationsValue',
  tableFixedHeader: 'tableFixedHeader',
  tableFixedHeaderValue: 'tableFixedHeaderValue',
  tableSearch: 'tableSearch',
  tableSearchValue: 'tableSearchValue',
  tableSort: 'tableSort',
  tableSortValue: 'tableSortValue',
  tablePagination: 'tablePagination',
  tablePaginationValue: 'tablePaginationValue',
  tablePaginationLimit: 'tablePaginationLimit',
  tablePaginationLimitValue: 'tablePaginationLimitValue',
  tableHeight: 'tableHeight',
  tableHeightValue: 'tableHeightValue',
  tableWhitespaceNoWrap: 'tableWhitespaceNoWrap',
  tableWhitespaceNoWrapValue: 'tableWhitespaceNoWrapValue',
  tableAutoWidth: 'tableAutoWidth',
  tableAutoWidthValue: 'tableAutoWidthValue',
  tableResizableColumns: 'tableResizableColumns',
  tableResizableColumnsValue: 'tableResizableColumnsValue',
  quizCountItems: 'quizCountItems',
  quizCountItemsValue: 'quizCountItemsValue',
  quizStrikethroughSolutions: 'quizStrikethroughSolutions',
  quizStrikethroughSolutionsValue: 'quizStrikethroughSolutionsValue',
  codeLineNumbers: 'codeLineNumbers',
  codeLineNumbersValue: 'codeLineNumbersValue',
  codeMinimap: 'codeMinimap',
  codeMinimapValue: 'codeMinimapValue',
  table: 'table',
  columns: 'columns',
  columnsValue: 'columnsValue',
  rows: 'rows',
  rowsValue: 'rowsValue',
  rowsValueValue: 'rowsValueValue',
  action: 'action',
  actionValue: 'actionValue',
  thumbImage: 'thumbImage',
  thumbImageValue: 'thumbImageValue',
  scormSource: 'scormSource',
  scormSourceValue: 'scormSourceValue',
  posterImage: 'posterImage',
  posterImageValue: 'posterImageValue',
  focusX: 'focusX',
  focusXValue: 'focusXValue',
  focusY: 'focusY',
  focusYValue: 'focusYValue',
  pointerLeft: 'pointerLeft',
  pointerLeftValue: 'pointerLeftValue',
  pointerTop: 'pointerTop',
  pointerTopValue: 'pointerTopValue',
  backgroundWallpaper: 'backgroundWallpaper',
  backgroundWallpaperValue: 'backgroundWallpaperValue',
  duration: 'duration',
  durationValue: 'durationValue',
  deeplink: 'deeplink',
  deeplinkValue: 'deeplinkValue',
  externalLink: 'externalLink',
  externalLinkText: 'externalLinkText',
  videoCallLink: 'videoCallLink',
  videoCallLinkValue: 'videoCallLinkValue',
  vendorUrl: 'vendorUrl',
  vendorUrlValue: 'vendorUrlValue',
  search: 'search',
  searchValue: 'searchValue',
  bot: 'bot',
  botValue: 'botValue',
  referenceProperty: 'referenceProperty',
  referencePropertyValue: 'referencePropertyValue',
  ingredients: 'ingredients',
  ingredientsValue: 'ingredientsValue',
  list: 'list',
  listValue: 'listValue',
  textReference: 'textReference',
  textReferenceValue: 'textReferenceValue',
  isTracked: 'isTracked',
  isTrackedValue: 'isTrackedValue',
  isInfoOnly: 'isInfoOnly',
  isInfoOnlyValue: 'isInfoOnlyValue',
  labelTrue: 'labelTrue',
  labelTrueValue: 'labelTrueValue',
  labelFalse: 'labelFalse',
  labelFalseValue: 'labelFalseValue',
  content2Buy: 'content2Buy',
  mailingList: 'mailingList',
  buttonCaption: 'buttonCaption',
  buttonCaptionValue: 'buttonCaptionValue',
  caption: 'caption',
  captionValue: 'captionValue',
  quotedPerson: 'quotedPerson',
  partialAnswer: 'partialAnswer',
  partialAnswerValue: 'partialAnswerValue',
  reasonableNumOfChars: 'reasonableNumOfChars',
  reasonableNumOfCharsValue: 'reasonableNumOfCharsValue',
  resolved: 'resolved',
  resolvedValue: 'resolvedValue',
  resolvedDate: 'resolvedDate',
  resolvedDateValue: 'resolvedDateValue',
  resolvedBy: 'resolvedBy',
  resolvedByValue: 'resolvedByValue',
  maxCreatedBits: 'maxCreatedBits',
  maxCreatedBitsValue: 'maxCreatedBitsValue',
  maxDisplayLevel: 'maxDisplayLevel',
  maxDisplayLevelValue: 'maxDisplayLevelValue',
  product: 'product',
  productValue: 'productValue',
  productList: 'productList',
  productListValue: 'productListValue',
  productVideo: 'productVideo',
  productVideoValue: 'productVideoValue',
  productVideoList: 'productVideoList',
  productVideoListValue: 'productVideoListValue',
  productFolder: 'productFolder',
  productFolderValue: 'productFolderValue',
  technicalTerm: 'technicalTerm',
  technicalTermValue: 'technicalTermValue',
  servings: 'servings',
  servingsValue: 'servingsValue',

  book: 'book',

  item: 'item',
  lead: 'lead',
  pageNumber: 'pageNumber',
  marginNumber: 'marginNumber',
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
  anchor: 'anchor',
  reference: 'reference',
  referenceEnd: 'referenceEnd',

  elementsValue: 'elementsValue',
  solutionsValue: 'solutionsValue',
  prefix: 'prefix',
  postfix: 'postfix',
  isCaseSensitive: 'isCaseSensitive',
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
  checked: 'checked',
  quantity: 'quantity',
  unit: 'unit',
  unitAbbr: 'unitAbbr',
  decimalPlaces: 'decimalPlaces',
  disableCalculation: 'disableCalculation',

  // ImageSource
  imageSource: 'imageSource',
  mockupId: 'mockupId',
  size: 'size',
  trim: 'trim',

  // Person
  person: 'person',
  name: 'name',
  // title: 'title',
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
  resourceType: 'resourceType',
  resources: 'resources',
  resourcesValue: 'resourcesValue',
  image: 'image',
  imagePortrait: 'imagePortrait',
  imageLandscape: 'imageLandscape',
  audio: 'audio',
  type: 'type',
  typeAlias: 'typeAlias',
  format: 'format',
  value: 'value',
  url: 'url',
  src: 'src',
  src1x: 'src1x',
  src2x: 'src2x',
  src3x: 'src3x',
  src4x: 'src4x',
  // width: 'width',
  // height: 'height',
  alt: 'alt',
  zoomDisabled: 'zoomDisabled',
  license: 'license',
  copyright: 'copyright',
  provider: 'provider',
  showInIndex: 'showInIndex',
  // duration: 'duration', - NOTE: clash with bit.duration / resource...duration (be careful when walking the tree)
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
  alignment: 'alignment',
  textAlign: 'textAlign',
  class: 'class',
  href: 'href',

  // Parser Info / Errors
  parser: 'parser',
  version: 'version',
  bitmarkVersion: 'bitmarkVersion',
  commentedBitType: 'commentedBitType',
  warnings: 'warnings',
  warningsValue: 'warningsValue',
  errors: 'errors',
  errorsValue: 'errorsValue',
  message: 'message',
  // location: 'location', - NOTE: clash with bit.location / error.location (be careful when walking the tree)
  original: 'original',
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
