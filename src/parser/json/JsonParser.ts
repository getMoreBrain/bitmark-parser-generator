import { Builder } from '../../ast/Builder';
import { ResourceBuilder } from '../../ast/ResourceBuilder';
import { Breakscape } from '../../breakscaping/Breakscape';
import { Config } from '../../config/Config';
import { TextGenerator } from '../../generator/text/TextGenerator';
import { BreakscapedString } from '../../model/ast/BreakscapedString';
import { Bit, BitmarkAst, Body, BodyBit, BodyPart, CardBit, Footer } from '../../model/ast/Nodes';
import { JsonText, TextAst } from '../../model/ast/TextNodes';
import { BitType, BitTypeType } from '../../model/enum/BitType';
import { BodyBitType } from '../../model/enum/BodyBitType';
import { ResourceTag, ResourceTagType } from '../../model/enum/ResourceTag';
import { TextFormat, TextFormatType } from '../../model/enum/TextFormat';
import { BitWrapperJson } from '../../model/json/BitWrapperJson';
import { StringUtils } from '../../utils/StringUtils';
import { TextParser } from '../text/TextParser';

import {
  BitJson,
  ChoiceJson,
  HeadingJson,
  MatrixJson,
  PairJson,
  QuestionJson,
  FlashcardJson,
  QuizJson,
  ResponseJson,
  StatementJson,
  PersonJson,
  BotResponseJson,
  ExampleJson,
  MarkConfigJson,
  ImageSourceJson,
  ListItemJson,
  IngredientJson,
  TechnicalTermJson,
  TableJson,
  ServingsJson,
  RatingLevelStartEndJson,
  CaptionDefinitionListJson,
  DescriptionListItemJson,
  MatrixCellJson,
} from '../../model/json/BitJson';
import {
  SelectOptionJson,
  HighlightTextJson,
  BodyBitsJson,
  BodyBitJson,
  GapJson,
  SelectJson,
  HighlightJson,
  MarkJson,
} from '../../model/json/BodyBitJson';
import {
  ResourceJson,
  ResourceDataJson,
  ImageResourceWrapperJson,
  ImageResourceJson,
  AudioResourceWrapperJson,
  ImageResponsiveResourceJson,
  StillImageFilmResourceJson,
} from '../../model/json/ResourceJson';

interface ReferenceAndReferenceProperty {
  reference?: string;
  referenceProperty?: string | string[];
}

interface ItemLeadHintInstruction {
  item?: TextAst;
  lead?: TextAst;
  pageNumber?: TextAst;
  marginNumber?: TextAst;
  hint?: TextAst;
  instruction?: TextAst;
}

interface Example {
  example: ExampleJson;
}

const builder = new Builder();
const resourceBuilder = new ResourceBuilder();

/**
 * A parser for parsing bitmark JSON to bitmark AST
 */
class JsonParser {
  private textGenerator: TextGenerator;
  private textParser: TextParser;

  constructor() {
    this.textGenerator = new TextGenerator();
    this.textParser = new TextParser();
  }

  /**
   * Convert JSON to AST.
   *
   * The JSON can be a bit or a bitwrapper and can be a string or a plain JS object
   *
   * @param json - bitmark JSON as a string or a plain JS object
   * @returns bitmark AST
   */
  toAst(json: unknown): BitmarkAst {
    const bitWrappers = this.preprocessJson(json);
    const bitsNodes: Bit[] | undefined = [];

    for (const bitWrapper of bitWrappers) {
      const { bit, parser } = bitWrapper;

      // Transform to AST
      const bitsNode = this.bitToAst(bit, parser?.internalComments);
      if (bitsNode) {
        bitsNodes.push(bitsNode);
      }
    }

    const bits = bitsNodes.length > 0 ? { bits: bitsNodes } : {};

    const ast = builder.bitmark(bits);

    return ast;
  }

  /**
   * Preprocess bitmark JSON into a standard format (BitWrapperJson[] object) from either a bit or a bitwrapper
   * as a string or a plain JS object
   *
   * @param json - bitmark JSON as a string or a plain JS object
   * @returns bitmark JSON in a standard format (BitWrapperJson[] object)
   */
  preprocessJson(json: string | unknown): BitWrapperJson[] {
    const bitWrappers: BitWrapperJson[] = [];

    if (StringUtils.isString(json)) {
      const str = json as string;
      try {
        json = JSON.parse(str);
      } catch (e) {
        // Failed to parse JSON, return empty array
        return [];
      }
    }

    // Helper function to push an item that is either a BitWrapper or a Bit to the BitWrapper array as a BitWrapper
    const pushItemAsBitWrapper = (item: unknown): void => {
      if (this.isBitWrapper(item)) {
        const w = item as BitWrapperJson;
        bitWrappers.push(w);
      } else if (this.isBit(item)) {
        const b = item as BitJson;
        bitWrappers.push(this.bitToBitWrapper(b));
      }
    };

    // See if we have an array of bits, or a single bit, or any other known format, and convert that into
    // an array of bits
    if (Array.isArray(json)) {
      for (const item of json) {
        pushItemAsBitWrapper(item);
      }
    } else {
      pushItemAsBitWrapper(json);
    }

    return bitWrappers;
  }

  /**
   * Check if a plain JS object is valid BitWrapper JSON
   *
   * @param bitWrapper - a plain JS object that might be BitWrapper JSON
   * @returns true if BitWrapper JSON, otherwise false
   */
  isBitWrapper(bitWrapper: unknown): boolean {
    if (Object.prototype.hasOwnProperty.call(bitWrapper, 'bit')) {
      const w = bitWrapper as BitWrapperJson;
      return this.isBit(w.bit);
    }
    return false;
  }

