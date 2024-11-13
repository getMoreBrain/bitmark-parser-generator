import { Builder } from '../../ast/Builder';
import { Breakscape } from '../../breakscaping/Breakscape';
import { Config } from '../../config/Config';
import { BreakscapedString } from '../../model/ast/BreakscapedString';
import { Bit, BitmarkAst, Body, BodyBit, BodyPart, CardBit, Footer } from '../../model/ast/Nodes';
import { JsonText, TextAst } from '../../model/ast/TextNodes';
import { BitType, BitTypeType } from '../../model/enum/BitType';
import { BodyBitType } from '../../model/enum/BodyBitType';
import { ResourceTag, ResourceTagType } from '../../model/enum/ResourceTag';
import { TextFormat, TextFormatType } from '../../model/enum/TextFormat';
import { BitWrapperJson } from '../../model/json/BitWrapperJson';
import { BodyBitsJson, BodyBitJson } from '../../model/json/BodyBitJson';
import { ResourceJson, ImageResourceWrapperJson } from '../../model/json/ResourceJson';
import { StringUtils } from '../../utils/StringUtils';
import { TextParser } from '../text/TextParser';

import {
  BitJson,
  ResponseJson,
  StatementJson,
  BotResponseJson,
  ExampleJson,
  ListItemJson,
} from '../../model/json/BitJson';

interface ReferenceAndReferenceProperty {
  reference?: string;
  referenceProperty?: string | string[];
}

interface Example {
  example: ExampleJson;
}

const builder = new Builder();

/**
 * A parser for parsing bitmark JSON to bitmark AST
 */
class JsonParser {
  private textParser: TextParser;

