import { EnumType, superenum } from '@ncoderz/superenum';

const PropertyTag = superenum({
  action: 'action',
  ageRange: 'ageRange',
  aiGenerated: 'AIGenerated',
  allowSubtitles: 'allowSubtitles',
  alt: 'alt',
  author: 'author',
  autoplay: 'autoplay',
  book: 'book',
  bot: 'bot',
  caption: 'caption',
  caseSensitive: 'caseSensitive',
  color: 'color',
  colorTag: 'colorTag',
  computerLanguage: 'computerLanguage',
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
  isInfoOnly: 'isInfoOnly',
  isTracked: 'isTracked',
  kind: 'kind',
  labelFalse: 'labelFalse',
  labelTrue: 'labelTrue',
  content2Buy: 'content2Buy',
  language: 'language',
  level: 'level',
  license: 'license',
  list: 'list',
  location: 'location',
  longAnswer: 'longAnswer',
  mark: 'mark',
  mockupId: 'mockupId',
  mute: 'mute',
  padletId: 'padletId',
  partialAnswer: 'partialAnswer',
  partner: 'partner',
  posterImage: 'posterImage',
  progress: 'progress',
  publications: 'publications',
  publisher: 'publisher',
  quotedPerson: 'quotedPerson',
  reaction: 'reaction',
  reference: 'reference',
  releaseVersion: 'releaseVersion',
  sampleSolution: 'sampleSolution',
  shortAnswer: 'shortAnswer',
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
  type: 'type',
  videoCallLink: 'videoCallLink',
  width: 'width',
});

export type PropertyTagType = EnumType<typeof PropertyTag>;

export { PropertyTag };
