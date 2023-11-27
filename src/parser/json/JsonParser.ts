import { Builder } from '../../ast/Builder';
import { ResourceBuilder } from '../../ast/ResourceBuilder';
import { Breakscape } from '../../breakscaping/Breakscape';
import { Config } from '../../config/Config';
import { TextGenerator } from '../../generator/text/TextGenerator';
import { BreakscapedString } from '../../model/ast/BreakscapedString';
import { JsonText, TextAst } from '../../model/ast/TextNodes';
import { BitType, RootBitType } from '../../model/enum/BitType';
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
  Flashcard,
  FooterText,
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
  Partner,
  Question,
  Quiz,
  Resource,
  Response,
  Select,
  SelectOption,
  Statement,
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
  PartnerJson,
  BotResponseJson,
  ExampleJson,
  MarkConfigJson,
  ImageSourceJson,
  ListItemJson,
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
} from '../../model/json/ResourceJson';

interface ReferenceAndReferenceProperty {
  reference?: string;
  referenceProperty?: string | string[];
}

interface ItemLeadHintInstruction {
  item?: BreakscapedString;
  lead?: BreakscapedString;
  hint?: BreakscapedString;
  instruction?: BreakscapedString;
}

interface Example {
  example: BreakscapedString | boolean;
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
      return Config.getBitType(b.type).root !== RootBitType._error;
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
      format,
      id,
      externalId,
      spaceId,
      padletId,
      jupyterId,
      jupyterExecutionCount,
      AIGenerated,
      releaseVersion,
      ageRange,
      lang,
      language,
      computerLanguage,
      target,
      tag,
      icon,
      iconTag,
      colorTag,
      flashcardSet,
      subtype,
      bookAlias,
      coverImage,
      publisher,
      publications,
      author,
      date,
      location,
      theme,
      kind,
      action,
      thumbImage,
      focusX,
      focusY,
      duration,
      deeplink,
      externalLink,
      externalLinkText,
      videoCallLink,
      bot,
      list,
      textReference,
      isTracked,
      isInfoOnly,
      labelTrue,
      labelFalse,
      content2Buy,
      quotedPerson,
      reasonableNumOfChars,
      resolved,
      resolvedDate,
      resolvedBy,
      maxCreatedBits,
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
      hint,
      instruction,
      example,
      imageSource,
      partner,
      marks,
      resource,
      body,
      sampleSolution,
      elements,
      statement,
      isCorrect,
      cards,
      statements,
      responses,
      quizzes,
      heading,
      pairs,
      matrix,
      choices,
      questions,
      listItems,
      sections,
      footer,
      placeholders,
    } = bit;

    // Bit type
    const bitType = Config.getBitType(type);

    // Get the bit config for the bit type
    const bitConfig = Config.getBitConfig(bitType);

    // Text Format
    const textFormat = TextFormat.fromValue(format) ?? bitConfig.textFormatDefault;

    // Resource attachement type
    const resourceAttachmentType = this.getResourceType(resource);

    // resource(s)
    const resourcesNode = this.resourceBitToAst(resource);

    // body & placeholders
    const bodyNode = this.bodyToAst(body, textFormat, placeholders);

    // imageSource
    const imageSourceNode = this.imageSourceBitToAst(imageSource);

    // Partner
    const partnerNode = this.partnerBitToAst(partner);

    // Mark Config
    const markConfigNode = this.markConfigBitToAst(marks);

    // flashcards
    const flashcardNodes = this.flashcardBitsToAst(cards);

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

    //+-choice
    const choiceNodes = this.choiceBitsToAst(choices);

    // questions
    const questionNodes = this.questionBitsToAst(questions);

    // botResponses
    const botResponseNodes = this.botResponseBitsToAst(bitType, responses as BotResponseJson[]);

    // listItems / sections (cardBits)
    const cardBitNodes = this.listItemsToAst(listItems ?? sections, textFormat, placeholders);

    // footer
    const footerNode = this.footerToAst(footer, textFormat);

    // Convert reference to referenceProperty
    const { reference, referenceProperty } = this.referenceToAst(referenceIn);

    // Build bit
    const bitNode = builder.bit({
      bitType,
      textFormat: format as TextFormatType,
      resourceType: resourceAttachmentType,
      id: this.convertStringToBreakscapedString(id),
      internalComment: this.convertStringToBreakscapedString(internalComments),
      externalId: this.convertStringToBreakscapedString(externalId),
      spaceId: this.convertStringToBreakscapedString(spaceId),
      padletId: this.convertStringToBreakscapedString(padletId),
      jupyterId: this.convertStringToBreakscapedString(jupyterId),
      jupyterExecutionCount,
      aiGenerated: AIGenerated,
      releaseVersion: this.convertStringToBreakscapedString(releaseVersion),
      ageRange,
      lang: this.convertStringToBreakscapedString(lang),
      language: this.convertStringToBreakscapedString(language),
      computerLanguage: this.convertStringToBreakscapedString(computerLanguage),
      target: this.convertStringToBreakscapedString(target),
      tag: this.convertStringToBreakscapedString(tag),
      icon: this.convertStringToBreakscapedString(icon),
      iconTag: this.convertStringToBreakscapedString(iconTag),
      colorTag: this.convertStringToBreakscapedString(colorTag),
      flashcardSet: this.convertStringToBreakscapedString(flashcardSet),
      subtype: this.convertStringToBreakscapedString(subtype),
      bookAlias: this.convertStringToBreakscapedString(bookAlias),
      coverImage: this.convertStringToBreakscapedString(coverImage),
      publisher: this.convertStringToBreakscapedString(publisher),
      publications: this.convertStringToBreakscapedString(publications),
      author: this.convertStringToBreakscapedString(author),
      date: this.convertStringToBreakscapedString(date),
      location: this.convertStringToBreakscapedString(location),
      theme: this.convertStringToBreakscapedString(theme),
      kind: this.convertStringToBreakscapedString(kind),
      action: this.convertStringToBreakscapedString(action),
      duration: this.convertStringToBreakscapedString(duration),
      referenceProperty: this.convertStringToBreakscapedString(referenceProperty),
      thumbImage: this.convertStringToBreakscapedString(thumbImage),
      focusX,
      focusY,
      deeplink: this.convertStringToBreakscapedString(deeplink),
      externalLink: this.convertStringToBreakscapedString(externalLink),
      externalLinkText: this.convertStringToBreakscapedString(externalLinkText),
      videoCallLink: this.convertStringToBreakscapedString(videoCallLink),
      bot: this.convertStringToBreakscapedString(bot),
      list: this.convertStringToBreakscapedString(list),
      textReference: this.convertStringToBreakscapedString(textReference),
      isTracked,
      isInfoOnly,
      labelTrue: this.convertStringToBreakscapedString(labelTrue),
      labelFalse: this.convertStringToBreakscapedString(labelFalse),
      content2Buy: this.convertStringToBreakscapedString(content2Buy),
      quotedPerson: this.convertStringToBreakscapedString(quotedPerson),
      reasonableNumOfChars,
      resolved,
      resolvedDate: this.convertStringToBreakscapedString(resolvedDate),
      resolvedBy: this.convertStringToBreakscapedString(resolvedBy),
      maxCreatedBits,
      book: this.convertStringToBreakscapedString(book),
      title: this.convertJsonTextToBreakscapedString(title),
      subtitle: this.convertJsonTextToBreakscapedString(subtitle),
      level,
      toc,
      progress,
      anchor: this.convertStringToBreakscapedString(anchor),
      reference: this.convertStringToBreakscapedString(reference),
      referenceEnd: this.convertStringToBreakscapedString(referenceEnd),
      ...this.parseItemLeadHintInstruction(item, lead, hint, instruction),
      ...this.parseExample(example),
      imageSource: imageSourceNode,
      partner: partnerNode,
      markConfig: markConfigNode,
      resources: resourcesNode,
      body: bodyNode,
      sampleSolution: this.convertStringToBreakscapedString(sampleSolution),
      elements: this.convertStringToBreakscapedString(elements),
      flashcards: flashcardNodes,
      statements: statementNodes,
      responses: responseNodes,
      quizzes: quizNodes,
      heading: headingNode,
      pairs: pairsNodes,
      matrix: matrixNodes,
      choices: choiceNodes,
      questions: questionNodes,
      botResponses: botResponseNodes,
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
        url: this.convertStringToBreakscapedString(url) ?? Breakscape.EMPTY_STRING,
        mockupId: this.convertStringToBreakscapedString(mockupId) ?? Breakscape.EMPTY_STRING,
        format: this.convertStringToBreakscapedString(format),
        size,
        trim,
      });
    }

    return node;
  }

  private partnerBitToAst(partner?: PartnerJson): Partner | undefined {
    let node: Partner | undefined;

    if (partner) {
      const avatarImage = this.resourceDataToAst(ResourceTag.image, partner.avatarImage) as ImageResource | undefined;
      node = builder.partner({
        name: this.convertStringToBreakscapedString(partner.name) ?? Breakscape.EMPTY_STRING,
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
          mark: this.convertStringToBreakscapedString(mark) ?? Breakscape.EMPTY_STRING,
          color: this.convertStringToBreakscapedString(color),
          emphasis: this.convertStringToBreakscapedString(emphasis),
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
          question: this.convertStringToBreakscapedString(question) ?? Breakscape.EMPTY_STRING,
          answer: this.convertStringToBreakscapedString(answer),
          alternativeAnswers: this.convertStringToBreakscapedString(alternativeAnswers),
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
        text: this.convertStringToBreakscapedString(statement) ?? Breakscape.EMPTY_STRING,
        isCorrect: isCorrect ?? false,
        ...this.parseExample(example),
      });
      nodes.push(node);
    }

    if (Array.isArray(statements)) {
      for (const s of statements) {
        const { statement, isCorrect, item, lead, hint, instruction, example } = s;
        const node = builder.statement({
          text: this.convertStringToBreakscapedString(statement) ?? Breakscape.EMPTY_STRING,
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
          text: this.convertStringToBreakscapedString(choice) ?? Breakscape.EMPTY_STRING,
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

  private responseBitsToAst(bitType: BitType, responses?: ResponseJson[]): Response[] | undefined {
    const nodes: Response[] = [];

    // Return early if bot response as the responses should be interpreted as bot responses
    if (bitType.root === RootBitType.botActionResponse) return undefined;

    if (Array.isArray(responses)) {
      for (const r of responses) {
        const { response, isCorrect, item, lead, hint, instruction, example } = r;
        const node = builder.response({
          text: this.convertStringToBreakscapedString(response) ?? Breakscape.EMPTY_STRING,
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
          text: this.convertStringToBreakscapedString(text) ?? Breakscape.EMPTY_STRING,
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
          text: this.convertStringToBreakscapedString(text) ?? Breakscape.EMPTY_STRING,
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

  private quizBitsToAst(bitType: BitType, quizzes?: QuizJson[]): Quiz[] | undefined {
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
    if (heading) {
      node = builder.heading({
        forKeys: this.convertStringToBreakscapedString(heading.forKeys) ?? Breakscape.EMPTY_STRING,
        forValues: this.convertStringToBreakscapedString(heading.forValues) ?? [],
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
          key: this.convertStringToBreakscapedString(key),
          keyAudio: audio,
          keyImage: image,
          values: this.convertStringToBreakscapedString(values) ?? [],
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
          key: this.convertStringToBreakscapedString(key) ?? Breakscape.EMPTY_STRING,
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
          values: this.convertStringToBreakscapedString(values) ?? [],
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

  private questionBitsToAst(questions?: QuestionJson[]): Question[] | undefined {
    const nodes: Question[] = [];
    if (Array.isArray(questions)) {
      for (const q of questions) {
        const {
          question,
          partialAnswer,
          sampleSolution,
          item,
          lead,
          hint,
          instruction,
          example,
          reasonableNumOfChars,
        } = q;
        const node = builder.question({
          question: this.convertStringToBreakscapedString(question) ?? Breakscape.EMPTY_STRING,
          partialAnswer: this.convertStringToBreakscapedString(partialAnswer),
          sampleSolution: this.convertStringToBreakscapedString(sampleSolution),
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

  private botResponseBitsToAst(bitType: BitType, responses?: BotResponseJson[]): BotResponse[] | undefined {
    const nodes: BotResponse[] = [];

    // Return early if NOT bot response as the responses should be interpreted as standard responses
    if (bitType.root !== RootBitType.botActionResponse) return undefined;

    if (Array.isArray(responses)) {
      for (const r of responses) {
        const { response, reaction, feedback, item, lead, hint } = r;
        const node = builder.botResponse({
          response: this.convertStringToBreakscapedString(response) ?? Breakscape.EMPTY_STRING,
          reaction: this.convertStringToBreakscapedString(reaction) ?? Breakscape.EMPTY_STRING,
          feedback: this.convertStringToBreakscapedString(feedback) ?? Breakscape.EMPTY_STRING,
          item: this.convertJsonTextToBreakscapedString(item),
          lead: this.convertJsonTextToBreakscapedString(lead),
          hint: this.convertJsonTextToBreakscapedString(hint),
        });
        nodes.push(node);
      }
    }

    if (nodes.length === 0) return undefined;

    return nodes;
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
          item: this.convertJsonTextToBreakscapedString(item),
          lead: this.convertJsonTextToBreakscapedString(lead),
          hint: this.convertJsonTextToBreakscapedString(hint),
          instruction: this.convertJsonTextToBreakscapedString(instruction),
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

  private resourceBitToAst(resource?: ResourceJson): Resource[] | undefined {
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

    return nodes;
  }

  private resourceDataToAst(type: ResourceTagType, data?: Partial<ResourceDataJson>): Resource | undefined {
    let node: Resource | undefined;

    if (data) {
      if (!data) return undefined;

      const dataAsString: string | undefined = StringUtils.isString(data) ? (data as string) : undefined;

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
        value: this.convertStringToBreakscapedString(url),

        // ImageLikeResource / AudioLikeResource / VideoLikeResource / Article / Document
        format: this.convertStringToBreakscapedString(data.format),

        // ImageLikeResource
        src1x: this.convertStringToBreakscapedString(data.src1x),
        src2x: this.convertStringToBreakscapedString(data.src2x),
        src3x: this.convertStringToBreakscapedString(data.src3x),
        src4x: this.convertStringToBreakscapedString(data.src4x),
        caption: this.convertJsonTextToBreakscapedString(data.caption),

        // ImageLikeResource / VideoLikeResource
        width: data.width ?? undefined,
        height: data.height ?? undefined,
        alt: this.convertStringToBreakscapedString(data.alt),
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
        siteName: this.convertStringToBreakscapedString(data.siteName),

        // Generic Resource
        license: this.convertStringToBreakscapedString(data.license),
        copyright: this.convertStringToBreakscapedString(data.copyright),
        showInIndex: data.showInIndex,
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

    if (Array.isArray(body)) {
      // Body is an array (prosemirror like JSON)

      // Parse the body to string in case it is in JSON format
      bodyStr = this.convertJsonTextToBreakscapedString(body, textFormat);

      // Get the placeholders from the text parser
      placeholders = this.textGenerator.getPlaceholders();
    } else {
      // Body is a string (legacy)
      // bodyStr = this.parseText(body, textFormat);
      bodyStr = body as BreakscapedString;
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

    return node;
  }

  private bodyTextToAst(bodyText: BreakscapedString): BodyText {
    return builder.bodyText({ text: bodyText ?? Breakscape.EMPTY_STRING });
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
    return this.bodyTextToAst(Breakscape.EMPTY_STRING);
  }

  private footerToAst(footerText: JsonText, textFormat: TextFormatType): FooterText | undefined {
    const text = this.convertJsonTextToBreakscapedString(footerText, textFormat);

    if (text) {
      return builder.footerText({ text });
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
      solutions: this.convertStringToBreakscapedString(solutions) ?? [],
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
      solution: this.convertStringToBreakscapedString(solution) ?? Breakscape.EMPTY_STRING,
      mark: this.convertStringToBreakscapedString(mark),
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
      prefix: this.convertStringToBreakscapedString(prefix),
      postfix: this.convertStringToBreakscapedString(postfix),
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
      prefix: this.convertStringToBreakscapedString(prefix),
      postfix: this.convertStringToBreakscapedString(postfix),
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
      item: this.convertJsonTextToBreakscapedString(item),
      lead: this.convertJsonTextToBreakscapedString(lead),
      hint: this.convertJsonTextToBreakscapedString(hint),
      instruction: this.convertJsonTextToBreakscapedString(instruction),
    };
  }

  private parseExample(example: ExampleJson | undefined): Example | undefined {
    if (example == null) return undefined;
    const exampleStr = this.convertJsonTextToBreakscapedString(example as JsonText);
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
  private convertJsonTextToBreakscapedString<T extends JsonText | JsonText[] | undefined>(
    text: T,
    textFormat?: TextFormatType,
  ): (T extends JsonText[] ? BreakscapedString[] : BreakscapedString) | undefined {
    type R = T extends JsonText[] ? BreakscapedString[] : BreakscapedString;
    // NOTE: it is ok to default to bitmarkMinusMinus here as if the text is text then it will not be an array or
    // return true from isAst() and so will be treated as a string
    textFormat = textFormat ?? TextFormat.bitmarkMinusMinus;

    if (text == null) return undefined;
    if (this.textParser.isAst(text)) {
      // Use the text generator to convert the TextAst to breakscaped string
      // this.ast.printTree(text, NodeType.textAst);
      const parsedText = this.textGenerator.generateSync(text as TextAst, textFormat);

      return parsedText as R;
    } else if (Array.isArray(text)) {
      const strArray: string[] = [];
      for (let i = 0, len = text.length; i < len; i++) {
        const t = text[i];

        if (this.textParser.isAst(t)) {
          // Use the text generator to convert the TextAst to breakscaped string
          // this.ast.printTree(text, NodeType.textAst);
          const parsedText = this.textGenerator.generateSync(t as TextAst, textFormat);

          strArray[i] = parsedText;
        } else {
          // strArray[i] = Breakscape.breakscape(t as string);
          strArray[i] = t as BreakscapedString;
        }
      }
      return strArray as R;
    }

    // return Breakscape.breakscape(text as string) as R;
    return text as BreakscapedString as R;
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
  private convertStringToBreakscapedString<T extends string | string[] | undefined>(
    text: T,
  ): (T extends string[] ? BreakscapedString[] : BreakscapedString) | undefined {
    type R = T extends string[] ? BreakscapedString[] : BreakscapedString;

    if (text == null) return undefined;
    if (Array.isArray(text)) {
      const strArray: string[] = [];
      for (let i = 0, len = text.length; i < len; i++) {
        const t = text[i];

        strArray[i] = Breakscape.breakscape(t as string);
      }
      return strArray as R;
    }

    return Breakscape.breakscape(text as string) as R;
  }
}

export { JsonParser };
