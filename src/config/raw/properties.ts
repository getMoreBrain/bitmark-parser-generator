import { _PropertiesConfig } from '../../model/config/_Config';
import { PropertyConfigKey } from '../../model/config/enum/PropertyConfigKey';
import { PropertyAstKey } from '../../model/enum/PropertyAstKey';
import { PropertyFormat } from '../../model/enum/PropertyFormat';
import { PropertyTag } from '../../model/enum/PropertyTag';

const PROPERTIES: _PropertiesConfig = {
  [PropertyConfigKey.id]: {
    tag: PropertyTag.id,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.internalComment]: {
    tag: PropertyTag.internalComment,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.externalId]: {
    tag: PropertyTag.externalId,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.spaceId]: {
    tag: PropertyTag.spaceId,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.padletId]: {
    tag: PropertyTag.padletId,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.jupyterId]: {
    tag: PropertyTag.jupyterId,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.jupyterExecutionCount]: {
    tag: PropertyTag.jupyterExecutionCount,
    single: true,
    format: PropertyFormat.number,
  },
  [PropertyConfigKey.aiGenerated]: {
    tag: PropertyTag.aiGenerated,
    single: true,
    format: PropertyFormat.boolean,
    astKey: PropertyAstKey.aiGenerated,
  },
  [PropertyConfigKey.releaseVersion]: {
    tag: PropertyTag.releaseVersion,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.releaseKind]: {
    tag: PropertyTag.releaseKind,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.releaseDate]: {
    tag: PropertyTag.releaseDate,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.resolved]: {
    tag: PropertyTag.resolved,
    single: true,
    format: PropertyFormat.boolean,
  },
  [PropertyConfigKey.resolvedDate]: {
    tag: PropertyTag.resolvedDate,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.resolvedBy]: {
    tag: PropertyTag.resolvedBy,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.ageRange]: {
    tag: PropertyTag.ageRange,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.lang]: {
    tag: PropertyTag.lang,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.language]: {
    tag: PropertyTag.language,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.computerLanguage]: {
    tag: PropertyTag.computerLanguage,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.target]: {
    tag: PropertyTag.target,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.tag]: {
    tag: PropertyTag.tag,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.icon]: {
    tag: PropertyTag.icon,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.iconTag]: {
    tag: PropertyTag.iconTag,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.colorTag]: {
    tag: PropertyTag.colorTag,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.flashcardSet]: {
    tag: PropertyTag.flashcardSet,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.subtype]: {
    tag: PropertyTag.subtype,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.bookAlias]: {
    tag: PropertyTag.bookAlias,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.coverImage]: {
    tag: PropertyTag.coverImage,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.coverColor]: {
    tag: PropertyTag.coverColor,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.publisher]: {
    tag: PropertyTag.publisher,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.publications]: {
    tag: PropertyTag.publications,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.author]: {
    tag: PropertyTag.author,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.subject]: {
    tag: PropertyTag.subject,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.date]: {
    tag: PropertyTag.date,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.location]: {
    tag: PropertyTag.location,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.theme]: {
    tag: PropertyTag.theme,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.kind]: {
    tag: PropertyTag.kind,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.action]: {
    tag: PropertyTag.action,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.thumbImage]: {
    tag: PropertyTag.thumbImage,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.scormSource]: {
    tag: PropertyTag.scormSource,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.posterImage]: {
    tag: PropertyTag.posterImage,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.focusX]: {
    tag: PropertyTag.focusX,
    single: true,
    format: PropertyFormat.number,
  },
  [PropertyConfigKey.focusY]: {
    tag: PropertyTag.focusY,
    single: true,
    format: PropertyFormat.number,
  },
  [PropertyConfigKey.deeplink]: {
    tag: PropertyTag.deeplink,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.externalLink]: {
    tag: PropertyTag.externalLink,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.externalLinkText]: {
    tag: PropertyTag.externalLinkText,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.videoCallLink]: {
    tag: PropertyTag.videoCallLink,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.vendorUrl]: {
    tag: PropertyTag.vendorUrl,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.search]: {
    tag: PropertyTag.search,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.bot]: {
    tag: PropertyTag.bot,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.duration]: {
    tag: PropertyTag.duration,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.property_reference]: {
    tag: PropertyTag.reference,
    format: PropertyFormat.trimmedString,
    astKey: PropertyAstKey.referenceProperty,
  },
  [PropertyConfigKey.list]: {
    tag: PropertyTag.list,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.textReference]: {
    tag: PropertyTag.textReference,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.isTracked]: {
    tag: PropertyTag.isTracked,
    single: true,
    format: PropertyFormat.boolean,
  },
  [PropertyConfigKey.isInfoOnly]: {
    tag: PropertyTag.isInfoOnly,
    single: true,
    format: PropertyFormat.boolean,
  },
  [PropertyConfigKey.labelTrue]: {
    tag: PropertyTag.labelTrue,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.labelFalse]: {
    tag: PropertyTag.labelFalse,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.content2Buy]: {
    tag: PropertyTag.content2Buy,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.quotedPerson]: {
    tag: PropertyTag.quotedPerson,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.partialAnswer]: {
    tag: PropertyTag.partialAnswer,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.reasonableNumOfChars]: {
    tag: PropertyTag.reasonableNumOfChars,
    single: true,
    format: PropertyFormat.number,
  },
  [PropertyConfigKey.maxCreatedBits]: {
    tag: PropertyTag.maxCreatedBits,
    single: true,
    format: PropertyFormat.number,
  },
  [PropertyConfigKey.maxDisplayLevel]: {
    tag: PropertyTag.maxDisplayLevel,
    single: true,
    format: PropertyFormat.number,
  },
  [PropertyConfigKey.technicalTerm]: {
    tag: PropertyTag.technicalTerm,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.servings]: {
    tag: PropertyTag.servings,
    single: true,
    format: PropertyFormat.number,
  },
  [PropertyConfigKey.unit]: {
    tag: PropertyTag.unit,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.unitAbbr]: {
    tag: PropertyTag.unitAbbr,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.disableCalculation]: {
    tag: PropertyTag.disableCalculation,
    single: true,
    format: PropertyFormat.boolean,
  },

  [PropertyConfigKey.example]: {
    tag: PropertyTag.example,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.toc]: {
    tag: PropertyTag.toc,
    single: true,
    format: PropertyFormat.boolean,
    defaultValue: 'true',
  },
  [PropertyConfigKey.product]: {
    tag: PropertyTag.product,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.productList]: {
    tag: PropertyTag.product,
    single: false,
    format: PropertyFormat.trimmedString,
    astKey: PropertyAstKey.productList,
  },
  [PropertyConfigKey.productVideo]: {
    tag: PropertyTag.productVideo,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.productVideoList]: {
    tag: PropertyTag.productVideo,
    single: false,
    format: PropertyFormat.trimmedString,
    astKey: PropertyAstKey.productVideoList,
  },
  [PropertyConfigKey.productFolder]: {
    tag: PropertyTag.productFolder,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.progress]: {
    tag: PropertyTag.progress,
    single: true,
    format: PropertyFormat.boolean,
    defaultValue: 'true',
  },
  [PropertyConfigKey.book]: {
    tag: PropertyTag.book,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.person]: {
    tag: PropertyTag.person,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  // Deprecated (replaced by person)
  [PropertyConfigKey.partner]: {
    tag: PropertyTag.partner,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.property_sampleSolution]: {
    tag: PropertyTag.sampleSolution,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.markConfig]: {
    tag: PropertyTag.mark,
    format: PropertyFormat.trimmedString,
    astKey: PropertyAstKey.markConfig,
  },
  [PropertyConfigKey.property_mark]: {
    tag: PropertyTag.mark,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.color]: {
    tag: PropertyTag.color,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.emphasis]: {
    tag: PropertyTag.emphasis,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.isCaseSensitive]: {
    tag: PropertyTag.isCaseSensitive,
    single: true,
    format: PropertyFormat.boolean,
  },
  [PropertyConfigKey.reaction]: {
    tag: PropertyTag.reaction,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.imageSource]: {
    tag: PropertyTag.imageSource,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.mockupId]: {
    tag: PropertyTag.mockupId,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.size]: {
    tag: PropertyTag.size,
    single: true,
    format: PropertyFormat.number,
  },
  [PropertyConfigKey.format]: {
    tag: PropertyTag.format,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.property_title]: {
    tag: PropertyTag.title,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.trim]: {
    tag: PropertyTag.trim,
    single: true,
    format: PropertyFormat.boolean,
  },
  [PropertyConfigKey.width]: {
    tag: PropertyTag.width,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.height]: {
    tag: PropertyTag.height,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.license]: {
    tag: PropertyTag.license,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.copyright]: {
    tag: PropertyTag.copyright,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.mailingList]: {
    tag: PropertyTag.mailingList,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.buttonCaption]: {
    tag: PropertyTag.buttonCaption,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.caption]: {
    tag: PropertyTag.caption,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.showInIndex]: {
    tag: PropertyTag.showInIndex,
    single: true,
    format: PropertyFormat.boolean,
  },
  [PropertyConfigKey.alt]: {
    tag: PropertyTag.alt,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.zoomDisabled]: {
    tag: PropertyTag.zoomDisabled,
    single: true,
    format: PropertyFormat.boolean,
  },
  [PropertyConfigKey.src1x]: {
    tag: PropertyTag.src1x,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.src2x]: {
    tag: PropertyTag.src2x,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.src3x]: {
    tag: PropertyTag.src3x,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.src4x]: {
    tag: PropertyTag.src4x,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.mute]: {
    tag: PropertyTag.mute,
    single: true,
    format: PropertyFormat.boolean,
  },
  [PropertyConfigKey.autoplay]: {
    tag: PropertyTag.autoplay,
    single: true,
    format: PropertyFormat.boolean,
  },
  [PropertyConfigKey.allowSubtitles]: {
    tag: PropertyTag.allowSubtitles,
    single: true,
    format: PropertyFormat.boolean,
  },
  [PropertyConfigKey.showSubtitles]: {
    tag: PropertyTag.showSubtitles,
    single: true,
    format: PropertyFormat.boolean,
  },
  [PropertyConfigKey.siteName]: {
    tag: PropertyTag.siteName,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.pointerLeft]: {
    tag: PropertyTag.pointerLeft,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.pointerTop]: {
    tag: PropertyTag.pointerTop,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.backgroundWallpaper]: {
    tag: PropertyTag.backgroundWallpaper,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.blockId]: {
    tag: PropertyTag.blockId,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.pageNo]: {
    tag: PropertyTag.pageNo,
    single: true,
    format: PropertyFormat.number,
  },
  [PropertyConfigKey.x]: {
    tag: PropertyTag.x,
    single: true,
    format: PropertyFormat.number,
  },
  [PropertyConfigKey.y]: {
    tag: PropertyTag.y,
    single: true,
    format: PropertyFormat.number,
  },
  [PropertyConfigKey.index]: {
    tag: PropertyTag.index,
    single: true,
    format: PropertyFormat.number,
  },
  [PropertyConfigKey.classification]: {
    tag: PropertyTag.classification,
    single: true,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.availableClassifications]: {
    tag: PropertyTag.availableClassifications,
    single: false,
    format: PropertyFormat.trimmedString,
  },
  [PropertyConfigKey.tableFixedHeader]: {
    tag: PropertyTag.tableFixedHeader,
    single: true,
    format: PropertyFormat.boolean,
  },
  [PropertyConfigKey.tableSearch]: {
    tag: PropertyTag.tableSearch,
    single: true,
    format: PropertyFormat.boolean,
  },
  [PropertyConfigKey.tableSort]: {
    tag: PropertyTag.tableSort,
    single: true,
    format: PropertyFormat.boolean,
  },
  [PropertyConfigKey.tablePagination]: {
    tag: PropertyTag.tablePagination,
    single: true,
    format: PropertyFormat.boolean,
  },
  [PropertyConfigKey.quizCountItems]: {
    tag: PropertyTag.quizCountItems,
    single: true,
    format: PropertyFormat.boolean,
  },
  [PropertyConfigKey.quizStrikethroughSolutions]: {
    tag: PropertyTag.quizStrikethroughSolutions,
    single: true,
    format: PropertyFormat.boolean,
  },
  [PropertyConfigKey.codeLineNumbers]: {
    tag: PropertyTag.codeLineNumbers,
    single: true,
    format: PropertyFormat.boolean,
  },
  [PropertyConfigKey.codeMinimap]: {
    tag: PropertyTag.codeMinimap,
    single: true,
    format: PropertyFormat.boolean,
  },
};

export { PROPERTIES };
