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
  kind: 'kind', // single
  action: 'action',
  thumbImage: 'thumbImage',
  deeplink: 'deeplink',
  externalLink: 'externalLink', // single
  externalLinkText: 'externalLinkText', // single
  videoCallLink: 'videoCallLink',
  bot: 'bot',
  duration: 'duration',
  reference: 'reference',
  list: 'list',
  labelTrue: 'labelTrue', // single
  labelFalse: 'labelFalse', // single
  quotedPerson: 'quotedPerson', // single

  progress: 'progress', // single

  // Gap / Select
  example: 'example', // single

  // Questions
  shortAnswer: 'shortAnswer', // single
  longAnswer: 'longAnswer', // single
  caseSensitive: 'caseSensitive', // single
});

export type PropertyKeyType = EnumType<typeof PropertyKey>;

export { PropertyKey };
