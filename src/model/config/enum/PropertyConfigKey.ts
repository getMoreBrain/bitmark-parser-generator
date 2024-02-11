import { EnumType, superenum } from '@ncoderz/superenum';

/**
 * Config keys for properties
 */
const propertyConfigKeys = {
  action: 'action',
  ageRange: 'ageRange',
  aiGenerated: 'aiGenerated',
  allowSubtitles: 'allowSubtitles',
  alt: 'alt',
  author: 'author',
  autoplay: 'autoplay',
  backgroundWallpaper: 'backgroundWallpaper',
  book: 'book',
  bookAlias: 'bookAlias',
  bookId: 'bookId',
  bot: 'bot',
  buttonCaption: 'buttonCaption',
  caption: 'caption',
  color: 'color',
  colorTag: 'colorTag',
  computerLanguage: 'computerLanguage',
  content2Buy: 'content2Buy',
  copyright: 'copyright',
  coverImage: 'coverImage',
  date: 'date',
  deeplink: 'deeplink',
  disableCalculation: 'disableCalculation',
  duration: 'duration',
  emphasis: 'emphasis',
  example: 'example',
  externalId: 'externalId',
  externalLink: 'externalLink',
  externalLinkText: 'externalLinkText',
  flashcardSet: 'flashcardSet',
  focusX: 'focusX',
  focusY: 'focusY',
  format: 'format',
  height: 'height',
  icon: 'icon',
  iconTag: 'iconTag',
  id: 'id',
  imageSource: 'imageSource',
  internalComment: 'internalComment',
  isCaseSensitive: 'isCaseSensitive',
  isInfoOnly: 'isInfoOnly',
  isTracked: 'isTracked',
  jupyterExecutionCount: 'jupyterExecutionCount',
  jupyterId: 'jupyterId',
  kind: 'kind',
  labelFalse: 'labelFalse',
  labelTrue: 'labelTrue',
  lang: 'lang',
  language: 'language',
  license: 'license',
  list: 'list',
  location: 'location',
  mailingList: 'mailingList',
  markConfig: 'markConfig',
  maxCreatedBits: 'maxCreatedBits',
  maxDisplayLevel: 'maxDisplayLevel',
  mockupId: 'mockupId',
  mute: 'mute',
  padletId: 'padletId',
  partialAnswer: 'partialAnswer',
  partner: 'partner',
  pointerLeft: 'pointerLeft',
  pointerTop: 'pointerTop',
  portions: 'portions',
  posterImage: 'posterImage',
  product: 'product',
  productFolder: 'productFolder',
  productList: 'productList',
  productVideo: 'productVideo',
  productVideoList: 'productVideoList',
  progress: 'progress',
  property_mark: 'property_mark',
  property_reference: 'property_reference',
  property_sampleSolution: 'property_sampleSolution',
  publications: 'publications',
  publisher: 'publisher',
  quotedPerson: 'quotedPerson',
  reaction: 'reaction',
  reasonableNumOfChars: 'reasonableNumOfChars',
  releaseVersion: 'releaseVersion',
  resolved: 'resolved',
  resolvedBy: 'resolvedBy',
  resolvedDate: 'resolvedDate',
  scormSource: 'scormSource',
  showInIndex: 'showInIndex',
  showSubtitles: 'showSubtitles',
  siteName: 'siteName',
  size: 'size',
  spaceId: 'spaceId',
  src1x: 'src1x',
  src2x: 'src2x',
  src3x: 'src3x',
  src4x: 'src4x',
  subject: 'subject',
  subtype: 'subtype',
  tag: 'tag',
  target: 'target',
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
  zoomDisabled: 'zoomDisabled',
} as const;

const PropertyConfigKey = superenum(propertyConfigKeys);

export type PropertyConfigKeyType = EnumType<typeof PropertyConfigKey>;

export { PropertyConfigKey, propertyConfigKeys };
