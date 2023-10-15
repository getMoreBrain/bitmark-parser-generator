import { PropertyConfigKey } from '../model/config/enum/PropertyConfigKey';
import { AliasBitType, BitType, RootBitType } from '../model/enum/BitType';
import { BodyBitType, BodyBitTypeType } from '../model/enum/BodyBitType';
import { ResourceTag, ResourceTagType } from '../model/enum/ResourceTag';
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
  Mark,
  MarkConfig,
  Example,
  Flashcard,
  ImageSource,
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
    bitType: BitType;
    textFormat?: TextFormatType;
    resourceType?: ResourceTagType; // This is optional, it will be inferred from the resource
    id?: string | string[];
    externalId?: string | string[];
    spaceId?: string | string[];
    padletId?: string;
    jupyterId?: string;
    jupyterExecutionCount?: string;
    aiGenerated?: boolean;
    releaseVersion?: string;
    ageRange?: number | number[];
    lang?: string;
    language?: string | string[];
    computerLanguage?: string;
    target?: string | string[];
    tag?: string | string[];
    icon?: string;
    iconTag?: string;
    colorTag?: string | string[];
    flashcardSet?: string | string[];
    subtype?: string;
    bookAlias?: string | string[];
    coverImage?: string | string[];
    publisher?: string | string[];
    publications?: string | string[];
    author?: string | string[];
    subject?: string | string[];
    date?: string;
    location?: string;
    theme?: string | string[];
    kind?: string;
    action?: string;
    thumbImage?: string;
    focusX?: number;
    focusY?: number;
    duration?: string;
    referenceProperty?: string | string[];
    deeplink?: string | string[];
    externalLink?: string;
    externalLinkText?: string;
    videoCallLink?: string;
    bot?: string | string[];
    list?: string | string[];
    textReference?: string;
    isTracked?: boolean;
    isInfoOnly?: boolean;
    labelTrue?: string;
    labelFalse?: string;
    content2Buy?: string;
    quotedPerson?: string;
    reasonableNumOfChars?: number;
    maxCreatedBits?: number;
    partialAnswer?: string;
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
    imageSource?: ImageSource;
    partner?: Partner;
    extraProperties?: {
      [key: string]: unknown | unknown[];
    };
    markConfig?: MarkConfig[];
    resources?: Resource | Resource[];
    body?: Body;
    sampleSolution?: string;
    elements?: string[];
    flashcards?: Flashcard[];
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
      jupyterId,
      jupyterExecutionCount,
      aiGenerated,
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
      content2Buy,
      book,
      quotedPerson,
      partialAnswer,
      reasonableNumOfChars,
      maxCreatedBits,
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
      imageSource,
      partner,
      markConfig,
      extraProperties,
      resources: _resources,
      body,
      sampleSolution,
      footer,

      markup,
      parser,
    } = data;

    // Convert resources into an array
    const resources = ArrayUtils.asArray(_resources);

    // Set the card node data
    const cardNode = this.cardNode(data);

    // Add reasonableNumOfChars to the bit only for essay bits (in other cases it will be pushed down the tree)
    const reasonableNumOfCharsProperty =
      bitType.root === RootBitType.essay
        ? this.toAstProperty(PropertyConfigKey.reasonableNumOfChars, reasonableNumOfChars)
        : undefined;

    // NOTE: Node order is important and is defined here
    const node: Bit = {
      bitType,
      textFormat: TextFormat.fromValue(textFormat) ?? TextFormat.bitmarkMinusMinus,
      resourceType: ResourceTag.fromValue(resourceType),
      id: this.toAstProperty(PropertyConfigKey.id, id),
      externalId: this.toAstProperty(PropertyConfigKey.externalId, externalId),
      spaceId: this.toAstProperty(PropertyConfigKey.spaceId, spaceId),
      padletId: this.toAstProperty(PropertyConfigKey.padletId, padletId),
      jupyterId: this.toAstProperty(PropertyConfigKey.jupyterId, jupyterId),
      jupyterExecutionCount: this.toAstProperty(PropertyConfigKey.jupyterExecutionCount, jupyterExecutionCount),
      aiGenerated: this.toAstProperty(PropertyConfigKey.aiGenerated, aiGenerated),
      releaseVersion: this.toAstProperty(PropertyConfigKey.releaseVersion, releaseVersion),
      book,
      ageRange: this.toAstProperty(PropertyConfigKey.ageRange, ageRange),
      lang: this.toAstProperty(PropertyConfigKey.lang, lang),
      language: this.toAstProperty(PropertyConfigKey.language, language),
      computerLanguage: this.toAstProperty(PropertyConfigKey.computerLanguage, computerLanguage),
      target: this.toAstProperty(PropertyConfigKey.target, target),
      tag: this.toAstProperty(PropertyConfigKey.tag, tag),
      icon: this.toAstProperty(PropertyConfigKey.icon, icon),
      iconTag: this.toAstProperty(PropertyConfigKey.iconTag, iconTag),
      colorTag: this.toAstProperty(PropertyConfigKey.colorTag, colorTag),
      flashcardSet: this.toAstProperty(PropertyConfigKey.flashcardSet, flashcardSet),
      subtype: this.toAstProperty(PropertyConfigKey.subtype, subtype),
      bookAlias: this.toAstProperty(PropertyConfigKey.bookAlias, bookAlias),
      coverImage: this.toAstProperty(PropertyConfigKey.coverImage, coverImage),
      publisher: this.toAstProperty(PropertyConfigKey.publisher, publisher),
      publications: this.toAstProperty(PropertyConfigKey.publications, publications),
      author: this.toAstProperty(PropertyConfigKey.author, author),
      subject: this.toAstProperty(PropertyConfigKey.subject, subject),
      date: this.toAstProperty(PropertyConfigKey.date, date),
      location: this.toAstProperty(PropertyConfigKey.location, location),
      theme: this.toAstProperty(PropertyConfigKey.theme, theme),
      kind: this.toAstProperty(PropertyConfigKey.kind, kind),
      action: this.toAstProperty(PropertyConfigKey.action, action),
      thumbImage: this.toAstProperty(PropertyConfigKey.thumbImage, thumbImage),
      focusX: this.toAstProperty(PropertyConfigKey.focusX, focusX),
      focusY: this.toAstProperty(PropertyConfigKey.focusY, focusY),
      deeplink: this.toAstProperty(PropertyConfigKey.deeplink, deeplink),
      externalLink: this.toAstProperty(PropertyConfigKey.externalLink, externalLink),
      externalLinkText: this.toAstProperty(PropertyConfigKey.externalLinkText, externalLinkText),
      videoCallLink: this.toAstProperty(PropertyConfigKey.videoCallLink, videoCallLink),
      bot: this.toAstProperty(PropertyConfigKey.bot, bot),
      duration: this.toAstProperty(PropertyConfigKey.duration, duration),
      referenceProperty: this.toAstProperty(PropertyConfigKey.property_reference, referenceProperty),
      list: this.toAstProperty(PropertyConfigKey.list, list),
      textReference: this.toAstProperty(PropertyConfigKey.textReference, textReference),
      isTracked: this.toAstProperty(PropertyConfigKey.isTracked, isTracked),
      isInfoOnly: this.toAstProperty(PropertyConfigKey.isInfoOnly, isInfoOnly),
      labelTrue: this.toAstProperty(PropertyConfigKey.labelTrue, labelTrue),
      labelFalse: this.toAstProperty(PropertyConfigKey.labelFalse, labelFalse),
      content2Buy: this.toAstProperty(PropertyConfigKey.content2Buy, content2Buy),
      quotedPerson: this.toAstProperty(PropertyConfigKey.quotedPerson, quotedPerson),
      partialAnswer: this.toAstProperty(PropertyConfigKey.partialAnswer, partialAnswer),
      reasonableNumOfChars: reasonableNumOfCharsProperty,
      maxCreatedBits: this.toAstProperty(PropertyConfigKey.maxCreatedBits, maxCreatedBits),
      title,
      subtitle,
      level: NumberUtils.asNumber(level),
      toc: this.toAstProperty(PropertyConfigKey.toc, toc),
      progress: this.toAstProperty(PropertyConfigKey.progress, progress),
      anchor,
      reference,
      referenceEnd,
      markConfig,
      itemLead: this.itemLead(item, lead),
      hint,
      instruction,
      ...this.toExample(isDefaultExample, example),
      imageSource,
      partner,
      resources,
      body,
      sampleSolution: ArrayUtils.asSingle(sampleSolution),
      cardNode,
      footer,

      markup,
      parser,

      // Must always be last in the AST so key clashes are avoided correctly with other properties
      extraProperties: this.parseExtraProperties(extraProperties),
    };

    // Push reasonableNumOfChars down the tree for the interview bit
    if (bitType.root === RootBitType.interview) {
      this.pushDownTree(
        undefined,
        undefined,
        cardNode,
        'questions',
        PropertyConfigKey.reasonableNumOfChars,
        reasonableNumOfChars,
      );
    }

    // If isDefaultExample is set at the bit level, push the default example down the tree to the relevant nodes
    this.pushExampleDownTree(body, cardNode, isDefaultExample, example);

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
    isDefaultExample?: boolean;
    example?: Example;
  }): Choice {
    const { text, isCorrect, item, lead, hint, instruction, isDefaultExample, example } = data;

    // NOTE: Node order is important and is defined here
    const node: Choice = {
      text,
      isCorrect: !!isCorrect,
      itemLead: this.itemLead(item, lead),
      hint,
      instruction,
      ...this.toExampleBoolean(isDefaultExample, example),
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
    isDefaultExample?: boolean;
    example?: Example;
  }): Response {
    const { text, isCorrect, item, lead, hint, instruction, isDefaultExample, example } = data;

    // NOTE: Node order is important and is defined here
    const node: Response = {
      text,
      isCorrect: !!isCorrect,
      itemLead: this.itemLead(item, lead),
      hint,
      instruction,
      ...this.toExampleBoolean(isDefaultExample, example),
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
    isDefaultExample?: boolean;
    example?: Example;
    choices?: Choice[];
    responses?: Response[];
  }): Quiz {
    const { choices, responses, item, lead, hint, instruction, isDefaultExample, example } = data;

    // Push isDefaultExample down the tree
    this.pushExampleDownTreeBoolean(isDefaultExample, example, true, choices);
    this.pushExampleDownTreeBoolean(isDefaultExample, example, false, responses);

    // NOTE: Node order is important and is defined here
    const node: Quiz = {
      itemLead: this.itemLead(item, lead),
      hint,
      instruction,
      isExample: isDefaultExample || example != null,
      choices,
      responses,
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
    });

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
      isCaseSensitive: isCaseSensitive ?? true, // default to true
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
    isDefaultExample?: boolean;
  }): Matrix {
    const { key, cells, item, lead, hint, instruction, isDefaultExample } = data;

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
    isCaseSensitive?: boolean;
    isDefaultExample?: boolean;
    example?: Example;
  }): MatrixCell {
    const { values, item, lead, hint, instruction, isCaseSensitive, isDefaultExample, example } = data;

    // NOTE: Node order is important and is defined here
    const node: MatrixCell = {
      values,
      itemLead: this.itemLead(item, lead),
      hint,
      instruction,
      isCaseSensitive: isCaseSensitive ?? true, // default to true
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
    reasonableNumOfChars?: number;
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
      reasonableNumOfChars,
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
      reasonableNumOfChars,
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
        isCaseSensitive: isCaseSensitive ?? true, // default to true
        ...this.toExample(isDefaultExample, example),
      },
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
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
    item?: string;
    lead?: string;
    hint?: string;
    instruction?: string;
    isDefaultExample?: boolean;
    example?: string | boolean;
  }): Mark {
    const { solution, mark, item, lead, hint, instruction, isDefaultExample, example } = data;

    // NOTE: Node order is important and is defined here
    const node: Mark = {
      type: BodyBitType.mark,
      data: {
        solution,
        mark,
        itemLead: this.itemLead(item, lead),
        hint,
        instruction,
        ...this.toExample(isDefaultExample, example),
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
  }): Select {
    const { options, prefix, postfix, item, lead, hint, instruction } = data;

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
    isDefaultExample?: boolean;
    example?: Example;
  }): SelectOption {
    const { text, isCorrect, item, lead, hint, instruction, isDefaultExample, example } = data;

    // NOTE: Node order is important and is defined here
    const node: SelectOption = {
      text,
      isCorrect: !!isCorrect,
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
  }): Highlight {
    const { texts, prefix, postfix, item, lead, hint, instruction } = data;

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
    isDefaultExample?: boolean;
    example?: Example;
  }): HighlightText {
    const { text, isCorrect, isHighlighted, item, lead, hint, instruction, isDefaultExample, example } = data;

    // NOTE: Node order is important and is defined here
    const node: HighlightText = {
      text,
      isCorrect: !!isCorrect,
      isHighlighted: !!isHighlighted,
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
   * Build flashcard node
   *
   * @param data - data for the node
   * @returns
   */
  flashcard(data: {
    question: string;
    answer?: string;
    alternativeAnswers?: string[];
    item?: string;
    lead?: string;
    hint?: string;
    instruction?: string;
    isDefaultExample?: boolean;
    example?: Example;
  }): Flashcard {
    const { question, answer, alternativeAnswers, item, lead, hint, instruction, isDefaultExample, example } = data;

    // NOTE: Node order is important and is defined here
    const node: Flashcard = {
      question,
      answer,
      alternativeAnswers,
      itemLead: this.itemLead(item, lead),
      hint,
      instruction,
      ...this.toExampleBoolean(isDefaultExample, example),
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
    isDefaultExample?: boolean;
    example?: Example;
  }): Statement {
    const { text, isCorrect, item, lead, hint, instruction, isDefaultExample, example } = data;

    // NOTE: Node order is important and is defined here
    const node: Statement = {
      text,
      isCorrect: !!isCorrect,
      itemLead: this.itemLead(item, lead),
      hint,
      instruction,
      ...this.toExampleBoolean(isDefaultExample, example),
    };

    // Remove Unset Optionals
    ObjectUtils.removeUnwantedProperties(node, {
      ignoreAllFalse: true,
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
    flashcards?: Flashcard[];
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
      flashcards,
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
      flashcards ||
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
        flashcards,
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
    example: Example | undefined,
  ): void {
    if (isDefaultExample || example) {
      if (cardNode) {
        this.pushExampleDownTreeString(isDefaultExample, example, cardNode.pairs as WithExample[]);
        this.pushExampleDownTreeBoolean(isDefaultExample, example, false, cardNode.flashcards as WithExample[]);
        this.pushExampleDownTreeBoolean(isDefaultExample, example, true, cardNode.choices as WithExample[]);
        this.pushExampleDownTreeBoolean(
          isDefaultExample,
          example,
          false,
          cardNode.responses as WithExample[],
          cardNode.statements as WithExample[],
          cardNode.statement as WithExample,
        );
        if (cardNode.quizzes) {
          for (const quiz of cardNode.quizzes) {
            this.pushExampleDownTreeBoolean(isDefaultExample, example, true, quiz.choices);
            this.pushExampleDownTreeBoolean(isDefaultExample, example, false, quiz.responses);
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
    example: Example | undefined,
    onlyCorrect: boolean,
    ...nodes: (WithExample | WithExample[] | undefined)[]
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
    example: Example | undefined,
    ...nodes: (WithExample | WithExample[] | undefined)[]
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
    example: Example | undefined,
    body: Body | undefined,
  ): void {
    if (!isDefaultExample && !example) return;
    if (!body || !body.bodyParts || body.bodyParts.length === 0) return;

    for (const part of body.bodyParts) {
      if (part) {
        switch (part.type) {
          case BodyBitType.gap: {
            const gap = part as Gap;
            BitUtils.fillStringExample([gap.data], isDefaultExample, example, false);
            break;
          }
          case BodyBitType.mark: {
            const mark = part as Mark;
            BitUtils.fillBooleanExample([mark.data], isDefaultExample, example, false);
            break;
          }
          case BodyBitType.select: {
            const select = part as Select;
            BitUtils.fillBooleanExample(select.data.options, isDefaultExample, example, true);
            break;
          }
          case BodyBitType.highlight: {
            const highlight = part as Highlight;
            BitUtils.fillBooleanExample(highlight.data.texts, isDefaultExample, example, true);
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
   * @param body set if the value should be passed down the body to the body bits
   * @param bodyBitTypes body bit types to push the value down to
   * @param cardNode set if the value should be passed down the card node
   * @param path path for the value
   * @param value the value to push down
   */
  private pushDownTree(
    body: Body | undefined,
    bodyBitTypes: BodyBitTypeType[] | undefined,
    cardNode: CardNode | undefined,
    cardNodePath: string | undefined,
    path: string,
    value: unknown,
  ): void {
    if (value === undefined) return;

    // Add value to card nodes if required (TODO - nested paths)
    if (cardNode && cardNodePath) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cardNodeAny = cardNode as any;
      const cards = cardNodeAny[cardNodePath];
      if (Array.isArray(cards)) {
        for (const card of cards) {
          if (card[path] == null) {
            card[path] = value;
          }
        }
      }
    }

    // Add value to body bit types if required
    if (bodyBitTypes && body && body.bodyParts && body.bodyParts.length > 0) {
      for (const part of body.bodyParts) {
        if (part) {
          if (bodyBitTypes.indexOf(part.type) !== -1) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data = part.data as any;
            data[path] = value;
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
          case BodyBitType.gap:
          case BodyBitType.mark: {
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
      // flashcards
      for (const v of cardNode.flashcards ?? []) {
        checkIsExample(v as WithExample);
      }

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
    switch (bit.bitType.alias) {
      case AliasBitType.articleAi:
      case AliasBitType.noteAi:
      case AliasBitType.summaryAi:
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