  /**
   * Check if a plain JS object is valid Bit JSON
   *
   * @param bitWrapper - a plain JS object that might be Bit JSON
   * @returns true if Bit JSON, otherwise false
   */
  isBit(bit: unknown): boolean {
    if (Object.prototype.hasOwnProperty.call(bit, 'type')) {
      const b = bit as BitJson;
      return Config.getBitType(b.type) !== BitType._error;
    }
    return false;
  }

  /**
   * Convert a Bit to BitWrapper
   *
   * @param bit a valid Bit
   * @returns the Bit wrapper in a BitWrapper
   */
  bitToBitWrapper(bit: BitJson): BitWrapperJson {
    return {
      bit,
    };
  }

  private bitToAst(bit: BitJson, internalComments: string[] | undefined): Bit | undefined {
    const {
      type,
      originalType,
      bitLevel,
      format,
      id,
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
      date,
      dateEnd,
      location,
      kind,
      hasMarkAsDone,
      processHandIn,
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
      action,
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
      productVideo,
      productFolder,
      technicalTerm,
      servings,
      ratingLevelStart,
      ratingLevelEnd,
      ratingLevelSelected,
      book,
      title,
      subtitle,
      level,
      toc,
      progress,
      anchor,
      reference: referenceIn,
      referenceEnd,
      item,
      lead,
      pageNumber,
      marginNumber,
      hint,
      instruction,
      example,
      imageSource,
      person,
      partner,
      marks,
      imagePlaceholder,
      resource,
      logos,
      images,
      body,
      elements,
      statement,
      isCorrect,
      cards,
      descriptions,
      statements,
      responses,
      quizzes,
      heading,
      pairs,
      matrix,
      table,
      captionDefinitionList,
      choices,
      questions,
      ingredients,
      listItems,
      sections,
      footer,
      placeholders,
    } = bit;

    const isCommented = type === BitType._comment && originalType !== undefined;

    // Bit type
    const bitType = Config.getBitType(isCommented ? originalType : type);

    // Bit level
    const bitLevelValidated = Math.max(Math.min(bitLevel ?? 1, Config.bitLevelMax), Config.bitLevelMin);

    // Get the bit config for the bit type
    const bitConfig = Config.getBitConfig(bitType);

    // Text Format
    const textFormat = TextFormat.fromValue(format) ?? bitConfig.textFormatDefault;

    // Resource attachement type
    const resourceAttachmentType = this.getResourceType(resource);

    // resource(s)
    const resourcesNode = this.resourceBitToAst(bitType, resource, images ?? logos);

    // body & placeholders
    const bodyNode = this.bodyToAst(body, textFormat, placeholders);

    // imagePlaceholder
    const imagePlaceholderNode = this.imagePlaceholderBitToAst(bitType, imagePlaceholder);

    // imageSource
    const imageSourceNode = this.imageSourceBitToAst(imageSource);

    // Person (partner, deprecated)
    const personNode = this.personBitToAst(bitType, person ?? partner);

    // Mark Config
    const markConfigNode = this.markConfigBitToAst(marks);

    // flashcards
    const flashcardNodes = this.flashcardBitsToAst(cards);

    // descriptions
    const descriptionNodes = this.descriptionsBitsToAst(descriptions);

    //+-statement
    const statementNodes = this.statementBitsToAst(statement, isCorrect, statements, example);

    //+-response
    const responseNodes = this.responseBitsToAst(bitType, responses as ResponseJson[]);

    // quizzes
    const quizNodes = this.quizBitsToAst(bitType, quizzes);

    // heading
    const headingNode = this.headingBitToAst(heading);

    // pairs
    const pairsNodes = this.pairBitsToAst(bitType, pairs);

    // matrix
    const matrixNodes = this.matrixBitsToAst(matrix);

    // table / captionDefinitionList
    const tableNode = this.tableToAst(table);

    //+-choice
    const choiceNodes = this.choiceBitsToAst(choices);

    // questions
    const questionNodes = this.questionBitsToAst(questions);

    // botResponses
    const botResponseNodes = this.botResponseBitsToAst(bitType, responses as BotResponseJson[]);

    // technicalTerm
    const technicalTermNode = this.technicalTermToAst(technicalTerm);

    // servings
    const servingsNode = this.servingsToAst(servings);

    // ingredients
    const ingredientsNodes = this.ingredientsBitsToAst(ingredients);

    // ratingLevelStart
    const ratingLevelStartNodes = this.ratingLevelStartEndToAst(ratingLevelStart);

    // ratingLevelEnd
    const ratingLevelEndNodes = this.ratingLevelStartEndToAst(ratingLevelEnd);

    // captionDefinitionList
    const captionDefinitionListNode = this.captionDefinitionListToAst(captionDefinitionList);

    // listItems / sections (cardBits)
    const cardBitNodes = this.listItemsToAst(listItems ?? sections, textFormat, placeholders);

    // footer
    const footerNode = this.footerToAst(footer, textFormat);

    // Convert reference to referenceProperty
    const { reference, referenceProperty } = this.referenceToAst(referenceIn);

    // Build bit
    const bitNode = builder.bit({
      bitType,
      bitLevel: bitLevelValidated,
      textFormat: format as TextFormatType,
      resourceType: resourceAttachmentType,
      isCommented,
      id,
      internalComment: internalComments,
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
      duration,
      referenceProperty,
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
      caption: this.convertJsonTextToAstText(caption),
      quotedPerson,
      partialAnswer,
      reasonableNumOfChars,
      sampleSolution, //: this.convertJsonTextToAstText(sampleSolution),
      additionalSolutions, //: this.convertJsonTextToAstText(additionalSolutions),
      resolved,
      resolvedDate,
      resolvedBy,
      maxCreatedBits,
      maxDisplayLevel,
      page,
      productId,
      productList: product,
      productVideoList: productVideo,
      productFolder,
      technicalTerm: technicalTermNode,
      servings: servingsNode,
      ratingLevelStart: ratingLevelStartNodes,
      ratingLevelEnd: ratingLevelEndNodes,
      ratingLevelSelected,
      book,
      title: this.convertJsonTextToAstText(title),
      subtitle: this.convertJsonTextToAstText(subtitle),
      level,
      toc,
      progress,
      anchor,
      reference,
      referenceEnd,
      ...this.parseItemLeadHintInstructionPageNumberMarginNumber(
        item,
        lead,
        hint,
        instruction,
        pageNumber,
        marginNumber,
      ),
      ...this.parseExample(example),
      imageSource: imageSourceNode,
      person: personNode,
      markConfig: markConfigNode,
      imagePlaceholder: imagePlaceholderNode,
      resources: resourcesNode,
      body: bodyNode,
      elements,
      flashcards: flashcardNodes,
      descriptions: descriptionNodes,
      statements: statementNodes,
      responses: responseNodes,
      quizzes: quizNodes,
      heading: headingNode,
      pairs: pairsNodes,
      matrix: matrixNodes,
      table: tableNode,
      choices: choiceNodes,
      questions: questionNodes,
      botResponses: botResponseNodes,
      ingredients: ingredientsNodes,
      captionDefinitionList: captionDefinitionListNode,
      cardBits: cardBitNodes,
      footer: footerNode,
    });

    return bitNode;
  }

