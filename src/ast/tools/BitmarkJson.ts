import { StringUtils } from '../../utils/StringUtils';
import { BitWrapperJson } from '../json/BitWrapperJson';
import { ResourceDataJson, ResourceJson } from '../json/ResourceJson';
import { BitType, BitTypeType } from '../types/BitType';
import { BodyBitType } from '../types/BodyBitType';
import { TextFormatType } from '../types/TextFormat';
import { ResourceType, ResourceTypeType } from '../types/resources/ResouceType';

import { Builder } from './Builder';

import {
  BitJson,
  ChoiceBitJson,
  HeadingJson,
  PairBitJson,
  QuestionJson,
  QuizBitJson,
  ResponseBitJson,
  StatementBitJson,
} from '../json/BitJson';
import {
  GapBitJson,
  BodyBitJson,
  BodyBitsJson,
  SelectBitJson,
  SelectOptionBitJson,
  HighlightBitJson,
  HighlightTextBitJson,
} from '../json/BodyBitJson';
import {
  Bit,
  Bitmark,
  Body,
  BodyPart,
  BodyText,
  Choice,
  FooterText,
  Gap,
  Heading,
  Highlight,
  HighlightText,
  ImageResource,
  Pair,
  Question,
  Quiz,
  Resource,
  Response,
  Select,
  SelectOption,
  Statement,
} from '../nodes/BitmarkNodes';

// const BODY_SPLIT_REGEX = new RegExp('{[0-9]+}', 'g');

/**
 * Bitmark JSON handing
 *
 * NOTES:
 * - Need to store JSON properties from bitmark in a sub-variable, otherwise it is not possible to distinguish
 *   them from other things in the JSON without a complex process (plus there can be clashes right now)
 */
class BitmarkJson {
  toAst(json: unknown): Bitmark {
    const bitWrappers = this.preprocessJson(json);
    const bitsNodes: Bit[] = [];

    for (const bitWrapper of bitWrappers) {
      const { bit /*, bitmark*/ } = bitWrapper;

      // console.log(`${bitmark ?? ''}`);
      // console.log('\n\n');

      // Transform to AST
      const bitsNode = this.bitToAst(bit);
      if (bitsNode) {
        bitsNodes.push(bitsNode);
      }
    }

    const bitmarkNode = Builder.bitmark({ bits: bitsNodes });

    return bitmarkNode;
  }

  //   // @property
  //   const properties: ValidPropertiesJson = {} as ValidPropertiesJson;
  //   if (id) properties.id = id;
  //   if (ageRange) properties.ageRange = ageRange;
  //   if (language) properties.language = language;
  //   if (labelTrue) properties.labelTrue = labelTrue;
  //   if (labelFalse) properties.labelFalse = labelFalse;

  //   for (const [k, v] of Object.entries(properties)) {
  //     let vArray = v;
  //     if (!Array.isArray(vArray)) {
  //       vArray = [v as string];
  //     }
  //     for (const val of vArray) {
  //       const child = this.bitToAstRecursive({
  //         _type: BitType.property,
  //         _key: k,
  //         _value: val,
  //       } as RecurringBitJson);
  //       propertyNodes.push(child);
  //     }
  //   }

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

  isBitWrapper(bitWrapper: unknown): boolean {
    if (Object.prototype.hasOwnProperty.call(bitWrapper, 'bit')) {
      const w = bitWrapper as BitWrapperJson;
      return this.isBit(w.bit);
    }
    return false;
  }

  isBit(bit: unknown): boolean {
    if (Object.prototype.hasOwnProperty.call(bit, 'type')) {
      const b = bit as BitJson;
      return !!BitType.fromValue(b.type);
    }
    return false;
  }

  bitToBitWrapper(bit: BitJson): BitWrapperJson {
    return {
      bit,
    };
  }

