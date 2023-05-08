import { BitType, BitTypeType } from '../model/enum/BitType';
import { ResourceTypeType, ResourceType } from '../model/enum/ResourceType';
import { TextFormatType, TextFormat } from '../model/enum/TextFormat';
import { ParserError } from '../model/parser/ParserError';
import { ParserInfo } from '../model/parser/ParserInfo';
import { ArrayUtils } from '../utils/ArrayUtils';
import { BitUtils } from '../utils/BitUtils';
import { ObjectUtils } from '../utils/ObjectUtils';
import { UrlUtils } from '../utils/UrlUtils';

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
  BodyPart,
  BodyText,
  Gap,
  SelectOption,
  Select,
  HighlightText,
  Highlight,
  ImageLinkResource,
  AudioLinkResource,
  VideoResource,
  VideoLinkResource,
  StillImageFilmResource,
  StillImageFilmLinkResource,
  ArticleResource,
  ArticleLinkResource,
  DocumentResource,
  DocumentLinkResource,
  AppResource,
  AppLinkResource,
  WebsiteLinkResource,
  ItemLead,
  ExtraProperties,
  DocumentDownloadResource,
} from '../model/ast/Nodes';

interface RemoveUnwantedPropertiesOptions {
  ignoreUndefined?: string[];
  ignoreFalse?: string[];
  ignoreEmptyString?: string[];
  ignoreEmptyArrays?: string[];
}

/**
 * Builder to build bitmark AST node programmatically
 */
class Builder {
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
    duration?: string | string[];
    deepLink?: string | string[];
    externalLink?: string | string[];
    externalLinkText?: string | string[];
    videoCallLink?: string | string[];
    bot?: string | string[];
    list?: string | string[];
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
    reference?: string | string[];
    referenceEnd?: string;
    item?: string;
    lead?: string;
    hint?: string;
    instruction?: string;
    example?: string | boolean;
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
      duration,
      deepLink,
      externalLink,
      externalLinkText,
      videoCallLink,
      bot,
      list,
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
      footer,

