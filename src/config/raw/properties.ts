import { _PropertiesConfig } from '../../model/config/_Config';
import { ConfigKey } from '../../model/config/enum/ConfigKey';
import { PropertyAstKey } from '../../model/enum/PropertyAstKey';
import { PropertyFormat } from '../../model/enum/PropertyFormat';
import { PropertyJsonKey } from '../../model/enum/PropertyJsonKey';
import { PropertyTag } from '../../model/enum/PropertyTag';

const PROPERTIES: _PropertiesConfig = {
  [ConfigKey._property_id]: {
    tag: PropertyTag.id,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_externalId]: {
    tag: PropertyTag.externalId,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_spaceId]: {
    tag: PropertyTag.spaceId,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_padletId]: {
    tag: PropertyTag.padletId,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_aiGenerated]: {
    tag: PropertyTag.aiGenerated,
    single: true,
    format: PropertyFormat.boolean,
    astKey: PropertyAstKey.aiGenerated,
  },
  [ConfigKey._property_releaseVersion]: {
    tag: PropertyTag.releaseVersion,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_ageRange]: {
    tag: PropertyTag.ageRange,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_language]: {
    tag: PropertyTag.language,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_computerLanguage]: {
    tag: PropertyTag.computerLanguage,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_target]: {
    tag: PropertyTag.target,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_tag]: {
    tag: PropertyTag.tag,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_icon]: {
    tag: PropertyTag.icon,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_iconTag]: {
    tag: PropertyTag.iconTag,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_colorTag]: {
    tag: PropertyTag.colorTag,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_flashcardSet]: {
    tag: PropertyTag.flashcardSet,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_subtype]: {
    tag: PropertyTag.subtype,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_coverImage]: {
    tag: PropertyTag.coverImage,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_publisher]: {
    tag: PropertyTag.publisher,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_publications]: {
    tag: PropertyTag.publications,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_author]: {
    tag: PropertyTag.author,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_subject]: {
    tag: PropertyTag.subject,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_date]: {
    tag: PropertyTag.date,
    single: true,
    format: PropertyFormat.string,
  },
  [ConfigKey._property_location]: {
    tag: PropertyTag.location,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_theme]: {
    tag: PropertyTag.theme,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_kind]: {
    tag: PropertyTag.kind,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_action]: {
    tag: PropertyTag.action,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_thumbImage]: {
    tag: PropertyTag.thumbImage,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_focusX]: {
    tag: PropertyTag.focusX,
    single: true,
    format: PropertyFormat.number,
  },
  [ConfigKey._property_focusY]: {
    tag: PropertyTag.focusY,
    single: true,
    format: PropertyFormat.number,
  },
  [ConfigKey._property_deeplink]: {
    tag: PropertyTag.deeplink,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_externalLink]: {
    tag: PropertyTag.externalLink,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_externalLinkText]: {
    tag: PropertyTag.externalLinkText,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_videoCallLink]: {
    tag: PropertyTag.videoCallLink,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_bot]: {
    tag: PropertyTag.bot,
    format: PropertyFormat.string,
  },
  [ConfigKey._property_duration]: {
    tag: PropertyTag.duration,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_reference]: {
    tag: PropertyTag.reference,
    format: PropertyFormat.trimmedString,
    astKey: PropertyAstKey.referenceProperty,
  },
  [ConfigKey._property_list]: {
    tag: PropertyTag.list,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_textReference]: {
    tag: PropertyTag.textReference,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_isTracked]: {
    tag: PropertyTag.isTracked,
    single: true,
    format: PropertyFormat.boolean,
  },
  [ConfigKey._property_isInfoOnly]: {
    tag: PropertyTag.isInfoOnly,
    single: true,
    format: PropertyFormat.boolean,
  },
  [ConfigKey._property_labelTrue]: {
    tag: PropertyTag.labelTrue,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_labelFalse]: {
    tag: PropertyTag.labelFalse,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_quotedPerson]: {
    tag: PropertyTag.quotedPerson,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_partialAnswer]: {
    tag: PropertyTag.partialAnswer,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_example]: {
    tag: PropertyTag.example,
    single: true,
    format: PropertyFormat.string,
  },
  [ConfigKey._property_toc]: {
    tag: PropertyTag.toc,
    single: true,
    format: PropertyFormat.boolean,
    defaultValue: 'true',
  },
  [ConfigKey._property_progress]: {
    tag: PropertyTag.progress,
    single: true,
    format: PropertyFormat.boolean,
    defaultValue: 'true',
  },
  [ConfigKey._property_level]: {
    tag: PropertyTag.level,
    single: true,
    format: PropertyFormat.string,
    astKey: PropertyAstKey.levelProperty,
  },
  [ConfigKey._property_book]: {
    tag: PropertyTag.book,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_partner]: {
    tag: PropertyTag.partner,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_sampleSolution]: {
    tag: PropertyTag.sampleSolution,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_markConfig]: {
    tag: PropertyTag.mark,
    format: PropertyFormat.trimmedString,
    astKey: PropertyAstKey.markConfig,
  },
  [ConfigKey._property_mark]: {
    tag: PropertyTag.mark,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_type]: {
    tag: PropertyTag.type,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_color]: {
    tag: PropertyTag.color,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_emphasis]: {
    tag: PropertyTag.emphasis,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_shortAnswer]: {
    tag: PropertyTag.shortAnswer,
    single: true,
    format: PropertyFormat.boolean,
    astKey: PropertyAstKey.isShortAnswer,
    jsonKey: PropertyJsonKey.shortAnswer,
  },
  [ConfigKey._property_longAnswer]: {
    tag: PropertyTag.longAnswer,
    single: true,
    format: PropertyFormat.invertedBoolean,
    astKey: PropertyAstKey.isShortAnswer,
    jsonKey: PropertyJsonKey.shortAnswer,
  },
  [ConfigKey._property_caseSensitive]: {
    tag: PropertyTag.caseSensitive,
    single: true,
    format: PropertyFormat.boolean,
    astKey: PropertyAstKey.isCaseSensitive,
    jsonKey: PropertyJsonKey.caseSensitive,
  },
  [ConfigKey._property_reaction]: {
    tag: PropertyTag.reaction,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_imageSource]: {
    tag: PropertyTag.imageSource,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_mockupId]: {
    tag: PropertyTag.mockupId,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_size]: {
    tag: PropertyTag.size,
    single: true,
    format: PropertyFormat.number,
  },
  [ConfigKey._property_format]: {
    tag: PropertyTag.format,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_trim]: {
    tag: PropertyTag.trim,
    single: true,
    format: PropertyFormat.boolean,
  },
  [ConfigKey._property_width]: {
    tag: PropertyTag.width,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_height]: {
    tag: PropertyTag.height,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_license]: {
    tag: PropertyTag.license,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_copyright]: {
    tag: PropertyTag.copyright,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_caption]: {
    tag: PropertyTag.caption,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_showInIndex]: {
    tag: PropertyTag.showInIndex,
    single: true,
    format: PropertyFormat.boolean,
  },
  [ConfigKey._property_alt]: {
    tag: PropertyTag.alt,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_src1x]: {
    tag: PropertyTag.src1x,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_src2x]: {
    tag: PropertyTag.src2x,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_src3x]: {
    tag: PropertyTag.src3x,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_src4x]: {
    tag: PropertyTag.src4x,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_mute]: {
    tag: PropertyTag.mute,
    single: true,
    format: PropertyFormat.boolean,
  },
  [ConfigKey._property_autoplay]: {
    tag: PropertyTag.autoplay,
    single: true,
    format: PropertyFormat.boolean,
  },
  [ConfigKey._property_allowSubtitles]: {
    tag: PropertyTag.allowSubtitles,
    single: true,
    format: PropertyFormat.boolean,
  },
  [ConfigKey._property_showSubtitles]: {
    tag: PropertyTag.showSubtitles,
    single: true,
    format: PropertyFormat.boolean,
  },
  [ConfigKey._property_siteName]: {
    tag: PropertyTag.siteName,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [ConfigKey._property_posterImage]: {
    tag: PropertyTag.posterImage,
    single: true,
    format: PropertyFormat.trimmedString,
  },
};

export { PROPERTIES };
