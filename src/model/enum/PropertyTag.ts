import { EnumType, superenum } from '@ncoderz/superenum';

const PropertyTag = superenum({
  action: 'action',
  ageRange: 'ageRange',
  aiGenerated: 'AIGenerated',
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
  mark: 'mark',
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
  productVideo: 'productVideo',
  technicalTerm: 'technicalTerm',
  progress: 'progress',
  publications: 'publications',
  publisher: 'publisher',
  quotedPerson: 'quotedPerson',
  reaction: 'reaction',
  reasonableNumOfChars: 'reasonableNumOfChars',
  reference: 'reference',
  releaseVersion: 'releaseVersion',
  resolved: 'resolved',
  resolvedBy: 'resolvedBy',
  resolvedDate: 'resolvedDate',
  sampleSolution: 'sampleSolution',
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
});

export type PropertyTagType = EnumType<typeof PropertyTag>;

export { PropertyTag };
