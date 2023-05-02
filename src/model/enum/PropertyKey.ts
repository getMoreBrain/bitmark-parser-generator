import { EnumType, superenum } from '@ncoderz/superenum';

const PropertyKey = superenum({
  id: 'id',
  externalId: 'externalId',
  ageRange: 'ageRange',
  language: 'language',
  computerLanguage: 'computerLanguage',
  coverImage: 'coverImage',
  publisher: 'publisher',
  publications: 'publications',
  author: 'author',
  date: 'date',
  location: 'location',
  theme: 'theme',
  action: 'action',
  thumbImage: 'thumbImage',
  duration: 'duration',
  deeplink: 'deeplink',
  videoCallLink: 'videoCallLink',
  bot: 'bot',
  list: 'list',
  kind: 'kind', // single
  progress: 'progress', // single
  externalLink: 'externalLink', // single
  externalLinkText: 'externalLinkText', // single
  labelTrue: 'labelTrue', // single
  labelFalse: 'labelFalse', // single
  quotedPerson: 'quotedPerson', // single

  // Gap / Select
  example: 'example', // single

  // Questions
  shortAnswer: 'shortAnswer', // single
  longAnswer: 'longAnswer', // single
  caseSensitive: 'caseSensitive', // single
});

export type PropertyKeyType = EnumType<typeof PropertyKey>;

export { PropertyKey };
