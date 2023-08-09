/**
 * BitmarkPegParserProcessor.ts
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
 *   and in BitmarkPegParserHelper.ts
 */

import { Builder } from '../../../ast/Builder';
import { Bit, BitmarkAst, BodyPart, BodyText } from '../../../model/ast/Nodes';
import { BitType, BitTypeUtils, RootBitType } from '../../../model/enum/BitType';
import { BodyBitType } from '../../../model/enum/BodyBitType';
import { ResourceType } from '../../../model/enum/ResourceType';
import { TextFormat } from '../../../model/enum/TextFormat';
import { ParserData } from '../../../model/parser/ParserData';
import { ParserError } from '../../../model/parser/ParserError';
import { ParserInfo } from '../../../model/parser/ParserInfo';

import { BitmarkPegParserValidator } from './BitmarkPegParserValidator';
import { buildCards } from './contentProcessors/CardContentProcessor';
import { commentTagContentProcessor } from './contentProcessors/CommentTagContentProcessor';
import { defaultTagContentProcessor } from './contentProcessors/DefaultTagContentProcessor';
import { gapChainContentProcessor } from './contentProcessors/GapChainContentProcessor';
import { itemLeadTagContentProcessor } from './contentProcessors/ItemLeadTagContentProcessor';
import { propertyContentProcessor } from './contentProcessors/PropertyContentProcessor';
import { referenceTagContentProcessor } from './contentProcessors/ReferenceTagContentProcessor';
import { buildResource, resourceContentProcessor } from './contentProcessors/ResourceContentProcessor';
import { buildTitles, titleTagContentProcessor } from './contentProcessors/TitleTagContentProcessor';
import { trueFalseChainContentProcessor } from './contentProcessors/TrueFalseChainContentProcessor';

