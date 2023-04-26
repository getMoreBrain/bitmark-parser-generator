import { Builder } from '../../ast/Builder';
import { BitType, BitTypeType } from '../../model/enum/BitType';
import { BodyBitType } from '../../model/enum/BodyBitType';
import { ResourceType, ResourceTypeType } from '../../model/enum/ResourceType';
import { TextFormatType } from '../../model/enum/TextFormat';
import { BitWrapperJson } from '../../model/json/BitWrapperJson';
import { ResourceJson, ResourceDataJson } from '../../model/json/ResourceJson';
import { StringUtils } from '../../utils/StringUtils';

import {
  AudioResource,
  Bit,
  BitmarkAst,
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
  Matrix,
  MatrixCell,
  Pair,
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
  QuizJson,
  ResponseJson,
  StatementJson,
} from '../../model/json/BitJson';
import {
  SelectOptionJson,
  HighlightTextJson,
  BodyBitsJson,
  BodyBitJson,
  GapJson,
  SelectJson,
  HighlightJson,
} from '../../model/json/BodyBitJson';

// const BODY_SPLIT_REGEX = new RegExp('{[0-9]+}', 'g');

const builder = new Builder();

/**
 * A parser for parsing bitmark JSON to bitmark AST
 */
class JsonParser {
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
      const { bit } = bitWrapper;

      // Transform to AST
      const bitsNode = this.bitToAst(bit);
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
      return !!BitType.fromValue(b.type);
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
      sampleSolution,
      elements,
      statement,
      isCorrect,
      statements,
      responses,
      quizzes,
      heading,
      pairs,
      matrix,
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

    // matrix
    const matrixNodes = this.matrixBitsToAst(matrix);

    //+-choice
    const choiceNodes = this.choiceBitsToAst(choices);

    // questions
    const questionNodes = this.questionBitsToAst(questions);

    // footer
    const footerNode = this.footerToAst(footer);

    // Build bit
    const bitNode = builder.bit({
      bitType: type as BitTypeType,
      textFormat: format as TextFormatType | undefined,
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
      duration,
      thumbImage,
      deepLink: deeplink,
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
      example: example || isExample,
      resource: resourceNode,
      body: bodyNode,
      sampleSolutions: sampleSolution,
      elements,
      statements: statementNodes,
      responses: responseNodes,
      quizzes: quizNodes,
      heading: headingNode,
      pairs: pairsNodes,
      matrix: matrixNodes,
      choices: choiceNodes,
      questions: questionNodes,
      footer: footerNode,
    });

