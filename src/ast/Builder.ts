import { Breakscape } from '../breakscaping/Breakscape';
import { Config } from '../config/Config';
import { JsonText, TextAst } from '../model/ast/TextNodes';
import { PropertyConfigKey } from '../model/config/enum/PropertyConfigKey';
import { BitType, BitTypeType } from '../model/enum/BitType';
import { BodyBitType, BodyBitTypeType } from '../model/enum/BodyBitType';
import { ResourceTag, ResourceTagType } from '../model/enum/ResourceTag';
import { TextFormat, TextFormatType } from '../model/enum/TextFormat';
import { AudioResourceJson, ImageResourceJson } from '../model/json/ResourceJson';
import { ParserError } from '../model/parser/ParserError';
import { ParserInfo } from '../model/parser/ParserInfo';
import { ContentProcessorUtils } from '../parser/bitmark/peg/contentProcessors/ContentProcessorUtils';
import { TextParser } from '../parser/text/TextParser';
import { ArrayUtils } from '../utils/ArrayUtils';
import { BitUtils } from '../utils/BitUtils';
import { NumberUtils } from '../utils/NumberUtils';
import { ObjectUtils } from '../utils/ObjectUtils';
import { StringUtils } from '../utils/StringUtils';
import { env } from '../utils/env/Env';

import { BaseBuilder, WithExample, WithExampleJson, WithIsExample } from './BaseBuilder';
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
  DescriptionListItem,
  Footer,
  BodyBit,
  Decision,
} from '../model/ast/Nodes';
import {
  ChoiceJson,
  DescriptionListItemJson,
  ExampleJson,
  FlashcardJson,
  HeadingJson,
  PairJson,
  QuestionJson,
  QuizJson,
  ResponseJson,
  StatementJson,
} from '../model/json/BitJson';
import {
  GapJson,
  HighlightJson,
  HighlightTextJson,
  MarkJson,
  SelectJson,
  SelectOptionJson,
} from '../model/json/BodyBitJson';

export type ExampleIn = TextAst | string | boolean;

/**
 * Builder to build bitmark AST node programmatically
 */
class Builder extends BaseBuilder {
  private textParser: TextParser = new TextParser();

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
    caption?: TextAst;
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
    technicalTerm?: TechnicalTerm;
    servings?: Servings;
    ratingLevelStart?: RatingLevelStartEnd;
    ratingLevelEnd?: RatingLevelStartEnd;
    ratingLevelSelected?: number;
    partialAnswer?: string;
    book?: string;
    title?: TextAst;
    subtitle?: TextAst;
    level?: number | string;
    toc?: boolean;
    progress?: boolean;
    anchor?: string;
    // If an array is passed to reference, it will be considered an "[@reference:Some text]" property
    // If a BreakscapedText is passed to reference, it will be considered a "[►Reference]" tag
    reference?: string;
    referenceEnd?: string;
    isCaseSensitive?: boolean;
    item?: TextAst;
    lead?: TextAst;
    pageNumber?: TextAst;
    marginNumber?: TextAst;
    hint?: TextAst;
    instruction?: TextAst;
    isDefaultExample?: boolean;
    example?: ExampleIn;
    imageSource?: ImageSource;
    person?: Person;
    extraProperties?: {
      [key: string]: unknown | unknown[];
    };
    markConfig?: MarkConfig[];
    imagePlaceholder?: ImageResource;
    resources?: Resource | Resource[];
    body?: Body;
    sampleSolution?: string;
    additionalSolutions?: string | string[];
    elements?: string[];
    flashcards?: Flashcard[];
    descriptions?: DescriptionListItem[];
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
    footer?: Footer;

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