  constructor() {
    this.textParser = new TextParser();
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
      const { bit, parser } = bitWrapper;

      // Transform to AST
      const bitsNode = this.bitToAst(bit, parser?.internalComments);
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
      return Config.getBitType(b.type) !== BitType._error;
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

  private bitToAst(bit: BitJson, internalComments: string[] | undefined): Bit | undefined {
    const { statement, product, productVideo, reference: referenceBit, ...bitRest } = bit;

    const isCommented = bit.type === BitType._comment && bit.originalType !== undefined;

    // Bit type
    const bitType = Config.getBitType(isCommented ? bit.originalType : bit.type);

    // Bit level
    const bitLevelValidated = Math.max(Math.min(bit.bitLevel ?? 1, Config.bitLevelMax), Config.bitLevelMin);

    // Get the bit config for the bit type
    const bitConfig = Config.getBitConfig(bitType);

    // Text Format
    const textFormat = TextFormat.fromValue(bit.format) ?? bitConfig.textFormatDefault;

    // Resource attachement type
    const resourceAttachmentType = this.getResourceType(bit.resource);

    // resource(s)
    const resourcesNode = this.processResources(bitType, bit.resource, bit.images, bit.logos);

    // body & placeholders
    const bodyNode = this.processBody(bit.body as JsonText, textFormat, bit.placeholders);

    //+-statement
    const statementNodes = this.processStatements(statement, bit.isCorrect, bit.statements, bit.example);

    // listItems / sections (cardBits)
    const cardBitNodes = this.processListItems(bit.listItems ?? bit.sections, textFormat, bit.placeholders);

    // footer
    const footerNode = this.footerToAst(bit.footer, textFormat);

    // Convert reference to referenceProperty
    const { reference, referenceProperty } = this.processReference(referenceBit);

    // Build bit
    const bitNode = builder.bit({
      ...bitRest,
      bitType,
      bitLevel: bitLevelValidated,
      textFormat: bit.format as TextFormatType,
      resourceType: resourceAttachmentType,
      isCommented,
      internalComment: internalComments,
      referenceProperty,
      productList: product,
      productVideoList: productVideo,
      reference,
      ...this.parseExample(bit.example),
      person: bit.partner ?? bit.person,
      markConfig: bit.marks,
      resources: resourcesNode,
      body: bodyNode,
      flashcards: bit.cards,
      statements: statementNodes,
      responses: this.processResponses(bitType, bit.responses as ResponseJson[]),
      botResponses: this.processBotResponse(bitType, bit.responses as BotResponseJson[]),
      cardBits: cardBitNodes,
      footer: footerNode,
    });

    return bitNode;
  }

  private processStatements(
    statement?: string,
    isCorrect?: boolean,
    statements?: StatementJson[],
    example?: ExampleJson,
  ): StatementJson[] | undefined {
    const nodes: StatementJson[] = [];

    // Add statement defined in the bit
    if (statement) {
      const node = builder.statement({
        statement: statement ?? '',
        isCorrect: isCorrect ?? false,
        ...this.parseExample(example),
      });
      if (node) nodes.push(node);
    }

    // add standard statements
    if (Array.isArray(statements)) for (const item of statements) nodes.push(item);

    if (nodes.length === 0) return undefined;

    return nodes;
  }

  private processResponses(bitType: BitTypeType, responses?: ResponseJson[]): ResponseJson[] | undefined {
    // Return early if bot response as the responses should be interpreted as bot responses
    if (Config.isOfBitType(bitType, BitType.botActionResponse)) return undefined;
    if (!Array.isArray(responses)) return undefined;

    return responses;
  }

  private processBotResponse(bitType: BitTypeType, responses?: BotResponseJson[]): BotResponseJson[] | undefined {
    // Return early if NOT bot response as the responses should be interpreted as standard responses
    if (!Config.isOfBitType(bitType, BitType.botActionResponse)) return undefined;
    if (!Array.isArray(responses)) return undefined;
    return responses;
  }

  private processListItems(
    listItems: ListItemJson[],
    textFormat: TextFormatType,
    placeholders: BodyBitsJson,
  ): CardBit[] | undefined {
    const nodes: CardBit[] = [];

    if (Array.isArray(listItems)) {
      for (const li of listItems) {
        const { item, lead, hint, instruction, body } = li;
        const node = builder.cardBit({
          item: this.convertJsonTextToAstText(item),
          lead: this.convertJsonTextToAstText(lead),
          pageNumber: [] as TextAst,
          marginNumber: [] as TextAst,
          hint: this.convertJsonTextToAstText(hint),
          instruction: this.convertJsonTextToAstText(instruction),
          body: this.processBody(body, textFormat, placeholders),
        });
        if (node) nodes.push(node);
      }
    }

    if (nodes.length === 0) return undefined;

    return nodes;
  }

  private getResourceType(resource?: ResourceJson): ResourceTagType | undefined {
    if (resource) {
      const resourceKey = ResourceTag.fromValue(resource.type);
      return resourceKey;
    }

    return undefined;
  }

  private processResources(
    bitType: BitTypeType,
    resource: ResourceJson | undefined,
    images: ImageResourceWrapperJson[] | undefined,
    logos: ImageResourceWrapperJson[] | undefined,
  ): ResourceJson[] | undefined {
    const nodes: ResourceJson[] | undefined = [];

    if (resource) nodes.push(resource);

    if (Config.isOfBitType(bitType, [BitType.prototypeImages])) {
      // Add the logo images
      if (Array.isArray(images)) {
        for (const image of images) {
          if (image) nodes.push(image);
        }
      }
    }

    if (Config.isOfBitType(bitType, [BitType.imagesLogoGrave])) {
      // Add the logo images
      if (Array.isArray(logos)) {
        for (const image of logos) {
          if (image) nodes.push(image);
        }
      }
    }

    return nodes;
  }

  /** TODO
   *
   * - Convert the string like body into AST body,
   * - re-build all the body bits to validate them.
   * // TODO: This must still handle the placeholders for v2
   *
   */
  private processBody(body: JsonText, textFormat: TextFormatType, placeholders: BodyBitsJson): Body | undefined {
    let node: Body | undefined;
    let bodyStr: BreakscapedString | undefined;
    const placeholderNodes: {
      [keyof: string]: BodyBit;
    } = {};

    if (textFormat === TextFormat.json) {
      // If the text format is JSON, handle appropriately
      let bodyObject: unknown = body;

      // Attempt to parse a string body as JSON to support the legacy format
      if (typeof bodyObject === 'string') {
        try {
          bodyObject = JSON.parse(bodyObject);
        } catch (e) {
          // Could not parse JSON - set body to null
          bodyObject = null;
        }
      }
      node = builder.body({ bodyJson: bodyObject });
    } else {
      // return { body } as Body;

      if (Array.isArray(body)) {
        // Body is an array (prosemirror like JSON)
        return { body } as Body;
      } else {
        // Body is a string (legacy bitmark v2, or not bitmark--/++)
        bodyStr = body as BreakscapedString; // TODO!! this.convertJsonTextToBreakscapedString(body, textFormat);
      }

      // Placeholders
      if (placeholders) {
        for (const [key, val] of Object.entries(placeholders)) {
          const bit = this.bodyBitToAst(val);
          placeholderNodes[key] = bit as BodyBit;
        }
      }

      if (bodyStr) {
        // Split the body string and insert the placeholders
        const bodyPartNodes: BodyPart[] = [];
        const bodyParts: BreakscapedString[] = StringUtils.splitPlaceholders(
          bodyStr,
          Object.keys(placeholderNodes),
        ) as BreakscapedString[];

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

        // node = builder.body({ bodyParts: bodyPartNodes });
        node = builder.body({ body: bodyStr });
      }
    }
    return node;
  }

  private bodyTextToAst(_bodyText: BreakscapedString): BodyPart {
    return null as unknown as BodyPart; // TODO builder.bodyText({ text: bodyText ?? '' }, false);
  }

  private bodyBitToAst(bit: BodyBitJson): BodyPart {
    switch (bit.type) {
      case BodyBitType.gap:
      case BodyBitType.mark:
      case BodyBitType.select:
      case BodyBitType.highlight:
        return bit;
        break;
      default:
      // Do nothing
    }
    return this.bodyTextToAst('' as BreakscapedString);
  }

  private footerToAst(footerText: JsonText, _textFormat: TextFormatType): Footer | undefined {
    if (!footerText) return undefined;
    return {
      footer: footerText,
    };
    // const text = this.convertJsonTextToAstText(footerText, textFormat);

    // if (text) {
    //   const footerText = builder.footerText({ text }, false);
    //   return builder.footer({ footerParts: [footerText] });
    // }
    // return undefined;
  }

  private processReference(reference: string | string[]): ReferenceAndReferenceProperty {
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

  private parseExample(example: ExampleJson | undefined): Example | undefined {
    if (example == null) return undefined;
    if (example === true) return { example: true };
    if (example === false) return { example: false };
    const exampleText = StringUtils.isString(example) || Array.isArray(example) ? example : undefined;
    if (exampleText) {
      return { example: exampleText };
    }
    return { example: !!example };
  }

  /**
   * Convert the JsonText from the JSON to the AST format:
   * Input:
   *  - Bitmark v2: breakscaped string
   *  - Bitmark v3: bitmark text JSON (TextAst)
   * Output:
   *  - breakscaped string
   *
   * In the case of Bitmark v2 type texts, there is nothing to do but cast the type.
   *
   * @param breakscaped string or TextAst or breakscaped string[] or TextAst[]
   * @param textFormat format of TextAst
   * @returns Breakscaped string or breakscaped string[]
   */
  private convertJsonTextToAstText<
    T extends JsonText | JsonText[] | undefined,
    R = T extends JsonText[] ? TextAst[] : TextAst,
  >(text: T, textFormat?: TextFormatType): R {
    // NOTE: it is ok to default to bitmarkMinusMinus here as if the text is text then it will not be an array or
    // return true from isAst() and so will be treated as a string
    textFormat = textFormat ?? TextFormat.bitmarkMinusMinus;

    const bitTagOnly = (textFormat !== TextFormat.bitmarkPlusPlus &&
      textFormat !== TextFormat.bitmarkMinusMinus) as boolean;

    if (text == null) return [] as R;
    if (this.textParser.isAst(text)) {
      // Use the text generator to convert the TextAst to breakscaped string
      // this.ast.printTree(text, NodeType.textAst);

      return text as R;
    } else if (Array.isArray(text)) {
      const strArray: TextAst[] = [];
      for (let i = 0, len = text.length; i < len; i++) {
        const t = text[i];

        if (this.textParser.isAst(t)) {
          // Use the text generator to convert the TextAst to breakscaped string
          // this.ast.printTree(text, NodeType.textAst);
          strArray[i] = t as TextAst;
        } else {
          strArray[i] = this.textParser.toAst(
            Breakscape.breakscape(t as string, {
              bitTagOnly,
            }),
          );
          // strArray[i] = t as BreakscapedString;
        }
      }
      return strArray as R;
    }

    return this.textParser.toAst(
      Breakscape.breakscape(text as string, {
        bitTagOnly,
      }),
    ) as R;
  }
}

export { JsonParser };
