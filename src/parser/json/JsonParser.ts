import { Ast } from '../../ast/Ast';
import { Builder } from '../../ast/Builder';
import { ResourceBuilder } from '../../ast/ResourceBuilder';
import { TextStringGenerator } from '../../generator/text/TextStringGenerator';
import { Text, TextAst } from '../../model/ast/TextNodes';
import { BitType, BitTypeType } from '../../model/enum/BitType';
import { BodyBitType } from '../../model/enum/BodyBitType';
import { ResourceType, ResourceTypeType } from '../../model/enum/ResourceType';
import { TextFormat, TextFormatType } from '../../model/enum/TextFormat';
import { BitWrapperJson } from '../../model/json/BitWrapperJson';
import { ResourceJson, ResourceDataJson, StillImageFilmResourceJson } from '../../model/json/ResourceJson';
import { StringUtils } from '../../utils/StringUtils';

import {
  AudioResource,
  Bit,
  BitmarkAst,
  Body,
  BodyPart,
  BodyString,
  BotResponse,
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
  QuizJson,
  ResponseJson,
  StatementJson,
  PartnerJson,
  BotResponseJson,
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
import { NodeType } from '../../model/ast/NodeType';

interface ReferenceAndReferenceProperty {
  reference?: string;
  referenceProperty?: string | string[];
}

// const BODY_SPLIT_REGEX = new RegExp('{[0-9]+}', 'g');

const builder = new Builder();
const resourceBuilder = new ResourceBuilder();

/**
 * A parser for parsing bitmark JSON to bitmark AST
 */
class JsonParser {
  private textGenerator: TextStringGenerator;

  constructor() {
    this.textGenerator = new TextStringGenerator();
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
      padletId,
      releaseVersion,
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
      quotedPerson,
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
      isExample,
      example,
      partner,
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

    // Bit type
    const bitType = BitType.fromValue(type) ?? BitType._error;

    // Format
    const textFormat = TextFormat.fromValue(format) ?? TextFormat.bitmarkMinusMinus;

    // resource
    const resourceNode = this.resourceBitToAst(resource);

    // body & placeholders
    const bodyNode = this.bodyToAst(body, placeholders, textFormat);

    const partnerNode = this.partnerBitToAst(partner);

    //+-statement
    const statementNodes = this.statementBitsToAst(statement, isCorrect, statements);

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

    // footer
    const footerNode = this.footerToAst(footer, textFormat);

    // Convert reference to referenceProperty
    const { reference, referenceProperty } = this.referenceToAst(referenceIn);

    // Build bit
    const bitNode = builder.bit({
      bitType: type as BitTypeType,
      textFormat: format as TextFormatType | undefined,
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
      date,
      location,
      theme,
      kind,
      action,
      duration,
      referenceProperty,
      thumbImage,
      focusX,
      focusY,
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
      partner: partnerNode,
      resource: resourceNode,
      body: bodyNode,
      sampleSolution: sampleSolution,
      elements,
      statements: statementNodes,
      responses: responseNodes,
      quizzes: quizNodes,
      heading: headingNode,
      pairs: pairsNodes,
      matrix: matrixNodes,
      choices: choiceNodes,
      questions: questionNodes,
      botResponses: botResponseNodes,
      footer: footerNode,
    });

    return bitNode;
  }

  private partnerBitToAst(partner?: PartnerJson): Partner | undefined {
    let node: Partner | undefined;

    if (partner) {
      const avatarImage = this.resourceDataToAst(ResourceType.image, partner.avatarImage) as ImageResource | undefined;
      node = builder.partner({ name: partner.name, avatarImage });
    }

    return node;
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

  private responseBitsToAst(bitType: BitTypeType, responses?: ResponseJson[]): Response[] | undefined {
    const nodes: Response[] = [];

    // Return early if bot response as the responses should be interpreted as bot responses
    if (bitType === BitType.botActionResponse) return undefined;

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

  private quizBitsToAst(bitType: BitTypeType, quizzes?: QuizJson[]): Quiz[] | undefined {
    const nodes: Quiz[] = [];
    if (Array.isArray(quizzes)) {
      for (const q of quizzes) {
        const { item, lead, hint, instruction, isExample, example, choices, responses } = q;
        const choiceNodes = this.choiceBitsToAst(choices);
        const responseNodes = this.responseBitsToAst(bitType, responses);
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
          isShortAnswer: !isLongAnswer,
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
          isShortAnswer: !isLongAnswer,
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

  private botResponseBitsToAst(bitType: BitTypeType, responses?: BotResponseJson[]): BotResponse[] | undefined {
    const nodes: BotResponse[] = [];

    // Return early if not bot response as the responses should be interpreted as standard responses
    if (bitType !== BitType.botActionResponse) return undefined;

    if (Array.isArray(responses)) {
      for (const r of responses) {
        const { response, reaction, feedback, item, lead, hint } = r;
        const node = builder.botResponse({
          response,
          reaction,
          feedback,
          item,
          lead,
          hint,
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
      const resourceKey = ResourceType.keyFromValue(resource.type) ?? ResourceType.unknown;
      let data: ResourceDataJson | undefined;

      // Special case for 'still-image-film'
      if (resource.type === ResourceType.stillImageFilm) {
        const r = resource as unknown as StillImageFilmResourceJson;
        const imageNode = this.resourceDataToAst(ResourceType.image, r.image) as ImageResource;
        const audioNode = this.resourceDataToAst(ResourceType.audio, r.audio) as AudioResource;
        node = resourceBuilder.stillImageFilmResource({
          image: imageNode,
          audio: audioNode,
        });
      } else {
        // Standard single resource case

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data = (resource as any)[resourceKey];

        if (!data) return undefined;

        node = this.resourceDataToAst(resource.type, data);
      }
    }

    return node;
  }

  private resourceDataToAst(type: ResourceTypeType, data?: Partial<ResourceDataJson>): Resource | undefined {
    let node: Resource | undefined;

    if (data) {
      if (!data) return undefined;

      const dataAsString: string | undefined = StringUtils.isString(data) ? (data as string) : undefined;

      // url / src / href / app
      const url = data.url || data.src || data.href || data.app || data.body || dataAsString;

      // Sub resources
      const posterImage = this.resourceDataToAst(ResourceType.image, data.posterImage) as ImageResource;
      const thumbnails = data.thumbnails
        ? data.thumbnails.map((t) => {
            return this.resourceDataToAst(ResourceType.image, t) as ImageResource;
          })
        : undefined;

      // Resource
      node = resourceBuilder.resource({
        type,

        // Generic (except Article / Document)
        value: url,

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

        // Generic Resource
        license: data.license,
        copyright: data.copyright,
        showInIndex: data.showInIndex,
      });
    }

    return node;
  }

  private bodyToAst(body: Text, placeholders: BodyBitsJson, format: TextFormatType): Body | undefined {
    let node: Body | undefined;

    const placeholderNodes: {
      [keyof: string]: BodyPart;
    } = {};

    // Placeholders
    if (placeholders) {
      for (const [key, val] of Object.entries(placeholders)) {
        const bit = this.bodyBitToAst(val, format);
        placeholderNodes[key] = bit;
      }
    }

    // Body (with insterted placeholders)
    if (body) {
      // TODO - this split will need escaping, but actually we shouldn't need it anyway once bitmark JSON is actually
      // all JSON
      // TODO - will need to convert text JSON back to text and then split in order to be able to build the
      // body correctly in AST

      if (Array.isArray(body)) {
        // body is JSON, so convert to text
        const ast = new Ast();
        ast.printTree(body, NodeType.body);
        this.textGenerator.generate(body);
      }

      const bodyPartNodes: BodyPart[] = [];
      const bodyParts: string[] = StringUtils.splitPlaceholders(body, Object.keys(placeholderNodes));

      for (let i = 0, len = bodyParts.length; i < len; i++) {
        const bodyPart = bodyParts[i];

        if (placeholderNodes[bodyPart]) {
          // Replace the placeholder
          bodyPartNodes.push(placeholderNodes[bodyPart]);
        } else {
          // Treat as text
          const bodyText = this.bodyTextToAst(bodyPart, format);
          bodyPartNodes.push(bodyText);
        }
      }

      node = builder.body({ bodyParts: bodyPartNodes }, format);
    }

    return node;
  }

  private bodyTextToAst(bodyText: string, format: TextFormatType): BodyString {
    // TODO => Will be more complicated one the body text is JSON
    return builder.bodyText({ text: bodyText }, format);
  }

  private bodyBitToAst(bit: BodyBitJson, format: TextFormatType): BodyPart {
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
    return this.bodyTextToAst('', format);
  }

  private footerToAst(footerText: Text, format: TextFormatType): FooterText | undefined {
    // TODO => Will be more complicated one the body text is JSON
    if (StringUtils.isString(footerText)) {
      return builder.footerText({ text: footerText }, format);
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