  private imageSourceBitToAst(imageSource?: ImageSourceJson): ImageSourceJson | undefined {
    if (!imageSource) return undefined;
    return builder.imageSource(imageSource);
  }

  private imagePlaceholderBitToAst(
    bitType: BitTypeType,
    imagePlaceholder?: ImageResourceWrapperJson,
  ): ImageResourceWrapperJson | undefined {
    if (!imagePlaceholder) return undefined;

    return this.resourceDataToAst(bitType, ResourceTag.image, imagePlaceholder.image) as ImageResourceWrapperJson;
  }

  private personBitToAst(bitType: BitTypeType, person?: PersonJson): PersonJson | undefined {
    if (!person) return undefined;

    const avatarImage = person.avatarImage
      ? (this.resourceDataToAst(bitType, ResourceTag.image, person.avatarImage) as ImageResourceWrapperJson)?.image
      : undefined;

    return builder.person({
      ...person,
      avatarImage,
    });
  }

  private markConfigBitToAst(marks?: MarkConfigJson[]): MarkConfigJson[] | undefined {
    if (!Array.isArray(marks)) return undefined;
    return marks.map((m) => builder.markConfig(m));
  }

  private flashcardBitsToAst(flashcards?: FlashcardJson[]): FlashcardJson[] | undefined {
    if (!Array.isArray(flashcards)) return undefined;

    const nodes: FlashcardJson[] = [];
    for (const item of flashcards) {
      const node = builder.flashcard({
        ...item,
        question: this.convertJsonTextToAstText(item.question),
        answer: this.convertJsonTextToAstText(item.answer),
        alternativeAnswers: this.convertJsonTextToAstText(item.alternativeAnswers),
        item: this.convertJsonTextToAstText(item.item),
        lead: this.convertJsonTextToAstText(item.lead),
        hint: this.convertJsonTextToAstText(item.hint),
        instruction: this.convertJsonTextToAstText(item.instruction),
        ...this.parseExample(item.example),
      });
      if (node) nodes.push(node);
    }
    if (nodes.length === 0) return undefined;

    return nodes;
  }

  private descriptionsBitsToAst(descriptionList?: DescriptionListItemJson[]): DescriptionListItemJson[] | undefined {
    if (!Array.isArray(descriptionList)) return undefined;

    const nodes: DescriptionListItemJson[] = [];
    for (const item of descriptionList) {
      const node = builder.descriptionListItem({
        ...item,
        term: this.convertJsonTextToAstText(item.term),
        description: this.convertJsonTextToAstText(item.description),
        alternativeDescriptions: this.convertJsonTextToAstText(item.alternativeDescriptions),
        item: this.convertJsonTextToAstText(item.item),
        lead: this.convertJsonTextToAstText(item.lead),
        hint: this.convertJsonTextToAstText(item.hint),
        instruction: this.convertJsonTextToAstText(item.instruction),
        ...this.parseExample(item.example),
      });
      if (node) nodes.push(node);
    }
    if (nodes.length === 0) return undefined;

    return nodes;
  }

  private statementBitsToAst(
    statement?: string,
    isCorrect?: boolean,
    statements?: StatementJson[],
    example?: ExampleJson,
  ): StatementJson[] | undefined {
    const nodes: StatementJson[] = [];

    if (statement) {
      const node = builder.statement({
        text: statement ?? '',
        isCorrect: isCorrect ?? false,
        ...this.parseExample(example),
      });
      nodes.push(node);
    }

    if (Array.isArray(statements)) {
      for (const item of statements) {
        const node = builder.statement({
          ...item,
          text: item.statement ?? '',
          item: this.convertJsonTextToAstText(item.item),
          lead: this.convertJsonTextToAstText(item.lead),
          hint: this.convertJsonTextToAstText(item.hint),
          instruction: this.convertJsonTextToAstText(item.instruction),
          ...this.parseExample(item.example),
        });
        if (node) nodes.push(node);
      }
    }

    if (nodes.length === 0) return undefined;

    return nodes;
  }