      bitmark,
      parser,
    } = data;

    // NOTE: Node order is important and is defined here
    const node: Bit = {
      bitType,
      textFormat: TextFormat.fromValue(textFormat) ?? TextFormat.bitmarkMinusMinus,
      resourceType: BitUtils.calculateResourceType(bitType, resourceType, resource),
      id: ArrayUtils.asArray(id),
      externalId: ArrayUtils.asArray(externalId),
      book,
      ageRange: ArrayUtils.asArray(ageRange),
      language: ArrayUtils.asArray(language),
      computerLanguage: ArrayUtils.asArray(computerLanguage),
      coverImage: ArrayUtils.asArray(coverImage),
      publisher: ArrayUtils.asArray(publisher),
      publications: ArrayUtils.asArray(publications),
      author: ArrayUtils.asArray(author),
      subject: ArrayUtils.asArray(subject),
      date: ArrayUtils.asArray(date),
      location: ArrayUtils.asArray(location),
      theme: ArrayUtils.asArray(theme),
      kind: ArrayUtils.asArray(kind),
      action: ArrayUtils.asArray(action),
      thumbImage: ArrayUtils.asArray(thumbImage),
      deeplink: ArrayUtils.asArray(deepLink),
      externalLink: ArrayUtils.asArray(externalLink),
      externalLinkText: ArrayUtils.asArray(externalLinkText),
      videoCallLink: ArrayUtils.asArray(videoCallLink),
      bot: ArrayUtils.asArray(bot),
      duration: ArrayUtils.asArray(duration),
      referenceProperty: undefined, // Important for property order, do not remove
      list: ArrayUtils.asArray(list),
      labelTrue: ArrayUtils.asArray(labelTrue),
      labelFalse: ArrayUtils.asArray(labelFalse),
      quotedPerson: ArrayUtils.asArray(quotedPerson),
      partialAnswer: ArrayUtils.asArray(partialAnswer),
      levelProperty: ArrayUtils.asArray(levelProperty),
      title,
      subtitle,
      level,
      toc,
      progress,
      anchor,
      reference: undefined, // Important for property order, do not remove
      referenceEnd,
      itemLead: this.itemLead(item, lead),
      hint,
      instruction,
      example,
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
      footer,

      bitmark,
      parser,

      // Must always be last in the AST so key clashes are avoided correctly with other properties
      extraProperties: this.parseExtraProperties(extraProperties),
    };

    // Handle special case properties
    this.handleBitReference(node, reference);

    // Remove Unset Optionals
    this.removeUnwantedProperties(node);

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
      example,
      isCaseSensitive,
    };

    // Remove Unset Optionals
    this.removeUnwantedProperties(node);

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
      example,
      isCaseSensitive,
    };

    // Remove Unset Optionals
    this.removeUnwantedProperties(node);

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
      example,
      choices,
      responses,
    };

    // Remove Unset Optionals
    this.removeUnwantedProperties(node);

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
    // this.removeUnwantedProperties(node);

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
    isLongAnswer?: boolean;
  }): Pair {
    const { key, keyAudio, keyImage, values, item, lead, hint, instruction, example, isCaseSensitive, isLongAnswer } =
      data;

    // NOTE: Node order is important and is defined here
    const node: Pair = {
      key,
      keyAudio,
      keyImage,
      itemLead: this.itemLead(item, lead),
      hint,
      instruction,
      example,
      isCaseSensitive,
      isLongAnswer,
      values,
    };

    // Remove Unset Optionals
    this.removeUnwantedProperties(node);

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
    isLongAnswer?: boolean;
  }): Matrix {
    const { key, cells, item, lead, hint, instruction, example, isCaseSensitive, isLongAnswer } = data;

    // NOTE: Node order is important and is defined here
    const node: Matrix = {
      key,
      itemLead: this.itemLead(item, lead),
      hint,
      instruction,
      example,
      isCaseSensitive,
      isLongAnswer,
      cells,
    };

    // Remove Unset Optionals
    this.removeUnwantedProperties(node);

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
      itemLead: this.itemLead(item, lead),
      hint,
      instruction,
      example,
      values,
    };

    // Remove Unset Optionals
    this.removeUnwantedProperties(node);

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
      example,
      isCaseSensitive,
      isShortAnswer,
      sampleSolution,
    };

    // Remove Unset Optionals
    this.removeUnwantedProperties(node, { ignoreFalse: ['isShortAnswer'] });

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

    const node: Body = bodyParts;
    return node;
  }

  /**
   * Build bodyText node
   *
   * @param data - data for the node
   * @returns
   */
  bodyText(data: { text: string }): BodyText {
    const { text } = data;

    // NOTE: Node order is important and is defined here
    const node: BodyText = {
      bodyText: text,
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
      gap: {
        solutions,
        itemLead: this.itemLead(item, lead),
        hint,
        instruction,
        example,
        isCaseSensitive,
      },
    };

    // Remove Unset Optionals
    this.removeUnwantedProperties(node);

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
      select: {
        prefix,
        options,
        postfix,
        itemLead: this.itemLead(item, lead),
        hint,
        instruction,
        example,
        isCaseSensitive,
      },
    };

    // Remove Unset Optionals
    this.removeUnwantedProperties(node);

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
      example,
      isCaseSensitive,
    };

    // Remove Unset Optionals
    this.removeUnwantedProperties(node);

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
      highlight: {
        prefix,
        texts,
        postfix,
        itemLead: this.itemLead(item, lead),
        hint,
        instruction,
        example,
        isCaseSensitive,
      },
    };

    // Remove Unset Optionals
    this.removeUnwantedProperties(node);

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
      example,
      isCaseSensitive,
    };

    // Remove Unset Optionals
    this.removeUnwantedProperties(node);

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
      example,
      isCaseSensitive,
    };

    // Remove Unset Optionals
    this.removeUnwantedProperties(node);

    return node;
  }

  /**
   * Build resource node
   *
   * @param data - data for the node
   * @returns
   */
  resource(
    data: {
      type: ResourceTypeType;

      // Generic part (value of bit tag)
      value?: string; // url / src / href / app / body

      // ImageLikeResource / AudioLikeResource / VideoLikeResource / Article / Document
      format?: string;

      // ImageLikeResource
      src1x?: string;
      src2x?: string;
      src3x?: string;
      src4x?: string;

      // ImageLikeResource / VideoLikeResource
      width?: number;
      height?: number;
      alt?: string;

      // VideoLikeResource
      duration?: number; // string?
      mute?: boolean;
      autoplay?: boolean;
      allowSubtitles?: boolean;
      showSubtitles?: boolean;
      posterImage?: ImageResource;
      thumbnails?: ImageResource[];

      // WebsiteLinkResource
      siteName?: string;

      // ArticleLikeResource
      // body?: string;

      // Generic Resource
      license?: string;
      copyright?: string;
      showInIndex?: boolean;
      caption?: string;
    },
    //
  ): Resource | undefined {
    let node: Resource | undefined;

    const { type, value: valueIn, format: formatIn, ...rest } = data;
    const finalData = {
      type,
      value: valueIn ?? '',
      format: formatIn ?? '',
      ...rest,
    };

    switch (type) {
      case ResourceType.image:
        node = this.imageResource(finalData);
        break;

      case ResourceType.imageLink:
        node = this.imageLinkResource(finalData);
        break;

      case ResourceType.audio:
        node = this.audioResource(finalData);
        break;

      case ResourceType.audioLink:
        node = this.audioLinkResource(finalData);
        break;

      case ResourceType.video:
        node = this.videoResource(finalData);
        break;

      case ResourceType.videoLink:
        node = this.videoLinkResource(finalData);
        break;

      case ResourceType.stillImageFilm:
        node = this.stillImageFilmResource(finalData);
        break;

      case ResourceType.stillImageFilmLink:
        node = this.stillImageFilmLinkResource(finalData);
        break;

      case ResourceType.article:
        node = this.articleResource(finalData);
        break;

      case ResourceType.articleLink:
        node = this.articleLinkResource(finalData);
        break;

      case ResourceType.document:
        node = this.documentResource(finalData);
        break;

      case ResourceType.documentLink:
        node = this.documentLinkResource(finalData);
        break;

      case ResourceType.documentDownload:
        node = this.documentDownloadResource(finalData);
        break;

      case ResourceType.app:
        node = this.appResource(finalData);
        break;

      case ResourceType.appLink:
        node = this.appLinkResource(finalData);
        break;

      case ResourceType.websiteLink:
        node = this.websiteLinkResource(finalData);
        break;

      default:
    }

    return node;
  }

  /**
   * Build imageResource node
   *
   * @param data - data for the node
   * @returns
   */
  imageResource(data: {
    format: string;
    value: string; //src
    src1x?: string;
    src2x?: string;
    src3x?: string;
    src4x?: string;
    width?: number;
    height?: number;
    alt?: string;
    license?: string;
    copyright?: string;
    showInIndex?: boolean;
    caption?: string;
  }): ImageResource {
    const node: ImageResource = this.imageLikeResource({
      type: ResourceType.image,
      ...data,
    }) as ImageResource;

    return node;
  }

  /**
   * Build imageLinkResource node
   *
   * @param data - data for the node
   * @returns
   */
  imageLinkResource(data: {
    format: string;
    value: string;
    src1x?: string;
    src2x?: string;
    src3x?: string;
    src4x?: string;
    width?: number;
    height?: number;
    alt?: string;
    license?: string;
    copyright?: string;
    showInIndex?: boolean;
    caption?: string;
  }): ImageLinkResource {
    const node: ImageLinkResource = this.imageLikeResource({
      type: ResourceType.imageLink,
      ...data,
    }) as ImageLinkResource;

    return node;
  }

  /**
   * Build audioResource node
   *
   * @param data - data for the node
   * @returns
   */
  audioResource(data: {
    format: string;
    value: string; // src
    license?: string;
    copyright?: string;
    showInIndex?: boolean;
    caption?: string;
  }): AudioResource {
    const node: AudioResource = this.audioLikeResource({
      type: ResourceType.audio,
      ...data,
    }) as AudioResource;

    return node;
  }

  /**
   * Build audioLinkResource node
   *
   * @param data - data for the node
   * @returns
   */
  audioLinkResource(data: {
    format: string;
    value: string;
    license?: string;
    copyright?: string;
    showInIndex?: boolean;
    caption?: string;
  }): AudioLinkResource {
    const node: AudioLinkResource = this.audioLikeResource({
      type: ResourceType.audioLink,
      ...data,
    }) as AudioLinkResource;

    return node;
  }

  /**
   * Build videoResource node
   *
   * @param data - data for the node
   * @returns
   */
  videoResource(data: {
    format: string;
    value: string; // src
    width?: number;
    height?: number;
    duration?: number; // string?
    mute?: boolean;
    autoplay?: boolean;
    allowSubtitles?: boolean;
    showSubtitles?: boolean;
    alt?: string;
    posterImage?: ImageResource;
    thumbnails?: ImageResource[];
    license?: string;
    copyright?: string;
    showInIndex?: boolean;
    caption?: string;
  }): VideoResource {
    const node: VideoResource = this.videoLikeResource({
      type: ResourceType.video,
      ...data,
    }) as VideoResource;

    return node;
  }

  /**
   * Build videoLinkResource node
   *
   * @param data - data for the node
   * @returns
   */
  videoLinkResource(data: {
    format: string;
    value: string;
    width?: number;
    height?: number;
    duration?: number; // string?
    mute?: boolean;
    autoplay?: boolean;
    allowSubtitles?: boolean;
    showSubtitles?: boolean;
    alt?: string;
    posterImage?: ImageResource;
    thumbnails?: ImageResource[];
    license?: string;
    copyright?: string;
    showInIndex?: boolean;
    caption?: string;
  }): VideoLinkResource {
    const node: VideoLinkResource = this.videoLikeResource({
      type: ResourceType.videoLink,
      ...data,
    }) as VideoLinkResource;

    return node;
  }

  /**
   * Build stillImageFilmResource node
   *
   * @param data - data for the node
   * @returns
   */
  stillImageFilmResource(data: {
    format: string;
    value: string; // src
    width?: number;
    height?: number;
    duration?: number; // string?
    mute?: boolean;
    autoplay?: boolean;
    allowSubtitles?: boolean;
    showSubtitles?: boolean;
    alt?: string;
    posterImage?: ImageResource;
    thumbnails?: ImageResource[];
    license?: string;
    copyright?: string;
    showInIndex?: boolean;
    caption?: string;
  }): StillImageFilmResource {
    const node: StillImageFilmResource = this.videoLikeResource({
      type: ResourceType.stillImageFilm,
      ...data,
    }) as StillImageFilmResource;

    return node;
  }

  /**
   * Build stillImageFilmLinkResource node
   *
   * @param data - data for the node
   * @returns
   */
  stillImageFilmLinkResource(data: {
    format: string;
    value: string;
    width?: number;
    height?: number;
    duration?: number; // string?
    mute?: boolean;
    autoplay?: boolean;
    allowSubtitles?: boolean;
    showSubtitles?: boolean;
    alt?: string;
    posterImage?: ImageResource;
    thumbnails?: ImageResource[];
    license?: string;
    copyright?: string;
    showInIndex?: boolean;
    caption?: string;
  }): StillImageFilmLinkResource {
    const node: StillImageFilmLinkResource = this.videoLikeResource({
      type: ResourceType.stillImageFilmLink,
      ...data,
    }) as StillImageFilmLinkResource;

    return node;
  }

  /**
   * Build articleResource node
   *
   * @param data - data for the node
   * @returns
   */
  articleResource(data: {
    format: string;
    value: string;
    license?: string;
    copyright?: string;
    showInIndex?: boolean;
    caption?: string;
  }): ArticleResource {
    const node: ArticleResource = this.articleLikeResource({
      type: ResourceType.article,
      ...data,
    }) as ArticleResource;

    return node;
  }

  /**
   * Build articleLinkResource node
   *
   * @param data - data for the node
   * @returns
   */
  articleLinkResource(data: {
    format: string;
    value: string;
    license?: string;
    copyright?: string;
    showInIndex?: boolean;
    caption?: string;
  }): ArticleLinkResource {
    const node: ArticleLinkResource = this.articleLikeResource({
      type: ResourceType.articleLink,
      ...data,
    }) as ArticleLinkResource;

    return node;
  }

  /**
   * Build documentResource node
   *
   * @param data - data for the node
   * @returns
   */
  documentResource(data: {
    format: string;
    href?: string;
    body?: string;
    license?: string;
    copyright?: string;
    showInIndex?: boolean;
    caption?: string;
  }): DocumentResource {
    const node: DocumentResource = this.articleLikeResource({
      type: ResourceType.document,
      ...data,
    }) as DocumentResource;

    return node;
  }

  /**
   * Build documentLinkResource node
   *
   * @param data - data for the node
   * @returns
   */
  documentLinkResource(data: {
    format: string;
    value: string;
    license?: string;
    copyright?: string;
    showInIndex?: boolean;
    caption?: string;
  }): DocumentLinkResource {
    const node: DocumentLinkResource = this.articleLikeResource({
      type: ResourceType.documentLink,
      ...data,
    }) as DocumentLinkResource;

    return node;
  }

  /**
   * Build documentDownloadResource node
   *
   * @param data - data for the node
   * @returns
   */
  documentDownloadResource(data: {
    format: string;
    value: string;
    license?: string;
    copyright?: string;
    showInIndex?: boolean;
    caption?: string;
  }): DocumentDownloadResource {
    const node: DocumentDownloadResource = this.articleLikeResource({
      type: ResourceType.documentDownload,
      ...data,
    }) as DocumentDownloadResource;

    return node;
  }

  /**
   * Build appResource node
   *
   * @param data - data for the node
   * @returns
   */
  appResource(data: {
    value: string; // app
    license?: string;
    copyright?: string;
    showInIndex?: boolean;
    caption?: string;
  }): AppResource {
    const node: AppResource = this.appLikeResource({
      type: ResourceType.appLink,
      ...data,
    }) as AppResource;

    return node;
  }

  /**
   * Build appLinkResource node
   *
   * @param data - data for the node
   * @returns
   */
  appLinkResource(data: {
    value: string;
    license?: string;
    copyright?: string;
    showInIndex?: boolean;
    caption?: string;
  }): AppLinkResource {
    const node: AppLinkResource = this.appLikeResource({
      type: ResourceType.appLink,
      ...data,
    }) as AppLinkResource;

    return node;
  }

  /**
   * Build websiteLinkResource node
   *
   * @param data - data for the node
   * @returns
   */
  websiteLinkResource(data: {
    value: string;
    siteName?: string;
    license?: string;
    copyright?: string;
    showInIndex?: boolean;
    caption?: string;
  }): WebsiteLinkResource | undefined {
    const { value, siteName, license, copyright, showInIndex, caption } = data;

    // NOTE: Node order is important and is defined here
    const node: WebsiteLinkResource = {
      type: ResourceType.websiteLink,
      value,
      siteName,
      license,
      copyright,
      showInIndex,
      caption,
    };

    // Remove Unset Optionals
    this.removeUnwantedProperties(node);

    // Validate and correct invalid bits as much as possible
    return NodeValidator.validateResource(node);
  }

  private itemLead(item?: string, lead?: string): ItemLead | undefined {
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

  private handleBitReference(bit: Bit, reference: string | string[] | undefined) {
    if (Array.isArray(reference) && reference.length > 0) {
      bit.referenceProperty = reference;
    } else if (reference) {
      bit.reference = reference as string;
    }
  }

  //
  // Private
  //

  private imageLikeResource(data: {
    type: 'image' | 'image-link';
    value: string;
    src1x?: string;
    src2x?: string;
    src3x?: string;
    src4x?: string;
    width?: number;
    height?: number;
    alt?: string;
    license?: string;
    copyright?: string;
    showInIndex?: boolean;
    caption?: string;
  }): ImageResource | ImageLinkResource | undefined {
    const { type, value, src1x, src2x, src3x, src4x, width, height, alt, license, copyright, showInIndex, caption } =
      data;

    // NOTE: Node order is important and is defined here
    const node: ImageResource | ImageLinkResource = {
      type,
      format: UrlUtils.fileExtensionFromUrl(value),
      provider: UrlUtils.domainFromUrl(value),
      value,
      src1x,
      src2x,
      src3x,
      src4x,
      width,
      height,
      alt,
      license,
      copyright,
      showInIndex,
      caption,
    };

    // Remove Unset Optionals
    this.removeUnwantedProperties(node);

    // Validate and correct invalid bits as much as possible
    return NodeValidator.validateResource(node);
  }

  private audioLikeResource(data: {
    type: 'audio' | 'audio-link';
    value: string;
    license?: string;
    copyright?: string;
    showInIndex?: boolean;
    caption?: string;
  }): AudioResource | AudioLinkResource | undefined {
    const { type, value, license, copyright, showInIndex, caption } = data;

    // NOTE: Node order is important and is defined here
    const node: AudioResource | AudioLinkResource = {
      type,
      format: UrlUtils.fileExtensionFromUrl(value),
      provider: UrlUtils.domainFromUrl(value),
      value,
      license,
      copyright,
      showInIndex,
      caption,
    };

    // Remove Unset Optionals
    this.removeUnwantedProperties(node);

    // Validate and correct invalid bits as much as possible
    return NodeValidator.validateResource(node);
  }

  private videoLikeResource(data: {
    type: 'video' | 'video-link' | 'still-image-film' | 'still-image-film-link';
    value: string;
    width?: number;
    height?: number;
    duration?: number; // string?
    mute?: boolean;
    autoplay?: boolean;
    allowSubtitles?: boolean;
    showSubtitles?: boolean;
    alt?: string;
    posterImage?: ImageResource;
    thumbnails?: ImageResource[];
    license?: string;
    copyright?: string;
    showInIndex?: boolean;
    caption?: string;
  }): VideoResource | VideoLinkResource | StillImageFilmResource | StillImageFilmLinkResource | undefined {
    const {
      type,
      value,
      width,
      height,
      duration,
      mute,
      autoplay,
      allowSubtitles,
      showSubtitles,
      alt,
      posterImage,
      thumbnails,
      license,
      copyright,
      showInIndex,
      caption,
    } = data;

    // NOTE: Node order is important and is defined here
    const node: VideoResource | VideoLinkResource | StillImageFilmResource | StillImageFilmLinkResource = {
      type,
      format: UrlUtils.fileExtensionFromUrl(value),
      provider: UrlUtils.domainFromUrl(value),
      value,
      width,
      height,
      duration,
      mute,
      autoplay,
      allowSubtitles,
      showSubtitles,
      alt,
      posterImage,
      thumbnails,
      license,
      copyright,
      showInIndex,
      caption,
    };

    // Remove Unset Optionals
    this.removeUnwantedProperties(node);

    // Validate and correct invalid bits as much as possible
    return NodeValidator.validateResource(node);
  }

  private articleLikeResource(data: {
    type: 'article' | 'article-link' | 'document' | 'document-link' | 'document-download';
    value?: string; // url / href
    body?: string | undefined;
    license?: string;
    copyright?: string;
    showInIndex?: boolean;
    caption?: string;
  }):
    | ArticleResource
    | ArticleLinkResource
    | DocumentResource
    | DocumentLinkResource
    | DocumentDownloadResource
    | undefined {
    const { type, value, license, copyright, showInIndex, caption } = data;

    // NOTE: Node order is important and is defined here
    const node:
      | ArticleResource
      | ArticleLinkResource
      | DocumentResource
      | DocumentLinkResource
      | DocumentDownloadResource = {
      type,
      format: UrlUtils.fileExtensionFromUrl(value),
      provider: UrlUtils.domainFromUrl(value),
      value,
      license,
      copyright,
      showInIndex,
      caption,
    };

    // Remove Unset Optionals
    this.removeUnwantedProperties(node);

    // Validate and correct invalid bits as much as possible
    return NodeValidator.validateResource(node);
  }

  private appLikeResource(data: {
    type: 'app' | 'app-link';
    value: string; // url / app
    license?: string;
    copyright?: string;
    showInIndex?: boolean;
    caption?: string;
  }): AppResource | AppLinkResource | undefined {
    const { type, value, license, copyright, showInIndex, caption } = data;

    // NOTE: Node order is important and is defined here
    const node: AppResource | AppLinkResource = {
      type,
      value,
      license,
      copyright,
      showInIndex,
      caption,
    };

    // Remove Unset Optionals
    this.removeUnwantedProperties(node);

    // Validate and correct invalid bits as much as possible
    return NodeValidator.validateResource(node);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private removeUnwantedProperties(obj: unknown, options?: RemoveUnwantedPropertiesOptions): void {
    options = Object.assign({}, options);

    ObjectUtils.removeUndefinedProperties(obj, options.ignoreUndefined);
    ObjectUtils.removeFalseProperties(obj, options.ignoreFalse);
    ObjectUtils.removeEmptyStringProperties(obj, options.ignoreEmptyString);
    ObjectUtils.removeEmptyArrayProperties(obj, options.ignoreEmptyArrays);
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
}

export { Builder };
