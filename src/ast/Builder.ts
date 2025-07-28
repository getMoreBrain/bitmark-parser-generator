import { Breakscape } from '../breakscaping/Breakscape.ts';
import { Config } from '../config/Config.ts';
import { type BreakscapedString } from '../model/ast/BreakscapedString.ts';
import {
  type Bit,
  type BitmarkAst,
  type Body,
  type CardBit,
  type CardNode,
  type ExtraProperties,
  type Footer,
  type Property,
} from '../model/ast/Nodes.ts';
import { type JsonText, type TextAst, type TextNode } from '../model/ast/TextNodes.ts';
import { ConfigKey } from '../model/config/enum/ConfigKey.ts';
import { BitType, type BitTypeType } from '../model/enum/BitType.ts';
import { BodyBitType, type BodyBitTypeType } from '../model/enum/BodyBitType.ts';
import { DeprecatedTextFormat } from '../model/enum/DeprecatedTextFormat.ts';
import { ResourceType, type ResourceTypeType } from '../model/enum/ResourceType.ts';
import { TextFormat, type TextFormatType } from '../model/enum/TextFormat.ts';
import { TextLocation } from '../model/enum/TextLocation.ts';
import {
  type BookJson,
  type BotResponseJson,
  type ChoiceJson,
  type DefinitionListItemJson,
  type ExampleJson,
  type FeedbackChoiceJson,
  type FeedbackJson,
  type FeedbackReasonJson,
  type FlashcardJson,
  type GroupTagJson,
  type HeadingJson,
  type ImageSourceJson,
  type IngredientJson,
  type MarkConfigJson,
  type MatrixCellJson,
  type MatrixJson,
  type PairJson,
  type PersonJson,
  type PronunciationTableJson,
  type QuestionJson,
  type QuizJson,
  type RatingLevelStartEndJson,
  type ResponseJson,
  type ServingsJson,
  type StatementJson,
  type TableJson,
  type TechnicalTermJson,
  type TextAndIconJson,
} from '../model/json/BitJson.ts';
import {
  type BodyBitJson,
  type GapJson,
  type HighlightJson,
  type HighlightTextJson,
  type MarkJson,
  type SelectJson,
  type SelectOptionJson,
} from '../model/json/BodyBitJson.ts';
import {
  type AudioResourceWrapperJson,
  type ImageResourceWrapperJson,
  type ResourceJson,
} from '../model/json/ResourceJson.ts';
import { type ParserError } from '../model/parser/ParserError.ts';
import { type ParserInfo } from '../model/parser/ParserInfo.ts';
import { ArrayUtils } from '../utils/ArrayUtils.ts';
import { BitUtils } from '../utils/BitUtils.ts';
import { BooleanUtils } from '../utils/BooleanUtils.ts';
import { env } from '../utils/env/Env.ts';
import { NumberUtils } from '../utils/NumberUtils.ts';
import { ObjectUtils } from '../utils/ObjectUtils.ts';
import { StringUtils } from '../utils/StringUtils.ts';
import { BaseBuilder, type BuildContext, type WithExampleJson } from './BaseBuilder.ts';
import { ResourceBuilder } from './ResourceBuilder.ts';
import { NodeValidator } from './rules/NodeValidator.ts';

