import { Config } from '../config/Config';
import { Bit, BitmarkAst, Body, ExtraProperties, CardNode, CardBit, Footer, BodyBit } from '../model/ast/Nodes';
import { JsonText, TextAst } from '../model/ast/TextNodes';
import { PropertyConfigKey } from '../model/config/enum/PropertyConfigKey';
import { BitType, BitTypeType } from '../model/enum/BitType';
import { BodyBitType, BodyBitTypeType } from '../model/enum/BodyBitType';
import { ResourceTag, ResourceTagType } from '../model/enum/ResourceTag';
import { TextFormat, TextFormatType } from '../model/enum/TextFormat';
import { AudioResourceWrapperJson, ImageResourceWrapperJson, ResourceJson } from '../model/json/ResourceJson';
import { ParserError } from '../model/parser/ParserError';
import { ParserInfo } from '../model/parser/ParserInfo';
import { ArrayUtils } from '../utils/ArrayUtils';
import { BitUtils } from '../utils/BitUtils';
import { BooleanUtils } from '../utils/BooleanUtils';
import { NumberUtils } from '../utils/NumberUtils';
import { ObjectUtils } from '../utils/ObjectUtils';
import { env } from '../utils/env/Env';

import { BaseBuilder, WithExampleJson } from './BaseBuilder';
import { ResourceBuilder } from './ResourceBuilder';
import { NodeValidator } from './rules/NodeValidator';

import {
  BotResponseJson,
  CaptionDefinitionJson,
  CaptionDefinitionListJson,
  ChoiceJson,
  DescriptionListItemJson,
  ExampleJson,
  FlashcardJson,
  HeadingJson,
  ImageSourceJson,
  IngredientJson,
  MarkConfigJson,
  MatrixCellJson,
  MatrixJson,
  PairJson,
  PersonJson,
  QuestionJson,
  QuizJson,
  RatingLevelStartEndJson,
  ResponseJson,
  ServingsJson,
  StatementJson,
  TableJson,
  TechnicalTermJson,
} from '../model/json/BitJson';
import {
  GapJson,
  HighlightJson,
  HighlightTextJson,
  MarkJson,
  SelectJson,
  SelectOptionJson,
} from '../model/json/BodyBitJson';

/**
 * Builder to build bitmark AST node programmatically
 */
class Builder extends BaseBuilder {
  private resourceBuilder: ResourceBuilder = new ResourceBuilder();

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
    id?: string | string[];
    internalComment?: string | string[];
    externalId?: string | string[];
    spaceId?: string | string[];
    padletId?: string;
    jupyterId?: string;
    jupyterExecutionCount?: number;
    isPublic?: boolean;
    aiGenerated?: boolean;
    machineTranslated?: string;
    analyticsTag?: string | string[];
    feedbackEngine?: string;
    feedbackType?: string;
    disableFeedback?: boolean;
    releaseVersion?: string;
    releaseKind?: string;
    releaseDate?: string;
    ageRange?: number | number[];
    lang?: string;
    language?: string | string[];
    publisher?: string | string[];
    publisherName?: string;
    theme?: string | string[];
    computerLanguage?: string;
    target?: string | string[];
    slug?: string;
    tag?: string | string[];
    reductionTag?: string | string[];
    bubbleTag?: string | string[];
    levelCEFRp?: string | string[];
    levelCEFR?: string | string[];
    levelILR?: string | string[];
    levelACTFL?: string | string[];
    icon?: string;
    iconTag?: string;
    colorTag?: string | string[];
    flashcardSet?: string | string[];
    subtype?: string;
    bookAlias?: string | string[];
    coverImage?: string | string[];
    coverColor?: string;
    publications?: string | string[];
    author?: string | string[];
    subject?: string | string[];
    date?: string;
    dateEnd?: string;
    location?: string;
    kind?: string;
    hasMarkAsDone?: boolean;
    processHandIn?: boolean;
    action?: string;
    showInIndex?: boolean;
    blockId?: string;
    pageNo?: number;
    x?: number;
    y?: number;
    width?: string;
    height?: string;
    index?: number;
    classification?: string;
    availableClassifications?: string | string[];
    allowedBit?: string | string[];
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
    stripePricingTableId?: string;
    stripePublishableKey?: string;
    thumbImage?: string;
    scormSource?: string;
    posterImage?: string;
    focusX?: number;
    focusY?: number;
    pointerLeft?: string;
    pointerTop?: string;
    listItemIndent?: number;
    backgroundWallpaper?: string;
    hasBookNavigation?: boolean;
    duration?: string;
    referenceProperty?: string | string[];
    deeplink?: string | string[];
    externalLink?: string;
    externalLinkText?: string;
    videoCallLink?: string;
    vendorUrl?: string;
    search?: string;
    bot?: string | string[];
    list?: string | string[];
    textReference?: string;
    isTracked?: boolean;
    isInfoOnly?: boolean;
    imageFirst?: boolean;
    activityType?: string;
    labelTrue?: string;
    labelFalse?: string;
    content2Buy?: string;
    mailingList?: string;
    buttonCaption?: string;
    callToActionUrl?: string;
    caption?: JsonText;
    quotedPerson?: string;
    reasonableNumOfChars?: number;
    resolved?: boolean;
    resolvedDate?: string;
    resolvedBy?: string;
    maxCreatedBits?: number;
    maxDisplayLevel?: number;
    page?: string | string[];
    productId?: string | string[];
    product?: string | string[];
    productList?: string | string[];
    productVideo?: string | string[];
    productVideoList?: string | string[];
    productFolder?: string;
    technicalTerm?: TechnicalTermJson;
    servings?: ServingsJson;
    ratingLevelStart?: RatingLevelStartEndJson;
    ratingLevelEnd?: RatingLevelStartEndJson;
    ratingLevelSelected?: number;
    partialAnswer?: string;
    book?: string;
    title?: JsonText;
    subtitle?: JsonText;
    level?: number | string;
    toc?: boolean;
    progress?: boolean;
    anchor?: string;
    // If an array is passed to reference, it will be considered an "[@reference:Some text]" property
    // If a BreakscapedText is passed to reference, it will be considered a "[►Reference]" tag
    reference?: string;
    referenceEnd?: string;
    isCaseSensitive?: boolean;
    item?: JsonText;
    lead?: JsonText;
    pageNumber?: JsonText;
    marginNumber?: JsonText;
    hint?: JsonText;
    instruction?: JsonText;
    example?: ExampleJson;
    imageSource?: ImageSourceJson;
    person?: PersonJson;
    extraProperties?: {
      [key: string]: unknown | unknown[];
    };
    markConfig?: MarkConfigJson[];
    imagePlaceholder?: ImageResourceWrapperJson;
    resources?: ResourceJson | ResourceJson[];
    body?: Body;
    sampleSolution?: string;
    additionalSolutions?: string | string[];
    elements?: string[];
    flashcards?: FlashcardJson[];
    descriptions?: DescriptionListItemJson[];
    statement?: StatementJson;
    statements?: StatementJson[];
    responses?: ResponseJson[];
    quizzes?: QuizJson[];
    heading?: HeadingJson;
    pairs?: PairJson[];
    matrix?: MatrixJson[];
    table?: TableJson;
    choices?: ChoiceJson[];
    questions?: QuestionJson[];
    botResponses?: BotResponseJson[];
    ingredients?: IngredientJson[];
    captionDefinitionList?: CaptionDefinitionListJson;
    cardBits?: CardBit[];
    footer?: Footer;

