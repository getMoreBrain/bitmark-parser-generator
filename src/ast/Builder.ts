import { BitType, BitTypeType } from '../model/enum/BitType';
import { BodyBitType } from '../model/enum/BodyBitType';
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
  Partner,
  BodyText,
  BodyPart,
  CardNode,
  Comment,
  Example,
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
    isDefaultExample?: boolean;
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
      isDefaultExample,
      example,
      partner,
      extraProperties,
      resource,
      body,
      sampleSolution,
      footer,

      markup,
      parser,
    } = data;

    // Set the card node data
    const cardNode = this.cardNode(data);

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
      ...this.toExample(isDefaultExample, example),
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

    // If isDefaultExample is set at the bit level, push the default example down the tree to the relevant nodes
    if (isDefaultExample) {
      if (cardNode) {
        this.setDefaultExamplesFlags(true, cardNode.choices as WithExample[]);
        this.setDefaultExamplesFlags(
          false,
          cardNode.responses as WithExample[],
          cardNode.statements as WithExample[],
          cardNode.statement as WithExample,
          cardNode.pairs as WithExample[],
        );
        if (cardNode.quizzes) {
          for (const quiz of cardNode.quizzes) {
            this.setDefaultExamplesFlags(true, quiz.choices);
            this.setDefaultExamplesFlags(false, quiz.responses);
          }
        }
        if (cardNode.matrix) {
          for (const m of cardNode.matrix) {
            this.setDefaultExamplesFlags(false, m.cells);
          }
        }
      }
      if (body) {
        this.setDefaultExamplesBodyBits(body);
      }

      // this.setDefaultExampleBit(bitType, node);
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
    isCaseSensitive?: boolean;
    isDefaultExample?: boolean;
    example?: Example;
  }): Choice {
    const { text, isCorrect, item, lead, hint, instruction, isCaseSensitive, isDefaultExample, example } = data;

    // NOTE: Node order is important and is defined here
    const node: Choice = {
      text,
      isCorrect: !!isCorrect,
      itemLead: this.itemLead(item, lead),
      hint,
      instruction,
      ...this.toExampleBoolean(isDefaultExample, example),
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
    isCaseSensitive?: boolean;
    isDefaultExample?: boolean;
    example?: Example;
  }): Response {
    const { text, isCorrect, item, lead, hint, instruction, isCaseSensitive, isDefaultExample, example } = data;

    // NOTE: Node order is important and is defined here
    const node: Response = {
      text,
      isCorrect: !!isCorrect,
      itemLead: this.itemLead(item, lead),
      hint,
      instruction,
      ...this.toExampleBoolean(isDefaultExample, example),
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
    isDefaultExample?: unknown;
    choices?: Choice[];
    responses?: Response[];
  }): Quiz {
    const { choices, responses, item, lead, hint, instruction, isDefaultExample } = data;

    if (isDefaultExample) {
      this.setDefaultExamplesFlags(true, choices);
      this.setDefaultExamplesFlags(false, responses);
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
    isCaseSensitive?: boolean;
    isShortAnswer?: boolean;
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
      hint,
      instruction,
      isCaseSensitive,
      isShortAnswer,
      isDefaultExample,
      example,
    } = data;

    // NOTE: Node order is important and is defined here
    const node: Pair = {
      key,
      keyAudio,
      keyImage,
      itemLead: this.itemLead(item, lead),
      hint,
      instruction,
      ...this.toExample(isDefaultExample, example),
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
    isCaseSensitive?: boolean;
    isShortAnswer?: boolean;
    isDefaultExample?: boolean;
  }): Matrix {
    const { key, cells, item, lead, hint, instruction, isCaseSensitive, isShortAnswer, isDefaultExample } = data;

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
      itemLead: this.itemLead(item, lead),
      hint,
      instruction,
      isCaseSensitive,
      isShortAnswer,
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
    item?: string;
    lead?: string;
    hint?: string;
    instruction?: string;
    isDefaultExample?: boolean;
    example?: Example;
  }): MatrixCell {
    const { values, item, lead, hint, instruction, isDefaultExample, example } = data;

    // NOTE: Node order is important and is defined here
    const node: MatrixCell = {
      values,
      itemLead: this.itemLead(item, lead),
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
    isCaseSensitive?: boolean;
    isShortAnswer?: boolean;
    isDefaultExample?: boolean;
    example?: Example;
  }): Question {
    const {
      question,
      partialAnswer,
      item,
      lead,
      hint,
      instruction,
      isCaseSensitive,
      isShortAnswer,
      sampleSolution,
      isDefaultExample,
      example,
    } = data;

    // NOTE: Node order is important and is defined here
    const node: Question = {
      itemLead: this.itemLead(item, lead),
      question,
      partialAnswer,
      hint,
      instruction,
      ...this.toExample(isDefaultExample, example),
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
    isCaseSensitive?: boolean;
    isDefaultExample?: boolean;
    example?: Example;
  }): Gap {
    const { solutions, item, lead, hint, instruction, isCaseSensitive, isDefaultExample, example } = data;

    // const defaultExample = Array.isArray(solutions) && solutions.length === 1 ? solutions[0] : null;

    // NOTE: Node order is important and is defined here
    const node: Gap = {
      type: BodyBitType.gap,
      data: {
        solutions,
        itemLead: this.itemLead(item, lead),
        hint,
        instruction,
        ...this.toExample(isDefaultExample, example),
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
    isCaseSensitive?: boolean;
    isDefaultExample?: boolean;
    example?: Example;
  }): SelectOption {
    const { text, isCorrect, item, lead, hint, instruction, isCaseSensitive, isDefaultExample, example } = data;

    // NOTE: Node order is important and is defined here
    const node: SelectOption = {
      text,
      isCorrect: !!isCorrect,
      itemLead: this.itemLead(item, lead),
      hint,
      instruction,
      ...this.toExample(isDefaultExample, example),
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
    isCaseSensitive?: boolean;
    isDefaultExample?: boolean;
    example?: Example;
  }): HighlightText {
    const {
      text,
      isCorrect,
      isHighlighted,
      item,
      lead,
      hint,
      instruction,
      isCaseSensitive,
      isDefaultExample,
      example,
    } = data;

    // NOTE: Node order is important and is defined here
    const node: HighlightText = {
      text,
      isCorrect: !!isCorrect,
      isHighlighted: !!isHighlighted,
      itemLead: this.itemLead(item, lead),
      hint,
      instruction,
      ...this.toExample(isDefaultExample, example),
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
    isCaseSensitive?: boolean;
    isDefaultExample?: boolean;
    example?: Example;
  }): Statement {
    const { text, isCorrect, item, lead, hint, instruction, isCaseSensitive, isDefaultExample, example } = data;

    // NOTE: Node order is important and is defined here
    const node: Statement = {
      text,
      isCorrect: !!isCorrect,
      itemLead: this.itemLead(item, lead),
      hint,
      instruction,
      ...this.toExampleBoolean(isDefaultExample, example),
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
  private setDefaultExamplesFlags(onlyCorrect: boolean, ...nodes: (WithExample | WithExample[] | undefined)[]): void {
    if (Array.isArray(nodes)) {
      for (const ds of nodes) {
        if (Array.isArray(ds)) {
          for (const d of ds) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (!d.isExample && (!onlyCorrect || (d as any).isCorrect)) {
              d.isDefaultExample = true;
              d.isExample = true;
            }
          }
        } else if (ds) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (!ds.isExample && (!onlyCorrect || (ds as any).isCorrect)) {
            ds.isDefaultExample = true;
            ds.isExample = true;
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
            if (!gap.data.isExample) {
              gap.data.isDefaultExample = true;
              gap.data.isExample = true;
            }
            break;
          }
          case BodyBitType.select: {
            const select = part as Select;
            for (const option of select.data.options) {
              if (!option.isExample && option.isCorrect) {
                option.isDefaultExample = true;
                option.isExample = true;
              }
            }
            break;
          }
          case BodyBitType.highlight: {
            const highlight = part as Highlight;
            for (const text of highlight.data.texts) {
              if (!text.isExample && text.isCorrect) {
                text.isDefaultExample = true;
                text.isExample = true;
              }
            }
            break;
          }
        }
      }
    }
  }

  // private setDefaultExampleBit(bitType: BitTypeType, node: Bit): void {
  //   const { example: exampleIn } = node;
  //   const meta = BitType.getMetadata<BitTypeMetadata>(bitType);
  //   if (!meta) return;

  //   if (exampleIn === null) {
  //     // Set the default for the specific bit
  //     switch (meta.exampleType) {
  //       case ExampleType.boolean:
  //         node.example = true;
  //         break;
  //       case ExampleType.string:
  //         node.example = '';
  //         break;
  //       default:
  //       // Ignore at this level
  //     }
  //   }
  // }

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
          case BodyBitType.gap: {
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
