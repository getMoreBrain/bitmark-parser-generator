import { BitTypeType } from '../model/enum/BitType';
import { BodyBitType } from '../model/enum/BodyBitType';
import { PropertyKey } from '../model/enum/PropertyKey';
import { ResourceTypeType } from '../model/enum/ResourceType';
import { TextFormat, TextFormatType } from '../model/enum/TextFormat';
import { ParserError } from '../model/parser/ParserError';
import { ParserInfo } from '../model/parser/ParserInfo';
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
    padletId?: string | string[];
    releaseVersion?: string | string[];
    ageRange?: number | number[];
    language?: string | string[];
    computerLanguage?: string | string[];
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
    example?: string | boolean;
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

    bitmark?: string;
    parser?: ParserInfo;
  }): Bit | undefined {
    const {
      bitType,
      textFormat,
      resourceType,
      id,
      externalId,
      padletId,
      releaseVersion,
      ageRange,
      language,
      computerLanguage,
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
      example,
      partner,
      extraProperties,
      resource,
      body,
      sampleSolution,
      elements,
      statement,
      statements,
      responses,
      quizzes,
      heading,
      pairs,
      matrix,
      choices,
      questions,
      botResponses,
      footer,

      bitmark,
      parser,
    } = data;

    // NOTE: Node order is important and is defined here
    const node: Bit = {
      bitType,
      textFormat: TextFormat.fromValue(textFormat) ?? TextFormat.bitmarkMinusMinus,
      resourceType: BitUtils.calculateValidResourceType(bitType, resourceType, resource),
      id: this.toAstProperty(PropertyKey.id, id),
      externalId: this.toAstProperty(PropertyKey.externalId, externalId),
      padletId: this.toAstProperty(PropertyKey.padletId, padletId),
      releaseVersion: this.toAstProperty(PropertyKey.releaseVersion, releaseVersion),
      book,
      ageRange: this.toAstProperty(PropertyKey.ageRange, ageRange),
      language: this.toAstProperty(PropertyKey.language, language),
      computerLanguage: this.toAstProperty(PropertyKey.computerLanguage, computerLanguage),
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
      example: this.toExample(example),
      partner,
      resource,
      body,
      sampleSolution: ArrayUtils.asArray(sampleSolution),
      elements,
      statement,
      statements,
      responses,
      quizzes,
      heading,
      pairs,
      matrix,
      choices,
      questions,
      botResponses,
      footer,

      bitmark,
      parser,

      // Must always be last in the AST so key clashes are avoided correctly with other properties
      extraProperties: this.parseExtraProperties(extraProperties),
    };

    // Add the version to the parser info
    this.addVersionToParserInfo(node);

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node);

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
    example?: string | boolean;
    isCaseSensitive?: boolean;
  }): Choice {
    const { text, isCorrect, item, lead, hint, instruction, example, isCaseSensitive } = data;

    // NOTE: Node order is important and is defined here
    const node: Choice = {
      text,
      isCorrect,
      itemLead: this.itemLead(item, lead),
      hint,
      instruction,
      example: this.toExample(example),
      isCaseSensitive,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node);

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
    example?: string | boolean;
    isCaseSensitive?: boolean;
  }): Response {
    const { text, isCorrect, item, lead, hint, instruction, example, isCaseSensitive } = data;

    // NOTE: Node order is important and is defined here
    const node: Response = {
      text,
      isCorrect,
      itemLead: this.itemLead(item, lead),
      hint,
      instruction,
      example: this.toExample(example),
      isCaseSensitive,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node);

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
    ObjectUtils.removeUnwantedProperties(node);

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
    example?: string | boolean;
    choices?: Choice[];
    responses?: Response[];
  }): Quiz {
    const { choices, responses, item, lead, hint, instruction, example } = data;

    // NOTE: Node order is important and is defined here
    const node: Quiz = {
      itemLead: this.itemLead(item, lead),
      hint,
      instruction,
      example: this.toExample(example),
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
  heading(data: { forKeys: string; forValues: string | string[] }): Heading {
    const { forKeys, forValues } = data;

    // NOTE: Node order is important and is defined here
    const node: Heading = {
      forKeys: forKeys || '',
      forValues: ArrayUtils.asArray(forValues) ?? [],
    };

    // Remove Unset Optionals
    // ObjectUtils.removeUnwantedProperties(node);

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
    example?: string | boolean;
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
      example: this.toExample(example),
      isCaseSensitive,
      isShortAnswer,
      values,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node);

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
    example?: string | boolean;
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
      example: this.toExample(example),
      isCaseSensitive,
      isShortAnswer,
      cells,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node);

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
    example?: string | boolean;
  }): MatrixCell {
    const { values, item, lead, hint, instruction, example } = data;

    // NOTE: Node order is important and is defined here
    const node: MatrixCell = {
      values,
      itemLead: this.itemLead(item, lead),
      hint,
      instruction,
      example: this.toExample(example),
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node);

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
    example?: string | boolean;
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
      example: this.toExample(example),
      isCaseSensitive,
      isShortAnswer,
      sampleSolution,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, { ignoreEmptyString: ['question'], ignoreFalse: ['isShortAnswer'] });

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
    example?: string | boolean;
    isCaseSensitive?: boolean;
  }): Gap {
    const { solutions, item, lead, hint, instruction, example, isCaseSensitive } = data;

    // NOTE: Node order is important and is defined here
    const node: Gap = {
      type: BodyBitType.gap,
      data: {
        solutions,
        itemLead: this.itemLead(item, lead),
        hint,
        instruction,
        example: this.toExample(example),
        isCaseSensitive,
      },
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node);

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
    example?: string | boolean;
    isCaseSensitive?: boolean;
  }): Select {
    const { options, prefix, postfix, item, lead, hint, instruction, example, isCaseSensitive } = data;

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
        example: this.toExample(example),
        isCaseSensitive,
      },
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node);

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
    example?: string | boolean;
    isCaseSensitive?: boolean;
  }): SelectOption {
    const { text, isCorrect, item, lead, hint, instruction, example, isCaseSensitive } = data;

    // NOTE: Node order is important and is defined here
    const node: SelectOption = {
      text,
      isCorrect,
      itemLead: this.itemLead(item, lead),
      hint,
      instruction,
      example: this.toExample(example),
      isCaseSensitive,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node);

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
    example?: string | boolean;
    isCaseSensitive?: boolean;
  }): Highlight {
    const { texts, prefix, postfix, item, lead, hint, instruction, example, isCaseSensitive } = data;

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
        example: this.toExample(example),
        isCaseSensitive,
      },
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node);

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
    example?: string | boolean;
    isCaseSensitive?: boolean;
  }): HighlightText {
    const { text, isCorrect, isHighlighted, item, lead, hint, instruction, example, isCaseSensitive } = data;

    // NOTE: Node order is important and is defined here
    const node: HighlightText = {
      text,
      isCorrect,
      isHighlighted,
      itemLead: this.itemLead(item, lead),
      hint,
      instruction,
      example: this.toExample(example),
      isCaseSensitive,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node);

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
    example?: string | boolean;
    isCaseSensitive?: boolean;
  }): Statement {
    const { text, isCorrect, item, lead, hint, instruction, example, isCaseSensitive } = data;

    // NOTE: Node order is important and is defined here
    const node: Statement = {
      text,
      isCorrect,
      itemLead: this.itemLead(item, lead),
      hint,
      instruction,
      example: this.toExample(example),
      isCaseSensitive,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node);

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

  private addVersionToParserInfo(bit: Bit) {
    const parser: ParserInfo = bit.parser ?? {};
    parser.version = env.appVersion.full;
    parser.bitmarkVersion = '3'; // TODO
    bit.parser = parser;
  }
}

export { Builder };