import {
  BitContent,
  BitContentLevel,
  BitContentLevelType,
  BitHeader,
  ParseFunction,
  ParserHelperOptions,
  SubParserResult,
  TypeKey,
  BitContentProcessorResult,
  TypeKeyType,
  TypeKeyValue,
  TypeValue,
  BitmarkPegParserContext,
  ParsedCardSet,
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
const DEBUG_CHAIN_CONTENT = true; // Print the parsed chain content
const DEBUG_CHAIN_TAGS = true; // Print the tags extracted from the parsed chain content
const DEBUG_CARD_SET_CONTENT = true; // Print the parsed card set content
const DEBUG_CARD_SET = true; // Print the card set built from the parsed card set content
const DEBUG_CARD_TAGS = true; // Print the tags extracted from the card content

// DO NOT EDIT THIS LINE. Ensures no debug in production in case ENABLE_DEBUG is accidentally left on
const DEBUG = ENABLE_DEBUG && process.env.BPG_ENV === 'development';

const builder = new Builder();

// Dummy for stripping unwanted code
const STRIP = 0;

class BitmarkPegParserProcessor {
  private context: BitmarkPegParserContext;
  private nonFatalWarnings: ParserError[] = [];
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
      DEBUG_CHAIN_CONTENT,
      DEBUG_CHAIN_TAGS,
      DEBUG_CARD_SET_CONTENT,
      DEBUG_CARD_SET,
      DEBUG_CARD_TAGS,

      parser: this.parser,

      parse: this.parse,
      bitContentProcessor: this.bitContentProcessor.bind(this),
      splitBitContent: this.splitBitContent.bind(this),
      addWarning: this.addWarning.bind(this),
      addError: this.addError.bind(this),
      debugPrint: this.debugPrint.bind(this),
    };
  }

  // Build bits
  buildBits(rawBits: SubParserResult<Bit>[]): BitmarkAst {
    const bits: Bit[] = [];
    let errors: ParserError[] = [];

    for (const rawBit of rawBits) {
      // Ignore empty bits (only happens if entire file is empty / whitespace only
      if (!rawBit) continue;

      const bit = rawBit.value;
      if (bit) {
        // Add the bit to the list of bits
        bits.push(bit);
      } else {
        // TODO - convert error location to master parser location

        // If bit is undefined, then there was an error parsing the bit
        errors = errors.concat(rawBit.errors ?? []);
      }
    }

    const res = builder.bitmark({
      bits,
      errors: errors.length > 0 ? errors : undefined,
    });

    return res;
  }

  // Build bit
  buildBit(bitHeader: BitHeader, bitContent: BitContent[]): SubParserResult<Bit> {
    const { bitType, textFormat, resourceType } = bitHeader;

    // Bit type was invalid, so ignore the bit, returning instead the parsing errors
    if (!bitType || bitType.root === RootBitType._error) return this.invalidBit();

    if (DEBUG_BIT_CONTENT_RAW) this.debugPrint('BIT CONTENT RAW', bitContent);

    const isTrueFalseV1 = bitType.root === RootBitType.trueFalse1;
    const isMultipleChoiceV1 = bitType.root === RootBitType.multipleChoice1;
    const isMultipleResponseV1 = bitType.root === RootBitType.multipleResponse1;

    if (DEBUG_BIT_CONTENT) this.debugPrint('BIT CONTENT', bitContent);

    // Validate the bit tags
    bitContent = BitmarkPegParserValidator.validateBitTags(this.context, bitType, bitContent);

    // Parse the bit content into a an object with the appropriate keys
    const { body, footer, cardSet, title, statement, statements, choices, responses, resources, comments, ...tags } =
      this.bitContentProcessor(BitContentLevel.Bit, bitType, bitContent);

    if (DEBUG_BIT_TAGS) this.debugPrint('BIT TAGS', tags);
    if (DEBUG_BODY) this.debugPrint('BIT BODY', body);
    if (DEBUG_FOOTER) this.debugPrint('BIT FOOTER', footer);

    // Build the titles for the specific bit type
    const titles = buildTitles(this.context, bitType, title);

    // Build the card data for the specific bit type
    const bitSpecificCards = buildCards(this.context, bitType, cardSet, statement, statements, choices, responses);

    // Build the resources
    const resource = buildResource(this.context, bitType, resourceType, resources);

    // Build the comments for the parser object
    if (comments || bitSpecificCards.comments) {
      this.parser.comments = [];
      if (comments) this.parser.comments.push(...comments);
      if (bitSpecificCards.comments) this.parser.comments.push(...bitSpecificCards.comments);
    }

    // Build the warnings and errors for the parser object
    const warnings = this.buildBitLevelWarnings();
    const errors = this.buildBitLevelErrors();
    if (warnings) this.parser.warnings = warnings;
    if (errors) this.parser.errors = errors;

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

    return { value: bit };
  }

  // Build bit for data that cannot be parsed
  invalidBit(bitData?: unknown): SubParserResult<Bit> {
    // Create the error is bitData is defined (else it was created when parsing the header)
    if (bitData) this.addError(`Invalid bit`);

    // Build the errors
    this.parser.errors = this.buildBitLevelErrors();

    // Build the error bit
    const bit = builder.bit({
      bitType: BitTypeUtils.getBitType(RootBitType._error),
      parser: this.parser,
    });

    return { value: bit };
  }

  // Build bit header
  buildBitHeader(bitType: string, textFormatAndResourceType: Partial<BitHeader>): BitHeader {
    // Get / check bit type
    const validBitType = BitTypeUtils.getBitType(bitType);
    if (validBitType.root === RootBitType._error) {
      this.addError(`Invalid bit type: '${bitType}'`);
    }

    return {
      bitType: validBitType,
      textFormat: textFormatAndResourceType.textFormat ?? TextFormat.bitmarkMinusMinus,
      resourceType: textFormatAndResourceType.resourceType,
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
            this.addWarning(`Invalid text format '${value.value}', defaulting to '${TextFormat.bitmarkMinusMinus}'`);
          }
          res.textFormat = res.textFormat ?? TextFormat.bitmarkMinusMinus;
        } else {
          // Parse resource type, adding error if invalid
          res.resourceType = ResourceType.fromValue(value.value);
          if (value.value && !res.resourceType) {
            this.addWarning(`Invalid resource type '${value.value}', it will be ignored`);
          }
        }
      }
    };
    processValue(value1);
    processValue(value2);

    return res;
  }

  /**
   * Process Type/Key/Value data, building the bit parts as AST nodes.
   *
   * @param bitType
   * @param data
   * @param validTypes
   * @returns
   */
  private bitContentProcessor(
    bitLevel: BitContentLevelType,
    bitType: BitType,
    data: BitContent[] | undefined,
  ): BitContentProcessorResult {
    const result: BitContentProcessorResult = {};
    if (!data) return result;

    result.title = [];
    result.solutions = [];
    result.statements = [];
    result.choices = [];
    result.responses = [];
    result.resources = [];
    result.trueFalse = [];
    result.extraProperties = {};
    result.comments = [];

    let seenItem = false;
    let seenReference = false;
    let inFooter = false;
    const bodyParts: BodyPart[] = [];
    let bodyPart = '';
    let footer = '';
    let cardBody = '';

    const inChain = bitLevel === BitContentLevel.Chain;

    // Helper for building the body text
    const addBodyText = () => {
      if (bodyPart) {
        // Validate the body part
        bodyPart = BitmarkPegParserValidator.checkBodyPart(this.context, bitLevel, bitType, bodyPart);

        const bodyText = builder.bodyText({ text: bodyPart });
        bodyParts.push(bodyText);
      }
      bodyPart = '';
    };

    // Reduce the Type/Key/Value data to a single object that can be used to build the bit
    data.forEach((content, _index) => {
      const { type, value } = content as TypeKeyValue;

      switch (type) {
        case TypeKey.Comment: {
          commentTagContentProcessor(this.context, bitLevel, bitType, content, result);
          break;
        }

        case TypeKey.ItemLead: {
          itemLeadTagContentProcessor(this.context, bitLevel, bitType, content, result, seenItem);
          seenItem = true;
          break;
        }

        case TypeKey.Instruction:
        case TypeKey.Hint:
        case TypeKey.Anchor:
        case TypeKey.SampleSolution:
          defaultTagContentProcessor(this.context, bitLevel, bitType, content, result);
          break;

        case TypeKey.Reference:
          referenceTagContentProcessor(this.context, bitLevel, bitType, content, result, seenReference);
          seenReference = true;
          break;

        case TypeKey.Title:
          titleTagContentProcessor(this.context, bitLevel, bitType, content, result);
          break;

        case TypeKey.Property:
          propertyContentProcessor(this.context, bitLevel, bitType, content, result);
          break;

        case TypeKey.Gap: {
          if (!inChain) addBodyText();
          gapChainContentProcessor(this.context, bitLevel, bitType, content, result, bodyParts);
          break;
        }

        case TypeKey.True:
        case TypeKey.False: {
          if (!inChain) addBodyText();
          trueFalseChainContentProcessor(this.context, bitLevel, bitType, content, result, bodyParts);
          break;
        }

        case TypeKey.Resource:
          resourceContentProcessor(this.context, bitLevel, bitType, content, result);
          break;

        case TypeKey.CardSet: {
          result.cardSet = value as ParsedCardSet;
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

    // Validate and build the body (trimmed)
    result.body = bodyParts.length > 0 ? builder.body({ bodyParts: this.trimBodyParts(bodyParts) }) : undefined;
    BitmarkPegParserValidator.checkBody(this.context, bitLevel, bitType, result.body);

    // Validate and build the footer (trimmed)
    footer = footer.trim();
    if (footer) {
      footer = BitmarkPegParserValidator.checkFooter(this.context, bitLevel, bitType, footer);
      if (footer) {
        result.footer = builder.footerText({ text: footer });
      }
    }

    // Add card body (validated elsewhere)
    cardBody = cardBody.trim();
    if (cardBody) {
      result.cardBody = cardBody;
    }

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
    if (result.comments.length === 0) delete result.comments;

    return result;
  }

  private buildBitLevelWarnings(): ParserError[] | undefined {
    let warnings: ParserError[] | undefined;
    if (this.nonFatalWarnings.length > 0) {
      warnings = this.nonFatalWarnings;
      this.nonFatalWarnings = [];
    }
    return warnings;
  }

  private buildBitLevelErrors(): ParserError[] | undefined {
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
      if (!foundBodyText && bodyText.type === BodyBitType.text) {
        const t = bodyText.data.bodyText.trimStart();
        if (t) {
          foundBodyText = true;
          bodyText.data.bodyText = t;
          acc.push(bodyText);
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
      if (!foundBodyText && bodyText.type === BodyBitType.text) {
        const t = bodyText.data.bodyText.trimEnd();
        if (t) {
          foundBodyText = true;
          bodyText.data.bodyText = t;
          acc.unshift(bodyText);
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
   * Add an warning to the list of non-fatal warnings
   * @param message The error message
   * @param parserData Parser data - if not set, the current parser data will be used
   * @param parserDataOriginal Parser data of the original instance of a duplicate error
   */
  private addWarning(message: string, parserData?: ParserData, parserDataOriginal?: ParserData) {
    const warning: ParserError = {
      message,
      text: parserData?.parser.text ?? this.parserText(),
      location: parserData?.parser.location ?? this.parserLocation(),
      original: parserDataOriginal?.parser ?? undefined,
    };
    if (!warning.original) delete warning.original;

    this.nonFatalWarnings.push(warning);
  }

  /**
   * Add an error to the list of non-fatal errors
   * @param message The error message
   * @param parserData Parser data - if not set, the current parser data will be used
   * @param parserDataOriginal Parser data of the original instance of a duplicate error
   */
  private addError(message: string, parserData?: ParserData, parserDataOriginal?: ParserData) {
    const error: ParserError = {
      message,
      text: parserData?.parser.text ?? this.parserText(),
      location: parserData?.parser.location ?? this.parserLocation(),
      original: parserDataOriginal?.parser ?? undefined,
    };
    if (!error.original) delete error.original;

    this.nonFatalErrors.push(error);
  }

  /**
   * Print out data for debugging
   *
   * @param header
   * @param data
   */
  private debugPrint(header: string, data: unknown): void {
    /* STRIP:START */
    STRIP;

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

    /* STRIP:END */
    STRIP;
  }
}

export { BitmarkPegParserProcessor };