    markup?: string;
    parser?: ParserInfo;
    _isDefaultExample?: boolean;
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
      showInIndex,
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
      example,
      imageSource,
      person,
      markConfig,
      extraProperties,
      imagePlaceholder,
      resources,
      body,
      footer,

      markup,
      parser,
      _isDefaultExample,
    } = data;

    const bitConfig = Config.getBitConfig(bitType);

    // Validate and convert resources, and ensure it is an array
    // const resources = ArrayUtils.asArray(resourcesIn);

    // Set the card node data
    const cardNode = this.cardNode(bitType, data);

    // Add reasonableNumOfChars to the bit only for essay bits (in other cases it will be pushed down the tree)
    const reasonableNumOfCharsProperty = Config.isOfBitType(bitType, BitType.essay)
      ? this.toAstProperty(PropertyConfigKey.reasonableNumOfChars, reasonableNumOfChars)
      : undefined;

    const convertedExample = {
      ...this.toExample(_isDefaultExample, example),
    };

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
      showInIndex: this.toAstProperty(PropertyConfigKey.showInIndex, showInIndex),
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
      caption: this.convertJsonTextToAstText(caption),
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
      technicalTerm: this.technicalTerm(technicalTerm),
      servings: this.servings(servings),
      ratingLevelStart: this.ratingLevelStartEnd(ratingLevelStart),
      ratingLevelEnd: this.ratingLevelStartEnd(ratingLevelEnd),
      ratingLevelSelected: this.toAstProperty(PropertyConfigKey.ratingLevelSelected, ratingLevelSelected),
      title: this.convertJsonTextToAstText(title),
      subtitle: this.convertJsonTextToAstText(subtitle),
      level: NumberUtils.asNumber(level),
      toc: this.toAstProperty(PropertyConfigKey.toc, toc),
      progress: this.toAstProperty(PropertyConfigKey.progress, progress),
      anchor,
      reference,
      referenceEnd,
      markConfig: this.buildMarkConfigs(markConfig),
      item: this.convertJsonTextToAstText(item),
      lead: this.convertJsonTextToAstText(lead),
      pageNumber: this.convertJsonTextToAstText(pageNumber),
      marginNumber: this.convertJsonTextToAstText(marginNumber),
      hint: this.convertJsonTextToAstText(hint),
      instruction: this.convertJsonTextToAstText(instruction),
      ...this.toExample(_isDefaultExample, example),
      imageSource: this.imageSource(imageSource),
      person: this.person(bitType, person),
      imagePlaceholder: ArrayUtils.asSingle(
        this.resourceBuilder.resourceFromResourceDataJson(bitType, ResourceTag.image, imagePlaceholder?.image),
      ) as ImageResourceWrapperJson,
      resources: ArrayUtils.asArray(this.resourceBuilder.resourceFromResourceJson(bitType, resources)),
      body,
      cardNode,
      footer,

      markup,
      parser,

      // Must always be last in the AST so key clashes are avoided correctly with other properties
      extraProperties: this.parseExtraProperties(extraProperties),

      // Private properties
      _isDefaultExample: _isDefaultExample ?? false,
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
      [body, ...(cardNode?.cardBits?.map((cardBit) => cardBit.body) ?? [])],
      [BodyBitType.gap],
      undefined,
      'isCaseSensitive',
      PropertyConfigKey.isCaseSensitive,
      isCaseSensitive ?? true,
    );

    this.pushDownTree(
      undefined,
      undefined,
      cardNode,
      'pairs',
      PropertyConfigKey.isCaseSensitive,
      isCaseSensitive ?? true,
    );
    this.pushDownTree(
      undefined,
      undefined,
      cardNode,
      ['matrix', 'cells'],
      PropertyConfigKey.isCaseSensitive,
      isCaseSensitive ?? true,
    );

    // If _isDefaultExample is set at the bit level, push the default example down the tree to the relevant nodes
    this.pushExampleDownTree(body, cardNode, _isDefaultExample, convertedExample.example);

    // Set default values
    this.setDefaultBitValues(node);

    // Set the 'isExample' flags
    this.setIsExampleFlags(node);

    // Add the version to the parser info
    this.addVersionToParserInfo(node);

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
      ignoreUndefined: ['example'],
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
    text: string;
    isCorrect: boolean;
    item?: TextAst;
    lead?: TextAst;
    pageNumber?: TextAst;
    marginNumber?: TextAst;
    hint?: TextAst;
    instruction?: TextAst;
    example?: ExampleJson;
    _isDefaultExample?: boolean;
  }): ChoiceJson {
    const { text, isCorrect, item, lead, /*pageNumber, marginNumber,*/ hint, instruction, _isDefaultExample, example } =
      data;

    // NOTE: Node order is important and is defined here
    const node: ChoiceJson = {
      choice: text ?? '',
      isCorrect: !!isCorrect,
      item: (item ?? []) as TextAst,
      lead: (lead ?? undefined) as TextAst,
      hint: (hint ?? []) as TextAst,
      instruction: (instruction ?? []) as TextAst,
      ...this.toExample(_isDefaultExample, example, !!isCorrect),
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
      ignoreAllEmptyArrays: true,
      ignoreUndefined: ['example'],
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
    text: string;
    isCorrect: boolean;
    item?: TextAst;
    lead?: TextAst;
    pageNumber?: TextAst;
    marginNumber?: TextAst;
    hint?: TextAst;
    instruction?: TextAst;
    _isDefaultExample?: boolean;
    example?: ExampleJson;
  }): ResponseJson {
    const { text, isCorrect, item, lead, /*pageNumber, marginNumber,*/ hint, instruction, _isDefaultExample, example } =
      data;

    // NOTE: Node order is important and is defined here
    const node: ResponseJson = {
      response: text ?? '',
      isCorrect: !!isCorrect,
      item: (item ?? []) as TextAst,
      lead: (lead ?? undefined) as TextAst,
      hint: (hint ?? []) as TextAst,
      instruction: (instruction ?? []) as TextAst,
      ...this.toExample(_isDefaultExample, example, !!isCorrect),
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
      ignoreAllEmptyArrays: true,
      ignoreUndefined: ['example'],
    });

    return node;
  }

  /**
   * Build bot response[] node
   *
   * @param data - data for the node
   * @returns
   */
  buildBotResponses(data: Partial<BotResponseJson>[] | undefined): BotResponseJson[] | undefined {
    if (!Array.isArray(data)) return undefined;
    const nodes = data.map((d) => this.botResponse(d)).filter((d) => d != null);
    return nodes.length > 0 ? nodes : undefined;
  }

  /**
   * Build bot response node
   *
   * @param data - data for the node
   * @returns
   */
  botResponse(data: Partial<BotResponseJson> | undefined): BotResponseJson | undefined {
    if (!data) return undefined;

    // NOTE: Node order is important and is defined here
    const node: BotResponseJson = {
      response: data.response ?? '',
      reaction: data.reaction ?? '',
      feedback: data.feedback ?? '',
      item: this.convertJsonTextToAstText(data.item),
      lead: this.convertJsonTextToAstText(data.lead),
      hint: this.convertJsonTextToAstText(data.hint),
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreEmptyString: ['response', 'reaction', 'feedback'],
      ignoreAllFalse: true,
      ignoreEmptyArrays: ['item'],
      ignoreUndefined: ['example'],
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
    item?: TextAst;
    lead?: TextAst;
    pageNumber?: TextAst;
    marginNumber?: TextAst;
    hint?: TextAst;
    instruction?: TextAst;
    _isDefaultExample?: boolean;
    example?: ExampleJson;
    choices?: ChoiceJson[];
    responses?: ResponseJson[];
  }): QuizJson {
    const {
      choices,
      responses,
      item,
      lead,
      /*pageNumber, marginNumber,*/ hint,
      instruction,
      _isDefaultExample,
      example,
    } = data;

    const convertedExample = {
      ...this.toExample(_isDefaultExample, example),
    };

    // Push _isDefaultExample down the tree
    this.pushExampleDownTreeBoolean(_isDefaultExample, convertedExample.example, true, choices);
    this.pushExampleDownTreeBoolean(_isDefaultExample, convertedExample.example, false, responses);

    // NOTE: Node order is important and is defined here
    const node: QuizJson = {
      item: (item ?? []) as TextAst,
      lead: (lead ?? undefined) as TextAst,
      hint: (hint ?? []) as TextAst,
      instruction: (instruction ?? []) as TextAst,
      isExample: !!example,
      // example: example ?? null,
      // itemLead: this.itemLead(item, lead, pageNumber, marginNumber),
      // hint: this.toBitmarkTextNode(hint),
      // instruction: this.toBitmarkTextNode(instruction),
      // isExample: _isDefaultExample || example != null,
      choices: choices ?? [],
      responses: responses ?? [],
    };

    // Remove either choices or responses - only one should be present
    if (!choices) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (node as any).choices;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (node as any).responses;
    }

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
      ignoreAllEmptyArrays: true,
    });

    return node;
  }

  /**
   * Build heading node
   *
   * @param data - data for the node
   * @returns
   */
  heading(
    data: {
      forKeys: string;
      forValues: string | string[];
    },
    forValuesDefault: string | string[] = '',
  ): HeadingJson | undefined {
    const { forKeys, forValues } = data;

    if (forKeys == null) return undefined;

    // NOTE: Node order is important and is defined here
    const node: HeadingJson = {
      forKeys: forKeys ?? '',
      forValues: forValues ?? forValuesDefault,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
      ignoreEmptyString: ['forKeys', 'forValues'],
      ignoreEmptyArrays: ['forValues'],
    });

    return node;
  }

  /**
   * Build pair[] node
   *
   * @param data - data for the node
   * @returns
   */
  buildPairs(bitType: BitTypeType, data: Partial<PairJson>[] | undefined): PairJson[] | undefined {
    if (!Array.isArray(data)) return undefined;
    const nodes = data.map((d) => this.pair(bitType, d)).filter((d) => d != null);
    return nodes.length > 0 ? nodes : undefined;
  }

  /**
   * Build pair node
   *
   * @param data - data for the node
   * @returns
   */
  pair(bitType: BitTypeType, data: Partial<PairJson> | undefined): PairJson | undefined {
    if (!data) return undefined;

    // Set default example
    let defaultExample = data._defaultExample;
    if (defaultExample == null) {
      defaultExample = Array.isArray(data._valuesAst) && data._valuesAst.length > 0 ? data._valuesAst[0] : null;
    }

    // Process the keyAudio and keyImage resources
    const keyAudio = (
      ArrayUtils.asSingle(
        this.resourceBuilder.resourceFromResourceDataJson(bitType, ResourceTag.audio, data.keyAudio),
      ) as AudioResourceWrapperJson
    )?.audio;

    const keyImage = (
      ArrayUtils.asSingle(
        this.resourceBuilder.resourceFromResourceDataJson(bitType, ResourceTag.image, data.keyImage),
      ) as ImageResourceWrapperJson
    )?.image;

    // NOTE: Node order is important and is defined here
    const node: PairJson = {
      key: data.key ?? '',
      keyAudio,
      keyImage,
      item: this.convertJsonTextToAstText(data.item),
      lead: this.convertJsonTextToAstText(data.lead),
      hint: this.convertJsonTextToAstText(data.hint),
      instruction: this.convertJsonTextToAstText(data.instruction),
      isCaseSensitive: data.isCaseSensitive as boolean,
      ...this.toExample(data._isDefaultExample, data.example, defaultExample),
      values: data.values ?? [],
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
      ignoreEmptyArrays: ['item', 'hint', 'instruction', 'values'],
      ignoreUndefined: ['example', 'isCaseSensitive'],
    });

    // if (node.key) {
    //   delete node.keyAudio;
    //   delete node.keyImage;
    // }
    // if (node.keyAudio != null) {
    //   delete node.key;
    //   delete node.keyImage;
    // }
    // if (node.keyImage != null) {
    //   delete node.key;
    //   delete node.keyAudio;
    // }

    return node;
  }

  /**
   * Build matrix node
   *
   * @param data - data for the node
   * @returns
   */
  matrix(data: {
    key: string;
    cells: MatrixCellJson[];
    item?: TextAst;
    lead?: TextAst;
    pageNumber?: TextAst;
    marginNumber?: TextAst;
    hint?: TextAst;
    instruction?: TextAst;
    _isDefaultExample?: boolean;
  }): MatrixJson {
    const { key, cells, item, lead, /*pageNumber, marginNumber,*/ hint, instruction, _isDefaultExample } = data;

    // const convertedExample = {
    //   ...this.toExample(_isDefaultExample, example),
    // };

    // // Push _isDefaultExample down the tree
    // this.pushExampleDownTreeBoolean(_isDefaultExample, convertedExample.example, true, choices);
    // this.pushExampleDownTreeBoolean(_isDefaultExample, convertedExample.example, false, responses);

    let isExample = false;

    // Set isExample for matrix based on isExample for cells
    for (const c of cells ?? []) {
      if (_isDefaultExample && !c.isExample) {
        c.isExample = true;
      }
      isExample = c.isExample ? true : isExample;
    }

    // NOTE: Node order is important and is defined here
    const node: MatrixJson = {
      key: key ?? '',
      item: (item ?? []) as TextAst,
      lead: (lead ?? undefined) as TextAst,
      hint: (hint ?? []) as TextAst,
      instruction: (instruction ?? undefined) as TextAst,
      isExample,
      cells,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
      ignoreAllEmptyArrays: true,
      ignoreUndefined: ['lead', 'hint', 'isCaseSensitive'],
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
    values: string[];
    item?: TextAst;
    lead?: TextAst;
    hint?: TextAst;
    pageNumber?: TextAst;
    marginNumber?: TextAst;
    instruction?: TextAst;
    isCaseSensitive?: boolean;
    _isDefaultExample?: boolean;
    example?: ExampleJson;
    _valuesAst?: TextAst[];
    _defaultExample?: ExampleJson;
  }): MatrixCellJson {
    const {
      values,
      item,
      lead,
      /*pageNumber,
      marginNumber,*/
      hint,
      instruction,
      isCaseSensitive,
      _isDefaultExample,
      example,
      _valuesAst,
    } = data;

    // Set default example
    let defaultExample = data._defaultExample;
    if (defaultExample == null) {
      defaultExample = Array.isArray(_valuesAst) && _valuesAst.length > 0 ? _valuesAst[0] : null;
    }

    // NOTE: Node order is important and is defined here
    const node: MatrixCellJson = {
      values: values ?? [],
      item: (item ?? []) as TextAst,
      lead: (lead ?? undefined) as TextAst,
      hint: (hint ?? undefined) as TextAst,
      instruction: (instruction ?? []) as TextAst,
      isCaseSensitive: isCaseSensitive as boolean,
      ...this.toExample(_isDefaultExample, example, defaultExample),
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
      ignoreAllEmptyArrays: true,
      ignoreUndefined: ['example', 'lead', 'hint', 'isCaseSensitive'],
    });

    return node;
  }

  /**
   * Build table node
   *
   * @param data - data for the node
   * @returns
   */
  table(dataIn: Partial<TableJson> | undefined): TableJson | undefined {
    if (!dataIn) return undefined;

    // NOTE: Node order is important and is defined here
    const node: TableJson = {
      columns: dataIn.columns ?? [],
      data: (dataIn.data ?? []).map((row) => row ?? []),
    };

    // Remove Unset Optionals
    // ObjectUtils.removeUnwantedProperties(node, {
    //   ignoreAllFalse: true,
    // });

    return node;
  }

  /**
   * Build question[] node
   *
   * @param data - data for the node
   * @returns
   */
  buildQuestions(data: Partial<QuestionJson>[] | undefined): QuestionJson[] | undefined {
    if (!Array.isArray(data)) return undefined;
    const nodes = data.map((d) => this.question(d)).filter((d) => d != null);
    return nodes.length > 0 ? nodes : undefined;
  }

  /**
   * Build question node
   *
   * @param data - data for the node
   * @returns
   */
  question(data: Partial<QuestionJson> | undefined): QuestionJson | undefined {
    if (!data) return undefined;

    // Set default example
    let defaultExample = data._defaultExample;
    if (defaultExample == null) {
      defaultExample = data._sampleSolutionAst;
    }

    // NOTE: Node order is important and is defined here
    const node: QuestionJson = {
      question: data.question ?? '',
      partialAnswer: data.partialAnswer ?? '',
      sampleSolution: data.sampleSolution ?? '',
      additionalSolutions: (data.additionalSolutions ?? undefined) as string[],
      reasonableNumOfChars: (data.reasonableNumOfChars ?? undefined) as number,
      item: this.convertJsonTextToAstText(data.item),
      lead: this.convertJsonTextToAstText(data.lead),
      hint: this.convertJsonTextToAstText(data.hint),
      instruction: this.convertJsonTextToAstText(data.instruction),
      ...this.toExample(data._isDefaultExample, data.example, defaultExample),
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
      ignoreEmptyArrays: ['item', 'hint', 'instruction'],
      ignoreUndefined: ['example'],
      ignoreEmptyString: ['question', 'partialAnswer', 'sampleSolution'],
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
    title?: string;
    checked?: boolean;
    item?: string;
    quantity?: number;
    unit?: string;
    unitAbbr?: string;
    decimalPlaces?: number;
    disableCalculation?: boolean;
  }): IngredientJson {
    const { title, checked, item, quantity, unit, unitAbbr, decimalPlaces, disableCalculation } = data;

    // NOTE: Node order is important and is defined here
    const node: IngredientJson = {
      title: title ?? '',
      checked: checked ?? false,
      item: item ?? '',
      quantity: quantity ?? 0,
      unit: unit ?? '',
      unitAbbr: unitAbbr ?? '',
      decimalPlaces: decimalPlaces ?? 1,
      disableCalculation: disableCalculation ?? false,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
      // ignoreAllEmptyArrays: true,
      // ignoreUndefined: ['example'],
      ignoreEmptyString: ['item', 'unit'],
    });

    return node;
  }

  /**
   * Build body node
   *
   * @param data - data for the node
   * @returns
   */
  body(data: { body?: JsonText; bodyBits?: BodyBit[]; bodyString?: string; bodyJson?: unknown }): Body {
    const { body, bodyBits, bodyString, bodyJson } = data;

    const node: Body = {
      body,
      bodyBits,
      bodyString,
      bodyJson,
    };

    return node;
  }

  // /**
  //  * Build bodyPartText node
  //  *
  //  * @param data - data for the node
  //  * @param isPlain - true if plain text, otherwise false
  //  * @returns
  //  */
  // bodyText(data: { text: TextAst }, isPlain: boolean): BodyText {
  //   const { text } = data;

  //   // NOTE: Node order is important and is defined here
  //   const node: BodyText = {
  //     type: BodyBitType.text,
  //     data: {
  //       bodyText: this.toBitmarkTextNode(text),
  //       isPlain,
  //     },
  //   };
  //   return node;
  // }

  /**
   * Build footer node
   *
   * @param data - data for the node
   * @returns
   */
  footer(data: { footer?: JsonText }): Footer {
    const { footer } = data;

    const node: Footer = {
      footer,
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
    solutions: string[];
    item?: TextAst;
    lead?: TextAst;
    pageNumber?: TextAst;
    marginNumber?: TextAst;
    hint?: TextAst;
    instruction?: TextAst;
    isCaseSensitive?: boolean;
    _isDefaultExample?: boolean;
    example?: ExampleJson;
    _solutionsAst: TextAst[];
    _defaultExample?: ExampleJson;
  }): GapJson {
    const {
      solutions,
      item,
      lead,
      /*pageNumber,
      marginNumber,*/
      hint,
      instruction,
      isCaseSensitive,
      _isDefaultExample,
      example,
      _solutionsAst,
    } = data;

    // type: 'gap'; // body bit type
    // item: JsonText;
    // lead: JsonText;
    // // pageNumber: JsonText;
    // // marginNumber: JsonText;
    // hint: JsonText;
    // instruction: JsonText;
    // isCaseSensitive: boolean;
    // isExample: boolean;
    // example: ExampleJson;
    // _defaultExample: ExampleJson;
    // solutions: string[];

    // Set default example
    let defaultExample = data._defaultExample;
    if (defaultExample == null) {
      defaultExample = Array.isArray(_solutionsAst) && _solutionsAst.length > 0 ? _solutionsAst[0] : null;
    }

    // NOTE: Node order is important and is defined here
    const node: GapJson = {
      type: BodyBitType.gap,
      solutions: solutions ?? [], // Must be before other properties except type
      item: (item ?? []) as TextAst,
      lead: (lead ?? []) as TextAst,
      hint: (hint ?? []) as TextAst,
      instruction: (instruction ?? []) as TextAst,
      isCaseSensitive: isCaseSensitive as boolean,
      // ...this.toExample(_isDefaultExample, example),
      ...this.toExample(_isDefaultExample, example, defaultExample),
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
      ignoreAllEmptyArrays: true,
      ignoreUndefined: ['example', 'isCaseSensitive'],
    });

    return node;
  }

  /**
   * Build mark configs node
   *
   * @param data - data for the node
   * @returns
   */
  buildMarkConfigs(data: MarkConfigJson[] | undefined): MarkConfigJson[] | undefined {
    if (!Array.isArray(data)) return undefined;
    const nodes = data.map((d) => this.markConfig(d)).filter((d) => d != null);
    return nodes.length > 0 ? nodes : undefined;
  }

  /**
   * Build mark config node
   *
   * @param data - data for the node
   * @returns
   */
  markConfig(data: { mark: string; color?: string; emphasis?: string }): MarkConfigJson {
    const { mark, color, emphasis } = data;

    // NOTE: Node order is important and is defined here
    const node: MarkConfigJson = {
      mark: mark ?? 'unknown',
      color: color ?? '',
      emphasis: emphasis ?? '',
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllEmptyString: true,
    });

    return node;
  }

  /**
   * Build mark node
   *
   * @param data - data for the node
   * @returns
   */
  mark(data: {
    solution: string;
    mark?: string;
    item?: TextAst;
    lead?: TextAst;
    pageNumber?: TextAst;
    marginNumber?: TextAst;
    hint?: TextAst;
    instruction?: TextAst;
    _isDefaultExample?: boolean;
    example?: ExampleJson;
  }): MarkJson {
    const { solution, mark, item, lead, /*pageNumber, marginNumber,*/ hint, instruction, _isDefaultExample, example } =
      data;

    // NOTE: Node order is important and is defined here
    const node: MarkJson = {
      type: BodyBitType.mark,
      solution: solution ?? '', // Must be before other properties except type
      mark: mark ?? '',
      item: (item ?? []) as TextAst,
      lead: (lead ?? []) as TextAst,
      hint: (hint ?? []) as TextAst,
      instruction: (instruction ?? []) as TextAst,
      ...this.toExample(_isDefaultExample, example, true),
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
      ignoreAllEmptyArrays: true,
      ignoreUndefined: ['example'],
      ignoreEmptyString: ['solution', 'mark'],
    });

    return node;
  }

  /**
   * Build select node
   *
   * @param data - data for the node
   * @returns
   */
  select(data: {
    options: SelectOptionJson[];
    prefix?: string;
    postfix?: string;
    item?: TextAst;
    lead?: TextAst;
    pageNumber?: TextAst;
    marginNumber?: TextAst;
    hint?: TextAst;
    instruction?: TextAst;
    _hintString?: string;
    _instructionString?: string;
  }): SelectJson {
    const {
      options,
      prefix,
      postfix,
      item,
      lead,
      /*pageNumber,
      marginNumber,*/
      hint,
      instruction,
      _hintString,
      _instructionString,
    } = data;

    // NOTE: Node order is important and is defined here
    const node: SelectJson = {
      type: BodyBitType.select,
      options, // Must be before other properties except type
      prefix: prefix ?? '',
      postfix: postfix ?? '',
      item: (item ?? []) as TextAst,
      lead: (lead ?? []) as TextAst,
      hint: (hint ?? []) as TextAst,
      instruction: (instruction ?? []) as TextAst,
      ...this.toExample(false, undefined, undefined), // Will be set in later
      _hintString: _hintString ?? '',
      _instructionString: _instructionString ?? '',

      // data: {
      //   prefix,
      //   options,
      //   postfix,
      //   itemLead: this.itemLead(item, lead, pageNumber, marginNumber),
      //   hint: this.toBitmarkTextNode(hint),
      //   _hintString,
      //   instruction: this.toBitmarkTextNode(instruction),
      //   _instructionString,
      // },
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
      ignoreAllEmptyArrays: true,
      ignoreEmptyString: ['prefix', 'postfix'],
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
    text: string;
    isCorrect: boolean;
    item?: TextAst;
    lead?: TextAst;
    pageNumber?: TextAst;
    marginNumber?: TextAst;
    hint?: TextAst;
    instruction?: TextAst;
    _isDefaultExample?: boolean;
    example?: ExampleJson;
  }): SelectOptionJson {
    const { text, isCorrect, item, lead, /*pageNumber, marginNumber,*/ hint, instruction, _isDefaultExample, example } =
      data;

    //     text: string;
    // isCorrect: boolean;
    // item: JsonText;
    // lead: JsonText;
    // pageNumber: JsonText;
    // marginNumber: JsonText;
    // hint: JsonText;
    // instruction: JsonText;
    // isExample: boolean;
    // example: ExampleJson;
    // _defaultExample: ExampleJson;

    // NOTE: Node order is important and is defined here
    const node: SelectOptionJson = {
      text: text ?? '', // Must be before other properties except type
      isCorrect: !!isCorrect,
      item: (item ?? []) as TextAst,
      lead: (lead ?? []) as TextAst,
      hint: (hint ?? []) as TextAst,
      instruction: (instruction ?? []) as TextAst,
      ...this.toExample(_isDefaultExample, example, !!isCorrect),
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
      ignoreAllEmptyArrays: true,
      ignoreUndefined: ['example'],
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
    texts: HighlightTextJson[];
    prefix?: string;
    postfix?: string;
    item?: TextAst;
    lead?: TextAst;
    pageNumber?: TextAst;
    marginNumber?: TextAst;
    hint?: TextAst;
    instruction?: TextAst;
  }): HighlightJson {
    const { texts, prefix, postfix, item, lead, /*pageNumber, marginNumber,*/ hint, instruction } = data;

    // NOTE: Node order is important and is defined here
    const node: HighlightJson = {
      type: BodyBitType.highlight,
      texts, // Must be before other properties except type
      prefix: prefix ?? '',
      postfix: postfix ?? '',
      item: (item ?? []) as TextAst,
      lead: (lead ?? []) as TextAst,
      hint: (hint ?? []) as TextAst,
      instruction: (instruction ?? []) as TextAst,
      ...this.toExample(false, undefined, undefined), // Will be set in later
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
      ignoreAllEmptyArrays: true,
      ignoreEmptyString: ['prefix', 'postfix'],
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
    text: string;
    isCorrect: boolean;
    isHighlighted: boolean;
    item?: TextAst;
    lead?: TextAst;
    pageNumber?: TextAst;
    marginNumber?: TextAst;
    hint?: TextAst;
    instruction?: TextAst;
    _isDefaultExample?: boolean;
    example?: ExampleJson;
  }): HighlightTextJson {
    const {
      text,
      isCorrect,
      isHighlighted,
      item,
      lead,
      /*pageNumber,
      marginNumber,*/
      hint,
      instruction,
      _isDefaultExample,
      example,
    } = data;

    // NOTE: Node order is important and is defined here
    const node: HighlightTextJson = {
      text: text ?? '', // Must be before other properties except type
      isCorrect: !!isCorrect,
      isHighlighted: !!isHighlighted,
      item: (item ?? []) as TextAst,
      lead: (lead ?? []) as TextAst,
      hint: (hint ?? []) as TextAst,
      instruction: (instruction ?? []) as TextAst,
      ...this.toExample(_isDefaultExample, example, !!isCorrect),
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
      ignoreAllEmptyArrays: true,
      ignoreUndefined: ['example'],
    });

    return node;
  }

  /**
   * Build flashcards node
   *
   * @param data - data for the node
   * @returns
   */
  buildFlashcards(data: Partial<FlashcardJson>[] | undefined): FlashcardJson[] | undefined {
    if (!Array.isArray(data)) return undefined;
    const nodes = data.map((d) => this.flashcard(d)).filter((d) => d != null);
    return nodes.length > 0 ? nodes : undefined;
  }

  /**
   * Build flashcard node
   *
   * @param data - data for the node
   * @returns
   */
  flashcard(data: Partial<FlashcardJson> | undefined): FlashcardJson | undefined {
    if (!data) return undefined;

    // NOTE: Node order is important and is defined here
    const node: FlashcardJson = {
      question: this.convertJsonTextToAstText(data.question),
      answer: this.convertJsonTextToAstText(data.answer),
      alternativeAnswers: this.convertJsonTextToAstText(data.alternativeAnswers),
      item: this.convertJsonTextToAstText(data.item),
      lead: this.convertJsonTextToAstText(data.lead),
      hint: this.convertJsonTextToAstText(data.hint),
      instruction: this.convertJsonTextToAstText(data.instruction),
      ...this.toExample(data._isDefaultExample, data.example, true),
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
      ignoreEmptyArrays: ['question', 'answer', 'alternativeAnswers', 'item', 'hint', 'instruction'],
      ignoreUndefined: ['example'],
    });

    return node;
  }

  /**
   * Build descriptionListItem[] node
   *
   * @param data - data for the node
   * @returns
   */
  buildDescriptionList(data: Partial<DescriptionListItemJson>[] | undefined): DescriptionListItemJson[] | undefined {
    if (!Array.isArray(data)) return undefined;
    const nodes = data.map((d) => this.descriptionListItem(d)).filter((d) => d != null);
    return nodes.length > 0 ? nodes : undefined;
  }

  /**
   * Build descriptionListItem node
   *
   * @param data - data for the node
   * @returns
   */
  descriptionListItem(data: Partial<DescriptionListItemJson> | undefined): DescriptionListItemJson | undefined {
    if (!data) return undefined;

    // NOTE: Node order is important and is defined here
    const node: DescriptionListItemJson = {
      term: this.convertJsonTextToAstText(data.term),
      description: this.convertJsonTextToAstText(data.description),
      alternativeDescriptions: this.convertJsonTextToAstText(data.alternativeDescriptions),
      item: this.convertJsonTextToAstText(data.item),
      lead: this.convertJsonTextToAstText(data.lead),
      hint: this.convertJsonTextToAstText(data.hint),
      instruction: this.convertJsonTextToAstText(data.instruction),
      ...this.toExample(data._isDefaultExample, data.example, true),
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
      ignoreEmptyArrays: ['question', 'answer', 'alternativeDescriptions', 'item', 'hint', 'instruction'],
      ignoreUndefined: ['example'],
    });

    return node;
  }

  /**
   * Build statement[] node
   *
   * @param data - data for the node
   * @returns
   */
  buildStatements(data: Partial<StatementJson>[] | undefined): StatementJson[] | undefined {
    if (!Array.isArray(data)) return undefined;
    const nodes = data.map((d) => this.statement(d)).filter((d) => d != null);
    return nodes.length > 0 ? nodes : undefined;
  }

  /**
   * Build statement node
   *
   * @param data - data for the node
   * @returns
   */
  statement(data: Partial<StatementJson> | undefined): StatementJson | undefined {
    if (!data) return undefined;

    // NOTE: Node order is important and is defined here
    const node: StatementJson = {
      statement: data.statement ?? '',
      isCorrect: !!data.isCorrect,
      item: this.convertJsonTextToAstText(data.item),
      lead: this.convertJsonTextToAstText(data.lead),
      hint: this.convertJsonTextToAstText(data.hint),
      instruction: this.convertJsonTextToAstText(data.instruction),
      ...this.toExample(data._isDefaultExample, data.example, !!data.isCorrect),
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
      // ignoreAllEmptyArrays: true,
      ignoreUndefined: ['example'],
    });

    return node;
  }

  /**
   * Build (image-on-device) imageSource node
   *
   * @param data - data for the node
   * @returns
   */
  imageSource(data: Partial<ImageSourceJson> | undefined): ImageSourceJson | undefined {
    if (!data) return undefined;
    const { url, mockupId, size, format, trim } = data;

    // NOTE: Node order is important and is defined here
    const node: ImageSourceJson = {
      url: url ?? '',
      mockupId: mockupId ?? '',
      size: (size ?? null) as number,
      format: (format ?? null) as string,
      trim: (BooleanUtils.isBoolean(trim) ? trim : null) as boolean,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreFalse: ['trim'],
      ignoreEmptyString: ['url', 'mockupId'],
      ignoreAllUndefined: true,
    });

    return node;
  }

  /**
   * Build (chat) person node
   *
   * @param data - data for the node
   * @returns
   */
  person(bitType: BitTypeType, data: Partial<PersonJson> | undefined): PersonJson | undefined {
    if (!data) return undefined;
    const { name, title, avatarImage } = data;
    // { name: string; title?: string; avatarImage?: ImageResourceJson }

    // NOTE: Node order is important and is defined here
    const node: PersonJson = {
      name: name ?? '',
      title: (title ?? undefined) as string,
      avatarImage: (
        ArrayUtils.asSingle(
          this.resourceBuilder.resourceFromResourceDataJson(bitType, ResourceTag.image, avatarImage),
        ) as ImageResourceWrapperJson
      )?.image,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreEmptyString: ['name'],
      ignoreAllUndefined: true,
    });

    return node;
  }

  /**
   * Build (cook-ingredients) technicalTerm node
   *
   * @param data - data for the node
   * @returns
   */
  technicalTerm(data: Partial<TechnicalTermJson> | undefined): TechnicalTermJson | undefined {
    if (!data) return undefined;
    const { technicalTerm, lang } = data;

    // NOTE: Node order is important and is defined here
    const node: TechnicalTermJson = {
      technicalTerm: technicalTerm ?? '',
      lang: lang ?? '',
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreEmptyString: ['technicalTerm'],
      // ignoreAllUndefined: true,
    });

    return node;
  }

  /**
   * Build (cook-ingredients) servings node
   *
   * @param data - data for the node
   * @returns
   */
  servings(data: Partial<ServingsJson> | undefined): ServingsJson | undefined {
    if (!data) return undefined;
    const { servings, unit, unitAbbr, decimalPlaces, disableCalculation, hint } = data;

    // NOTE: Node order is important and is defined here
    const node: ServingsJson = {
      servings: servings ?? 0,
      unit: unit ?? '',
      unitAbbr: unitAbbr ?? '',
      decimalPlaces: decimalPlaces ?? 1,
      disableCalculation: disableCalculation ?? false,
      hint: hint ?? '',
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreEmptyString: ['servings', 'unit'],
      // ignoreAllUndefined: true,
    });

    return node;
  }

  /**
   * Build (survey-rating) ratingLevelStart / ratingLevelEnd node
   *
   * @param data - data for the node
   * @returns
   */
  ratingLevelStartEnd(data: Partial<RatingLevelStartEndJson> | undefined): RatingLevelStartEndJson | undefined {
    if (!data) return undefined;
    const { level, label } = data;

    // NOTE: Node order is important and is defined here
    const node: RatingLevelStartEndJson = {
      level: level ?? 0,
      label: this.convertJsonTextToAstText(label),
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      // ignoreEmptyArrays: ['servings', 'unit'],
      // ignoreAllUndefined: true,
    });

    return node;
  }

  /**
   * Build captionDefinition node
   *
   * @param data - data for the node
   * @returns
   */
  captionDefinition(data: Partial<CaptionDefinitionJson> | undefined): CaptionDefinitionJson | undefined {
    if (!data) return undefined;

    // NOTE: Node order is important and is defined here
    const node: CaptionDefinitionJson = {
      // term: this.convertJsonTextToAstText(data.term),
      // description: this.convertJsonTextToAstText(data.description),
      term: data.term ?? '',
      description: data.description ?? '',
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreEmptyString: ['term', 'description'],
      // ignoreAllUndefined: true,
    });

    return node;
  }

  /**
   * Build captionDefinitionList node
   *
   * @param data - data for the node
   * @returns
   */
  captionDefinitionList(data: Partial<CaptionDefinitionListJson> | undefined): CaptionDefinitionListJson | undefined {
    if (!data) return undefined;

    // NOTE: Node order is important and is defined here
    const node: CaptionDefinitionListJson = {
      columns: data.columns ?? [],
      definitions: (data.definitions ?? [])
        .map((d) => {
          return this.captionDefinition({
            term: d.term,
            description: d.description,
          });
        })
        .filter((d) => d != null),
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllEmptyArrays: true,
    });

    return node;
  }

  //
  // Private
  //

  /**
   * Build card bit node
   *
   * @param data - data for the node
   * @returns
   */
  cardBit(data: {
    item?: TextAst;
    lead?: TextAst;
    pageNumber?: TextAst;
    marginNumber?: TextAst;
    hint?: TextAst;
    instruction?: TextAst;
    _isDefaultExample?: boolean;
    example?: ExampleJson;
    extraProperties?: {
      [key: string]: unknown | unknown[];
    };
    body?: Body;
  }): CardBit | undefined {
    const {
      item,
      lead,
      /*pageNumber,
      marginNumber,*/
      hint,
      instruction,
      _isDefaultExample,
      example,
      extraProperties,
      body,
    } = data;

    // NOTE: Node order is important and is defined here
    const node: CardBit = {
      item: (item ?? []) as TextAst,
      lead: (lead ?? []) as TextAst,
      hint: (hint ?? []) as TextAst,
      instruction: (instruction ?? []) as TextAst,
      ...this.toExample(_isDefaultExample, example),
      _isDefaultExample: _isDefaultExample ?? false,
      body,

      // Must always be last in the AST so key clashes are avoided correctly with other properties
      extraProperties: this.parseExtraProperties(extraProperties),
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
      // ignoreEmptyArrays: ['example'],
      ignoreUndefined: ['example'],
    });

    // Validate and correct invalid bits as much as possible
    return NodeValidator.validateCardBit(node);
  }

  private cardNode(
    bitType: BitTypeType,
    data: {
      flashcards?: FlashcardJson[];
      descriptions?: DescriptionListItemJson[];
      questions?: QuestionJson[];
      elements?: string[];
      statement?: StatementJson;
      statements?: StatementJson[];
      choices?: ChoiceJson[];
      responses?: ResponseJson[];
      quizzes?: QuizJson[];
      heading?: HeadingJson;
      pairs?: PairJson[];
      matrix?: MatrixJson[];
      table?: TableJson;
      botResponses?: BotResponseJson[];
      ingredients?: IngredientJson[];
      captionDefinitionList?: CaptionDefinitionListJson;
      cardBits?: CardBit[];
    },
  ): CardNode | undefined {
    const node: CardNode = {
      questions: this.buildQuestions(data.questions),
      elements: data.elements,
      flashcards: this.buildFlashcards(data.flashcards),
      descriptions: this.buildDescriptionList(data.descriptions),
      statement: this.statement(data.statement),
      statements: this.buildStatements(data.statements),
      choices: data.choices,
      responses: data.responses,
      quizzes: data.quizzes,
      heading: data.heading,
      pairs: this.buildPairs(bitType, data.pairs),
      matrix: data.matrix,
      table: this.table(data.table),
      botResponses: this.buildBotResponses(data.botResponses),
      ingredients: data.ingredients,
      captionDefinitionList: this.captionDefinitionList(data.captionDefinitionList),
      cardBits: data.cardBits,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node);

    return Object.keys(node).length > 0 ? node : undefined;
  }

  /**
   * Set examples down the tree
   *
   * @param body
   * @param cardNode
   * @param _isDefaultExample
   * @param example
   * @returns true if any of the answers has an example, otherwise undefined
   */
  private pushExampleDownTree(
    body: Body | undefined,
    cardNode: CardNode | undefined,
    _isDefaultExample: boolean | undefined,
    example: ExampleJson | undefined,
  ): void {
    if (_isDefaultExample || example != null) {
      if (cardNode) {
        this.pushExampleDownTreeString(_isDefaultExample, example, cardNode.pairs as WithExampleJson[]);
        this.pushExampleDownTreeBoolean(_isDefaultExample, example, false, cardNode.flashcards as WithExampleJson[]);
        this.pushExampleDownTreeBoolean(_isDefaultExample, example, false, cardNode.descriptions as WithExampleJson[]);
        this.pushExampleDownTreeBoolean(_isDefaultExample, example, true, cardNode.choices as WithExampleJson[]);
        this.pushExampleDownTreeBoolean(
          _isDefaultExample,
          example,
          false,
          cardNode.responses,
          cardNode.statements,
          cardNode.statement,
        );
        if (cardNode.quizzes) {
          for (const quiz of cardNode.quizzes) {
            this.pushExampleDownTreeBoolean(
              _isDefaultExample,
              example,
              true,
              quiz.choices as WithExampleJson[] | undefined,
            );
            this.pushExampleDownTreeBoolean(
              _isDefaultExample,
              example,
              false,
              quiz.responses as WithExampleJson[] | undefined,
            );
          }
        }
        if (cardNode.matrix) {
          for (const m of cardNode.matrix) {
            this.pushExampleDownTreeString(_isDefaultExample, example, m.cells);
          }
        }
      }
      if (body) {
        this.pushExampleDownTreeBodyBits(_isDefaultExample, example, body);
      }
    }
  }

  /**
   * Set examples for boolean nodes
   *
   * @param _isDefaultExample
   * @param example
   * @param onlyCorrect
   * @param nodes
   * @returns true if any of the answers has an example, otherwise undefined
   */
  private pushExampleDownTreeBoolean(
    _isDefaultExample: boolean | undefined,
    example: ExampleJson | undefined,
    onlyCorrect: boolean,
    ...nodes: (WithExampleJson | WithExampleJson[] | undefined)[]
  ): void {
    if (!_isDefaultExample && example == null) return;

    if (Array.isArray(nodes)) {
      for (const ds of nodes) {
        if (ds) {
          const exampleNodes = Array.isArray(ds) ? ds : [ds];
          BitUtils.fillBooleanExample(exampleNodes, _isDefaultExample, example, onlyCorrect);
        }
      }
    }
  }

  /**
   * Set examples for string nodes
   *
   * @param _isDefaultExample
   * @param example
   * @param nodes
   * @returns true if any of the answers has an example, otherwise undefined
   */
  private pushExampleDownTreeString(
    _isDefaultExample: boolean | undefined,
    example: ExampleJson | undefined,
    ...nodes: (WithExampleJson | WithExampleJson[] | undefined)[]
  ): void {
    if (!_isDefaultExample && !example) return;

    if (Array.isArray(nodes)) {
      for (const ds of nodes) {
        if (ds) {
          const exampleNodes = Array.isArray(ds) ? ds : [ds];
          BitUtils.fillStringExample(exampleNodes, _isDefaultExample, example, false);
        }
      }
    }
  }

  private pushExampleDownTreeBodyBits(
    _isDefaultExample: boolean | undefined,
    example: ExampleJson | undefined,
    body: Body | undefined,
  ): void {
    if (!_isDefaultExample && !example) return;
    const bodyBitsJson = this.textParser.extractBodyBits(body?.body as TextAst);

    for (const part of bodyBitsJson) {
      if (part) {
        switch (part.type) {
          case BodyBitType.gap: {
            const gap = part as GapJson;
            BitUtils.fillStringExample([gap], _isDefaultExample, example, false);
            break;
          }
          case BodyBitType.mark: {
            const mark = part as MarkJson;
            BitUtils.fillBooleanExample([mark], _isDefaultExample, example, false);
            break;
          }
          case BodyBitType.select: {
            const select = part as SelectJson;
            BitUtils.fillBooleanExample(select.options, _isDefaultExample, example, true);
            break;
          }
          case BodyBitType.highlight: {
            const highlight = part as HighlightJson;
            BitUtils.fillBooleanExample(highlight.texts, _isDefaultExample, example, true);
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
   * @param body/body[] set if the value should be passed down the body to the body bits / card body bits
   * @param bodyBitTypes body bit types to push the value down to
   * @param cardNode set if the value should be passed down the card node
   * @param path path for the value
   * @param value the value to push down
   */
  private pushDownTree(
    body: Body | CardBit | undefined | (Body | CardBit | undefined)[],
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
    if (body) {
      const bodyArray: Body[] = (Array.isArray(body) ? body : [body]) as Body[];
      for (const b of bodyArray) {
        if (b && b.body && bodyBitTypes) {
          const bodyBitsJson = this.textParser.extractBodyBits(b.body as TextAst);

          if (bodyBitTypes && bodyBitsJson && bodyBitsJson.length > 0) {
            for (const part of bodyBitsJson) {
              if (part) {
                if (bodyBitTypes.indexOf(part.type) !== -1) {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const data = part as any;
                  if (data[path] == null) {
                    data[path] = value;
                  }
                }
              }
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
    // bit.isExample = false;

    const checkIsExample = (example: WithExampleJson): boolean => {
      if (!example) return false;

      if (/*example._isDefaultExample ||*/ example.isExample || example.example != undefined) {
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
    const bodyBitsJson = this.textParser.extractBodyBits(body?.body as TextAst);

    for (const bodyPart of bodyBitsJson) {
      switch (bodyPart.type) {
        case BodyBitType.gap:
        case BodyBitType.mark: {
          checkIsExample(bodyPart as WithExampleJson);
          break;
        }

        case BodyBitType.select: {
          const select = bodyPart as SelectJson;
          let hasExample = false;
          for (const option of select.options) {
            hasExample = checkIsExample(option as WithExampleJson) ? true : hasExample;
          }
          select.isExample = hasExample;
          break;
        }

        case BodyBitType.highlight: {
          const highlight = bodyPart as HighlightJson;
          let hasExample = false;
          for (const text of highlight.texts) {
            hasExample = checkIsExample(text as WithExampleJson) ? true : hasExample;
          }
          highlight.isExample = hasExample;
          break;
        }
      }
    }

    // Card level

    if (cardNode) {
      // flashcards
      for (const v of cardNode.flashcards ?? []) {
        checkIsExample(v as WithExampleJson);
      }

      // descriptions
      for (const v of cardNode.descriptions ?? []) {
        checkIsExample(v as WithExampleJson);
      }

      // pairs
      for (const v of cardNode.pairs ?? []) {
        checkIsExample(v as WithExampleJson);
      }
      // matrix
      for (const mx of cardNode.matrix ?? []) {
        let hasExample = false;

        // matrix cell
        for (const v of mx.cells ?? []) {
          hasExample = checkIsExample(v as WithExampleJson) ? true : hasExample;
        }
        mx.isExample = hasExample;
      }
      // quizzes
      for (const quiz of cardNode.quizzes ?? []) {
        let hasExample = false;

        // responses
        for (const v of quiz.responses ?? []) {
          hasExample = checkIsExample(v as WithExampleJson) ? true : hasExample;
        }
        // choices
        for (const v of quiz.choices ?? []) {
          hasExample = checkIsExample(v as WithExampleJson) ? true : hasExample;
        }
        quiz.isExample = hasExample;
      }
      // responses
      for (const v of cardNode.responses ?? []) {
        checkIsExample(v as WithExampleJson);
      }
      // choices
      for (const v of cardNode.choices ?? []) {
        checkIsExample(v as WithExampleJson);
      }
      // statements
      for (const v of cardNode.statements ?? []) {
        checkIsExample(v as WithExampleJson);
      }
      // statement
      checkIsExample(cardNode.statement as WithExampleJson);
      // NO: elements
      // questions
      for (const v of cardNode.questions ?? []) {
        checkIsExample(v as WithExampleJson);
      }
    }

    // Bit level

    // statement
    checkIsExample(bit.statement as WithExampleJson);
    // responses
    for (const v of bit.responses ?? []) {
      checkIsExample(v as WithExampleJson);
    }
    // choices
    for (const v of bit.choices ?? []) {
      checkIsExample(v as WithExampleJson);
    }

    // Bit itself
    checkIsExample(bit as WithExampleJson);
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
