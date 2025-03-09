import structuredClone from '@ungap/structured-clone';

import { Breakscape } from '../breakscaping/Breakscape';
import { Config } from '../config/Config';
import { BreakscapedString } from '../model/ast/BreakscapedString';
import { Bit, BitmarkAst, Body, ExtraProperties, CardNode, CardBit, Footer } from '../model/ast/Nodes';
import { JsonText, TextAst, TextNode } from '../model/ast/TextNodes';
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
import { StringUtils } from '../utils/StringUtils';
import { env } from '../utils/env/Env';

import { BaseBuilder, WithExampleJson } from './BaseBuilder';
import { ResourceBuilder } from './ResourceBuilder';
import { NodeValidator } from './rules/NodeValidator';

import {
  BookJson,
  BotResponseJson,
  CaptionDefinitionJson,
  CaptionDefinitionListJson,
  ChoiceJson,
  DefinitionListItemJson,
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
  PronunciationTableJson,
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
  BodyBitJson,
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
  buildBitmark(data: { bits?: Bit[]; errors?: ParserError[] }): BitmarkAst {
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
  buildBit(data: {
    bitType: BitTypeType;
    bitLevel: number;
    textFormat?: TextFormatType;
    resourceType?: ResourceTagType; // This is optional, it will be inferred from the resource
    isCommented?: boolean;
    id?: string | string[];
    internalComment?: string | string[];
    customerId?: string;
    customerExternalId?: string | string[];
    externalId?: string | string[];
    spaceId?: string | string[];
    padletId?: string;
    jupyterId?: string;
    jupyterExecutionCount?: number;
    isPublic?: boolean;
    aiGenerated?: boolean;
    machineTranslated?: string;
    searchIndex?: string | string[];
    analyticsTag?: string | string[];
    categoryTag?: string | string[];
    topicTag?: string | string[];
    altLangTag?: string;
    feedbackEngine?: string;
    feedbackType?: string;
    disableFeedback?: boolean;
    diffOp?: string;
    diffRef?: string;
    diffContext?: string;
    diffTime?: number;
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
    chatWithBook?: boolean;
    chatWithBookBrainKey?: string;
    action?: string;
    showInIndex?: boolean;
    refAuthor?: string | string[];
    refBookTitle?: string;
    refPublisher?: string | string[];
    citationStyle?: string;
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
    tableColumnMinWidth?: number;
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
    vendorSurveyId?: string;
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
    handInAcceptFileType?: string | string[];
    handInRequirement?: string | string[];
    handInInstruction?: string;
    maxCreatedBits?: number;
    maxDisplayLevel?: number;
    maxTocChapterLevel?: number;
    page?: string | string[];
    productId?: string | string[];
    product?: string | string[];
    productList?: string | string[];
    productVideo?: string | string[];
    productVideoList?: string | string[];
    productFolder?: string;
    technicalTerm?: Partial<TechnicalTermJson>;
    servings?: Partial<ServingsJson>;
    ratingLevelStart?: Partial<RatingLevelStartEndJson>;
    ratingLevelEnd?: Partial<RatingLevelStartEndJson>;
    ratingLevelSelected?: number;
    partialAnswer?: string;
    book?: string | BookJson[];
    title?: JsonText;
    subtitle?: JsonText;
    level?: number | string;
    toc?: boolean;
    progress?: boolean;
    anchor?: string;
    reference?: string;
    referenceEnd?: string;
    revealSolutions?: boolean;
    isCaseSensitive?: boolean;
    item?: JsonText;
    lead?: JsonText;
    pageNumber?: JsonText;
    marginNumber?: JsonText;
    hint?: JsonText;
    instruction?: JsonText;
    example?: Partial<ExampleJson>;
    imageSource?: Partial<ImageSourceJson>;
    person?: Partial<PersonJson>;
    extraProperties?: {
      [key: string]: unknown | unknown[];
    };

    markConfig?: Partial<MarkConfigJson>[];
    imagePlaceholder?: Partial<ImageResourceWrapperJson>;
    resources?: Partial<ResourceJson> | Partial<ResourceJson>[];
    body?: Partial<Body>;
    sampleSolution?: string;
    additionalSolutions?: string | string[];
    elements?: string[];
    flashcards?: Partial<FlashcardJson>[];
    definitions?: Partial<DefinitionListItemJson>[];
    statement?: Partial<StatementJson>;
    statements?: Partial<StatementJson>[];
    responses?: Partial<ResponseJson>[];
    quizzes?: Partial<QuizJson>[];
    heading?: Partial<HeadingJson>;
    pairs?: Partial<PairJson>[];
    matrix?: Partial<MatrixJson>[];
    pronunciationTable?: Partial<PronunciationTableJson>;
    table?: Partial<TableJson>;
    choices?: Partial<ChoiceJson>[];
    questions?: Partial<QuestionJson>[];
    botResponses?: Partial<BotResponseJson>[];
    ingredients?: Partial<IngredientJson>[];
    captionDefinitionList?: Partial<CaptionDefinitionListJson>;
    cardBits?: Partial<CardBit>[];
    footer?: Partial<Footer>;

    markup?: string;
    parser?: ParserInfo;
    __isDefaultExample?: boolean;
  }): Bit | undefined {
    const bitConfig = Config.getBitConfig(data.bitType);
    const textFormat = TextFormat.fromValue(data.textFormat) ?? bitConfig.textFormatDefault;

    // Validate and convert resources, and ensure it is an array
    // const resources = ArrayUtils.asArray(resourcesIn);

    // Set the card node data
    const cardNode = this.buildCardNode(data.bitType, textFormat, data);

    // Add reasonableNumOfChars to the bit only for essay bits (in other cases it will be pushed down the tree)
    const reasonableNumOfCharsProperty = Config.isOfBitType(data.bitType, BitType.essay)
      ? this.toAstProperty(PropertyConfigKey.reasonableNumOfChars, data.reasonableNumOfChars)
      : undefined;

    const convertedExample = {
      ...this.toExample(data.__isDefaultExample, data.example as TextAst),
    };

    // NOTE: Node order is important and is defined here
    const node: Bit = {
      bitType: data.bitType,
      bitLevel: data.bitLevel,
      textFormat,
      resourceType: ResourceTag.fromValue(data.resourceType),
      isCommented: data.isCommented,

      // Properties
      id: this.toAstProperty(PropertyConfigKey.id, data.id),
      internalComment: this.toAstProperty(PropertyConfigKey.internalComment, data.internalComment),
      customerId: this.toAstProperty(PropertyConfigKey.customerId, data.customerId),
      customerExternalId: this.toAstProperty(PropertyConfigKey.customerExternalId, data.customerExternalId),
      externalId: this.toAstProperty(PropertyConfigKey.externalId, data.externalId),
      spaceId: this.toAstProperty(PropertyConfigKey.spaceId, data.spaceId),
      padletId: this.toAstProperty(PropertyConfigKey.padletId, data.padletId),
      jupyterId: this.toAstProperty(PropertyConfigKey.jupyterId, data.jupyterId),
      jupyterExecutionCount: this.toAstProperty(PropertyConfigKey.jupyterExecutionCount, data.jupyterExecutionCount),
      isPublic: this.toAstProperty(PropertyConfigKey.isPublic, data.isPublic),
      aiGenerated: this.toAstProperty(PropertyConfigKey.aiGenerated, data.aiGenerated),
      machineTranslated: this.toAstProperty(PropertyConfigKey.machineTranslated, data.machineTranslated),
      searchIndex: this.toAstProperty(PropertyConfigKey.searchIndex, data.searchIndex),
      analyticsTag: this.toAstProperty(PropertyConfigKey.analyticsTag, data.analyticsTag),
      categoryTag: this.toAstProperty(PropertyConfigKey.categoryTag, data.categoryTag),
      topicTag: this.toAstProperty(PropertyConfigKey.topicTag, data.topicTag),
      altLangTag: this.toAstProperty(PropertyConfigKey.altLangTag, data.altLangTag),
      feedbackEngine: this.toAstProperty(PropertyConfigKey.feedbackEngine, data.feedbackEngine),
      feedbackType: this.toAstProperty(PropertyConfigKey.feedbackType, data.feedbackType),
      disableFeedback: this.toAstProperty(PropertyConfigKey.disableFeedback, data.disableFeedback),
      diffOp: this.toAstProperty(PropertyConfigKey.diffOp, data.diffOp),
      diffRef: this.toAstProperty(PropertyConfigKey.diffRef, data.diffRef),
      diffContext: this.toAstProperty(PropertyConfigKey.diffContext, data.diffContext),
      diffTime: this.toAstProperty(PropertyConfigKey.diffTime, data.diffTime),
      releaseVersion: this.toAstProperty(PropertyConfigKey.releaseVersion, data.releaseVersion),
      releaseKind: this.toAstProperty(PropertyConfigKey.releaseKind, data.releaseKind),
      releaseDate: this.toAstProperty(PropertyConfigKey.releaseDate, data.releaseDate),
      book: this.buildBooks(data.book),
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
      chatWithBook: this.toAstProperty(PropertyConfigKey.chatWithBook, data.chatWithBook),
      chatWithBookBrainKey: this.toAstProperty(PropertyConfigKey.chatWithBookBrainKey, data.chatWithBookBrainKey),
      action: this.toAstProperty(PropertyConfigKey.action, data.action),
      showInIndex: this.toAstProperty(PropertyConfigKey.showInIndex, data.showInIndex),
      refAuthor: this.toAstProperty(PropertyConfigKey.refAuthor, data.refAuthor),
      refBookTitle: this.toAstProperty(PropertyConfigKey.refBookTitle, data.refBookTitle),
      refPublisher: this.toAstProperty(PropertyConfigKey.refPublisher, data.refPublisher),
      citationStyle: this.toAstProperty(PropertyConfigKey.citationStyle, data.citationStyle),
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
      tableColumnMinWidth: this.toAstProperty(PropertyConfigKey.tableColumnMinWidth, data.tableColumnMinWidth),
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
      duration: this.toAstProperty(PropertyConfigKey.duration, data.duration),
      deeplink: this.toAstProperty(PropertyConfigKey.deeplink, data.deeplink),
      externalLink: this.toAstProperty(PropertyConfigKey.externalLink, data.externalLink),
      externalLinkText: this.toAstProperty(PropertyConfigKey.externalLinkText, data.externalLinkText),
      videoCallLink: this.toAstProperty(PropertyConfigKey.videoCallLink, data.videoCallLink),
      vendorSurveyId: this.toAstProperty(PropertyConfigKey.vendorSurveyId, data.vendorSurveyId),
      vendorUrl: this.toAstProperty(PropertyConfigKey.vendorUrl, data.vendorUrl),
      search: this.toAstProperty(PropertyConfigKey.search, data.search),
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
      caption: this.handleJsonText(data.caption),
      quotedPerson: this.toAstProperty(PropertyConfigKey.quotedPerson, data.quotedPerson),
      reasonableNumOfChars: reasonableNumOfCharsProperty,
      resolved: this.toAstProperty(PropertyConfigKey.resolved, data.resolved),
      resolvedDate: this.toAstProperty(PropertyConfigKey.resolvedDate, data.resolvedDate),
      resolvedBy: this.toAstProperty(PropertyConfigKey.resolvedBy, data.resolvedBy),
      handInAcceptFileType: this.toAstProperty(PropertyConfigKey.handInAcceptFileType, data.handInAcceptFileType),
      handInRequirement: this.toAstProperty(PropertyConfigKey.handInRequirement, data.handInRequirement),
      handInInstruction: this.toAstProperty(PropertyConfigKey.handInInstruction, data.handInInstruction),
      maxCreatedBits: this.toAstProperty(PropertyConfigKey.maxCreatedBits, data.maxCreatedBits),
      maxDisplayLevel: this.toAstProperty(PropertyConfigKey.maxDisplayLevel, data.maxDisplayLevel),
      maxTocChapterLevel: this.toAstProperty(PropertyConfigKey.maxTocChapterLevel, data.maxTocChapterLevel),
      page: this.toAstProperty(PropertyConfigKey.page, data.page),
      productId: this.toAstProperty(PropertyConfigKey.productId, data.productId),
      product: this.toAstProperty(PropertyConfigKey.product, data.product),
      productList: this.toAstProperty(PropertyConfigKey.productList, data.productList),
      productVideo: this.toAstProperty(PropertyConfigKey.productVideo, data.productVideo),
      productVideoList: this.toAstProperty(PropertyConfigKey.productVideoList, data.productVideoList),
      productFolder: this.toAstProperty(PropertyConfigKey.productFolder, data.productFolder),
      technicalTerm: this.buildTechnicalTerm(data.technicalTerm),
      servings: this.buildServings(data.servings),
      ratingLevelStart: this.buildRatingLevelStartEnd(data.ratingLevelStart),
      ratingLevelEnd: this.buildRatingLevelStartEnd(data.ratingLevelEnd),
      ratingLevelSelected: this.toAstProperty(PropertyConfigKey.ratingLevelSelected, data.ratingLevelSelected),
      markConfig: this.buildMarkConfigs(data.markConfig),
      imageSource: this.buildImageSource(data.imageSource),
      person: this.buildPerson(data.bitType, data.person),
      bot: this.toAstProperty(PropertyConfigKey.bot, data.bot),
      referenceProperty: this.toAstProperty(PropertyConfigKey.property_reference, data.referenceProperty),

      // Book data
      title: this.handleJsonText(data.title),
      subtitle: this.handleJsonText(data.subtitle),
      level: NumberUtils.asNumber(data.level),
      toc: this.toAstProperty(PropertyConfigKey.toc, data.toc),
      progress: this.toAstProperty(PropertyConfigKey.progress, data.progress),
      anchor: data.anchor,
      reference: data.reference,
      referenceEnd: data.referenceEnd,
      revealSolutions: this.toAstProperty(PropertyConfigKey.revealSolutions, data.revealSolutions),

      // Item, Lead, Hint, Instruction
      item: this.handleJsonText(data.item),
      lead: this.handleJsonText(data.lead),
      pageNumber: this.handleJsonText(data.pageNumber),
      marginNumber: this.handleJsonText(data.marginNumber),
      hint: this.handleJsonText(data.hint),
      instruction: this.handleJsonText(data.instruction),

      partialAnswer: this.toAstProperty(PropertyConfigKey.partialAnswer, data.partialAnswer),
      sampleSolution: this.toAstProperty(PropertyConfigKey.property_sampleSolution, data.sampleSolution),
      additionalSolutions: this.toAstProperty(PropertyConfigKey.additionalSolutions, data.additionalSolutions),

      // Example
      ...this.toExample(data.__isDefaultExample, data.example as TextAst),

      // Person

      imagePlaceholder: ArrayUtils.asSingle(
        this.resourceBuilder.resourceFromResourceDataJson(
          data.bitType,
          ResourceTag.image,
          data.imagePlaceholder?.image,
        ),
      ) as ImageResourceWrapperJson,
      resources: ArrayUtils.asArray(this.resourceBuilder.resourceFromResourceJson(data.bitType, data.resources)),

      // Body, Card, Footer, must be after all other properties except the extraProperties and markup / parser
      body: this.buildBody(textFormat, data.body),
      cardNode,
      footer: this.buildFooter(data.footer),

      // Must be after other properties/tags in the AST so key clashes are avoided correctly
      extraProperties: this.parseExtraProperties(data.extraProperties),

      markup: data.markup,
      parser: data.parser,

      // Private properties
      __isDefaultExample: data.__isDefaultExample ?? false,
    };

    // Push reasonableNumOfChars down the tree for the interview bit
    if (Config.isOfBitType(node.bitType, BitType.interview)) {
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
      [node.body, ...(cardNode?.cardBits?.map((cardBit) => cardBit.body) ?? [])],
      [BodyBitType.gap],
      undefined,
      undefined, //'isCaseSensitive',
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

    // If __isDefaultExample is set at the bit level, push the default example down the tree to the relevant nodes
    this.pushExampleDownTree(node.body, cardNode, node.__isDefaultExample, convertedExample.example);

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
      ignoreEmptyArrays: ['item', 'lead', 'pageNumber', 'marginNumber', 'hint', 'instruction'],
    });

    // Validate and correct invalid bits as much as possible
    return NodeValidator.validateBit(node);
  }

  /**
   * Build books[] node
   *
   * @param data - data for the node
   * @returns
   */
  protected buildBooks(data: Partial<BookJson>[] | string | undefined): BookJson[] | string | undefined {
    if (StringUtils.isString(data)) return data as string;
    if (!Array.isArray(data)) return undefined;
    const nodes = data.map((d) => this.buildBook(d)).filter((d) => d != null);
    return nodes.length > 0 ? nodes : undefined;
  }

  /**
   * Build choice node
   *
   * @param data - data for the node
   * @returns
   */
  protected buildBook(data: Partial<BookJson> | undefined): BookJson | undefined {
    if (!data) return undefined;

    // NOTE: Node order is important and is defined here
    const node: BookJson = {
      book: data.book ?? '',
      reference: data.reference ?? '',
      referenceEnd: (data.referenceEnd ?? undefined) as string,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
      ignoreEmptyString: ['book', 'reference'],
    });

    return node;
  }

  /**
   * Build choice[] node
   *
   * @param data - data for the node
   * @returns
   */
  protected buildChoices(data: Partial<ChoiceJson>[] | undefined): ChoiceJson[] | undefined {
    if (!Array.isArray(data)) return undefined;
    const nodes = data.map((d) => this.buildChoice(d)).filter((d) => d != null);
    return nodes.length > 0 ? nodes : undefined;
  }

  /**
   * Build choice node
   *
   * @param data - data for the node
   * @returns
   */
  protected buildChoice(data: Partial<ChoiceJson> | undefined): ChoiceJson | undefined {
    if (!data) return undefined;

    // NOTE: Node order is important and is defined here
    const node: ChoiceJson = {
      choice: data.choice ?? '',
      isCorrect: !!data.isCorrect,
      item: this.handleJsonText(data.item),
      lead: this.handleJsonText(data.lead),
      hint: this.handleJsonText(data.hint),
      instruction: this.handleJsonText(data.instruction),
      ...this.toExample(data.__isDefaultExample, data.example, !!data.isCorrect),
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
  protected buildResponses(data: Partial<ResponseJson>[] | undefined): ResponseJson[] | undefined {
    if (!Array.isArray(data)) return undefined;
    const nodes = data.map((d) => this.buildResponse(d)).filter((d) => d != null);
    return nodes.length > 0 ? nodes : undefined;
  }

  /**
   * Build response node
   *
   * @param data - data for the node
   * @returns
   */
  protected buildResponse(data: Partial<ResponseJson> | undefined): ResponseJson | undefined {
    if (!data) return undefined;

    // NOTE: Node order is important and is defined here
    const node: ResponseJson = {
      response: data.response ?? '',
      isCorrect: !!data.isCorrect,
      item: this.handleJsonText(data.item),
      lead: this.handleJsonText(data.lead),
      hint: this.handleJsonText(data.hint),
      instruction: this.handleJsonText(data.instruction),
      ...this.toExample(data.__isDefaultExample, data.example, !!data.isCorrect),
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
  protected buildBotResponses(data: Partial<BotResponseJson>[] | undefined): BotResponseJson[] | undefined {
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
  protected botResponse(data: Partial<BotResponseJson> | undefined): BotResponseJson | undefined {
    if (!data) return undefined;

    // NOTE: Node order is important and is defined here
    const node: BotResponseJson = {
      response: data.response ?? '',
      reaction: data.reaction ?? '',
      feedback: data.feedback ?? '',
      item: this.handleJsonText(data.item),
      lead: this.handleJsonText(data.lead),
      hint: this.handleJsonText(data.hint),
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
  protected buildQuizzes(data: Partial<QuizJson>[] | undefined): QuizJson[] | undefined {
    if (!Array.isArray(data)) return undefined;
    const nodes = data.map((d) => this.buildQuiz(d)).filter((d) => d != null);
    return nodes.length > 0 ? nodes : undefined;
  }

  /**
   * Build quiz node
   *
   * @param data - data for the node
   * @returns
   */
  protected buildQuiz(data: Partial<QuizJson> | undefined): QuizJson | undefined {
    if (!data) return undefined;

    const convertedExample = {
      ...this.toExample(data.__isDefaultExample, data.__defaultExample),
    };

    let choices: ChoiceJson[] | undefined;
    let responses: ResponseJson[] | undefined;

    if (data.choices) {
      choices = this.buildChoices(data.choices);

      // Push __isDefaultExample down the tree
      this.pushExampleDownTreeBoolean(data.__isDefaultExample, convertedExample.example, true, choices);
    } else if (data.responses) {
      responses = this.buildResponses(data.responses);

      // Push __isDefaultExample down the tree
      this.pushExampleDownTreeBoolean(data.__isDefaultExample, convertedExample.example, false, responses);
    } else {
      // No choices or responses, not a valid quiz
      return undefined;
    }

    // NOTE: Node order is important and is defined here
    const node: QuizJson = {
      item: this.handleJsonText(data.item),
      lead: this.handleJsonText(data.lead),
      hint: this.handleJsonText(data.hint),
      instruction: this.handleJsonText(data.instruction),
      isExample: !!data.__defaultExample,
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
  protected buildHeading(data: Partial<HeadingJson> | undefined): HeadingJson | undefined {
    if (!data) return undefined;
    if (data.forKeys == null) return undefined;

    // NOTE: Node order is important and is defined here
    const node: HeadingJson = {
      forKeys: data.forKeys ?? '',
      forValues: data.forValues ?? data.__forValuesDefault ?? '',
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
  protected buildPairs(bitType: BitTypeType, data: Partial<PairJson>[] | undefined): PairJson[] | undefined {
    if (!Array.isArray(data)) return undefined;
    const nodes = data.map((d) => this.buildPair(bitType, d)).filter((d) => d != null);
    return nodes.length > 0 ? nodes : undefined;
  }

  /**
   * Build pair node
   *
   * @param data - data for the node
   * @returns
   */
  protected buildPair(bitType: BitTypeType, data: Partial<PairJson> | undefined): PairJson | undefined {
    if (!data) return undefined;

    // Set default example
    const defaultExample = Array.isArray(data.__valuesAst) && data.__valuesAst.length > 0 ? data.__valuesAst[0] : null;

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
      item: this.handleJsonText(data.item),
      lead: this.handleJsonText(data.lead),
      hint: this.handleJsonText(data.hint),
      instruction: this.handleJsonText(data.instruction),
      isCaseSensitive: data.isCaseSensitive as boolean,
      ...this.toExample(data.__isDefaultExample, data.example, defaultExample),
      values: data.values ?? [],
      __valuesAst: data.__valuesAst,
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
  protected buildMatricies(data: Partial<MatrixJson>[] | undefined): MatrixJson[] | undefined {
    if (!Array.isArray(data)) return undefined;
    const nodes = data.map((d) => this.buildMatrix(d)).filter((d) => d != null);
    return nodes.length > 0 ? nodes : undefined;
  }

  /**
   * Build matrix node
   *
   * @param data - data for the node
   * @returns
   */
  protected buildMatrix(data: Partial<MatrixJson> | undefined): MatrixJson | undefined {
    if (!data) return undefined;

    // const convertedExample = {
    //   ...this.toExample(__isDefaultExample, example),
    // };

    // // Push __isDefaultExample down the tree
    // this.pushExampleDownTreeBoolean(__isDefaultExample, convertedExample.example, true, choices);
    // this.pushExampleDownTreeBoolean(__isDefaultExample, convertedExample.example, false, responses);

    let isExample = false;

    // Set isExample for matrix based on isExample for cells
    for (const c of data.cells ?? []) {
      if (data.__isDefaultExample && !c.isExample) {
        c.isExample = true;
      }
      isExample = c.isExample ? true : isExample;
    }

    // NOTE: Node order is important and is defined here
    const node: MatrixJson = {
      key: data.key ?? '',
      item: this.handleJsonText(data.item),
      lead: this.handleJsonText(data.lead),
      hint: this.handleJsonText(data.hint),
      instruction: this.handleJsonText(data.instruction),
      isExample,
      cells: (data.cells ?? []).map((c) => this.buildMatrixCell(c)).filter((c) => c != null),
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
  protected buildMatrixCell(data: Partial<MatrixCellJson> | undefined): MatrixCellJson | undefined {
    if (!data) return undefined;

    // Set default example
    const defaultExample = Array.isArray(data.__valuesAst) && data.__valuesAst.length > 0 ? data.__valuesAst[0] : null;

    // NOTE: Node order is important and is defined here
    const node: MatrixCellJson = {
      values: data.values ?? [],
      item: this.handleJsonText(data.item),
      lead: this.handleJsonText(data.lead),
      hint: this.handleJsonText(data.hint),
      instruction: this.handleJsonText(data.instruction),
      isCaseSensitive: data.isCaseSensitive as boolean,
      ...this.toExample(data.__isDefaultExample, data.example, defaultExample),
      __valuesAst: data.__valuesAst,
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
   * Build pronunciation table node
   *
   * @param data - data for the node
   * @returns
   */
  protected buildPronunciationTable(
    bitType: BitTypeType,
    textFormat: TextFormatType,
    dataIn: Partial<PronunciationTableJson> | undefined,
  ): PronunciationTableJson | undefined {
    if (!dataIn) return undefined;

    // NOTE: Node order is important and is defined here
    const node: PronunciationTableJson = {
      data: (dataIn.data ?? []).map((row) =>
        (row ?? []).map((cell) => {
          // Process the audio resource
          const audio = (
            ArrayUtils.asSingle(
              this.resourceBuilder.resourceFromResourceDataJson(bitType, ResourceTag.audio, cell.audio),
            ) as AudioResourceWrapperJson
          )?.audio;

          return {
            title: this.handleJsonText(cell.title),
            body: this.handleJsonText(cell.body, textFormat),
            audio,
          };
        }),
      ),
    };

    // Remove Unset Optionals
    // ObjectUtils.removeUnwantedProperties(node, {
    //   ignoreAllFalse: true,
    // });

    return node;
  }

  /**
   * Build table node
   *
   * @param data - data for the node
   * @returns
   */
  protected buildTable(textFormat: TextFormatType, dataIn: Partial<TableJson> | undefined): TableJson | undefined {
    if (!dataIn) return undefined;

    // NOTE: Node order is important and is defined here
    const node: TableJson = {
      columns: (dataIn.columns ?? []).map((col) => this.handleJsonText(col, textFormat)),
      data: (dataIn.data ?? []).map((row) => (row ?? []).map((cell) => this.handleJsonText(cell, textFormat))),
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
  protected buildQuestions(
    textFormat: TextFormatType,
    data: Partial<QuestionJson>[] | undefined,
  ): QuestionJson[] | undefined {
    if (!Array.isArray(data)) return undefined;
    const nodes = data.map((d) => this.buildQuestion(textFormat, d)).filter((d) => d != null);
    return nodes.length > 0 ? nodes : undefined;
  }

  /**
   * Build question node
   *
   * @param data - data for the node
   * @returns
   */
  protected buildQuestion(
    textFormat: TextFormatType,
    data: Partial<QuestionJson> | undefined,
  ): QuestionJson | undefined {
    if (!data) return undefined;

    // Set default example
    const defaultExample = data.__sampleSolutionAst;

    // Unused
    textFormat;

    // NOTE: Node order is important and is defined here
    const node: QuestionJson = {
      question: data.question ?? '',
      partialAnswer: data.partialAnswer ?? '',
      sampleSolution: data.sampleSolution ?? '',
      additionalSolutions: (data.additionalSolutions ?? undefined) as string[],
      reasonableNumOfChars: (data.reasonableNumOfChars ?? undefined) as number,
      item: this.handleJsonText(data.item),
      lead: this.handleJsonText(data.lead),
      hint: this.handleJsonText(data.hint),
      instruction: this.handleJsonText(data.instruction),
      ...this.toExample(data.__isDefaultExample, data.example, defaultExample),
      __sampleSolutionAst: data.__sampleSolutionAst,
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
  protected buildIngredients(data: Partial<IngredientJson>[] | undefined): IngredientJson[] | undefined {
    if (!Array.isArray(data)) return undefined;
    const nodes = data.map((d) => this.buildIngredient(d)).filter((d) => d != null);
    return nodes.length > 0 ? nodes : undefined;
  }

  /**
   * Build ingredient node
   *
   * @param data - data for the node
   * @returns
   */
  protected buildIngredient(data: Partial<IngredientJson> | undefined): IngredientJson | undefined {
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
   * - Handles JSON, Bitmark text, and plain text
   *   - body: set to either string, TextAst, or JSON
   *   - bodyBits: set to array of BodyBitJson (will be validated and merged into body if it is a string)
   *   - placeholders: set to placeholders from v2 JSON when body is a v2 JSON string
   *   - bodyString: set to the original string if body is a string (only used for card body)
   *
   * @param data - data for the node
   * @returns
   */
  protected buildBody(textFormat: TextFormatType, data: Partial<Body> | undefined): Body | undefined {
    if (!data) return undefined;
    let body: JsonText | unknown | undefined;
    const bodyBits: BodyBitJson[] = [];
    const placeholders = data.placeholders;
    const bodyString = data.bodyString;

    // Handle JSON type body
    const handleJsonBody = () => {
      // Attempt to parse a string body as JSON to support the legacy format
      if (typeof data.body === 'string') {
        try {
          body = JSON.parse(data.body);
        } catch (e) {
          // Could not parse JSON - set body to null
          body = null;
        }
      } else {
        body = data.body;
      }
    };

    // Handle Bitmark text type body (both AST v3 and plain text v2)
    const handleBitmarkTextBody = () => {
      let rawBody: TextAst = data.body as TextAst;
      let bodyStr: BreakscapedString | undefined;
      const placeholderNodes: {
        [keyof: string]: BodyBitJson;
      } = {};
      // TODO - process body bits through the correct builders.

      if (StringUtils.isString(data.body)) {
        // Body is a string (legacy bitmark v2, or not bitmark--/++)
        bodyStr = ((data.body as BreakscapedString) ?? '').trim() as BreakscapedString;
        rawBody = [];
      } else if (Array.isArray(data.body)) {
        // Body is an array (prosemirror like JSON)
        // Already in the correct format
      } else {
        // body is invalid
        rawBody = [];
      }

      if (placeholders) {
        for (const [key, val] of Object.entries(placeholders)) {
          // const bit = this.bodyBitToAst(val);
          // placeholderNodes[key] = bit as BodyBit;
          placeholderNodes[key] = val as BodyBitJson;
        }
      }

      if (bodyStr) {
        // Bug #7141: Use textFormat for textParser, not always bitmark-- if it is a v2 string body
        // However, only use plain text breakscaping the text from the v2 JSON body

        // Special v2 Breakscaping
        bodyStr = Breakscape.breakscape(bodyStr, {
          textFormat,
          v2: true,
        });

        // Convert placeholders {1} to [!1], etc.
        let index = 0;
        const newPlaceholderNodes: BodyBitJson[] = [];
        for (const [key, val] of Object.entries(placeholderNodes)) {
          if (bodyStr) {
            const newKey = `[!${index}]`;
            bodyStr = bodyStr.replace(`${key}`, newKey) as BreakscapedString;
            newPlaceholderNodes.push(val);
            index++;
          }
        }

        // Convert the body string to AST
        rawBody = this.textParser.toAst(bodyStr, {
          textFormat,
        });

        const replaceBitsRecursive = (bodyText: TextAst) => {
          for (let i = 0, len = bodyText.length; i < len; i++) {
            const bodyPart = bodyText[i];
            if ((bodyPart.type as string) === 'bit') {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const index = (bodyPart as any).index as number;
              if (newPlaceholderNodes[index] != null) {
                bodyText[i] = newPlaceholderNodes[index] as TextNode;
              }
            } else {
              if (bodyPart.content) replaceBitsRecursive(bodyPart.content);
            }
          }
        };

        // Replace the placeholders with the AST
        replaceBitsRecursive(rawBody);
      }

      // Process the body bits to ensure they are valid
      // Walking the body bits will change them, so we should make a copy before processing
      rawBody = structuredClone(rawBody);
      this.textParser.walkBodyBits(rawBody, (parent, index, bodyBit) => {
        // Ensure the body bit is valid
        let parsedBit: BodyBitJson | undefined;
        switch (bodyBit.type) {
          case BodyBitType.gap:
            parsedBit = this.buildGap(bodyBit as GapJson);
            break;
          case BodyBitType.mark:
            parsedBit = this.buildMark(bodyBit as MarkJson);
            break;
          case BodyBitType.select:
            parsedBit = this.buildSelect(bodyBit as SelectJson);
            break;
          case BodyBitType.highlight:
            parsedBit = this.buildHighlight(bodyBit as HighlightJson);
            break;
          default:
          // TODO?? Ensure other parts are valid
        }
        if (parsedBit != undefined) {
          parent[index] = parsedBit as TextNode;
          bodyBits.push(parsedBit);
        }
      });

      // Set the body
      body = rawBody;

      // Mark the body as text
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (body as any).__tag = 'text';
    };

    const handlePlainTextBody = () => {
      body = data.body as string;
    };

    const isBitmarkText = textFormat === TextFormat.bitmarkMinusMinus || textFormat === TextFormat.bitmarkPlusPlus;
    if (textFormat === TextFormat.json) {
      // JSON
      handleJsonBody();
    } else if (isBitmarkText) {
      // Bitmark text (either ast or string)
      handleBitmarkTextBody();
    } else {
      // Text but not bitmark (plain text)
      handlePlainTextBody();
    }

    const node: Body = {
      body,
      bodyBits,
      bodyString,
      // Placeholders are only ever parsed into AST, never stored directly
    };

    return node;
  }

  /**
   * Build footer node
   *
   * @param data - data for the node
   * @returns
   */
  protected buildFooter(data: Partial<Footer> | undefined): Footer | undefined {
    if (!data) return undefined;
    const node: Footer = {
      footer: this.handleJsonText(data.footer),
    };

    return node;
  }

  /**
   * Build gap node
   *
   * @param data - data for the node
   * @returns
   */
  protected buildGap(data: Partial<GapJson> | undefined): GapJson | undefined {
    if (!data) return undefined;

    // Set default example
    const defaultExample =
      Array.isArray(data.__solutionsAst) && data.__solutionsAst.length > 0 ? data.__solutionsAst[0] : null;

    // Copy any attributes from 'attrs' to the body bit (data is in 'attrs' when coming from JSON)
    data = this.bodyBitCopyFromAttrs(data);

    // NOTE: Node order is important and is defined here
    const node: GapJson = {
      type: BodyBitType.gap,
      solutions: data.solutions ?? [], // Must be before other properties except type
      item: this.handleJsonText(data.item),
      lead: this.handleJsonText(data.lead),
      hint: this.handleJsonText(data.hint),
      instruction: this.handleJsonText(data.instruction),
      isCaseSensitive: data.isCaseSensitive as boolean,
      ...this.toExample(data.__isDefaultExample, data.example, defaultExample),
      __solutionsAst: data.__solutionsAst,

      attrs: {},
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
  protected buildMarkConfigs(data: Partial<MarkConfigJson>[] | undefined): MarkConfigJson[] | undefined {
    if (!Array.isArray(data)) return undefined;
    const nodes = data.map((d) => this.buildMarkConfig(d)).filter((d) => d != null);
    return nodes.length > 0 ? nodes : undefined;
  }

  /**
   * Build mark config node
   *
   * @param data - data for the node
   * @returns
   */
  protected buildMarkConfig(data: Partial<MarkConfigJson> | undefined): MarkConfigJson | undefined {
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
  protected buildMark(data: Partial<MarkJson> | undefined): MarkJson | undefined {
    if (!data) return undefined;

    // Copy any attributes from 'attrs' to the body bit (data is in 'attrs' when coming from JSON)
    data = this.bodyBitCopyFromAttrs(data);

    // NOTE: Node order is important and is defined here
    const node: MarkJson = {
      type: BodyBitType.mark,
      solution: data.solution ?? '', // Must be before other properties except type
      mark: data.mark ?? '',
      item: this.handleJsonText(data.item),
      lead: this.handleJsonText(data.lead),
      hint: this.handleJsonText(data.hint),
      instruction: this.handleJsonText(data.instruction),
      ...this.toExample(data.__isDefaultExample, data.example, true),

      attrs: {},
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
  protected buildSelect(data: Partial<SelectJson> | undefined): SelectJson | undefined {
    if (!data) return undefined;

    // Copy any attributes from 'attrs' to the body bit (data is in 'attrs' when coming from JSON)
    data = this.bodyBitCopyFromAttrs(data);

    // NOTE: Node order is important and is defined here
    const node: SelectJson = {
      type: BodyBitType.select,
      options: this.buildSelectOptions(data.options) ?? [], // Must be before other properties except type
      prefix: data.prefix ?? '',
      postfix: data.postfix ?? '',
      item: this.handleJsonText(data.item),
      lead: this.handleJsonText(data.lead),
      hint: this.handleJsonText(data.hint),
      instruction: this.handleJsonText(data.instruction),
      ...this.toExample(false, undefined, undefined), // Will be set in later
      __hintString: data.__hintString,
      __instructionString: data.__instructionString,

      attrs: {},
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
  protected buildSelectOptions(data: Partial<SelectOptionJson>[] | undefined): SelectOptionJson[] | undefined {
    if (!Array.isArray(data)) return undefined;
    const nodes = data.map((d) => this.buildSelectOption(d)).filter((d) => d != null);
    return nodes.length > 0 ? nodes : undefined;
  }

  /**
   * Build selectOption node
   *
   * @param data - data for the node
   * @returns
   */
  protected buildSelectOption(data: Partial<SelectOptionJson> | undefined): SelectOptionJson | undefined {
    if (!data) return undefined;

    // NOTE: Node order is important and is defined here
    const node: SelectOptionJson = {
      text: data.text ?? '', // Must be before other properties except type
      isCorrect: !!data.isCorrect,
      item: this.handleJsonText(data.item),
      lead: this.handleJsonText(data.lead),
      hint: this.handleJsonText(data.hint),
      instruction: this.handleJsonText(data.instruction),
      ...this.toExample(data.__isDefaultExample, data.example, !!data.isCorrect),
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
  buildHighlight(data: Partial<HighlightJson> | undefined): HighlightJson | undefined {
    if (!data) return undefined;

    // Copy any attributes from 'attrs' to the body bit (data is in 'attrs' when coming from JSON)
    data = this.bodyBitCopyFromAttrs(data);

    // NOTE: Node order is important and is defined here
    const node: HighlightJson = {
      type: BodyBitType.highlight,
      texts: this.buildHighlightTexts(data.texts) ?? [], // Must be before other properties except type
      prefix: data.prefix ?? '',
      postfix: data.postfix ?? '',
      item: this.handleJsonText(data.item),
      lead: this.handleJsonText(data.lead),
      hint: this.handleJsonText(data.hint),
      instruction: this.handleJsonText(data.instruction),
      ...this.toExample(false, undefined, undefined), // Will be set in later

      attrs: {},
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
  protected buildHighlightTexts(data: Partial<HighlightTextJson>[] | undefined): HighlightTextJson[] | undefined {
    if (!Array.isArray(data)) return undefined;
    const nodes = data.map((d) => this.buildHighlightText(d)).filter((d) => d != null);
    return nodes.length > 0 ? nodes : undefined;
  }

  /**
   * Build highlightText node
   *
   * @param data - data for the node
   * @returns
   */
  protected buildHighlightText(data: Partial<HighlightTextJson> | undefined): HighlightTextJson | undefined {
    if (!data) return undefined;

    // NOTE: Node order is important and is defined here
    const node: HighlightTextJson = {
      text: data.text ?? '', // Must be before other properties except type
      isCorrect: !!data.isCorrect,
      isHighlighted: !!data.isHighlighted,
      item: this.handleJsonText(data.item),
      lead: this.handleJsonText(data.lead),
      hint: this.handleJsonText(data.hint),
      instruction: this.handleJsonText(data.instruction),
      ...this.toExample(data.__isDefaultExample, data.example, !!data.isCorrect),
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
  protected buildFlashcards(
    textFormat: TextFormatType,
    data: Partial<FlashcardJson>[] | undefined,
  ): FlashcardJson[] | undefined {
    if (!Array.isArray(data)) return undefined;
    const nodes = data.map((d) => this.buildFlashcard(textFormat, d)).filter((d) => d != null);
    return nodes.length > 0 ? nodes : undefined;
  }

  /**
   * Build flashcard node
   *
   * @param data - data for the node
   * @returns
   */
  protected buildFlashcard(
    textFormat: TextFormatType,
    data: Partial<FlashcardJson> | undefined,
  ): FlashcardJson | undefined {
    if (!data) return undefined;

    // NOTE: Node order is important and is defined here
    const node: FlashcardJson = {
      question: this.handleJsonText(data.question, textFormat),
      answer: this.handleJsonText(data.answer, textFormat),
      alternativeAnswers: this.handleJsonText(data.alternativeAnswers, textFormat),
      item: this.handleJsonText(data.item),
      lead: this.handleJsonText(data.lead),
      hint: this.handleJsonText(data.hint),
      instruction: this.handleJsonText(data.instruction),
      ...this.toExample(data.__isDefaultExample, data.example, true),
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
   * Build definitionListItem[] node
   *
   * @param data - data for the node
   * @returns
   */
  protected buildDefinitionList(
    textFormat: TextFormatType,
    data: Partial<DefinitionListItemJson>[] | undefined,
  ): DefinitionListItemJson[] | undefined {
    if (!Array.isArray(data)) return undefined;
    const nodes = data.map((d) => this.buildDefinitionListItem(textFormat, d)).filter((d) => d != null);
    return nodes.length > 0 ? nodes : undefined;
  }

  /**
   * Build definitionListItem node
   *
   * @param data - data for the node
   * @returns
   */
  protected buildDefinitionListItem(
    textFormat: TextFormatType,
    data: Partial<DefinitionListItemJson> | undefined,
  ): DefinitionListItemJson | undefined {
    if (!data) return undefined;

    // NOTE: Node order is important and is defined here
    const node: DefinitionListItemJson = {
      term: this.handleJsonText(data.term, textFormat),
      definition: this.handleJsonText(data.definition, textFormat),
      alternativeDefinitions: this.handleJsonText(data.alternativeDefinitions, textFormat),
      item: this.handleJsonText(data.item),
      lead: this.handleJsonText(data.lead),
      hint: this.handleJsonText(data.hint),
      instruction: this.handleJsonText(data.instruction),
      ...this.toExample(data.__isDefaultExample, data.example, true),
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
      ignoreEmptyArrays: ['question', 'answer', 'alternativeDefinitions', 'item', 'hint', 'instruction'],
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
  protected buildStatements(data: Partial<StatementJson>[] | undefined): StatementJson[] | undefined {
    if (!Array.isArray(data)) return undefined;
    const nodes = data.map((d) => this.buildStatement(d)).filter((d) => d != null);
    return nodes.length > 0 ? nodes : undefined;
  }

  /**
   * Build statement node
   *
   * @param data - data for the node
   * @returns
   */
  protected buildStatement(data: Partial<StatementJson> | undefined): StatementJson | undefined {
    if (!data) return undefined;

    // NOTE: Node order is important and is defined here
    const node: StatementJson = {
      statement: data.statement ?? '',
      isCorrect: !!data.isCorrect,
      item: this.handleJsonText(data.item),
      lead: this.handleJsonText(data.lead),
      hint: this.handleJsonText(data.hint),
      instruction: this.handleJsonText(data.instruction),
      ...this.toExample(data.__isDefaultExample, data.example, !!data.isCorrect),
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
  protected buildImageSource(data: Partial<ImageSourceJson> | undefined): ImageSourceJson | undefined {
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
  protected buildPerson(bitType: BitTypeType, data: Partial<PersonJson> | undefined): PersonJson | undefined {
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
  protected buildTechnicalTerm(data: Partial<TechnicalTermJson> | undefined): TechnicalTermJson | undefined {
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
  protected buildServings(data: Partial<ServingsJson> | undefined): ServingsJson | undefined {
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
  protected buildRatingLevelStartEnd(
    data: Partial<RatingLevelStartEndJson> | undefined,
  ): RatingLevelStartEndJson | undefined {
    if (!data) return undefined;
    const { level, label } = data;

    // NOTE: Node order is important and is defined here
    const node: RatingLevelStartEndJson = {
      level: level ?? 0,
      label: this.handleJsonText(label),
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
  protected buildCaptionDefinition(
    textFormat: TextFormatType,
    data: Partial<CaptionDefinitionJson> | undefined,
  ): CaptionDefinitionJson | undefined {
    if (!data) return undefined;

    // Unused
    textFormat;

    // NOTE: Node order is important and is defined here
    const node: CaptionDefinitionJson = {
      // term: this.convertJsonTextToAstText(data.term),
      // description: this.convertJsonTextToAstText(data.description),
      term: data.term ?? '',
      definition: data.definition ?? '',
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
  protected buildCaptionDefinitionList(
    textFormat: TextFormatType,
    data: Partial<CaptionDefinitionListJson> | undefined,
  ): CaptionDefinitionListJson | undefined {
    if (!data) return undefined;

    // NOTE: Node order is important and is defined here
    const node: CaptionDefinitionListJson = {
      columns: data.columns ?? [],
      definitions: (data.definitions ?? [])
        .map((d) => {
          return this.buildCaptionDefinition(textFormat, {
            term: d.term,
            definition: d.definition,
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

  /**
   * Build card bit[] node
   *
   * @param data - data for the node
   * @returns
   */
  protected buildCardBits(
    bitType: BitTypeType,
    textFormat: TextFormatType,
    data: Partial<CardBit>[] | undefined,
  ): Bit[] | undefined {
    if (!Array.isArray(data)) return undefined;
    const nodes = data.map((d) => this.buildCardBit(bitType, textFormat, d)).filter((d) => d != null);
    return nodes.length > 0 ? nodes : undefined;
  }

  /**
   * Build card bit node
   *
   * @param data - data for the node
   * @returns
   */
  protected buildCardBit(
    bitType: BitTypeType,
    textFormat: TextFormatType,
    data: Partial<CardBit> | undefined,
  ): CardBit | undefined {
    if (!data) return undefined;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const node = this.buildBit({ ...data, bitType, textFormat } as any) as CardBit;

    // // NOTE: Node order is important and is defined here
    // const node: CardBit = {
    //   item: this.handleJsonText(data.item),
    //   lead: this.handleJsonText(data.lead),
    //   hint: this.handleJsonText(data.hint),
    //   instruction: this.handleJsonText(data.instruction),
    //   ...this.toExample(data.__isDefaultExample, data.example),
    //   __isDefaultExample: data.__isDefaultExample ?? false,
    //   body: this.buildBody(textFormat, data.body),

    //   // Must always be last in the AST so key clashes are avoided correctly with other properties
    //   extraProperties: this.parseExtraProperties(data.extraProperties),
    // };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
      // ignoreEmptyArrays: ['example'],
      ignoreUndefined: ['example'],
    });

    // Validate and correct invalid bits as much as possible
    return NodeValidator.validateCardBit(node);
  }

  //
  // Private
  //

  private buildCardNode(
    bitType: BitTypeType,
    textFormat: TextFormatType,
    data: {
      flashcards?: Partial<FlashcardJson>[];
      definitions?: Partial<DefinitionListItemJson>[];
      questions?: Partial<QuestionJson>[];
      elements?: string[];
      statement?: Partial<StatementJson>;
      statements?: Partial<StatementJson>[];
      choices?: Partial<ChoiceJson>[];
      responses?: Partial<ResponseJson>[];
      quizzes?: Partial<QuizJson>[];
      heading?: Partial<HeadingJson>;
      pairs?: Partial<PairJson>[];
      matrix?: Partial<MatrixJson>[];
      pronunciationTable?: Partial<PronunciationTableJson>;
      table?: Partial<TableJson>;
      botResponses?: Partial<BotResponseJson>[];
      ingredients?: Partial<IngredientJson>[];
      captionDefinitionList?: Partial<CaptionDefinitionListJson>;
      cardBits?: Partial<CardBit>[];
    },
  ): CardNode | undefined {
    const node: CardNode = {
      questions: this.buildQuestions(textFormat, data.questions),
      elements: data.elements,
      flashcards: this.buildFlashcards(textFormat, data.flashcards),
      definitions: this.buildDefinitionList(textFormat, data.definitions),
      statement: this.buildStatement(data.statement),
      statements: this.buildStatements(data.statements),
      choices: this.buildChoices(data.choices),
      responses: this.buildResponses(data.responses),
      quizzes: this.buildQuizzes(data.quizzes),
      heading: this.buildHeading(data.heading),
      pairs: this.buildPairs(bitType, data.pairs),
      matrix: this.buildMatricies(data.matrix),
      pronunciationTable: this.buildPronunciationTable(bitType, textFormat, data.pronunciationTable),
      table: this.buildTable(textFormat, data.table),
      botResponses: this.buildBotResponses(data.botResponses),
      ingredients: this.buildIngredients(data.ingredients),
      captionDefinitionList: this.buildCaptionDefinitionList(textFormat, data.captionDefinitionList),
      cardBits: this.buildCardBits(bitType, textFormat, data.cardBits),
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node);

    return Object.keys(node).length > 0 ? node : undefined;
  }

  /**
   * Copy any attributes from 'attrs' property to the root node (necessary when the input if from JSON)
   * The values in 'attrs' will overwrite any existing values in the node
   *
   * The original object is not modified, a new object is returned
   *
   * @param data
   */
  private bodyBitCopyFromAttrs<T extends Partial<BodyBitJson>>(data: T): T {
    const copy = { ...data };
    // Copy any attributes from 'attrs' to the node (necessary when the input if from JSON)
    if (data.attrs) {
      for (const [key, value] of Object.entries(data.attrs)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (copy as any)[key] = value;
      }
    }

    return copy;
  }

  /**
   * Set examples down the tree
   *
   * @param body
   * @param cardNode
   * @param __isDefaultExample
   * @param example
   * @returns true if any of the answers has an example, otherwise undefined
   */
  private pushExampleDownTree(
    body: Body | undefined,
    cardNode: CardNode | undefined,
    __isDefaultExample: boolean | undefined,
    example: ExampleJson | undefined,
  ): void {
    if (__isDefaultExample || example != null) {
      if (cardNode) {
        this.pushExampleDownTreeString(__isDefaultExample, example, cardNode.pairs as WithExampleJson[]);
        this.pushExampleDownTreeBoolean(__isDefaultExample, example, false, cardNode.flashcards as WithExampleJson[]);
        this.pushExampleDownTreeBoolean(__isDefaultExample, example, false, cardNode.definitions as WithExampleJson[]);
        this.pushExampleDownTreeBoolean(__isDefaultExample, example, true, cardNode.choices as WithExampleJson[]);
        this.pushExampleDownTreeBoolean(
          __isDefaultExample,
          example,
          false,
          cardNode.responses,
          cardNode.statements,
          cardNode.statement,
        );
        if (cardNode.quizzes) {
          for (const quiz of cardNode.quizzes) {
            this.pushExampleDownTreeBoolean(
              __isDefaultExample,
              example,
              true,
              quiz.choices as WithExampleJson[] | undefined,
            );
            this.pushExampleDownTreeBoolean(
              __isDefaultExample,
              example,
              false,
              quiz.responses as WithExampleJson[] | undefined,
            );
          }
        }
        if (cardNode.matrix) {
          for (const m of cardNode.matrix) {
            this.pushExampleDownTreeString(__isDefaultExample, example, m.cells);
          }
        }
      }
      if (body) {
        this.pushExampleDownTreeBodyBits(__isDefaultExample, example, body);
      }
    }
  }

  /**
   * Set examples for boolean nodes
   *
   * @param __isDefaultExample
   * @param example
   * @param onlyCorrect
   * @param nodes
   * @returns true if any of the answers has an example, otherwise undefined
   */
  private pushExampleDownTreeBoolean(
    __isDefaultExample: boolean | undefined,
    example: ExampleJson | undefined,
    onlyCorrect: boolean,
    ...nodes: (WithExampleJson | WithExampleJson[] | undefined)[]
  ): void {
    if (!__isDefaultExample && example == null) return;

    if (Array.isArray(nodes)) {
      for (const ds of nodes) {
        if (ds) {
          const exampleNodes = Array.isArray(ds) ? ds : [ds];
          BitUtils.fillBooleanExample(exampleNodes, __isDefaultExample, example, onlyCorrect);
        }
      }
    }
  }

  /**
   * Set examples for string nodes
   *
   * @param __isDefaultExample
   * @param example
   * @param nodes
   * @returns true if any of the answers has an example, otherwise undefined
   */
  private pushExampleDownTreeString(
    __isDefaultExample: boolean | undefined,
    example: ExampleJson | undefined,
    ...nodes: (WithExampleJson | WithExampleJson[] | undefined)[]
  ): void {
    if (!__isDefaultExample && !example) return;

    if (Array.isArray(nodes)) {
      for (const ds of nodes) {
        if (ds) {
          const exampleNodes = Array.isArray(ds) ? ds : [ds];
          BitUtils.fillStringExample(exampleNodes, __isDefaultExample, example, false);
        }
      }
    }
  }

  private pushExampleDownTreeBodyBits(
    __isDefaultExample: boolean | undefined,
    example: ExampleJson | undefined,
    body: Body | undefined,
  ): void {
    if (!__isDefaultExample && !example) return;
    const bodyBitsJson = this.textParser.extractBodyBits(body?.body as TextAst);

    for (const part of bodyBitsJson) {
      if (part) {
        switch (part.type) {
          case BodyBitType.gap: {
            const gap = part as GapJson;
            BitUtils.fillStringExample([gap], __isDefaultExample, example, false);
            break;
          }
          case BodyBitType.mark: {
            const mark = part as MarkJson;
            BitUtils.fillBooleanExample([mark], __isDefaultExample, example, false);
            break;
          }
          case BodyBitType.select: {
            const select = part as SelectJson;
            BitUtils.fillBooleanExample(select.options, __isDefaultExample, example, true);
            break;
          }
          case BodyBitType.highlight: {
            const highlight = part as HighlightJson;
            BitUtils.fillBooleanExample(highlight.texts, __isDefaultExample, example, true);
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
                if (bodyBitTypes.indexOf(part.type as BodyBitTypeType) !== -1) {
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

      if (/*example.__isDefaultExample ||*/ example.isExample || example.example != undefined) {
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

      // definitions
      for (const v of cardNode.definitions ?? []) {
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