export interface BuildBitOptions {
  cardSet?: {
    sideNo: number; // Side number of the card set
    variantNo: number; // Variant number of the card set
  };
}

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
  buildBit(
    data: {
      bitType: BitTypeType;
      bitLevel: number;
      textFormat?: TextFormatType;
      resourceType?: ResourceTypeType; // This is optional, it will be inferred from the resource
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
      isTemplate?: boolean;
      isTemplateStripTheme?: boolean;
      aiGenerated?: boolean;
      machineTranslated?: string;
      searchIndex?: string | string[];
      analyticsTag?: string | string[];
      categoryTag?: string | string[];
      topicTag?: string | string[];
      reportTag?: string | string[];
      altLangTag?: string;
      feedbackEngine?: string;
      feedbackType?: string;
      disableFeedback?: boolean;
      diffTo?: string;
      diffOp?: string;
      diffRef?: string;
      diffContext?: string;
      diffTime?: number;
      path?: string;
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
      groupTag?: Partial<GroupTagJson> | Partial<GroupTagJson>[];
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
      bookDiff?: string;
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
      processHandInLocation?: string;
      chatWithBook?: boolean;
      chatWithBookBrainKey?: string;
      action?: string;
      showInIndex?: boolean;
      refAuthor?: string | string[];
      refBookTitle?: string;
      refPublisher?: string | string[];
      refPublicationYear?: string;
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
      tableHeaderWhitespaceNoWrap?: boolean;
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
      backgroundWallpaper?: Partial<ImageResourceWrapperJson>;
      hasBookNavigation?: boolean;
      duration?: string;
      referenceProperty?: string | string[];
      deeplink?: string | string[];
      externalLink?: string;
      externalLinkText?: string;
      videoCallLink?: string;
      vendorDashboardId?: string;
      vendorSurveyId?: string;
      vendorUrl?: string;
      search?: string;
      bot?: string | string[];
      list?: string | string[];
      layer?: string | string[];
      layerRole?: string | string[];
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
      tocResource?: string | string[];
      tocContent?: string | string[];
      page?: string | string[];
      productId?: string | string[];
      product?: string | string[];
      // productList?: string | string[];
      productVideo?: string | string[];
      // productVideoList?: string | string[];
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
      heading?: Partial<HeadingJson>;
      elements?: string[];
      flashcards?: Partial<FlashcardJson>[];
      definitions?: Partial<DefinitionListItemJson>[];
      legend?: Partial<DefinitionListItemJson>[];
      statement?: Partial<StatementJson>;
      statements?: Partial<StatementJson>[];
      responses?: Partial<ResponseJson>[];
      quizzes?: Partial<QuizJson>[];
      pairs?: Partial<PairJson>[];
      matrix?: Partial<MatrixJson>[];
      pronunciationTable?: Partial<PronunciationTableJson>;
      table?: Partial<TableJson>;
      choices?: Partial<ChoiceJson>[];
      questions?: Partial<QuestionJson>[];
      botResponses?: Partial<BotResponseJson>[];
      ingredients?: Partial<IngredientJson>[];
      // DEPRECATED - TO BE REMOVED IN THE FUTURE
      // captionDefinitionList?: Partial<CaptionDefinitionListJson>;
      cardBits?: Partial<CardBit>[];
      footer?: Partial<Footer>;

      markup?: string;
      parser?: ParserInfo;
      __isDefaultExample?: boolean;
    },
    options?: BuildBitOptions,
  ): Bit | undefined {
    const bitType = data.bitType;
    const bitConfig = Config.getBitConfig(bitType);

    // Text Format (accepts deprecated values, and converts them to the new format)
    const deprecatedTextFormat = DeprecatedTextFormat.fromValue(data.textFormat);
    let textFormat = TextFormat.fromValue(data.textFormat) ?? bitConfig.textFormatDefault;
    if (deprecatedTextFormat === DeprecatedTextFormat.bitmarkMinusMinus) {
      textFormat = TextFormat.bitmarkText;
    }

    const context: BuildContext = {
      bitConfig,
      bitType,
      textFormat,
    };

    // Validate and convert resources, and ensure it is an array
    // const resources = ArrayUtils.asArray(resourcesIn);

    // Set the card node data
    const cardNode = this.buildCardNode(context, data);

    // Add reasonableNumOfChars to the bit only for essay bits (in other cases it will be pushed down the tree)
    const reasonableNumOfCharsProperty = Config.isOfBitType(data.bitType, BitType.essay)
      ? this.toAstProperty(
          bitType,
          ConfigKey.property_reasonableNumOfChars,
          data.reasonableNumOfChars,
          options,
        )
      : undefined;

    const convertedExample = {
      ...this.toExample(data.__isDefaultExample, data.example as TextAst),
    };

    // NOTE: Node order is important and is defined here
    const node: Bit = {
      bitType,
      bitLevel: data.bitLevel,
      textFormat,
      resourceType: ResourceType.fromValue(data.resourceType),
      isCommented: data.isCommented,

      // Properties
      id: this.toAstProperty(bitType, ConfigKey.property_id, data.id, options),
      internalComment: this.toAstProperty(
        bitType,
        ConfigKey.property_internalComment,
        data.internalComment,
        options,
      ),
      customerId: this.toAstProperty(
        bitType,
        ConfigKey.property_customerId,
        data.customerId,
        options,
      ),
      customerExternalId: this.toAstProperty(
        bitType,
        ConfigKey.property_customerExternalId,
        data.customerExternalId,
        options,
      ),
      externalId: this.toAstProperty(
        bitType,
        ConfigKey.property_externalId,
        data.externalId,
        options,
      ),
      spaceId: this.toAstProperty(bitType, ConfigKey.property_spaceId, data.spaceId, options),
      padletId: this.toAstProperty(bitType, ConfigKey.property_padletId, data.padletId, options),
      jupyterId: this.toAstProperty(bitType, ConfigKey.property_jupyterId, data.jupyterId, options),
      jupyterExecutionCount: this.toAstProperty(
        bitType,
        ConfigKey.property_jupyterExecutionCount,
        data.jupyterExecutionCount,
        options,
      ),
      isPublic: this.toAstProperty(bitType, ConfigKey.property_isPublic, data.isPublic, options),
      isTemplate: this.toAstProperty(
        bitType,
        ConfigKey.property_isTemplate,
        data.isTemplate,
        options,
      ),
      isTemplateStripTheme: this.toAstProperty(
        bitType,
        ConfigKey.property_isTemplateStripTheme,
        data.isTemplateStripTheme,
        options,
      ),
      aiGenerated: this.toAstProperty(
        bitType,
        ConfigKey.property_aiGenerated,
        data.aiGenerated,
        options,
      ),
      machineTranslated: this.toAstProperty(
        bitType,
        ConfigKey.property_machineTranslated,
        data.machineTranslated,
        options,
      ),
      searchIndex: this.toAstProperty(
        bitType,
        ConfigKey.property_searchIndex,
        data.searchIndex,
        options,
      ),
      analyticsTag: this.toAstProperty(
        bitType,
        ConfigKey.property_analyticsTag,
        data.analyticsTag,
        options,
      ),
      categoryTag: this.toAstProperty(
        bitType,
        ConfigKey.property_categoryTag,
        data.categoryTag,
        options,
      ),
      topicTag: this.toAstProperty(bitType, ConfigKey.property_topicTag, data.topicTag, options),
      reportTag: this.toAstProperty(bitType, ConfigKey.property_reportTag, data.reportTag, options),
      altLangTag: this.toAstProperty(
        bitType,
        ConfigKey.property_altLangTag,
        data.altLangTag,
        options,
      ),
      feedbackEngine: this.toAstProperty(
        bitType,
        ConfigKey.property_feedbackEngine,
        data.feedbackEngine,
        options,
      ),
      feedbackType: this.toAstProperty(
        bitType,
        ConfigKey.property_feedbackType,
        data.feedbackType,
        options,
      ),
      disableFeedback: this.toAstProperty(
        bitType,
        ConfigKey.property_disableFeedback,
        data.disableFeedback,
        options,
      ),
      diffTo: this.toAstProperty(bitType, ConfigKey.property_diffTo, data.diffTo, options),
      diffOp: this.toAstProperty(bitType, ConfigKey.property_diffOp, data.diffOp, options),
      diffRef: this.toAstProperty(bitType, ConfigKey.property_diffRef, data.diffRef, options),
      diffContext: this.toAstProperty(
        bitType,
        ConfigKey.property_diffContext,
        data.diffContext,
        options,
      ),
      diffTime: this.toAstProperty(bitType, ConfigKey.property_diffTime, data.diffTime, options),
      path: this.toAstProperty(bitType, ConfigKey.property_path, data.path, options),
      releaseVersion: this.toAstProperty(
        bitType,
        ConfigKey.property_releaseVersion,
        data.releaseVersion,
        options,
      ),
      releaseKind: this.toAstProperty(
        bitType,
        ConfigKey.property_releaseKind,
        data.releaseKind,
        options,
      ),
      releaseDate: this.toAstProperty(
        bitType,
        ConfigKey.property_releaseDate,
        data.releaseDate,
        options,
      ),
      book: this.buildBooks(context, data.book),
      ageRange: this.toAstProperty(bitType, ConfigKey.property_ageRange, data.ageRange, options),
      lang: this.toAstProperty(bitType, ConfigKey.property_lang, data.lang, options),
      language: this.toAstProperty(bitType, ConfigKey.property_language, data.language, options),
      publisher: this.toAstProperty(bitType, ConfigKey.property_publisher, data.publisher, options),
      publisherName: this.toAstProperty(
        bitType,
        ConfigKey.property_publisherName,
        data.publisherName,
        options,
      ),
      theme: this.toAstProperty(bitType, ConfigKey.property_theme, data.theme, options),
      computerLanguage: this.toAstProperty(
        bitType,
        ConfigKey.property_computerLanguage,
        data.computerLanguage,
        options,
      ),
      target: this.toAstProperty(bitType, ConfigKey.property_target, data.target, options),
      slug: this.toAstProperty(bitType, ConfigKey.property_slug, data.slug, options),
      tag: this.toAstProperty(bitType, ConfigKey.property_tag, data.tag, options),
      groupTag: this.buildGroupTags(context, data.groupTag),
      reductionTag: this.toAstProperty(
        bitType,
        ConfigKey.property_reductionTag,
        data.reductionTag,
        options,
      ),
      bubbleTag: this.toAstProperty(bitType, ConfigKey.property_bubbleTag, data.bubbleTag, options),
      levelCEFRp: this.toAstProperty(
        bitType,
        ConfigKey.property_levelCEFRp,
        data.levelCEFRp,
        options,
      ),
      levelCEFR: this.toAstProperty(bitType, ConfigKey.property_levelCEFR, data.levelCEFR, options),
      levelILR: this.toAstProperty(bitType, ConfigKey.property_levelILR, data.levelILR, options),
      levelACTFL: this.toAstProperty(
        bitType,
        ConfigKey.property_levelACTFL,
        data.levelACTFL,
        options,
      ),
      icon: this.toAstProperty(bitType, ConfigKey.property_icon, data.icon, options),
      iconTag: this.toAstProperty(bitType, ConfigKey.property_iconTag, data.iconTag, options),
      colorTag: this.toAstProperty(bitType, ConfigKey.property_colorTag, data.colorTag, options),
      flashcardSet: this.toAstProperty(
        bitType,
        ConfigKey.property_flashcardSet,
        data.flashcardSet,
        options,
      ),
      subtype: this.toAstProperty(bitType, ConfigKey.property_subtype, data.subtype, options),
      bookAlias: this.toAstProperty(bitType, ConfigKey.property_bookAlias, data.bookAlias, options),
      bookDiff: this.toAstProperty(bitType, ConfigKey.property_bookDiff, data.bookDiff, options),
      coverImage: this.toAstProperty(
        bitType,
        ConfigKey.property_coverImage,
        data.coverImage,
        options,
      ),
      coverColor: this.toAstProperty(
        bitType,
        ConfigKey.property_coverColor,
        data.coverColor,
        options,
      ),
      publications: this.toAstProperty(
        bitType,
        ConfigKey.property_publications,
        data.publications,
        options,
      ),
      author: this.toAstProperty(bitType, ConfigKey.property_author, data.author, options),
      subject: this.toAstProperty(bitType, ConfigKey.property_subject, data.subject, options),
      date: this.toAstProperty(bitType, ConfigKey.property_date, data.date, options),
      dateEnd: this.toAstProperty(bitType, ConfigKey.property_dateEnd, data.dateEnd, options),
      location: this.toAstProperty(bitType, ConfigKey.property_location, data.location, options),
      kind: this.toAstProperty(bitType, ConfigKey.property_kind, data.kind, options),
      hasMarkAsDone: this.toAstProperty(
        bitType,
        ConfigKey.property_hasMarkAsDone,
        data.hasMarkAsDone,
        options,
      ),
      processHandIn: this.toAstProperty(
        bitType,
        ConfigKey.property_processHandIn,
        data.processHandIn,
        options,
      ),
      processHandInLocation: this.toAstProperty(
        bitType,
        ConfigKey.property_processHandInLocation,
        data.processHandInLocation,
        options,
      ),
      chatWithBook: this.toAstProperty(
        bitType,
        ConfigKey.property_chatWithBook,
        data.chatWithBook,
        options,
      ),
      chatWithBookBrainKey: this.toAstProperty(
        bitType,
        ConfigKey.property_chatWithBookBrainKey,
        data.chatWithBookBrainKey,
        options,
      ),
      action: this.toAstProperty(bitType, ConfigKey.property_action, data.action, options),
      showInIndex: this.toAstProperty(
        bitType,
        ConfigKey.property_showInIndex,
        data.showInIndex,
        options,
      ),
      refAuthor: this.toAstProperty(bitType, ConfigKey.property_refAuthor, data.refAuthor, options),
      refBookTitle: this.toAstProperty(
        bitType,
        ConfigKey.property_refBookTitle,
        data.refBookTitle,
        options,
      ),
      refPublisher: this.toAstProperty(
        bitType,
        ConfigKey.property_refPublisher,
        data.refPublisher,
        options,
      ),
      refPublicationYear: this.toAstProperty(
        bitType,
        ConfigKey.property_refPublicationYear,
        data.refPublicationYear,
        options,
      ),
      citationStyle: this.toAstProperty(
        bitType,
        ConfigKey.property_citationStyle,
        data.citationStyle,
        options,
      ),
      blockId: this.toAstProperty(bitType, ConfigKey.property_blockId, data.blockId, options),
      pageNo: this.toAstProperty(bitType, ConfigKey.property_pageNo, data.pageNo, options),
      x: this.toAstProperty(bitType, ConfigKey.property_x, data.x, options),
      y: this.toAstProperty(bitType, ConfigKey.property_y, data.y, options),
      width: this.toAstProperty(bitType, ConfigKey.property_width, data.width, options),
      height: this.toAstProperty(bitType, ConfigKey.property_height, data.height, options),
      index: this.toAstProperty(bitType, ConfigKey.property_index, data.index, options),
      classification: this.toAstProperty(
        bitType,
        ConfigKey.property_classification,
        data.classification,
        options,
      ),
      availableClassifications: this.toAstProperty(
        bitType,
        ConfigKey.property_availableClassifications,
        data.availableClassifications,
        options,
      ),
      allowedBit: this.toAstProperty(
        bitType,
        ConfigKey.property_allowedBit,
        data.allowedBit,
        options,
      ),
      tableFixedHeader: this.toAstProperty(
        bitType,
        ConfigKey.property_tableFixedHeader,
        data.tableFixedHeader,
        options,
      ),
      tableHeaderWhitespaceNoWrap: this.toAstProperty(
        bitType,
        ConfigKey.property_tableHeaderWhitespaceNoWrap,
        data.tableHeaderWhitespaceNoWrap,
        options,
      ),
      tableSearch: this.toAstProperty(
        bitType,
        ConfigKey.property_tableSearch,
        data.tableSearch,
        options,
      ),
      tableSort: this.toAstProperty(bitType, ConfigKey.property_tableSort, data.tableSort, options),
      tablePagination: this.toAstProperty(
        bitType,
        ConfigKey.property_tablePagination,
        data.tablePagination,
        options,
      ),
      tablePaginationLimit: this.toAstProperty(
        bitType,
        ConfigKey.property_tablePaginationLimit,
        data.tablePaginationLimit,
        options,
      ),
      tableHeight: this.toAstProperty(
        bitType,
        ConfigKey.property_tableHeight,
        data.tableHeight,
        options,
      ),
      tableWhitespaceNoWrap: this.toAstProperty(
        bitType,
        ConfigKey.property_tableWhitespaceNoWrap,
        data.tableWhitespaceNoWrap,
        options,
      ),
      tableAutoWidth: this.toAstProperty(
        bitType,
        ConfigKey.property_tableAutoWidth,
        data.tableAutoWidth,
        options,
      ),
      tableResizableColumns: this.toAstProperty(
        bitType,
        ConfigKey.property_tableResizableColumns,
        data.tableResizableColumns,
        options,
      ),
      tableColumnMinWidth: this.toAstProperty(
        bitType,
        ConfigKey.property_tableColumnMinWidth,
        data.tableColumnMinWidth,
        options,
      ),
      quizCountItems: this.toAstProperty(
        bitType,
        ConfigKey.property_quizCountItems,
        data.quizCountItems,
        options,
      ),
      quizStrikethroughSolutions: this.toAstProperty(
        bitType,
        ConfigKey.property_quizStrikethroughSolutions,
        data.quizStrikethroughSolutions,
        options,
      ),
      codeLineNumbers: this.toAstProperty(
        bitType,
        ConfigKey.property_codeLineNumbers,
        data.codeLineNumbers,
        options,
      ),
      codeMinimap: this.toAstProperty(
        bitType,
        ConfigKey.property_codeMinimap,
        data.codeMinimap,
        options,
      ),
      stripePricingTableId: this.toAstProperty(
        bitType,
        ConfigKey.property_stripePricingTableId,
        data.stripePricingTableId,
        options,
      ),
      stripePublishableKey: this.toAstProperty(
        bitType,
        ConfigKey.property_stripePublishableKey,
        data.stripePublishableKey,
        options,
      ),
      thumbImage: this.toAstProperty(
        bitType,
        ConfigKey.property_thumbImage,
        data.thumbImage,
        options,
      ),
      scormSource: this.toAstProperty(
        bitType,
        ConfigKey.property_scormSource,
        data.scormSource,
        options,
      ),
      posterImage: this.toAstProperty(
        bitType,
        ConfigKey.property_posterImage,
        data.posterImage,
        options,
      ),
      focusX: this.toAstProperty(bitType, ConfigKey.property_focusX, data.focusX, options),
      focusY: this.toAstProperty(bitType, ConfigKey.property_focusY, data.focusY, options),
      pointerLeft: this.toAstProperty(
        bitType,
        ConfigKey.property_pointerLeft,
        data.pointerLeft,
        options,
      ),
      pointerTop: this.toAstProperty(
        bitType,
        ConfigKey.property_pointerTop,
        data.pointerTop,
        options,
      ),
      listItemIndent: this.toAstProperty(
        bitType,
        ConfigKey.property_listItemIndent,
        data.listItemIndent,
        options,
      ),
      backgroundWallpaper: this.toImageResource(context, data.backgroundWallpaper),
      hasBookNavigation: this.toAstProperty(
        bitType,
        ConfigKey.property_hasBookNavigation,
        data.hasBookNavigation,
        options,
      ),
      duration: this.toAstProperty(bitType, ConfigKey.property_duration, data.duration, options),
      deeplink: this.toAstProperty(bitType, ConfigKey.property_deeplink, data.deeplink, options),
      externalLink: this.toAstProperty(
        bitType,
        ConfigKey.property_externalLink,
        data.externalLink,
        options,
      ),
      externalLinkText: this.toAstProperty(
        bitType,
        ConfigKey.property_externalLinkText,
        data.externalLinkText,
        options,
      ),
      videoCallLink: this.toAstProperty(
        bitType,
        ConfigKey.property_videoCallLink,
        data.videoCallLink,
        options,
      ),
      vendorDashboardId: this.toAstProperty(
        bitType,
        ConfigKey.property_vendorDashboardId,
        data.vendorDashboardId,
        options,
      ),
      vendorSurveyId: this.toAstProperty(
        bitType,
        ConfigKey.property_vendorSurveyId,
        data.vendorSurveyId,
        options,
      ),
      vendorUrl: this.toAstProperty(bitType, ConfigKey.property_vendorUrl, data.vendorUrl, options),
      search: this.toAstProperty(bitType, ConfigKey.property_search, data.search, options),
      list: this.toAstProperty(bitType, ConfigKey.property_list, data.list, options),
      layer: this.toAstProperty(bitType, ConfigKey.property_layer, data.layer, options),
      layerRole: this.toAstProperty(bitType, ConfigKey.property_layerRole, data.layerRole, options),
      textReference: this.toAstProperty(
        bitType,
        ConfigKey.property_textReference,
        data.textReference,
        options,
      ),
      isTracked: this.toAstProperty(bitType, ConfigKey.property_isTracked, data.isTracked, options),
      isInfoOnly: this.toAstProperty(
        bitType,
        ConfigKey.property_isInfoOnly,
        data.isInfoOnly,
        options,
      ),
      imageFirst: this.toAstProperty(
        bitType,
        ConfigKey.property_imageFirst,
        data.imageFirst,
        options,
      ),
      activityType: this.toAstProperty(
        bitType,
        ConfigKey.property_activityType,
        data.activityType,
        options,
      ),
      labelTrue: this.toAstProperty(bitType, ConfigKey.property_labelTrue, data.labelTrue, options),
      labelFalse: this.toAstProperty(
        bitType,
        ConfigKey.property_labelFalse,
        data.labelFalse,
        options,
      ),
      content2Buy: this.toAstProperty(
        bitType,
        ConfigKey.property_content2Buy,
        data.content2Buy,
        options,
      ),
      mailingList: this.toAstProperty(
        bitType,
        ConfigKey.property_mailingList,
        data.mailingList,
        options,
      ),
      buttonCaption: this.toAstProperty(
        bitType,
        ConfigKey.property_buttonCaption,
        data.buttonCaption,
        options,
      ),
      callToActionUrl: this.toAstProperty(
        bitType,
        ConfigKey.property_callToActionUrl,
        data.callToActionUrl,
        options,
      ),
      caption: this.handleJsonText(context, TextLocation.tag, data.caption),
      quotedPerson: this.toAstProperty(
        bitType,
        ConfigKey.property_quotedPerson,
        data.quotedPerson,
        options,
      ),
      reasonableNumOfChars: reasonableNumOfCharsProperty,
      resolved: this.toAstProperty(bitType, ConfigKey.property_resolved, data.resolved, options),
      resolvedDate: this.toAstProperty(
        bitType,
        ConfigKey.property_resolvedDate,
        data.resolvedDate,
        options,
      ),
      resolvedBy: this.toAstProperty(
        bitType,
        ConfigKey.property_resolvedBy,
        data.resolvedBy,
        options,
      ),
      handInAcceptFileType: this.toAstProperty(
        bitType,
        ConfigKey.property_handInAcceptFileType,
        data.handInAcceptFileType,
        options,
      ),
      handInRequirement: this.toAstProperty(
        bitType,
        ConfigKey.property_handInRequirement,
        data.handInRequirement,
        options,
      ),
      handInInstruction: this.toAstProperty(
        bitType,
        ConfigKey.property_handInInstruction,
        data.handInInstruction,
        options,
      ),
      maxCreatedBits: this.toAstProperty(
        bitType,
        ConfigKey.property_maxCreatedBits,
        data.maxCreatedBits,
        options,
      ),
      maxDisplayLevel: this.toAstProperty(
        bitType,
        ConfigKey.property_maxDisplayLevel,
        data.maxDisplayLevel,
        options,
      ),
      maxTocChapterLevel: this.toAstProperty(
        bitType,
        ConfigKey.property_maxTocChapterLevel,
        data.maxTocChapterLevel,
        options,
      ),
      tocResource: this.toAstProperty(
        bitType,
        ConfigKey.property_tocResource,
        data.tocResource,
        options,
      ),
      tocContent: this.toAstProperty(
        bitType,
        ConfigKey.property_tocContent,
        data.tocContent,
        options,
      ),
      page: this.toAstProperty(bitType, ConfigKey.property_page, data.page, options),
      productId: this.toAstProperty(bitType, ConfigKey.property_productId, data.productId, options),
      product: this.toAstProperty(bitType, ConfigKey.property_product, data.product, options),
      // productList: this.toAstProperty(
      //   bitType,
      //   ConfigKey.property_productList,
      //   data.productList,
      //   options,
      // ),
      productVideo: this.toAstProperty(
        bitType,
        ConfigKey.property_productVideo,
        data.productVideo,
        options,
      ),
      // productVideoList: this.toAstProperty(
      //   bitType,
      //   ConfigKey.property_productVideoList,
      //   data.productVideoList,
      //   options,
      // ),
      productFolder: this.toAstProperty(
        bitType,
        ConfigKey.property_productFolder,
        data.productFolder,
        options,
      ),
      technicalTerm: this.buildTechnicalTerm(context, data.technicalTerm),
      servings: this.buildServings(context, data.servings),
      ratingLevelStart: this.buildRatingLevelStartEnd(context, data.ratingLevelStart),
      ratingLevelEnd: this.buildRatingLevelStartEnd(context, data.ratingLevelEnd),
      ratingLevelSelected: this.toAstProperty(
        bitType,
        ConfigKey.property_ratingLevelSelected,
        data.ratingLevelSelected,
        options,
      ),
      markConfig: this.buildMarkConfigs(context, data.markConfig),
      imageSource: this.buildImageSource(context, data.imageSource),
      person: this.buildPerson(context, data.person),
      bot: this.toAstProperty(bitType, ConfigKey.property_bot, data.bot, options),
      referenceProperty: this.toAstProperty(
        bitType,
        ConfigKey.property_reference,
        data.referenceProperty,
        options,
      ),

      // Book data
      title: this.handleJsonText(context, TextLocation.tag, data.title),
      subtitle: this.handleJsonText(context, TextLocation.tag, data.subtitle),
      level: NumberUtils.asNumber(data.level),
      toc: this.toAstProperty(bitType, ConfigKey.property_toc, data.toc, options),
      progress: this.toAstProperty(bitType, ConfigKey.property_progress, data.progress, options),
      anchor: data.anchor,
      reference: data.reference,
      referenceEnd: data.referenceEnd,
      revealSolutions: this.toAstProperty(
        bitType,
        ConfigKey.property_revealSolutions,
        data.revealSolutions,
        options,
      ),

      // Item, Lead, Hint, Instruction
      item: this.handleJsonText(context, TextLocation.tag, data.item),
      lead: this.handleJsonText(context, TextLocation.tag, data.lead),
      pageNumber: this.handleJsonText(context, TextLocation.tag, data.pageNumber),
      marginNumber: this.handleJsonText(context, TextLocation.tag, data.marginNumber),
      hint: this.handleJsonText(context, TextLocation.tag, data.hint),
      instruction: this.handleJsonText(context, TextLocation.tag, data.instruction),

      partialAnswer: this.toAstProperty(
        bitType,
        ConfigKey.property_partialAnswer,
        data.partialAnswer,
        options,
      ),
      sampleSolution: this.toAstProperty(
        bitType,
        ConfigKey.property_sampleSolution,
        data.sampleSolution,
        options,
      ),
      additionalSolutions: this.toAstProperty(
        bitType,
        ConfigKey.property_additionalSolutions,
        data.additionalSolutions,
        options,
      ),

      // Example
      ...this.toExample(data.__isDefaultExample, data.example as TextAst),

      // Person

      imagePlaceholder: this.toImageResource(context, data.imagePlaceholder),
      resources: ArrayUtils.asArray(
        this.resourceBuilder.resourceFromResourceJson(context, data.resources),
      ),

      // Body, Card, Footer, must be after all other properties except the extraProperties and markup / parser
      body: this.buildBody(context, data.body),
      cardNode,
      footer: this.buildFooter(context, data.footer),

      // Must be after other properties/tags in the AST so key clashes are avoided correctly
      extraProperties: this.parseExtraProperties(data.extraProperties),

      markup: data.markup,
      parser: data.parser,

      // Private properties
      __isDefaultExample: data.__isDefaultExample ?? false,
    };

    // Push reasonableNumOfChars down the tree for the interview bits
    if (Config.isOfBitType(node.bitType, BitType.interview)) {
      this.pushDownTree(
        context,
        undefined,
        undefined,
        cardNode,
        'questions',
        'reasonableNumOfChars',
        data.reasonableNumOfChars,
      );
    }

    // Push reasonableNumOfChars down the tree for the feedback bits
    if (Config.isOfBitType(node.bitType, BitType.feedback)) {
      this.pushDownTree(
        context,
        undefined,
        undefined,
        cardNode,
        ['feedbacks', 'reason'],
        'reasonableNumOfChars',
        data.reasonableNumOfChars,
      );
    }

    // Push isCaseSensitive down the tree for the cloze, match and match-matrix bits
    this.pushDownTree(
      context,
      [node.body, ...(cardNode?.cardBits?.map((cardBit) => cardBit.body) || [])],
      [BodyBitType.gap],
      undefined,
      undefined, //'isCaseSensitive',
      'isCaseSensitive',
      data.isCaseSensitive ?? true,
    );

    this.pushDownTree(
      context,
      undefined,
      undefined,
      cardNode,
      'pairs',
      'isCaseSensitive',
      data.isCaseSensitive ?? true,
    );
    this.pushDownTree(
      context,
      undefined,
      undefined,
      cardNode,
      ['matrix', 'cells'],
      'isCaseSensitive',
      data.isCaseSensitive ?? true,
    );

    // If __isDefaultExample is set at the bit level, push the default example down the tree to the relevant nodes
    this.pushExampleDownTree(
      context,
      node.body,
      cardNode,
      node.__isDefaultExample,
      convertedExample.example,
    );

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
  protected buildBooks(
    context: BuildContext,
    data: Partial<BookJson>[] | string | undefined,
  ): BookJson[] | string | undefined {
    if (StringUtils.isString(data)) return data as string;
    if (!Array.isArray(data)) return undefined;
    const nodes = data.map((d) => this.buildBook(context, d)).filter((d) => d != null);
    return nodes.length > 0 ? nodes : undefined;
  }

  /**
   * Build choice node
   *
   * @param data - data for the node
   * @returns
   */
  protected buildBook(
    _context: BuildContext,
    data: Partial<BookJson> | undefined,
  ): BookJson | undefined {
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
   * Build groupTag[] node
   *
   * @param data - data for the node
   * @returns
   */
  protected buildGroupTags(
    context: BuildContext,
    data: Partial<GroupTagJson> | Partial<GroupTagJson>[] | undefined,
  ): GroupTagJson[] | undefined {
    if (!data) return undefined;
    if (!Array.isArray(data)) data = [data];
    let nodes = data.map((d) => this.buildGroupTag(context, d)).filter((d) => d != null);

    // Combine tags with the same name, filtering out duplicate tags
    const combinedNodes: Record<string, GroupTagJson> = {};
    for (const node of nodes) {
      if (!node) continue;
      if (!combinedNodes[node.name]) {
        combinedNodes[node.name] = node;
      } else {
        combinedNodes[node.name].tags = ArrayUtils.removeDuplicates([
          ...combinedNodes[node.name].tags,
          ...node.tags,
        ]);
      }
    }

    nodes = Object.values(combinedNodes);

    return nodes.length > 0 ? nodes : undefined;
  }

  /**
   * Build groupTag node
   *
   * @param data - data for the node
   * @returns
   */
  protected buildGroupTag(
    _context: BuildContext,
    data: Partial<GroupTagJson> | undefined,
  ): GroupTagJson | undefined {
    if (!data) return undefined;

    const tags: string[] = Array.isArray(data.tags) ? data.tags : [];

    // NOTE: Node order is important and is defined here
    const node: GroupTagJson = {
      name: data.name ?? '',
      tags: tags.map((tag) => tag?.trim() ?? '') ?? [],
    };

    // Remove Unset Optionals
    // ObjectUtils.removeUnwantedProperties(node, {
    //   ignoreAllFalse: true,
    //   ignoreEmptyString: ['book', 'reference'],
    // });

    return node;
  }

  /**
   * Build feedbackChoices[] node
   *
   * @param data - data for the node
   * @returns
   */
  protected buildFeedbackChoices(
    context: BuildContext,
    data: Partial<FeedbackChoiceJson>[] | undefined,
  ): FeedbackChoiceJson[] | undefined {
    if (!Array.isArray(data)) return undefined;
    const nodes = data.map((d) => this.buildFeedbackChoice(context, d)).filter((d) => d != null);
    return nodes.length > 0 ? nodes : undefined;
  }

  /**
   * Build feedbackChoice node
   *
   * @param data - data for the node
   * @returns
   */
  protected buildFeedbackChoice(
    context: BuildContext,
    data: Partial<FeedbackChoiceJson> | undefined,
  ): FeedbackChoiceJson | undefined {
    if (!data) return undefined;

    // NOTE: Node order is important and is defined here
    const node: FeedbackChoiceJson = {
      choice: data.choice ?? '',
      requireReason: !!data.requireReason,
      item: this.handleJsonText(context, TextLocation.tag, data.item),
      lead: this.handleJsonText(context, TextLocation.tag, data.lead),
      hint: this.handleJsonText(context, TextLocation.tag, data.hint),
      instruction: this.handleJsonText(context, TextLocation.tag, data.instruction),
      ...this.toExample(data.__isDefaultExample, data.example, true),
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
   * Build feedbackReason node
   *
   * @param data - data for the node
   * @returns
   */
  protected buildFeedbackReason(
    context: BuildContext,
    data: Partial<FeedbackReasonJson> | undefined,
  ): FeedbackReasonJson | undefined {
    if (!data) return undefined;

    // Set default example
    // Not __testAst - there is no default example
    const defaultExample = this.handleJsonText(context, TextLocation.tag, 'true');

    // NOTE: Node order is important and is defined here
    const node: FeedbackReasonJson = {
      text: data.text ?? '',
      reasonableNumOfChars: (data.reasonableNumOfChars ?? undefined) as number,
      item: this.handleJsonText(context, TextLocation.tag, data.item),
      lead: this.handleJsonText(context, TextLocation.tag, data.lead),
      hint: this.handleJsonText(context, TextLocation.tag, data.hint),
      instruction: this.handleJsonText(context, TextLocation.tag, data.instruction),
      ...this.toExample(data.__isDefaultExample, data.example, defaultExample),
      __textAst: data.__textAst,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
      ignoreEmptyArrays: ['item', 'hint', 'instruction'],
      ignoreUndefined: ['example', 'reasonableNumOfChars'],
    });

    return node;
  }

  /**
   * Build choice[] node
   *
   * @param data - data for the node
   * @returns
   */
  protected buildChoices(
    context: BuildContext,
    data: Partial<ChoiceJson>[] | undefined,
  ): ChoiceJson[] | undefined {
    if (!Array.isArray(data)) return undefined;
    const nodes = data.map((d) => this.buildChoice(context, d)).filter((d) => d != null);
    return nodes.length > 0 ? nodes : undefined;
  }

  /**
   * Build choice node
   *
   * @param data - data for the node
   * @returns
   */
  protected buildChoice(
    context: BuildContext,
    data: Partial<ChoiceJson> | undefined,
  ): ChoiceJson | undefined {
    if (!data) return undefined;

    // NOTE: Node order is important and is defined here
    const node: ChoiceJson = {
      choice: data.choice ?? '',
      isCorrect: !!data.isCorrect,
      item: this.handleJsonText(context, TextLocation.tag, data.item),
      lead: this.handleJsonText(context, TextLocation.tag, data.lead),
      hint: this.handleJsonText(context, TextLocation.tag, data.hint),
      instruction: this.handleJsonText(context, TextLocation.tag, data.instruction),
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
  protected buildResponses(
    context: BuildContext,
    data: Partial<ResponseJson>[] | undefined,
  ): ResponseJson[] | undefined {
    if (!Array.isArray(data)) return undefined;
    const nodes = data.map((d) => this.buildResponse(context, d)).filter((d) => d != null);
    return nodes.length > 0 ? nodes : undefined;
  }

  /**
   * Build response node
   *
   * @param data - data for the node
   * @returns
   */
  protected buildResponse(
    context: BuildContext,
    data: Partial<ResponseJson> | undefined,
  ): ResponseJson | undefined {
    if (!data) return undefined;

    // NOTE: Node order is important and is defined here
    const node: ResponseJson = {
      response: data.response ?? '',
      isCorrect: !!data.isCorrect,
      item: this.handleJsonText(context, TextLocation.tag, data.item),
      lead: this.handleJsonText(context, TextLocation.tag, data.lead),
      hint: this.handleJsonText(context, TextLocation.tag, data.hint),
      instruction: this.handleJsonText(context, TextLocation.tag, data.instruction),
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
  protected buildBotResponses(
    context: BuildContext,
    data: Partial<BotResponseJson>[] | undefined,
  ): BotResponseJson[] | undefined {
    if (!Array.isArray(data)) return undefined;
    const nodes = data.map((d) => this.botResponse(context, d)).filter((d) => d != null);
    return nodes.length > 0 ? nodes : undefined;
  }

  /**
   * Build bot response node
   *
   * @param data - data for the node
   * @returns
   */
  protected botResponse(
    context: BuildContext,
    data: Partial<BotResponseJson> | undefined,
  ): BotResponseJson | undefined {
    if (!data) return undefined;

    // NOTE: Node order is important and is defined here
    const node: BotResponseJson = {
      response: data.response ?? '',
      reaction: data.reaction ?? '',
      feedback: data.feedback ?? '',
      item: this.handleJsonText(context, TextLocation.tag, data.item),
      lead: this.handleJsonText(context, TextLocation.tag, data.lead),
      hint: this.handleJsonText(context, TextLocation.tag, data.hint),
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
   * Build feedbacks[] node
   *
   * @param data - data for the node
   * @returns
   */
  protected buildFeedbacks(
    context: BuildContext,
    data: Partial<FeedbackJson>[] | undefined,
  ): FeedbackJson[] | undefined {
    if (!Array.isArray(data)) return undefined;
    const nodes = data.map((d) => this.buildFeedback(context, d)).filter((d) => d != null);
    return nodes.length > 0 ? nodes : undefined;
  }

  /**
   * Build feedback node
   *
   * @param data - data for the node
   * @returns
   */
  protected buildFeedback(
    context: BuildContext,
    data: Partial<FeedbackJson> | undefined,
  ): FeedbackJson | undefined {
    if (!data) return undefined;

    let choices: FeedbackChoiceJson[] | undefined;
    let reason: FeedbackReasonJson | undefined;

    if (data.choices) {
      choices = this.buildFeedbackChoices(context, data.choices);

      // Push __isDefaultExample down the tree
      // this.pushExampleDownTreeBoolean(context, data.__isDefaultExample, convertedExample.example, true, choices);
    } else {
      // No choices, not a valid feedback
      return undefined;
    }

    if (data.reason) {
      reason = this.buildFeedbackReason(context, data.reason);
    }

    // NOTE: Node order is important and is defined here
    const node: FeedbackJson = {
      item: this.handleJsonText(context, TextLocation.tag, data.item),
      lead: this.handleJsonText(context, TextLocation.tag, data.lead),
      hint: this.handleJsonText(context, TextLocation.tag, data.hint),
      instruction: this.handleJsonText(context, TextLocation.tag, data.instruction),
      // isExample: !!data.__defaultExample,
      choices: choices as FeedbackChoiceJson[],
      reason: reason as FeedbackReasonJson, // Might be undefined
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
      ignoreEmptyArrays: ['item', 'hint', 'instruction'],
    });

    return node;
  }

  /**
   * Build quizzes[] node
   *
   * @param data - data for the node
   * @returns
   */
  protected buildQuizzes(
    context: BuildContext,
    data: Partial<QuizJson>[] | undefined,
  ): QuizJson[] | undefined {
    if (!Array.isArray(data)) return undefined;
    const nodes = data.map((d) => this.buildQuiz(context, d)).filter((d) => d != null);
    return nodes.length > 0 ? nodes : undefined;
  }

  /**
   * Build quiz node
   *
   * @param data - data for the node
   * @returns
   */
  protected buildQuiz(
    context: BuildContext,
    data: Partial<QuizJson> | undefined,
  ): QuizJson | undefined {
    if (!data) return undefined;

    const convertedExample = {
      ...this.toExample(data.__isDefaultExample, data.__defaultExample),
    };

    let choices: ChoiceJson[] | undefined;
    let responses: ResponseJson[] | undefined;

    if (data.choices) {
      choices = this.buildChoices(context, data.choices);

      // Push __isDefaultExample down the tree
      this.pushExampleDownTreeBoolean(
        context,
        data.__isDefaultExample,
        convertedExample.example,
        true,
        choices,
      );
    } else if (data.responses) {
      responses = this.buildResponses(context, data.responses);

      // Push __isDefaultExample down the tree
      this.pushExampleDownTreeBoolean(
        context,
        data.__isDefaultExample,
        convertedExample.example,
        false,
        responses,
      );
    } else {
      // No choices or responses, not a valid quiz
      return undefined;
    }

    // NOTE: Node order is important and is defined here
    const node: QuizJson = {
      item: this.handleJsonText(context, TextLocation.tag, data.item),
      lead: this.handleJsonText(context, TextLocation.tag, data.lead),
      hint: this.handleJsonText(context, TextLocation.tag, data.hint),
      instruction: this.handleJsonText(context, TextLocation.tag, data.instruction),
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
  protected buildHeading(
    _context: BuildContext,
    data: Partial<HeadingJson> | undefined,
  ): HeadingJson | undefined {
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
  protected buildPairs(
    context: BuildContext,
    data: Partial<PairJson>[] | undefined,
  ): PairJson[] | undefined {
    if (!Array.isArray(data)) return undefined;
    const nodes = data.map((d) => this.buildPair(context, d)).filter((d) => d != null);
    return nodes.length > 0 ? nodes : undefined;
  }

  /**
   * Build pair node
   *
   * @param data - data for the node
   * @returns
   */
  protected buildPair(
    context: BuildContext,
    data: Partial<PairJson> | undefined,
  ): PairJson | undefined {
    if (!data) return undefined;

    // Set default example
    const defaultExample =
      Array.isArray(data.__valuesAst) && data.__valuesAst.length > 0 ? data.__valuesAst[0] : null;

    // Process the keyAudio and keyImage resources
    const keyAudio = this.resourceBuilder.resourceFromResourceJson(
      context,
      data.keyAudio,
    ) as AudioResourceWrapperJson;
    const keyImage = this.resourceBuilder.resourceFromResourceJson(
      context,
      data.keyImage,
    ) as ImageResourceWrapperJson;

    // NOTE: Node order is important and is defined here
    const node: PairJson = {
      key: data.key ?? '',
      keyAudio,
      keyImage,
      item: this.handleJsonText(context, TextLocation.tag, data.item),
      lead: this.handleJsonText(context, TextLocation.tag, data.lead),
      hint: this.handleJsonText(context, TextLocation.tag, data.hint),
      instruction: this.handleJsonText(context, TextLocation.tag, data.instruction),
      isCaseSensitive: data.isCaseSensitive as boolean,
      ...this.toExample(data.__isDefaultExample, data.example, defaultExample),
      values: data.values || [],
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
  protected buildMatricies(
    context: BuildContext,
    data: Partial<MatrixJson>[] | undefined,
  ): MatrixJson[] | undefined {
    if (!Array.isArray(data)) return undefined;
    const nodes = data.map((d) => this.buildMatrix(context, d)).filter((d) => d != null);
    return nodes.length > 0 ? nodes : undefined;
  }

  /**
   * Build matrix node
   *
   * @param data - data for the node
   * @returns
   */
  protected buildMatrix(
    context: BuildContext,
    data: Partial<MatrixJson> | undefined,
  ): MatrixJson | undefined {
    if (!data) return undefined;

    // const convertedExample = {
    //   ...this.toExample(__isDefaultExample, example),
    // };

    // // Push __isDefaultExample down the tree
    // this.pushExampleDownTreeBoolean(__isDefaultExample, convertedExample.example, true, choices);
    // this.pushExampleDownTreeBoolean(__isDefaultExample, convertedExample.example, false, responses);

    let isExample = false;

    // Set isExample for matrix based on isExample for cells
    for (const c of data.cells || []) {
      if (data.__isDefaultExample && !c.isExample) {
        c.isExample = true;
      }
      isExample = c.isExample ? true : isExample;
    }

    // NOTE: Node order is important and is defined here
    const node: MatrixJson = {
      key: data.key ?? '',
      item: this.handleJsonText(context, TextLocation.tag, data.item),
      lead: this.handleJsonText(context, TextLocation.tag, data.lead),
      hint: this.handleJsonText(context, TextLocation.tag, data.hint),
      instruction: this.handleJsonText(context, TextLocation.tag, data.instruction),
      isExample,
      cells: (data.cells || [])
        .map((c) => this.buildMatrixCell(context, c))
        .filter((c) => c != null),
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
  protected buildMatrixCell(
    context: BuildContext,
    data: Partial<MatrixCellJson> | undefined,
  ): MatrixCellJson | undefined {
    if (!data) return undefined;

    // Set default example
    const defaultExample =
      Array.isArray(data.__valuesAst) && data.__valuesAst.length > 0 ? data.__valuesAst[0] : null;

    // NOTE: Node order is important and is defined here
    const node: MatrixCellJson = {
      values: data.values || [],
      item: this.handleJsonText(context, TextLocation.tag, data.item),
      lead: this.handleJsonText(context, TextLocation.tag, data.lead),
      hint: this.handleJsonText(context, TextLocation.tag, data.hint),
      instruction: this.handleJsonText(context, TextLocation.tag, data.instruction),
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
    context: BuildContext,
    dataIn: Partial<PronunciationTableJson> | undefined,
  ): PronunciationTableJson | undefined {
    if (!dataIn) return undefined;

    // NOTE: Node order is important and is defined here
    const node: PronunciationTableJson = {
      data: (dataIn.data || []).map((row) =>
        (row || []).map((cell) => {
          // Process the audio resource
          const audio = this.resourceBuilder.resourceFromResourceJson(
            context,
            cell.audio,
          ) as AudioResourceWrapperJson;

          return {
            title: this.handleJsonText(context, TextLocation.tag, cell.title),
            body: this.handleJsonText(context, TextLocation.tag, cell.body),
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
  protected buildTable(
    context: BuildContext,
    dataIn: Partial<TableJson> | undefined,
  ): TableJson | undefined {
    if (!dataIn) return undefined;

    // NOTE: Node order is important and is defined here
    const node: TableJson = {
      columns: (dataIn.columns || []).map((col) =>
        this.handleJsonText(context, TextLocation.tag, col),
      ),
      data: (dataIn.data || []).map((row) =>
        (row || []).map((cell) => this.handleJsonText(context, TextLocation.tag, cell)),
      ),
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
    context: BuildContext,
    data: Partial<QuestionJson>[] | undefined,
  ): QuestionJson[] | undefined {
    if (!Array.isArray(data)) return undefined;
    const nodes = data.map((d) => this.buildQuestion(context, d)).filter((d) => d != null);
    return nodes.length > 0 ? nodes : undefined;
  }

  /**
   * Build question node
   *
   * @param data - data for the node
   * @returns
   */
  protected buildQuestion(
    context: BuildContext,
    data: Partial<QuestionJson> | undefined,
  ): QuestionJson | undefined {
    if (!data) return undefined;

    // Set default example
    const defaultExample = data.__sampleSolutionAst;

    // NOTE: Node order is important and is defined here
    const node: QuestionJson = {
      question: data.question ?? '',
      partialAnswer: data.partialAnswer ?? '',
      sampleSolution: data.sampleSolution ?? '',
      additionalSolutions: (data.additionalSolutions ?? undefined) as string[],
      reasonableNumOfChars: (data.reasonableNumOfChars ?? undefined) as number,
      item: this.handleJsonText(context, TextLocation.tag, data.item),
      lead: this.handleJsonText(context, TextLocation.tag, data.lead),
      hint: this.handleJsonText(context, TextLocation.tag, data.hint),
      instruction: this.handleJsonText(context, TextLocation.tag, data.instruction),
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
  protected buildIngredients(
    context: BuildContext,
    data: Partial<IngredientJson>[] | undefined,
  ): IngredientJson[] | undefined {
    if (!Array.isArray(data)) return undefined;
    const nodes = data.map((d) => this.buildIngredient(context, d)).filter((d) => d != null);
    return nodes.length > 0 ? nodes : undefined;
  }

  /**
   * Build ingredient node
   *
   * @param data - data for the node
   * @returns
   */
  protected buildIngredient(
    context: BuildContext,
    data: Partial<IngredientJson> | undefined,
  ): IngredientJson | undefined {
    if (!data) return undefined;

    // NOTE: Node order is important and is defined here
    const node: IngredientJson = {
      title: this.handleJsonText(context, TextLocation.tag, data.title),
      checked: data.checked ?? false,
      ingredient: this.handleJsonText(context, TextLocation.tag, data.ingredient),
      quantity: data.quantity ?? 0,
      unit: data.unit ?? '',
      unitAbbr: data.unitAbbr ?? '',
      decimalPlaces: data.decimalPlaces ?? 1,
      disableCalculation: data.disableCalculation ?? false,
      item: this.handleJsonText(context, TextLocation.tag, data.item),
      lead: this.handleJsonText(context, TextLocation.tag, data.lead),
      hint: this.handleJsonText(context, TextLocation.tag, data.hint),
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
  protected buildBody(context: BuildContext, data: Partial<Body> | undefined): Body | undefined {
    if (!data) return undefined;
    let body: JsonText | unknown | undefined;
    const bodyBits: BodyBitJson[] = [];
    const placeholders = data.placeholders;
    const bodyString = data.bodyString;
    const { textFormat } = context;

    // Handle JSON type body
    const handleJsonBody = () => {
      // Attempt to parse a string body as JSON to support the legacy format
      if (typeof data.body === 'string') {
        try {
          body = JSON.parse(data.body);
        } catch (_e) {
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
        // Body is a string (legacy bitmark v2, or not bitmarkText)
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
        // Bug #7141: Use textFormat for textParser, not always bitmarkText if it is a v2 string body
        // However, only use plain text breakscaping the text from the v2 JSON body

        // Special v2 Breakscaping
        bodyStr = Breakscape.breakscape(bodyStr, {
          format: textFormat,
          location: TextLocation.body,
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
          format: textFormat,
          location: TextLocation.body,
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
            parsedBit = this.buildGap(context, bodyBit as GapJson);
            break;
          case BodyBitType.mark:
            parsedBit = this.buildMark(context, bodyBit as MarkJson);
            break;
          case BodyBitType.select:
            parsedBit = this.buildSelect(context, bodyBit as SelectJson);
            break;
          case BodyBitType.highlight:
            parsedBit = this.buildHighlight(context, bodyBit as HighlightJson);
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

    const isBitmarkText = textFormat === TextFormat.bitmarkText;
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
  protected buildFooter(
    context: BuildContext,
    data: Partial<Footer> | undefined,
  ): Footer | undefined {
    if (!data) return undefined;
    const node: Footer = {
      footer: this.handleJsonText(context, TextLocation.body, data.footer),
    };

    return node;
  }

  /**
   * Build gap node
   *
   * @param data - data for the node
   * @returns
   */
  protected buildGap(
    context: BuildContext,
    data: Partial<GapJson> | undefined,
  ): GapJson | undefined {
    if (!data) return undefined;

    // Set default example
    const defaultExample =
      Array.isArray(data.__solutionsAst) && data.__solutionsAst.length > 0
        ? data.__solutionsAst[0]
        : null;

    // Copy any attributes from 'attrs' to the body bit (data is in 'attrs' when coming from JSON)
    data = this.bodyBitCopyFromAttrs(data);

    // NOTE: Node order is important and is defined here
    const node: GapJson = {
      type: BodyBitType.gap,
      solutions: data.solutions || [], // Must be before other properties except type
      item: this.handleJsonText(context, TextLocation.tag, data.item),
      lead: this.handleJsonText(context, TextLocation.tag, data.lead),
      hint: this.handleJsonText(context, TextLocation.tag, data.hint),
      instruction: this.handleJsonText(context, TextLocation.tag, data.instruction),
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
  protected buildMarkConfigs(
    context: BuildContext,
    data: Partial<MarkConfigJson>[] | undefined,
  ): MarkConfigJson[] | undefined {
    if (!Array.isArray(data)) return undefined;
    const nodes = data.map((d) => this.buildMarkConfig(context, d)).filter((d) => d != null);
    return nodes.length > 0 ? nodes : undefined;
  }

  /**
   * Build mark config node
   *
   * @param data - data for the node
   * @returns
   */
  protected buildMarkConfig(
    _context: BuildContext,
    data: Partial<MarkConfigJson> | undefined,
  ): MarkConfigJson | undefined {
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
  protected buildMark(
    context: BuildContext,
    data: Partial<MarkJson> | undefined,
  ): MarkJson | undefined {
    if (!data) return undefined;

    // Copy any attributes from 'attrs' to the body bit (data is in 'attrs' when coming from JSON)
    data = this.bodyBitCopyFromAttrs(data);

    // NOTE: Node order is important and is defined here
    const node: MarkJson = {
      type: BodyBitType.mark,
      solution: data.solution ?? '', // Must be before other properties except type
      mark: data.mark ?? '',
      item: this.handleJsonText(context, TextLocation.tag, data.item),
      lead: this.handleJsonText(context, TextLocation.tag, data.lead),
      hint: this.handleJsonText(context, TextLocation.tag, data.hint),
      instruction: this.handleJsonText(context, TextLocation.tag, data.instruction),
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
  protected buildSelect(
    context: BuildContext,
    data: Partial<SelectJson> | undefined,
  ): SelectJson | undefined {
    if (!data) return undefined;

    // Copy any attributes from 'attrs' to the body bit (data is in 'attrs' when coming from JSON)
    data = this.bodyBitCopyFromAttrs(data);

    // NOTE: Node order is important and is defined here
    const node: SelectJson = {
      type: BodyBitType.select,
      options: this.buildSelectOptions(context, data.options) || [], // Must be before other properties except type
      prefix: data.prefix ?? '',
      postfix: data.postfix ?? '',
      item: this.handleJsonText(context, TextLocation.tag, data.item),
      lead: this.handleJsonText(context, TextLocation.tag, data.lead),
      hint: this.handleJsonText(context, TextLocation.tag, data.hint),
      instruction: this.handleJsonText(context, TextLocation.tag, data.instruction),
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
  protected buildSelectOptions(
    context: BuildContext,
    data: Partial<SelectOptionJson>[] | undefined,
  ): SelectOptionJson[] | undefined {
    if (!Array.isArray(data)) return undefined;
    const nodes = data.map((d) => this.buildSelectOption(context, d)).filter((d) => d != null);
    return nodes.length > 0 ? nodes : undefined;
  }

  /**
   * Build selectOption node
   *
   * @param data - data for the node
   * @returns
   */
  protected buildSelectOption(
    context: BuildContext,
    data: Partial<SelectOptionJson> | undefined,
  ): SelectOptionJson | undefined {
    if (!data) return undefined;

    // NOTE: Node order is important and is defined here
    const node: SelectOptionJson = {
      text: data.text ?? '', // Must be before other properties except type
      isCorrect: !!data.isCorrect,
      item: this.handleJsonText(context, TextLocation.tag, data.item),
      lead: this.handleJsonText(context, TextLocation.tag, data.lead),
      hint: this.handleJsonText(context, TextLocation.tag, data.hint),
      instruction: this.handleJsonText(context, TextLocation.tag, data.instruction),
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
  buildHighlight(
    context: BuildContext,
    data: Partial<HighlightJson> | undefined,
  ): HighlightJson | undefined {
    if (!data) return undefined;

    // Copy any attributes from 'attrs' to the body bit (data is in 'attrs' when coming from JSON)
    data = this.bodyBitCopyFromAttrs(data);

    // NOTE: Node order is important and is defined here
    const node: HighlightJson = {
      type: BodyBitType.highlight,
      texts: this.buildHighlightTexts(context, data.texts) || [], // Must be before other properties except type
      prefix: data.prefix ?? '',
      postfix: data.postfix ?? '',
      item: this.handleJsonText(context, TextLocation.tag, data.item),
      lead: this.handleJsonText(context, TextLocation.tag, data.lead),
      hint: this.handleJsonText(context, TextLocation.tag, data.hint),
      instruction: this.handleJsonText(context, TextLocation.tag, data.instruction),
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
  protected buildHighlightTexts(
    context: BuildContext,
    data: Partial<HighlightTextJson>[] | undefined,
  ): HighlightTextJson[] | undefined {
    if (!Array.isArray(data)) return undefined;
    const nodes = data.map((d) => this.buildHighlightText(context, d)).filter((d) => d != null);
    return nodes.length > 0 ? nodes : undefined;
  }

  /**
   * Build highlightText node
   *
   * @param data - data for the node
   * @returns
   */
  protected buildHighlightText(
    context: BuildContext,
    data: Partial<HighlightTextJson> | undefined,
  ): HighlightTextJson | undefined {
    if (!data) return undefined;

    // NOTE: Node order is important and is defined here
    const node: HighlightTextJson = {
      text: data.text ?? '', // Must be before other properties except type
      isCorrect: !!data.isCorrect,
      isHighlighted: !!data.isHighlighted,
      item: this.handleJsonText(context, TextLocation.tag, data.item),
      lead: this.handleJsonText(context, TextLocation.tag, data.lead),
      hint: this.handleJsonText(context, TextLocation.tag, data.hint),
      instruction: this.handleJsonText(context, TextLocation.tag, data.instruction),
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
    context: BuildContext,
    data: Partial<FlashcardJson>[] | undefined,
  ): FlashcardJson[] | undefined {
    if (!Array.isArray(data)) return undefined;
    const nodes = data.map((d) => this.buildFlashcard(context, d)).filter((d) => d != null);
    return nodes.length > 0 ? nodes : undefined;
  }

  /**
   * Build flashcard node
   *
   * @param data - data for the node
   * @returns
   */
  protected buildFlashcard(
    context: BuildContext,
    data: Partial<FlashcardJson> | undefined,
  ): FlashcardJson | undefined {
    if (!data) return undefined;

    // NOTE: Node order is important and is defined here
    const node: FlashcardJson = {
      question: this.buildTextAndIcon(context, data.question) as TextAndIconJson,
      answer: this.buildTextAndIcon(context, data.answer) as TextAndIconJson,
      alternativeAnswers: (data.alternativeAnswers || [])
        .map((d) => this.buildTextAndIcon(context, d))
        .filter((d) => d != null),
      item: this.handleJsonText(context, TextLocation.tag, data.item),
      lead: this.handleJsonText(context, TextLocation.tag, data.lead),
      hint: this.handleJsonText(context, TextLocation.tag, data.hint),
      instruction: this.handleJsonText(context, TextLocation.tag, data.instruction),
      ...this.toExample(data.__isDefaultExample, data.example, true),
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
      ignoreEmptyArrays: [
        'question',
        'answer',
        'alternativeAnswers',
        'item',
        'hint',
        'instruction',
      ],
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
    context: BuildContext,
    data: Partial<DefinitionListItemJson>[] | undefined,
  ): DefinitionListItemJson[] | undefined {
    if (!Array.isArray(data)) return undefined;
    const nodes = data
      .map((d) => this.buildDefinitionListItem(context, d))
      .filter((d) => d != null);
    return nodes.length > 0 ? nodes : undefined;
  }

  /**
   * Build definitionListItem node
   *
   * @param data - data for the node
   * @returns
   */
  protected buildDefinitionListItem(
    context: BuildContext,
    data: Partial<DefinitionListItemJson> | undefined,
  ): DefinitionListItemJson | undefined {
    if (!data) return undefined;

    const { bitType } = context;

    const textAsStrings = Config.isOfBitType(bitType, [BitType.metaSearchDefaultTerms]);

    // NOTE: Node order is important and is defined here
    const node: DefinitionListItemJson = {
      term: this.buildTextAndIcon(context, data.term, textAsStrings) as TextAndIconJson,
      definition: this.buildTextAndIcon(context, data.definition, textAsStrings) as TextAndIconJson,
      alternativeDefinitions: (data.alternativeDefinitions || [])
        .map((d) => this.buildTextAndIcon(context, d, textAsStrings))
        .filter((d) => d != null),
      item: this.handleJsonText(context, TextLocation.tag, data.item),
      lead: this.handleJsonText(context, TextLocation.tag, data.lead),
      hint: this.handleJsonText(context, TextLocation.tag, data.hint),
      instruction: this.handleJsonText(context, TextLocation.tag, data.instruction),
      ...this.toExample(data.__isDefaultExample, data.example, true),
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
      ignoreEmptyArrays: [
        'question',
        'answer',
        'alternativeDefinitions',
        'item',
        'hint',
        'instruction',
      ],
      ignoreUndefined: ['example'],
    });

    return node;
  }

  protected buildTextAndIcon(
    context: BuildContext,
    data: Partial<TextAndIconJson> | undefined,
    textAsStrings: boolean = false,
  ): TextAndIconJson | undefined {
    const icon = this.resourceBuilder.resourceFromResourceJson(
      context,
      data?.icon,
    ) as ImageResourceWrapperJson;

    // Ensure text is bitmark text
    let text: JsonText = this.handleJsonText(
      context,
      TextLocation.tag,
      data?.text || (data as string),
    );

    if (textAsStrings) {
      // Convert the bitmark text to plain text (without breakscaping, as that will happen in the Bitmark Generator)
      text = this.textGenerator
        .generateSync(text as TextAst, TextFormat.plainText, TextLocation.body, {
          noBreakscaping: true,
        })
        .trim();
    }

    // NOTE: Node order is important and is defined here
    const node: TextAndIconJson = {
      text,
      icon,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreEmptyArrays: ['text'],
      ignoreUndefined: ['icon'],
    });

    return node;
  }

  /**
   * Build statement[] node
   *
   * @param data - data for the node
   * @returns
   */
  protected buildStatements(
    context: BuildContext,
    data: Partial<StatementJson>[] | undefined,
  ): StatementJson[] | undefined {
    if (!Array.isArray(data)) return undefined;
    const nodes = data.map((d) => this.buildStatement(context, d)).filter((d) => d != null);
    return nodes.length > 0 ? nodes : undefined;
  }

  /**
   * Build statement node
   *
   * @param data - data for the node
   * @returns
   */
  protected buildStatement(
    context: BuildContext,
    data: Partial<StatementJson> | undefined,
  ): StatementJson | undefined {
    if (!data) return undefined;

    // NOTE: Node order is important and is defined here
    const node: StatementJson = {
      statement: data.statement ?? '',
      isCorrect: !!data.isCorrect,
      item: this.handleJsonText(context, TextLocation.tag, data.item),
      lead: this.handleJsonText(context, TextLocation.tag, data.lead),
      hint: this.handleJsonText(context, TextLocation.tag, data.hint),
      instruction: this.handleJsonText(context, TextLocation.tag, data.instruction),
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
  protected buildImageSource(
    _context: BuildContext,
    data: Partial<ImageSourceJson> | undefined,
  ): ImageSourceJson | undefined {
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
  protected buildPerson(
    context: BuildContext,
    data: Partial<PersonJson> | undefined,
  ): PersonJson | undefined {
    if (!data) return undefined;
    const { name, title, avatarImage } = data;
    // { name: string; title?: string; avatarImage?: ImageResourceJson }

    // NOTE: Node order is important and is defined here
    const node: PersonJson = {
      name: name ?? '',
      title: (title ?? undefined) as string,
      avatarImage: this.resourceBuilder.resourceFromResourceJson(
        context,
        avatarImage,
      ) as ImageResourceWrapperJson,
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
  protected buildTechnicalTerm(
    _context: BuildContext,
    data: Partial<TechnicalTermJson> | undefined,
  ): TechnicalTermJson | undefined {
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
  protected buildServings(
    _context: BuildContext,
    data: Partial<ServingsJson> | undefined,
  ): ServingsJson | undefined {
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
    context: BuildContext,
    data: Partial<RatingLevelStartEndJson> | undefined,
  ): RatingLevelStartEndJson | undefined {
    if (!data) return undefined;
    const { level, label } = data;

    // NOTE: Node order is important and is defined here
    const node: RatingLevelStartEndJson = {
      level: level ?? 0,
      label: this.handleJsonText(context, TextLocation.tag, label),
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      // ignoreEmptyArrays: ['servings', 'unit'],
      // ignoreAllUndefined: true,
    });

    return node;
  }

  // DEPRECATED - TO BE REMOVED IN FUTURE
  // /**
  //  * Build captionDefinition node
  //  *
  //  * @param data - data for the node
  //  * @returns
  //  */
  // protected buildCaptionDefinition(
  //   _context: BuildContext,
  //   data: Partial<CaptionDefinitionJson> | undefined,
  // ): CaptionDefinitionJson | undefined {
  //   if (!data) return undefined;

  //   // NOTE: Node order is important and is defined here
  //   const node: CaptionDefinitionJson = {
  //     // term: this.convertJsonTextToAstText(data.term),
  //     // description: this.convertJsonTextToAstText(data.description),
  //     term: data.term ?? '',
  //     definition: data.definition ?? '',
  //   };

  //   // Remove Unset Optionals
  //   ObjectUtils.removeUnwantedProperties(node, {
  //     ignoreEmptyString: ['term', 'description'],
  //     // ignoreAllUndefined: true,
  //   });

  //   return node;
  // }

  // /**
  //  * Build captionDefinitionList node
  //  *
  //  * @param data - data for the node
  //  * @returns
  //  */
  // protected buildCaptionDefinitionList(
  //   context: BuildContext,
  //   data: Partial<CaptionDefinitionListJson> | undefined,
  // ): CaptionDefinitionListJson | undefined {
  //   if (!data) return undefined;

  //   // NOTE: Node order is important and is defined here
  //   const node: CaptionDefinitionListJson = {
  //     columns: data.columns || [],
  //     definitions: (data.definitions || [])
  //       .map((d) => {
  //         return this.buildCaptionDefinition(context, {
  //           term: d.term,
  //           definition: d.definition,
  //         });
  //       })
  //       .filter((d) => d != null),
  //   };

  //   // Remove Unset Optionals
  //   ObjectUtils.removeUnwantedProperties(node, {
  //     ignoreAllEmptyArrays: true,
  //   });

  //   return node;
  // }

  /**
   * Build card bit[] node
   *
   * @param data - data for the node
   * @returns
   */
  protected buildCardBits(
    context: BuildContext,
    data: Partial<CardBit>[] | undefined,
  ): Bit[] | undefined {
    if (!Array.isArray(data)) return undefined;
    const nodes = data.map((d) => this.buildCardBit(context, d)).filter((d) => d != null);
    return nodes.length > 0 ? nodes : undefined;
  }

  /**
   * Build card bit node
   *
   * @param data - data for the node
   * @returns
   */
  protected buildCardBit(
    context: BuildContext,
    data: Partial<CardBit> | undefined,
  ): CardBit | undefined {
    if (!data) return undefined;
    const { bitType, textFormat } = context;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const node = this.buildBit({ ...data, bitType, textFormat } as any, {
      cardSet: {
        sideNo: 0,
        variantNo: 0,
      },
    }) as CardBit;

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

  protected toImageResource(
    context: BuildContext,
    data: Partial<ImageResourceWrapperJson> | undefined,
  ): ImageResourceWrapperJson {
    return ArrayUtils.asSingle(
      this.resourceBuilder.resourceFromResourceDataJson(context, ResourceType.image, data?.image),
    ) as ImageResourceWrapperJson;
  }

  //
  // Private
  //

  private buildCardNode(
    context: BuildContext,
    data: {
      flashcards?: Partial<FlashcardJson>[];
      definitions?: Partial<DefinitionListItemJson>[];
      legend?: Partial<DefinitionListItemJson>[];
      questions?: Partial<QuestionJson>[];
      elements?: string[];
      statement?: Partial<StatementJson>;
      statements?: Partial<StatementJson>[];
      choices?: Partial<ChoiceJson>[];
      responses?: Partial<ResponseJson>[];
      feedbacks?: Partial<FeedbackJson>[];
      quizzes?: Partial<QuizJson>[];
      heading?: Partial<HeadingJson>;
      pairs?: Partial<PairJson>[];
      matrix?: Partial<MatrixJson>[];
      pronunciationTable?: Partial<PronunciationTableJson>;
      table?: Partial<TableJson>;
      botResponses?: Partial<BotResponseJson>[];
      ingredients?: Partial<IngredientJson>[];
      // DEPRECATED - TO BE REMOVED IN FUTURE
      // captionDefinitionList?: Partial<CaptionDefinitionListJson>;
      cardBits?: Partial<CardBit>[];
    },
  ): CardNode | undefined {
    const node: CardNode = {
      heading: this.buildHeading(context, data.heading),
      questions: this.buildQuestions(context, data.questions),
      elements: data.elements,
      flashcards: this.buildFlashcards(context, data.flashcards),
      definitions: this.buildDefinitionList(context, data.definitions ?? data.legend),
      statement: this.buildStatement(context, data.statement),
      statements: this.buildStatements(context, data.statements),
      choices: this.buildChoices(context, data.choices),
      responses: this.buildResponses(context, data.responses),
      feedbacks: this.buildFeedbacks(context, data.feedbacks),
      quizzes: this.buildQuizzes(context, data.quizzes),
      pairs: this.buildPairs(context, data.pairs),
      matrix: this.buildMatricies(context, data.matrix),
      pronunciationTable: this.buildPronunciationTable(context, data.pronunciationTable),
      table: this.buildTable(context, data.table),
      botResponses: this.buildBotResponses(context, data.botResponses),
      ingredients: this.buildIngredients(context, data.ingredients),
      // DEPRECATED - TO BE REMOVED IN FUTURE
      // captionDefinitionList: this.buildCaptionDefinitionList(context, data.captionDefinitionList),
      cardBits: this.buildCardBits(context, data.cardBits),
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
    context: BuildContext,
    body: Body | undefined,
    cardNode: CardNode | undefined,
    __isDefaultExample: boolean | undefined,
    example: ExampleJson | undefined,
  ): void {
    if (__isDefaultExample || example != null) {
      if (cardNode) {
        this.pushExampleDownTreeString(
          context,
          __isDefaultExample,
          example,
          cardNode.pairs as WithExampleJson[],
        );
        this.pushExampleDownTreeBoolean(
          context,
          __isDefaultExample,
          example,
          false,
          cardNode.flashcards as WithExampleJson[],
        );
        this.pushExampleDownTreeBoolean(
          context,
          __isDefaultExample,
          example,
          false,
          cardNode.definitions as WithExampleJson[],
        );
        this.pushExampleDownTreeBoolean(
          context,
          __isDefaultExample,
          example,
          true,
          cardNode.choices as WithExampleJson[],
        );
        this.pushExampleDownTreeBoolean(
          context,
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
              context,
              __isDefaultExample,
              example,
              true,
              quiz.choices as WithExampleJson[] | undefined,
            );
            this.pushExampleDownTreeBoolean(
              context,
              __isDefaultExample,
              example,
              false,
              quiz.responses as WithExampleJson[] | undefined,
            );
          }
        }
        if (cardNode.matrix) {
          for (const m of cardNode.matrix) {
            this.pushExampleDownTreeString(context, __isDefaultExample, example, m.cells);
          }
        }
      }
      if (body) {
        this.pushExampleDownTreeBodyBits(context, __isDefaultExample, example, body);
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
    _context: BuildContext,
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
    context: BuildContext,
    __isDefaultExample: boolean | undefined,
    example: ExampleJson | undefined,
    ...nodes: (WithExampleJson | WithExampleJson[] | undefined)[]
  ): void {
    if (!__isDefaultExample && !example) return;

    if (Array.isArray(nodes)) {
      for (const ds of nodes) {
        if (ds) {
          const exampleNodes = Array.isArray(ds) ? ds : [ds];
          BitUtils.fillStringExample(
            context.textFormat,
            exampleNodes,
            __isDefaultExample,
            example,
            false,
          );
        }
      }
    }
  }

  private pushExampleDownTreeBodyBits(
    context: BuildContext,
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
            BitUtils.fillStringExample(
              context.textFormat,
              [gap],
              __isDefaultExample,
              example,
              false,
            );
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
    _context: BuildContext,
    body: Body | CardBit | undefined | (Body | CardBit | undefined)[],
    bodyBitTypes: BodyBitTypeType[] | undefined,
    cardNode: CardNode | undefined,
    cardNodePath: string | string[] | undefined,
    path: string,
    value: unknown,
  ): void {
    if (value === undefined) return;

    // Add value to card nodes if required
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

  private parseExtraProperties(
    extraProperties: { [key: string]: unknown } | undefined,
  ): ExtraProperties | undefined {
    if (!extraProperties) return undefined;

    const entries = Object.entries(extraProperties);
    if (entries.length === 0) return undefined;

    const res: ExtraProperties = {};

    for (const [key, value] of entries) {
      res[key] = (ArrayUtils.asArray(value) || [value]) as Property;
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
      for (const v of cardNode.flashcards || []) {
        checkIsExample(v as WithExampleJson);
      }

      // definitions
      for (const v of cardNode.definitions || []) {
        checkIsExample(v as WithExampleJson);
      }

      // pairs
      for (const v of cardNode.pairs || []) {
        checkIsExample(v as WithExampleJson);
      }
      // matrix
      for (const mx of cardNode.matrix || []) {
        let hasExample = false;

        // matrix cell
        for (const v of mx.cells || []) {
          hasExample = checkIsExample(v as WithExampleJson) ? true : hasExample;
        }
        mx.isExample = hasExample;
      }
      // quizzes
      for (const quiz of cardNode.quizzes || []) {
        let hasExample = false;

        // responses
        for (const v of quiz.responses || []) {
          hasExample = checkIsExample(v as WithExampleJson) ? true : hasExample;
        }
        // choices
        for (const v of quiz.choices || []) {
          hasExample = checkIsExample(v as WithExampleJson) ? true : hasExample;
        }
        quiz.isExample = hasExample;
      }
      // responses
      for (const v of cardNode.responses || []) {
        checkIsExample(v as WithExampleJson);
      }
      // choices
      for (const v of cardNode.choices || []) {
        checkIsExample(v as WithExampleJson);
      }
      // statements
      for (const v of cardNode.statements || []) {
        checkIsExample(v as WithExampleJson);
      }
      // statement
      checkIsExample(cardNode.statement as WithExampleJson);
      // NO: elements
      // questions
      for (const v of cardNode.questions || []) {
        checkIsExample(v as WithExampleJson);
      }
    }

    // Bit level

    // statement
    checkIsExample(bit.statement as WithExampleJson);
    // responses
    for (const v of bit.responses || []) {
      checkIsExample(v as WithExampleJson);
    }
    // choices
    for (const v of bit.choices || []) {
      checkIsExample(v as WithExampleJson);
    }

    // Bit itself
    checkIsExample(bit as WithExampleJson);
  }

  private setDefaultBitValues(bit: Bit) {
    const { bitType } = bit;
    // Set aiGenerated == true for all AI generated bits
    switch (bitType) {
      case BitType.articleAi:
      case BitType.noteAi:
      case BitType.summaryAi:
        bit.aiGenerated = this.toAstProperty(
          bitType,
          ConfigKey.property_aiGenerated,
          true,
          undefined,
        );
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