    return bitNode;
  }

  private statementBitsToAst(
    statement?: string,
    isCorrect?: boolean,
    statements?: StatementJson[],
  ): Statement[] | undefined {
    const nodes: Statement[] = [];

    if (statement) {
      const node = builder.statement({ text: statement, isCorrect: isCorrect ?? false });
      nodes.push(node);
    }

    if (Array.isArray(statements)) {
      for (const s of statements) {
        const { statement, isCorrect, item, lead, hint, instruction, isExample, example, isCaseSensitive } = s;
        const node = builder.statement({
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

  private choiceBitsToAst(choices?: ChoiceJson[]): Choice[] | undefined {
    const nodes: Choice[] = [];
    if (Array.isArray(choices)) {
      for (const c of choices) {
        const { choice, isCorrect, item, lead, hint, instruction, isExample, example, isCaseSensitive } = c;
        const node = builder.choice({
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

  private responseBitsToAst(responses?: ResponseJson[]): Response[] | undefined {
    const nodes: Response[] = [];
    if (Array.isArray(responses)) {
      for (const r of responses) {
        const { response, isCorrect, item, lead, hint, instruction, isExample, example, isCaseSensitive } = r;
        const node = builder.response({
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

  private selectOptionBitsToAst(options?: SelectOptionJson[]): SelectOption[] {
    const nodes: SelectOption[] = [];
    if (Array.isArray(options)) {
      for (const o of options) {
        const { text, isCorrect, item, lead, hint, instruction, isExample, example, isCaseSensitive } = o;
        const node = builder.selectOption({
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

  private highlightTextBitsToAst(highlightTexts?: HighlightTextJson[]): HighlightText[] {
    const nodes: HighlightText[] = [];
    if (Array.isArray(highlightTexts)) {
      for (const t of highlightTexts) {
        const { text, isCorrect, isHighlighted, item, lead, hint, instruction, isExample, example, isCaseSensitive } =
          t;
        const node = builder.highlightText({
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

  private quizBitsToAst(quizzes?: QuizJson[]): Quiz[] | undefined {
    const nodes: Quiz[] = [];
    if (Array.isArray(quizzes)) {
      for (const q of quizzes) {
        const { item, lead, hint, instruction, isExample, example, choices, responses } = q;
        const choiceNodes = this.choiceBitsToAst(choices);
        const responseNodes = this.responseBitsToAst(responses);
        const node = builder.quiz({
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
      node = builder.heading({ forKeys: heading.forKeys, forValues: heading.forValues });
    }

    return node;
  }

  private pairBitsToAst(pairs?: PairJson[]): Pair[] | undefined {
    const nodes: Pair[] = [];
    if (Array.isArray(pairs)) {
      for (const p of pairs) {
        const {
          key,
          keyAudio,
          keyImage,
          values,
          item,
          lead,
          hint,
          instruction,
          isExample,
          example,
          isCaseSensitive,
          isLongAnswer,
        } = p;

        const audio = this.resourceDataToAst(ResourceType.audio, keyAudio) as AudioResource;
        const image = this.resourceDataToAst(ResourceType.image, keyImage) as ImageResource;

        const node = builder.pair({
          key,
          keyAudio: audio,
          keyImage: image,
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

  private matrixBitsToAst(matrix?: MatrixJson[]): Matrix[] | undefined {
    const nodes: Matrix[] = [];
    if (Array.isArray(matrix)) {
      for (const m of matrix) {
        const { key, cells, item, lead, hint, instruction, isExample, example, isCaseSensitive, isLongAnswer } = m;
        const node = builder.matrix({
          key,
          cells: this.matrixCellsToAst(cells) ?? [],
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

  private matrixCellsToAst(matrixCells?: MatrixCellJson[]): MatrixCell[] | undefined {
    const nodes: MatrixCell[] = [];
    if (Array.isArray(matrixCells)) {
      for (const mc of matrixCells) {
        const { values, item, lead, hint, instruction, isExample, example } = mc;

        const node = builder.matrixCell({
          values,
          item,
          lead,
          hint,
          instruction,
          example: example || isExample,
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
        const node = builder.question({
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
      node = builder.resource({
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
        width: data.width ?? undefined,
        height: data.height ?? undefined,
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

      node = builder.body({ bodyParts: bodyPartNodes });
    }

    return node;
  }

  private bodyTextToAst(bodyText: string): BodyText {
    // TODO => Will be more complicated one the body text is JSON
    return builder.bodyText({ text: bodyText });
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
      return builder.footerText({ text: footerText });
    }
    return undefined;
  }

  private gapBitToAst(bit: GapJson): Gap {
    const { item, lead, hint, instruction, isExample, example, isCaseSensitive, solutions } = bit;

    // Build bit
    const bitNode = builder.gap({
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

  private selectBitToAst(bit: SelectJson): Select {
    const { options, prefix, postfix, item, lead, hint, instruction, isExample, example } = bit;

    // Build options bits
    const selectOptionNodes = this.selectOptionBitsToAst(options);

    // Build bit
    const node = builder.select({
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

  private highlightBitToAst(bit: HighlightJson): Highlight {
    const { texts, prefix, postfix, item, lead, hint, instruction, isExample, example } = bit;

    // Build options bits
    const highlightTextNodes = this.highlightTextBitsToAst(texts);

    // Build bit
    const node = builder.highlight({
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

export { JsonParser };