  private choiceBitsToAst(choices?: ChoiceJson[]): ChoiceJson[] | undefined {
    if (!Array.isArray(choices)) return undefined;

    const nodes: ChoiceJson[] = [];
    for (const item of choices) {
      const node = builder.choice({
        ...item,
        text: item.choice ?? '',
        item: this.convertJsonTextToAstText(item.item),
        lead: this.convertJsonTextToAstText(item.lead),
        hint: this.convertJsonTextToAstText(item.hint),
        instruction: this.convertJsonTextToAstText(item.instruction),
        ...this.parseExample(item.example),
      });
      if (node) nodes.push(node);
    }
    if (nodes.length === 0) return undefined;

    return nodes;
  }

  private responseBitsToAst(bitType: BitTypeType, responses?: ResponseJson[]): ResponseJson[] | undefined {
    // Return early if bot response as the responses should be interpreted as bot responses
    if (Config.isOfBitType(bitType, BitType.botActionResponse)) return undefined;

    if (!Array.isArray(responses)) return undefined;

    const nodes: ResponseJson[] = [];
    for (const item of responses) {
      const node = builder.response({
        ...item,
        text: item.response ?? '',
        item: this.convertJsonTextToAstText(item.item),
        lead: this.convertJsonTextToAstText(item.lead),
        hint: this.convertJsonTextToAstText(item.hint),
        instruction: this.convertJsonTextToAstText(item.instruction),
        ...this.parseExample(item.example),
      });
      if (node) nodes.push(node);
    }
    if (nodes.length === 0) return undefined;

    return nodes;
  }

  private selectOptionBitsToAst(options?: SelectOptionJson[]): SelectOptionJson[] {
    const nodes: SelectOptionJson[] = [];
    if (Array.isArray(options)) {
      for (const o of options) {
        const { text, isCorrect, item, lead, hint, instruction, example } = o;
        const node = builder.selectOption({
          text: text ?? '',
          isCorrect,
          ...this.parseItemLeadHintInstruction(item, lead, hint, instruction),
          ...this.parseExample(example),
        });
        nodes.push(node);
      }
    }

    return nodes;
  }

  private highlightTextBitsToAst(highlightTexts?: HighlightTextJson[]): HighlightTextJson[] {
    const nodes: HighlightTextJson[] = [];
    if (Array.isArray(highlightTexts)) {
      for (const t of highlightTexts) {
        const { text, isCorrect, isHighlighted, item, lead, hint, instruction, example } = t;
        const node = builder.highlightText({
          text: text ?? '',
          isCorrect,
          isHighlighted,
          ...this.parseItemLeadHintInstruction(item, lead, hint, instruction),
          ...this.parseExample(example),
        });
        nodes.push(node);
      }
    }

    return nodes;
  }

  private quizBitsToAst(bitType: BitTypeType, quizzes?: QuizJson[]): QuizJson[] | undefined {
    if (!Array.isArray(quizzes)) return undefined;

    const nodes: QuizJson[] = [];
    for (const item of quizzes) {
      const choices = this.choiceBitsToAst(item.choices);
      const responses = this.responseBitsToAst(bitType, item.responses);

      const node = builder.quiz({
        ...item,
        item: this.convertJsonTextToAstText(item.item),
        lead: this.convertJsonTextToAstText(item.lead),
        hint: this.convertJsonTextToAstText(item.hint),
        instruction: this.convertJsonTextToAstText(item.instruction),
        choices,
        responses,
      });
      if (node) nodes.push(node);
    }
    if (nodes.length === 0) return undefined;

    return nodes;
  }

  private headingBitToAst(heading?: HeadingJson): HeadingJson | undefined {
    if (!heading) return undefined;
    return builder.heading(heading);
  }

  private pairBitsToAst(bitType: BitTypeType, pairs?: PairJson[]): PairJson[] | undefined {
    if (!Array.isArray(pairs)) return undefined;

    const nodes: PairJson[] = [];
    for (const item of pairs) {
      const keyAudio = (this.resourceDataToAst(bitType, ResourceTag.audio, item.keyAudio) as AudioResourceWrapperJson)
        ?.audio;
      const keyImage = (this.resourceDataToAst(bitType, ResourceTag.image, item.keyImage) as ImageResourceWrapperJson)
        ?.image;

      const node = builder.pair({
        ...item,
        keyAudio,
        keyImage,
        item: this.convertJsonTextToAstText(item.item),
        lead: this.convertJsonTextToAstText(item.lead),
        hint: this.convertJsonTextToAstText(item.hint),
        instruction: this.convertJsonTextToAstText(item.instruction),
        ...this.parseExample(item.example),
      });
      if (node) nodes.push(node);
    }
    if (nodes.length === 0) return undefined;

    return nodes;
  }

  private matrixBitsToAst(matrix?: MatrixJson[]): MatrixJson[] | undefined {
    if (!Array.isArray(matrix)) return undefined;

    const nodes: MatrixJson[] = [];
    for (const item of matrix) {
      const cells = this.matrixCellsToAst(item.cells) ?? [];

      const node = builder.matrix({
        ...item,
        cells,
        item: this.convertJsonTextToAstText(item.item),
        lead: this.convertJsonTextToAstText(item.lead),
        hint: this.convertJsonTextToAstText(item.hint),
        instruction: this.convertJsonTextToAstText(item.instruction),
        // ...this.parseExample(item.example),
      });
      if (node) nodes.push(node);
    }
    if (nodes.length === 0) return undefined;

    return nodes;
  }

