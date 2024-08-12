import { EnumType, superenum } from '@ncoderz/superenum';

/**
 * Defines the type of a node in the AST.
 * All valid node types should be defined here.
 *
 * @enum
 */
const NodeType = superenum({
  unknown: 'unknown', // unknown

  action: 'action',
  actionValue: 'actionValue',
  ageRange: 'ageRange',
  ageRangeValue: 'ageRangeValue',
  aiGenerated: 'aiGenerated',
  aiGeneratedValue: 'aiGeneratedValue',
  analyticsTag: 'analyticsTag',
  analyticsTagValue: 'analyticsTagValue',
  disableFeedback: 'disableFeedback',
  disableFeedbackValue: 'disableFeedbackValue',
  alias: 'alias', // bit type (alias)
  alignment: 'alignment',
  alt: 'alt',
  alternativeAnswers: 'alternativeAnswers',
  alternativeAnswersValue: 'alternativeAnswersValue',
  anchor: 'anchor',
  answer: 'answer',
  attrs: 'attrs',
  audio: 'audio',
  author: 'author',
  authorValue: 'authorValue',
  availableClassifications: 'availableClassifications',
  availableClassificationsValue: 'availableClassificationsValue',
  allowedBit: 'allowedBit',
  allowedBitValue: 'allowedBitValue',
  avatarImage: 'avatarImage',
  backgroundWallpaper: 'backgroundWallpaper',
  backgroundWallpaperValue: 'backgroundWallpaperValue',
  hasBookNavigation: 'hasBookNavigation',
  hasBookNavigationValue: 'hasBookNavigationValue',
  bitmarkAst: 'bitmarkAst', // bitmarkAst
  bitmarkVersion: 'bitmarkVersion',
  bits: 'bits', // bits
  bitsValue: 'bitsValue', // bit
  bitLevel: 'bitLevel', // bit level
  bitType: 'bitType', // bit type
  blockId: 'blockId',
  blockIdValue: 'blockIdValue',
  body: 'body',
  bodyJson: 'bodyJson',
  bodyParts: 'bodyParts',
  bodyPartsValue: 'bodyPartsValue',
  bodyPartText: 'bodyPartText',
  bodyText: 'bodyText',
  book: 'book',
  bookAlias: 'bookAlias',
  bookAliasValue: 'bookAliasValue',
  bot: 'bot',
  botResponses: 'botResponses',
  botResponsesValue: 'botResponsesValue',
  botValue: 'botValue',
  buttonCaption: 'buttonCaption',
  buttonCaptionValue: 'buttonCaptionValue',
  callToActionUrl: 'callToActionUrl',
  callToActionUrlValue: 'callToActionUrlValue',
  caption: 'caption',
  captionValue: 'captionValue',
  cardBits: 'cardBits',
  cardBitsValue: 'cardBitsValue',
  cardNode: 'cardNode',
  cells: 'cells',
  cellsValue: 'cellsValue',
  checked: 'checked',
  choices: 'choices',
  choicesValue: 'choicesValue',
  class: 'class',
  classification: 'classification',
  classificationValue: 'classificationValue',
  codeLineNumbers: 'codeLineNumbers',
  codeLineNumbersValue: 'codeLineNumbersValue',
  codeMinimap: 'codeMinimap',
  codeMinimapValue: 'codeMinimapValue',
  color: 'color',
  colorTag: 'colorTag',
  colorTagValue: 'colorTagValue',
  column: 'column',
  columns: 'columns',
  columnsValue: 'columnsValue',
  comment: 'comment',
  commentedBitType: 'commentedBitType',
  computerLanguage: 'computerLanguage',
  computerLanguageValue: 'computerLanguageValue',
  content: 'contentValue',
  content2Buy: 'content2Buy',
  contentValue: 'contentValue',
  contentValueValue: 'contentValueValue',
  copyright: 'copyright',
  coverColor: 'coverColor',
  coverColorValue: 'coverColorValue',
  coverImage: 'coverImage',
  coverImageValue: 'coverImageValue',
  data: 'data',
  date: 'date',
  dateValue: 'dateValue',
  decimalPlaces: 'decimalPlaces',
  deeplink: 'deeplink',
  deeplinkValue: 'deeplinkValue',
  disableCalculation: 'disableCalculation',
  duration: 'duration',
  durationValue: 'durationValue',
  elements: 'elements',
  elementsValue: 'elementsValue',
  emphasis: 'emphasis',
  end: 'end',
  errors: 'errors',
  errorsValue: 'errorsValue',
  example: 'example',
  exampleValue: 'exampleValue',
  externalId: 'externalId',
  externalIdValue: 'externalIdValue',
  externalLink: 'externalLink',
  externalLinkText: 'externalLinkText',
  extraProperties: 'extraProperties',
  feedback: 'feedback',
  feedbackEngine: 'feedbackEngine',
  feedbackEngineValue: 'feedbackEngineValue',
  feedbackType: 'feedbackType',
  flashcards: 'flashcards',
  flashcardSet: 'flashcardSet',
  flashcardSetValue: 'flashcardSetValue',
  flashcardsValue: 'flashcardsValue',
  focusX: 'focusX',
  focusXValue: 'focusXValue',
  focusY: 'focusY',
  focusYValue: 'focusYValue',
  footer: 'footer',
  footerText: 'footerText',
  forKeys: 'forKeys',
  format: 'format',
  forValues: 'forValues',
  forValuesValue: 'forValuesValue',
  gap: 'gap',
  hasMarkAsDone: 'hasMarkAsDone',
  hasMarkAsDoneValue: 'hasMarkAsDoneValue',
  heading: 'heading',
  height: 'height',
  heightValue: 'heightValue',
  highlight: 'highlight',
  hint: 'hint',
  href: 'href',
  icon: 'icon',
  iconTag: 'iconTag',
  iconTagValue: 'iconTagValue',
  iconValue: 'iconValue',
  id: 'id',
  idValue: 'idValue',
  image: 'image',
  imageLandscape: 'imageLandscape',
  imagePortrait: 'imagePortrait',
  imageSource: 'imageSource',
  index: 'index',
  indexValue: 'indexValue',
  ingredients: 'ingredients',
  ingredientsValue: 'ingredientsValue',
  instruction: 'instruction',
  internalComment: 'internalComment',
  internalCommentValue: 'internalCommentValue',
  isCaseSensitive: 'isCaseSensitive',
  isCommented: 'isCommented',
  isCorrect: 'isCorrect',
  isDefaultExample: 'isDefaultExample',
  isExample: 'isExample',
  isInfoOnly: 'isInfoOnly',
  isInfoOnlyValue: 'isInfoOnlyValue',
  isPublic: 'isPublic',
  isPublicValue: 'isPublicValue',
  isTracked: 'isTracked',
  isTrackedValue: 'isTrackedValue',
  item: 'item',
  itemLead: 'itemLead',
  jupyterExecutionCount: 'jupyterExecutionCount',
  jupyterExecutionCountValue: 'jupyterExecutionCountValue',
  jupyterId: 'jupyterId',
  jupyterIdValue: 'jupyterIdValue',
  key: 'key',
  keyAudio: 'keyAudio',
  keyImage: 'keyImage',
  kind: 'kind',
  kindValue: 'kindValue',
  label: 'label',
  labelFalse: 'labelFalse',
  labelFalseValue: 'labelFalseValue',
  labelTrue: 'labelTrue',
  labelTrueValue: 'labelTrueValue',
  lang: 'lang',
  language: 'language',
  languageValue: 'languageValue',
  langValue: 'langValue',
  lead: 'lead',
  level: 'level',
  license: 'license',
  line: 'line',
  list: 'list',
  listValue: 'listValue',
  location: 'location',
  locationValue: 'locationValue',
  machineTranslated: 'machineTranslated',
  machineTranslatedValue: 'machineTranslatedValue',
  mailingList: 'mailingList',
  marginNumber: 'marginNumber',
  mark: 'mark',
  markConfig: 'markConfig',
  markConfigValue: 'markConfigValue',
  marks: 'marks',
  marksValue: 'marksValue',
  markup: 'markup', // bitmark markup
  matrix: 'matrix',
  matrixValue: 'matrixValue',
  maxCreatedBits: 'maxCreatedBits',
  maxCreatedBitsValue: 'maxCreatedBitsValue',
  maxDisplayLevel: 'maxDisplayLevel',
  maxDisplayLevelValue: 'maxDisplayLevelValue',
  message: 'message',
  mockupId: 'mockupId',
  name: 'name',
  offset: 'offset',
  options: 'options',
  optionsValue: 'optionsValue',
  original: 'original',
  padletId: 'padletId',
  padletIdValue: 'padletIdValue',
  pageNo: 'pageNo',
  pageNoValue: 'pageNoValue',
  pageNumber: 'pageNumber',
  pairs: 'pairs',
  pairsValue: 'pairsValue',
  parent: 'parent',
  parser: 'parser',
  partialAnswer: 'partialAnswer',
  partialAnswerValue: 'partialAnswerValue',
  person: 'person',
  pointerLeft: 'pointerLeft',
  pointerLeftValue: 'pointerLeftValue',
  pointerTop: 'pointerTop',
  pointerTopValue: 'pointerTopValue',
  posterImage: 'posterImage',
  posterImageValue: 'posterImageValue',
  postfix: 'postfix',
  prefix: 'prefix',
  page: 'page',
  pageValue: 'pageValue',
  processHandIn: 'processHandIn',
  processHandInValue: 'processHandInValue',
  productId: 'productId',
  productIdValue: 'productIdValue',
  product: 'product',
  productFolder: 'productFolder',
  productFolderValue: 'productFolderValue',
  productList: 'productList',
  productListValue: 'productListValue',
  productValue: 'productValue',
  productVideo: 'productVideo',
  productVideoList: 'productVideoList',
  productVideoListValue: 'productVideoListValue',
  productVideoValue: 'productVideoValue',
  progress: 'progress',
  progressValue: 'progressValue',
  properties: 'properties',
  property: 'property',
  propertyKey: 'propertyKey',
  propertyValue: 'propertyValue',
  propertyValues: 'propertyValues',
  provider: 'provider',
  publications: 'publications',
  publicationsValue: 'publicationsValue',
  publisher: 'publisher',
  publisherName: 'publisherName',
  publisherNameValue: 'publisherNameValue',
  publisherValue: 'publisherValue',
  quantity: 'quantity',
  question: 'question',
  questions: 'questions',
  questionsValue: 'questionsValue',
  quizCountItems: 'quizCountItems',
  quizCountItemsValue: 'quizCountItemsValue',
  quizStrikethroughSolutions: 'quizStrikethroughSolutions',
  quizStrikethroughSolutionsValue: 'quizStrikethroughSolutionsValue',
  quizzes: 'quizzes',
  quizzesValue: 'quizzesValue',
  quotedPerson: 'quotedPerson',
  ratingLevelEnd: 'ratingLevelEnd',
  ratingLevelSelected: 'ratingLevelSelected',
  ratingLevelSelectedValue: 'ratingLevelSelectedValue',
  ratingLevelStart: 'ratingLevelStart',
  reaction: 'reaction',
  reasonableNumOfChars: 'reasonableNumOfChars',
  reasonableNumOfCharsValue: 'reasonableNumOfCharsValue',
  reductionTag: 'reductionTag',
  reductionTagValue: 'reductionTagValue',
  reference: 'reference',
  referenceEnd: 'referenceEnd',
  referenceProperty: 'referenceProperty',
  referencePropertyValue: 'referencePropertyValue',
  releaseDate: 'releaseDate',
  releaseDateValue: 'releaseDateValue',
  releaseKind: 'releaseKind',
  releaseKindValue: 'releaseKindValue',
  releaseVersion: 'releaseVersion',
  releaseVersionValue: 'releaseVersionValue',
  resolved: 'resolved',
  resolvedBy: 'resolvedBy',
  resolvedByValue: 'resolvedByValue',
  resolvedDate: 'resolvedDate',
  resolvedDateValue: 'resolvedDateValue',
  resolvedValue: 'resolvedValue',
  resources: 'resources',
  resourcesValue: 'resourcesValue',
  resourceType: 'resourceType',
  response: 'response',
  responses: 'responses',
  responsesValue: 'responsesValue',
  root: 'root', // bit type (root)
  rows: 'rows',
  rowsValue: 'rowsValue',
  rowsValueValue: 'rowsValueValue',
  sampleSolution: 'sampleSolution',
  sampleSolutionValue: 'sampleSolutionValue',
  scormSource: 'scormSource',
  scormSourceValue: 'scormSourceValue',
  search: 'search',
  searchValue: 'searchValue',
  section: 'section',
  select: 'select',
  servings: 'servings',
  servingsValue: 'servingsValue',
  showInIndex: 'showInIndex',
  size: 'size',
  slug: 'slug',
  slugValue: 'slugValue',
  solution: 'solution',
  solutions: 'solutions',
  solutionsValue: 'solutionsValue',
  spaceId: 'spaceId',
  spaceIdValue: 'spaceIdValue',
  src: 'src',
  src1x: 'src1x',
  src2x: 'src2x',
  src3x: 'src3x',
  src4x: 'src4x',
  start: 'start',
  statement: 'statement',
  statements: 'statements',
  statementsValue: 'statementsValue',
  statementText: 'statementText',
  subject: 'subject',
  subjectValue: 'subjectValue',
  subtitle: 'subtitle',
  subtype: 'subtype',
  subtypeValue: 'subtypeValue',
  table: 'table',
  tableAutoWidth: 'tableAutoWidth',
  tableAutoWidthValue: 'tableAutoWidthValue',
  tableFixedHeader: 'tableFixedHeader',
  tableFixedHeaderValue: 'tableFixedHeaderValue',
  tableHeight: 'tableHeight',
  tableHeightValue: 'tableHeightValue',
  tablePagination: 'tablePagination',
  tablePaginationLimit: 'tablePaginationLimit',
  tablePaginationLimitValue: 'tablePaginationLimitValue',
  tablePaginationValue: 'tablePaginationValue',
  tableResizableColumns: 'tableResizableColumns',
  tableResizableColumnsValue: 'tableResizableColumnsValue',
  tableSearch: 'tableSearch',
  tableSearchValue: 'tableSearchValue',
  tableSort: 'tableSort',
  tableSortValue: 'tableSortValue',
  tableWhitespaceNoWrap: 'tableWhitespaceNoWrap',
  tableWhitespaceNoWrapValue: 'tableWhitespaceNoWrapValue',
  tag: 'tag',
  tagValue: 'tagValue',
  target: 'target',
  targetValue: 'targetValue',
  technicalTerm: 'technicalTerm',
  technicalTermValue: 'technicalTermValue',
  text: 'text',
  textAlign: 'textAlign',
  textAst: 'textAst',
  textAstValue: 'textAstValue',
  textFormat: 'textFormat',
  textReference: 'textReference',
  textReferenceValue: 'textReferenceValue',
  texts: 'texts',
  textsValue: 'textsValue',
  theme: 'theme',
  themeValue: 'themeValue',
  thumbImage: 'thumbImage',
  thumbImageValue: 'thumbImageValue',
  thumbnails: 'thumbnails',
  thumbnailsValue: 'thumbnailsValue',
  title: 'title',
  toc: 'toc',
  tocValue: 'tocValue',
  trim: 'trim',
  type: 'type',
  typeAlias: 'typeAlias',
  unit: 'unit',
  unitAbbr: 'unitAbbr',
  url: 'url',
  value: 'value',
  values: 'values',
  valuesValue: 'valuesValue',
  vendorUrl: 'vendorUrl',
  vendorUrlValue: 'vendorUrlValue',
  version: 'version',
  videoCallLink: 'videoCallLink',
  videoCallLinkValue: 'videoCallLinkValue',
  warnings: 'warnings',
  warningsValue: 'warningsValue',
  width: 'width',
  widthValue: 'widthValue',
  x: 'x',
  xValue: 'xValue',
  y: 'y',
  yValue: 'yValue',
  zoomDisabled: 'zoomDisabled',
});

export type NodeTypeType = EnumType<typeof NodeType>;

export { NodeType };
