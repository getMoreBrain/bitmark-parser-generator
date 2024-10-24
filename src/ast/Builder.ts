import { Breakscape } from '../breakscaping/Breakscape';
import { Config } from '../config/Config';
import { BreakscapedString } from '../model/ast/BreakscapedString';
import { PropertyConfigKey } from '../model/config/enum/PropertyConfigKey';
import { BitType, BitTypeType } from '../model/enum/BitType';
import { BodyBitType, BodyBitTypeType } from '../model/enum/BodyBitType';
import { ResourceTag, ResourceTagType } from '../model/enum/ResourceTag';
import { TextFormat, TextFormatType } from '../model/enum/TextFormat';
import { ParserError } from '../model/parser/ParserError';
import { ParserInfo } from '../model/parser/ParserInfo';
import { ArrayUtils } from '../utils/ArrayUtils';
import { BitUtils } from '../utils/BitUtils';
import { NumberUtils } from '../utils/NumberUtils';
import { ObjectUtils } from '../utils/ObjectUtils';
import { env } from '../utils/env/Env';

import { BaseBuilder, WithExample } from './BaseBuilder';
import { NodeValidator } from './rules/NodeValidator';

import {
  Bit,
  BitmarkAst,
  Resource,
  Body,
  Statement,
  Response,
  Quiz,
  Heading,
  Pair,
  Matrix,
  Choice,
  Question,
  FooterText,
  AudioResource,
  ImageResource,
  MatrixCell,
  Gap,
  SelectOption,
  Select,
  HighlightText,
  Highlight,
  ItemLead,
  ExtraProperties,
  BotResponse,
  Person,
  BodyText,
  BodyPart,
  CardNode,
  Mark,
  MarkConfig,
  Example,
  Flashcard,
  ImageSource,
  CardBit,
  Ingredient,
  TechnicalTerm,
  Table,
  Servings,
  RatingLevelStartEnd,
  CaptionDefinition,
  CaptionDefinitionList,
} from '../model/ast/Nodes';

/**
 * Builder to build bitmark AST node programmatically
 */
class Builder extends BaseBuilder {
  /**
   * Build bitmark node
   *
   * @param data - data for the node
   * @returns
   */
  bitmark(data: { bits?: Bit[]; errors?: ParserError[] }): BitmarkAst {
    const { bits, errors } = data;

    const node: BitmarkAst = {
      bits,
      errors,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node);

    return node;
  }

