import { BitType, BitTypeType } from '../types/BitType';
import { Property } from '../types/Property';
import { TextFormat, TextFormatType } from '../types/TextFormat';
import { ResourceType, ResourceTypeType } from '../types/resources/ResouceType';

import {
  Resource,
  AppLinkResource,
  AppResource,
  ArticleLinkResource,
  ArticleResource,
  AudioLinkResource,
  AudioResource,
  Bit,
  Bitmark,
  Body,
  BodyPart,
  BodyText,
  Choice,
  DocumentLinkResource,
  DocumentResource,
  Gap,
  ImageLinkResource,
  ImageResource,
  ItemLead,
  Pair,
  Quiz,
  Response,
  Select,
  SelectOption,
  Statement,
  StillImageFilmLinkResource,
  StillImageFilmResource,
  VideoLinkResource,
  VideoResource,
  WebsiteLinkResource,
  Question,
  FooterText,
  Heading,
} from '../nodes/BitmarkNodes';

interface RemoveUnwantedPropertiesOptions {
  ignoreUndefined?: string[];
  ignoreFalse?: string[];
  ignoreEmptyString?: string[];
  ignoreEmptyArrays?: string[];
}

class Builder {
  bitmark(data: { bits: Bit[] }): Bitmark {
    const { bits } = data;
    const node: Bitmark = {
      bits: bits,
    };

    return node;
  }

  bit(data: {
    bitType: BitTypeType;
    textFormat?: TextFormatType;
    ids?: string | string[];
    externalIds?: string | string[];
    ageRanges?: number | number[];
    languages?: string | string[];
    computerLanguages?: string | string[];
    coverImages?: string | string[];
    publishers?: string | string[];
    publications?: string | string[];
    authors?: string | string[];
    dates?: string | string[];
    locations?: string | string[];
    themes?: string | string[];
    kinds?: string | string[];
    actions?: string | string[];
    thumbImages?: string | string[];
    durations?: string | string[];
    deepLinks?: string | string[];
    externalLink?: string;
    externalLinkText?: string;
    videoCallLinks?: string | string[];
    bots?: string | string[];
    lists?: string | string[];
    labelTrue?: string;
    labelFalse?: string;
    quotedPerson?: string;
    book?: string;
    title?: string;
    subtitle?: string;
    level?: number;
    toc?: boolean;
    progress?: boolean;
    anchor?: string;
    reference?: string | string[];
    referenceEnd?: string;
    item?: string;
    lead?: string;
    hint?: string;
    instruction?: string;
    example?: string | boolean;
    resource?: Resource;
    body?: Body;
    elements?: string[];
    statements?: Statement[];
    responses?: Response[];
    quizzes?: Quiz[];
    heading?: Heading;
    pairs?: Pair[];
    choices?: Choice[];
    questions?: Question[];
    footer?: FooterText;
  }): Bit {
    const {
      bitType,
      textFormat,
      ids,
      externalIds,
      ageRanges,
      languages,
      computerLanguages,
      coverImages,
      publishers,
      publications,
      authors,
      dates,
      locations,
      themes,
      kinds,
      actions,
      thumbImages,
      durations,
      deepLinks,
      externalLink,
      externalLinkText,
      videoCallLinks,
      bots,
      lists,
      labelTrue,
      labelFalse,
      book,
      quotedPerson,
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
      resource,
      body,
      elements,
      statements,
      responses,
      quizzes,
      heading,
      pairs,
      choices,
      questions,
      footer,
    } = data;

    // NOTE: Node order is important and is defined here
    const node: Bit = {
      bitType,
      textFormat: TextFormat.fromValue(textFormat) ?? TextFormat.bitmarkMinusMinus,
      ids: this.asArray(ids),
      externalIds: this.asArray(externalIds),
      book,
      ageRanges: this.asArray(ageRanges),
      languages: this.asArray(languages),
      computerLanguages: this.asArray(computerLanguages),
      coverImages: this.asArray(coverImages),
      publishers: this.asArray(publishers),
      publications: this.asArray(publications),
      authors: this.asArray(authors),
      dates: this.asArray(dates),
      locations: this.asArray(locations),
      themes: this.asArray(themes),
      kinds: this.asArray(kinds),
      actions: this.asArray(actions),
      thumbImages: this.asArray(thumbImages),
      deepLinks: this.asArray(deepLinks),
      externalLink,
      externalLinkText,
      videoCallLinks: this.asArray(videoCallLinks),
      bots: this.asArray(bots),
      durations: this.asArray(durations),
      referenceProperties: undefined, // Important for property order, do not remove
      lists: this.asArray(lists),
      labelTrue,
      labelFalse,
      quotedPerson,
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
      elements,
      statements,
      responses,
      quizzes,
      heading,
      pairs,
      choices,
      questions,
      footer,
    };

    // Handle special case properties
    this.handleBitReference(node, reference);

    // Remove Unset Optionals
    this.removeUnwantedProperties(node);

    // Validate and correct invalid bits as much as possible
    this.validateBit(node);

    return node;
  }

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

