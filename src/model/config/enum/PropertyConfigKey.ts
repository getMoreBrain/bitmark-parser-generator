import { EnumType, superenum } from '@ncoderz/superenum';

/**
 * Config keys for properties
 */
const propertyConfigKeys = {
  action: 'action',
  additionalSolutions: 'additionalSolutions',
  ageRange: 'ageRange',
  aiGenerated: 'aiGenerated',
  analyticsTag: 'analyticsTag',
  allowedBit: 'allowedBit',
  allowSubtitles: 'allowSubtitles',
  alt: 'alt',
  author: 'author',
  autoplay: 'autoplay',
  availableClassifications: 'availableClassifications',
  backgroundWallpaper: 'backgroundWallpaper',
  blockId: 'blockId',
  book: 'book',
  bookAlias: 'bookAlias',
  bot: 'bot',
  buttonCaption: 'buttonCaption',
  callToActionUrl: 'callToActionUrl',
  caption: 'caption',
  classification: 'classification',
  codeLineNumbers: 'codeLineNumbers',
  codeMinimap: 'codeMinimap',
  color: 'color',
  colorTag: 'colorTag',
  computerLanguage: 'computerLanguage',
  content2Buy: 'content2Buy',
  copyright: 'copyright',
  coverColor: 'coverColor',
  coverImage: 'coverImage',
  date: 'date',
  decimalPlaces: 'decimalPlaces',
  deeplink: 'deeplink',
  disableCalculation: 'disableCalculation',
  disableFeedback: 'disableFeedback',
  duration: 'duration',
  emphasis: 'emphasis',
  example: 'example',
  externalId: 'externalId',
  externalLink: 'externalLink',
  externalLinkText: 'externalLinkText',
  feedbackEngine: 'feedbackEngine',
  feedbackType: 'feedbackType',
  flashcardSet: 'flashcardSet',
  focusX: 'focusX',
  focusY: 'focusY',
  format: 'format',
  hasBookNavigation: 'hasBookNavigation',
  hasMarkAsDone: 'hasMarkAsDone',
  height: 'height',
  icon: 'icon',
  iconTag: 'iconTag',
  id: 'id',
  imageFirst: 'imageFirst',
  imageSource: 'imageSource',
  index: 'index',
  internalComment: 'internalComment',
  isCaseSensitive: 'isCaseSensitive',
  isInfoOnly: 'isInfoOnly',
  isPublic: 'isPublic',
  isTracked: 'isTracked',
  jupyterExecutionCount: 'jupyterExecutionCount',
  jupyterId: 'jupyterId',
  kind: 'kind',
  label: 'label',
  labelFalse: 'labelFalse',
  labelTrue: 'labelTrue',
  lang: 'lang',
  language: 'language',
  levelCEFRp: 'levelCEFRp',
  levelCEFR: 'levelCEFR',
  levelILR: 'levelILR',
  levelACTFL: 'levelACTFL',
  license: 'license',
  list: 'list',
  location: 'location',
  machineTranslated: 'machineTranslated',
  mailingList: 'mailingList',
  markConfig: 'markConfig',
  maxCreatedBits: 'maxCreatedBits',
  maxDisplayLevel: 'maxDisplayLevel',
  mockupId: 'mockupId',
  mute: 'mute',
  padletId: 'padletId',
  pageNo: 'pageNo',
  partialAnswer: 'partialAnswer',
  partner: 'partner', // Deprecated, replaced by person
  person: 'person',
  pointerLeft: 'pointerLeft',
  pointerTop: 'pointerTop',
  posterImage: 'posterImage',
  page: 'page',
  processHandIn: 'processHandIn',
  product: 'product',
  productFolder: 'productFolder',
  productId: 'productId',
  productList: 'productList',
  productVideo: 'productVideo',
  productVideoList: 'productVideoList',
  progress: 'progress',
  property_mark: 'property_mark',
  property_reference: 'property_reference',
  property_sampleSolution: 'property_sampleSolution',
  property_title: 'property_title',
  publications: 'publications',
  publisher: 'publisher',
  publisherName: 'publisherName',
  quizCountItems: 'quizCountItems',
  quizStrikethroughSolutions: 'quizStrikethroughSolutions',
  quotedPerson: 'quotedPerson',
  ratingLevelEnd: 'ratingLevelEnd',
  ratingLevelSelected: 'ratingLevelSelected',
  ratingLevelStart: 'ratingLevelStart',
  reaction: 'reaction',
  reasonableNumOfChars: 'reasonableNumOfChars',
  reductionTag: 'reductionTag',
  releaseDate: 'releaseDate',
  releaseKind: 'releaseKind',
  releaseVersion: 'releaseVersion',
  resolved: 'resolved',
  resolvedBy: 'resolvedBy',
  resolvedDate: 'resolvedDate',
  scormSource: 'scormSource',
  search: 'search',
  servings: 'servings',
  showInIndex: 'showInIndex',
  showSubtitles: 'showSubtitles',
  siteName: 'siteName',
  size: 'size',
  slug: 'slug',
  spaceId: 'spaceId',
  src1x: 'src1x',
  src2x: 'src2x',
  src3x: 'src3x',
  src4x: 'src4x',
  stripePricingTableId: 'stripePricingTableId',
  stripePublishableKey: 'stripePublishableKey',
  subject: 'subject',
  subtype: 'subtype',
  tableAutoWidth: 'tableAutoWidth',
  tableFixedHeader: 'tableFixedHeader',
  tableHeight: 'tableHeight',
  tablePagination: 'tablePagination',
  tablePaginationLimit: 'tablePaginationLimit',
  tableResizableColumns: 'tableResizableColumns',
  tableSearch: 'tableSearch',
  tableSort: 'tableSort',
  tableWhitespaceNoWrap: 'tableWhitespaceNoWrap',
  tag: 'tag',
  target: 'target',
  technicalTerm: 'technicalTerm',
  textReference: 'textReference',
  theme: 'theme',
  thumbImage: 'thumbImage',
  toc: 'toc',
  trim: 'trim',
  unit: 'unit',
  unitAbbr: 'unitAbbr',
  vendorUrl: 'vendorUrl',
  videoCallLink: 'videoCallLink',
  width: 'width',
  x: 'x',
  y: 'y',
  zoomDisabled: 'zoomDisabled',
} as const;

const PropertyConfigKey = superenum(propertyConfigKeys);

export type PropertyConfigKeyType = EnumType<typeof PropertyConfigKey>;

export { PropertyConfigKey, propertyConfigKeys };
