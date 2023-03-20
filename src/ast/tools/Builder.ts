import { BitTypeType } from '../types/BitType';
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
} from '../nodes/BitmarkNodes';

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
    ageRanges?: number | number[];
    languages?: string | string[];
    computerLanguages?: string | string[];
    _properties?: Property[]; // unused
    item?: string;
    lead?: string;
    hint?: string;
    instruction?: string;
    example?: string | boolean;
    elements?: string[];
    statements?: Statement[];
    choices?: Choice[];
    responses?: Response[];
    quizzes?: Quiz[];
    pairs?: Pair[];
    resource?: Resource;
    body?: Body;
  }): Bit {
    const {
      bitType,
      textFormat,
      ids,
      ageRanges,
      languages,
      computerLanguages,
      resource,
      item,
      lead,
      hint,
      instruction,
      example,
      elements,
      statements,
      choices,
      responses,
      quizzes,
      pairs,
      body,
    } = data;

    // NOTE: Node order is important and is defined here
    const node: Bit = {
      bitType,
      textFormat: TextFormat.fromValue(textFormat) ?? TextFormat.bitmarkMinusMinus,
      ids: this.asArray(ids),
      ageRanges: this.asArray(ageRanges),
      languages: this.asArray(languages),
      computerLanguages: this.asArray(computerLanguages),
      resource,
      itemLead: this.itemLead(item, lead),
      hint,
      instruction,
      example,
      elements,
      statements,
      choices,
      responses,
      quizzes,
      pairs,
      body,
    };

    // Remove Optionals
    if (!node.ids) delete node.ids;
    if (!node.ageRanges) delete node.ageRanges;
    if (!node.languages) delete node.languages;
    if (!node.computerLanguages) delete node.computerLanguages;
    if (!node.resource) delete node.resource;
    if (!node.itemLead) delete node.itemLead;
    if (!node.hint) delete node.hint;
    if (!node.instruction) delete node.instruction;
    if (!node.example) delete node.example;
    if (!node.elements) delete node.elements;
    if (!node.statements) delete node.statements;
    if (!node.choices) delete node.choices;
    if (!node.responses) delete node.responses;
    if (!node.quizzes) delete node.quizzes;
    if (!node.pairs) delete node.pairs;
    if (!node.body) delete node.body;

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

    // Remove Optionals
    if (!node.itemLead) delete node.itemLead;
    if (!node.hint) delete node.hint;
    if (!node.instruction) delete node.instruction;
    if (!node.example) delete node.example;
    if (!node.isCaseSensitive) delete node.isCaseSensitive;

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

    // Remove Optionals
    if (!node.itemLead) delete node.itemLead;
    if (!node.hint) delete node.hint;
    if (!node.instruction) delete node.instruction;
    if (!node.example) delete node.example;
    if (!node.isCaseSensitive) delete node.isCaseSensitive;

    return node;
  }

  quiz(data: {
    choices?: Choice[];
    responses?: Response[];
    item?: string;
    lead?: string;
    hint?: string;
    instruction?: string;
    example?: string | boolean;
  }): Quiz {
    const { choices, responses, item, lead, hint, instruction, example } = data;

    // NOTE: Node order is important and is defined here
    const node: Quiz = {
      choices,
      responses,
      itemLead: this.itemLead(item, lead),
      hint,
      instruction,
      example,
    };

    // Remove Optionals
    if (!node.choices) delete node.choices;
    if (!node.responses) delete node.responses;
    if (!node.itemLead) delete node.itemLead;
    if (!node.hint) delete node.hint;
    if (!node.instruction) delete node.instruction;
    if (!node.example) delete node.example;

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

    // Remove Optionals
    if (!node.itemLead) delete node.itemLead;
    if (!node.hint) delete node.hint;
    if (!node.instruction) delete node.instruction;
    if (!node.example) delete node.example;
    if (!node.isCaseSensitive) delete node.isCaseSensitive;
    if (!node.isLongAnswer) delete node.isLongAnswer;

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

    // Remove Optionals
    if (!node.gap.itemLead) delete node.gap.itemLead;
    if (!node.gap.hint) delete node.gap.hint;
    if (!node.gap.instruction) delete node.gap.instruction;
    if (!node.gap.example) delete node.gap.example;
    if (!node.gap.isCaseSensitive) delete node.gap.isCaseSensitive;

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

    // Remove Optionals
    if (!node.select.itemLead) delete node.select.itemLead;
    if (!node.select.hint) delete node.select.hint;
    if (!node.select.instruction) delete node.select.instruction;
    if (!node.select.example) delete node.select.example;
    if (!node.select.isCaseSensitive) delete node.select.isCaseSensitive;

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

    // Remove Optionals
    if (!node.itemLead) delete node.itemLead;
    if (!node.hint) delete node.hint;
    if (!node.instruction) delete node.instruction;
    if (!node.example) delete node.example;
    if (!node.isCaseSensitive) delete node.isCaseSensitive;

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

    // Remove Optionals
    if (!node.itemLead) delete node.itemLead;
    if (!node.hint) delete node.hint;
    if (!node.instruction) delete node.instruction;
    if (!node.example) delete node.example;
    if (!node.isCaseSensitive) delete node.isCaseSensitive;

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
      caption?: string;

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
    caption?: string;
    license?: string;
    copyright?: string;
    provider?: string;
    showInIndex?: boolean;
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
    caption?: string;
    license?: string;
    copyright?: string;
    provider?: string;
    showInIndex?: boolean;
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
  }): WebsiteLinkResource {
    const { url, siteName, license, copyright, provider, showInIndex } = data;

    // NOTE: Node order is important and is defined here
    const node: WebsiteLinkResource = {
      type: ResourceType.websiteLink,
      url,
      siteName,
      license,
      copyright,
      provider,
      showInIndex,
    };

    // Remove Optionals
    if (!node.format) delete node.format;
    if (!node.url) delete node.url;
    if (!node.siteName) delete node.siteName;
    if (!node.license) delete node.license;
    if (!node.copyright) delete node.copyright;
    if (!node.provider) delete node.provider;
    if (!node.showInIndex) delete node.showInIndex;

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
    caption?: string;
    license?: string;
    copyright?: string;
    provider?: string;
    showInIndex?: boolean;
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
      caption,
      license,
      copyright,
      provider,
      showInIndex,
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
      caption,
      license,
      copyright,
      provider,
      showInIndex,
    };

    // Remove Optionals
    if (!node.format) delete node.format;
    if (!node.url) delete node.url;
    if (!node.src1x) delete node.src1x;
    if (!node.src2x) delete node.src2x;
    if (!node.src3x) delete node.src3x;
    if (!node.src4x) delete node.src4x;
    if (!node.width) delete node.width;
    if (!node.height) delete node.height;
    if (!node.alt) delete node.alt;
    if (!node.caption) delete node.caption;
    if (!node.license) delete node.license;
    if (!node.copyright) delete node.copyright;
    if (!node.provider) delete node.provider;
    if (!node.showInIndex) delete node.showInIndex;

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
  }): AudioResource | AudioLinkResource {
    const { type, format, url, license, copyright, provider, showInIndex } = data;

    // NOTE: Node order is important and is defined here
    const node: AudioResource | AudioLinkResource = {
      type,
      format,
      url,
      license,
      copyright,
      provider,
      showInIndex,
    };

    // Remove Optionals
    if (!node.format) delete node.format;
    if (!node.url) delete node.url;
    if (!node.license) delete node.license;
    if (!node.copyright) delete node.copyright;
    if (!node.provider) delete node.provider;
    if (!node.showInIndex) delete node.showInIndex;

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
    };

    // Remove Optionals
    if (!node.format) delete node.format;
    if (!node.url) delete node.url;
    if (!node.width) delete node.width;
    if (!node.height) delete node.height;
    if (!node.duration) delete node.duration;
    if (!node.mute) delete node.mute;
    if (!node.autoplay) delete node.autoplay;
    if (!node.allowSubtitles) delete node.allowSubtitles;
    if (!node.showSubtitles) delete node.showSubtitles;
    if (!node.alt) delete node.alt;
    if (!node.posterImage) delete node.posterImage;
    if (!node.thumbnails) delete node.thumbnails;
    if (!node.license) delete node.license;
    if (!node.copyright) delete node.copyright;
    if (!node.provider) delete node.provider;
    if (!node.showInIndex) delete node.showInIndex;

    return node;
  }

  articleLikeResource(data: {
    type: 'article' | 'article-link' | 'document' | 'document-link';
    format: string | undefined;
    url?: string; // url / href
    body?: string | undefined;
    license?: string;
    copyright?: string;
    provider?: string;
    showInIndex?: boolean;
  }): ArticleResource | ArticleLinkResource | DocumentResource | DocumentLinkResource {
    const { type, format, url, body, license, copyright, provider, showInIndex } = data;

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
    };

    // Remove Optionals
    if (!node.format) delete node.format;
    if (!node.url) delete node.url;
    if (!node.body) delete node.body;
    if (!node.license) delete node.license;
    if (!node.copyright) delete node.copyright;
    if (!node.provider) delete node.provider;
    if (!node.showInIndex) delete node.showInIndex;

    return node;
  }

  appLikeResource(data: {
    type: 'app' | 'app-link';
    url: string; // url / app
    license?: string;
    copyright?: string;
    provider?: string;
    showInIndex?: boolean;
  }): AppResource | AppLinkResource {
    const { type, url, license, copyright, provider, showInIndex } = data;

    // NOTE: Node order is important and is defined here
    const node: AppResource | AppLinkResource = {
      type,
      url,
      license,
      copyright,
      provider,
      showInIndex,
    };

    // Remove Optionals
    if (!node.format) delete node.format;
    if (!node.url) delete node.url;
    if (!node.license) delete node.license;
    if (!node.copyright) delete node.copyright;
    if (!node.provider) delete node.provider;
    if (!node.showInIndex) delete node.showInIndex;

    return node;
  }

  private asArray<T>(val: T | T[] | undefined): T[] | undefined {
    if (val == null) return undefined;
    if (Array.isArray(val)) return val;
    return [val];
  }
}

const builder = new Builder();

export { builder as Builder };
