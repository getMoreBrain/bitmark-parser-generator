import { Builder } from '../../ast/Builder.ts';
import { Config } from '../../config/Config.ts';
import {
  type Bit,
  type BitmarkAst,
  type Body,
  type CardBit,
  type Footer,
} from '../../model/ast/Nodes.ts';
import { type JsonText } from '../../model/ast/TextNodes.ts';
import { BitType, type BitTypeType } from '../../model/enum/BitType.ts';
import { DeprecatedTextFormat } from '../../model/enum/DeprecatedTextFormat.ts';
import { ResourceType, type ResourceTypeType } from '../../model/enum/ResourceType.ts';
import { TextFormat, type TextFormatType } from '../../model/enum/TextFormat.ts';
import {
  type BitJson,
  type BotResponseJson,
  type ExampleJson,
  type ListItemJson,
  type ResponseJson,
  type StatementJson,
} from '../../model/json/BitJson.ts';
import { type BitWrapperJson } from '../../model/json/BitWrapperJson.ts';
import { type BodyBitsJson } from '../../model/json/BodyBitJson.ts';
import { type ImageResourceWrapperJson, type ResourceJson } from '../../model/json/ResourceJson.ts';
import { StringUtils } from '../../utils/StringUtils.ts';

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

    const ast = builder.buildBitmark(bits);

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
      } catch (_e) {
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
    const { statement, reference: referenceBit, ...bitRest } = bit;

    const isCommented = bit.type === BitType._comment && bit.originalType !== undefined;

    // Bit type
    const bitType = Config.getBitType(isCommented ? bit.originalType : bit.type);

    // Get the bit config for the bit type
    const bitConfig = Config.getBitConfig(bitType);

    // Text Format
    const deprecatedTextFormat = DeprecatedTextFormat.fromValue(bit.format);
    let _textFormat = TextFormat.fromValue(bit.format) ?? bitConfig.textFormatDefault;
    if (deprecatedTextFormat === DeprecatedTextFormat.bitmarkMinusMinus) {
      _textFormat = TextFormat.bitmarkText;
    }

    // Build bit
    const bitNode = builder.buildBit({
      ...bitRest,
      bitType,
      bitLevel: Math.max(Math.min(bit.bitLevel ?? 1, Config.bitLevelMax), Config.bitLevelMin),
      textFormat: bit.format as TextFormatType,
      resourceType: this.getResourceType(bit.resource),
      isCommented,
      internalComment: internalComments,
      ...this.processReference(referenceBit), // reference and referenceProperty
      ...this.parseExample(bit.example),
      person: bit.partner ?? bit.person,
      markConfig: bit.marks,
      resources: this.processResources(bitType, bit.resource, bit.images, bit.logos),
      body: this.processBody(bit.body as JsonText, bit.placeholders),
      flashcards: bit.cards,
      statements: this.processStatements(statement, bit.isCorrect, bit.statements, bit.example),
      responses: this.processResponses(bitType, bit.responses as ResponseJson[]),
      botResponses: this.processBotResponse(bitType, bit.responses as BotResponseJson[]),
      cardBits: this.processListItems(
        bit.listItems ?? bit.sections ?? bit.bookReferences,
        bit.placeholders,
      ),
      footer: this.processFooter(bit.footer),
    });

    return bitNode;
  }

  private processStatements(
    statement?: string,
    isCorrect?: boolean,
    statements?: Partial<StatementJson>[],
    example?: ExampleJson,
  ): Partial<StatementJson>[] | undefined {
    const nodes: Partial<StatementJson>[] = [];

    // Add statement defined in the bit
    if (statement) {
      const node: Partial<StatementJson> = {
        statement: statement ?? '',
        isCorrect: isCorrect ?? false,
        ...this.parseExample(example),
      };

      if (node) nodes.push(node);
    }

    // add standard statements
    if (Array.isArray(statements)) for (const item of statements) nodes.push(item);

    if (nodes.length === 0) return undefined;

    return nodes;
  }

  private processResponses(
    bitType: BitTypeType,
    responses?: ResponseJson[],
  ): ResponseJson[] | undefined {
    // Return early if bot response as the responses should be interpreted as bot responses
    if (Config.isOfBitType(bitType, BitType.botActionResponse)) return undefined;
    if (!Array.isArray(responses)) return undefined;

    return responses;
  }

  private processBotResponse(
    bitType: BitTypeType,
    responses?: BotResponseJson[],
  ): BotResponseJson[] | undefined {
    // Return early if NOT bot response as the responses should be interpreted as standard responses
    if (!Config.isOfBitType(bitType, BitType.botActionResponse)) return undefined;
    if (!Array.isArray(responses)) return undefined;
    return responses;
  }

  private processListItems(
    listItems: ListItemJson[],
    placeholders: BodyBitsJson,
  ): CardBit[] | undefined {
    const nodes: CardBit[] = [];

    if (Array.isArray(listItems)) {
      for (const li of listItems) {
        const node: CardBit = {
          ...li,
        } as CardBit;
        if (node.body) {
          node.body = {
            body: node.body,
            placeholders,
          };
        }
        if (node) nodes.push(node);
      }
    }

    if (nodes.length === 0) return undefined;

    return nodes;
  }

  private getResourceType(resource?: ResourceJson): ResourceTypeType | undefined {
    if (resource) {
      const resourceKey = ResourceType.fromValue(resource.type);
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

  private processBody(body: JsonText, placeholders: BodyBitsJson): Body | undefined {
    return {
      body,
      placeholders,
    };
  }

  private processFooter(footerText: JsonText): Footer | undefined {
    if (!footerText) return undefined;
    return {
      footer: footerText,
    };
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
    const exampleText =
      StringUtils.isString(example) || Array.isArray(example) ? example : undefined;
    if (exampleText) {
      return { example: exampleText };
    }
    return { example: !!example };
  }
}

export { JsonParser };
