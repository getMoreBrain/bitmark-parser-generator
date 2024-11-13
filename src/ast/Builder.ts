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
    const bitConfig = Config.getBitConfig(data.bitType);

    // Validate and convert resources, and ensure it is an array
    // const resources = ArrayUtils.asArray(resourcesIn);

    // Set the card node data
    const cardNode = this.cardNode(data.bitType, data);

    // Add reasonableNumOfChars to the bit only for essay bits (in other cases it will be pushed down the tree)
    const reasonableNumOfCharsProperty = Config.isOfBitType(data.bitType, BitType.essay)
      ? this.toAstProperty(PropertyConfigKey.reasonableNumOfChars, data.reasonableNumOfChars)
      : undefined;

    const convertedExample = {
      ...this.toExample(data._isDefaultExample, data.example),
    };

    // NOTE: Node order is important and is defined here
    const node: Bit = {
      bitType: data.bitType,
      bitLevel: data.bitLevel,
      textFormat: TextFormat.fromValue(data.textFormat) ?? bitConfig.textFormatDefault,
      resourceType: ResourceTag.fromValue(data.resourceType),
      isCommented: data.isCommented,
      id: this.toAstProperty(PropertyConfigKey.id, data.id),
      internalComment: this.toAstProperty(PropertyConfigKey.internalComment, data.internalComment),
      externalId: this.toAstProperty(PropertyConfigKey.externalId, data.externalId),
      spaceId: this.toAstProperty(PropertyConfigKey.spaceId, data.spaceId),
      padletId: this.toAstProperty(PropertyConfigKey.padletId, data.padletId),
      jupyterId: this.toAstProperty(PropertyConfigKey.jupyterId, data.jupyterId),
      jupyterExecutionCount: this.toAstProperty(PropertyConfigKey.jupyterExecutionCount, data.jupyterExecutionCount),
      isPublic: this.toAstProperty(PropertyConfigKey.isPublic, data.isPublic),
      aiGenerated: this.toAstProperty(PropertyConfigKey.aiGenerated, data.aiGenerated),
      machineTranslated: this.toAstProperty(PropertyConfigKey.machineTranslated, data.machineTranslated),
      analyticsTag: this.toAstProperty(PropertyConfigKey.analyticsTag, data.analyticsTag),
      feedbackEngine: this.toAstProperty(PropertyConfigKey.feedbackEngine, data.feedbackEngine),
      feedbackType: this.toAstProperty(PropertyConfigKey.feedbackType, data.feedbackType),
      disableFeedback: this.toAstProperty(PropertyConfigKey.disableFeedback, data.disableFeedback),
      releaseVersion: this.toAstProperty(PropertyConfigKey.releaseVersion, data.releaseVersion),
      releaseKind: this.toAstProperty(PropertyConfigKey.releaseKind, data.releaseKind),
      releaseDate: this.toAstProperty(PropertyConfigKey.releaseDate, data.releaseDate),
      book: data.book,
      ageRange: this.toAstProperty(PropertyConfigKey.ageRange, data.ageRange),
      lang: this.toAstProperty(PropertyConfigKey.lang, data.lang),
      language: this.toAstProperty(PropertyConfigKey.language, data.language),
      publisher: this.toAstProperty(PropertyConfigKey.publisher, data.publisher),
      publisherName: this.toAstProperty(PropertyConfigKey.publisherName, data.publisherName),
      theme: this.toAstProperty(PropertyConfigKey.theme, data.theme),
      computerLanguage: this.toAstProperty(PropertyConfigKey.computerLanguage, data.computerLanguage),
      target: this.toAstProperty(PropertyConfigKey.target, data.target),
      slug: this.toAstProperty(PropertyConfigKey.slug, data.slug),
      tag: this.toAstProperty(PropertyConfigKey.tag, data.tag),
      reductionTag: this.toAstProperty(PropertyConfigKey.reductionTag, data.reductionTag),
      bubbleTag: this.toAstProperty(PropertyConfigKey.bubbleTag, data.bubbleTag),
      levelCEFRp: this.toAstProperty(PropertyConfigKey.levelCEFRp, data.levelCEFRp),
      levelCEFR: this.toAstProperty(PropertyConfigKey.levelCEFR, data.levelCEFR),
      levelILR: this.toAstProperty(PropertyConfigKey.levelILR, data.levelILR),
      levelACTFL: this.toAstProperty(PropertyConfigKey.levelACTFL, data.levelACTFL),
      icon: this.toAstProperty(PropertyConfigKey.icon, data.icon),
      iconTag: this.toAstProperty(PropertyConfigKey.iconTag, data.iconTag),
      colorTag: this.toAstProperty(PropertyConfigKey.colorTag, data.colorTag),
      flashcardSet: this.toAstProperty(PropertyConfigKey.flashcardSet, data.flashcardSet),
      subtype: this.toAstProperty(PropertyConfigKey.subtype, data.subtype),
      bookAlias: this.toAstProperty(PropertyConfigKey.bookAlias, data.bookAlias),
      coverImage: this.toAstProperty(PropertyConfigKey.coverImage, data.coverImage),
      coverColor: this.toAstProperty(PropertyConfigKey.coverColor, data.coverColor),
      publications: this.toAstProperty(PropertyConfigKey.publications, data.publications),
      author: this.toAstProperty(PropertyConfigKey.author, data.author),
      subject: this.toAstProperty(PropertyConfigKey.subject, data.subject),
      date: this.toAstProperty(PropertyConfigKey.date, data.date),
      dateEnd: this.toAstProperty(PropertyConfigKey.dateEnd, data.dateEnd),
      location: this.toAstProperty(PropertyConfigKey.location, data.location),
      kind: this.toAstProperty(PropertyConfigKey.kind, data.kind),
      hasMarkAsDone: this.toAstProperty(PropertyConfigKey.hasMarkAsDone, data.hasMarkAsDone),
      processHandIn: this.toAstProperty(PropertyConfigKey.processHandIn, data.processHandIn),
      action: this.toAstProperty(PropertyConfigKey.action, data.action),
      showInIndex: this.toAstProperty(PropertyConfigKey.showInIndex, data.showInIndex),
      blockId: this.toAstProperty(PropertyConfigKey.blockId, data.blockId),
      pageNo: this.toAstProperty(PropertyConfigKey.pageNo, data.pageNo),
      x: this.toAstProperty(PropertyConfigKey.x, data.x),
      y: this.toAstProperty(PropertyConfigKey.y, data.y),
      width: this.toAstProperty(PropertyConfigKey.width, data.width),
      height: this.toAstProperty(PropertyConfigKey.height, data.height),
      index: this.toAstProperty(PropertyConfigKey.index, data.index),
      classification: this.toAstProperty(PropertyConfigKey.classification, data.classification),
      availableClassifications: this.toAstProperty(
        PropertyConfigKey.availableClassifications,
        data.availableClassifications,
      ),
      allowedBit: this.toAstProperty(PropertyConfigKey.allowedBit, data.allowedBit),
      tableFixedHeader: this.toAstProperty(PropertyConfigKey.tableFixedHeader, data.tableFixedHeader),
      tableSearch: this.toAstProperty(PropertyConfigKey.tableSearch, data.tableSearch),
      tableSort: this.toAstProperty(PropertyConfigKey.tableSort, data.tableSort),
      tablePagination: this.toAstProperty(PropertyConfigKey.tablePagination, data.tablePagination),
      tablePaginationLimit: this.toAstProperty(PropertyConfigKey.tablePaginationLimit, data.tablePaginationLimit),
      tableHeight: this.toAstProperty(PropertyConfigKey.tableHeight, data.tableHeight),
      tableWhitespaceNoWrap: this.toAstProperty(PropertyConfigKey.tableWhitespaceNoWrap, data.tableWhitespaceNoWrap),
      tableAutoWidth: this.toAstProperty(PropertyConfigKey.tableAutoWidth, data.tableAutoWidth),
      tableResizableColumns: this.toAstProperty(PropertyConfigKey.tableResizableColumns, data.tableResizableColumns),
      quizCountItems: this.toAstProperty(PropertyConfigKey.quizCountItems, data.quizCountItems),
      quizStrikethroughSolutions: this.toAstProperty(
        PropertyConfigKey.quizStrikethroughSolutions,
        data.quizStrikethroughSolutions,
      ),
      codeLineNumbers: this.toAstProperty(PropertyConfigKey.codeLineNumbers, data.codeLineNumbers),
      codeMinimap: this.toAstProperty(PropertyConfigKey.codeMinimap, data.codeMinimap),
      stripePricingTableId: this.toAstProperty(PropertyConfigKey.stripePricingTableId, data.stripePricingTableId),
      stripePublishableKey: this.toAstProperty(PropertyConfigKey.stripePublishableKey, data.stripePublishableKey),
      thumbImage: this.toAstProperty(PropertyConfigKey.thumbImage, data.thumbImage),
      scormSource: this.toAstProperty(PropertyConfigKey.scormSource, data.scormSource),
      posterImage: this.toAstProperty(PropertyConfigKey.posterImage, data.posterImage),
      focusX: this.toAstProperty(PropertyConfigKey.focusX, data.focusX),
      focusY: this.toAstProperty(PropertyConfigKey.focusY, data.focusY),
      pointerLeft: this.toAstProperty(PropertyConfigKey.pointerLeft, data.pointerLeft),
      pointerTop: this.toAstProperty(PropertyConfigKey.pointerTop, data.pointerTop),
      listItemIndent: this.toAstProperty(PropertyConfigKey.listItemIndent, data.listItemIndent),
      backgroundWallpaper: this.toAstProperty(PropertyConfigKey.backgroundWallpaper, data.backgroundWallpaper),
      hasBookNavigation: this.toAstProperty(PropertyConfigKey.hasBookNavigation, data.hasBookNavigation),
      deeplink: this.toAstProperty(PropertyConfigKey.deeplink, data.deeplink),
      externalLink: this.toAstProperty(PropertyConfigKey.externalLink, data.externalLink),
      externalLinkText: this.toAstProperty(PropertyConfigKey.externalLinkText, data.externalLinkText),
      videoCallLink: this.toAstProperty(PropertyConfigKey.videoCallLink, data.videoCallLink),
      vendorUrl: this.toAstProperty(PropertyConfigKey.vendorUrl, data.vendorUrl),
      search: this.toAstProperty(PropertyConfigKey.search, data.search),
      bot: this.toAstProperty(PropertyConfigKey.bot, data.bot),
      duration: this.toAstProperty(PropertyConfigKey.duration, data.duration),
      referenceProperty: this.toAstProperty(PropertyConfigKey.property_reference, data.referenceProperty),
      list: this.toAstProperty(PropertyConfigKey.list, data.list),
      textReference: this.toAstProperty(PropertyConfigKey.textReference, data.textReference),
      isTracked: this.toAstProperty(PropertyConfigKey.isTracked, data.isTracked),
      isInfoOnly: this.toAstProperty(PropertyConfigKey.isInfoOnly, data.isInfoOnly),
      imageFirst: this.toAstProperty(PropertyConfigKey.imageFirst, data.imageFirst),
      activityType: this.toAstProperty(PropertyConfigKey.activityType, data.activityType),
      labelTrue: this.toAstProperty(PropertyConfigKey.labelTrue, data.labelTrue),
      labelFalse: this.toAstProperty(PropertyConfigKey.labelFalse, data.labelFalse),
      content2Buy: this.toAstProperty(PropertyConfigKey.content2Buy, data.content2Buy),
      mailingList: this.toAstProperty(PropertyConfigKey.mailingList, data.mailingList),
      buttonCaption: this.toAstProperty(PropertyConfigKey.buttonCaption, data.buttonCaption),
      callToActionUrl: this.toAstProperty(PropertyConfigKey.callToActionUrl, data.callToActionUrl),
      caption: this.convertJsonTextToAstText(data.caption),
      quotedPerson: this.toAstProperty(PropertyConfigKey.quotedPerson, data.quotedPerson),
      partialAnswer: this.toAstProperty(PropertyConfigKey.partialAnswer, data.partialAnswer),
      reasonableNumOfChars: reasonableNumOfCharsProperty,
      sampleSolution: this.toAstProperty(PropertyConfigKey.property_sampleSolution, data.sampleSolution),
      additionalSolutions: this.toAstProperty(PropertyConfigKey.additionalSolutions, data.additionalSolutions),
      resolved: this.toAstProperty(PropertyConfigKey.resolved, data.resolved),
      resolvedDate: this.toAstProperty(PropertyConfigKey.resolvedDate, data.resolvedDate),
      resolvedBy: this.toAstProperty(PropertyConfigKey.resolvedBy, data.resolvedBy),
      maxCreatedBits: this.toAstProperty(PropertyConfigKey.maxCreatedBits, data.maxCreatedBits),
      maxDisplayLevel: this.toAstProperty(PropertyConfigKey.maxDisplayLevel, data.maxDisplayLevel),
      page: this.toAstProperty(PropertyConfigKey.page, data.page),
      productId: this.toAstProperty(PropertyConfigKey.productId, data.productId),
      product: this.toAstProperty(PropertyConfigKey.product, data.product),
      productList: this.toAstProperty(PropertyConfigKey.productList, data.productList),
      productVideo: this.toAstProperty(PropertyConfigKey.productVideo, data.productVideo),
      productVideoList: this.toAstProperty(PropertyConfigKey.productVideoList, data.productVideoList),
      productFolder: this.toAstProperty(PropertyConfigKey.productFolder, data.productFolder),
      technicalTerm: this.technicalTerm(data.technicalTerm),
      servings: this.servings(data.servings),
      ratingLevelStart: this.ratingLevelStartEnd(data.ratingLevelStart),
      ratingLevelEnd: this.ratingLevelStartEnd(data.ratingLevelEnd),
      ratingLevelSelected: this.toAstProperty(PropertyConfigKey.ratingLevelSelected, data.ratingLevelSelected),
      title: this.convertJsonTextToAstText(data.title),
      subtitle: this.convertJsonTextToAstText(data.subtitle),
      level: NumberUtils.asNumber(data.level),
      toc: this.toAstProperty(PropertyConfigKey.toc, data.toc),
      progress: this.toAstProperty(PropertyConfigKey.progress, data.progress),
      anchor: data.anchor,
      reference: data.reference,
      referenceEnd: data.referenceEnd,
      markConfig: this.buildMarkConfigs(data.markConfig),
      item: this.convertJsonTextToAstText(data.item),
      lead: this.convertJsonTextToAstText(data.lead),
      pageNumber: this.convertJsonTextToAstText(data.pageNumber),
      marginNumber: this.convertJsonTextToAstText(data.marginNumber),
      hint: this.convertJsonTextToAstText(data.hint),
      instruction: this.convertJsonTextToAstText(data.instruction),
      ...this.toExample(data._isDefaultExample, data.example),
      imageSource: this.imageSource(data.imageSource),
      person: this.person(data.bitType, data.person),
      imagePlaceholder: ArrayUtils.asSingle(
        this.resourceBuilder.resourceFromResourceDataJson(
          data.bitType,
          ResourceTag.image,
          data.imagePlaceholder?.image,
        ),
      ) as ImageResourceWrapperJson,
      resources: ArrayUtils.asArray(this.resourceBuilder.resourceFromResourceJson(data.bitType, data.resources)),
      body: data.body,
      cardNode,
      footer: data.footer,

      markup: data.markup,
      parser: data.parser,

      // Must always be last in the AST so key clashes are avoided correctly with other properties
      extraProperties: this.parseExtraProperties(data.extraProperties),

      // Private properties
      _isDefaultExample: data._isDefaultExample ?? false,
    };

    // Push reasonableNumOfChars down the tree for the interview bit
    if (Config.isOfBitType(data.bitType, BitType.interview)) {
      this.pushDownTree(
        undefined,
        undefined,
        cardNode,
        'questions',
        PropertyConfigKey.reasonableNumOfChars,
        data.reasonableNumOfChars,
      );
    }

    // Push isCaseSensitive down the tree for the cloze, match and match-matrix bits
    this.pushDownTree(
      [data.body, ...(cardNode?.cardBits?.map((cardBit) => cardBit.body) ?? [])],
      [BodyBitType.gap],
      undefined,
      'isCaseSensitive',
      PropertyConfigKey.isCaseSensitive,
      data.isCaseSensitive ?? true,
    );

    this.pushDownTree(
      undefined,
      undefined,
      cardNode,
      'pairs',
      PropertyConfigKey.isCaseSensitive,
      data.isCaseSensitive ?? true,
    );
    this.pushDownTree(
      undefined,
      undefined,
      cardNode,
      ['matrix', 'cells'],
      PropertyConfigKey.isCaseSensitive,
      data.isCaseSensitive ?? true,
    );

    // If _isDefaultExample is set at the bit level, push the default example down the tree to the relevant nodes
    this.pushExampleDownTree(data.body, cardNode, data._isDefaultExample, convertedExample.example);

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
   * Build choice[] node
   *
   * @param data - data for the node
   * @returns
   */
  buildChoices(data: Partial<ChoiceJson>[] | undefined): ChoiceJson[] | undefined {
    if (!Array.isArray(data)) return undefined;
    const nodes = data.map((d) => this.choice(d)).filter((d) => d != null);
    return nodes.length > 0 ? nodes : undefined;
  }

  /**
   * Build choice node
   *
   * @param data - data for the node
   * @returns
   */
  choice(data: Partial<ChoiceJson> | undefined): ChoiceJson | undefined {
    if (!data) return undefined;

    // NOTE: Node order is important and is defined here
    const node: ChoiceJson = {
      choice: data.choice ?? '',
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
      ignoreEmptyArrays: ['item', 'hint', 'instruction'],
      ignoreUndefined: ['example'],
    });

    return node;
  }

  /**
   * Build response[] node
   *
   * @param data - data for the node
   * @returns
   */
  buildResponses(data: Partial<ResponseJson>[] | undefined): ResponseJson[] | undefined {
    if (!Array.isArray(data)) return undefined;
    const nodes = data.map((d) => this.response(d)).filter((d) => d != null);
    return nodes.length > 0 ? nodes : undefined;
  }

  /**
   * Build response node
   *
   * @param data - data for the node
   * @returns
   */
  response(data: Partial<ResponseJson> | undefined): ResponseJson | undefined {
    if (!data) return undefined;

    // NOTE: Node order is important and is defined here
    const node: ResponseJson = {
      response: data.response ?? '',
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
      ignoreEmptyArrays: ['item', 'hint', 'instruction'],
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
   * Build quiz[] node
   *
   * @param data - data for the node
   * @returns
   */
  buildQuizzes(data: Partial<QuizJson>[] | undefined): QuizJson[] | undefined {
    if (!Array.isArray(data)) return undefined;
    const nodes = data.map((d) => this.quiz(d)).filter((d) => d != null);
    return nodes.length > 0 ? nodes : undefined;
  }

  /**
   * Build quiz node
   *
   * @param data - data for the node
   * @returns
   */
  quiz(data: Partial<QuizJson> | undefined): QuizJson | undefined {
    if (!data) return undefined;

    const convertedExample = {
      ...this.toExample(data._isDefaultExample, data._defaultExample),
    };

    let choices: ChoiceJson[] | undefined;
    let responses: ResponseJson[] | undefined;

    if (data.choices) {
      choices = this.buildChoices(data.choices);

      // Push _isDefaultExample down the tree
      this.pushExampleDownTreeBoolean(data._isDefaultExample, convertedExample.example, true, choices);
    } else if (data.responses) {
      responses = this.buildResponses(data.responses);

      // Push _isDefaultExample down the tree
      this.pushExampleDownTreeBoolean(data._isDefaultExample, convertedExample.example, false, responses);
    } else {
      // No choices or responses, not a valid quiz
      return undefined;
    }

    // NOTE: Node order is important and is defined here
    const node: QuizJson = {
      item: this.convertJsonTextToAstText(data.item),
      lead: this.convertJsonTextToAstText(data.lead),
      hint: this.convertJsonTextToAstText(data.hint),
      instruction: this.convertJsonTextToAstText(data.instruction),
      isExample: !!data._defaultExample,
      choices: choices as ChoiceJson[],
      responses: responses as ResponseJson[],
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
      ignoreEmptyArrays: ['item', 'hint', 'instruction'],
    });

    return node;
  }

  /**
   * Build heading node
   *
   * @param data - data for the node
   * @returns
   */
  heading(data: Partial<HeadingJson> | undefined): HeadingJson | undefined {
    if (!data) return undefined;
    if (data.forKeys == null) return undefined;

    // NOTE: Node order is important and is defined here
    const node: HeadingJson = {
      forKeys: data.forKeys ?? '',
      forValues: data.forValues ?? data._forValuesDefault ?? '',
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
    const defaultExample = Array.isArray(data._valuesAst) && data._valuesAst.length > 0 ? data._valuesAst[0] : null;

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
      _valuesAst: data._valuesAst,
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
   * Build matrix[] node
   *
   * @param data - data for the node
   * @returns
   */
  buildMatricies(data: Partial<MatrixJson>[] | undefined): MatrixJson[] | undefined {
    if (!Array.isArray(data)) return undefined;
    const nodes = data.map((d) => this.matrix(d)).filter((d) => d != null);
    return nodes.length > 0 ? nodes : undefined;
  }

  /**
   * Build matrix node
   *
   * @param data - data for the node
   * @returns
   */
  matrix(data: Partial<MatrixJson> | undefined): MatrixJson | undefined {
    if (!data) return undefined;

    // const convertedExample = {
    //   ...this.toExample(_isDefaultExample, example),
    // };

    // // Push _isDefaultExample down the tree
    // this.pushExampleDownTreeBoolean(_isDefaultExample, convertedExample.example, true, choices);
    // this.pushExampleDownTreeBoolean(_isDefaultExample, convertedExample.example, false, responses);

    let isExample = false;

    // Set isExample for matrix based on isExample for cells
    for (const c of data.cells ?? []) {
      if (data._isDefaultExample && !c.isExample) {
        c.isExample = true;
      }
      isExample = c.isExample ? true : isExample;
    }

    // NOTE: Node order is important and is defined here
    const node: MatrixJson = {
      key: data.key ?? '',
      item: this.convertJsonTextToAstText(data.item),
      lead: this.convertJsonTextToAstText(data.lead),
      hint: this.convertJsonTextToAstText(data.hint),
      instruction: this.convertJsonTextToAstText(data.instruction),
      isExample,
      cells: (data.cells ?? []).map((c) => this.matrixCell(c)).filter((c) => c != null),
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
      ignoreEmptyArrays: ['hint', 'item', 'cells'],
      ignoreUndefined: ['isCaseSensitive'],
    });

    return node;
  }

  /**
   * Build matrixCell node
   *
   * @param data - data for the node
   * @returns
   */
  matrixCell(data: Partial<MatrixCellJson> | undefined): MatrixCellJson | undefined {
    if (!data) return undefined;

    // Set default example
    const defaultExample = Array.isArray(data._valuesAst) && data._valuesAst.length > 0 ? data._valuesAst[0] : null;

    // NOTE: Node order is important and is defined here
    const node: MatrixCellJson = {
      values: data.values ?? [],
      item: this.convertJsonTextToAstText(data.item),
      lead: this.convertJsonTextToAstText(data.lead),
      hint: this.convertJsonTextToAstText(data.hint),
      instruction: this.convertJsonTextToAstText(data.instruction),
      isCaseSensitive: data.isCaseSensitive as boolean,
      ...this.toExample(data._isDefaultExample, data.example, defaultExample),
      _valuesAst: data._valuesAst,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
      ignoreEmptyArrays: ['instruction', 'item', 'values'],
      ignoreUndefined: ['example', 'isCaseSensitive'],
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
    const defaultExample = data._sampleSolutionAst;

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
      _sampleSolutionAst: data._sampleSolutionAst,
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
   * Build ingredient[] node
   *
   * @param data - data for the node
   * @returns
   */
  buildIngredients(data: Partial<IngredientJson>[] | undefined): IngredientJson[] | undefined {
    if (!Array.isArray(data)) return undefined;
    const nodes = data.map((d) => this.ingredient(d)).filter((d) => d != null);
    return nodes.length > 0 ? nodes : undefined;
  }

  /**
   * Build ingredient node
   *
   * @param data - data for the node
   * @returns
   */
  ingredient(data: Partial<IngredientJson> | undefined): IngredientJson | undefined {
    if (!data) return undefined;

    // NOTE: Node order is important and is defined here
    const node: IngredientJson = {
      title: data.title ?? '',
      checked: data.checked ?? false,
      item: data.item ?? '',
      quantity: data.quantity ?? 0,
      unit: data.unit ?? '',
      unitAbbr: data.unitAbbr ?? '',
      decimalPlaces: data.decimalPlaces ?? 1,
      disableCalculation: data.disableCalculation ?? false,
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
  gap(data: Partial<GapJson> | undefined): GapJson | undefined {
    if (!data) return undefined;

    // Set default example
    const defaultExample =
      Array.isArray(data._solutionsAst) && data._solutionsAst.length > 0 ? data._solutionsAst[0] : null;

    // NOTE: Node order is important and is defined here
    const node: GapJson = {
      type: BodyBitType.gap,
      solutions: data.solutions ?? [], // Must be before other properties except type
      item: this.convertJsonTextToAstText(data.item),
      lead: this.convertJsonTextToAstText(data.lead),
      hint: this.convertJsonTextToAstText(data.hint),
      instruction: this.convertJsonTextToAstText(data.instruction),
      isCaseSensitive: data.isCaseSensitive as boolean,
      ...this.toExample(data._isDefaultExample, data.example, defaultExample),
      _solutionsAst: data._solutionsAst ?? [],
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
  buildMarkConfigs(data: Partial<MarkConfigJson>[] | undefined): MarkConfigJson[] | undefined {
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
  markConfig(data: Partial<MarkConfigJson> | undefined): MarkConfigJson | undefined {
    if (!data) return undefined;

    // NOTE: Node order is important and is defined here
    const node: MarkConfigJson = {
      mark: data.mark ?? 'unknown',
      color: data.color ?? '',
      emphasis: data.emphasis ?? '',
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
  mark(data: Partial<MarkJson> | undefined): MarkJson | undefined {
    if (!data) return undefined;

    // NOTE: Node order is important and is defined here
    const node: MarkJson = {
      type: BodyBitType.mark,
      solution: data.solution ?? '', // Must be before other properties except type
      mark: data.mark ?? '',
      item: this.convertJsonTextToAstText(data.item),
      lead: this.convertJsonTextToAstText(data.lead),
      hint: this.convertJsonTextToAstText(data.hint),
      instruction: this.convertJsonTextToAstText(data.instruction),
      ...this.toExample(data._isDefaultExample, data.example, true),
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
  select(data: Partial<SelectJson> | undefined): SelectJson | undefined {
    if (!data) return undefined;

    // NOTE: Node order is important and is defined here
    const node: SelectJson = {
      type: BodyBitType.select,
      options: this.buildSelectOptions(data.options) ?? [], // Must be before other properties except type
      prefix: data.prefix ?? '',
      postfix: data.postfix ?? '',
      item: this.convertJsonTextToAstText(data.item),
      lead: this.convertJsonTextToAstText(data.lead),
      hint: this.convertJsonTextToAstText(data.hint),
      instruction: this.convertJsonTextToAstText(data.instruction),
      ...this.toExample(false, undefined, undefined), // Will be set in later
      _hintString: data._hintString ?? '',
      _instructionString: data._instructionString ?? '',
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
   * Build selectOption[] node
   *
   * @param data - data for the node
   * @returns
   */
  buildSelectOptions(data: Partial<SelectOptionJson>[] | undefined): SelectOptionJson[] | undefined {
    if (!Array.isArray(data)) return undefined;
    const nodes = data.map((d) => this.selectOption(d)).filter((d) => d != null);
    return nodes.length > 0 ? nodes : undefined;
  }

  /**
   * Build selectOption node
   *
   * @param data - data for the node
   * @returns
   */
  selectOption(data: Partial<SelectOptionJson> | undefined): SelectOptionJson | undefined {
    if (!data) return undefined;

    // NOTE: Node order is important and is defined here
    const node: SelectOptionJson = {
      text: data.text ?? '', // Must be before other properties except type
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
  highlight(data: Partial<HighlightJson> | undefined): HighlightJson | undefined {
    if (!data) return undefined;

    // NOTE: Node order is important and is defined here
    const node: HighlightJson = {
      type: BodyBitType.highlight,
      texts: this.buildHighlightTexts(data.texts) ?? [], // Must be before other properties except type
      prefix: data.prefix ?? '',
      postfix: data.postfix ?? '',
      item: this.convertJsonTextToAstText(data.item),
      lead: this.convertJsonTextToAstText(data.lead),
      hint: this.convertJsonTextToAstText(data.hint),
      instruction: this.convertJsonTextToAstText(data.instruction),
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
   * Build highlightText[] node
   *
   * @param data - data for the node
   * @returns
   */
  buildHighlightTexts(data: Partial<HighlightTextJson>[] | undefined): HighlightTextJson[] | undefined {
    if (!Array.isArray(data)) return undefined;
    const nodes = data.map((d) => this.highlightText(d)).filter((d) => d != null);
    return nodes.length > 0 ? nodes : undefined;
  }

  /**
   * Build highlightText node
   *
   * @param data - data for the node
   * @returns
   */
  highlightText(data: Partial<HighlightTextJson> | undefined): HighlightTextJson | undefined {
    if (!data) return undefined;

    // NOTE: Node order is important and is defined here
    const node: HighlightTextJson = {
      text: data.text ?? '', // Must be before other properties except type
      isCorrect: !!data.isCorrect,
      isHighlighted: !!data.isHighlighted,
      item: this.convertJsonTextToAstText(data.item),
      lead: this.convertJsonTextToAstText(data.lead),
      hint: this.convertJsonTextToAstText(data.hint),
      instruction: this.convertJsonTextToAstText(data.instruction),
      ...this.toExample(data._isDefaultExample, data.example, !!data.isCorrect),
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
    item?: JsonText;
    lead?: JsonText;
    pageNumber?: JsonText;
    marginNumber?: JsonText;
    hint?: JsonText;
    instruction?: JsonText;
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
      choices: this.buildChoices(data.choices),
      responses: this.buildResponses(data.responses),
      quizzes: this.buildQuizzes(data.quizzes),
      heading: this.heading(data.heading),
      pairs: this.buildPairs(bitType, data.pairs),
      matrix: this.buildMatricies(data.matrix),
      table: this.table(data.table),
      botResponses: this.buildBotResponses(data.botResponses),
      ingredients: this.buildIngredients(data.ingredients),
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