  private bitToAst(bit: BitJson): Bit | undefined {
    const {
      type,
      format,
      id,
      externalId,
      ageRange,
      language,
      computerLanguage,
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
      duration,
      deeplink,
      externalLink,
      externalLinkText,
      videoCallLink,
      bot,
      list,
      labelTrue,
      labelFalse,
      quotedPerson,
      book,
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
      isExample,
      example,
      resource,
      body,
      elements,
      statement,
      isCorrect,
      statements,
      responses,
      quizzes,
      heading,
      pairs,
      choices,
      questions,
      footer,
      placeholders,
    } = bit;

    // resource
    const resourceNode = this.resourceBitToAst(resource);

    // body & placeholders
    const bodyNode = this.bodyToAst(body, placeholders);

    //+-statement
    const statementNodes = this.statementBitsToAst(statement, isCorrect, statements);

    //+-response
    const responseNodes = this.responseBitsToAst(responses);

    // quizzes
    const quizNodes = this.quizBitsToAst(quizzes);

    // heading
    const headingNode = this.headingBitToAst(heading);

    // pairs
    const pairsNodes = this.pairBitsToAst(pairs);

    //+-choice
    const choiceNodes = this.choiceBitsToAst(choices);

    // questions
    const questionNodes = this.questionBitsToAst(questions);

    // footer
    const footerNode = this.footerToAst(footer);

    // Build bit
    const bitNode = Builder.bit({
      bitType: type as BitTypeType,
      textFormat: format as TextFormatType | undefined,
      ids: id,
      externalIds: externalId,
      ageRanges: ageRange,
      languages: language,
      computerLanguages: computerLanguage,
      coverImages: coverImage,
      publishers: publisher,
      publications,
      authors: author,
      dates: date,
      locations: location,
      themes: theme,
      kinds: kind,
      actions: action,
      durations: duration,
      thumbImages: thumbImage,
      deepLinks: deeplink,
      externalLink,
      externalLinkText,
      videoCallLinks: videoCallLink,
      bots: bot,
      lists: list,
      labelTrue,
      labelFalse,
      quotedPerson,
      book,
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
      example: example || isExample,
      resource: resourceNode,
      body: bodyNode,
      elements,
      statements: statementNodes,
      responses: responseNodes,
      quizzes: quizNodes,
      heading: headingNode,
      pairs: pairsNodes,
      choices: choiceNodes,
      questions: questionNodes,
      footer: footerNode,
    });

    return bitNode;
  }

  private statementBitsToAst(
    statement?: string,
    isCorrect?: boolean,
    statements?: StatementBitJson[],
  ): Statement[] | undefined {
    const nodes: Statement[] = [];

    if (statement) {
      const node = Builder.statement({ text: statement, isCorrect: isCorrect ?? false });
      nodes.push(node);
    }

    if (Array.isArray(statements)) {
      for (const s of statements) {
        const { statement, isCorrect, item, lead, hint, instruction, isExample, example, isCaseSensitive } = s;
        const node = Builder.statement({
          text: statement,
          isCorrect,
          item,
          lead,
          hint,
          instruction,
          example: example || isExample,
          isCaseSensitive,
        });
        nodes.push(node);
      }
    }

    if (nodes.length === 0) return undefined;

    return nodes;
  }

  private choiceBitsToAst(choices?: ChoiceBitJson[]): Choice[] | undefined {
    const nodes: Choice[] = [];
    if (Array.isArray(choices)) {
      for (const c of choices) {
        const { choice, isCorrect, item, lead, hint, instruction, isExample, example, isCaseSensitive } = c;
        const node = Builder.choice({
          text: choice,
          isCorrect,
          item,
          lead,
          hint,
          instruction,
          example: example || isExample,
          isCaseSensitive,
        });
        nodes.push(node);
      }
    }

    if (nodes.length === 0) return undefined;

    return nodes;
  }

  private responseBitsToAst(responses?: ResponseBitJson[]): Response[] | undefined {
    const nodes: Response[] = [];
    if (Array.isArray(responses)) {
      for (const r of responses) {
        const { response, isCorrect, item, lead, hint, instruction, isExample, example, isCaseSensitive } = r;
        const node = Builder.response({
          text: response,
          isCorrect,
          item,
          lead,
          hint,
          instruction,
          example: example || isExample,
          isCaseSensitive,
        });
        nodes.push(node);
      }
    }

    if (nodes.length === 0) return undefined;

    return nodes;
  }