  private matrixCellsToAst(matrixCells?: MatrixCellJson[]): MatrixCellJson[] | undefined {
    if (!Array.isArray(matrixCells)) return undefined;

    const nodes: MatrixCellJson[] = [];
    for (const item of matrixCells) {
      const node = builder.matrixCell({
        ...item,
        item: this.convertJsonTextToAstText(item.item),
        lead: this.convertJsonTextToAstText(item.lead),
        hint: this.convertJsonTextToAstText(item.hint),
        instruction: this.convertJsonTextToAstText(item.instruction),
        ...this.parseExample(item.example),
      });
      if (node) nodes.push(node);
    }
    if (nodes.length === 0) return undefined;

    return nodes;
  }

  private tableToAst(table?: TableJson): TableJson | undefined {
    if (!table) return undefined;
    return builder.table(table);
  }

  private questionBitsToAst(questions?: QuestionJson[]): QuestionJson[] | undefined {
    if (!Array.isArray(questions)) return undefined;

    const nodes: QuestionJson[] = [];
    for (const item of questions) {
      const node = builder.question({
        ...item,
        item: this.convertJsonTextToAstText(item.item),
        lead: this.convertJsonTextToAstText(item.lead),
        hint: this.convertJsonTextToAstText(item.hint),
        instruction: this.convertJsonTextToAstText(item.instruction),
        ...this.parseExample(item.example),
      });
      if (node) nodes.push(node);
    }
    if (nodes.length === 0) return undefined;

    return nodes;
  }

  private botResponseBitsToAst(bitType: BitTypeType, responses?: BotResponseJson[]): BotResponseJson[] | undefined {
    // Return early if NOT bot response as the responses should be interpreted as standard responses
    if (!Config.isOfBitType(bitType, BitType.botActionResponse)) return undefined;

    if (!Array.isArray(responses)) return undefined;

    const nodes: BotResponseJson[] = [];
    for (const item of responses) {
      const node = builder.botResponse({
        ...item,
        item: this.convertJsonTextToAstText(item.item),
        lead: this.convertJsonTextToAstText(item.lead),
        hint: this.convertJsonTextToAstText(item.hint),
        // instruction: this.convertJsonTextToAstText(item.instruction),
        // ...this.parseExample(item.example),
      });
      if (node) nodes.push(node);
    }
    if (nodes.length === 0) return undefined;

    return nodes;
  }

  private technicalTermToAst(technicalTerm?: TechnicalTermJson): TechnicalTermJson | undefined {
    if (!technicalTerm) return undefined;
    return builder.technicalTerm(technicalTerm);
  }

  private servingsToAst(servings?: ServingsJson): ServingsJson | undefined {
    if (!servings) return undefined;

    const item = servings;
    return builder.servings(item);
  }

  private ingredientsBitsToAst(ingredients?: IngredientJson[]): IngredientJson[] | undefined {
    return ingredients;
    if (!Array.isArray(ingredients)) return undefined;

    const nodes: IngredientJson[] = [];
    for (const item of ingredients) {
      const node = builder.ingredient({
        ...item,
        item: this.convertJsonTextToAstText(item.item),
      });
      if (node) nodes.push(node);
    }
    if (nodes.length === 0) return undefined;

    return nodes;

    // if (!imageSource) return undefined;
    // return builder.imageSource(imageSource);

    // const nodes: Ingredient[] = [];
    // if (Array.isArray(ingredients)) {
    //   for (const i of ingredients) {
    //     const { title, checked, item, quantity, unit, unitAbbr, decimalPlaces, disableCalculation } = i;
    //     const node = builder.ingredient({
    //       title,
    //       checked,
    //       item: this.convertJsonTextToAstText(item),
    //       quantity,
    //       unit: unit ?? '',
    //       unitAbbr,
    //       decimalPlaces: decimalPlaces ?? 1,
    //       disableCalculation,
    //     });
    //     nodes.push(node);
    //   }
    // }

    // if (nodes.length === 0) return undefined;

    // return nodes;
  }

  private ratingLevelStartEndToAst(ratingLevelStartEnd: RatingLevelStartEndJson): RatingLevelStartEndJson | undefined {
    if (!ratingLevelStartEnd) return undefined;

    const item = ratingLevelStartEnd;
    return builder.ratingLevelStartEnd({
      ...item,
      label: this.convertJsonTextToAstText(item.label),
    });
  }

  private captionDefinitionListToAst(
    captionDefinitionList: CaptionDefinitionListJson,
  ): CaptionDefinitionListJson | undefined {
    if (!captionDefinitionList) return undefined;

    const item = captionDefinitionList;
    return builder.captionDefinitionList({
      ...item,
      definitions: (item.definitions ?? []).map((d) => {
        return builder.captionDefinition({
          term: this.convertJsonTextToAstText(d.term),
          description: this.convertJsonTextToAstText(d.description),
        });
      }),
    });
  }

  private listItemsToAst(
    listItems: ListItemJson[],
    textFormat: TextFormatType,
    placeholders: BodyBitsJson,
  ): CardBit[] | undefined {
    const nodes: CardBit[] = [];

    if (Array.isArray(listItems)) {
      for (const li of listItems) {
        const { item, lead, hint, instruction, body } = li;
        const node = builder.cardBit({
          ...this.parseItemLeadHintInstruction(item, lead, hint, instruction),
          body: this.bodyToAst(body, textFormat, placeholders),
        });
        if (node) nodes.push(node);
      }
    }

    if (nodes.length === 0) return undefined;

    return nodes;
  }

  private getResourceType(resource?: ResourceJson): ResourceTagType | undefined {
    if (resource) {
      const resourceKey = ResourceTag.fromValue(resource.type);
      return resourceKey;
    }

    return undefined;
  }

