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
 *    - The only fatal error for a bit is if the bit header tag (e.g. [.cloze:bitmark++]) cannot be parsed. In this
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
 * - Modify the bitmark in '_simple.bitmark' to test the parser (this will be parsed after building the parser)
 * - To undersand the operation and to help debug and develop, use the DEBUG_XXX flags in the code below.
 *   and in BitmarkPegParserHelper.ts
 */

import { Builder } from '../../../ast/Builder.ts';
import { Breakscape } from '../../../breakscaping/Breakscape.ts';
import { Config } from '../../../config/Config.ts';
import { type BreakscapedString } from '../../../model/ast/BreakscapedString.ts';
import { type Bit, type BitmarkAst, type BodyPart } from '../../../model/ast/Nodes.ts';
import { type TagsConfig } from '../../../model/config/TagsConfig.ts';
import { BitType } from '../../../model/enum/BitType.ts';
import { BodyTextFormat } from '../../../model/enum/BodyTextFormat.ts';
import { DeprecatedTextFormat } from '../../../model/enum/DeprecatedTextFormat.ts';
import { ResourceType } from '../../../model/enum/ResourceType.ts';
import { TextFormat } from '../../../model/enum/TextFormat.ts';
import { TextLocation } from '../../../model/enum/TextLocation.ts';
import { type ParserData } from '../../../model/parser/ParserData.ts';
import { type ParserError } from '../../../model/parser/ParserError.ts';
import { type ParserInfo } from '../../../model/parser/ParserInfo.ts';
import { StringUtils } from '../../../utils/StringUtils.ts';
import {
  type BitContent,
  BitContentLevel,
  type BitContentProcessorResult,
  type BitHeader,
  type BitmarkPegParserContext,
  type ContentDepthType,
  type ParsedCardSet,
  type ParseFunction,
  type ParserHelperOptions,
  type RawTextAndResourceType,
  type SubParserResult,
  TypeKey,
  type TypeKeyType,
  type TypeKeyValue,
  type TypeValue,
} from './BitmarkPegParserTypes.ts';
import { BitmarkPegParserValidator } from './BitmarkPegParserValidator.ts';
import { BodyContentProcessor } from './contentProcessors/BodyContentProcessor.ts';
import { buildCards } from './contentProcessors/CardContentProcessor.ts';
import { defaultTagContentProcessor } from './contentProcessors/DefaultTagContentProcessor.ts';
import { FooterContentProcessor } from './contentProcessors/FooterContentProcessor.ts';
import { gapChainContentProcessor } from './contentProcessors/GapChainContentProcessor.ts';
import { itemLeadChainContentProcessor } from './contentProcessors/ItemLeadChainContentProcessor.ts';
import { markChainContentProcessor } from './contentProcessors/MarkChainContentProcessor.ts';
import { propertyContentProcessor } from './contentProcessors/PropertyContentProcessor.ts';
import { referenceTagContentProcessor } from './contentProcessors/ReferenceTagContentProcessor.ts';
import {
  buildResources,
  resourceContentProcessor,
} from './contentProcessors/ResourceContentProcessor.ts';
import {
  buildTitles,
  titleTagContentProcessor,
} from './contentProcessors/TitleTagContentProcessor.ts';
import { trueFalseChainContentProcessor } from './contentProcessors/TrueFalseChainContentProcessor.ts';

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
      bitConfig: Config.getBitConfig(BitType._error),
      bitType: BitType._error,
      textFormat: TextFormat.bitmarkText,

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

      state: {
        //
      },
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

    const res = builder.buildBitmark({
      bits,
      errors: errors.length > 0 ? errors : undefined,
    });

    return res;
  }

  // Build bit
  buildBit(bitHeader: BitHeader, bitContent: BitContent[]): SubParserResult<Bit> {
    const { bitType, textFormat, resourceType, bitLevel, isCommented } = bitHeader;

    // Bit type was invalid, so ignore the bit, returning instead the parsing errors
    if (!bitType || Config.isOfBitType(bitType, BitType._error)) return this.invalidBit();

    const bitConfig = Config.getBitConfig(bitType);

    // Set the bit type, text format, etc in the context
    this.context.bitConfig = bitConfig;
    this.context.bitType = bitType;
    this.context.textFormat = textFormat;
    this.context.resourceType = resourceType;

    if (DEBUG_BIT_CONTENT_RAW) this.debugPrint('BIT CONTENT RAW', bitContent);

    const isTrueFalseV1 = Config.isOfBitType(bitType, BitType.trueFalse1);
    const isMultipleChoiceV1 = Config.isOfBitType(bitType, BitType.multipleChoice1);
    const isMultipleResponseV1 = Config.isOfBitType(bitType, BitType.multipleResponse1);

    if (DEBUG_BIT_CONTENT) this.debugPrint('BIT CONTENT', bitContent);

    // Rest the parser state
    this.resetParserState();

    // Squash inline body bits for bits / text formats that do not support inline body bits
    bitContent = this.squashUnwantedInlineBodyBits(bitContent);

    // Validate the bit tags
    bitContent = BitmarkPegParserValidator.validateBitTags(this.context, bitContent);

    // Parse the bit content into a an object with the appropriate keys

    const {
      body,
      footer,
      cardSet,
      title,
      statement,
      statements,
      choices,
      responses,
      propertyStyleResources,
      resources,
      posterImage,
      internalComments,
      ...tags
    } = this.bitContentProcessor(BitContentLevel.Bit, bitConfig.tags, bitContent);

    if (DEBUG_BIT_TAGS) this.debugPrint('BIT TAGS', tags);
    if (DEBUG_BODY) this.debugPrint('BIT BODY', body);
    if (DEBUG_FOOTER) this.debugPrint('BIT FOOTER', footer);

    // Build the titles for the specific bit type
    const titles = buildTitles(this.context, bitType, title);

    // Build the card data for the specific bit type
    const bitSpecificCards = buildCards(
      this.context,
      bitType,
      textFormat,
      cardSet,
      statement,
      statements,
      choices,
      responses,
    );

    // Build the resources
    const filteredResources = buildResources(this.context, resourceType, resources);

    // Build the final internal comments
    const internalComment = [
      ...(internalComments ?? []),
      ...(bitSpecificCards.internalComments ?? []),
    ];

    // Build the warnings and errors for the parser object
    const warnings = this.buildBitLevelWarnings();
    const errors = this.buildBitLevelErrors();
    if (warnings) this.parser.warnings = warnings;
    if (errors) this.parser.errors = errors;

    // Build the final bit
    const bit = builder.buildBit({
      bitType,
      bitLevel,
      isCommented,
      textFormat,
      resourceType,
      ...titles,
      posterImage: posterImage as string,
      statement: isTrueFalseV1 ? statement : undefined,
      choices: isMultipleChoiceV1 ? choices : undefined,
      responses: isMultipleResponseV1 ? responses : undefined,
      ...tags,
      ...propertyStyleResources,
      resources: filteredResources,
      ...bitSpecificCards,
      body,
      footer,
      internalComment,
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
    const bit = builder.buildBit({
      bitType: Config.getBitType(BitType._error),
      bitLevel: 1,
      parser: this.parser,
    });

    return { value: bit };
  }

  // Build bit header
  buildBitHeader(
    bitTypeBreakscaped: BreakscapedString,
    bitLevel: number,
    textFormatAndResourceType: RawTextAndResourceType,
  ): BitHeader {
    // Unbreakscape the bit type
    const bitType = Breakscape.unbreakscape(bitTypeBreakscaped, {
      format: TextFormat.plainText,
      location: TextLocation.tag,
    });

    // Get / check bit type
    const validBitType = Config.getBitType(bitType);
    const commented = Config.isBitTypeCommented(bitType);

    if (Config.isOfBitType(validBitType, BitType._error)) {
      this.addError(`Invalid bit type: '${bitType}'`);
    }

    const bitConfig = Config.getBitConfig(validBitType);

    // Bit level
    if (bitLevel > Config.bitLevelMax) {
      this.addWarning(
        `Bit level of ${bitLevel} too high, setting to max value of ${Config.bitLevelMax}`,
      );
      bitLevel = Config.bitLevelMax;
    } else if (bitLevel < Config.bitLevelMin) {
      this.addWarning(
        `Bit level of ${bitLevel} too low, setting to min value of ${Config.bitLevelMin}`,
      );
      bitLevel = Config.bitLevelMin;
    }

    // Text format
    let textFormat = TextFormat.fromValue(textFormatAndResourceType.textFormat);
    const isInvalidTextFormat = textFormatAndResourceType.textFormat && !textFormat;
    if (isInvalidTextFormat) {
      this.addWarning(
        `Invalid text format '${textFormatAndResourceType.textFormat}', defaulting to '${BodyTextFormat.bitmarkPlusPlus}'`,
      );
    }

    // Deprecated warning for bitmark--
    const deprecatedTextFormat = DeprecatedTextFormat.fromValue(
      textFormatAndResourceType.textFormat,
    );
    if (deprecatedTextFormat) {
      textFormat = TextFormat.bitmarkText;
      this.addWarning(
        `${deprecatedTextFormat} text format is deprecated. Bit will be parsed as '${BodyTextFormat.bitmarkPlusPlus}'`,
      );
    }

    textFormat = textFormat ?? bitConfig.textFormatDefault;

    // Resource type
    const resourceType = ResourceType.fromValue(textFormatAndResourceType.resourceType);
    if (textFormatAndResourceType.resourceType && !resourceType) {
      this.addWarning(
        `Invalid resource type '${textFormatAndResourceType.resourceType}', it will be ignored`,
      );
    }

    return {
      bitType: validBitType,
      bitLevel,
      textFormat: textFormat ?? bitConfig.textFormatDefault,
      resourceType,
      isCommented: commented,
    };
  }

  // Build text and resource type
  buildTextAndResourceType(
    value1: TypeValue | undefined,
    value2: TypeValue | undefined,
  ): RawTextAndResourceType {
    const res: RawTextAndResourceType = {};

    const processValue = (value: TypeValue | undefined) => {
      if (value) {
        const val = Breakscape.unbreakscape(StringUtils.string(value.value) as BreakscapedString, {
          format: TextFormat.plainText,
          location: TextLocation.tag,
        });
        if (value.type === TypeKey.TextFormat) {
          // Set text format
          res.textFormat = val;
        } else {
          // Set resource type
          res.resourceType = val;
        }
      }
    };
    processValue(value1);
    processValue(value2);

    return res;
  }

  /**
   * Reset the parser state
   *
   */
  private resetParserState() {
    this.context.state = {};
  }

  /**
   * Process Type/Key/Value data, squashing inline body bits back into text for bits / body text formats that
   * do not support them, and for after the plain text tag '$$$$'.
   *
   * @param data the bit content (Type/Key/Value data)
   * @returns
   */
  private squashUnwantedInlineBodyBits(data: BitContent[]): BitContent[] {
    const result: BitContent[] = [];
    if (!data) return result;

    const { textFormat } = this.context;

    const isBitmarkText = textFormat === TextFormat.bitmarkText;

    // Format: text / latex
    // Body bits are only supported up to the first BodyText tag.
    // Squash the subsequent body bits back into text.

    const convertTagToTextRecursive = (tag: BitContent, str = ''): string => {
      const { chain, parser } = tag as TypeKeyValue;
      str += parser.text;
      if (chain) {
        for (const t of chain) {
          str = convertTagToTextRecursive(t, str);
        }
      }
      return str;
    };

    // New code: Only tags before the $$$$ tag (or first text if not bitmark--/++) are interpreted as tags
    // all other tags are squashed back to text
    let inPlainText = false;
    for (const content of data) {
      const { type, value } = content as TypeKeyValue;
      const valueStr = (value ?? '') as string;
      let atPlainTextDivider = false;

      if (!inPlainText) {
        if (type === TypeKey.BodyText && !isBitmarkText && valueStr && valueStr.trim()) {
          inPlainText = true;
        }
        if (type === TypeKey.PlainTextDivider) {
          inPlainText = true;
          atPlainTextDivider = true;
        }
      }

      if (!atPlainTextDivider) {
        if (inPlainText) {
          if (type === TypeKey.BodyText) {
            result.push({ type: TypeKey.BodyTextPlain, value } as TypeValue);
          } else {
            const s = convertTagToTextRecursive(content);
            result.push({ type: TypeKey.BodyTextPlain, value: s } as TypeValue);
          }
        } else {
          result.push(content);
        }
      } else {
        result.push({ type: TypeKey.BodyText, value: '\n' } as TypeValue);
      }
    }

    return result;
  }

  /**
   * Process Type/Key/Value data, building the bit parts as AST nodes.
   *
   * @param bitType bit type
   * @param textFormat bit text format type
   * @param contentDepth bit level (in chain, in card etc)
   * @param tagsConfig tags configuration at this parser level (pass undef)
   * @param data the bit content (Type/Key/Value data)
   * @returns
   */
  private bitContentProcessor(
    contentDepth: ContentDepthType,
    tagsConfig: TagsConfig | undefined,
    data: BitContent[] | undefined,
  ): BitContentProcessorResult {
    const result: BitContentProcessorResult = {};
    if (!data) return result;

    const { bitType, textFormat } = this.context;

    result.title = [];
    result.solutions = [];
    result.__solutionsAst = [];
    result.statements = [];
    result.choices = [];
    result.responses = [];
    result.propertyStyleResources = {};
    result.resources = [];
    result.trueFalse = [];
    result.markConfig = [];
    result.extraProperties = {};
    result.internalComments = [];

    let seenReference = false;
    let inFooter = false;
    const bodyParts: BodyPart[] = [];
    let bodyTextPart: BreakscapedString = Breakscape.EMPTY_STRING;
    let footer: BreakscapedString = Breakscape.EMPTY_STRING;
    let bodyPlainText: BreakscapedString = Breakscape.EMPTY_STRING;
    let footerPlainText: BreakscapedString = Breakscape.EMPTY_STRING;
    // let cardBody: BreakscapedString = Breakscape.EMPTY_STRING;

    const inBit = contentDepth === BitContentLevel.Bit;
    const inCard = contentDepth === BitContentLevel.Card;
    const inChain = contentDepth === BitContentLevel.Chain;

    // Helper for building the body text
    const addBodyText = () => {
      if (bodyTextPart) {
        // Validate the body part
        bodyTextPart = BitmarkPegParserValidator.checkBodyPart(
          this.context,
          contentDepth,
          bodyTextPart,
        );

        const bodyText = BodyContentProcessor.buildBodyText(bodyTextPart, false);
        bodyParts.push(bodyText);
      }
      bodyTextPart = Breakscape.EMPTY_STRING;
    };

    // Reduce the Type/Key/Value data to a single object that can be used to build the bit
    // let _index = 0;
    for (const content of data) {
      const { type, value } = content as TypeKeyValue;

      switch (type) {
        case TypeKey.ItemLead: {
          itemLeadChainContentProcessor(this.context, contentDepth, tagsConfig, content, result);
          break;
        }

        case TypeKey.Instruction:
        case TypeKey.Hint:
        case TypeKey.Anchor:
        case TypeKey.SampleSolution:
          defaultTagContentProcessor(this.context, contentDepth, tagsConfig, content, result);
          break;

        case TypeKey.Reference:
          referenceTagContentProcessor(
            this.context,
            contentDepth,
            tagsConfig,
            content,
            result,
            seenReference,
          );
          seenReference = true;
          break;

        case TypeKey.Title:
          titleTagContentProcessor(this.context, contentDepth, tagsConfig, content, result);
          break;

        case TypeKey.Property:
          propertyContentProcessor(this.context, contentDepth, tagsConfig, content, result);
          break;

        case TypeKey.Gap: {
          if (!inChain) addBodyText(); // Body bit, so add the body text
          gapChainContentProcessor(
            this.context,
            contentDepth,
            tagsConfig,
            content,
            result,
            bodyParts,
          );
          break;
        }

        case TypeKey.Mark: {
          if (!inChain) addBodyText(); // Body bit, so add the body text
          markChainContentProcessor(
            this.context,
            contentDepth,
            tagsConfig,
            content,
            result,
            bodyParts,
          );
          break;
        }

        case TypeKey.True:
        case TypeKey.False: {
          if (!inChain) addBodyText(); // Body bit, so add the body text
          trueFalseChainContentProcessor(
            this.context,
            contentDepth,
            tagsConfig,
            content,
            result,
            bodyParts,
          );
          break;
        }

        case TypeKey.Resource:
          resourceContentProcessor(this.context, contentDepth, tagsConfig, content, result);
          break;

        case TypeKey.CardSet: {
          result.cardSet = value as ParsedCardSet;
          inFooter = true; // After the card set, body lines should be written to the footer rather than the body
          break;
        }

        case TypeKey.BodyText:
        case TypeKey.CardText: {
          if (inFooter) {
            footer = Breakscape.concatenate(footer, value as BreakscapedString);
          } else {
            bodyTextPart = Breakscape.concatenate(bodyTextPart, value as BreakscapedString);
          }
          break;
        }

        case TypeKey.BodyTextPlain: {
          if (inFooter) {
            footerPlainText = Breakscape.concatenate(footerPlainText, value as BreakscapedString);
          } else {
            bodyPlainText = Breakscape.concatenate(bodyPlainText, value as BreakscapedString);
          }
          break;
        }

        case TypeKey.FooterDivider: {
          if (inFooter) {
            // If already in footer, handle the content as if it is footer (body) text
            footer = Breakscape.concatenate(footer, value as BreakscapedString);
          }
          inFooter = true; // After the footer divider, body lines should be written to the footer rather than the body
          break;
        }

        default:
        // Unknown tag
      }

      // _index++;
    }

    // Add the last body text part, and trim the body text parts
    addBodyText();

    // Add the plain texts if they exist
    const bodyPlainTextNode = bodyPlainText
      ? BodyContentProcessor.buildBodyText(bodyPlainText, true)
      : undefined;
    if (bodyPlainTextNode) bodyParts.push(bodyPlainTextNode);

    // Spread the chained item / lead / etc
    // Set the lead item from the chain
    if (result.itemLead) {
      const l = result.itemLead.length;
      if (l > 0) result.item = result.itemLead[0];
      if (l > 1) result.lead = result.itemLead[1];
      if (l > 2) result.pageNumber = result.itemLead[2];
      if (l > 3) result.marginNumber = result.itemLead[l - 1];
    }

    // Validate and build the body (trimmed)
    if (inBit) {
      result.body = BodyContentProcessor.process(
        this.context,
        contentDepth,
        bitType,
        textFormat,
        tagsConfig,
        result,
        bodyParts,
        false,
      );
      //  bodyParts.length > 0 ? builder.body({ bodyParts: this.trimBodyParts(bodyParts) }) : undefined;
      // result.body = BitmarkPegParserValidator.checkBody(this.context, contentDepth, bitType, textFormat, result.body);
    } else if (inCard) {
      result.cardBody = BodyContentProcessor.process(
        this.context,
        contentDepth,
        bitType,
        textFormat,
        tagsConfig,
        result,
        bodyParts,
        true,
      );
      // result.cardBody = bodyParts.length > 0 ? builder.body({ bodyParts: this.trimBodyParts(bodyParts) }) : undefined;
      // Card body is validated in CardContentProcessor:processCardSet()
    }

    // Validate and build the footer (trimmed)
    // footer = footer.trim() as BreakscapedString;
    // footerPlainText = footerPlainText.trim() as BreakscapedString;
    // if (footer || footerPlainText) {
    //   if (footer) {
    //     footer = BitmarkPegParserValidator.checkFooter(this.context, contentDepth, bitType, footer);
    //   }
    //   const footerTexts: FooterText[] = [];
    //   const footerNode = footer ? builder.footerText({ text: footer }, false) : undefined;
    //   const footerPlainTextNode = footerPlainText ? builder.footerText({ text: footerPlainText }, true) : undefined;
    //   if (footerNode) footerTexts.push(footerNode);
    //   if (footerPlainTextNode) footerTexts.push(footerPlainTextNode);
    //   if (footer) {
    //     result.footer =
    //       footerTexts.length > 0 ? builder.footer({ footerParts: this.trimFooterTexts(footerTexts) }) : undefined;
    //   }
    // }
    result.footer = FooterContentProcessor.process(
      this.context,
      contentDepth,
      tagsConfig,
      result,
      footer,
      footerPlainText,
    );

    // // Add card body (validated elsewhere)
    // cardBody = cardBody.trim() as BreakscapedString;
    // if (cardBody) {
    //   result.cardBody = cardBody;
    // }

    // Remove the extra properties if there are none
    if (Object.keys(result.extraProperties).length === 0) delete result.extraProperties;

    // Remove the unwanted empty arrays.
    if (result.title.length === 0) delete result.title;
    if (result.solutions.length === 0) delete result.solutions;
    if (result.statements.length === 0) delete result.statements;
    if (result.choices.length === 0) delete result.choices;
    if (result.responses.length === 0) delete result.responses;
    if (result.trueFalse.length === 0) delete result.trueFalse;
    if (result.markConfig.length === 0) delete result.markConfig;
    if (Object.keys(result.propertyStyleResources).length === 0)
      delete result.propertyStyleResources;
    if (result.resources.length === 0) delete result.resources;
    if (result.internalComments.length === 0) delete result.internalComments;

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
  }
}

export { BitmarkPegParserProcessor };