  heading(data: { forKeys: string; forValues: string | string[] }): Heading {
    const { forKeys, forValues } = data;

    // NOTE: Node order is important and is defined here
    const node: Heading = {
      forKeys: forKeys || '',
      forValues: this.asArray(forValues) ?? [],
    };

    // Remove Unset Optionals
    // this.removeUnwantedProperties(node);

    return node;
  }

  pair(data: {
    key: string;
    values: string[];
    item?: string;
    lead?: string;
    hint?: string;
    instruction?: string;
    example?: string | boolean;
    isCaseSensitive?: boolean;
    isLongAnswer?: boolean;
  }): Pair {
    const { key, values, item, lead, hint, instruction, example, isCaseSensitive, isLongAnswer } = data;

    // NOTE: Node order is important and is defined here
    const node: Pair = {
      key,
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
      // Writing [@shortAnswer] after the 'question' causes newlines in the body to change.
      // This is likely a parser bug.
      // isShortAnswer,
      sampleSolution,
    };

    // Remove Unset Optionals
    this.removeUnwantedProperties(node);

    return node;
  }

  body(data: { bodyParts: BodyPart[] }): Body {
    const { bodyParts } = data;

    const node: Body = bodyParts;
    return node;
  }

  bodyText(data: { text: string }): BodyText {
    const { text } = data;

    // NOTE: Node order is important and is defined here
    const node: BodyText = {
      bodyText: text,
    };
    return node;
  }

  footerText(data: { text: string }): FooterText {
    const { text } = data;

    // NOTE: Node order is important and is defined here
    const node: FooterText = {
      footerText: text,
    };
    return node;
  }

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

