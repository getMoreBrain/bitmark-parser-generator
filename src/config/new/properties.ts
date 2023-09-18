import { PropertyConfigKey } from '../../model/config/PropertyConfigKey';
import { _PropertiesConfig } from '../../model/config/RawConfig';

const PROPERTIES: _PropertiesConfig = {
  [PropertyConfigKey._id]: {
    tag: 'id',
    format: 'trimmedString',
  },
  [PropertyConfigKey._externalId]: {
    tag: 'externalId',
    format: 'trimmedString',
  },
  [PropertyConfigKey._spaceId]: {
    tag: 'spaceId',
    format: 'trimmedString',
  },
  [PropertyConfigKey._padletId]: {
    tag: 'padletId',
    single: true,
    format: 'trimmedString',
  },
  [PropertyConfigKey._aiGenerated]: {
    tag: 'AIGenerated',
    single: true,
    format: 'boolean',
    astKey: 'aiGenerated',
  },
  [PropertyConfigKey._releaseVersion]: {
    tag: 'releaseVersion',
    single: true,
    format: 'trimmedString',
  },
  [PropertyConfigKey._ageRange]: {
    tag: 'ageRange',
    format: 'trimmedString',
  },
  [PropertyConfigKey._language]: {
    tag: 'language',
    format: 'trimmedString',
  },
  [PropertyConfigKey._computerLanguage]: {
    tag: 'computerLanguage',
    single: true,
    format: 'trimmedString',
  },
  [PropertyConfigKey._target]: {
    tag: 'target',
    format: 'trimmedString',
  },
  [PropertyConfigKey._tag]: {
    tag: 'tag',
    format: 'trimmedString',
  },
  [PropertyConfigKey._icon]: {
    tag: 'icon',
    single: true,
    format: 'trimmedString',
  },
  [PropertyConfigKey._iconTag]: {
    tag: 'iconTag',
    single: true,
    format: 'trimmedString',
  },
  [PropertyConfigKey._colorTag]: {
    tag: 'colorTag',
    format: 'trimmedString',
  },
  [PropertyConfigKey._flashcardSet]: {
    tag: 'flashcardSet',
    format: 'trimmedString',
  },
  [PropertyConfigKey._subtype]: {
    tag: 'subtype',
    single: true,
    format: 'trimmedString',
  },
  [PropertyConfigKey._coverImage]: {
    tag: 'coverImage',
    format: 'trimmedString',
  },
  [PropertyConfigKey._publisher]: {
    tag: 'publisher',
    format: 'trimmedString',
  },
  [PropertyConfigKey._publications]: {
    tag: 'publications',
    format: 'trimmedString',
  },
  [PropertyConfigKey._author]: {
    tag: 'author',
    format: 'trimmedString',
  },
  [PropertyConfigKey._subject]: {
    tag: 'subject',
    format: 'trimmedString',
  },
  [PropertyConfigKey._date]: {
    tag: 'date',
    single: true,
    format: 'string',
  },
  [PropertyConfigKey._location]: {
    tag: 'location',
    single: true,
    format: 'trimmedString',
  },
  [PropertyConfigKey._theme]: {
    tag: 'theme',
    format: 'trimmedString',
  },
  [PropertyConfigKey._kind]: {
    tag: 'kind',
    single: true,
    format: 'trimmedString',
  },
  [PropertyConfigKey._action]: {
    tag: 'action',
    single: true,
    format: 'trimmedString',
  },
  [PropertyConfigKey._thumbImage]: {
    tag: 'thumbImage',
    single: true,
    format: 'trimmedString',
  },
  [PropertyConfigKey._focusX]: {
    tag: 'focusX',
    single: true,
    format: 'number',
  },
  [PropertyConfigKey._focusY]: {
    tag: 'focusY',
    single: true,
    format: 'number',
  },
  [PropertyConfigKey._deeplink]: {
    tag: 'deeplink',
    format: 'trimmedString',
  },
  [PropertyConfigKey._externalLink]: {
    tag: 'externalLink',
    single: true,
    format: 'trimmedString',
  },
  [PropertyConfigKey._externalLinkText]: {
    tag: 'externalLinkText',
    single: true,
    format: 'trimmedString',
  },
  [PropertyConfigKey._videoCallLink]: {
    tag: 'videoCallLink',
    single: true,
    format: 'trimmedString',
  },
  [PropertyConfigKey._bot]: {
    tag: 'bot',
    format: 'string',
  },
  [PropertyConfigKey._duration]: {
    tag: 'duration',
    single: true,
    format: 'trimmedString',
  },
  [PropertyConfigKey._reference]: {
    tag: 'reference',
    format: 'trimmedString',
    astKey: 'referenceProperty',
  },
  [PropertyConfigKey._list]: {
    tag: 'list',
    format: 'trimmedString',
  },
  [PropertyConfigKey._textReference]: {
    tag: 'textReference',
    single: true,
    format: 'trimmedString',
  },
  [PropertyConfigKey._isTracked]: {
    tag: 'isTracked',
    single: true,
    format: 'boolean',
  },
  [PropertyConfigKey._isInfoOnly]: {
    tag: 'isInfoOnly',
    single: true,
    format: 'boolean',
  },
  [PropertyConfigKey._labelTrue]: {
    tag: 'labelTrue',
    single: true,
    format: 'trimmedString',
  },
  [PropertyConfigKey._labelFalse]: {
    tag: 'labelFalse',
    single: true,
    format: 'trimmedString',
  },
  [PropertyConfigKey._quotedPerson]: {
    tag: 'quotedPerson',
    single: true,
    format: 'trimmedString',
  },
  [PropertyConfigKey._partialAnswer]: {
    tag: 'partialAnswer',
    single: true,
    format: 'trimmedString',
  },
  [PropertyConfigKey._example]: {
    tag: 'example',
    single: true,
    format: 'string',
  },
  [PropertyConfigKey._toc]: {
    tag: 'toc',
    single: true,
    format: 'boolean',
    defaultValue: 'true',
  },
  [PropertyConfigKey._progress]: {
    tag: 'progress',
    single: true,
    format: 'boolean',
    defaultValue: 'true',
  },
  [PropertyConfigKey._level]: {
    tag: 'level',
    single: true,
    format: 'string',
    astKey: 'levelProperty',
  },
  [PropertyConfigKey._book]: {
    tag: 'book',
    single: true,
    format: 'trimmedString',
  },
  [PropertyConfigKey._partner]: {
    tag: 'partner',
    single: true,
    format: 'trimmedString',
  },
  [PropertyConfigKey._sampleSolution]: {
    tag: 'sampleSolution',
    single: true,
    format: 'trimmedString',
  },
  [PropertyConfigKey._mark]: {
    tag: 'mark',
    format: 'trimmedString',
  },
  [PropertyConfigKey._type]: {
    tag: 'type',
    single: true,
    format: 'trimmedString',
  },
  [PropertyConfigKey._color]: {
    tag: 'color',
    single: true,
    format: 'trimmedString',
  },
  [PropertyConfigKey._emphasis]: {
    tag: 'emphasis',
    single: true,
    format: 'trimmedString',
  },
  [PropertyConfigKey._shortAnswer]: {
    tag: 'shortAnswer',
    single: true,
    format: 'boolean',
    astKey: 'isShortAnswer',
    jsonKey: 'isShortAnswer',
  },
  [PropertyConfigKey._longAnswer]: {
    tag: 'longAnswer',
    single: true,
    format: 'invertedBoolean',
    astKey: 'isShortAnswer',
    jsonKey: 'isShortAnswer',
  },
  [PropertyConfigKey._caseSensitive]: {
    tag: 'caseSensitive',
    single: true,
    format: 'boolean',
    astKey: 'isCaseSensitive',
    jsonKey: 'isCaseSensitive',
  },
  [PropertyConfigKey._reaction]: {
    tag: 'reaction',
    single: true,
    format: 'trimmedString',
  },
  [PropertyConfigKey._imageSource]: {
    tag: 'imageSource',
    single: true,
    format: 'trimmedString',
  },
  [PropertyConfigKey._mockupId]: {
    tag: 'mockupId',
    single: true,
    format: 'trimmedString',
  },
  [PropertyConfigKey._size]: {
    tag: 'size',
    single: true,
    format: 'number',
  },
  [PropertyConfigKey._format]: {
    tag: 'format',
    single: true,
    format: 'trimmedString',
  },
  [PropertyConfigKey._trim]: {
    tag: 'trim',
    single: true,
    format: 'boolean',
  },
  [PropertyConfigKey._width]: {
    tag: 'width',
    single: true,
    format: 'trimmedString',
  },
  [PropertyConfigKey._height]: {
    tag: 'height',
    single: true,
    format: 'trimmedString',
  },
  [PropertyConfigKey._license]: {
    tag: 'license',
    single: true,
    format: 'trimmedString',
  },
  [PropertyConfigKey._copyright]: {
    tag: 'copyright',
    single: true,
    format: 'trimmedString',
  },
  [PropertyConfigKey._caption]: {
    tag: 'caption',
    single: true,
    format: 'trimmedString',
  },
  [PropertyConfigKey._showInIndex]: {
    tag: 'showInIndex',
    single: true,
    format: 'boolean',
  },
  [PropertyConfigKey._alt]: {
    tag: 'alt',
    single: true,
    format: 'trimmedString',
  },
  [PropertyConfigKey._src1x]: {
    tag: 'src1x',
    single: true,
    format: 'trimmedString',
  },
  [PropertyConfigKey._src2x]: {
    tag: 'src2x',
    single: true,
    format: 'trimmedString',
  },
  [PropertyConfigKey._src3x]: {
    tag: 'src3x',
    single: true,
    format: 'trimmedString',
  },
  [PropertyConfigKey._src4x]: {
    tag: 'src4x',
    single: true,
    format: 'trimmedString',
  },
  [PropertyConfigKey._mute]: {
    tag: 'mute',
    single: true,
    format: 'boolean',
  },
  [PropertyConfigKey._autoplay]: {
    tag: 'autoplay',
    single: true,
    format: 'boolean',
  },
  [PropertyConfigKey._allowSubtitles]: {
    tag: 'allowSubtitles',
    single: true,
    format: 'boolean',
  },
  [PropertyConfigKey._showSubtitles]: {
    tag: 'showSubtitles',
    single: true,
    format: 'boolean',
  },
  [PropertyConfigKey._siteName]: {
    tag: 'siteName',
    single: true,
    format: 'trimmedString',
  },
  [PropertyConfigKey._posterImage]: {
    tag: 'posterImage',
    single: true,
    format: 'trimmedString',
  },
};

export { PROPERTIES };