    const convertedExample = {
      ...this.toExample(isDefaultExample, example),
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
      caption: this.toBitmarkTextNode(caption),
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
      title: this.toBitmarkTextNode(title),
      subtitle: this.toBitmarkTextNode(subtitle),
      level: NumberUtils.asNumber(level),
      toc: this.toAstProperty(PropertyConfigKey.toc, toc),
      progress: this.toAstProperty(PropertyConfigKey.progress, progress),
      anchor,
      reference,
      referenceEnd,
      markConfig,
      itemLead: this.itemLead(item, lead, pageNumber, marginNumber),
      hint: this.toBitmarkTextNode(hint),
      instruction: this.toBitmarkTextNode(instruction),
      ...this.toExample(isDefaultExample, example),
      isDefaultExample: isDefaultExample ?? false,
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

    // If isDefaultExample is set at the bit level, push the default example down the tree to the relevant nodes
    this.pushExampleDownTree(body, cardNode, isDefaultExample, convertedExample.example);

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
    text: string;
    isCorrect: boolean;
    item?: TextAst;
    lead?: TextAst;
    pageNumber?: TextAst;
    marginNumber?: TextAst;
    hint?: TextAst;
    instruction?: TextAst;
    isDefaultExample?: boolean;
    example?: ExampleIn;
  }): ChoiceJson {
    const { text, isCorrect, item, lead, /*pageNumber, marginNumber,*/ hint, instruction, isDefaultExample, example } =
      data;

    // NOTE: Node order is important and is defined here
    const node: ChoiceJson = {
      choice: text ?? '',
      isCorrect: !!isCorrect,
      item: (item ?? []) as TextAst,
      lead: (lead ?? undefined) as TextAst,
      hint: (hint ?? []) as TextAst,
      instruction: (instruction ?? []) as TextAst,
      ...this.toExample(isDefaultExample, example, !!isCorrect),
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
    isDefaultExample?: boolean;
    example?: ExampleIn;
  }): ResponseJson {
    const { text, isCorrect, item, lead, /*pageNumber, marginNumber,*/ hint, instruction, isDefaultExample, example } =
      data;

    // NOTE: Node order is important and is defined here
    const node: ResponseJson = {
      response: text ?? '',
      isCorrect: !!isCorrect,
      item: (item ?? []) as TextAst,
      lead: (lead ?? undefined) as TextAst,
      hint: (hint ?? []) as TextAst,
      instruction: (instruction ?? []) as TextAst,
      ...this.toExample(isDefaultExample, example, !!isCorrect),
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
   * Build bot response node
   *
   * @param data - data for the node
   * @returns
   */
  botResponse(data: {
    response: string;
    reaction: string;
    feedback: string;
    item?: TextAst;
    lead?: TextAst;
    pageNumber?: TextAst;
    marginNumber?: TextAst;
    hint?: TextAst;
  }): BotResponse {
    const { response, reaction, feedback, item, lead, pageNumber, marginNumber, hint } = data;

    // NOTE: Node order is important and is defined here
    const node: BotResponse = {
      response,
      reaction,
      feedback,
      itemLead: this.itemLead(item, lead, pageNumber, marginNumber),
      hint: this.toBitmarkTextNode(hint),
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
    item?: TextAst;
    lead?: TextAst;
    pageNumber?: TextAst;
    marginNumber?: TextAst;
    hint?: TextAst;
    instruction?: TextAst;
    isDefaultExample?: boolean;
    example?: ExampleIn;
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
      isDefaultExample,
      example,
    } = data;

    const convertedExample = {
      ...this.toExample(isDefaultExample, example),
    };

    // Push isDefaultExample down the tree
    this.pushExampleDownTreeBoolean(isDefaultExample, convertedExample.example, true, choices);
    this.pushExampleDownTreeBoolean(isDefaultExample, convertedExample.example, false, responses);

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
      // isExample: isDefaultExample || example != null,
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
   * Build pair node
   *
   * @param data - data for the node
   * @returns
   */
  pair(data: {
    key?: string;
    keyAudio?: AudioResourceJson;
    keyImage?: ImageResourceJson;
    values: string[];
    item?: TextAst;
    lead?: TextAst;
    pageNumber?: TextAst;
    marginNumber?: TextAst;
    hint?: TextAst;
    instruction?: TextAst;
    isCaseSensitive?: boolean;
    isDefaultExample?: boolean;
    example?: ExampleJson;
    _valuesAst?: TextAst[];
  }): PairJson {
    const {
      key,
      keyAudio,
      keyImage,
      values,
      item,
      lead,
      /*pageNumber,
      marginNumber,*/
      hint,
      instruction,
      isCaseSensitive,
      isDefaultExample,
      example,
      _valuesAst,
    } = data;

    const defaultExample = Array.isArray(_valuesAst) && _valuesAst.length > 0 && _valuesAst[0];

    // NOTE: Node order is important and is defined here
    const node: PairJson = {
      key: key ?? '',
      keyAudio: (keyAudio ?? undefined) as AudioResourceJson,
      keyImage: (keyImage ?? undefined) as ImageResourceJson,
      values,
      item: (item ?? []) as TextAst,
      lead: (lead ?? undefined) as TextAst,
      hint: (hint ?? []) as TextAst,
      instruction: (instruction ?? []) as TextAst,
      isCaseSensitive: isCaseSensitive as boolean,
      ...this.toExample(isDefaultExample, example, defaultExample),
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
   * Build matrix node
   *
   * @param data - data for the node
   * @returns
   */
  matrix(data: {
    key: string;
    cells: MatrixCell[];
    item?: TextAst;
    lead?: TextAst;
    pageNumber?: TextAst;
    marginNumber?: TextAst;
    hint?: TextAst;
    instruction?: TextAst;
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
      hint: this.toBitmarkTextNode(hint),
      instruction: this.toBitmarkTextNode(instruction),
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
    values: string[];
    item?: TextAst;
    lead?: TextAst;
    hint?: TextAst;
    pageNumber?: TextAst;
    marginNumber?: TextAst;
    instruction?: TextAst;
    isCaseSensitive?: boolean;
    isDefaultExample?: boolean;
    example?: ExampleIn;
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
      hint: this.toBitmarkTextNode(hint),
      instruction: this.toBitmarkTextNode(instruction),
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
  table(data: { columns: string[]; rows: string[][] }): Table {
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
    question: string;
    partialAnswer?: string;
    sampleSolution?: string;
    additionalSolutions?: string[];
    item?: TextAst;
    lead?: TextAst;
    pageNumber?: TextAst;
    marginNumber?: TextAst;
    hint?: TextAst;
    instruction?: TextAst;
    reasonableNumOfChars?: number;
    isDefaultExample?: boolean;
    example?: ExampleJson;
    _sampleSolutionAst?: TextAst;
  }): QuestionJson {
    const {
      question,
      partialAnswer,
      item,
      lead,
      /*pageNumber,
      marginNumber,*/
      hint,
      instruction,
      reasonableNumOfChars,
      sampleSolution,
      additionalSolutions,
      isDefaultExample,
      example,
      _sampleSolutionAst,
    } = data;

    const defaultExample = _sampleSolutionAst;

    // NOTE: Node order is important and is defined here
    const node: QuestionJson = {
      question: question ?? '',
      partialAnswer: partialAnswer ?? '',
      sampleSolution: sampleSolution ?? '',
      additionalSolutions: (additionalSolutions ?? undefined) as string[],
      reasonableNumOfChars: (reasonableNumOfChars ?? undefined) as number,
      item: (item ?? []) as TextAst,
      lead: (lead ?? undefined) as TextAst,
      hint: (hint ?? []) as TextAst,
      instruction: (instruction ?? []) as TextAst,
      ...this.toExample(isDefaultExample, example, defaultExample),
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
      ignoreAllEmptyArrays: true,
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
  body(data: { body?: JsonText; bodyBits?: BodyBit[]; bodyString?: string; bodyJson?: unknown }): Body {
    const { body, bodyBits, bodyString, bodyJson } = data;

    const bodyIsString = StringUtils.isString(body);

    const node: Body = {
      body: bodyIsString ? (body as string) : this.toBitmarkTextNode(body as TextAst),
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

    const footerIsString = StringUtils.isString(footer);

    const node: Footer = {
      footer: footerIsString ? (footer as string) : this.toBitmarkTextNode(footer as TextAst),
    };

    return node;
  }

  /**
   * Build footer text node
   *
   * @param data - data for the node
   * @returns
   */
  footerText(data: { text: TextAst }, isPlain: boolean): FooterText {
    const { text } = data;

    // NOTE: Node order is important and is defined here
    const node: FooterText = {
      footerText: this.toBitmarkTextNode(text),
      isPlain,
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
    isDefaultExample?: boolean;
    example?: ExampleJson;
    _solutionsAst: TextAst[];
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
      isDefaultExample,
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

    const defaultExample = Array.isArray(_solutionsAst) && _solutionsAst.length === 1 ? _solutionsAst[0] : null;

    // NOTE: Node order is important and is defined here
    const node: GapJson = {
      type: BodyBitType.gap,
      item: (item ?? []) as TextAst,
      lead: (lead ?? []) as TextAst,
      hint: (hint ?? []) as TextAst,
      instruction: (instruction ?? []) as TextAst,
      isCaseSensitive: isCaseSensitive as boolean,
      // ...this.toExample(isDefaultExample, example),
      ...this.toExample(isDefaultExample, example, defaultExample),
      solutions: solutions ?? [],
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
   * Build mark config node
   *
   * @param data - data for the node
   * @returns
   */
  markConfig(data: { mark: string; color?: string; emphasis?: string }): MarkConfig {
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
    solution: string;
    mark?: string;
    item?: TextAst;
    lead?: TextAst;
    pageNumber?: TextAst;
    marginNumber?: TextAst;
    hint?: TextAst;
    instruction?: TextAst;
    isDefaultExample?: boolean;
    example?: ExampleJson;
  }): MarkJson {
    const { solution, mark, item, lead, /*pageNumber, marginNumber,*/ hint, instruction, isDefaultExample, example } =
      data;

    // NOTE: Node order is important and is defined here
    const node: MarkJson = {
      type: BodyBitType.mark,
      solution: solution ?? '',
      mark: mark ?? '',
      item: (item ?? []) as TextAst,
      lead: (lead ?? []) as TextAst,
      hint: (hint ?? []) as TextAst,
      instruction: (instruction ?? []) as TextAst,
      ...this.toExample(isDefaultExample, example, true),
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
      prefix: prefix ?? '',
      postfix: postfix ?? '',
      item: (item ?? []) as TextAst,
      lead: (lead ?? []) as TextAst,
      hint: (hint ?? []) as TextAst,
      instruction: (instruction ?? []) as TextAst,
      ...this.toExample(false, undefined, undefined), // Will be set in later
      options,
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
    isDefaultExample?: boolean;
    example?: ExampleIn;
  }): SelectOptionJson {
    const { text, isCorrect, item, lead, /*pageNumber, marginNumber,*/ hint, instruction, isDefaultExample, example } =
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
      text: text ?? '',
      isCorrect: !!isCorrect,
      item: (item ?? []) as TextAst,
      lead: (lead ?? []) as TextAst,
      hint: (hint ?? []) as TextAst,
      instruction: (instruction ?? []) as TextAst,
      ...this.toExample(isDefaultExample, example, !!isCorrect),
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
      prefix: prefix ?? '',
      postfix: postfix ?? '',
      item: (item ?? []) as TextAst,
      lead: (lead ?? []) as TextAst,
      hint: (hint ?? []) as TextAst,
      instruction: (instruction ?? []) as TextAst,
      ...this.toExample(false, undefined, undefined), // Will be set in later
      texts,
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
    isDefaultExample?: boolean;
    example?: ExampleIn;
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
      isDefaultExample,
      example,
    } = data;

    // NOTE: Node order is important and is defined here
    const node: HighlightTextJson = {
      text: text ?? '',
      isCorrect: !!isCorrect,
      isHighlighted: !!isHighlighted,
      item: (item ?? []) as TextAst,
      lead: (lead ?? []) as TextAst,
      hint: (hint ?? []) as TextAst,
      instruction: (instruction ?? []) as TextAst,
      ...this.toExample(isDefaultExample, example, !!isCorrect),
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
   * Build flashcard node
   *
   * @param data - data for the node
   * @returns
   */
  flashcard(data: {
    question: TextAst;
    answer?: TextAst;
    alternativeAnswers?: TextAst[];
    item?: TextAst;
    lead?: TextAst;
    pageNumber?: TextAst;
    marginNumber?: TextAst;
    hint?: TextAst;
    instruction?: TextAst;
    isDefaultExample?: boolean;
    example?: ExampleIn;
  }): FlashcardJson {
    const {
      question,
      answer,
      alternativeAnswers,
      item,
      lead,
      /*pageNumber,
      marginNumber,*/
      hint,
      instruction,
      isDefaultExample,
      example,
    } = data;

    // NOTE: Node order is important and is defined here
    const node: FlashcardJson = {
      question: (question ?? []) as TextAst,
      answer: (answer ?? []) as TextAst,
      alternativeAnswers: (alternativeAnswers ?? []) as TextAst[],
      item: (item ?? []) as TextAst,
      lead: (lead ?? undefined) as TextAst,
      hint: (hint ?? []) as TextAst,
      instruction: (instruction ?? []) as TextAst,
      ...this.toExample(isDefaultExample, example, true),
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
   * Build descriptionListItem node
   *
   * @param data - data for the node
   * @returns
   */
  descriptionListItem(data: {
    term: TextAst;
    description?: TextAst;
    alternativeDescriptions?: TextAst[];
    item?: TextAst;
    lead?: TextAst;
    pageNumber?: TextAst;
    marginNumber?: TextAst;
    hint?: TextAst;
    instruction?: TextAst;
    isDefaultExample?: boolean;
    example?: ExampleIn;
  }): DescriptionListItemJson {
    const {
      term,
      description,
      alternativeDescriptions,
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
    const node: DescriptionListItemJson = {
      term: (term ?? []) as TextAst,
      description: (description ?? []) as TextAst,
      alternativeDescriptions: (alternativeDescriptions ?? []) as TextAst[],
      item: (item ?? []) as TextAst,
      lead: (lead ?? undefined) as TextAst,
      hint: (hint ?? []) as TextAst,
      instruction: (instruction ?? []) as TextAst,
      ...this.toExample(isDefaultExample, example, true),
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
   * Build statement node
   *
   * @param data - data for the node
   * @returns
   */
  statement(data: {
    text: string;
    isCorrect: boolean;
    item?: TextAst;
    lead?: TextAst;
    pageNumber?: TextAst;
    marginNumber?: TextAst;
    hint?: TextAst;
    instruction?: TextAst;
    isDefaultExample?: boolean;
    example?: ExampleIn;
  }): StatementJson {
    const { text, isCorrect, item, lead, /*pageNumber, marginNumber,*/ hint, instruction, isDefaultExample, example } =
      data;

    // NOTE: Node order is important and is defined here
    const node: StatementJson = {
      statement: text ?? '',
      isCorrect: !!isCorrect,
      item: item as TextAst,
      lead: lead as TextAst,
      hint: hint as TextAst,
      instruction: instruction as TextAst,
      ...this.toExample(isDefaultExample, example, !!isCorrect),
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
  imageSource(data: { url: string; mockupId: string; size?: number; format?: string; trim?: boolean }): ImageSource {
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
  person(data: { name: string; title?: string; avatarImage?: ImageResource }): Person {
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
  technicalTerm(data: { technicalTerm: string; lang?: string }): TechnicalTerm {
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
    unit?: string;
    unitAbbr?: string;
    decimalPlaces?: number;
    disableCalculation?: boolean;
    hint?: string;
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
  ratingLevelStartEnd(data: { level: number; label?: TextAst }): RatingLevelStartEnd {
    const { level, label } = data;

    // NOTE: Node order is important and is defined here
    const node: RatingLevelStartEnd = {
      level,
      label: this.toBitmarkTextNode(label),
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
  captionDefinition(data: { term: string; description: string }): CaptionDefinition {
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
  captionDefinitionList(data: { columns: string[]; definitions: CaptionDefinition[] }): CaptionDefinitionList {
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
    item: TextAst | undefined,
    lead: TextAst | undefined,
    pageNumber: TextAst | undefined,
    marginNumber: TextAst | undefined,
  ): ItemLead | undefined {
    let node: ItemLead | undefined;

    // NOTE: Node order is important and is defined here
    if (item || lead || pageNumber || marginNumber) {
      node = {
        item: this.toBitmarkTextNode(item),
        lead: this.toBitmarkTextNode(lead),
        pageNumber: this.toBitmarkTextNode(pageNumber),
        marginNumber: this.toBitmarkTextNode(marginNumber),
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
    item?: TextAst;
    lead?: TextAst;
    pageNumber?: TextAst;
    marginNumber?: TextAst;
    hint?: TextAst;
    instruction?: TextAst;
    isDefaultExample?: boolean;
    example?: ExampleIn;
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
      hint: this.toBitmarkTextNode(hint),
      instruction: this.toBitmarkTextNode(instruction),
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
    descriptions?: DescriptionListItem[];
    questions?: Question[];
    elements?: string[];
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
      descriptions,
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
      descriptions ||
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
        descriptions,
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
    example: ExampleJson | undefined,
  ): void {
    if (isDefaultExample || example) {
      if (cardNode) {
        this.pushExampleDownTreeString(isDefaultExample, example, cardNode.pairs as WithExampleJson[]);
        this.pushExampleDownTreeBoolean(isDefaultExample, example, false, cardNode.flashcards as WithExampleJson[]);
        this.pushExampleDownTreeBoolean(isDefaultExample, example, false, cardNode.descriptions as WithExampleJson[]);
        this.pushExampleDownTreeBoolean(isDefaultExample, example, true, cardNode.choices as WithExampleJson[]);
        this.pushExampleDownTreeBoolean(
          isDefaultExample,
          example,
          false,
          cardNode.responses,
          cardNode.statements,
          cardNode.statement,
        );
        if (cardNode.quizzes) {
          for (const quiz of cardNode.quizzes) {
            this.pushExampleDownTreeBoolean(
              isDefaultExample,
              example,
              true,
              quiz.choices as WithExampleJson[] | undefined,
            );
            this.pushExampleDownTreeBoolean(
              isDefaultExample,
              example,
              false,
              quiz.responses as WithExampleJson[] | undefined,
            );
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
    example: ExampleJson | undefined,
    onlyCorrect: boolean,
    ...nodes: (WithExampleJson | WithExampleJson[] | undefined)[]
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
    example: ExampleJson | undefined,
    ...nodes: (WithExampleJson | WithExampleJson[] | undefined)[]
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
    example: ExampleJson | undefined,
    body: Body | undefined,
  ): void {
    if (!isDefaultExample && !example) return;
    const bodyBitsJson = this.textParser.extractBodyBits(this.getBitmarkTextAst(body?.body));

    for (const part of bodyBitsJson) {
      if (part) {
        switch (part.type) {
          case BodyBitType.gap: {
            const gap = part as GapJson;
            BitUtils.fillStringExample([gap], isDefaultExample, example, false);
            break;
          }
          case BodyBitType.mark: {
            const mark = part as MarkJson;
            BitUtils.fillBooleanExample([mark], isDefaultExample, example, false);
            break;
          }
          case BodyBitType.select: {
            const select = part as SelectJson;
            BitUtils.fillBooleanExample(select.options, isDefaultExample, example, true);
            break;
          }
          case BodyBitType.highlight: {
            const highlight = part as HighlightJson;
            BitUtils.fillBooleanExample(highlight.texts, isDefaultExample, example, true);
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
          const bodyBitsJson = this.textParser.extractBodyBits(this.getBitmarkTextAst(b.body));

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

      if (/*example.isDefaultExample ||*/ example.isExample || example.example != undefined) {
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
    const bodyBitsJson = this.textParser.extractBodyBits(this.getBitmarkTextAst(body?.body));

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

  private decisionToWithExampleJson(decision: Decision): WithExampleJson {}

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