  resource(
    data: {
      type: ResourceTypeType;

      // Generic (except Article / Document)
      url?: string; // url / src / href / app

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
      body?: string;

      // Generic Resource
      license?: string;
      copyright?: string;
      provider?: string;
      showInIndex?: boolean;
      caption?: string;
    },
    //
  ): Resource | undefined {
    let node: Resource | undefined;

    const { type, url: urlIn, format: formatIn, ...rest } = data;
    const finalData = {
      type,
      url: urlIn ?? '',
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

  imageResource(data: {
    format: string;
    url: string; //src
    src1x?: string;
    src2x?: string;
    src3x?: string;
    src4x?: string;
    width?: number;
    height?: number;
    alt?: string;
    license?: string;
    copyright?: string;
    provider?: string;
    showInIndex?: boolean;
    caption?: string;
  }): ImageResource {
    const node: ImageResource = this.imageLikeResource({
      type: ResourceType.image,
      ...data,
    }) as ImageResource;

    return node;
  }

  imageLinkResource(data: {
    format: string;
    url: string;
    src1x?: string;
    src2x?: string;
    src3x?: string;
    src4x?: string;
    width?: number;
    height?: number;
    alt?: string;
    license?: string;
    copyright?: string;
    provider?: string;
    showInIndex?: boolean;
    caption?: string;
  }): ImageLinkResource {
    const node: ImageLinkResource = this.imageLikeResource({
      type: ResourceType.imageLink,
      ...data,
    }) as ImageLinkResource;

    return node;
  }

  audioResource(data: {
    format: string;
    url: string; // src
    license?: string;
    copyright?: string;
    provider?: string;
    showInIndex?: boolean;
    caption?: string;
  }): AudioResource {
    const node: AudioResource = this.audioLikeResource({
      type: ResourceType.audio,
      ...data,
    }) as AudioResource;

    return node;
  }

  audioLinkResource(data: {
    format: string;
    url: string;
    license?: string;
    copyright?: string;
    provider?: string;
    showInIndex?: boolean;
    caption?: string;
  }): AudioLinkResource {
    const node: AudioLinkResource = this.audioLikeResource({
      type: ResourceType.audioLink,
      ...data,
    }) as AudioLinkResource;

    return node;
  }

  videoResource(data: {
    format: string;
    url: string; // src
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
    provider?: string;
    showInIndex?: boolean;
    caption?: string;
  }): VideoResource {
    const node: VideoResource = this.videoLikeResource({
      type: ResourceType.video,
      ...data,
    }) as VideoResource;

    return node;
  }

  videoLinkResource(data: {
    format: string;
    url: string;
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
    provider?: string;
    showInIndex?: boolean;
    caption?: string;
  }): VideoLinkResource {
    const node: VideoLinkResource = this.videoLikeResource({
      type: ResourceType.videoLink,
      ...data,
    }) as VideoLinkResource;

    return node;
  }

  stillImageFilmResource(data: {
    format: string;
    url: string; // src
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
    provider?: string;
    showInIndex?: boolean;
    caption?: string;
  }): StillImageFilmResource {
    const node: StillImageFilmResource = this.videoLikeResource({
      type: ResourceType.stillImageFilm,
      ...data,
    }) as StillImageFilmResource;

    return node;
  }

  stillImageFilmLinkResource(data: {
    format: string;
    url: string;
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
    provider?: string;
    showInIndex?: boolean;
    caption?: string;
  }): StillImageFilmLinkResource {
    const node: StillImageFilmLinkResource = this.videoLikeResource({
      type: ResourceType.stillImageFilmLink,
      ...data,
    }) as StillImageFilmLinkResource;

    return node;
  }

  articleResource(data: {
    format: string;
    href?: string;
    body?: string;
    license?: string;
    copyright?: string;
    provider?: string;
    showInIndex?: boolean;
    caption?: string;
  }): ArticleResource {
    const node: ArticleResource = this.articleLikeResource({
      type: ResourceType.article,
      ...data,
    }) as ArticleResource;

    return node;
  }

  articleLinkResource(data: {
    format: string;
    url: string;
    license?: string;
    copyright?: string;
    provider?: string;
    showInIndex?: boolean;
    caption?: string;
  }): ArticleLinkResource {
    const node: ArticleLinkResource = this.articleLikeResource({
      type: ResourceType.articleLink,
      ...data,
    }) as ArticleLinkResource;

    return node;
  }

  documentResource(data: {
    format: string;
    href?: string;
    body?: string;
    license?: string;
    copyright?: string;
    provider?: string;
    showInIndex?: boolean;
    caption?: string;
  }): DocumentResource {
    const node: DocumentResource = this.articleLikeResource({
      type: ResourceType.document,
      ...data,
    }) as DocumentResource;

    return node;
  }

  documentLinkResource(data: {
    format: string;
    url: string;
    license?: string;
    copyright?: string;
    provider?: string;
    showInIndex?: boolean;
    caption?: string;
  }): DocumentLinkResource {
    const node: DocumentLinkResource = this.articleLikeResource({
      type: ResourceType.documentLink,
      ...data,
    }) as DocumentLinkResource;

    return node;
  }

  appResource(data: {
    url: string; // app
    license?: string;
    copyright?: string;
    provider?: string;
    showInIndex?: boolean;
    caption?: string;
  }): AppResource {
    const node: AppResource = this.appLikeResource({
      type: ResourceType.appLink,
      ...data,
    }) as AppResource;

    return node;
  }

  appLinkResource(data: {
    url: string;
    license?: string;
    copyright?: string;
    provider?: string;
    showInIndex?: boolean;
    caption?: string;
  }): AppLinkResource {
    const node: AppLinkResource = this.appLikeResource({
      type: ResourceType.appLink,
      ...data,
    }) as AppLinkResource;

    return node;
  }

  websiteLinkResource(data: {
    url: string;
    siteName?: string;
    license?: string;
    copyright?: string;
    provider?: string;
    showInIndex?: boolean;
    caption?: string;
  }): WebsiteLinkResource {
    const { url, siteName, license, copyright, provider, showInIndex, caption } = data;

    // NOTE: Node order is important and is defined here
    const node: WebsiteLinkResource = {
      type: ResourceType.websiteLink,
      url,
      siteName,
      license,
      copyright,
      provider,
      showInIndex,
      caption,
    };

    // Remove Unset Optionals
    this.removeUnwantedProperties(node);

    return node;
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

  handleBitReference(bit: Bit, reference: string | string[] | undefined) {
    if (Array.isArray(reference) && reference.length > 0) {
      bit.referenceProperties = reference;
    } else if (reference) {
      bit.reference = reference as string;
    }
  }

  // Validation

  validateBit(bit: Bit) {
    switch (bit.bitType) {
      case BitType.interview:
      case BitType.interviewInstructionGrouped:
      case BitType.botInterview:
        this.validateInterviewBit(bit);
        break;
    }
  }

  //
  // Private
  //

  private imageLikeResource(data: {
    type: 'image' | 'image-link';
    format: string;
    url: string;
    src1x?: string;
    src2x?: string;
    src3x?: string;
    src4x?: string;
    width?: number;
    height?: number;
    alt?: string;
    license?: string;
    copyright?: string;
    provider?: string;
    showInIndex?: boolean;
    caption?: string;
  }): ImageResource | ImageLinkResource {
    const {
      type,
      format,
      url,
      src1x,
      src2x,
      src3x,
      src4x,
      width,
      height,
      alt,
      license,
      copyright,
      provider,
      showInIndex,
      caption,
    } = data;

    // NOTE: Node order is important and is defined here
    const node: ImageResource | ImageLinkResource = {
      type,
      format,
      url,
      src1x,
      src2x,
      src3x,
      src4x,
      width,
      height,
      alt,
      license,
      copyright,
      provider,
      showInIndex,
      caption,
    };

    // Remove Unset Optionals
    this.removeUnwantedProperties(node);

    return node;
  }

  private audioLikeResource(data: {
    type: 'audio' | 'audio-link';
    format: string;
    url: string;
    license?: string;
    copyright?: string;
    provider?: string;
    showInIndex?: boolean;
    caption?: string;
  }): AudioResource | AudioLinkResource {
    const { type, format, url, license, copyright, provider, showInIndex, caption } = data;

    // NOTE: Node order is important and is defined here
    const node: AudioResource | AudioLinkResource = {
      type,
      format,
      url,
      license,
      copyright,
      provider,
      showInIndex,
      caption,
    };

    // Remove Unset Optionals
    this.removeUnwantedProperties(node);

    return node;
  }

  private videoLikeResource(data: {
    type: 'video' | 'video-link' | 'still-image-film' | 'still-image-film-link';
    format: string;
    url: string;
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
    provider?: string;
    showInIndex?: boolean;
    caption?: string;
  }): VideoResource | VideoLinkResource | StillImageFilmResource | StillImageFilmLinkResource {
    const {
      type,
      format,
      url,
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
      provider,
      showInIndex,
      caption,
    } = data;

    // NOTE: Node order is important and is defined here
    const node: VideoResource | VideoLinkResource | StillImageFilmResource | StillImageFilmLinkResource = {
      type,
      format,
      url,
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
      provider,
      showInIndex,
      caption,
    };

    // Remove Unset Optionals
    this.removeUnwantedProperties(node);

    return node;
  }

  private articleLikeResource(data: {
    type: 'article' | 'article-link' | 'document' | 'document-link';
    format: string | undefined;
    url?: string; // url / href
    body?: string | undefined;
    license?: string;
    copyright?: string;
    provider?: string;
    showInIndex?: boolean;
    caption?: string;
  }): ArticleResource | ArticleLinkResource | DocumentResource | DocumentLinkResource {
    const { type, format, url, body, license, copyright, provider, showInIndex, caption } = data;

    // NOTE: Node order is important and is defined here
    const node: ArticleResource | ArticleLinkResource | DocumentResource | DocumentLinkResource = {
      type,
      format,
      url,
      body,
      license,
      copyright,
      provider,
      showInIndex,
      caption,
    };

    // Remove Unset Optionals
    this.removeUnwantedProperties(node);

    return node;
  }

  private appLikeResource(data: {
    type: 'app' | 'app-link';
    url: string; // url / app
    license?: string;
    copyright?: string;
    provider?: string;
    showInIndex?: boolean;
    caption?: string;
  }): AppResource | AppLinkResource {
    const { type, url, license, copyright, provider, showInIndex, caption } = data;

    // NOTE: Node order is important and is defined here
    const node: AppResource | AppLinkResource = {
      type,
      url,
      license,
      copyright,
      provider,
      showInIndex,
      caption,
    };

    // Remove Unset Optionals
    this.removeUnwantedProperties(node);

    return node;
  }

  private validateInterviewBit(bit: Bit) {
    // Ensure bit has a questions array as the
    // ===
    // ===
    // must be included in the markup
    if (!bit.questions) {
      bit.questions = [];
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private removeUnwantedProperties(obj: any, options?: RemoveUnwantedPropertiesOptions): void {
    options = Object.assign({}, options);

    this.removeUndefinedProperties(obj, options.ignoreUndefined);
    this.removeFalseProperties(obj, options.ignoreFalse);
    this.removeEmptyStringProperties(obj, options.ignoreEmptyString);
    this.removeEmptyArrayProperties(obj, options.ignoreEmptyArrays);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private removeUndefinedProperties(obj: any, ignoreKeys?: string[]): void {
    for (const [k, v] of Object.entries(obj)) {
      if (ignoreKeys && ignoreKeys.indexOf(k) >= 0) continue;

      if (v == undefined) {
        delete obj[k];
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private removeFalseProperties(obj: any, ignoreKeys?: string[]): void {
    for (const [k, v] of Object.entries(obj)) {
      if (ignoreKeys && ignoreKeys.indexOf(k) >= 0) continue;

      if (v === false) {
        delete obj[k];
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private removeEmptyStringProperties(obj: any, ignoreKeys?: string[]): void {
    for (const [k, v] of Object.entries(obj)) {
      if (ignoreKeys && ignoreKeys.indexOf(k) >= 0) continue;

      if (v === '') {
        delete obj[k];
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private removeEmptyArrayProperties(obj: any, ignoreKeys?: string[]): void {
    for (const [k, v] of Object.entries(obj)) {
      if (ignoreKeys && ignoreKeys.indexOf(k) >= 0) continue;

      if (Array.isArray(v) && v.length === 0) {
        delete obj[k];
      }
    }
  }

  private asArray<T>(val: T | T[] | undefined): T[] | undefined {
    if (val == null) return undefined;
    if (Array.isArray(val)) return val;
    return [val];
  }
}

const builder = new Builder();

export { builder as Builder };
