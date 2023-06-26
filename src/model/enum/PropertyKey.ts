import { EnumType, superenum } from '@ncoderz/superenum';

export interface PropertyKeyMetadata {
  isSingle?: boolean; // If the property is treated as single rather than an array
  isTrimmedString?: boolean; // If the value of the property is treated as a trimmed string
  isNumber?: boolean; // If the value is treated as a number
  isBoolean?: boolean; // If the value is treated as a boolean
  isInvertedBoolean?: boolean; // If the value is treated as a boolean with the value inverted (e.g. isLongAnswer ==> isShortAnswer = false)
  astKey?: string; // If the AST key is different from the markup property key
  jsonKey?: string; // If the json key is different from the markup property key
  ignoreFalse?: boolean; // If the property should be ignored if the value is false
  ignoreTrue?: boolean; // If the property should be ignored if the value is true
}

const PropertyKey = superenum({
  id: 'id',
  externalId: 'externalId',
  padletId: 'padletId',
  aiGenerated: 'AIGenerated',
  releaseVersion: 'releaseVersion',
  ageRange: 'ageRange',
  language: 'language',
  computerLanguage: 'computerLanguage', // single
  coverImage: 'coverImage',
  publisher: 'publisher',
  publications: 'publications',
  author: 'author',
  subject: 'subject', // Not sure if 'subject' is a supported property key
  date: 'date', // single
  location: 'location', // single
  theme: 'theme',
  kind: 'kind', // single
  action: 'action', // single
  thumbImage: 'thumbImage',
  focusX: 'focusX', // single, number
  focusY: 'focusY', // single, number
  deeplink: 'deeplink',
  externalLink: 'externalLink', // single
  externalLinkText: 'externalLinkText', // single
  videoCallLink: 'videoCallLink', // single
  bot: 'bot',
  duration: 'duration', // single
  reference: 'reference',
  list: 'list',
  textReference: 'textReference', // single
  isTracked: 'isTracked', // single
  isInfoOnly: 'isInfoOnly', // single
  labelTrue: 'labelTrue', // single
  labelFalse: 'labelFalse', // single
  quotedPerson: 'quotedPerson', // single
  partialAnswer: 'partialAnswer', // single
  example: 'example', // single

  toc: 'toc', // single, chapter only
  progress: 'progress', // single, chapter only
  level: 'level', // single, chapter only

  book: 'book', // single, only in 'learning-path-book'
  partner: 'partner', // single, only in 'conversation-xxx'
  sampleSolution: 'sampleSolution', // single, only in 'essay'

  // Only in cards
  shortAnswer: 'shortAnswer', // single
  longAnswer: 'longAnswer', // single
  caseSensitive: 'caseSensitive', // single
  reaction: 'reaction', // single - botResponse

  // Only in resources
  width: 'width', // single
  height: 'height', // single
  license: 'license', // single
  copyright: 'copyright', // single
  caption: 'caption', // single
  showInIndex: 'showInIndex', // single

  alt: 'alt', // single
  src1x: 'src1x', // single
  src2x: 'src2x', // single
  src3x: 'src3x', // single
  src4x: 'src4x', // single
  mute: 'mute', // single
  autoplay: 'autoplay', // single
  allowSubtitles: 'allowSubtitles', // single
  showSubtitles: 'showSubtitles', // single
  siteName: 'siteName', // single
  posterImage: 'posterImage', // single
});

export type PropertyKeyType = EnumType<typeof PropertyKey>;

export { PropertyKey };
