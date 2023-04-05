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
  kind: 'kind',
  action: 'action',
  thumbImage: 'thumbImage',
  duration: 'duration',
  deeplink: 'deeplink',
  externalLink: 'externalLink',
  externalLinkText: 'externalLinkText',
  videoCallLink: 'videoCallLink',
  bot: 'bot',
  list: 'list',
  labelTrue: 'labelTrue',
  labelFalse: 'labelFalse',
  quotedPerson: 'quotedPerson',
});

export type PropertyKeyType = EnumType<typeof PropertyKey>;

export { PropertyKey };
