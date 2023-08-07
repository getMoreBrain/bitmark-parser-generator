import { BitType, BitTypeMetadata, BitTypeType } from '../model/enum/BitType';
import { BodyBitType } from '../model/enum/BodyBitType';
import { ExampleType } from '../model/enum/ExampleType';
import { PropertyKey } from '../model/enum/PropertyKey';
import { ResourceTypeType } from '../model/enum/ResourceType';
import { TextFormat, TextFormatType } from '../model/enum/TextFormat';
import { ParserError } from '../model/parser/ParserError';
import { ParserInfo } from '../model/parser/ParserInfo';
import { ParserLocation } from '../model/parser/ParserLocation';
import { ArrayUtils } from '../utils/ArrayUtils';
import { BitUtils } from '../utils/BitUtils';
import { NumberUtils } from '../utils/NumberUtils';
import { ObjectUtils } from '../utils/ObjectUtils';
import { env } from '../utils/env/Env';

import { BaseBuilder } from './BaseBuilder';
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
  Partner,
  BodyText,
  BodyPart,
  CardNode,
  Comment,
  Decision,
  Example,
} from '../model/ast/Nodes';

interface WithExample {
  isExample: boolean;
}

interface WithExampleAndIsExample extends WithExample {
  example?: Example;
}

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
    textFormat?: TextFormatType;
    resourceType?: ResourceTypeType; // This is optional, it will be inferred from the resource
    id?: string | string[];
    externalId?: string | string[];
    spaceId?: string | string[];
    padletId?: string | string[];
    aiGenerated?: boolean;
    releaseVersion?: string | string[];
    ageRange?: number | number[];
    language?: string | string[];
    computerLanguage?: string | string[];
    subtype?: string | string[];
    coverImage?: string | string[];
    publisher?: string | string[];
    publications?: string | string[];
    author?: string | string[];
    subject?: string | string[];
    date?: string | string[];
    location?: string | string[];
    theme?: string | string[];
    kind?: string | string[];
    action?: string | string[];
    thumbImage?: string | string[];
    focusX?: number | number[];
    focusY?: number | number[];
    duration?: string | string[];
    referenceProperty?: string | string[];
    deeplink?: string | string[];
    externalLink?: string | string[];
    externalLinkText?: string | string[];
    videoCallLink?: string | string[];
    bot?: string | string[];
    list?: string | string[];
    textReference?: string | string[];
    isTracked?: boolean;
    isInfoOnly?: boolean;
    labelTrue?: string | string[];
    labelFalse?: string | string[];
    quotedPerson?: string | string[];
    partialAnswer?: string | string[];
    levelProperty?: string | string[];
    book?: string;
    title?: string;
    subtitle?: string;
    level?: number | string;
    toc?: boolean;
    progress?: boolean;
    anchor?: string;
    // If an array is passed to reference, it will be considered an "[@reference:Some text]" property
    // If a string is passed to reference, it will be considered a "[►Reference]" tag
    reference?: string;
    referenceEnd?: string;
    item?: string;
    lead?: string;
    hint?: string;
    instruction?: string;
    example?: Example;
    partner?: Partner;
    extraProperties?: {
      [key: string]: unknown | unknown[];
    };
    resource?: Resource;
    body?: Body;
    sampleSolution?: string | string[];
    elements?: string[];
    statement?: Statement;
    statements?: Statement[];
    responses?: Response[];
    quizzes?: Quiz[];
    heading?: Heading;
    pairs?: Pair[];
    matrix?: Matrix[];
    choices?: Choice[];
    questions?: Question[];
    botResponses?: BotResponse[];
    footer?: FooterText;

    markup?: string;
    parser?: ParserInfo;
  }): Bit | undefined {
    const {
      bitType,
      textFormat,
      resourceType,
      id,
      externalId,
      spaceId,
      padletId,
      aiGenerated,
      releaseVersion,
      ageRange,
      language,
      computerLanguage,
      subtype,
      coverImage,
      publisher,
      publications,
      author,
      subject,
      date,
      location,
      theme,
      kind,
      action,
      thumbImage,
      focusX,
      focusY,
      duration,
      referenceProperty,
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
      book,
      quotedPerson,
      partialAnswer,
      levelProperty,
      title,
      subtitle,
      level,
      toc,
      progress,
      anchor,
      reference,
      referenceEnd,
      item,
      lead,
      hint,
      instruction,
      partner,
      extraProperties,
      resource,
      body,
      sampleSolution,
      footer,

      markup,
      parser,
    } = data;

    const { example } = data;

    // Set the card node data
    const cardNode = this.cardNode(data);

    // Calculate the value of the example default
    const exampleDefault = ArrayUtils.asSingle(sampleSolution) ?? cardNode?.statement?.isCorrect ?? null;

    // NOTE: Node order is important and is defined here
    const node: Bit = {
      bitType,
      textFormat: TextFormat.fromValue(textFormat) ?? TextFormat.bitmarkMinusMinus,
      resourceType: BitUtils.calculateValidResourceType(bitType, resourceType, resource),
      id: this.toAstProperty(PropertyKey.id, id),
      externalId: this.toAstProperty(PropertyKey.externalId, externalId),
      spaceId: this.toAstProperty(PropertyKey.spaceId, spaceId),
      padletId: this.toAstProperty(PropertyKey.padletId, padletId),
      aiGenerated: this.toAstProperty(PropertyKey.aiGenerated, aiGenerated),
      releaseVersion: this.toAstProperty(PropertyKey.releaseVersion, releaseVersion),
      book,
      ageRange: this.toAstProperty(PropertyKey.ageRange, ageRange),
      language: this.toAstProperty(PropertyKey.language, language),
      computerLanguage: this.toAstProperty(PropertyKey.computerLanguage, computerLanguage),
      subtype: this.toAstProperty(PropertyKey.subtype, subtype),
      coverImage: this.toAstProperty(PropertyKey.coverImage, coverImage),
      publisher: this.toAstProperty(PropertyKey.publisher, publisher),
      publications: this.toAstProperty(PropertyKey.publications, publications),
      author: this.toAstProperty(PropertyKey.author, author),
      subject: this.toAstProperty(PropertyKey.subject, subject),
      date: this.toAstProperty(PropertyKey.date, date),
      location: this.toAstProperty(PropertyKey.location, location),
      theme: this.toAstProperty(PropertyKey.theme, theme),
      kind: this.toAstProperty(PropertyKey.kind, kind),
      action: this.toAstProperty(PropertyKey.action, action),
      thumbImage: this.toAstProperty(PropertyKey.thumbImage, thumbImage),
      focusX: this.toAstProperty(PropertyKey.focusX, focusX),
      focusY: this.toAstProperty(PropertyKey.focusY, focusY),
      deeplink: this.toAstProperty(PropertyKey.deeplink, deeplink),
      externalLink: this.toAstProperty(PropertyKey.externalLink, externalLink),
      externalLinkText: this.toAstProperty(PropertyKey.externalLinkText, externalLinkText),
      videoCallLink: this.toAstProperty(PropertyKey.videoCallLink, videoCallLink),
      bot: this.toAstProperty(PropertyKey.bot, bot),
      duration: this.toAstProperty(PropertyKey.duration, duration),
      referenceProperty: this.toAstProperty(PropertyKey.reference, referenceProperty),
      list: this.toAstProperty(PropertyKey.list, list),
      textReference: this.toAstProperty(PropertyKey.textReference, textReference),
      isTracked: this.toAstProperty(PropertyKey.isTracked, isTracked),
      isInfoOnly: this.toAstProperty(PropertyKey.isInfoOnly, isInfoOnly),
      labelTrue: this.toAstProperty(PropertyKey.labelTrue, labelTrue),
      labelFalse: this.toAstProperty(PropertyKey.labelFalse, labelFalse),
      quotedPerson: this.toAstProperty(PropertyKey.quotedPerson, quotedPerson),
      partialAnswer: this.toAstProperty(PropertyKey.partialAnswer, partialAnswer),
      levelProperty: this.toAstProperty(PropertyKey.level, levelProperty),
      title,
      subtitle,
      level: NumberUtils.asNumber(level),
      toc: this.toAstProperty(PropertyKey.toc, toc),
      progress: this.toAstProperty(PropertyKey.progress, progress),
      anchor,
      reference,
      referenceEnd,
      itemLead: this.itemLead(item, lead),
      hint,
      instruction,
      ...this.toExample(example, exampleDefault),
      partner,
      resource,
      body,
      sampleSolution: ArrayUtils.asArray(sampleSolution),
      cardNode,
      footer,

      markup,
      parser,

      // Must always be last in the AST so key clashes are avoided correctly with other properties
      extraProperties: this.parseExtraProperties(extraProperties),
    };

    // If example is set at the bit level, push it down the tree
    if (example !== undefined) {
      if (cardNode) {
        this.setDefaultExamplesDecision(true, cardNode.choices);
        this.setDefaultExamplesDecision(false, cardNode.responses, cardNode.statements, cardNode.statement);
        if (cardNode.quizzes) {
          for (const quiz of cardNode.quizzes) {
            this.setDefaultExamplesDecision(true, quiz.choices);
            this.setDefaultExamplesDecision(false, quiz.responses);
          }
        }
      }
      if (body) {
        this.setDefaultExamplesBodyBits(body);
      }

      this.setDefaultExampleBit(bitType, node);
    }

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
    item?: string;
    lead?: string;
    hint?: string;
    instruction?: string;
    example?: Example;
    isCaseSensitive?: boolean;
  }): Choice {
    const { text, isCorrect, item, lead, hint, instruction, example, isCaseSensitive } = data;

    // NOTE: Node order is important and is defined here
    const node: Choice = {
      text,
      isCorrect: !!isCorrect,
      itemLead: this.itemLead(item, lead),
      hint,
      instruction,
      ...this.toExampleBoolean(example, !!isCorrect),
      isCaseSensitive,
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
    text: string;
    isCorrect: boolean;
    item?: string;
    lead?: string;
    hint?: string;
    instruction?: string;
    example?: Example;
    isCaseSensitive?: boolean;
  }): Response {
    const { text, isCorrect, item, lead, hint, instruction, example, isCaseSensitive } = data;

    // NOTE: Node order is important and is defined here
    const node: Response = {
      text,
      isCorrect: !!isCorrect,
      itemLead: this.itemLead(item, lead),
      hint,
      instruction,
      ...this.toExampleBoolean(example, !!isCorrect),
      isCaseSensitive,
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
    response: string;
    reaction: string;
    feedback: string;
    item?: string;
    lead?: string;
    hint?: string;
  }): BotResponse {
    const { response, reaction, feedback, item, lead, hint } = data;

    // NOTE: Node order is important and is defined here
    const node: BotResponse = {
      response,
      reaction,
      feedback,
      itemLead: this.itemLead(item, lead),
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
    item?: string;
    lead?: string;
    hint?: string;
    instruction?: string;
    example?: unknown;
    choices?: Choice[];
    responses?: Response[];
  }): Quiz {
    const { choices, responses, item, lead, hint, instruction, example } = data;

    if (example !== undefined) {
      this.setDefaultExamplesDecision(true, choices);
      this.setDefaultExamplesDecision(false, responses);
    }

    // NOTE: Node order is important and is defined here
    const node: Quiz = {
      itemLead: this.itemLead(item, lead),
      hint,
      instruction,
      choices,
      responses,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node);

    return node;
  }

  /**
   * Build heading node
   *
   * @param data - data for the node
   * @returns
   */
  heading(data: { forKeys: string; forValues: string | string[] }): Heading | undefined {
    const { forKeys, forValues } = data;

    if (forKeys == null) return undefined;

    // NOTE: Node order is important and is defined here
    const node: Heading = {
      forKeys: forKeys || '',
      forValues: ArrayUtils.asArray(forValues) ?? [],
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node);

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
    keyAudio?: AudioResource;
    keyImage?: ImageResource;
    values: string[];
    item?: string;
    lead?: string;
    hint?: string;
    instruction?: string;
    example?: Example;
    isCaseSensitive?: boolean;
    isShortAnswer?: boolean;
  }): Pair {
    const { key, keyAudio, keyImage, values, item, lead, hint, instruction, example, isCaseSensitive, isShortAnswer } =
      data;

    // NOTE: Node order is important and is defined here
    const node: Pair = {
      key,
      keyAudio,
      keyImage,
      itemLead: this.itemLead(item, lead),
      hint,
      instruction,
      ...this.toExample(example, true),
      isCaseSensitive,
      isShortAnswer,
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
    key: string;
    cells: MatrixCell[];
    item?: string;
    lead?: string;
    hint?: string;
    instruction?: string;
    example?: Example;
    isCaseSensitive?: boolean;
    isShortAnswer?: boolean;
  }): Matrix {
    const { key, cells, item, lead, hint, instruction, example, isCaseSensitive, isShortAnswer } = data;

    // NOTE: Node order is important and is defined here
    const node: Matrix = {
      key,
      itemLead: this.itemLead(item, lead),
      hint,
      instruction,
      ...this.toExample(example, null),
      isCaseSensitive,
      isShortAnswer,
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
    item?: string;
    lead?: string;
    hint?: string;
    instruction?: string;
    example?: Example;
  }): MatrixCell {
    const { values, item, lead, hint, instruction, example } = data;

    // NOTE: Node order is important and is defined here
    const node: MatrixCell = {
      values,
      itemLead: this.itemLead(item, lead),
      hint,
      instruction,
      ...this.toExample(example, true),
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
    });

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
    item?: string;
    lead?: string;
    hint?: string;
    instruction?: string;
    example?: Example;
    isCaseSensitive?: boolean;
    isShortAnswer?: boolean;
  }): Question {
    const {
      question,
      partialAnswer,
      item,
      lead,
      hint,
      instruction,
      example,
      isCaseSensitive,
      isShortAnswer,
      sampleSolution,
    } = data;

    // NOTE: Node order is important and is defined here
    const node: Question = {
      itemLead: this.itemLead(item, lead),
      question,
      partialAnswer,
      hint,
      instruction,
      ...this.toExample(example, sampleSolution ?? null),
      isCaseSensitive,
      isShortAnswer,
      sampleSolution,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreEmptyString: ['question'],
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
  body(data: { bodyParts: BodyPart[] }): Body {
    const { bodyParts } = data;

    const node: Body = {
      bodyParts,
    };

    return node;
  }

  /**
   * Build bodyPartText node
   *
   * @param data - data for the node
   * @returns
   */
  bodyText(data: { text: string }): BodyText {
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
  footerText(data: { text: string }): FooterText {
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
    solutions: string[];
    item?: string;
    lead?: string;
    hint?: string;
    instruction?: string;
    example?: Example;
    isCaseSensitive?: boolean;
  }): Gap {
    const { solutions, item, lead, hint, instruction, example, isCaseSensitive } = data;

    const defaultExample = Array.isArray(solutions) && solutions.length === 1 ? solutions[0] : null;

    // NOTE: Node order is important and is defined here
    const node: Gap = {
      type: BodyBitType.gap,
      data: {
        solutions,
        itemLead: this.itemLead(item, lead),
        hint,
        instruction,
        ...this.toExample(example, defaultExample),
        isCaseSensitive,
      },
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
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
    options: SelectOption[];
    prefix?: string;
    postfix?: string;
    item?: string;
    lead?: string;
    hint?: string;
    instruction?: string;
    example?: Example;
    isCaseSensitive?: boolean;
  }): Select {
    const { options, prefix, postfix, item, lead, hint, instruction, isCaseSensitive } = data;

    // NOTE: Node order is important and is defined here
    const node: Select = {
      type: BodyBitType.select,
      data: {
        prefix,
        options,
        postfix,
        itemLead: this.itemLead(item, lead),
        hint,
        instruction,
        isCaseSensitive,
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
    text: string;
    isCorrect: boolean;
    item?: string;
    lead?: string;
    hint?: string;
    instruction?: string;
    example?: Example;
    isCaseSensitive?: boolean;
  }): SelectOption {
    const { text, isCorrect, item, lead, hint, instruction, example, isCaseSensitive } = data;

    // NOTE: Node order is important and is defined here
    const node: SelectOption = {
      text,
      isCorrect: !!isCorrect,
      itemLead: this.itemLead(item, lead),
      hint,
      instruction,
      ...this.toExample(example, !!isCorrect),
      isCaseSensitive,
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
    prefix?: string;
    postfix?: string;
    item?: string;
    lead?: string;
    hint?: string;
    instruction?: string;
    example?: Example;
    isCaseSensitive?: boolean;
  }): Highlight {
    const { texts, prefix, postfix, item, lead, hint, instruction, isCaseSensitive } = data;

    // NOTE: Node order is important and is defined here
    const node: Highlight = {
      type: BodyBitType.highlight,
      data: {
        prefix,
        texts,
        postfix,
        itemLead: this.itemLead(item, lead),
        hint,
        instruction,
        isCaseSensitive,
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
    text: string;
    isCorrect: boolean;
    isHighlighted: boolean;
    item?: string;
    lead?: string;
    hint?: string;
    instruction?: string;
    example?: Example;
    isCaseSensitive?: boolean;
  }): HighlightText {
    const { text, isCorrect, isHighlighted, item, lead, hint, instruction, example, isCaseSensitive } = data;

    // NOTE: Node order is important and is defined here
    const node: HighlightText = {
      text,
      isCorrect: !!isCorrect,
      isHighlighted: !!isHighlighted,
      itemLead: this.itemLead(item, lead),
      hint,
      instruction,
      ...this.toExample(example, !!isCorrect),
      isCaseSensitive,
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
    text: string;
    isCorrect: boolean;
    item?: string;
    lead?: string;
    hint?: string;
    instruction?: string;
    example?: Example;
    isCaseSensitive?: boolean;
  }): Statement {
    const { text, isCorrect, item, lead, hint, instruction, example, isCaseSensitive } = data;

    // NOTE: Node order is important and is defined here
    const node: Statement = {
      text,
      isCorrect: !!isCorrect,
      itemLead: this.itemLead(item, lead),
      hint,
      instruction,
      ...this.toExample(example, !!isCorrect),
      isCaseSensitive,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
    });

    return node;
  }

  /**
   * Build (chat) partner node
   *
   * @param data - data for the node
   * @returns
   */
  partner(data: { name: string; avatarImage?: ImageResource }): Partner {
    const { name, avatarImage } = data;

    // NOTE: Node order is important and is defined here
    const node: Partner = {
      name,
      avatarImage,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node);

    return node;
  }

  /**
   * Build comment node
   *
   * @param data - data for the node
   * @returns
   */
  comment(data: {
    text: string;
    location?: {
      start: ParserLocation;
      end: ParserLocation;
    };
  }): Comment {
    const { text, location } = data;

    // NOTE: Node order is important and is defined here
    const node: Comment = {
      text,
      location,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node);

    return node;
  }

  //
  // Private
  //

  private itemLead(item: string | undefined, lead: string | undefined): ItemLead | undefined {
    let node: ItemLead | undefined;

    // NOTE: Node order is important and is defined here
    if (item || lead) {
      node = {
        item,
        lead,
      };
    }

    return node;
  }

  private cardNode(data: {
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
    botResponses?: BotResponse[];
  }): CardNode | undefined {
    let node: CardNode | undefined;
    const {
      questions,
      elements,
      statement,
      statements,
      choices,
      responses,
      quizzes,
      heading,
      pairs,
      matrix,
      botResponses,
    } = data;

    if (
      questions ||
      elements ||
      statement ||
      statements ||
      choices ||
      responses ||
      quizzes ||
      heading ||
      pairs ||
      matrix ||
      botResponses
    ) {
      node = {
        questions,
        elements,
        statement,
        statements,
        choices,
        responses,
        quizzes,
        heading,
        pairs,
        matrix,
        botResponses,
      };

      // Remove Unset Optionals
      ObjectUtils.removeUnwantedProperties(node);
    }

    return node;
  }

  /**
   * Set every correct answer as an example for Decision node(s)
   *
   * @param answers - array of answers
   * @returns true if any of the answers has an example, otherwise undefined
   */
  private setDefaultExamplesDecision(onlyCorrect: boolean, ...decisions: (Decision | Decision[] | undefined)[]): void {
    if (Array.isArray(decisions)) {
      for (const ds of decisions) {
        if (Array.isArray(ds)) {
          for (const d of ds) {
            if (d.example == undefined && (!onlyCorrect || d.isCorrect)) {
              d.example = this.toExampleBoolean(null, d.isCorrect).example;
            }
          }
        } else if (ds) {
          if (ds.example == undefined && (!onlyCorrect || ds.isCorrect)) {
            ds.example = this.toExampleBoolean(null, ds.isCorrect).example;
          }
        }
      }
    }
  }

  private setDefaultExamplesBodyBits(body: Body | undefined): void {
    if (!body || !body.bodyParts || body.bodyParts.length === 0) return;

    for (const part of body.bodyParts) {
      if (part) {
        switch (part.type) {
          case BodyBitType.gap: {
            const gap = part as Gap;
            if (gap.data.example == undefined) {
              gap.data.example = gap.data.solutions.length > 0 ? gap.data.solutions[0] : '';
            }
            break;
          }
          case BodyBitType.select: {
            const select = part as Select;
            for (const option of select.data.options) {
              if (option.example == undefined && option.isCorrect) {
                option.example = this.toExampleBoolean(null, option.isCorrect).example;
              }
            }
            break;
          }
          case BodyBitType.highlight: {
            const highlight = part as Highlight;
            for (const text of highlight.data.texts) {
              if (text.example == undefined && text.isCorrect) {
                text.example = this.toExampleBoolean(null, text.isCorrect).example;
              }
            }
            break;
          }
        }
      }
    }
  }

  private setDefaultExampleBit(bitType: BitTypeType, node: Bit): void {
    const { example: exampleIn } = node;
    const meta = BitType.getMetadata<BitTypeMetadata>(bitType);
    if (!meta) return;

    if (exampleIn === null) {
      // Set the default for the specific bit
      switch (meta.exampleType) {
        case ExampleType.boolean:
          node.example = true;
          break;
        case ExampleType.string:
          node.example = '';
          break;
        default:
        // Ignore at this level
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

    const checkIsExample = (example: WithExampleAndIsExample): boolean => {
      if (!example) return false;

      if (example.example !== undefined) {
        example.isExample = true;
        bit.isExample = true;
      } else {
        example.isExample = false;
      }
      return example.isExample;
    };

    const { body, cardNode } = bit;

    // Body bit level

    if (body && body.bodyParts) {
      for (const bodyPart of body.bodyParts) {
        switch (bodyPart.type) {
          case BodyBitType.gap: {
            checkIsExample(bodyPart.data as WithExampleAndIsExample);
            break;
          }

          case BodyBitType.select: {
            const select = bodyPart as Select;
            let hasExample = false;
            for (const option of select.data.options) {
              hasExample = checkIsExample(option as WithExampleAndIsExample) ? true : hasExample;
            }
            select.data.isExample = hasExample;
            break;
          }

          case BodyBitType.highlight: {
            const highlight = bodyPart as Highlight;
            let hasExample = false;
            for (const text of highlight.data.texts) {
              hasExample = checkIsExample(text as WithExampleAndIsExample) ? true : hasExample;
            }
            highlight.data.isExample = hasExample;
            break;
          }
        }
      }
    }

    // Card level

    if (cardNode) {
      // pairs
      for (const v of cardNode.pairs ?? []) {
        checkIsExample(v as WithExampleAndIsExample);
      }
      // matrix
      for (const mx of cardNode.matrix ?? []) {
        let hasExample = false;

        // matrix cell
        for (const v of mx.cells ?? []) {
          hasExample = checkIsExample(v as WithExampleAndIsExample) ? true : hasExample;
        }
        mx.isExample = hasExample;
      }
      // quizzes
      for (const quiz of cardNode.quizzes ?? []) {
        let hasExample = false;

        // responses
        for (const v of quiz.responses ?? []) {
          hasExample = checkIsExample(v as WithExampleAndIsExample) ? true : hasExample;
        }
        // choices
        for (const v of quiz.choices ?? []) {
          hasExample = checkIsExample(v as WithExampleAndIsExample) ? true : hasExample;
        }
        quiz.isExample = hasExample;
      }
      // responses
      for (const v of cardNode.responses ?? []) {
        checkIsExample(v as WithExampleAndIsExample);
      }
      // choices
      for (const v of cardNode.choices ?? []) {
        checkIsExample(v as WithExampleAndIsExample);
      }
      // statements
      for (const v of cardNode.statements ?? []) {
        checkIsExample(v as WithExampleAndIsExample);
      }
      // statement
      checkIsExample(cardNode.statement as WithExampleAndIsExample);
      // NO: elements
      // questions
      for (const v of cardNode.questions ?? []) {
        checkIsExample(v as WithExampleAndIsExample);
      }
    }

    // Bit level

    // statement
    checkIsExample(bit.statement as WithExampleAndIsExample);
    // responses
    for (const v of bit.responses ?? []) {
      checkIsExample(v as WithExampleAndIsExample);
    }
    // choices
    for (const v of bit.choices ?? []) {
      checkIsExample(v as WithExampleAndIsExample);
    }

    // Bit itself
    checkIsExample(bit as WithExampleAndIsExample);
  }

  private setDefaultBitValues(bit: Bit) {
    // Set AIGenerated == true for all AI generated bits
    switch (bit.bitType) {
      case BitType.articleAi:
      case BitType.noteAi:
      case BitType.summaryAi:
        bit.aiGenerated = this.toAstProperty(PropertyKey.aiGenerated, true);
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