  private resourceBitToAst(
    bitType: BitTypeType,
    resource: ResourceJson | undefined,
    images: ImageResourceWrapperJson[] | undefined,
  ): ResourceJson[] | undefined {
    const nodes: ResourceJson[] | undefined = [];

    if (resource) {
      const resourceKey = ResourceTag.keyFromValue(resource.type) ?? ResourceTag.unknown;
      let data: ResourceDataJson | undefined;

      // TODO: This code should use the config to handle the combo resources. For now the logic is hardcoded

      // Handle special cases for multiple resource bits (imageResponsive, stillImageFilm)
      if (resource.type === ResourceTag.imageResponsive) {
        const r = resource as unknown as ImageResponsiveResourceJson;
        const imagePortraitNode = this.resourceDataToAst(bitType, ResourceTag.imagePortrait, r.imagePortrait);
        const imageLandscapeNode = this.resourceDataToAst(bitType, ResourceTag.imageLandscape, r.imageLandscape);
        if (imagePortraitNode) nodes.push(imagePortraitNode);
        if (imageLandscapeNode) nodes.push(imageLandscapeNode);
      } else if (resource.type === ResourceTag.stillImageFilm) {
        const r = resource as unknown as StillImageFilmResourceJson;
        const imageNode = this.resourceDataToAst(bitType, ResourceTag.image, r.image);
        const audioNode = this.resourceDataToAst(bitType, ResourceTag.audio, r.audio);
        if (imageNode) nodes.push(imageNode);
        if (audioNode) nodes.push(audioNode);
      } else {
        // Standard single resource case

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data = (resource as any)[resourceKey];

        if (!data) return undefined;

        const node = this.resourceDataToAst(bitType, resource.type, data);
        if (node) nodes.push(node);
      }
    }

    if (Config.isOfBitType(bitType, [BitType.imagesLogoGrave, BitType.prototypeImages])) {
      // Add the logo images
      if (Array.isArray(images)) {
        for (const image of images) {
          if (image) nodes.push(image);
        }
      }
    }

    return nodes;
  }

  private resourceDataToAst(
    bitType: BitTypeType,
    type: ResourceTagType,
    data?: Partial<ResourceDataJson>,
  ): ResourceJson | undefined {
    let node: ResourceJson | undefined;

    if (data) {
      if (!data) return undefined;

      const dataAsString: string | undefined = StringUtils.isString(data) ? (data as unknown as string) : undefined;

      // url / src / href / app
      const url = data.url || data.src || data.body || dataAsString;

      // Sub resources
      const posterImage = (
        this.resourceDataToAst(bitType, ResourceTag.image, data.posterImage) as ImageResourceWrapperJson
      )?.image;
      const thumbnails = data.thumbnails
        ? data.thumbnails.map((t) => {
            return (this.resourceDataToAst(bitType, ResourceTag.image, t) as ImageResourceWrapperJson)?.image;
          })
        : undefined;

      // Resource
      node = resourceBuilder.resource(bitType, {
        type,

        // Generic (except Article / Document)
        value: url,

        // ImageLikeResource / AudioLikeResource / VideoLikeResource / Article / Document
        format: data.format,

        // ImageLikeResource
        src1x: data.src1x,
        src2x: data.src2x,
        src3x: data.src3x,
        src4x: data.src4x,
        caption: this.convertJsonTextToAstText(data.caption),

        // ImageLikeResource / VideoLikeResource
        width: data.width ?? undefined,
        height: data.height ?? undefined,
        alt: data.alt,
        zoomDisabled: data.zoomDisabled,

        // VideoLikeResource
        duration: data.duration,
        mute: data.mute,
        autoplay: data.autoplay,
        allowSubtitles: data.allowSubtitles,
        showSubtitles: data.showSubtitles,
        posterImage,
        thumbnails,

        // WebsiteLinkResource
        siteName: undefined, //data.siteName,

        // Generic Resource
        license: data.license,
        copyright: data.copyright,
        showInIndex: data.showInIndex,
        search: data.search,
      });
    }

    return node;
  }

  /** TODO
   *
   * - Convert the string like body into AST body,
   * - re-build all the body bits to validate them.
   *
   */
  private bodyToAst(body: JsonText, textFormat: TextFormatType, placeholders: BodyBitsJson): Body | undefined {
    let node: Body | undefined;
    let bodyStr: BreakscapedString | undefined;
    const placeholderNodes: {
      [keyof: string]: BodyBit;
    } = {};

    if (textFormat === TextFormat.json) {
      // If the text format is JSON, handle appropriately
      let bodyObject: unknown = body;

      // Attempt to parse a string body as JSON to support the legacy format
      if (typeof bodyObject === 'string') {
        try {
          bodyObject = JSON.parse(bodyObject);
        } catch (e) {
          // Could not parse JSON - set body to null
          bodyObject = null;
        }
      }
      node = builder.body({ bodyJson: bodyObject });
    } else {
      // return { body } as Body;

      if (Array.isArray(body)) {
        // Body is an array (prosemirror like JSON)
        return { body } as Body;
      } else {
        // Body is a string (legacy bitmark v2, or not bitmark--/++)
        bodyStr = body as BreakscapedString; // TODO!! this.convertJsonTextToBreakscapedString(body, textFormat);
      }

      // Placeholders
      if (placeholders) {
        for (const [key, val] of Object.entries(placeholders)) {
          const bit = this.bodyBitToAst(val);
          placeholderNodes[key] = bit as BodyBit;
        }
      }

      if (bodyStr) {
        // Split the body string and insert the placeholders
        const bodyPartNodes: BodyPart[] = [];
        const bodyParts: BreakscapedString[] = StringUtils.splitPlaceholders(
          bodyStr,
          Object.keys(placeholderNodes),
        ) as BreakscapedString[];

        for (let i = 0, len = bodyParts.length; i < len; i++) {
          const bodyPart = bodyParts[i];

          if (placeholderNodes[bodyPart]) {
            // Replace the placeholder
            bodyPartNodes.push(placeholderNodes[bodyPart]);
          } else {
            // Treat as text
            const bodyText = this.bodyTextToAst(bodyPart);
            bodyPartNodes.push(bodyText);
          }
        }

        // node = builder.body({ bodyParts: bodyPartNodes });
        node = builder.body({ body: bodyStr });
      }
    }
    return node;
  }

