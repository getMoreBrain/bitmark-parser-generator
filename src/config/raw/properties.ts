import { _PropertiesConfig } from '../../model/config/_Config';
import { PropertyConfigKey } from '../../model/config/enum/PropertyConfigKey';
import { PropertyAstKey } from '../../model/enum/PropertyAstKey';
import { PropertyFormat } from '../../model/enum/PropertyFormat';
import { PropertyJsonKey } from '../../model/enum/PropertyJsonKey';
import { PropertyTag } from '../../model/enum/PropertyTag';

const PROPERTIES: _PropertiesConfig = {
  [PropertyConfigKey._id]: {
    tag: PropertyTag.id,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._externalId]: {
    tag: PropertyTag.externalId,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._spaceId]: {
    tag: PropertyTag.spaceId,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._padletId]: {
    tag: PropertyTag.padletId,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._aiGenerated]: {
    tag: PropertyTag.aiGenerated,
    single: true,
    format: PropertyFormat.boolean,
    astKey: PropertyAstKey.aiGenerated,
  },
  [PropertyConfigKey._releaseVersion]: {
    tag: PropertyTag.releaseVersion,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._ageRange]: {
    tag: PropertyTag.ageRange,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._language]: {
    tag: PropertyTag.language,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._computerLanguage]: {
    tag: PropertyTag.computerLanguage,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._target]: {
    tag: PropertyTag.target,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._tag]: {
    tag: PropertyTag.tag,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._icon]: {
    tag: PropertyTag.icon,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._iconTag]: {
    tag: PropertyTag.iconTag,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._colorTag]: {
    tag: PropertyTag.colorTag,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._flashcardSet]: {
    tag: PropertyTag.flashcardSet,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._subtype]: {
    tag: PropertyTag.subtype,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._coverImage]: {
    tag: PropertyTag.coverImage,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._publisher]: {
    tag: PropertyTag.publisher,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._publications]: {
    tag: PropertyTag.publications,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._author]: {
    tag: PropertyTag.author,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._subject]: {
    tag: PropertyTag.subject,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._date]: {
    tag: PropertyTag.date,
    single: true,
    format: PropertyFormat.string,
  },
  [PropertyConfigKey._location]: {
    tag: PropertyTag.location,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._theme]: {
    tag: PropertyTag.theme,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._kind]: {
    tag: PropertyTag.kind,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._action]: {
    tag: PropertyTag.action,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._thumbImage]: {
    tag: PropertyTag.thumbImage,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._focusX]: {
    tag: PropertyTag.focusX,
    single: true,
    format: PropertyFormat.number,
  },
  [PropertyConfigKey._focusY]: {
    tag: PropertyTag.focusY,
    single: true,
    format: PropertyFormat.number,
  },
  [PropertyConfigKey._deeplink]: {
    tag: PropertyTag.deeplink,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._externalLink]: {
    tag: PropertyTag.externalLink,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._externalLinkText]: {
    tag: PropertyTag.externalLinkText,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._videoCallLink]: {
    tag: PropertyTag.videoCallLink,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._bot]: {
    tag: PropertyTag.bot,
    format: PropertyFormat.string,
  },
  [PropertyConfigKey._duration]: {
    tag: PropertyTag.duration,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._reference]: {
    tag: PropertyTag.reference,
    format: PropertyFormat.trimmedString,
    astKey: PropertyAstKey.reference,
  },
  [PropertyConfigKey._list]: {
    tag: PropertyTag.list,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._textReference]: {
    tag: PropertyTag.textReference,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._isTracked]: {
    tag: PropertyTag.isTracked,
    single: true,
    format: PropertyFormat.boolean,
  },
  [PropertyConfigKey._isInfoOnly]: {
    tag: PropertyTag.isInfoOnly,
    single: true,
    format: PropertyFormat.boolean,
  },
  [PropertyConfigKey._labelTrue]: {
    tag: PropertyTag.labelTrue,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._labelFalse]: {
    tag: PropertyTag.labelFalse,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._quotedPerson]: {
    tag: PropertyTag.quotedPerson,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._partialAnswer]: {
    tag: PropertyTag.partialAnswer,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._example]: {
    tag: PropertyTag.example,
    single: true,
    format: PropertyFormat.string,
  },
  [PropertyConfigKey._toc]: {
    tag: PropertyTag.toc,
    single: true,
    format: PropertyFormat.boolean,
    defaultValue: 'true',
  },
  [PropertyConfigKey._progress]: {
    tag: PropertyTag.progress,
    single: true,
    format: PropertyFormat.boolean,
    defaultValue: 'true',
  },
  [PropertyConfigKey._level]: {
    tag: PropertyTag.level,
    single: true,
    format: PropertyFormat.string,
    astKey: PropertyAstKey.level,
  },
  [PropertyConfigKey._book]: {
    tag: PropertyTag.book,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._partner]: {
    tag: PropertyTag.partner,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._sampleSolution]: {
    tag: PropertyTag.sampleSolution,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._markConfig]: {
    tag: PropertyTag.mark,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._mark]: {
    tag: PropertyTag.mark,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._type]: {
    tag: PropertyTag.type,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._color]: {
    tag: PropertyTag.color,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._emphasis]: {
    tag: PropertyTag.emphasis,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._shortAnswer]: {
    tag: PropertyTag.shortAnswer,
    single: true,
    format: PropertyFormat.boolean,
    astKey: PropertyAstKey.shortAnswer,
    jsonKey: PropertyJsonKey.shortAnswer,
  },
  [PropertyConfigKey._longAnswer]: {
    tag: PropertyTag.longAnswer,
    single: true,
    format: PropertyFormat.invertedBoolean,
    astKey: PropertyAstKey.shortAnswer,
    jsonKey: PropertyJsonKey.shortAnswer,
  },
  [PropertyConfigKey._caseSensitive]: {
    tag: PropertyTag.caseSensitive,
    single: true,
    format: PropertyFormat.boolean,
    astKey: PropertyAstKey.caseSensitive,
    jsonKey: PropertyJsonKey.caseSensitive,
  },
  [PropertyConfigKey._reaction]: {
    tag: PropertyTag.reaction,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._imageSource]: {
    tag: PropertyTag.imageSource,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._mockupId]: {
    tag: PropertyTag.mockupId,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._size]: {
    tag: PropertyTag.size,
    single: true,
    format: PropertyFormat.number,
  },
  [PropertyConfigKey._format]: {
    tag: PropertyTag.format,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._trim]: {
    tag: PropertyTag.trim,
    single: true,
    format: PropertyFormat.boolean,
  },
  [PropertyConfigKey._width]: {
    tag: PropertyTag.width,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._height]: {
    tag: PropertyTag.height,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._license]: {
    tag: PropertyTag.license,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._copyright]: {
    tag: PropertyTag.copyright,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._caption]: {
    tag: PropertyTag.caption,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._showInIndex]: {
    tag: PropertyTag.showInIndex,
    single: true,
    format: PropertyFormat.boolean,
  },
  [PropertyConfigKey._alt]: {
    tag: PropertyTag.alt,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._src1x]: {
    tag: PropertyTag.src1x,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._src2x]: {
    tag: PropertyTag.src2x,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._src3x]: {
    tag: PropertyTag.src3x,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._src4x]: {
    tag: PropertyTag.src4x,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._mute]: {
    tag: PropertyTag.mute,
    single: true,
    format: PropertyFormat.boolean,
  },
  [PropertyConfigKey._autoplay]: {
    tag: PropertyTag.autoplay,
    single: true,
    format: PropertyFormat.boolean,
  },
  [PropertyConfigKey._allowSubtitles]: {
    tag: PropertyTag.allowSubtitles,
    single: true,
    format: PropertyFormat.boolean,
  },
  [PropertyConfigKey._showSubtitles]: {
    tag: PropertyTag.showSubtitles,
    single: true,
    format: PropertyFormat.boolean,
  },
  [PropertyConfigKey._siteName]: {
    tag: PropertyTag.siteName,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey._posterImage]: {
    tag: PropertyTag.posterImage,
    single: true,
    format: PropertyFormat.trimmedString,
  },
};

export { PROPERTIES };
