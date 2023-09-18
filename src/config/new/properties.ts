import { PropertiesConfig } from '../../model/config/NewConfig';
import { PropertyKey } from '../../model/enum/PropertyKey';

const PROPERTIES: PropertiesConfig = {
  [PropertyKey.id]: {
    tag: 'id',
    format: 'trimmedString',
  },
  [PropertyKey.externalId]: {
    tag: 'externalId',
    format: 'trimmedString',
  },
  [PropertyKey.spaceId]: {
    tag: 'spaceId',
    format: 'trimmedString',
  },
  [PropertyKey.padletId]: {
    tag: 'padletId',
    single: true,
    format: 'trimmedString',
  },
  [PropertyKey.aiGenerated]: {
    tag: 'AIGenerated',
    single: true,
    format: 'boolean',
    astKey: 'aiGenerated',
  },
  [PropertyKey.releaseVersion]: {
    tag: 'releaseVersion',
    single: true,
    format: 'trimmedString',
  },
  [PropertyKey.ageRange]: {
    tag: 'ageRange',
    format: 'trimmedString',
  },
  [PropertyKey.language]: {
    tag: 'language',
    format: 'trimmedString',
  },
  [PropertyKey.computerLanguage]: {
    tag: 'computerLanguage',
    single: true,
    format: 'trimmedString',
  },
  [PropertyKey.target]: {
    tag: 'target',
    format: 'trimmedString',
  },
  [PropertyKey.tag]: {
    tag: 'tag',
    format: 'trimmedString',
  },
  [PropertyKey.icon]: {
    tag: 'icon',
    single: true,
    format: 'trimmedString',
  },
  [PropertyKey.iconTag]: {
    tag: 'iconTag',
    single: true,
    format: 'trimmedString',
  },
  [PropertyKey.colorTag]: {
    tag: 'colorTag',
    format: 'trimmedString',
  },
  [PropertyKey.flashcardSet]: {
    tag: 'flashcardSet',
    format: 'trimmedString',
  },
  [PropertyKey.subtype]: {
    tag: 'subtype',
    single: true,
    format: 'trimmedString',
  },
  [PropertyKey.coverImage]: {
    tag: 'coverImage',
    format: 'trimmedString',
  },
  [PropertyKey.publisher]: {
    tag: 'publisher',
    format: 'trimmedString',
  },
  [PropertyKey.publications]: {
    tag: 'publications',
    format: 'trimmedString',
  },
  [PropertyKey.author]: {
    tag: 'author',
    format: 'trimmedString',
  },
  [PropertyKey.subject]: {
    tag: 'subject',
    format: 'trimmedString',
  },
  [PropertyKey.date]: {
    tag: 'date',
    single: true,
    format: 'string',
  },
  [PropertyKey.location]: {
    tag: 'location',
    single: true,
    format: 'trimmedString',
  },
  [PropertyKey.theme]: {
    tag: 'theme',
    format: 'trimmedString',
  },
  [PropertyKey.kind]: {
    tag: 'kind',
    single: true,
    format: 'trimmedString',
  },
  [PropertyKey.action]: {
    tag: 'action',
    single: true,
    format: 'trimmedString',
  },
  [PropertyKey.thumbImage]: {
    tag: 'thumbImage',
    single: true,
    format: 'trimmedString',
  },
  [PropertyKey.focusX]: {
    tag: 'focusX',
    single: true,
    format: 'number',
  },
  [PropertyKey.focusY]: {
    tag: 'focusY',
    single: true,
    format: 'number',
  },
  [PropertyKey.deeplink]: {
    tag: 'deeplink',
    format: 'trimmedString',
  },
  [PropertyKey.externalLink]: {
    tag: 'externalLink',
    single: true,
    format: 'trimmedString',
  },
  [PropertyKey.externalLinkText]: {
    tag: 'externalLinkText',
    single: true,
    format: 'trimmedString',
  },
  [PropertyKey.videoCallLink]: {
    tag: 'videoCallLink',
    single: true,
    format: 'trimmedString',
  },
  [PropertyKey.bot]: {
    tag: 'bot',
    format: 'string',
  },
  [PropertyKey.duration]: {
    tag: 'duration',
    single: true,
    format: 'trimmedString',
  },
  [PropertyKey.reference]: {
    tag: 'reference',
    format: 'trimmedString',
    astKey: 'referenceProperty',
  },
  [PropertyKey.list]: {
    tag: 'list',
    format: 'trimmedString',
  },
  [PropertyKey.textReference]: {
    tag: 'textReference',
    single: true,
    format: 'trimmedString',
  },
  [PropertyKey.isTracked]: {
    tag: 'isTracked',
    single: true,
    format: 'boolean',
  },
  [PropertyKey.isInfoOnly]: {
    tag: 'isInfoOnly',
    single: true,
    format: 'boolean',
  },
  [PropertyKey.labelTrue]: {
    tag: 'labelTrue',
    single: true,
    format: 'trimmedString',
  },
  [PropertyKey.labelFalse]: {
    tag: 'labelFalse',
    single: true,
    format: 'trimmedString',
  },
  [PropertyKey.quotedPerson]: {
    tag: 'quotedPerson',
    single: true,
    format: 'trimmedString',
  },
  [PropertyKey.partialAnswer]: {
    tag: 'partialAnswer',
    single: true,
    format: 'trimmedString',
  },
  [PropertyKey.example]: {
    tag: 'example',
    single: true,
    format: 'string',
  },
  [PropertyKey.toc]: {
    tag: 'toc',
    single: true,
    format: 'boolean',
    defaultValue: 'true',
  },
  [PropertyKey.progress]: {
    tag: 'progress',
    single: true,
    format: 'boolean',
    defaultValue: 'true',
  },
  [PropertyKey.level]: {
    tag: 'level',
    single: true,
    format: 'string',
    astKey: 'levelProperty',
  },
  [PropertyKey.book]: {
    tag: 'book',
    single: true,
    format: 'trimmedString',
  },
  [PropertyKey.partner]: {
    tag: 'partner',
    single: true,
    format: 'trimmedString',
  },
  [PropertyKey.sampleSolution]: {
    tag: 'sampleSolution',
    single: true,
    format: 'trimmedString',
  },
  [PropertyKey.mark]: {
    tag: 'mark',
    format: 'trimmedString',
  },
  [PropertyKey.type]: {
    tag: 'type',
    single: true,
    format: 'trimmedString',
  },
  [PropertyKey.color]: {
    tag: 'color',
    single: true,
    format: 'trimmedString',
  },
  [PropertyKey.emphasis]: {
    tag: 'emphasis',
    single: true,
    format: 'trimmedString',
  },
  [PropertyKey.shortAnswer]: {
    tag: 'shortAnswer',
    single: true,
    format: 'boolean',
    astKey: 'isShortAnswer',
    jsonKey: 'isShortAnswer',
  },
  [PropertyKey.longAnswer]: {
    tag: 'longAnswer',
    single: true,
    format: 'invertedBoolean',
    astKey: 'isShortAnswer',
    jsonKey: 'isShortAnswer',
  },
  [PropertyKey.caseSensitive]: {
    tag: 'caseSensitive',
    single: true,
    format: 'boolean',
    astKey: 'isCaseSensitive',
    jsonKey: 'isCaseSensitive',
  },
  [PropertyKey.reaction]: {
    tag: 'reaction',
    single: true,
    format: 'trimmedString',
  },
  [PropertyKey.imageSource]: {
    tag: 'imageSource',
    single: true,
    format: 'trimmedString',
  },
  [PropertyKey.mockupId]: {
    tag: 'mockupId',
    single: true,
    format: 'trimmedString',
  },
  [PropertyKey.size]: {
    tag: 'size',
    single: true,
    format: 'number',
  },
  [PropertyKey.format]: {
    tag: 'format',
    single: true,
    format: 'trimmedString',
  },
  [PropertyKey.trim]: {
    tag: 'trim',
    single: true,
    format: 'boolean',
  },
  [PropertyKey.width]: {
    tag: 'width',
    single: true,
    format: 'trimmedString',
  },
  [PropertyKey.height]: {
    tag: 'height',
    single: true,
    format: 'trimmedString',
  },
  [PropertyKey.license]: {
    tag: 'license',
    single: true,
    format: 'trimmedString',
  },
  [PropertyKey.copyright]: {
    tag: 'copyright',
    single: true,
    format: 'trimmedString',
  },
  [PropertyKey.caption]: {
    tag: 'caption',
    single: true,
    format: 'trimmedString',
  },
  [PropertyKey.showInIndex]: {
    tag: 'showInIndex',
    single: true,
    format: 'boolean',
  },
  [PropertyKey.alt]: {
    tag: 'alt',
    single: true,
    format: 'trimmedString',
  },
  [PropertyKey.src1x]: {
    tag: 'src1x',
    single: true,
    format: 'trimmedString',
  },
  [PropertyKey.src2x]: {
    tag: 'src2x',
    single: true,
    format: 'trimmedString',
  },
  [PropertyKey.src3x]: {
    tag: 'src3x',
    single: true,
    format: 'trimmedString',
  },
  [PropertyKey.src4x]: {
    tag: 'src4x',
    single: true,
    format: 'trimmedString',
  },
  [PropertyKey.mute]: {
    tag: 'mute',
    single: true,
    format: 'boolean',
  },
  [PropertyKey.autoplay]: {
    tag: 'autoplay',
    single: true,
    format: 'boolean',
  },
  [PropertyKey.allowSubtitles]: {
    tag: 'allowSubtitles',
    single: true,
    format: 'boolean',
  },
  [PropertyKey.showSubtitles]: {
    tag: 'showSubtitles',
    single: true,
    format: 'boolean',
  },
  [PropertyKey.siteName]: {
    tag: 'siteName',
    single: true,
    format: 'trimmedString',
  },
  [PropertyKey.posterImage]: {
    tag: 'posterImage',
    single: true,
    format: 'trimmedString',
  },
};

export { PROPERTIES };