  // private bodyToAst(body: JsonText, textFormat: TextFormatType, placeholders: BodyBitsJson): Body | undefined {
  //   let node: Body | undefined;
  //   let bodyStr: BreakscapedString | undefined;
  //   const placeholderNodes: {
  //     [keyof: string]: BodyBit;
  //   } = {};

  //   if (textFormat === TextFormat.json) {
  //     // If the text format is JSON, handle appropriately
  //     let bodyObject: unknown = body;

  //     // Attempt to parse a string body as JSON to support the legacy format
  //     if (typeof bodyObject === 'string') {
  //       try {
  //         bodyObject = JSON.parse(bodyObject);
  //       } catch (e) {
  //         // Could not parse JSON - set body to null
  //         bodyObject = null;
  //       }
  //     }
  //     node = builder.body({ bodyJson: bodyObject });
  //   } else {
  //     if (Array.isArray(body)) {
  //       // Body is an array (prosemirror like JSON)

  //       // Parse the body to string in case it is in JSON format
  //       bodyStr = this.convertJsonTextToBreakscapedString(body, textFormat);

  //       // Get the placeholders from the text parser
  //       placeholders = this.textGenerator.getPlaceholders();
  //     } else {
  //       // Body is a string (legacy bitmark v2, or not bitmark--/++)
  //       bodyStr = this.convertJsonTextToBreakscapedString(body, textFormat);
  //     }

  //     // Placeholders
  //     if (placeholders) {
  //       for (const [key, val] of Object.entries(placeholders)) {
  //         const bit = this.bodyBitToAst(val);
  //         placeholderNodes[key] = bit as BodyBit;
  //       }
  //     }

  //     if (bodyStr) {
  //       // Split the body string and insert the placeholders
  //       const bodyPartNodes: BodyPart[] = [];
  //       const bodyParts: BreakscapedString[] = StringUtils.splitPlaceholders(
  //         bodyStr,
  //         Object.keys(placeholderNodes),
  //       ) as BreakscapedString[];

  //       for (let i = 0, len = bodyParts.length; i < len; i++) {
  //         const bodyPart = bodyParts[i];

  //         if (placeholderNodes[bodyPart]) {
  //           // Replace the placeholder
  //           bodyPartNodes.push(placeholderNodes[bodyPart]);
  //         } else {
  //           // Treat as text
  //           const bodyText = this.bodyTextToAst(bodyPart);
  //           bodyPartNodes.push(bodyText);
  //         }
  //       }

  //       node = builder.body({ bodyParts: bodyPartNodes });
  //     }
  //   }
  //   return node;
  // }

  private bodyTextToAst(bodyText: BreakscapedString): BodyText {
    return null; // TODO builder.bodyText({ text: bodyText ?? '' }, false);
  }

  private bodyBitToAst(bit: BodyBitJson): BodyPart {
    switch (bit.type) {
      case BodyBitType.gap: {
        const gap = this.gapBitToAst(bit);
        return gap;
      }
      case BodyBitType.mark: {
        const mark = this.markBitToAst(bit);
        return mark;
      }
      case BodyBitType.select: {
        const select = this.selectBitToAst(bit);
        return select;
      }
      case BodyBitType.highlight: {
        const hightlight = this.highlightBitToAst(bit);
        return hightlight;
      }
    }
    return this.bodyTextToAst('');
  }

  private footerToAst(footerText: JsonText, textFormat: TextFormatType): Footer | undefined {
    if (!footerText) return undefined;
    return {
      footer: footerText,
    };
    const text = this.convertJsonTextToAstText(footerText, textFormat);

    if (text) {
      const footerText = builder.footerText({ text }, false);
      return builder.footer({ footerParts: [footerText] });
    }
    return undefined;
  }

  private referenceToAst(reference: string | string[]): ReferenceAndReferenceProperty {
    if (Array.isArray(reference) && reference.length > 0) {
      return {
        reference: undefined,
        referenceProperty: reference,
      };
    }

    return {
      reference: reference as string,
      referenceProperty: undefined,
    };
  }

  private gapBitToAst(bit: GapJson): Gap {
    const { item, lead, hint, instruction, example, isCaseSensitive, solutions } = bit;

    // Build bit
    const bitNode = builder.gap({
      solutions: solutions ?? [],
      ...this.parseItemLeadHintInstruction(item, lead, hint, instruction),
      ...this.parseExample(example),
      isCaseSensitive,
    });

    return bitNode;
  }

  private markBitToAst(bit: MarkJson): Mark {
    const { solution, mark, item, lead, hint, instruction, example } = bit;

    // Build bit
    const bitNode = builder.mark({
      solution: solution ?? '',
      mark,
      ...this.parseItemLeadHintInstruction(item, lead, hint, instruction),
      ...this.parseExample(example),
    });

    return bitNode;
  }

  private selectBitToAst(bit: SelectJson): Select {
    const { options, prefix, postfix, item, lead, hint, instruction, example } = bit;

    // Build options bits
    const selectOptionNodes = this.selectOptionBitsToAst(options);

    // Build bit
    const node = builder.select({
      options: selectOptionNodes,
      prefix,
      postfix,
      ...this.parseItemLeadHintInstruction(item, lead, hint, instruction),
      ...this.parseExample(example),
    });

    return node;
  }