  private selectOptionBitsToAst(options?: SelectOptionBitJson[]): SelectOption[] {
    const nodes: SelectOption[] = [];
    if (Array.isArray(options)) {
      for (const o of options) {
        const { text, isCorrect, item, lead, hint, instruction, isExample, example, isCaseSensitive } = o;
        const node = Builder.selectOption({
          text,
          isCorrect,
          item,
          lead,
          hint,
          instruction,
          example: example || isExample,
          isCaseSensitive,
        });
        nodes.push(node);
      }
    }

    return nodes;
  }

  private highlightTextBitsToAst(highlightTexts?: HighlightTextBitJson[]): HighlightText[] {
    const nodes: HighlightText[] = [];
    if (Array.isArray(highlightTexts)) {
      for (const t of highlightTexts) {
        const { text, isCorrect, isHighlighted, item, lead, hint, instruction, isExample, example, isCaseSensitive } =
          t;
        const node = Builder.highlightText({
          text,
          isCorrect,
          isHighlighted,
          item,
          lead,
          hint,
          instruction,
          example: example || isExample,
          isCaseSensitive,
        });
        nodes.push(node);
      }
    }

    return nodes;
  }

  private quizBitsToAst(quizzes?: QuizBitJson[]): Quiz[] | undefined {
    const nodes: Quiz[] = [];
    if (Array.isArray(quizzes)) {
      for (const q of quizzes) {
        const { item, lead, hint, instruction, isExample, example, choices, responses } = q;
        const choiceNodes = this.choiceBitsToAst(choices);
        const responseNodes = this.responseBitsToAst(responses);
        const node = Builder.quiz({
          item,
          lead,
          hint,
          instruction,
          example: example || isExample,
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
      node = Builder.heading({ forKeys: heading.forKeys, forValues: heading.forValues });
    }

    return node;
  }

  private pairBitsToAst(pairs?: PairBitJson[]): Pair[] | undefined {
    const nodes: Pair[] = [];
    if (Array.isArray(pairs)) {
      for (const p of pairs) {
        const { key, values, item, lead, hint, instruction, isExample, example, isCaseSensitive, isLongAnswer } = p;
        const node = Builder.pair({
          key,
          values,
          item,
          lead,
          hint,
          instruction,
          example: example || isExample,
          isCaseSensitive,
          isLongAnswer,
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
          isExample,
          example,
          isCaseSensitive,
          isShortAnswer,
        } = q;
        const node = Builder.question({
          question,
          partialAnswer,
          sampleSolution,
          item,
          lead,
          hint,
          instruction,
          example: example || isExample,
          isCaseSensitive,
          isShortAnswer,
        });
        nodes.push(node);
      }
    }

    if (nodes.length === 0) return undefined;

    return nodes;
  }

  private resourceBitToAst(resource?: ResourceJson): Resource | undefined {
    let node: Resource | undefined;

    if (resource) {
      let resourceKey = ResourceType.keyFromValue(resource.type) ?? ResourceType.unknown;

      // Extra resource key mapping for 'still-image-film' / 'still-image-film-link'
      if (resource.type === ResourceType.stillImageFilm) {
        // TODO - I think this is wrong and should be 'video', not 'image'
        resourceKey = ResourceType.keyFromValue(ResourceType.image) ?? ResourceType.unknown;
        // resourceKey = ResourceType.keyFromValue(ResourceType.video) ?? ResourceType.unknown;
      } else if (resource.type === ResourceType.stillImageFilmLink) {
        resourceKey = ResourceType.keyFromValue(ResourceType.videoLink) ?? ResourceType.unknown;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: ResourceDataJson | undefined = (resource as any)[resourceKey];

      if (!data) return undefined;

      node = this.resourceDataToAst(resource.type, data);
    }

    return node;
  }

  private resourceDataToAst(type: ResourceTypeType, data?: Partial<ResourceDataJson>): Resource | undefined {
    let node: Resource | undefined;

    if (data) {
      if (!data) return undefined;

      const dataAsString: string | undefined = StringUtils.isString(data) ? (data as string) : undefined;

      // url / src / href / app
      const url = data.url || data.src || data.href || data.app || dataAsString;

      // Sub resources
      const posterImage = this.resourceDataToAst(ResourceType.image, data.posterImage) as ImageResource;
      const thumbnails = data.thumbnails
        ? data.thumbnails.map((t) => {
            return this.resourceDataToAst(ResourceType.image, t) as ImageResource;
          })
        : undefined;

      // Resource
      node = Builder.resource({
        type,

        // Generic (except Article / Document)
        url,

        // ImageLikeResource / AudioLikeResource / VideoLikeResource / Article / Document
        format: data.format,

        // ImageLikeResource
        src1x: data.src1x,
        src2x: data.src2x,
        src3x: data.src3x,
        src4x: data.src4x,
        caption: data.caption,

        // ImageLikeResource / VideoLikeResource
        width: data.width,
        height: data.height,
        alt: data.alt,

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

        // ArticleLikeResource
        body: data.body,

        // Generic Resource
        license: data.license,
        copyright: data.copyright,
        provider: data.provider,
        showInIndex: data.showInIndex,
      });
    }

    return node;
  }

  private bodyToAst(body: string, placeholders: BodyBitsJson): Body | undefined {
    let node: Body | undefined;

    const placeholderNodes: {
      [keyof: string]: BodyPart;
    } = {};

    // Placeholders
    if (placeholders) {
      for (const [key, val] of Object.entries(placeholders)) {
        const bit = this.bodyBitToAst(val);
        placeholderNodes[key] = bit;
      }
    }

    // Body (with insterted placeholders)
    if (body) {
      // TODO - this split will need escaping, but actually we shouldn't need it anyway once bitmark JSON is actually
      // all JSON

      const bodyPartNodes: BodyPart[] = [];
      const bodyParts: string[] = StringUtils.splitPlaceholders(body, Object.keys(placeholderNodes));

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

      node = Builder.body({ bodyParts: bodyPartNodes });
    }

    return node;
  }

  private bodyTextToAst(bodyText: string): BodyText {
    // TODO => Will be more complicated one the body text is JSON
    return Builder.bodyText({ text: bodyText });
  }

  private bodyBitToAst(bit: BodyBitJson): BodyPart {
    switch (bit.type) {
      case BodyBitType.gap: {
        const gap = this.gapBitToAst(bit);
        return gap;
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

  private footerToAst(footerText: string): FooterText | undefined {
    // TODO => Will be more complicated one the body text is JSON
    if (StringUtils.isString(footerText)) {
      return Builder.footerText({ text: footerText });
    }
    return undefined;
  }

  private gapBitToAst(bit: GapBitJson): Gap {
    const { item, lead, hint, instruction, isExample, example, isCaseSensitive, solutions } = bit;

    // Build bit
    const bitNode = Builder.gap({
      solutions,
      item,
      lead,
      hint,
      instruction,
      example: example || isExample,
      isCaseSensitive,
    });

    return bitNode;
  }

  private selectBitToAst(bit: SelectBitJson): Select {
    const { options, prefix, postfix, item, lead, hint, instruction, isExample, example } = bit;

    // Build options bits
    const selectOptionNodes = this.selectOptionBitsToAst(options);

    // Build bit
    const node = Builder.select({
      options: selectOptionNodes,
      prefix,
      postfix,
      item,
      lead,
      hint,
      instruction,
      example: example || isExample,
      isCaseSensitive: true,
    });

    return node;
  }

  private highlightBitToAst(bit: HighlightBitJson): Highlight {
    const { texts, prefix, postfix, item, lead, hint, instruction, isExample, example } = bit;

    // Build options bits
    const highlightTextNodes = this.highlightTextBitsToAst(texts);

    // Build bit
    const node = Builder.highlight({
      texts: highlightTextNodes,
      prefix,
      postfix,
      item,
      lead,
      hint,
      instruction,
      example: example || isExample,
      isCaseSensitive: true,
    });

    return node;
  }
}

const bitmarkJson = new BitmarkJson();

export { bitmarkJson as BitmarkJson };
