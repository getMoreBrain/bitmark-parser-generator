import { EnumType, superenum } from '@ncoderz/superenum';

export interface PropertyKeyMetadata {
  isSingle?: boolean; // If the property is treated as single rather than an array
  isTrimmedString?: boolean; // If the value of the property is treated as a trimmed string
  isNumber?: boolean; // If the value is treated as a number
  isBoolean?: boolean; // If the value is treated as a boolean
  isInvertedBoolean?: boolean; // If the value is treated as a boolean with the value inverted (e.g. isLongAnswer ==> isShortAnswer = false)
  astKey?: string; // If the AST key is different from the markup property key
  jsonKey?: string; // If the json key is different from the markup property key
}

const PropertyKey = superenum({
  id: 'id',
  externalId: 'externalId',
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
  labelTrue: 'labelTrue', // single
  labelFalse: 'labelFalse', // single
  quotedPerson: 'quotedPerson', // single
  partialAnswer: 'partialAnswer', // single
  example: 'example', // single

  toc: 'toc', // single, chapter only
  progress: 'progress', // single, chapter only
  level: 'level', // single, chapter only

  shortAnswer: 'shortAnswer', // single
  longAnswer: 'longAnswer', // single
  caseSensitive: 'caseSensitive', // single
});

// Set metadata on the property keys to describe specific behaviour

PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.id, {
  isTrimmedString: true,
});
PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.externalId, {
  isTrimmedString: true,
});
PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.ageRange, {
  isTrimmedString: true,
});
PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.language, {
  isTrimmedString: true,
});
PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.computerLanguage, {
  isSingle: true,
  isTrimmedString: true,
});
PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.coverImage, {
  isTrimmedString: true,
});
PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.publisher, {
  isTrimmedString: true,
});
PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.publications, {
  isTrimmedString: true,
});
PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.author, {
  isTrimmedString: true,
});
PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.subject, {
  isTrimmedString: true,
});
PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.date, {
  isSingle: true,
});
PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.location, {
  isSingle: true,
  isTrimmedString: true,
});
PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.theme, {
  isTrimmedString: true,
});
PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.kind, {
  isSingle: true,
  isTrimmedString: true,
});
PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.action, {
  isSingle: true,
  isTrimmedString: true,
});
PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.thumbImage, {
  isSingle: true,
  isTrimmedString: true,
});
PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.focusX, {
  isSingle: true,
  isNumber: true,
});
PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.focusY, {
  isSingle: true,
  isNumber: true,
});
PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.deeplink, {
  isTrimmedString: true,
});
PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.externalLink, {
  isSingle: true,
  isTrimmedString: true,
});
PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.externalLinkText, {
  isSingle: true,
  isTrimmedString: true,
});
PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.videoCallLink, {
  isSingle: true,
  isTrimmedString: true,
});
PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.bot, {});
PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.duration, {
  isSingle: true,
  isTrimmedString: true,
});
PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.reference, {
  isSingle: true,
  isTrimmedString: true,
  astKey: 'referenceProperty',
});
PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.list, {
  isTrimmedString: true,
});
PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.labelTrue, {
  isSingle: true,
  isTrimmedString: true,
});
PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.labelFalse, {
  isSingle: true,
  isTrimmedString: true,
});
PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.quotedPerson, {
  isSingle: true,
  isTrimmedString: true,
});
PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.partialAnswer, {
  isSingle: true,
  isTrimmedString: true,
});
PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.toc, {
  isSingle: true,
  // isBoolean: true, - ANTLR parser toc progress as a string (but it usually has value "false" or "true"!)
});
PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.progress, {
  isSingle: true,
  // isBoolean: true, - ANTLR parser treats progress as a string (but it usually has value "false" or "true"!)
});
PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.level, {
  isSingle: true,
  astKey: 'levelProperty',
});

PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.example, {
  isSingle: true,
});

PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.shortAnswer, {
  isSingle: true,
  isBoolean: true,
  astKey: 'isShortAnswer',
  jsonKey: 'isShortAnswer',
});
PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.longAnswer, {
  isSingle: true,
  isInvertedBoolean: true,
  astKey: 'isShortAnswer',
  jsonKey: 'isShortAnswer',
});
PropertyKey.setMetadata<PropertyKeyMetadata>(PropertyKey.caseSensitive, {
  isSingle: true,
  isBoolean: true,
  astKey: 'isCaseSensitive',
  jsonKey: 'isCaseSensitive',
});

export type PropertyKeyType = EnumType<typeof PropertyKey>;

export { PropertyKey };