  private highlightBitToAst(bit: HighlightJson): Highlight {
    const { texts, prefix, postfix, item, lead, hint, instruction, example } = bit;

    // Build options bits
    const highlightTextNodes = this.highlightTextBitsToAst(texts);

    // Build bit
    const node = builder.highlight({
      texts: highlightTextNodes,
      prefix,
      postfix,
      ...this.parseItemLeadHintInstruction(item, lead, hint, instruction),
      ...this.parseExample(example),
    });

    return node;
  }

  private parseItemLeadHintInstruction(
    item: JsonText,
    lead: JsonText,
    hint: JsonText,
    instruction: JsonText,
  ): ItemLeadHintInstruction {
    return {
      item: this.convertJsonTextToAstText(item),
      lead: this.convertJsonTextToAstText(lead),
      pageNumber: [] as TextAst,
      marginNumber: [] as TextAst,
      hint: this.convertJsonTextToAstText(hint),
      instruction: this.convertJsonTextToAstText(instruction),
    };
  }

  private parseItemLeadHintInstructionPageNumberMarginNumber(
    item: JsonText,
    lead: JsonText,
    hint: JsonText,
    instruction: JsonText,
    pageNumber: JsonText,
    marginNumber: JsonText,
  ): ItemLeadHintInstruction {
    return {
      item: this.convertJsonTextToAstText(item),
      lead: this.convertJsonTextToAstText(lead),
      pageNumber: this.convertJsonTextToAstText(pageNumber),
      marginNumber: this.convertJsonTextToAstText(marginNumber),
      hint: this.convertJsonTextToAstText(hint),
      instruction: this.convertJsonTextToAstText(instruction),
    };
  }

  private parseExample(example: ExampleJson | undefined): Example | undefined {
    if (example == null) return undefined;
    if (example === true) return { example: true };
    if (example === false) return { example: false };
    // return {
    //   example: example,
    // };
    const exampleStr = this.convertJsonTextToAstText(example as JsonText);
    if (exampleStr) {
      return { example: exampleStr };
    }
    return { example: !!example };
  }

  /**
   * Convert the JsonText from the JSON to the AST format:
   * Input:
   *  - Bitmark v2: breakscaped string
   *  - Bitmark v3: bitmark text JSON (TextAst)
   * Output:
   *  - breakscaped string
   *
   * In the case of Bitmark v2 type texts, there is nothing to do but cast the type.
   *
   * @param breakscaped string or TextAst or breakscaped string[] or TextAst[]
   * @param textFormat format of TextAst
   * @returns Breakscaped string or breakscaped string[]
   */
  private convertJsonTextToAstText<
    T extends JsonText | JsonText[] | undefined,
    R = T extends JsonText[] ? TextAst[] : TextAst,
  >(text: T, textFormat?: TextFormatType): R {
    // NOTE: it is ok to default to bitmarkMinusMinus here as if the text is text then it will not be an array or
    // return true from isAst() and so will be treated as a string
    textFormat = textFormat ?? TextFormat.bitmarkMinusMinus;

    const bitTagOnly = (textFormat !== TextFormat.bitmarkPlusPlus &&
      textFormat !== TextFormat.bitmarkMinusMinus) as boolean;

    if (text == null) return [] as R;
    if (this.textParser.isAst(text)) {
      // Use the text generator to convert the TextAst to breakscaped string
      // this.ast.printTree(text, NodeType.textAst);

      return text as R;
    } else if (Array.isArray(text)) {
      const strArray: TextAst[] = [];
      for (let i = 0, len = text.length; i < len; i++) {
        const t = text[i];

        if (this.textParser.isAst(t)) {
          // Use the text generator to convert the TextAst to breakscaped string
          // this.ast.printTree(text, NodeType.textAst);
          strArray[i] = t as TextAst;
        } else {
          strArray[i] = this.textParser.toAst(
            Breakscape.breakscape(t as string, {
              bitTagOnly,
            }),
          );
          // strArray[i] = t as BreakscapedString;
        }
      }
      return strArray as R;
    }

    return this.textParser.toAst(
      Breakscape.breakscape(text as string, {
        bitTagOnly,
      }),
    ) as R;
  }

  /**
   * Convert the string from the JSON to the AST format:
   * Input:
   *  - Bitmark v2/v3: string
   * Output:
   *  - breakscaped string
   *
   * In the case of Bitmark v2 type texts, there is nothing to do but cast the type.
   *
   * @param text string or TextAst or string[] or TextAst[]
   * @param textFormat format of TextAst
   * @returns Breakscaped string or breakscaped string[]
   */
  // private convertStringToBreakscapedString<T extends string | string[] | undefined>(
  //   text: T,
  // ): (T extends string[] ? BreakscapedString[] : BreakscapedString) | undefined {
  //   type R = T extends string[] ? BreakscapedString[] : BreakscapedString;

  //   if (text == null) return undefined;
  //   if (Array.isArray(text)) {
  //     const strArray: string[] = [];
  //     for (let i = 0, len = text.length; i < len; i++) {
  //       const t = text[i];

  //       strArray[i] = Breakscape.breakscape(t as string);
  //     }
  //     return strArray as R;
  //   }

  //   return Breakscape.breakscape(text as string) as R;
  // }
  // private convertStringToBreakscapedString<T extends string | string[] | undefined>(text: T): T | undefined {
  //   if (text == null) return undefined;
  //   return text;
  // }
}

export { JsonParser };
