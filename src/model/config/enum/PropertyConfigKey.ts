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

const PropertyConfigKey = superenum({
  _unknown: '_unknown',

  _action: '_action',
  _ageRange: '_ageRange',
  _aiGenerated: '_aiGenerated',
  _allowSubtitles: '_allowSubtitles',
  _alt: '_alt',
  _author: '_author',
  _autoplay: '_autoplay',
  _book: '_book',
  _bot: '_bot',
  _caption: '_caption',
  _caseSensitive: '_caseSensitive',
  _color: '_color',
  _colorTag: '_colorTag',
  _computerLanguage: '_computerLanguage',
  _copyright: '_copyright',
  _coverImage: '_coverImage',
  _date: '_date',
  _deeplink: '_deeplink',
  _duration: '_duration',
  _emphasis: '_emphasis',
  _example: '_example',
  _externalId: '_externalId',
  _externalLink: '_externalLink',
  _externalLinkText: '_externalLinkText',
  _flashcardSet: '_flashcardSet',
  _focusX: '_focusX',
  _focusY: '_focusY',
  _format: '_format',
  _height: '_height',
  _icon: '_icon',
  _iconTag: '_iconTag',
  _id: '_id',
  _imageSource: '_imageSource',
  _isInfoOnly: '_isInfoOnly',
  _isTracked: '_isTracked',
  _kind: '_kind',
  _labelFalse: '_labelFalse',
  _labelTrue: '_labelTrue',
  _language: '_language',
  _level: '_level',
  _license: '_license',
  _list: '_list',
  _location: '_location',
  _longAnswer: '_longAnswer',
  _markConfig: '_markConfig',
  _mark: '_mark',
  _mockupId: '_mockupId',
  _mute: '_mute',
  _padletId: '_padletId',
  _partialAnswer: '_partialAnswer',
  _partner: '_partner',
  _posterImage: '_posterImage',
  _progress: '_progress',
  _publications: '_publications',
  _publisher: '_publisher',
  _quotedPerson: '_quotedPerson',
  _reaction: '_reaction',
  _reference: '_reference',
  _releaseVersion: '_releaseVersion',
  _sampleSolution: '_sampleSolution',
  _shortAnswer: '_shortAnswer',
  _showInIndex: '_showInIndex',
  _showSubtitles: '_showSubtitles',
  _siteName: '_siteName',
  _size: '_size',
  _spaceId: '_spaceId',
  _src1x: '_src1x',
  _src2x: '_src2x',
  _src3x: '_src3x',
  _src4x: '_src4x',
  _subject: '_subject',
  _subtype: '_subtype',
  _tag: '_tag',
  _target: '_target',
  _textReference: '_textReference',
  _theme: '_theme',
  _thumbImage: '_thumbImage',
  _toc: '_toc',
  _trim: '_trim',
  _type: '_type',
  _videoCallLink: '_videoCallLink',
  _width: '_width',
});

export type PropertyConfigKeyType = EnumType<typeof PropertyConfigKey>;

export { PropertyConfigKey };
