import { Builder } from '../../ast/Builder';
import { ResourceBuilder } from '../../ast/ResourceBuilder';
import { Breakscape } from '../../breakscaping/Breakscape';
import { Config } from '../../config/Config';
import { TextGenerator } from '../../generator/text/TextGenerator';
import { BreakscapedString } from '../../model/ast/BreakscapedString';
import { JsonText, TextAst } from '../../model/ast/TextNodes';
import { BitType, BitTypeType } from '../../model/enum/BitType';
import { BodyBitType } from '../../model/enum/BodyBitType';
import { ResourceTag, ResourceTagType } from '../../model/enum/ResourceTag';
import { TextFormat, TextFormatType } from '../../model/enum/TextFormat';
import { BitWrapperJson } from '../../model/json/BitWrapperJson';
import { StringUtils } from '../../utils/StringUtils';
import { TextParser } from '../text/TextParser';

import {
  AudioResource,
  Bit,
  BitmarkAst,
  Body,
  BodyBit,
  BodyPart,
  BodyText,
  BotResponse,
  CardBit,
  Choice,
  Ingredient,
  Flashcard,
  Gap,
  Heading,
  Highlight,
  HighlightText,
  ImageResource,
  ImageSource,
  Mark,
  MarkConfig,
  Matrix,
  MatrixCell,
  Pair,
  Person,
  Question,
  Quiz,
  Resource,
  Response,
  Select,
  SelectOption,
  Statement,
  TechnicalTerm,
  Table,
  Servings,
  RatingLevelStartEnd,
  CaptionDefinitionList,
  DescriptionListItem,
  Footer,
} from '../../model/ast/Nodes';
import {
  BitJson,
  ChoiceJson,
  HeadingJson,
  MatrixJson,
  MatrixCellJson,
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
  StillImageFilmResourceJson,
  ImageResponsiveResourceJson,
  ImageResourceWrapperJson,
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
  example: TextAst | boolean;
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
    const imagePlaceholderNode = this.imagePlaceholderBitToAst(imagePlaceholder);

    // imageSource
    const imageSourceNode = this.imageSourceBitToAst(imageSource);

    // Person (partner, deprecated)
    const personNode = this.personBitToAst(person ?? partner);

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
    const pairsNodes = this.pairBitsToAst(pairs);

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
      sampleSolution: this.convertJsonTextToAstText(sampleSolution),
      additionalSolutions: this.convertJsonTextToAstText(additionalSolutions),
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

  private imageSourceBitToAst(imageSource?: ImageSourceJson): ImageSource | undefined {
    let node: ImageSource | undefined;

    if (imageSource) {
      const { url, mockupId, format, size, trim } = imageSource;
      node = builder.imageSource({
        url: url ?? '',
        mockupId: mockupId ?? '',
        format,
        size,
        trim,
      });
    }

    return node;
  }

  private imagePlaceholderBitToAst(imagePlaceholder?: ImageResourceWrapperJson): ImageResource | undefined {
    let node: ImageResource | undefined;

    if (imagePlaceholder) {
      const { image } = imagePlaceholder;
      node = this.resourceDataToAst(ResourceTag.image, image) as ImageResource | undefined;
    }

    return node;
  }

  private personBitToAst(person?: PersonJson): Person | undefined {
    let node: Person | undefined;

    if (person) {
      const avatarImage = this.resourceDataToAst(ResourceTag.image, person.avatarImage) as ImageResource | undefined;
      node = builder.person({
        name: person.name ?? '',
        title: person.title,
        avatarImage,
      });
    }

    return node;
  }

  private markConfigBitToAst(marks?: MarkConfigJson[]): MarkConfig[] | undefined {
    const nodes: MarkConfig[] = [];
    if (Array.isArray(marks)) {
      for (const m of marks) {
        const { mark, color, emphasis } = m;
        const node = builder.markConfig({
          mark: mark ?? '',
          color,
          emphasis,
        });
        nodes.push(node);
      }
    }

    if (nodes.length === 0) return undefined;

    return nodes;
  }

  private flashcardBitsToAst(flashcards?: FlashcardJson[]): Flashcard[] | undefined {
    const nodes: Flashcard[] = [];
    if (Array.isArray(flashcards)) {
      for (const c of flashcards) {
        const { question, answer, alternativeAnswers, item, lead, hint, instruction, example } = c;
        const node = builder.flashcard({
          question: this.convertJsonTextToAstText(question),
          answer: this.convertJsonTextToAstText(answer),
          alternativeAnswers: this.convertJsonTextToAstText(alternativeAnswers),
          ...this.parseItemLeadHintInstruction(item, lead, hint, instruction),
          ...this.parseExample(example),
        });
        nodes.push(node);
      }
    }

    if (nodes.length === 0) return undefined;

    return nodes;
  }

  private descriptionsBitsToAst(descriptionList?: DescriptionListItemJson[]): DescriptionListItem[] | undefined {
    const nodes: DescriptionListItem[] = [];
    if (Array.isArray(descriptionList)) {
      for (const c of descriptionList) {
        const { term, description, alternativeDescriptions, item, lead, hint, instruction, example } = c;
        const node = builder.descriptionListItem({
          term: this.convertJsonTextToAstText(term),
          description: this.convertJsonTextToAstText(description),
          alternativeDescriptions: this.convertJsonTextToAstText(alternativeDescriptions),
          ...this.parseItemLeadHintInstruction(item, lead, hint, instruction),
          ...this.parseExample(example),
        });
        nodes.push(node);
      }
    }

    if (nodes.length === 0) return undefined;

    return nodes;
  }

  private statementBitsToAst(
    statement?: string,
    isCorrect?: boolean,
    statements?: StatementJson[],
    example?: ExampleJson,
  ): Statement[] | undefined {
    const nodes: Statement[] = [];

    if (statement) {
      const node = builder.statement({
        text: statement ?? '',
        isCorrect: isCorrect ?? false,
        ...this.parseExample(example),
      });
      nodes.push(node);
    }

    if (Array.isArray(statements)) {
      for (const s of statements) {
        const { statement, isCorrect, item, lead, hint, instruction, example } = s;
        const node = builder.statement({
          text: statement ?? '',
          isCorrect,
          ...this.parseItemLeadHintInstruction(item, lead, hint, instruction),
          ...this.parseExample(example),
        });
        nodes.push(node);
      }
    }

    if (nodes.length === 0) return undefined;

    return nodes;
  }

  private choiceBitsToAst(choices?: ChoiceJson[]): Choice[] | undefined {
    const nodes: Choice[] = [];
    if (Array.isArray(choices)) {
      for (const c of choices) {
        const { choice, isCorrect, item, lead, hint, instruction, example } = c;
        const node = builder.choice({
          text: choice ?? '',
          isCorrect,
          ...this.parseItemLeadHintInstruction(item, lead, hint, instruction),
          ...this.parseExample(example),
        });
        nodes.push(node);
      }
    }

    if (nodes.length === 0) return undefined;

    return nodes;
  }

  private responseBitsToAst(bitType: BitTypeType, responses?: ResponseJson[]): Response[] | undefined {
    const nodes: Response[] = [];

    // Return early if bot response as the responses should be interpreted as bot responses
    if (Config.isOfBitType(bitType, BitType.botActionResponse)) return undefined;

    if (Array.isArray(responses)) {
      for (const r of responses) {
        const { response, isCorrect, item, lead, hint, instruction, example } = r;
        const node = builder.response({
          text: response ?? '',
          isCorrect,
          ...this.parseItemLeadHintInstruction(item, lead, hint, instruction),
          ...this.parseExample(example),
        });
        nodes.push(node);
      }
    }

    if (nodes.length === 0) return undefined;

    return nodes;
  }

  private selectOptionBitsToAst(options?: SelectOptionJson[]): SelectOption[] {
    const nodes: SelectOption[] = [];
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

  private highlightTextBitsToAst(highlightTexts?: HighlightTextJson[]): HighlightText[] {
    const nodes: HighlightText[] = [];
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

  private quizBitsToAst(bitType: BitTypeType, quizzes?: QuizJson[]): Quiz[] | undefined {
    const nodes: Quiz[] = [];
    if (Array.isArray(quizzes)) {
      for (const q of quizzes) {
        const { item, lead, hint, instruction, choices, responses } = q;
        const choiceNodes = this.choiceBitsToAst(choices);
        const responseNodes = this.responseBitsToAst(bitType, responses);
        const node = builder.quiz({
          ...this.parseItemLeadHintInstruction(item, lead, hint, instruction),
          choices: choiceNodes,
          responses: responseNodes,
        });
        nodes.push(node);
      }
    }

    if (nodes.length === 0) return undefined;

    return nodes;
  }

  private headingBitToAst(heading?: HeadingJson): Heading | undefined {
    let node: Heading | undefined;
    if (heading && Object.keys(heading).length > 0) {
      node = builder.heading({
        forKeys: heading.forKeys ?? '',
        forValues: heading.forValues ?? [],
      });
    }

    return node;
  }

  private pairBitsToAst(pairs?: PairJson[]): Pair[] | undefined {
    const nodes: Pair[] = [];
    if (Array.isArray(pairs)) {
      for (const p of pairs) {
        const { key, keyAudio, keyImage, values, item, lead, hint, instruction, example, isCaseSensitive } = p;

        const audio = this.resourceDataToAst(ResourceTag.audio, keyAudio) as AudioResource;
        const image = this.resourceDataToAst(ResourceTag.image, keyImage) as ImageResource;

        const node = builder.pair({
          key,
          keyAudio: audio,
          keyImage: image,
          values: values ?? [],
          ...this.parseItemLeadHintInstruction(item, lead, hint, instruction),
          ...this.parseExample(example),
          isCaseSensitive,
        });
        nodes.push(node);
      }
    }

    if (nodes.length === 0) return undefined;

    return nodes;
  }

  private matrixBitsToAst(matrix?: MatrixJson[]): Matrix[] | undefined {
    const nodes: Matrix[] = [];
    if (Array.isArray(matrix)) {
      for (const m of matrix) {
        const { key, cells, item, lead, hint, instruction, example } = m;
        const node = builder.matrix({
          key: key ?? '',
          cells: this.matrixCellsToAst(cells) ?? [],
          ...this.parseItemLeadHintInstruction(item, lead, hint, instruction),
          ...this.parseExample(example),
        });
        nodes.push(node);
      }
    }

    if (nodes.length === 0) return undefined;

    return nodes;
  }

  private matrixCellsToAst(matrixCells?: MatrixCellJson[]): MatrixCell[] | undefined {
    const nodes: MatrixCell[] = [];
    if (Array.isArray(matrixCells)) {
      for (const mc of matrixCells) {
        const { values, item, lead, hint, instruction, isCaseSensitive, example } = mc;

        const node = builder.matrixCell({
          values: values ?? [],
          ...this.parseItemLeadHintInstruction(item, lead, hint, instruction),
          isCaseSensitive,
          ...this.parseExample(example),
        });
        nodes.push(node);
      }
    }

    if (nodes.length === 0) return undefined;

    return nodes;
  }

  private tableToAst(table?: TableJson): Table | undefined {
    let node: Table | undefined;

    if (table) {
      const { columns, data } = table;
      node = builder.table({
        columns: columns ?? [],
        rows: data ? (data.map((row) => row ?? []) ?? []) : [],
      });
    }

    return node;
  }

  private questionBitsToAst(questions?: QuestionJson[]): Question[] | undefined {
    const nodes: Question[] = [];
    if (Array.isArray(questions)) {
      for (const q of questions) {
        const {
          question,
          partialAnswer,
          sampleSolution,
          additionalSolutions,
          item,
          lead,
          hint,
          instruction,
          example,
          reasonableNumOfChars,
        } = q;
        const node = builder.question({
          question: question ?? '',
          partialAnswer,
          sampleSolution,
          additionalSolutions,
          ...this.parseItemLeadHintInstruction(item, lead, hint, instruction),
          ...this.parseExample(example),
          reasonableNumOfChars,
        });
        nodes.push(node);
      }
    }

    if (nodes.length === 0) return undefined;

    return nodes;
  }

  private botResponseBitsToAst(bitType: BitTypeType, responses?: BotResponseJson[]): BotResponse[] | undefined {
    const nodes: BotResponse[] = [];

    // Return early if NOT bot response as the responses should be interpreted as standard responses
    if (!Config.isOfBitType(bitType, BitType.botActionResponse)) return undefined;

    if (Array.isArray(responses)) {
      for (const r of responses) {
        const { response, reaction, feedback, item, lead, hint } = r;
        const node = builder.botResponse({
          response: response ?? '',
          reaction: reaction ?? '',
          feedback: feedback ?? '',
          ...this.parseItemLeadHintInstruction(item, lead, hint, ''),
        });
        nodes.push(node);
      }
    }

    if (nodes.length === 0) return undefined;

    return nodes;
  }

  private technicalTermToAst(technicalTerm?: TechnicalTermJson): TechnicalTerm | undefined {
    let node: TechnicalTerm | undefined;

    if (technicalTerm) {
      const { technicalTerm: t, lang } = technicalTerm;
      node = builder.technicalTerm({
        technicalTerm: t ?? '',
        lang: lang ?? '',
      });
    }

    return node;
  }

  private servingsToAst(servings?: ServingsJson): Servings | undefined {
    let node: Servings | undefined;

    if (servings) {
      const { servings: s, unit, unitAbbr, decimalPlaces, disableCalculation, hint } = servings;
      node = builder.servings({
        servings: s,
        unit: unit ?? '',
        unitAbbr: unitAbbr ?? '',
        decimalPlaces: decimalPlaces ?? 1,
        disableCalculation: disableCalculation ?? false,
        hint: this.convertJsonTextToAstText(hint),
      });
    }

    return node;
  }

  private ingredientsBitsToAst(ingredients?: IngredientJson[]): Ingredient[] | undefined {
    const nodes: Ingredient[] = [];
    if (Array.isArray(ingredients)) {
      for (const i of ingredients) {
        const { title, checked, item, quantity, unit, unitAbbr, decimalPlaces, disableCalculation } = i;
        const node = builder.ingredient({
          title,
          checked,
          item: this.convertJsonTextToAstText(item),
          quantity,
          unit: unit ?? '',
          unitAbbr,
          decimalPlaces: decimalPlaces ?? 1,
          disableCalculation,
        });
        nodes.push(node);
      }
    }

    if (nodes.length === 0) return undefined;

    return nodes;
  }

  private ratingLevelStartEndToAst(ratingLevelStartEnd: RatingLevelStartEndJson): RatingLevelStartEnd | undefined {
    let node: RatingLevelStartEnd | undefined;

    if (ratingLevelStartEnd) {
      const { level, label } = ratingLevelStartEnd;

      node = builder.ratingLevelStartEnd({
        level,
        label: this.convertJsonTextToAstText(label),
      });
    }

    return node;
  }

  private captionDefinitionListToAst(
    captionDefinitionList: CaptionDefinitionListJson,
  ): CaptionDefinitionList | undefined {
    let node: CaptionDefinitionList | undefined;

    if (captionDefinitionList) {
      const { columns, definitions } = captionDefinitionList;

      node = builder.captionDefinitionList({
        columns: columns ?? [],
        definitions: (definitions ?? []).map((d) => {
          return builder.captionDefinition({
            term: this.convertJsonTextToAstText(d.term) ?? '',
            description: this.convertJsonTextToAstText(d.description) ?? '',
          });
        }),
      });
    }

    return node;
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
  ): Resource[] | undefined {
    const nodes: Resource[] | undefined = [];

    if (resource) {
      const resourceKey = ResourceTag.keyFromValue(resource.type) ?? ResourceTag.unknown;
      let data: ResourceDataJson | undefined;

      // TODO: This code should use the config to handle the combo resources. For now the logic is hardcoded

      // Handle special cases for multiple resource bits (imageResponsive, stillImageFilm)
      if (resource.type === ResourceTag.imageResponsive) {
        const r = resource as unknown as ImageResponsiveResourceJson;
        const imagePortraitNode = this.resourceDataToAst(ResourceTag.imagePortrait, r.imagePortrait);
        const imageLandscapeNode = this.resourceDataToAst(
          ResourceTag.imageLandscape,
          r.imageLandscape,
        ) as ImageResource;
        if (imagePortraitNode) nodes.push(imagePortraitNode);
        if (imageLandscapeNode) nodes.push(imageLandscapeNode);
      } else if (resource.type === ResourceTag.stillImageFilm) {
        const r = resource as unknown as StillImageFilmResourceJson;
        const imageNode = this.resourceDataToAst(ResourceTag.image, r.image);
        const audioNode = this.resourceDataToAst(ResourceTag.audio, r.audio);
        if (imageNode) nodes.push(imageNode);
        if (audioNode) nodes.push(audioNode);
      } else {
        // Standard single resource case

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data = (resource as any)[resourceKey];

        if (!data) return undefined;

        const node = this.resourceDataToAst(resource.type, data);
        if (node) nodes.push(node);
      }
    }

    if (Config.isOfBitType(bitType, [BitType.imagesLogoGrave, BitType.prototypeImages])) {
      // Add the logo images
      if (Array.isArray(images)) {
        for (const image of images) {
          const node = this.resourceDataToAst(ResourceTag.image, image.image);
          if (node) nodes.push(node);
        }
      }
    }

    return nodes;
  }

  private resourceDataToAst(type: ResourceTagType, data?: Partial<ResourceDataJson>): Resource | undefined {
    let node: Resource | undefined;

    if (data) {
      if (!data) return undefined;

      const dataAsString: string | undefined = StringUtils.isString(data) ? (data as unknown as string) : undefined;

      // url / src / href / app
      const url = data.url || data.src || data.href || data.app || data.body || dataAsString;

      // Sub resources
      const posterImage = this.resourceDataToAst(ResourceTag.image, data.posterImage) as ImageResource;
      const thumbnails = data.thumbnails
        ? data.thumbnails.map((t) => {
            return this.resourceDataToAst(ResourceTag.image, t) as ImageResource;
          })
        : undefined;

      // Resource
      node = resourceBuilder.resource({
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
        siteName: data.siteName,

        // Generic Resource
        license: data.license,
        copyright: data.copyright,
        showInIndex: data.showInIndex,
        search: data.search,
      });
    }

    return node;
  }

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
      if (Array.isArray(body)) {
        // Body is an array (prosemirror like JSON)

        // Parse the body to string in case it is in JSON format
        bodyStr = this.convertJsonTextToBreakscapedString(body, textFormat);

        // Get the placeholders from the text parser
        placeholders = this.textGenerator.getPlaceholders();
      } else {
        // Body is a string (legacy bitmark v2, or not bitmark--/++)
        bodyStr = this.convertJsonTextToBreakscapedString(body, textFormat);
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

        node = builder.body({ bodyParts: bodyPartNodes });
      }
    }
    return node;
  }

  private bodyTextToAst(bodyText: BreakscapedString): BodyText {
    return builder.bodyText({ text: bodyText ?? '' }, false);
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
  // private convertJsonTextToBreakscapedString<T extends JsonText | JsonText[] | undefined>(
  //   text: T,
  //   textFormat?: TextFormatType,
  // ): (T extends JsonText[] ? BreakscapedString[] : BreakscapedString) | undefined {
  //   type R = T extends JsonText[] ? BreakscapedString[] : BreakscapedString;
  //   // NOTE: it is ok to default to bitmarkMinusMinus here as if the text is text then it will not be an array or
  //   // return true from isAst() and so will be treated as a string
  //   textFormat = textFormat ?? TextFormat.bitmarkMinusMinus;

  //   const bitTagOnly = (textFormat !== TextFormat.bitmarkPlusPlus &&
  //     textFormat !== TextFormat.bitmarkMinusMinus) as boolean;

  //   if (text == null) return undefined;
  //   if (this.textParser.isAst(text)) {
  //     // Use the text generator to convert the TextAst to breakscaped string
  //     // this.ast.printTree(text, NodeType.textAst);
  //     const parsedText = this.textGenerator.generateSync(text as TextAst, textFormat);

  //     return parsedText as R;
  //   } else if (Array.isArray(text)) {
  //     const strArray: string[] = [];
  //     for (let i = 0, len = text.length; i < len; i++) {
  //       const t = text[i];

  //       if (this.textParser.isAst(t)) {
  //         // Use the text generator to convert the TextAst to breakscaped string
  //         // this.ast.printTree(text, NodeType.textAst);
  //         const parsedText = this.textGenerator.generateSync(t as TextAst, textFormat);

  //         strArray[i] = parsedText;
  //       } else {
  //         strArray[i] = Breakscape.breakscape(t as string, {
  //           bitTagOnly,
  //         });
  //         // strArray[i] = t as BreakscapedString;
  //       }
  //     }
  //     return strArray as R;
  //   }

  //   return Breakscape.breakscape(text as string, {
  //     bitTagOnly,
  //   }) as R;
  //   // return text as BreakscapedString as R;
  // }

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
