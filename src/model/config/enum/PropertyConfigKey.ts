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
  book: 'book',
  bookAlias: 'bookAlias',
  bot: 'bot',
  caption: 'caption',
  isCaseSensitive: 'isCaseSensitive',
  color: 'color',
  colorTag: 'colorTag',
  computerLanguage: 'computerLanguage',
  content2Buy: 'content2Buy',
  copyright: 'copyright',
  coverImage: 'coverImage',
  date: 'date',
  deeplink: 'deeplink',
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
  markConfig: 'markConfig',
  maxCreatedBits: 'maxCreatedBits',
  mockupId: 'mockupId',
  mute: 'mute',
  padletId: 'padletId',
  partialAnswer: 'partialAnswer',
  partner: 'partner',
  posterImage: 'posterImage',
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
  resolvedDate: 'resolvedDate',
  resolvedBy: 'resolvedBy',
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
  videoCallLink: 'videoCallLink',
  width: 'width',
  zoomDisabled: 'zoomDisabled',
} as const;

const PropertyConfigKey = superenum(propertyConfigKeys);

export type PropertyConfigKeyType = EnumType<typeof PropertyConfigKey>;

export { PropertyConfigKey, propertyConfigKeys };