  /**
   * Build bit node
   *
   * @param data - data for the node
   * @returns
   */
  bit(data: {
    bitType: BitTypeType;
    bitLevel: number;
    textFormat?: TextFormatType;
    resourceType?: ResourceTagType; // This is optional, it will be inferred from the resource
    isCommented?: boolean;
    id?: BreakscapedString | BreakscapedString[];
    internalComment?: BreakscapedString | BreakscapedString[];
    externalId?: BreakscapedString | BreakscapedString[];
    spaceId?: BreakscapedString | BreakscapedString[];
    padletId?: BreakscapedString;
    jupyterId?: BreakscapedString;
    jupyterExecutionCount?: number;
    isPublic?: boolean;
    aiGenerated?: boolean;
    machineTranslated?: BreakscapedString;
    analyticsTag?: BreakscapedString | BreakscapedString[];
    feedbackEngine?: BreakscapedString;
    feedbackType?: BreakscapedString;
    disableFeedback?: boolean;
    releaseVersion?: BreakscapedString;
    releaseKind?: BreakscapedString;
    releaseDate?: BreakscapedString;
    ageRange?: number | number[];
    lang?: BreakscapedString;
    language?: BreakscapedString | BreakscapedString[];
    publisher?: BreakscapedString | BreakscapedString[];
    publisherName?: BreakscapedString;
    theme?: BreakscapedString | BreakscapedString[];
    computerLanguage?: BreakscapedString;
    target?: BreakscapedString | BreakscapedString[];
    slug?: BreakscapedString;
    tag?: BreakscapedString | BreakscapedString[];
    reductionTag?: BreakscapedString | BreakscapedString[];
    bubbleTag?: BreakscapedString | BreakscapedString[];
    levelCEFRp?: BreakscapedString | BreakscapedString[];
    levelCEFR?: BreakscapedString | BreakscapedString[];
    levelILR?: BreakscapedString | BreakscapedString[];
    levelACTFL?: BreakscapedString | BreakscapedString[];
    icon?: BreakscapedString;
    iconTag?: BreakscapedString;
    colorTag?: BreakscapedString | BreakscapedString[];
    flashcardSet?: BreakscapedString | BreakscapedString[];
    subtype?: BreakscapedString;
    bookAlias?: BreakscapedString | BreakscapedString[];
    coverImage?: BreakscapedString | BreakscapedString[];
    coverColor?: BreakscapedString;
    publications?: BreakscapedString | BreakscapedString[];
    author?: BreakscapedString | BreakscapedString[];
    subject?: BreakscapedString | BreakscapedString[];
    date?: BreakscapedString;
    dateEnd?: BreakscapedString;
    location?: BreakscapedString;
    kind?: BreakscapedString;
    hasMarkAsDone?: boolean;
    processHandIn?: boolean;
    action?: BreakscapedString;
    blockId?: BreakscapedString;
    pageNo?: number;
    x?: number;
    y?: number;
    width?: string;
    height?: string;
    index?: number;
    classification?: BreakscapedString;
    availableClassifications?: BreakscapedString | BreakscapedString[];
    allowedBit?: BreakscapedString | BreakscapedString[];
    tableFixedHeader?: boolean;
    tableSearch?: boolean;
    tableSort?: boolean;
    tablePagination?: boolean;
    tablePaginationLimit?: number;
    tableHeight?: number;
    tableWhitespaceNoWrap?: boolean;
    tableAutoWidth?: boolean;
    tableResizableColumns?: boolean;
    quizCountItems?: boolean;
    quizStrikethroughSolutions?: boolean;
    codeLineNumbers?: boolean;
    codeMinimap?: boolean;
    stripePricingTableId?: BreakscapedString;
    stripePublishableKey?: BreakscapedString;
    thumbImage?: BreakscapedString;
    scormSource?: BreakscapedString;
    posterImage?: BreakscapedString;
    focusX?: number;
    focusY?: number;
    pointerLeft?: BreakscapedString;
    pointerTop?: BreakscapedString;
    listItemIndent?: number;
    backgroundWallpaper?: BreakscapedString;
    hasBookNavigation?: boolean;
    duration?: BreakscapedString;
    referenceProperty?: BreakscapedString | BreakscapedString[];
    deeplink?: BreakscapedString | BreakscapedString[];
    externalLink?: BreakscapedString;
    externalLinkText?: BreakscapedString;
    videoCallLink?: BreakscapedString;
    vendorUrl?: BreakscapedString;
    search?: BreakscapedString;
    bot?: BreakscapedString | BreakscapedString[];
    list?: BreakscapedString | BreakscapedString[];
    textReference?: BreakscapedString;
    isTracked?: boolean;
    isInfoOnly?: boolean;
    imageFirst?: boolean;
    activityType?: BreakscapedString;
    labelTrue?: BreakscapedString;
    labelFalse?: BreakscapedString;
    content2Buy?: BreakscapedString;
    mailingList?: BreakscapedString;
    buttonCaption?: BreakscapedString;
    callToActionUrl?: BreakscapedString;
    caption?: BreakscapedString;
    quotedPerson?: BreakscapedString;
    reasonableNumOfChars?: number;
    resolved?: boolean;
    resolvedDate?: BreakscapedString;
    resolvedBy?: BreakscapedString;
    maxCreatedBits?: number;
    maxDisplayLevel?: number;
    page?: BreakscapedString | BreakscapedString[];
    productId?: BreakscapedString | BreakscapedString[];
    product?: BreakscapedString | BreakscapedString[];
    productList?: BreakscapedString | BreakscapedString[];
    productVideo?: BreakscapedString | BreakscapedString[];
    productVideoList?: BreakscapedString | BreakscapedString[];
    productFolder?: BreakscapedString;
    technicalTerm?: TechnicalTerm;
    servings?: Servings;
    ratingLevelStart?: RatingLevelStartEnd;
    ratingLevelEnd?: RatingLevelStartEnd;
    ratingLevelSelected?: number;
    partialAnswer?: BreakscapedString;
    book?: BreakscapedString;
    title?: BreakscapedString;
    subtitle?: BreakscapedString;
    level?: number | BreakscapedString;
    toc?: boolean;
    progress?: boolean;
    anchor?: BreakscapedString;
    // If an array is passed to reference, it will be considered an "[@reference:Some text]" property
    // If a BreakscapedText is passed to reference, it will be considered a "[►Reference]" tag
    reference?: BreakscapedString;
    referenceEnd?: BreakscapedString;
    isCaseSensitive?: boolean;
    item?: BreakscapedString;
    lead?: BreakscapedString;
    pageNumber?: BreakscapedString;
    marginNumber?: BreakscapedString;
    hint?: BreakscapedString;
    instruction?: BreakscapedString;
    isDefaultExample?: boolean;
    example?: Example;
    imageSource?: ImageSource;
    person?: Person;
    extraProperties?: {
      [key: string]: unknown | unknown[];
    };
    markConfig?: MarkConfig[];
    imagePlaceholder?: ImageResource;
    resources?: Resource | Resource[];
    body?: Body;
    sampleSolution?: BreakscapedString;
    additionalSolutions?: BreakscapedString | BreakscapedString[];
    elements?: BreakscapedString[];
    flashcards?: Flashcard[];
    statement?: Statement;
    statements?: Statement[];
    responses?: Response[];
    quizzes?: Quiz[];
    heading?: Heading;
    pairs?: Pair[];
    matrix?: Matrix[];
    table?: Table;
    choices?: Choice[];
    questions?: Question[];
    botResponses?: BotResponse[];
    ingredients?: Ingredient[];
    captionDefinitionList?: CaptionDefinitionList;
    cardBits?: CardBit[];
    footer?: FooterText;

    markup?: string;
    parser?: ParserInfo;
  }): Bit | undefined {
    const {
      bitType,
      bitLevel,
      textFormat,
      resourceType,
      isCommented,
      id,
      internalComment,
      externalId,
      spaceId,
      padletId,
      jupyterId,
      jupyterExecutionCount,
      isPublic,
      aiGenerated,
      machineTranslated,
      analyticsTag,
      feedbackEngine,
      feedbackType,
      disableFeedback,
      releaseVersion,
      releaseKind,
      releaseDate,
      ageRange,
      lang,
      language,
      publisher,
      publisherName,
      theme,
      computerLanguage,
      target,
      slug,
      tag,
      reductionTag,
      bubbleTag,
      levelCEFRp,
      levelCEFR,
      levelILR,
      levelACTFL,
      icon,
      iconTag,
      colorTag,
      flashcardSet,
      subtype,
      bookAlias,
      coverImage,
      coverColor,
      publications,
      author,
      subject,
      date,
      dateEnd,
      location,
      kind,
      hasMarkAsDone,
      processHandIn,
      action,
      blockId,
      pageNo,
      x,
      y,
      width,
      height,
      index,
      classification,
      availableClassifications,
      allowedBit,
      tableFixedHeader,
      tableSearch,
      tableSort,
      tablePagination,
      tablePaginationLimit,
      tableHeight,
      tableWhitespaceNoWrap,
      tableAutoWidth,
      tableResizableColumns,
      quizCountItems,
      quizStrikethroughSolutions,
      codeLineNumbers,
      codeMinimap,
      stripePricingTableId,
      stripePublishableKey,
      thumbImage,
      scormSource,
      posterImage,
      focusX,
      focusY,
      pointerLeft,
      pointerTop,
      listItemIndent,
      backgroundWallpaper,
      hasBookNavigation,
      duration,
      referenceProperty,
      deeplink,
      externalLink,
      externalLinkText,
      videoCallLink,
      vendorUrl,
      search,
      bot,
      list,
      textReference,
      isTracked,
      isInfoOnly,
      imageFirst,
      activityType,
      labelTrue,
      labelFalse,
      content2Buy,
      mailingList,
      buttonCaption,
      callToActionUrl,
      caption,
      book,
      quotedPerson,
      partialAnswer,
      reasonableNumOfChars,
      sampleSolution,
      additionalSolutions,
      resolved,
      resolvedDate,
      resolvedBy,
      maxCreatedBits,
      maxDisplayLevel,
      page,
      productId,
      product,
      productList,
      productVideo,
      productVideoList,
      productFolder,
      technicalTerm,
      servings,
      ratingLevelStart,
      ratingLevelEnd,
      ratingLevelSelected,
      title,
      subtitle,
      level,
      toc,
      progress,
      anchor,
      reference,
      referenceEnd,
      isCaseSensitive,
      item,
      lead,
      pageNumber,
      marginNumber,
      hint,
      instruction,
      isDefaultExample,
      example,
      imageSource,
      person,
      markConfig,
      extraProperties,
      imagePlaceholder,
      resources: _resources,
      body,
      footer,

      markup,
      parser,
    } = data;

    const bitConfig = Config.getBitConfig(bitType);

    // Convert resources into an array
    const resources = ArrayUtils.asArray(_resources);

    // Set the card node data
    const cardNode = this.cardNode(data);

    // Add reasonableNumOfChars to the bit only for essay bits (in other cases it will be pushed down the tree)
    const reasonableNumOfCharsProperty = Config.isOfBitType(bitType, BitType.essay)
      ? this.toAstProperty(PropertyConfigKey.reasonableNumOfChars, reasonableNumOfChars)
      : undefined;

    // NOTE: Node order is important and is defined here
    const node: Bit = {
      bitType,
      bitLevel,
      textFormat: TextFormat.fromValue(textFormat) ?? bitConfig.textFormatDefault,
      resourceType: ResourceTag.fromValue(resourceType),
      isCommented,
      id: this.toAstProperty(PropertyConfigKey.id, id),
      internalComment: this.toAstProperty(PropertyConfigKey.internalComment, internalComment),
      externalId: this.toAstProperty(PropertyConfigKey.externalId, externalId),
      spaceId: this.toAstProperty(PropertyConfigKey.spaceId, spaceId),
      padletId: this.toAstProperty(PropertyConfigKey.padletId, padletId),
      jupyterId: this.toAstProperty(PropertyConfigKey.jupyterId, jupyterId),
      jupyterExecutionCount: this.toAstProperty(PropertyConfigKey.jupyterExecutionCount, jupyterExecutionCount),
      isPublic: this.toAstProperty(PropertyConfigKey.isPublic, isPublic),
      aiGenerated: this.toAstProperty(PropertyConfigKey.aiGenerated, aiGenerated),
      machineTranslated: this.toAstProperty(PropertyConfigKey.machineTranslated, machineTranslated),
      analyticsTag: this.toAstProperty(PropertyConfigKey.analyticsTag, analyticsTag),
      feedbackEngine: this.toAstProperty(PropertyConfigKey.feedbackEngine, feedbackEngine),
      feedbackType: this.toAstProperty(PropertyConfigKey.feedbackType, feedbackType),
      disableFeedback: this.toAstProperty(PropertyConfigKey.disableFeedback, disableFeedback),
      releaseVersion: this.toAstProperty(PropertyConfigKey.releaseVersion, releaseVersion),
      releaseKind: this.toAstProperty(PropertyConfigKey.releaseKind, releaseKind),
      releaseDate: this.toAstProperty(PropertyConfigKey.releaseDate, releaseDate),
      book,
      ageRange: this.toAstProperty(PropertyConfigKey.ageRange, ageRange),
      lang: this.toAstProperty(PropertyConfigKey.lang, lang),
      language: this.toAstProperty(PropertyConfigKey.language, language),
      publisher: this.toAstProperty(PropertyConfigKey.publisher, publisher),
      publisherName: this.toAstProperty(PropertyConfigKey.publisherName, publisherName),
      theme: this.toAstProperty(PropertyConfigKey.theme, theme),
      computerLanguage: this.toAstProperty(PropertyConfigKey.computerLanguage, computerLanguage),
      target: this.toAstProperty(PropertyConfigKey.target, target),
      slug: this.toAstProperty(PropertyConfigKey.slug, slug),
      tag: this.toAstProperty(PropertyConfigKey.tag, tag),
      reductionTag: this.toAstProperty(PropertyConfigKey.reductionTag, reductionTag),
      bubbleTag: this.toAstProperty(PropertyConfigKey.bubbleTag, bubbleTag),
      levelCEFRp: this.toAstProperty(PropertyConfigKey.levelCEFRp, levelCEFRp),
      levelCEFR: this.toAstProperty(PropertyConfigKey.levelCEFR, levelCEFR),
      levelILR: this.toAstProperty(PropertyConfigKey.levelILR, levelILR),
      levelACTFL: this.toAstProperty(PropertyConfigKey.levelACTFL, levelACTFL),
      icon: this.toAstProperty(PropertyConfigKey.icon, icon),
      iconTag: this.toAstProperty(PropertyConfigKey.iconTag, iconTag),
      colorTag: this.toAstProperty(PropertyConfigKey.colorTag, colorTag),
      flashcardSet: this.toAstProperty(PropertyConfigKey.flashcardSet, flashcardSet),
      subtype: this.toAstProperty(PropertyConfigKey.subtype, subtype),
      bookAlias: this.toAstProperty(PropertyConfigKey.bookAlias, bookAlias),
      coverImage: this.toAstProperty(PropertyConfigKey.coverImage, coverImage),
      coverColor: this.toAstProperty(PropertyConfigKey.coverColor, coverColor),
      publications: this.toAstProperty(PropertyConfigKey.publications, publications),
      author: this.toAstProperty(PropertyConfigKey.author, author),
      subject: this.toAstProperty(PropertyConfigKey.subject, subject),
      date: this.toAstProperty(PropertyConfigKey.date, date),
      dateEnd: this.toAstProperty(PropertyConfigKey.dateEnd, dateEnd),
      location: this.toAstProperty(PropertyConfigKey.location, location),
      kind: this.toAstProperty(PropertyConfigKey.kind, kind),
      hasMarkAsDone: this.toAstProperty(PropertyConfigKey.hasMarkAsDone, hasMarkAsDone),
      processHandIn: this.toAstProperty(PropertyConfigKey.processHandIn, processHandIn),
      action: this.toAstProperty(PropertyConfigKey.action, action),
      blockId: this.toAstProperty(PropertyConfigKey.blockId, blockId),
      pageNo: this.toAstProperty(PropertyConfigKey.pageNo, pageNo),
      x: this.toAstProperty(PropertyConfigKey.x, x),
      y: this.toAstProperty(PropertyConfigKey.y, y),
      width: this.toAstProperty(PropertyConfigKey.width, width),
      height: this.toAstProperty(PropertyConfigKey.height, height),
      index: this.toAstProperty(PropertyConfigKey.index, index),
      classification: this.toAstProperty(PropertyConfigKey.classification, classification),
      availableClassifications: this.toAstProperty(
        PropertyConfigKey.availableClassifications,
        availableClassifications,
      ),
      allowedBit: this.toAstProperty(PropertyConfigKey.allowedBit, allowedBit),
      tableFixedHeader: this.toAstProperty(PropertyConfigKey.tableFixedHeader, tableFixedHeader),
      tableSearch: this.toAstProperty(PropertyConfigKey.tableSearch, tableSearch),
      tableSort: this.toAstProperty(PropertyConfigKey.tableSort, tableSort),
      tablePagination: this.toAstProperty(PropertyConfigKey.tablePagination, tablePagination),
      tablePaginationLimit: this.toAstProperty(PropertyConfigKey.tablePaginationLimit, tablePaginationLimit),
      tableHeight: this.toAstProperty(PropertyConfigKey.tableHeight, tableHeight),
      tableWhitespaceNoWrap: this.toAstProperty(PropertyConfigKey.tableWhitespaceNoWrap, tableWhitespaceNoWrap),
      tableAutoWidth: this.toAstProperty(PropertyConfigKey.tableAutoWidth, tableAutoWidth),
      tableResizableColumns: this.toAstProperty(PropertyConfigKey.tableResizableColumns, tableResizableColumns),
      quizCountItems: this.toAstProperty(PropertyConfigKey.quizCountItems, quizCountItems),
      quizStrikethroughSolutions: this.toAstProperty(
        PropertyConfigKey.quizStrikethroughSolutions,
        quizStrikethroughSolutions,
      ),
      codeLineNumbers: this.toAstProperty(PropertyConfigKey.codeLineNumbers, codeLineNumbers),
      codeMinimap: this.toAstProperty(PropertyConfigKey.codeMinimap, codeMinimap),
      stripePricingTableId: this.toAstProperty(PropertyConfigKey.stripePricingTableId, stripePricingTableId),
      stripePublishableKey: this.toAstProperty(PropertyConfigKey.stripePublishableKey, stripePublishableKey),
      thumbImage: this.toAstProperty(PropertyConfigKey.thumbImage, thumbImage),
      scormSource: this.toAstProperty(PropertyConfigKey.scormSource, scormSource),
      posterImage: this.toAstProperty(PropertyConfigKey.posterImage, posterImage),
      focusX: this.toAstProperty(PropertyConfigKey.focusX, focusX),
      focusY: this.toAstProperty(PropertyConfigKey.focusY, focusY),
      pointerLeft: this.toAstProperty(PropertyConfigKey.pointerLeft, pointerLeft),
      pointerTop: this.toAstProperty(PropertyConfigKey.pointerTop, pointerTop),
      listItemIndent: this.toAstProperty(PropertyConfigKey.listItemIndent, listItemIndent),
      backgroundWallpaper: this.toAstProperty(PropertyConfigKey.backgroundWallpaper, backgroundWallpaper),
      hasBookNavigation: this.toAstProperty(PropertyConfigKey.hasBookNavigation, hasBookNavigation),
      deeplink: this.toAstProperty(PropertyConfigKey.deeplink, deeplink),
      externalLink: this.toAstProperty(PropertyConfigKey.externalLink, externalLink),
      externalLinkText: this.toAstProperty(PropertyConfigKey.externalLinkText, externalLinkText),
      videoCallLink: this.toAstProperty(PropertyConfigKey.videoCallLink, videoCallLink),
      vendorUrl: this.toAstProperty(PropertyConfigKey.vendorUrl, vendorUrl),
      search: this.toAstProperty(PropertyConfigKey.search, search),
      bot: this.toAstProperty(PropertyConfigKey.bot, bot),
      duration: this.toAstProperty(PropertyConfigKey.duration, duration),
      referenceProperty: this.toAstProperty(PropertyConfigKey.property_reference, referenceProperty),
      list: this.toAstProperty(PropertyConfigKey.list, list),
      textReference: this.toAstProperty(PropertyConfigKey.textReference, textReference),
      isTracked: this.toAstProperty(PropertyConfigKey.isTracked, isTracked),
      isInfoOnly: this.toAstProperty(PropertyConfigKey.isInfoOnly, isInfoOnly),
      imageFirst: this.toAstProperty(PropertyConfigKey.imageFirst, imageFirst),
      activityType: this.toAstProperty(PropertyConfigKey.activityType, activityType),
      labelTrue: this.toAstProperty(PropertyConfigKey.labelTrue, labelTrue),
      labelFalse: this.toAstProperty(PropertyConfigKey.labelFalse, labelFalse),
      content2Buy: this.toAstProperty(PropertyConfigKey.content2Buy, content2Buy),
      mailingList: this.toAstProperty(PropertyConfigKey.mailingList, mailingList),
      buttonCaption: this.toAstProperty(PropertyConfigKey.buttonCaption, buttonCaption),
      callToActionUrl: this.toAstProperty(PropertyConfigKey.callToActionUrl, callToActionUrl),
      caption,
      quotedPerson: this.toAstProperty(PropertyConfigKey.quotedPerson, quotedPerson),
      partialAnswer: this.toAstProperty(PropertyConfigKey.partialAnswer, partialAnswer),
      reasonableNumOfChars: reasonableNumOfCharsProperty,
      sampleSolution: this.toAstProperty(PropertyConfigKey.property_sampleSolution, sampleSolution),
      additionalSolutions: this.toAstProperty(PropertyConfigKey.additionalSolutions, additionalSolutions),
      resolved: this.toAstProperty(PropertyConfigKey.resolved, resolved),
      resolvedDate: this.toAstProperty(PropertyConfigKey.resolvedDate, resolvedDate),
      resolvedBy: this.toAstProperty(PropertyConfigKey.resolvedBy, resolvedBy),
      maxCreatedBits: this.toAstProperty(PropertyConfigKey.maxCreatedBits, maxCreatedBits),
      maxDisplayLevel: this.toAstProperty(PropertyConfigKey.maxDisplayLevel, maxDisplayLevel),
      page: this.toAstProperty(PropertyConfigKey.page, page),
      productId: this.toAstProperty(PropertyConfigKey.productId, productId),
      product: this.toAstProperty(PropertyConfigKey.product, product),
      productList: this.toAstProperty(PropertyConfigKey.productList, productList),
      productVideo: this.toAstProperty(PropertyConfigKey.productVideo, productVideo),
      productVideoList: this.toAstProperty(PropertyConfigKey.productVideoList, productVideoList),
      productFolder: this.toAstProperty(PropertyConfigKey.productFolder, productFolder),
      technicalTerm,
      servings,
      ratingLevelStart,
      ratingLevelEnd,
      ratingLevelSelected: this.toAstProperty(PropertyConfigKey.ratingLevelSelected, ratingLevelSelected),
      title,
      subtitle,
      level: NumberUtils.asNumber(level),
      toc: this.toAstProperty(PropertyConfigKey.toc, toc),
      progress: this.toAstProperty(PropertyConfigKey.progress, progress),
      anchor,
      reference,
      referenceEnd,
      markConfig,
      itemLead: this.itemLead(item, lead, pageNumber, marginNumber),
      hint,
      instruction,
      ...this.toExample(isDefaultExample, example),
      imageSource,
      person,
      imagePlaceholder,
      resources,
      body,
      cardNode,
      footer,

      markup,
      parser,

      // Must always be last in the AST so key clashes are avoided correctly with other properties
      extraProperties: this.parseExtraProperties(extraProperties),
    };

    // Push reasonableNumOfChars down the tree for the interview bit
    if (Config.isOfBitType(bitType, BitType.interview)) {
      this.pushDownTree(
        undefined,
        undefined,
        cardNode,
        'questions',
        PropertyConfigKey.reasonableNumOfChars,
        reasonableNumOfChars,
      );
    }

    // Push isCaseSensitive down the tree for the cloze, match and match-matrix bits
    this.pushDownTree(
      body,
      [BodyBitType.gap],
      undefined,
      undefined,
      PropertyConfigKey.isCaseSensitive,
      isCaseSensitive,
    );

    this.pushDownTree(undefined, undefined, cardNode, 'pairs', PropertyConfigKey.isCaseSensitive, isCaseSensitive);
    this.pushDownTree(
      undefined,
      undefined,
      cardNode,
      ['matrix', 'cells'],
      PropertyConfigKey.isCaseSensitive,
      isCaseSensitive,
    );

    // If isDefaultExample is set at the bit level, push the default example down the tree to the relevant nodes
    this.pushExampleDownTree(body, cardNode, isDefaultExample, example);

    // Set default values
    this.setDefaultBitValues(node);

    // Set the 'isExample' flags
    this.setIsExampleFlags(node);

    // Add the version to the parser info
    this.addVersionToParserInfo(node);

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
      ignoreEmptyString: ['example'],
    });

    // Validate and correct invalid bits as much as possible
    return NodeValidator.validateBit(node);
  }

  /**
   * Build choice node
   *
   * @param data - data for the node
   * @returns
   */
  choice(data: {
    text: BreakscapedString;
    isCorrect: boolean;
    item?: BreakscapedString;
    lead?: BreakscapedString;
    pageNumber?: BreakscapedString;
    marginNumber?: BreakscapedString;
    hint?: BreakscapedString;
    instruction?: BreakscapedString;
    isDefaultExample?: boolean;
    example?: Example;
  }): Choice {
    const { text, isCorrect, item, lead, pageNumber, marginNumber, hint, instruction, isDefaultExample, example } =
      data;

    // NOTE: Node order is important and is defined here
    const node: Choice = {
      text,
      isCorrect: !!isCorrect,
      itemLead: this.itemLead(item, lead, pageNumber, marginNumber),
      hint,
      instruction,
      ...this.toExampleBoolean(isDefaultExample, example),
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
    });

    return node;
  }

  /**
   * Build response node
   *
   * @param data - data for the node
   * @returns
   */
  response(data: {
    text: BreakscapedString;
    isCorrect: boolean;
    item?: BreakscapedString;
    lead?: BreakscapedString;
    pageNumber?: BreakscapedString;
    marginNumber?: BreakscapedString;
    hint?: BreakscapedString;
    instruction?: BreakscapedString;
    isDefaultExample?: boolean;
    example?: Example;
  }): Response {
    const { text, isCorrect, item, lead, pageNumber, marginNumber, hint, instruction, isDefaultExample, example } =
      data;

    // NOTE: Node order is important and is defined here
    const node: Response = {
      text,
      isCorrect: !!isCorrect,
      itemLead: this.itemLead(item, lead, pageNumber, marginNumber),
      hint,
      instruction,
      ...this.toExampleBoolean(isDefaultExample, example),
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
    });

    return node;
  }

  /**
   * Build bot response node
   *
   * @param data - data for the node
   * @returns
   */
  botResponse(data: {
    response: BreakscapedString;
    reaction: BreakscapedString;
    feedback: BreakscapedString;
    item?: BreakscapedString;
    lead?: BreakscapedString;
    pageNumber?: BreakscapedString;
    marginNumber?: BreakscapedString;
    hint?: BreakscapedString;
  }): BotResponse {
    const { response, reaction, feedback, item, lead, pageNumber, marginNumber, hint } = data;

    // NOTE: Node order is important and is defined here
    const node: BotResponse = {
      response,
      reaction,
      feedback,
      itemLead: this.itemLead(item, lead, pageNumber, marginNumber),
      hint,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreEmptyString: ['response', 'reaction', 'feedback'],
    });

    return node;
  }

  /**
   * Build quiz node
   *
   * @param data - data for the node
   * @returns
   */
  quiz(data: {
    item?: BreakscapedString;
    lead?: BreakscapedString;
    pageNumber?: BreakscapedString;
    marginNumber?: BreakscapedString;
    hint?: BreakscapedString;
    instruction?: BreakscapedString;
    isDefaultExample?: boolean;
    example?: Example;
    choices?: Choice[];
    responses?: Response[];
  }): Quiz {
    const { choices, responses, item, lead, pageNumber, marginNumber, hint, instruction, isDefaultExample, example } =
      data;

    // Push isDefaultExample down the tree
    this.pushExampleDownTreeBoolean(isDefaultExample, example, true, choices);
    this.pushExampleDownTreeBoolean(isDefaultExample, example, false, responses);

    // NOTE: Node order is important and is defined here
    const node: Quiz = {
      itemLead: this.itemLead(item, lead, pageNumber, marginNumber),
      hint,
      instruction,
      isExample: isDefaultExample || example != null,
      choices,
      responses,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
    });

    return node;
  }

  /**
   * Build heading node
   *
   * @param data - data for the node
   * @returns
   */
  heading(data: {
    forKeys: BreakscapedString;
    forValues: BreakscapedString | BreakscapedString[];
  }): Heading | undefined {
    const { forKeys, forValues } = data;

    if (forKeys == null) return undefined;

    // NOTE: Node order is important and is defined here
    const node: Heading = {
      forKeys: forKeys || Breakscape.EMPTY_STRING,
      forValues: ArrayUtils.asArray(forValues) ?? [],
    };

    // Remove Unset Optionals
    // ObjectUtils.removeUnwantedProperties(node);

    return node;
  }

  /**
   * Build pair node
   *
   * @param data - data for the node
   * @returns
   */
  pair(data: {
    key?: BreakscapedString;
    keyAudio?: AudioResource;
    keyImage?: ImageResource;
    values: BreakscapedString[];
    item?: BreakscapedString;
    lead?: BreakscapedString;
    pageNumber?: BreakscapedString;
    marginNumber?: BreakscapedString;
    hint?: BreakscapedString;
    instruction?: BreakscapedString;
    isCaseSensitive?: boolean;
    isDefaultExample?: boolean;
    example?: Example;
  }): Pair {
    const {
      key,
      keyAudio,
      keyImage,
      values,
      item,
      lead,
      pageNumber,
      marginNumber,
      hint,
      instruction,
      isCaseSensitive,
      isDefaultExample,
      example,
    } = data;

    // NOTE: Node order is important and is defined here
    const node: Pair = {
      key,
      keyAudio,
      keyImage,
      itemLead: this.itemLead(item, lead, pageNumber, marginNumber),
      hint,
      instruction,
      ...this.toExample(isDefaultExample, example),
      isCaseSensitive,
      values,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
    });

    return node;
  }

  /**
   * Build matrix node
   *
   * @param data - data for the node
   * @returns
   */
  matrix(data: {
    key: BreakscapedString;
    cells: MatrixCell[];
    item?: BreakscapedString;
    lead?: BreakscapedString;
    pageNumber?: BreakscapedString;
    marginNumber?: BreakscapedString;
    hint?: BreakscapedString;
    instruction?: BreakscapedString;
    isDefaultExample?: boolean;
  }): Matrix {
    const { key, cells, item, lead, pageNumber, marginNumber, hint, instruction, isDefaultExample } = data;

    let isExample = false;

    // Set isExample for matrix based on isExample for cells
    for (const c of cells ?? []) {
      if (isDefaultExample && !c.isExample) {
        c.isDefaultExample = true;
        c.isExample = true;
      }
      isExample = c.isExample ? true : isExample;
    }

    // NOTE: Node order is important and is defined here
    const node: Matrix = {
      key,
      itemLead: this.itemLead(item, lead, pageNumber, marginNumber),
      hint,
      instruction,
      isExample,
      cells,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
    });

    return node;
  }

  /**
   * Build matrixCell node
   *
   * @param data - data for the node
   * @returns
   */
  matrixCell(data: {
    values: BreakscapedString[];
    item?: BreakscapedString;
    lead?: BreakscapedString;
    hint?: BreakscapedString;
    pageNumber?: BreakscapedString;
    marginNumber?: BreakscapedString;
    instruction?: BreakscapedString;
    isCaseSensitive?: boolean;
    isDefaultExample?: boolean;
    example?: Example;
  }): MatrixCell {
    const {
      values,
      item,
      lead,
      pageNumber,
      marginNumber,
      hint,
      instruction,
      isCaseSensitive,
      isDefaultExample,
      example,
    } = data;

    // NOTE: Node order is important and is defined here
    const node: MatrixCell = {
      values,
      itemLead: this.itemLead(item, lead, pageNumber, marginNumber),
      hint,
      instruction,
      isCaseSensitive,
      ...this.toExample(isDefaultExample, example),
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
    });

    return node;
  }

  /**
   * Build table node
   *
   * @param data - data for the node
   * @returns
   */
  table(data: { columns: BreakscapedString[]; rows: BreakscapedString[][] }): Table {
    const { columns, rows } = data;

    // NOTE: Node order is important and is defined here
    const node: Table = {
      columns,
      rows,
    };

    // Remove Unset Optionals
    // ObjectUtils.removeUnwantedProperties(node, {
    //   ignoreAllFalse: true,
    // });

    return node;
  }

  /**
   * Build question node
   *
   * @param data - data for the node
   * @returns
   */
  question(data: {
    question: BreakscapedString;
    partialAnswer?: BreakscapedString;
    sampleSolution?: BreakscapedString;
    additionalSolutions?: BreakscapedString[];
    item?: BreakscapedString;
    lead?: BreakscapedString;
    pageNumber?: BreakscapedString;
    marginNumber?: BreakscapedString;
    hint?: BreakscapedString;
    instruction?: BreakscapedString;
    reasonableNumOfChars?: number;
    isDefaultExample?: boolean;
    example?: Example;
  }): Question {
    const {
      question,
      partialAnswer,
      item,
      lead,
      pageNumber,
      marginNumber,
      hint,
      instruction,
      reasonableNumOfChars,
      sampleSolution,
      additionalSolutions,
      isDefaultExample,
      example,
    } = data;

    // NOTE: Node order is important and is defined here
    const node: Question = {
      itemLead: this.itemLead(item, lead, pageNumber, marginNumber),
      question,
      partialAnswer,
      hint,
      instruction,
      ...this.toExample(isDefaultExample, example),
      reasonableNumOfChars,
      sampleSolution,
      additionalSolutions,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreEmptyString: ['question'],
      ignoreAllFalse: true,
    });

    return node;
  }

  /**
   * Build ingredient node
   *
   * @param data - data for the node
   * @returns
   */
  ingredient(data: {
    title?: BreakscapedString;
    checked?: boolean;
    item?: BreakscapedString;
    quantity?: number;
    unit?: BreakscapedString;
    unitAbbr?: BreakscapedString;
    decimalPlaces?: number;
    disableCalculation?: boolean;
  }): Ingredient {
    const { title, checked, item, quantity, unit, unitAbbr, decimalPlaces, disableCalculation } = data;

    // NOTE: Node order is important and is defined here
    const node: Ingredient = {
      title,
      checked: checked ?? false,
      item,
      quantity,
      unit,
      unitAbbr,
      decimalPlaces,
      disableCalculation,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
    });

    return node;
  }

  /**
   * Build body node
   *
   * @param data - data for the node
   * @returns
   */
  body(data: { bodyParts?: BodyPart[]; bodyJson?: unknown }): Body {
    const { bodyParts, bodyJson } = data;

    const node: Body = {
      bodyParts,
      bodyJson,
    };

    return node;
  }

  /**
   * Build bodyPartText node
   *
   * @param data - data for the node
   * @returns
   */
  bodyText(data: { text: BreakscapedString }): BodyText {
    const { text } = data;

    // NOTE: Node order is important and is defined here
    const node: BodyText = {
      type: BodyBitType.text,
      data: {
        bodyText: text,
      },
    };
    return node;
  }

  /**
   * Build footer node
   *
   * @param data - data for the node
   * @returns
   */
  footerText(data: { text: BreakscapedString }): FooterText {
    const { text } = data;

    // NOTE: Node order is important and is defined here
    const node: FooterText = {
      footerText: text,
    };
    return node;
  }

  /**
   * Build gap node
   *
   * @param data - data for the node
   * @returns
   */
  gap(data: {
    solutions: BreakscapedString[];
    item?: BreakscapedString;
    lead?: BreakscapedString;
    pageNumber?: BreakscapedString;
    marginNumber?: BreakscapedString;
    hint?: BreakscapedString;
    instruction?: BreakscapedString;
    isCaseSensitive?: boolean;
    isDefaultExample?: boolean;
    example?: Example;
  }): Gap {
    const {
      solutions,
      item,
      lead,
      pageNumber,
      marginNumber,
      hint,
      instruction,
      isCaseSensitive,
      isDefaultExample,
      example,
    } = data;

    // const defaultExample = Array.isArray(solutions) && solutions.length === 1 ? solutions[0] : null;

    // NOTE: Node order is important and is defined here
    const node: Gap = {
      type: BodyBitType.gap,
      data: {
        solutions,
        itemLead: this.itemLead(item, lead, pageNumber, marginNumber),
        hint,
        instruction,
        isCaseSensitive,
        ...this.toExample(isDefaultExample, example),
      },
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
    });

    return node;
  }

  /**
   * Build mark config node
   *
   * @param data - data for the node
   * @returns
   */
  markConfig(data: { mark: BreakscapedString; color?: BreakscapedString; emphasis?: BreakscapedString }): MarkConfig {
    const { mark, color, emphasis } = data;

    // NOTE: Node order is important and is defined here
    const node: MarkConfig = {
      mark,
      color,
      emphasis,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node);

    return node;
  }

  /**
   * Build mark node
   *
   * @param data - data for the node
   * @returns
   */
  mark(data: {
    solution: BreakscapedString;
    mark?: BreakscapedString;
    item?: BreakscapedString;
    lead?: BreakscapedString;
    pageNumber?: BreakscapedString;
    marginNumber?: BreakscapedString;
    hint?: BreakscapedString;
    instruction?: BreakscapedString;
    isDefaultExample?: boolean;
    example?: BreakscapedString | boolean;
  }): Mark {
    const { solution, mark, item, lead, pageNumber, marginNumber, hint, instruction, isDefaultExample, example } = data;

    // NOTE: Node order is important and is defined here
    const node: Mark = {
      type: BodyBitType.mark,
      data: {
        solution,
        mark,
        itemLead: this.itemLead(item, lead, pageNumber, marginNumber),
        hint,
        instruction,
        ...this.toExample(isDefaultExample, example),
      },
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node);

    return node;
  }

  /**
   * Build select node
   *
   * @param data - data for the node
   * @returns
   */
  select(data: {
    options: SelectOption[];
    prefix?: BreakscapedString;
    postfix?: BreakscapedString;
    item?: BreakscapedString;
    lead?: BreakscapedString;
    pageNumber?: BreakscapedString;
    marginNumber?: BreakscapedString;
    hint?: BreakscapedString;
    instruction?: BreakscapedString;
  }): Select {
    const { options, prefix, postfix, item, lead, pageNumber, marginNumber, hint, instruction } = data;

    // NOTE: Node order is important and is defined here
    const node: Select = {
      type: BodyBitType.select,
      data: {
        prefix,
        options,
        postfix,
        itemLead: this.itemLead(item, lead, pageNumber, marginNumber),
        hint,
        instruction,
      },
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
    });

    return node;
  }

  /**
   * Build selectOption node
   *
   * @param data - data for the node
   * @returns
   */
  selectOption(data: {
    text: BreakscapedString;
    isCorrect: boolean;
    item?: BreakscapedString;
    lead?: BreakscapedString;
    pageNumber?: BreakscapedString;
    marginNumber?: BreakscapedString;
    hint?: BreakscapedString;
    instruction?: BreakscapedString;
    isDefaultExample?: boolean;
    example?: Example;
  }): SelectOption {
    const { text, isCorrect, item, lead, pageNumber, marginNumber, hint, instruction, isDefaultExample, example } =
      data;

    // NOTE: Node order is important and is defined here
    const node: SelectOption = {
      text,
      isCorrect: !!isCorrect,
      itemLead: this.itemLead(item, lead, pageNumber, marginNumber),
      hint,
      instruction,
      ...this.toExample(isDefaultExample, example),
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
    });

    return node;
  }

  /**
   * Build highlight node
   *
   * @param data - data for the node
   * @returns
   */
  highlight(data: {
    texts: HighlightText[];
    prefix?: BreakscapedString;
    postfix?: BreakscapedString;
    item?: BreakscapedString;
    lead?: BreakscapedString;
    pageNumber?: BreakscapedString;
    marginNumber?: BreakscapedString;
    hint?: BreakscapedString;
    instruction?: BreakscapedString;
  }): Highlight {
    const { texts, prefix, postfix, item, lead, pageNumber, marginNumber, hint, instruction } = data;

    // NOTE: Node order is important and is defined here
    const node: Highlight = {
      type: BodyBitType.highlight,
      data: {
        prefix,
        texts,
        postfix,
        itemLead: this.itemLead(item, lead, pageNumber, marginNumber),
        hint,
        instruction,
      },
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
    });

    return node;
  }

  /**
   * Build highlightText node
   *
   * @param data - data for the node
   * @returns
   */
  highlightText(data: {
    text: BreakscapedString;
    isCorrect: boolean;
    isHighlighted: boolean;
    item?: BreakscapedString;
    lead?: BreakscapedString;
    pageNumber?: BreakscapedString;
    marginNumber?: BreakscapedString;
    hint?: BreakscapedString;
    instruction?: BreakscapedString;
    isDefaultExample?: boolean;
    example?: Example;
  }): HighlightText {
    const {
      text,
      isCorrect,
      isHighlighted,
      item,
      lead,
      pageNumber,
      marginNumber,
      hint,
      instruction,
      isDefaultExample,
      example,
    } = data;

    // NOTE: Node order is important and is defined here
    const node: HighlightText = {
      text,
      isCorrect: !!isCorrect,
      isHighlighted: !!isHighlighted,
      itemLead: this.itemLead(item, lead, pageNumber, marginNumber),
      hint,
      instruction,
      ...this.toExample(isDefaultExample, example),
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
    });

    return node;
  }

  /**
   * Build flashcard node
   *
   * @param data - data for the node
   * @returns
   */
  flashcard(data: {
    question: BreakscapedString;
    answer?: BreakscapedString;
    alternativeAnswers?: BreakscapedString[];
    item?: BreakscapedString;
    lead?: BreakscapedString;
    pageNumber?: BreakscapedString;
    marginNumber?: BreakscapedString;
    hint?: BreakscapedString;
    instruction?: BreakscapedString;
    isDefaultExample?: boolean;
    example?: Example;
  }): Flashcard {
    const {
      question,
      answer,
      alternativeAnswers,
      item,
      lead,
      pageNumber,
      marginNumber,
      hint,
      instruction,
      isDefaultExample,
      example,
    } = data;

    // NOTE: Node order is important and is defined here
    const node: Flashcard = {
      question,
      answer,
      alternativeAnswers,
      itemLead: this.itemLead(item, lead, pageNumber, marginNumber),
      hint,
      instruction,
      ...this.toExampleBoolean(isDefaultExample, example),
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
    });

    return node;
  }

  /**
   * Build statement node
   *
   * @param data - data for the node
   * @returns
   */
  statement(data: {
    text: BreakscapedString;
    isCorrect: boolean;
    item?: BreakscapedString;
    lead?: BreakscapedString;
    pageNumber?: BreakscapedString;
    marginNumber?: BreakscapedString;
    hint?: BreakscapedString;
    instruction?: BreakscapedString;
    isDefaultExample?: boolean;
    example?: Example;
  }): Statement {
    const { text, isCorrect, item, lead, pageNumber, marginNumber, hint, instruction, isDefaultExample, example } =
      data;

    // NOTE: Node order is important and is defined here
    const node: Statement = {
      text,
      isCorrect: !!isCorrect,
      itemLead: this.itemLead(item, lead, pageNumber, marginNumber),
      hint,
      instruction,
      ...this.toExampleBoolean(isDefaultExample, example),
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
    });

    return node;
  }

  /**
   * Build (image-on-device) imageSource node
   *
   * @param data - data for the node
   * @returns
   */
  imageSource(data: {
    url: BreakscapedString;
    mockupId: BreakscapedString;
    size?: number;
    format?: BreakscapedString;
    trim?: boolean;
  }): ImageSource {
    const { url, mockupId, size, format, trim } = data;

    // NOTE: Node order is important and is defined here
    const node: ImageSource = {
      url,
      mockupId,
      size,
      format,
      trim,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreFalse: ['trim'],
    });

    return node;
  }

  /**
   * Build (chat) person node
   *
   * @param data - data for the node
   * @returns
   */
  person(data: { name: BreakscapedString; title?: BreakscapedString; avatarImage?: ImageResource }): Person {
    const { name, title, avatarImage } = data;

    // NOTE: Node order is important and is defined here
    const node: Person = {
      name,
      title,
      avatarImage,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node);

    return node;
  }

  /**
   * Build (cook-ingredients) technicalTerm node
   *
   * @param data - data for the node
   * @returns
   */
  technicalTerm(data: { technicalTerm: BreakscapedString; lang?: BreakscapedString }): TechnicalTerm {
    const { technicalTerm, lang } = data;

    // NOTE: Node order is important and is defined here
    const node: TechnicalTerm = {
      technicalTerm,
      lang,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node);

    return node;
  }

  /**
   * Build (cook-ingredients) servings node
   *
   * @param data - data for the node
   * @returns
   */
  servings(data: {
    servings: number;
    unit?: BreakscapedString;
    unitAbbr?: BreakscapedString;
    decimalPlaces?: number;
    disableCalculation?: boolean;
    hint?: BreakscapedString;
  }): Servings {
    const { servings, unit, unitAbbr, decimalPlaces, disableCalculation, hint } = data;

    // NOTE: Node order is important and is defined here
    const node: Servings = {
      servings,
      unit,
      unitAbbr,
      decimalPlaces,
      disableCalculation,
      hint,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node);

    return node;
  }

  /**
   * Build (survey-rating) ratingLevelStart / ratingLevelEnd node
   *
   * @param data - data for the node
   * @returns
   */
  ratingLevelStartEnd(data: { level: number; label?: BreakscapedString }): RatingLevelStartEnd {
    const { level, label } = data;

    // NOTE: Node order is important and is defined here
    const node: RatingLevelStartEnd = {
      level,
      label,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node);

    return node;
  }

  /**
   * Build captionDefinition node
   *
   * @param data - data for the node
   * @returns
   */
  captionDefinition(data: { term: BreakscapedString; description: BreakscapedString }): CaptionDefinition {
    const { term, description } = data;

    // NOTE: Node order is important and is defined here
    const node: CaptionDefinition = {
      term,
      description,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node);

    return node;
  }

  /**
   * Build captionDefinitionList node
   *
   * @param data - data for the node
   * @returns
   */
  captionDefinitionList(data: {
    columns: BreakscapedString[];
    definitions: CaptionDefinition[];
  }): CaptionDefinitionList {
    const { columns, definitions } = data;

    // NOTE: Node order is important and is defined here
    const node: CaptionDefinitionList = {
      columns,
      definitions,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node);

    return node;
  }

  //
  // Private
  //

  private itemLead(
    item: BreakscapedString | undefined,
    lead: BreakscapedString | undefined,
    pageNumber: BreakscapedString | undefined,
    marginNumber: BreakscapedString | undefined,
  ): ItemLead | undefined {
    let node: ItemLead | undefined;

    // NOTE: Node order is important and is defined here
    if (item || lead || pageNumber || marginNumber) {
      node = {
        item,
        lead,
        pageNumber,
        marginNumber,
      };
    }

    return node;
  }

  /**
   * Build card bit node
   *
   * @param data - data for the node
   * @returns
   */
  cardBit(data: {
    item?: BreakscapedString;
    lead?: BreakscapedString;
    pageNumber?: BreakscapedString;
    marginNumber?: BreakscapedString;
    hint?: BreakscapedString;
    instruction?: BreakscapedString;
    isDefaultExample?: boolean;
    example?: Example;
    extraProperties?: {
      [key: string]: unknown | unknown[];
    };
    body?: Body;
  }): CardBit | undefined {
    const {
      item,
      lead,
      pageNumber,
      marginNumber,
      hint,
      instruction,
      isDefaultExample,
      example,
      extraProperties,
      body,
    } = data;

    // NOTE: Node order is important and is defined here
    const node: CardBit = {
      itemLead: this.itemLead(item, lead, pageNumber, marginNumber),
      hint,
      instruction,
      ...this.toExample(isDefaultExample, example),
      body,

      // Must always be last in the AST so key clashes are avoided correctly with other properties
      extraProperties: this.parseExtraProperties(extraProperties),
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
      ignoreEmptyString: ['example'],
    });

    // Validate and correct invalid bits as much as possible
    return NodeValidator.validateCardBit(node);
  }

  private cardNode(data: {
    flashcards?: Flashcard[];
    questions?: Question[];
    elements?: BreakscapedString[];
    statement?: Statement;
    statements?: Statement[];
    choices?: Choice[];
    responses?: Response[];
    quizzes?: Quiz[];
    heading?: Heading;
    pairs?: Pair[];
    matrix?: Matrix[];
    table?: Table;
    botResponses?: BotResponse[];
    ingredients?: Ingredient[];
    captionDefinitionList?: CaptionDefinitionList;
    cardBits?: CardBit[];
  }): CardNode | undefined {
    let node: CardNode | undefined;
    const {
      questions,
      elements,
      flashcards,
      statement,
      statements,
      choices,
      responses,
      quizzes,
      heading,
      pairs,
      matrix,
      table,
      botResponses,
      ingredients,
      captionDefinitionList,
      cardBits,
    } = data;

    if (
      questions ||
      elements ||
      flashcards ||
      statement ||
      statements ||
      choices ||
      responses ||
      quizzes ||
      heading ||
      pairs ||
      matrix ||
      table ||
      botResponses ||
      ingredients ||
      captionDefinitionList ||
      cardBits
    ) {
      node = {
        questions,
        elements,
        flashcards,
        statement,
        statements,
        choices,
        responses,
        quizzes,
        heading,
        pairs,
        matrix,
        table,
        botResponses,
        ingredients,
        captionDefinitionList,
        cardBits,
      };

      // Remove Unset Optionals
      ObjectUtils.removeUnwantedProperties(node);
    }

    return node;
  }

  /**
   * Set examples down the tree
   *
   * @param body
   * @param cardNode
   * @param isDefaultExample
   * @param example
   * @returns true if any of the answers has an example, otherwise undefined
   */
  private pushExampleDownTree(
    body: Body | undefined,
    cardNode: CardNode | undefined,
    isDefaultExample: boolean | undefined,
    example: Example | undefined,
  ): void {
    if (isDefaultExample || example) {
      if (cardNode) {
        this.pushExampleDownTreeString(isDefaultExample, example, cardNode.pairs as WithExample[]);
        this.pushExampleDownTreeBoolean(isDefaultExample, example, false, cardNode.flashcards as WithExample[]);
        this.pushExampleDownTreeBoolean(isDefaultExample, example, true, cardNode.choices as WithExample[]);
        this.pushExampleDownTreeBoolean(
          isDefaultExample,
          example,
          false,
          cardNode.responses as WithExample[],
          cardNode.statements as WithExample[],
          cardNode.statement as WithExample,
        );
        if (cardNode.quizzes) {
          for (const quiz of cardNode.quizzes) {
            this.pushExampleDownTreeBoolean(isDefaultExample, example, true, quiz.choices);
            this.pushExampleDownTreeBoolean(isDefaultExample, example, false, quiz.responses);
          }
        }
        if (cardNode.matrix) {
          for (const m of cardNode.matrix) {
            this.pushExampleDownTreeString(isDefaultExample, example, m.cells);
          }
        }
      }
      if (body) {
        this.pushExampleDownTreeBodyBits(isDefaultExample, example, body);
      }
    }
  }

  /**
   * Set examples for boolean nodes
   *
   * @param isDefaultExample
   * @param example
   * @param onlyCorrect
   * @param nodes
   * @returns true if any of the answers has an example, otherwise undefined
   */
  private pushExampleDownTreeBoolean(
    isDefaultExample: boolean | undefined,
    example: Example | undefined,
    onlyCorrect: boolean,
    ...nodes: (WithExample | WithExample[] | undefined)[]
  ): void {
    if (!isDefaultExample && !example) return;

    if (Array.isArray(nodes)) {
      for (const ds of nodes) {
        if (ds) {
          const exampleNodes = Array.isArray(ds) ? ds : [ds];
          BitUtils.fillBooleanExample(exampleNodes, isDefaultExample, example, onlyCorrect);
        }
      }
    }
  }

  /**
   * Set examples for string nodes
   *
   * @param isDefaultExample
   * @param example
   * @param nodes
   * @returns true if any of the answers has an example, otherwise undefined
   */
  private pushExampleDownTreeString(
    isDefaultExample: boolean | undefined,
    example: Example | undefined,
    ...nodes: (WithExample | WithExample[] | undefined)[]
  ): void {
    if (!isDefaultExample && !example) return;

    if (Array.isArray(nodes)) {
      for (const ds of nodes) {
        if (ds) {
          const exampleNodes = Array.isArray(ds) ? ds : [ds];
          BitUtils.fillStringExample(exampleNodes, isDefaultExample, example, false);
        }
      }
    }
  }

  private pushExampleDownTreeBodyBits(
    isDefaultExample: boolean | undefined,
    example: Example | undefined,
    body: Body | undefined,
  ): void {
    if (!isDefaultExample && !example) return;
    if (!body || !body.bodyParts || body.bodyParts.length === 0) return;

    for (const part of body.bodyParts) {
      if (part) {
        switch (part.type) {
          case BodyBitType.gap: {
            const gap = part as Gap;
            BitUtils.fillStringExample([gap.data], isDefaultExample, example, false);
            break;
          }
          case BodyBitType.mark: {
            const mark = part as Mark;
            BitUtils.fillBooleanExample([mark.data], isDefaultExample, example, false);
            break;
          }
          case BodyBitType.select: {
            const select = part as Select;
            BitUtils.fillBooleanExample(select.data.options, isDefaultExample, example, true);
            break;
          }
          case BodyBitType.highlight: {
            const highlight = part as Highlight;
            BitUtils.fillBooleanExample(highlight.data.texts, isDefaultExample, example, true);
            break;
          }
        }
      }
    }
  }

  /**
   * Push a value down the tree, without overriding existing values
   *
   * This function is not type safe and should be used with care
   *
   * @param body set if the value should be passed down the body to the body bits
   * @param bodyBitTypes body bit types to push the value down to
   * @param cardNode set if the value should be passed down the card node
   * @param path path for the value
   * @param value the value to push down
   */
  private pushDownTree(
    body: Body | undefined,
    bodyBitTypes: BodyBitTypeType[] | undefined,
    cardNode: CardNode | undefined,
    cardNodePath: string | string[] | undefined,
    path: string,
    value: unknown,
  ): void {
    if (value === undefined) return;

    // Add value to card nodes if required (TODO - nested paths)
    if (cardNode && cardNodePath) {
      if (!Array.isArray(cardNodePath)) cardNodePath = [cardNodePath];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = ObjectUtils.flatMapPath(cardNode, cardNodePath) as any[];

      for (const d of data) {
        if (d[path] == null) {
          d[path] = value;
        }
      }
    }

    // Add value to body bit types if required
    if (bodyBitTypes && body && body.bodyParts && body.bodyParts.length > 0) {
      for (const part of body.bodyParts) {
        if (part) {
          if (bodyBitTypes.indexOf(part.type) !== -1) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data = part.data as any;
            if (data[path] == null) {
              data[path] = value;
            }
          }
        }
      }
    }
  }

  private parseExtraProperties(extraProperties: { [key: string]: unknown } | undefined): ExtraProperties | undefined {
    if (!extraProperties) return undefined;

    const entries = Object.entries(extraProperties);
    if (entries.length === 0) return undefined;

    const res: ExtraProperties = {};

    for (const [key, value] of entries) {
      res[key] = ArrayUtils.asArray(value) || [value];
    }

    return res;
  }

  /**
   * Set the 'isExample' flags on the bit
   *
   * The flag is set if the bit has an example. The flag is set at each branch level up the tree from
   * where the 'example' exists.
   *
   * @param bit
   */
  private setIsExampleFlags(bit: Bit) {
    bit.isExample = false;

    const checkIsExample = (example: WithExample): boolean => {
      if (!example) return false;

      if (example.isDefaultExample || example.example != undefined) {
        example.isExample = true;
        bit.isExample = true;
      } else {
        if (example === bit) {
          example.isExample = !!bit.isExample;
        } else {
          example.isExample = false;
        }
      }
      return example.isExample;
    };

    const { body, cardNode } = bit;

    // Body bit level

    if (body && body.bodyParts) {
      for (const bodyPart of body.bodyParts) {
        switch (bodyPart.type) {
          case BodyBitType.gap:
          case BodyBitType.mark: {
            checkIsExample(bodyPart.data as WithExample);
            break;
          }

          case BodyBitType.select: {
            const select = bodyPart as Select;
            let hasExample = false;
            for (const option of select.data.options) {
              hasExample = checkIsExample(option as WithExample) ? true : hasExample;
            }
            select.data.isExample = hasExample;
            break;
          }

          case BodyBitType.highlight: {
            const highlight = bodyPart as Highlight;
            let hasExample = false;
            for (const text of highlight.data.texts) {
              hasExample = checkIsExample(text as WithExample) ? true : hasExample;
            }
            highlight.data.isExample = hasExample;
            break;
          }
        }
      }
    }

    // Card level

    if (cardNode) {
      // flashcards
      for (const v of cardNode.flashcards ?? []) {
        checkIsExample(v as WithExample);
      }

      // pairs
      for (const v of cardNode.pairs ?? []) {
        checkIsExample(v as WithExample);
      }
      // matrix
      for (const mx of cardNode.matrix ?? []) {
        let hasExample = false;

        // matrix cell
        for (const v of mx.cells ?? []) {
          hasExample = checkIsExample(v as WithExample) ? true : hasExample;
        }
        mx.isExample = hasExample;
      }
      // quizzes
      for (const quiz of cardNode.quizzes ?? []) {
        let hasExample = false;

        // responses
        for (const v of quiz.responses ?? []) {
          hasExample = checkIsExample(v as WithExample) ? true : hasExample;
        }
        // choices
        for (const v of quiz.choices ?? []) {
          hasExample = checkIsExample(v as WithExample) ? true : hasExample;
        }
        quiz.isExample = hasExample;
      }
      // responses
      for (const v of cardNode.responses ?? []) {
        checkIsExample(v as WithExample);
      }
      // choices
      for (const v of cardNode.choices ?? []) {
        checkIsExample(v as WithExample);
      }
      // statements
      for (const v of cardNode.statements ?? []) {
        checkIsExample(v as WithExample);
      }
      // statement
      checkIsExample(cardNode.statement as WithExample);
      // NO: elements
      // questions
      for (const v of cardNode.questions ?? []) {
        checkIsExample(v as WithExample);
      }
    }

    // Bit level

    // statement
    checkIsExample(bit.statement as WithExample);
    // responses
    for (const v of bit.responses ?? []) {
      checkIsExample(v as WithExample);
    }
    // choices
    for (const v of bit.choices ?? []) {
      checkIsExample(v as WithExample);
    }

    // Bit itself
    checkIsExample(bit as WithExample);
  }

  private setDefaultBitValues(bit: Bit) {
    // Set aiGenerated == true for all AI generated bits
    switch (bit.bitType) {
      case BitType.articleAi:
      case BitType.noteAi:
      case BitType.summaryAi:
        bit.aiGenerated = this.toAstProperty(PropertyConfigKey.aiGenerated, true);
        break;
    }
  }

  private addVersionToParserInfo(bit: Bit) {
    const parser: ParserInfo = bit.parser ?? {};
    parser.version = env.appVersion.full;
    bit.parser = parser;
  }
}

export { Builder };
