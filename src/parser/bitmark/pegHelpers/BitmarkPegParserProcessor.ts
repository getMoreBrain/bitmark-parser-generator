/**
 * BitmarkPegParserProcessor.ts
 * v0.0.1
 * RA Sewell
 *
 * (c) 2023 Get More Brain AG
 * All rights reserved.
 *
 * About the parser:
 * -----------------
 *
 * 1. The peggy.js PEG parser is used to parse bitmark markup into a simple AST.
 * 2. The AST can then be walked to generate any output format required.
 *    - The default output format is JSON.
 *    - The output could also be bitmark, therefore providing a way to prettify / standardise bitmark markup.
 * 3. The parser should not generate a fatal error under any circumstances, because all text is valid bitmark markup.
 *    - The only fatal error for a bit is if the bit header tag (e.g. [.cloze:bitmark--]) cannot be parsed. In this
 *      case the bit will be ignored and an error will be added at the AST top level. Parsing will continue.
 *    - If the parser encounters suspect bitmark it will generate 'warnings' which it will attach to the AST bit level
 * 4. The parser should be as fast as possible, without being overly complicated.
 *
 * Theory of operation:
 * --------------------
 *
 * The parser splits the parse into multiple parses. This makes the parser much easier to write and understand than
 * attempting to parse the entire markup in one pass.
 *
 * It also improves the performance in some cases, because although it means multiple passes over the same data, the
 * comparisions made at each pass are fewer and simpler.
 *
 * The parser has the following parse entry points:
 * - bitmark (external code should use this entry point)
 * - bit
 * - cardContent
 *
 * bitmark:
 *
 * This is the top level entry point for parsing a bitmark. It splits a set of bitmark bits into individual bits, and
 * passes each individual bit to the 'bit' entry point for parsing.
 *
 * bit:
 *
 * This is the top level single-bit parser. It parses the bit header, the top level tags, the body, the inline tags,
 * the card set, and the footer. The content of the card set is not parsed.
 *
 * cardContent:
 *
 * This entry point takes in the text content of each card leaf parsed out by the 'bit' parser and parses the
 * inline bits (true/false, sampleSolution, item, lead, etc tags) to produce the card set specific output for the
 * specific bit type being parsed.
 *
 * Each rule of the parser outputs one or more objects containing a 'type', 'value' and optional 'key' property.
 * The 'type' describes to this helper code what the parsed 'value' represents. If the value is not a single value,
 * but a key/value pair then 'key' will also be set.
 *
 *
 * Debugging and Development
 * -------------------------
 *
 * - To build the parser, run 'yarn build-grammar-bit'
 * - Modify the bitmark in '_simple.bit' to test the parser (this will be parsed after building the parser)
 * - To undersand the operation and to help debug and develop, use the DEBUG_XXX flags in the code below.
 *   and in BitmarkPegParserProcessor.ts
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Builder } from '../../../ast/Builder';
import { Bit, BitmarkAst, BodyPart, BodyText } from '../../../model/ast/Nodes';
import { BitType, BitTypeType } from '../../../model/enum/BitType';
import { ResourceType } from '../../../model/enum/ResourceType';
import { TextFormat } from '../../../model/enum/TextFormat';
import { ParserError } from '../../../model/parser/ParserError';
import { ParserInfo } from '../../../model/parser/ParserInfo';

import { buildCards } from './contentProcessors/CardContentProcessor';
import { clozeTagContentProcessor } from './contentProcessors/ClozeTagContentProcessor';
import { defaultTagContentProcessor } from './contentProcessors/DefaultTagContentProcessor';
import { gapChainContentProcessor } from './contentProcessors/GapChainContentProcessor';
import { itemLeadTagContentProcessor } from './contentProcessors/ItemLeadTagContentProcessor';
import { propertyContentProcessor } from './contentProcessors/PropertyContentProcessor';
import { buildResource, resourceContentProcessor } from './contentProcessors/ResourceContentProcessor';
import { titleTagContentProcessor } from './contentProcessors/TitleTagContentProcessor';
import { trueFalseChainContentProcessor } from './contentProcessors/TrueFalseChainContentProcessor';
import { trueFalseTagContentProcessor } from './contentProcessors/TrueFalseTagContentProcessor';

import {
  BitContent,
  BitContentLevel,
  BitContentLevelType,
  BitHeader,
  BitSpecificTitles,
  ParseFunction,
  ParserHelperOptions,
  SubParserResult,
  TypeKey,
  BitContentProcessorResult,
  TypeKeyType,
  TypeKeyValue,
  TypeValue,
  BitmarkPegParserContext,
} from './BitmarkPegParserTypes';

// Debugging flags for helping develop and debug the parser
const ENABLE_DEBUG = true;
const DEBUG_DATA = true; // Include data in the debug output
const DEBUG_DATA_INCLUDE_PARSER = false; // Include the parser data in the debug output - very very verbose!
const DEBUG_BIT_RAW = true; // Print the raw bitmark
const DEBUG_BIT_CONTENT_RAW = false; // Print the top level parsed bit content (without chars merged to strings - will create a lot of output)
const DEBUG_BIT_CONTENT = true; // Print the top level parsed bit content (with BodyChar / CardChar merged)
const DEBUG_BIT_TAGS = true; // Print the tags extracted from the bit parsed content
const DEBUG_BODY = true; // Print the final parsed body
const DEBUG_FOOTER = true; // Print the final parsed footer
const DEBUG_GAP_CONTENT = true; // Print the parsed gap content
const DEBUG_GAP_TAGS = true; // Print the tags extracted from the parsed gap content
const DEBUG_SELECT_CONTENT = true; // Print the parsed select content (true/false v2)
const DEBUG_SELECT_TAGS = true; // Print the tags extracted from the parsed select content (true/false v2)
const DEBUG_HIGHLIGHT_CONTENT = true; // Print the parsed select content (highlight text)
const DEBUG_HIGHLIGHT_TAGS = true; // Print the tags extracted from the parsed select content (highlight text)
const DEBUG_TRUE_FALSE_V1_CONTENT = true; // Print the parsed true/false (v1) content
const DEBUG_TRUE_FALSE_V1_TAGS = true; // Print the tags extracted from the parsed true/false (v1) content
const DEBUG_CHOICE_RESPONSE_V1_CONTENT = true; // Print the parsed choices/responses content
const DEBUG_CHOICE_RESPONSE_V1_TAGS = true; // Print the tags extracted from the parsed choices/responses content
const DEBUG_CARD_SET_CONTENT = true; // Print the parsed card set content
const DEBUG_CARD_SET = true; // Print the card set built from the parsed card set content
const DEBUG_CARD_PARSED = true; // Print the parsed card (will create a lot of output if card value is large)
const DEBUG_CARD_TAGS = true; // Print the tags extracted from the card content

// DO NOT EDIT THIS LINE. Ensures no debug in production in case ENABLE_DEBUG is accidentally left on
const DEBUG = ENABLE_DEBUG && process.env.NODE_ENV === 'development';

const builder = new Builder();

class BitmarkPegParserProcessor {
  private context: BitmarkPegParserContext;
  private nonFatalErrors: ParserError[] = [];
  private parser: ParserInfo = {};

  private parse: ParseFunction;
  private parserText: () => ParserError['text'];
  private parserLocation: () => ParserError['location'];

  constructor(options: ParserHelperOptions) {
    this.parse = options.parse;
    this.parserText = options.parserText;
    this.parserLocation = options.parserLocation;

    // The context is used to pass the parser data and functions to the content builders
    this.context = {
      DEBUG_BIT_RAW,
      DEBUG_BIT_CONTENT_RAW,
      DEBUG_BIT_CONTENT,
      DEBUG_BIT_TAGS,
      DEBUG_BODY,
      DEBUG_FOOTER,
      DEBUG_GAP_CONTENT,
      DEBUG_GAP_TAGS,
      DEBUG_SELECT_CONTENT,
      DEBUG_SELECT_TAGS,
      DEBUG_HIGHLIGHT_CONTENT,
      DEBUG_HIGHLIGHT_TAGS,
      DEBUG_TRUE_FALSE_V1_CONTENT,
      DEBUG_TRUE_FALSE_V1_TAGS,
      DEBUG_CHOICE_RESPONSE_V1_CONTENT,
      DEBUG_CHOICE_RESPONSE_V1_TAGS,
      DEBUG_CARD_SET_CONTENT,
      DEBUG_CARD_SET,
      DEBUG_CARD_PARSED,
      DEBUG_CARD_TAGS,

      parser: this.parser,

      parse: this.parse,
      bitContentProcessor: this.bitContentProcessor.bind(this),
      splitBitContent: this.splitBitContent.bind(this),
      addError: this.addError.bind(this),
      debugPrint: this.debugPrint.bind(this),
    };
  }

  // Build bits
  buildBits(bitStrs: string[]): BitmarkAst {
    const bits: Bit[] = [];
    let errors: ParserError[] = [];

    for (const bitStr of bitStrs) {
      // Trim the bit string to remove any leading or trailing whitespace
      // Actually, let's do this in the parser otherwise we'll lose correct error locations
      // bitStr = bitStr.trim();

      if (DEBUG_BIT_RAW) this.debugPrint('RAW BIT', bitStr.trim());

      // Parse the raw bit
      const bitParserResult = this.parse(bitStr ?? '', {
        startRule: 'bit',
      }) as SubParserResult<Bit>;

      const bit = bitParserResult.value;
      if (bit) {
        // Add markup to the bit
        bit.bitmark = bitStr.trim();

        // Add the bit to the list of bits
        bits.push(bit);
      } else {
        // TODO - convert error location to master parser location

        // If bit is undefined, then there was an error parsing the bit
        errors = errors.concat(bitParserResult.errors ?? []);
      }
    }

    const res = builder.bitmark({
      // bits: bits.filter((bit) => !!bit) as Bit[],
      bits,
      errors: errors.length > 0 ? errors : undefined,
    });

    return res;
  }

  // Build bit
  buildBit(bitHeader: BitHeader, bitContent: BitContent[]): SubParserResult<Bit> {
    const { bitType, textFormat, resourceType } = bitHeader;

    // Bit type was invalid, so ignore the bit, returning instead the parsing errors
    if (!bitType) return this.invalidBit();

    if (DEBUG_BIT_CONTENT_RAW) this.debugPrint('BIT CONTENT RAW', bitContent);

    const isTrueFalseV1 = bitType === BitType.trueFalse1;
    const isMultipleChoiceV1 = bitType === BitType.multipleChoice1;
    const isMultipleResponseV1 = bitType === BitType.multipleResponse1;

    // Merge the BodyChar to BodyText
    // bitContent = this.mergeCharToText(bitContent);

    if (DEBUG_BIT_CONTENT) this.debugPrint('BIT CONTENT', bitContent);

    // Parse the bit content into a an object with the appropriate keys
    const {
      // body: unparsedBody,
      // footer: unparsedFooter,
      body,
      footer,
      cardSet,
      title,
      statement,
      statements,
      choices,
      responses,
      resources,
      ...tags
    } = this.bitContentProcessor(BitContentLevel.Bit, bitType, bitContent, [
      TypeKey.Title,
      TypeKey.Anchor,
      TypeKey.Reference,
      TypeKey.Property,
      TypeKey.ItemLead,
      TypeKey.Instruction,
      TypeKey.Hint,
      TypeKey.GapChain,
      TypeKey.TrueFalseChain,
      TypeKey.Resource,
      TypeKey.BodyText,
      TypeKey.CardSet,
    ]);

    if (DEBUG_BIT_TAGS) this.debugPrint('BIT TAGS', tags);
    if (DEBUG_BODY) this.debugPrint('BIT BODY', body);
    if (DEBUG_FOOTER) this.debugPrint('BIT FOOTER', footer);

    // if (DEBUG_BODY_UNPARSED) this.debugPrint('unparsedBody', unparsedBody);
    // if (DEBUG_FOOTER_UNPARSED) this.debugPrint('unparsedFooter', unparsedBody);

    // Parse the body
    // const parsedBody = this.parse(unparsedBody ?? '', {
    //   startRule: 'body',
    // });

    // if (DEBUG_BODY_PARSED) this.debugPrint('parsedBody', parsedBody);

    // Build the titles for the specific bit type
    const titles = this.buildTitles(bitType, title ?? []);

    // Build the card data for the specific bit type
    const bitSpecificCards = buildCards(this.context, bitType, cardSet, statement, statements, choices, responses);

    // // Build the body (parts and placeholders)
    // const body = this.buildBody(bitType, parsedBody);

    // // Build the footer
    // const footer = this.buildFooter(bitType, unparsedFooter);

    // Build the resources
    const resource = buildResource(this.context, bitType, resourceType, resources);

    // Build the errors
    const errors = this.buildErrors();
    this.parser.errors = errors;

    // Build the final bit
    const bit = builder.bit({
      bitType,
      textFormat,
      resourceType,
      ...titles,
      statement: isTrueFalseV1 ? statement : undefined,
      choices: isMultipleChoiceV1 ? choices : undefined,
      responses: isMultipleResponseV1 ? responses : undefined,
      ...tags,
      resource,
      ...bitSpecificCards,
      body,
      footer,
      parser: this.parser,
    });

    // (bit as any).bitSpecificCards = bitSpecificCards;
    // (bit as any).cardSet = cardSet;

    return { value: bit };
  }

  // Build bit for data that cannot be parsed
  invalidBit(_bit?: unknown): SubParserResult<Bit> {
    // Create the error
    this.addError('Invalid bit');

    return {
      errors: this.nonFatalErrors,
    };
  }

  // Build bit header
  buildBitHeader(bitType: string, textFormatAndResourceType: Partial<BitHeader>): BitHeader {
    // Get / check bit type
    const validBitType = BitType.fromValue(bitType);
    if (!validBitType) {
      this.addError(`Invalid bit type: ${bitType}`);
    }

    return {
      bitType: validBitType,
      ...textFormatAndResourceType,
    };
  }

  // Build text and resource type
  buildTextAndResourceType(value1: TypeValue | undefined, value2: TypeValue | undefined): Partial<BitHeader> {
    const res: Partial<BitHeader> = { textFormat: TextFormat.bitmarkMinusMinus };
    const processValue = (value: TypeValue | undefined) => {
      if (value) {
        if (value.type === TypeKey.TextFormat) {
          // Parse text format, adding default if not set / invalid
          res.textFormat = TextFormat.fromValue(value.value);
          if (value.value && !res.textFormat) {
            this.addError(`Invalid text format '${value.value}', defaulting to '${TextFormat.bitmarkMinusMinus}'`);
          }
          res.textFormat = res.textFormat ?? TextFormat.bitmarkMinusMinus;
        } else {
          // Parse resource type, adding error if invalid
          res.resourceType = ResourceType.fromValue(value.value);
          if (value.value && !res.resourceType) {
            this.addError(`Invalid resource type '${value.value}'`);
          }
        }
      }
    };
    processValue(value1);
    processValue(value2);

    return res;
  }

  buildTitles(bitType: BitTypeType, title: string[]): BitSpecificTitles {
    switch (bitType) {
      case BitType.chapter: {
        let t: string | undefined;
        if (title.length > 0) t = title[title.length - 1];

        return {
          title: t,
          level: title.length > 0 ? title.length - 1 : undefined,
        };
      }

      case BitType.book:
      default: {
        return {
          title: title[1] ?? undefined,
          subtitle: title[2] ?? undefined,
        };
      }
    }
  }

  /**
   * Process Type/Key/Value data, building the bit parts as AST nodes.
   *
   * @param bitType
   * @param data
   * @param validTypes
   * @returns
   */
  bitContentProcessor(
    bitLevel: BitContentLevelType,
    bitType: BitTypeType,
    data: BitContent[],
    validTypes: TypeKeyType[],
  ): BitContentProcessorResult {
    const result: BitContentProcessorResult = {};
    result.title = [];
    result.solutions = [];
    result.statements = [];
    result.choices = [];
    result.responses = [];
    result.resources = [];
    result.trueFalse = [];
    result.extraProperties = {};

    let seenItem = false;
    let inFooter = false;
    const bodyParts: BodyPart[] = [];
    let bodyPart = '';
    let footer = '';
    let cardBody = '';

    // Helper for building the body text
    const addBodyText = () => {
      if (bodyPart) {
        if (bodyPart) {
          const bodyText = builder.bodyText({
            text: bodyPart,
          });
          bodyParts.push(bodyText);
        }
        bodyPart = '';
      }
    };

    // Reduce the Type/Key/Value data to a single object that can be used to build the bit
    data.forEach((content, _index) => {
      const { type, value } = content as TypeKeyValue;

      // Only parse requested types
      if (validTypes.indexOf(type as TypeKeyType) === -1) return;

      switch (type) {
        case TypeKey.ItemLead: {
          itemLeadTagContentProcessor(this.context, bitLevel, bitType, content, result, seenItem);
          seenItem = true;
          break;
        }

        case TypeKey.Instruction:
        case TypeKey.Hint:
        case TypeKey.Anchor:
        case TypeKey.Reference:
        case TypeKey.SampleSolution:
          defaultTagContentProcessor(this.context, bitLevel, bitType, content, result);
          break;

        case TypeKey.Title:
          titleTagContentProcessor(this.context, bitLevel, bitType, content, result);
          break;

        case TypeKey.Property:
          propertyContentProcessor(this.context, bitLevel, bitType, content, result);
          break;

        case TypeKey.Cloze: {
          clozeTagContentProcessor(this.context, bitLevel, bitType, content, result);
          break;
        }

        case TypeKey.True:
        case TypeKey.False: {
          trueFalseTagContentProcessor(this.context, bitLevel, bitType, content, result);
          break;
        }

        case TypeKey.Resource:
          resourceContentProcessor(this.context, bitLevel, bitType, content, result);
          break;

        case TypeKey.GapChain:
          addBodyText();
          gapChainContentProcessor(this.context, bitLevel, bitType, content, result, bodyParts);
          break;

        case TypeKey.TrueFalseChain:
          addBodyText();
          trueFalseChainContentProcessor(this.context, bitLevel, bitType, content, result, bodyParts);
          break;

        case TypeKey.CardSet: {
          result.cardSet = value as TypeValue[];
          inFooter = true; // After the card set, body lines should be written to the footer rather than the body
          break;
        }

        case TypeKey.BodyText: {
          if (inFooter) {
            footer += value;
          } else {
            bodyPart += value;
          }
          break;
        }

        case TypeKey.CardText: {
          cardBody += value;
          break;
        }

        default:
        // Unknown tag
      }
    });

    // Add the last body text part, and trim the body text parts
    addBodyText();

    // Build the body and footer, trimming both
    result.body = bodyParts.length > 0 ? builder.body({ bodyParts: this.trimBodyParts(bodyParts) }) : undefined;
    footer = footer.trim();
    result.footer = footer ? builder.footerText({ text: footer }) : undefined;

    // Add card body
    cardBody = cardBody.trim();
    if (cardBody) result.cardBody = cardBody;

    // Remove the extra properties if there are none
    if (Object.keys(result.extraProperties).length === 0) delete result.extraProperties;

    // Remove the unwanted empty arrays.
    if (result.title.length === 0) delete result.title;
    if (result.solutions.length === 0) delete result.solutions;
    if (result.statements.length === 0) delete result.statements;
    if (result.choices.length === 0) delete result.choices;
    if (result.responses.length === 0) delete result.responses;
    if (result.trueFalse.length === 0) delete result.trueFalse;
    if (result.resources.length === 0) delete result.resources;

    return result;
  }

  private buildErrors(): ParserError[] | undefined {
    let errors: ParserError[] | undefined;
    if (this.nonFatalErrors.length > 0) {
      errors = this.nonFatalErrors;
      this.nonFatalErrors = [];
    }
    return errors;
  }

  /**
   * Split bit content into parts based on the given type keys
   *
   * @param bitContent bit content to split
   * @param types to split on
   */
  private splitBitContent(bitContent: BitContent[], types: TypeKeyType[]): BitContent[][] {
    const parts: BitContent[][] = [];
    let part: BitContent[] = [];

    for (const c of bitContent) {
      if (types.includes(c.type as TypeKeyType)) {
        if (part.length > 0) parts.push(part);
        part = [];
      }
      part.push(c);
    }

    if (part.length > 0) parts.push(part);

    return parts;
  }

  //
  // Util functions
  //

  /**
   * Trim the body parts, removing any whitespace only parts at start and end of body
   *
   * @param bodyParts the body parts to trim
   * @returns the trimmed body parts
   */
  private trimBodyParts(bodyParts: BodyPart[]): BodyPart[] {
    // Trim start
    let foundBodyText = false;
    let trimmedBodyParts: BodyPart[] = bodyParts.reduce((acc, bodyPart) => {
      const bodyText = bodyPart as BodyText;
      if (!foundBodyText && bodyText.bodyText != undefined) {
        const t = bodyText.bodyText.trimStart();
        if (t) {
          foundBodyText = true;
          acc.push({ bodyText: t });
        }
      } else {
        // Not body text, so add it
        foundBodyText = true;
        acc.push(bodyPart);
      }
      return acc;
    }, [] as BodyPart[]);

    // Trim end
    foundBodyText = false;
    trimmedBodyParts = trimmedBodyParts.reduceRight((acc, bodyPart) => {
      const bodyText = bodyPart as BodyText;
      if (!foundBodyText && bodyText.bodyText != undefined) {
        const t = bodyText.bodyText.trimEnd();
        if (t) {
          foundBodyText = true;
          acc.unshift({ bodyText: t });
        }
      } else {
        // Not body text, so add it
        foundBodyText = true;
        acc.unshift(bodyPart);
      }
      return acc;
    }, [] as BodyPart[]);

    return trimmedBodyParts;
  }

  /**
   * Add an error to the list of non-fatal errors
   * @param message The error message
   */
  addError(message: string) {
    const error: ParserError = {
      message,
      text: this.parserText(),
      location: this.parserLocation(),
    };
    this.nonFatalErrors.push(error);
  }

  /**
   * Print out data for debugging
   *
   * @param header
   * @param data
   */
  debugPrint(header: string, data: unknown): void {
    if (DEBUG) {
      if (DEBUG_DATA) {
        // Strip 'parser' out of the data, otherwise it is too verbose
        if (!DEBUG_DATA_INCLUDE_PARSER) {
          if (data != undefined) {
            data = JSON.parse(JSON.stringify(data, (k, v) => (k === 'parser' ? undefined : v)));
          }
        }

        console.log(`===== START: ${header} =====`);
        console.log(JSON.stringify(data, null, 2));
        console.log(`===== END: ${header} =====`);
      } else {
        console.log(`- DEBUG: ${header}`);
      }
    }
  }
}

export { BitmarkPegParserProcessor };
