/**
 * BitmarkParserHelper.ts
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
 *    - If the parser encounters suspect bitmark it will generate 'errors' which it will attach to the AST at bit level
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
 *
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { EnumType, superenum } from '@ncoderz/superenum';

import { Builder } from '../../ast/Builder';
import { CardSet } from '../../model/ast/CardSet';
import { BitType, BitTypeType } from '../../model/enum/BitType';
import { PropertyKey } from '../../model/enum/PropertyKey';
import { ResourcePropertyKey } from '../../model/enum/ResourcePropertyKey';
import { ResourceType, ResourceTypeType } from '../../model/enum/ResourceType';
import { TextFormat, TextFormatType } from '../../model/enum/TextFormat';
import { ParserError } from '../../model/parser/ParserError';
import { ParserInfo } from '../../model/parser/ParserInfo';
import { BitUtils } from '../../utils/BitUtils';
import { StringUtils } from '../../utils/StringUtils';

import {
  Bit,
  BitmarkAst,
  BodyPart,
  Body,
  Gap,
  Select,
  SelectOption,
  Statement,
  Response,
  Quiz,
  Heading,
  Pair,
  Matrix,
  Choice,
  Question,
  Resource,
  AudioResource,
  ImageResource,
  MatrixCell,
  FooterText,
  BodyText,
  HighlightText,
  Highlight,
} from '../../model/ast/Nodes';

// Debugging flags for helping develop and debug the parser
const ENABLE_DEBUG = true;
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

export interface ParseOptions {
  filename?: string;
  startRule?: string;
  tracer?: any;
  [key: string]: any;
}
export type ParseFunction = (input: string, options?: ParseOptions) => any;

export interface ParserHelperOptions {
  parse: ParseFunction;
  parserText: () => ParserError['text'];
  parserLocation: () => ParserError['location'];
}

interface SubParserResult<T> {
  value?: T;
  errors?: ParserError[];
}

interface BitHeader {
  bitType?: BitTypeType;
  textFormat?: TextFormatType;
  resourceType?: ResourceTypeType;
}

interface TrueFalseValue {
  text: string;
  isCorrect: boolean;
}

interface CardData {
  cardIndex: number;
  cardSideIndex: number;
  cardVariantIndex: number;
  value: string;
}

export interface TypeKeyParseResult {
  cardSet?: TypeValue[];
  cardBody?: string;
  body?: Body;
  footer?: FooterText;
  trueFalse?: TrueFalseValue[];
  example?: string;
  isCorrect: boolean;
  solutions?: string[];
  statement?: Statement;
  statements?: Statement[];
  choices?: Choice[];
  responses?: Response[];
  title?: string[];
  subtitle?: string;
  resources?: Resource[];
  item?: string;
  lead?: string;
  instruction?: string;
  hint?: string;
  anchor?: string;
  reference?: string;
  sampleSolution?: string;
  isShortAnswer?: boolean;
  isCaseSensitive?: boolean;
  extraProperties?: any;
}

interface BitSpecificTitles {
  title?: string;
  subtitle?: string;
  level?: number;
}

interface StatementsOrChoicesOrResponses {
  statements?: Statement[];
  choices?: Choice[];
  responses?: Response[];
}

interface BitSpecificCards {
  sampleSolution?: string | string[];
  elements?: string[];
  statements?: Statement[];
  responses?: Response[];
  quizzes?: Quiz[];
  heading?: Heading;
  pairs?: Pair[];
  matrix?: Matrix[];
  choices?: Choice[];
  questions?: Question[];
}

type BitContent = TypeValue | TypeKeyValue;

interface TypeValue {
  type: string;
  value?: unknown;
}

interface TypeKeyValue {
  type: string;
  key: string;
  value?: unknown;
}

interface TypeKeyResource {
  type: string;
  key: string;
  url: string;
}

const TypeKey = superenum({
  TextFormat: 'TextFormat',
  ResourceType: 'ResourceType',
  Resource: 'Resource',
  ResourceProperty: 'ResourceProperty',
  Title: 'Title',
  Anchor: 'Anchor',
  Reference: 'Reference',
  Property: 'Property',
  ItemLead: 'ItemLead',
  Instruction: 'Instruction',
  Hint: 'Hint',
  True: 'True',
  False: 'False',
  GapChain: 'GapChain',
  TrueFalseChain: 'TrueFalseChain',
  Cloze: 'Cloze',
  SampleSolution: 'SampleSolution',
  BodyChar: 'BodyChar',
  BodyText: 'BodyText',
  CardSet: 'CardSet',
  Card: 'Card',
  CardChar: 'CardChar',
  CardText: 'CardText',
  Comment: 'Comment',
});

export type TypeKeyType = EnumType<typeof TypeKey>;

const builder = new Builder();

class BitmarkParserHelper {
  private nonFatalErrors: ParserError[] = [];
  private parser: ParserInfo = {};
  private cardIndex = 0;
  private cardSideIndex = 0;
  private cardVariantIndex = 0;
  private cardSectionLineCount = 0;
  private parse: ParseFunction;
  private parserText: () => ParserError['text'];
  private parserLocation: () => ParserError['location'];

  constructor(options: ParserHelperOptions) {
    this.parse = options.parse;
    this.parserText = options.parserText;
    this.parserLocation = options.parserLocation;
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
    bitContent = this.mergeCharToText(bitContent);

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
    } = this.typeKeyValueProcessor(bitType, bitContent, [
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
    const bitSpecificCards = this.buildCards(bitType, cardSet, statement, statements, choices, responses);

    // // Build the body (parts and placeholders)
    // const body = this.buildBody(bitType, parsedBody);

    // // Build the footer
    // const footer = this.buildFooter(bitType, unparsedFooter);

    // Build the resources
    const resource = this.buildResource(bitType, resourceType, resources);

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
  invalidBit(bit?: unknown): SubParserResult<Bit> {
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

  /**
   * Get the valid resource from all the resources on the bit, and add the invalid ones to
   * excess resources
   *
   * @param resourceType
   * @param resource
   */
  private buildResource(
    bitType: BitTypeType,
    resourceType: string | undefined,
    resources: Resource[] | undefined,
  ): Resource | undefined {
    let resource: Resource | undefined;
    const excessResources: Resource[] = [];

    const finalResourceType = BitUtils.calculateResourceType(bitType, resourceType, undefined);

    if (resources) {
      for (const r of resources.reverse()) {
        if (r.type === finalResourceType && !resource) {
          resource = r;
        } else {
          excessResources.push(r);
        }
      }
    }

    if (resourceType && !resource) {
      this.addError(
        `Resource type '&${resourceType}' specified in the bit header, but such a resource is not present in the bit`,
      );
    }

    if (excessResources.length > 0) {
      // Set the excess resources in the parser info
      this.parser.excessResources = excessResources;

      // Add an error to warn about the excess resources
      const resourceTypeString = resourceType ? `&${resourceType}` : 'NOT SET';
      this.addError(
        `${excessResources.length} excess resource(s) present in the bit. The bit resource type is '${resourceTypeString}'`,
      );
    }

    return resource;
  }

  buildGap(bitType: BitTypeType, gapContent: BitContent[]): Gap | undefined {
    if (DEBUG_GAP_CONTENT) this.debugPrint('gap content', gapContent);

    const tags = this.typeKeyValueProcessor(bitType, gapContent, [
      TypeKey.Cloze,
      TypeKey.Property,
      TypeKey.ItemLead,
      TypeKey.Instruction,
      TypeKey.Hint,
    ]);

    if (DEBUG_GAP_TAGS) this.debugPrint('gap TAGS', tags);

    const gap = builder.gap({
      solutions: [],
      ...tags,
      isCaseSensitive: true,
    });

    return gap;
  }

  buildHighlight(bitType: BitTypeType, highlightContent: BitContent[]): Highlight | undefined {
    if (DEBUG_HIGHLIGHT_CONTENT) this.debugPrint('highlight content', highlightContent);

    const { trueFalse, ...tags } = this.typeKeyValueProcessor(bitType, highlightContent, [
      TypeKey.True,
      TypeKey.False,
      TypeKey.Property,
      TypeKey.ItemLead,
      TypeKey.Instruction,
      TypeKey.Hint,
    ]);

    if (DEBUG_HIGHLIGHT_TAGS) this.debugPrint('highlight TAGS', { trueFalse, ...tags });

    const texts: HighlightText[] = [];
    if (trueFalse) {
      for (const tf of trueFalse) {
        texts.push(builder.highlightText({ ...tf, isHighlighted: false }));
      }
    }

    const highlight = builder.highlight({
      texts,
      ...tags,
    });

    return highlight;
  }

  buildSelect(bitType: BitTypeType, selectContent: BitContent[]): Select | undefined {
    if (DEBUG_SELECT_CONTENT) this.debugPrint('select content', selectContent);

    const { trueFalse, ...tags } = this.typeKeyValueProcessor(bitType, selectContent, [
      TypeKey.True,
      TypeKey.False,
      TypeKey.Property,
      TypeKey.ItemLead,
      TypeKey.Instruction,
      TypeKey.Hint,
    ]);

    if (DEBUG_SELECT_TAGS) this.debugPrint('select TAGS', { trueFalse, ...tags });

    const options: SelectOption[] = [];
    if (trueFalse) {
      for (const tf of trueFalse) {
        options.push(builder.selectOption(tf));
      }
    }

    const select = builder.select({
      options,
      ...tags,
    });

    return select;
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

  buildCards(
    bitType: BitTypeType,
    cardSetContent: TypeValue[] | undefined,
    statementV1: Statement | undefined,
    statementsV1: Statement[] | undefined,
    choicesV1: Choice[] | undefined,
    responsesV1: Response[] | undefined,
  ): BitSpecificCards {
    const cardSet: CardSet = {
      cards: [],
    };

    if (DEBUG_CARD_SET_CONTENT) this.debugPrint('card set content', cardSetContent);

    // Build card set
    if (cardSetContent) {
      for (const content of cardSetContent) {
        if (!content) continue;
        const { type, value: cardData } = content as TypeValue;
        if (!type || type !== TypeKey.Card) continue;
        const { cardIndex, cardSideIndex, cardVariantIndex: cardContentIndex, value } = cardData as CardData;

        // Get or create card
        let card = cardSet.cards[cardIndex];
        if (!card) {
          card = {
            sides: [],
          };
          cardSet.cards[cardIndex] = card;
        }

        // Get or create side
        let side = card.sides[cardSideIndex];
        if (!side) {
          side = {
            variants: [],
          };
          card.sides[cardSideIndex] = side;
        }

        // Set variant value
        const variant = side.variants[cardContentIndex];
        if (!variant) {
          side.variants[cardContentIndex] = value;
        } else {
          side.variants[cardContentIndex] += value;
        }
      }
    }

    if (DEBUG_CARD_SET) this.debugPrint('card set', cardSet);

    // Parse the card contents
    switch (bitType) {
      case BitType.sequence:
        return this.parseElements(bitType, cardSet);

      case BitType.trueFalse:
        return this.parseStatements(bitType, cardSet, statementV1, statementsV1);

      case BitType.multipleChoice:
      case BitType.multipleResponse:
        return this.parseQuiz(bitType, cardSet, choicesV1, responsesV1);

      case BitType.interview:
        return this.parseQuestions(bitType, cardSet);

      case BitType.match:
      case BitType.matchSolutionGrouped:
      case BitType.matchReverse:
      case BitType.matchAudio:
      case BitType.matchPicture:
        // ==> heading / pairs
        return this.parseMatchPairs(bitType, cardSet);

      case BitType.matchMatrix:
        // ==> heading / matrix
        return this.parseMatchMatrix(bitType, cardSet);

      default:
      // Return default empty object
    }

    return {};
  }

  parseElements(bitType: BitTypeType, cardSet: CardSet): BitSpecificCards {
    const elements: string[] = [];

    for (const card of cardSet.cards) {
      for (const side of card.sides) {
        for (const rawContent of side.variants) {
          let content = this.parse(rawContent, {
            startRule: 'cardContent',
          }) as BitContent[];

          content = this.mergeCharToText(content);

          if (DEBUG_CARD_PARSED) this.debugPrint('parsedCardContent (elements)', content);

          const tags = this.typeKeyValueProcessor(bitType, content, [TypeKey.CardText]);

          if (DEBUG_CARD_TAGS) this.debugPrint('card tags (elements)', tags);

          elements.push(tags.cardBody ?? '');
        }
      }
    }

    return {
      elements: elements.length > 0 ? elements : undefined,
    };
  }

  parseStatements(
    bitType: BitTypeType,
    cardSet: CardSet,
    statementV1: Statement | undefined,
    statementsV1: Statement[] | undefined,
  ): BitSpecificCards {
    const statements: Statement[] = [];

    for (const card of cardSet.cards) {
      for (const side of card.sides) {
        for (const rawContent of side.variants) {
          let content = this.parse(rawContent, {
            startRule: 'cardContent',
          }) as BitContent[];

          content = this.mergeCharToText(content);

          if (DEBUG_CARD_PARSED) this.debugPrint('parsedCardContent (statements)', content);

          const { statements: chainedStatements, ...tags } = this.typeKeyValueProcessor(bitType, content, [
            TypeKey.TrueFalseChain,
            TypeKey.Property,
            TypeKey.ItemLead,
            TypeKey.Instruction,
            TypeKey.Hint,
          ]);

          if (DEBUG_CARD_TAGS) this.debugPrint('card tags (statements)', tags);

          // Re-build the statement, adding any tags that were not in the True/False chain
          // These tags are actually not in the correct place, but we can still interpret them and fix the data.
          // As .true-false only has one statement per card, we can just add the extra tags to the statement.
          if (Array.isArray(chainedStatements)) {
            for (const s of chainedStatements) {
              const statement = builder.statement({
                ...tags,
                ...s,
                ...s.itemLead,
              });
              statements.push(statement);
            }
          }
        }
      }
    }

    // Add the V1 statement to the end of the statements array to improve backwards compatibility
    if (statementV1) {
      statements.push(statementV1);
    }

    // Add the V1 statements to the end of the statements array to improve backwards compatibility
    if (Array.isArray(statementsV1) && statementsV1.length > 0) {
      statements.push(...statementsV1);
    }

    return {
      statements: statements.length > 0 ? statements : undefined,
    };
  }

  parseQuiz(
    bitType: BitTypeType,
    cardSet: CardSet,
    choicesV1: Choice[] | undefined,
    responsesV1: Response[] | undefined,
  ): BitSpecificCards {
    const quizzes: Quiz[] = [];
    const insertChoices = bitType === BitType.multipleChoice;
    const insertResponses = bitType === BitType.multipleResponse;
    if (!insertChoices && !insertResponses) return {};

    for (const card of cardSet.cards) {
      for (const side of card.sides) {
        for (const rawContent of side.variants) {
          let content = this.parse(rawContent, {
            startRule: 'cardContent',
          }) as BitContent[];

          content = this.mergeCharToText(content);

          if (DEBUG_CARD_PARSED) this.debugPrint('parsedCardContent (quizzes)', content);

          const tags = this.typeKeyValueProcessor(bitType, content, [
            TypeKey.TrueFalseChain,
            TypeKey.Property,
            TypeKey.ItemLead,
            TypeKey.Instruction,
            TypeKey.Hint,
          ]);

          if (DEBUG_CARD_TAGS) this.debugPrint('card tags (quizzes)', tags);

          if (insertResponses) {
            if (tags.trueFalse && tags.trueFalse.length > 0) {
              tags.responses = [];
              for (const tf of tags.trueFalse) {
                const response = builder.response(tf);
                tags.responses.push(response);
              }
            }
          }
          if (insertChoices) {
            if (tags.trueFalse && tags.trueFalse.length > 0) {
              tags.choices = [];
              for (const tf of tags.trueFalse) {
                const response = builder.choice(tf);
                tags.choices.push(response);
              }
            }
          }

          const quiz = builder.quiz({
            ...tags,
          });
          quizzes.push(quiz);
        }
      }
    }

    // Add a quiz for the V1 choices / responses
    if (insertChoices && Array.isArray(choicesV1) && choicesV1.length > 0) {
      const quiz = builder.quiz({
        choices: choicesV1,
      });
      quizzes.push(quiz);
    }
    if (insertResponses && Array.isArray(responsesV1) && responsesV1.length > 0) {
      const quiz = builder.quiz({
        responses: responsesV1,
      });
      quizzes.push(quiz);
    }

    return {
      quizzes: quizzes.length > 0 ? quizzes : undefined,
    };
  }

  parseQuestions(bitType: BitTypeType, cardSet: CardSet): BitSpecificCards {
    const questions: Question[] = [];

    for (const card of cardSet.cards) {
      for (const side of card.sides) {
        for (const rawContent of side.variants) {
          let content = this.parse(rawContent, {
            startRule: 'cardContent',
          }) as BitContent[];

          content = this.mergeCharToText(content);

          if (DEBUG_CARD_PARSED) this.debugPrint('parsedCardContent (questions)', content);

          const tags = this.typeKeyValueProcessor(bitType, content, [
            TypeKey.CardText,
            TypeKey.Property,
            TypeKey.ItemLead,
            TypeKey.Instruction,
            TypeKey.Hint,
            TypeKey.SampleSolution,
          ]);

          if (DEBUG_CARD_TAGS) this.debugPrint('card tags (questions)', tags);

          const q = builder.question({
            question: tags.cardBody ?? '',
            ...tags,
          });

          questions.push(q);
        }
      }
    }

    return {
      questions: questions.length > 0 ? questions : undefined,
    };
  }

  parseMatchPairs(bitType: BitTypeType, cardSet: CardSet): BitSpecificCards {
    let sideIdx = 0;
    let heading: Heading | undefined;
    const pairs: Pair[] = [];
    let forKeys: string | undefined = undefined;
    const forValues: string[] = [];
    let pairKey: string | undefined = undefined;
    let pairValues: string[] = [];
    let keyAudio: AudioResource | undefined = undefined;
    let keyImage: ImageResource | undefined = undefined;
    let extraTags = {};

    for (const card of cardSet.cards) {
      forKeys = undefined;
      pairKey = undefined;
      pairValues = [];
      keyAudio = undefined;
      keyImage = undefined;
      sideIdx = 0;
      extraTags = {};

      for (const side of card.sides) {
        for (const rawContent of side.variants) {
          let content = this.parse(rawContent, {
            startRule: 'cardContent',
          }) as BitContent[];

          content = this.mergeCharToText(content);

          if (DEBUG_CARD_PARSED) this.debugPrint('parsedCardContent (match heading / pairs)', content);

          const { cardBody, title, resources, example, ...tags } = this.typeKeyValueProcessor(bitType, content, [
            TypeKey.CardText,
            TypeKey.Title,
            TypeKey.Property,
            TypeKey.ItemLead,
            TypeKey.Instruction,
            TypeKey.Hint,
            TypeKey.Resource,
          ]);

          if (DEBUG_CARD_TAGS) this.debugPrint('card tags (match heading / pairs)', tags);

          // Get the 'heading' which is the [#title] at level 1
          const heading = title && title[1];

          if (sideIdx === 0) {
            // First side
            if (heading != null) {
              forKeys = heading;
            } else if (Array.isArray(resources) && resources.length > 0) {
              // TODO - should search the correct resource type based on the bit type
              const resource = resources[0];
              // console.log('WARNING: Match card has resource on first side', tags.resource);
              if (resource.type === ResourceType.audio) {
                keyAudio = resource as AudioResource;
              } else if (resource.type === ResourceType.image) {
                keyImage = resource as ImageResource;
              }
            } else {
              // If not a heading or resource, it is a pair
              pairKey = cardBody;
            }
          } else {
            // Subsequent sides
            if (heading != null) {
              forValues.push(heading);
            } else if (title == null) {
              // If not a heading, it is a pair
              pairValues.push(cardBody ?? '');
            }
          }

          // Extra tags
          extraTags = {
            ...extraTags,
            ...tags,
            example: example ? true : false,
            isCaseSensitive: true,
          };
        }
        sideIdx++;
      }

      if (forKeys != null) {
        heading = builder.heading({
          forKeys,
          forValues,
        });
      } else {
        const pair = builder.pair({
          key: pairKey ?? '',
          keyAudio,
          keyImage,
          values: pairValues,
          ...extraTags,
        });
        pairs.push(pair);
      }
    }

    return {
      heading,
      pairs: pairs.length > 0 ? pairs : undefined,
    };
  }

  parseMatchMatrix(bitType: BitTypeType, cardSet: CardSet): BitSpecificCards {
    let sideIdx = 0;
    let heading: Heading | undefined;
    let forKeys: string | undefined = undefined;
    const forValues: string[] = [];
    let matrixKey: string | undefined = undefined;
    const matrix: Matrix[] = [];
    let matrixCells: MatrixCell[] = [];
    let matrixCellValues: string[] = [];
    let matrixCellTags = {};
    // let keyAudio: AudioResource | undefined = undefined;
    // let keyImage: ImageResource | undefined = undefined;

    for (const card of cardSet.cards) {
      forKeys = undefined;
      matrixKey = undefined;
      // keyAudio = undefined;
      // keyImage = undefined;
      matrixCells = [];
      matrixCellValues = [];
      sideIdx = 0;

      for (const side of card.sides) {
        matrixCellValues = [];
        matrixCellTags = {};

        for (const rawContent of side.variants) {
          let content = this.parse(rawContent, {
            startRule: 'cardContent',
          }) as BitContent[];

          content = this.mergeCharToText(content);

          if (DEBUG_CARD_PARSED) this.debugPrint('parsedCardContent (match heading / matrix)', content);

          const tags = this.typeKeyValueProcessor(bitType, content, [
            TypeKey.CardText,
            TypeKey.Title,
            TypeKey.Property,
            TypeKey.ItemLead,
            TypeKey.Instruction,
            TypeKey.Hint,
            TypeKey.Resource,
          ]);

          if (DEBUG_CARD_TAGS) this.debugPrint('card tags (match heading / matrix)', tags);

          const { title, cardBody, ...restTags } = tags;

          // Merge the tags into the matrix cell tags
          Object.assign(matrixCellTags, restTags);

          // Get the 'heading' which is the [#title] at level 1
          const heading = title && title[1];

          if (sideIdx === 0) {
            // First side
            if (heading != null) {
              forKeys = heading;
              // } else if (tags.resource) {
              //   console.log('WARNING: Match card has resource on first side', tags.resource);
              //   if (tags.resource.type === ResourceType.audio) {
              //     keyAudio = tags.resource as AudioResource;
              //   } else if (tags.resource.type === ResourceType.image) {
              //     keyImage = tags.resource as ImageResource;
              //   }
            } else {
              // If not a heading or resource, it is a matrix
              matrixKey = cardBody;
            }
          } else {
            // Subsequent sides
            if (heading != null) {
              forValues.push(heading);
            } else if (tags.title == null) {
              // If not a heading, it is a  matrix
              matrixCellValues.push(cardBody ?? '');
            }
          }
        }

        // Finished looping variants, create matrix cell
        if (sideIdx > 0) {
          const matrixCell = builder.matrixCell({
            values: matrixCellValues,
            ...matrixCellTags,
          });
          matrixCells.push(matrixCell);
        }

        sideIdx++;
      }

      if (forKeys != null) {
        heading = builder.heading({
          forKeys,
          forValues,
        });
      } else {
        const m = builder.matrix({
          key: matrixKey ?? '',
          // keyAudio,
          // keyImage,
          cells: matrixCells,
          isCaseSensitive: true,
        });
        matrix.push(m);
      }
    }

    return {
      heading,
      matrix: matrix.length > 0 ? matrix : undefined,
    };
  }

  /**
   * Build statement for the bit:
   * .trueFalse-1
   *
   * @param bitType
   * @param trueFalseContent
   * @returns
   */
  buildStatement(bitType: BitTypeType, trueFalseContent: BitContent[]): Statement | undefined {
    if (bitType !== BitType.trueFalse1) return undefined;

    if (DEBUG_TRUE_FALSE_V1_CONTENT) this.debugPrint('trueFalse V1 content (statement)', trueFalseContent);

    const { trueFalse, ...tags } = this.typeKeyValueProcessor(bitType, trueFalseContent, [
      TypeKey.True,
      TypeKey.False,
      TypeKey.Property,
      TypeKey.ItemLead,
      TypeKey.Instruction,
      TypeKey.Hint,
    ]);

    if (DEBUG_TRUE_FALSE_V1_TAGS) this.debugPrint('trueFalse V1 tags (statement)', tags);

    let statement: Statement | undefined;

    if (trueFalse && trueFalse.length > 0) {
      statement = builder.statement({ ...trueFalse[0], ...tags });
    }

    return statement;
  }

  /**
   * Build statements / choices / responses for the bits:
   * .multiple-choice, .multiple-choice-1, .mutliple-response, .mutliple-response-1, .trueFalse, etc
   *
   * @param bitType
   * @param trueFalseContent
   * @returns
   */
  buildStatementsChoicesResponses(
    bitType: BitTypeType,
    trueFalseContent: BitContent[],
  ): StatementsOrChoicesOrResponses {
    // NOTE: We handle V1 tags in V2 multiple-choice / multiple-response for maxium backwards compatibility
    const insertStatements = bitType === BitType.trueFalse;
    const insertChoices = bitType === BitType.multipleChoice || bitType === BitType.multipleChoice1;
    const insertResponses = bitType === BitType.multipleResponse || bitType === BitType.multipleResponse1;
    if (!insertStatements && !insertChoices && !insertResponses) return {};

    const statements: Statement[] = [];
    const choices: Choice[] = [];
    const responses: Response[] = [];

    const trueFalseContents = this.splitBitContent(trueFalseContent, [TypeKey.True, TypeKey.False]);

    if (DEBUG_CHOICE_RESPONSE_V1_CONTENT)
      this.debugPrint('trueFalse V1 content (choices/responses)', trueFalseContents);

    for (const contents of trueFalseContents) {
      const { trueFalse, ...tags } = this.typeKeyValueProcessor(bitType, contents, [
        TypeKey.True,
        TypeKey.False,
        TypeKey.Property,
        TypeKey.ItemLead,
        TypeKey.Instruction,
        TypeKey.Hint,
      ]);

      if (DEBUG_CHOICE_RESPONSE_V1_TAGS) this.debugPrint('trueFalse V1 tags (choices/responses)', tags);

      if (insertStatements) {
        if (trueFalse && trueFalse.length > 0) {
          const statement = builder.statement({ ...trueFalse[0], ...tags });
          statements.push(statement);
        }
      } else if (insertChoices) {
        if (trueFalse && trueFalse.length > 0) {
          const choice = builder.choice({ ...trueFalse[0], ...tags });
          choices.push(choice);
        }
      } else if (insertResponses) {
        if (trueFalse && trueFalse.length > 0) {
          const response = builder.response({ ...trueFalse[0], ...tags });
          responses.push(response);
        }
      }
    }

    const res: StatementsOrChoicesOrResponses = {};
    if (insertStatements) {
      res.statements = statements;
    } else if (insertChoices) {
      res.choices = choices;
    } else if (insertResponses) {
      res.responses = responses;
    }

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
  typeKeyValueProcessor(bitType: BitTypeType, data: BitContent[], validTypes: TypeKeyType[]): TypeKeyParseResult {
    let seenItem = false;
    const bodyParts: BodyPart[] = [];
    let bodyPart = '';
    let footer = '';
    let inFooter = false;
    let cardBody = '';
    const solutions: string[] = [];
    let statement: Statement | undefined;
    const statements: Statement[] = [];
    const choices: Choice[] = [];
    const responses: Response[] = [];
    const resources: Resource[] = [];
    const extraProperties: any = {};

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

    // Helpers for building the properties
    const addProperty = (obj: any, key: string, value: unknown) => {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const originalValue = obj[key];
        obj[key] = [...originalValue, value];
      } else {
        obj[key] = [value];
      }
    };

    // Reduce the Type/Key/Value data to a single object that can be used to build the bit
    const res = data.reduce((acc, content, _index) => {
      const { type, key, value } = content as TypeKeyValue;

      // Only parse valid types
      if (validTypes.indexOf(type as TypeKeyType) === -1) return acc;

      const trimmedStringValue = StringUtils.trimmedString(value);

      switch (type) {
        case TypeKey.Title: {
          // Parse the title and its level
          if (!acc.title) acc.title = [];
          const titleValue: { title: string; level: string[] } = value as any;
          // console.log(titleValue);
          const title = StringUtils.trimmedString(titleValue.title);
          const level = titleValue.level.length;
          acc.title[level] = title;
          break;
        }

        case TypeKey.Anchor: {
          acc.anchor = trimmedStringValue;
          break;
        }

        case TypeKey.Reference: {
          acc.reference = trimmedStringValue;
          break;
        }

        case TypeKey.Property: {
          if (PropertyKey.fromValue(key)) {
            // Known property
            switch (key) {
              case PropertyKey.shortAnswer: {
                // Different naming
                acc.isShortAnswer = value as boolean;
                break;
              }
              case PropertyKey.longAnswer: {
                // Different naming
                acc.isShortAnswer = !value;
                break;
              }
              case PropertyKey.caseSensitive: {
                // Different naming
                acc.isCaseSensitive = value as boolean;
                break;
              }
              case PropertyKey.level: {
                // Different naming
                addProperty(acc, 'levelProperty', value);
                break;
              }
              case PropertyKey.id:
              case PropertyKey.externalId:
              case PropertyKey.ageRange:
              case PropertyKey.language:
              case PropertyKey.computerLanguage:
              case PropertyKey.coverImage:
              case PropertyKey.publisher:
              case PropertyKey.publications:
              case PropertyKey.author:
              case PropertyKey.date:
              case PropertyKey.location:
              case PropertyKey.theme:
              case PropertyKey.kind:
              case PropertyKey.action:
              case PropertyKey.thumbImage:
              case PropertyKey.deeplink:
              case PropertyKey.externalLink:
              case PropertyKey.externalLinkText:
              case PropertyKey.videoCallLink:
              case PropertyKey.bot:
              case PropertyKey.duration:
              case PropertyKey.reference:
              case PropertyKey.list:
              case PropertyKey.labelTrue:
              case PropertyKey.labelFalse:
              case PropertyKey.quotedPerson:
              case PropertyKey.partialAnswer: {
                // Trim specific string properties - It might be better NOT to do this, but ANTLR parser does it
                addProperty(acc, key, ((value as string) ?? '').trim());
                break;
              }
              default: {
                // Standard property case
                addProperty(acc, key, value);
              }
            }
          } else {
            // Unknown (extra) property
            addProperty(extraProperties, key, value);
          }
          break;
        }

        case TypeKey.ItemLead: {
          if (!seenItem) {
            acc.item = trimmedStringValue;
          } else {
            acc.lead = trimmedStringValue;
          }
          seenItem = true;
          break;
        }

        case TypeKey.Instruction: {
          acc.instruction = trimmedStringValue;
          break;
        }

        case TypeKey.Hint: {
          acc.hint = trimmedStringValue;
          break;
        }

        case TypeKey.Cloze: {
          if (StringUtils.isString(value)) {
            solutions.push(trimmedStringValue);
          }
          break;
        }

        case TypeKey.SampleSolution: {
          acc.sampleSolution = trimmedStringValue;
          break;
        }

        case TypeKey.True:
        case TypeKey.False: {
          if (!Array.isArray(acc.trueFalse)) acc.trueFalse = [];
          acc.trueFalse.push({
            text: trimmedStringValue,
            isCorrect: type === TypeKey.True,
          });
          break;
        }

        case TypeKey.CardSet: {
          acc.cardSet = value as TypeValue[];
          inFooter = true; // After the card set, body lines should be written to the footer rather than the body
          break;
        }

        case TypeKey.CardText: {
          cardBody += value;
          break;
        }

        case TypeKey.Resource: {
          const resource = content as TypeKeyResource;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { type: ignoreType, key: ignoreKey, ...resourceData } = resource;
          const type = ResourceType.fromValue(key);
          if (type) {
            const resource = builder.resource({
              type,
              ...resourceData,
            });
            if (resource) resources.push(resource);
          }
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

        case TypeKey.GapChain: {
          addBodyText();

          const gap = this.buildGap(bitType, value as BitContent[]);
          if (gap) bodyParts.push(gap);
          break;
        }

        case TypeKey.TrueFalseChain: {
          addBodyText();

          if (bitType === BitType.trueFalse1) {
            // Treat as true/false for statement
            statement = this.buildStatement(bitType, value as BitContent[]);
          } else if (
            bitType === BitType.trueFalse ||
            bitType === BitType.multipleChoice ||
            bitType === BitType.multipleChoice1 ||
            bitType === BitType.multipleResponse ||
            bitType === BitType.multipleResponse1
          ) {
            // Treat as true/false for choices / responses
            const tf = this.buildStatementsChoicesResponses(bitType, value as BitContent[]);

            if (tf.statements) statements.push(...tf.statements);
            if (tf.choices) choices.push(...tf.choices);
            if (tf.responses) responses.push(...tf.responses);
          } else if (bitType === BitType.highlightText) {
            // Treat as highlight text
            const highlight = this.buildHighlight(bitType, value as BitContent[]);
            if (highlight) bodyParts.push(highlight);
          } else {
            // Treat as select
            const select = this.buildSelect(bitType, value as BitContent[]);
            if (select) bodyParts.push(select);
          }

          break;
        }

        default:
        // Unknown tag
      }

      return acc;
    }, {} as TypeKeyParseResult);

    if (Object.keys(extraProperties).length > 0) {
      res.extraProperties = extraProperties;
    }

    // Add the last body text part, and trim the body text parts
    addBodyText();

    // Build the body and footer, trimming both
    res.body = bodyParts.length > 0 ? builder.body({ bodyParts: this.trimBodyParts(bodyParts) }) : undefined;
    footer = footer.trim();
    res.footer = footer ? builder.footerText({ text: footer }) : undefined;

    // Add card body
    cardBody = cardBody.trim();
    if (cardBody) res.cardBody = cardBody;

    // Add the solutions, statement, statements, choices and responses if they exist
    if (solutions.length > 0) res.solutions = solutions;
    if (statement != null) res.statement = statement;
    if (statements.length > 0) res.statements = statements;
    if (choices.length > 0) res.choices = choices;
    if (responses.length > 0) res.responses = responses;

    // Add the resources if they exist
    if (resources.length > 0) res.resources = resources;

    return res;
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

  /**
   * Merge types:
   *  - BodyChar => BodyText
   *  - CardChar => CardText
   *
   * Any adjacent BodyChar or CardChar are merged into a single BodyText or CardText
   *
   * @param bitContent
   */
  private mergeCharToText(bitContent: BitContent[]) {
    const bc: BitContent[] = [];
    let bodyText: TypeValue | undefined;
    let cardText: TypeValue | undefined;

    for (const c of bitContent) {
      switch (c.type) {
        case TypeKey.BodyChar: {
          if (bodyText) {
            const val = `${bodyText.value ?? ''}${c.value ?? ''}`;
            bodyText.value = val;
          } else {
            bodyText = { type: TypeKey.BodyText, value: c.value ?? '' };
          }
          break;
        }

        case TypeKey.CardChar: {
          if (cardText) {
            const val = `${cardText.value ?? ''}${c.value ?? ''}`;
            cardText.value = val;
          } else {
            cardText = { type: TypeKey.CardText, value: c.value ?? '' };
          }
          break;
        }

        default: {
          if (bodyText) {
            bc.push(bodyText);
            bodyText = undefined;
          }
          if (cardText) {
            bc.push(cardText);
            cardText = undefined;
          }
          bc.push(c);
        }
      }
    }

    // Add the last bodyText or cardText
    if (bodyText) bc.push(bodyText);
    if (cardText) bc.push(cardText);

    return bc;
  }

  //
  // Validation
  //

  //
  // Util functions
  //

  /**
   * Returns true if a value is a TypeKeyValue or TypeKey type with a type in the given types
   *
   * @param value The value to check
   * @param validType The type or types to check, or undefined to check for any type
   * @returns True if the value is a TypeKeyValue or TypeKey type with a type in the given types, otherwise False.
   */
  private isType(value: unknown, validType?: TypeKeyType | TypeKeyType[]): boolean {
    if (!value) return false;
    const { type } = value as TypeValue;

    if (!validType) {
      return !!TypeKey.fromValue(type as TypeKeyType);
    }
    if (Array.isArray(validType)) {
      return validType.indexOf(type as TypeKeyType) >= 0;
    }

    return validType === type;
  }

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
      console.log(`===== START: ${header} =====`);
      console.log(JSON.stringify(data, null, 2));
      console.log(`===== END: ${header} =====`);
    }
  }

  //
  // Resource parsing
  //

  processResourceTags(resourceValue: any, extraProps: any[]) {
    const invalidResourceExtraProperties = ['type', 'key', 'value'];

    // Merge extra properties into the resource type (TODO = check if valid??)
    for (const p of extraProps) {
      if (!invalidResourceExtraProperties.includes(p.key)) {
        switch (p.key) {
          case ResourcePropertyKey.license:
          case ResourcePropertyKey.copyright:
          case ResourcePropertyKey.provider:
          case ResourcePropertyKey.caption:
          case ResourcePropertyKey.src1x:
          case ResourcePropertyKey.src2x:
          case ResourcePropertyKey.src3x:
          case ResourcePropertyKey.src4x:
          case ResourcePropertyKey.alt:
          case ResourcePropertyKey.duration:
            // Trim specific string properties - It might be better NOT to do this, but ANTLR parser does it
            resourceValue[p.key] = `${p.value ?? ''}`.trim();
            break;

          default:
            resourceValue[p.key] = p.value;
        }
      }
    }

    return resourceValue;
  }

  //
  // Card parsing
  //

  processCardSetStart() {
    this.cardIndex = 0;
    this.cardSideIndex = 0;
    this.cardVariantIndex = 0;
    this.cardSectionLineCount = 0;
    // console.log('CardSetStart');
  }

  processCardSetEnd() {
    this.cardIndex = 0;
    this.cardSideIndex = 0;
    this.cardVariantIndex = 0;
    this.cardSectionLineCount = 0;
    // console.log('CardSetEnd');
  }

  processCard() {
    this.cardIndex++;
    this.cardSideIndex = 0;
    this.cardVariantIndex = 0;
    this.cardSectionLineCount = 0;
    // console.log('processCard');
  }

  processPossibleCardLine(value: unknown) {
    let isSideDivider = false;
    let isVariantDivider = false;

    if (Array.isArray(value) && value.length === 2) {
      value = value[0];
      isSideDivider = value === '==';
      isVariantDivider = value === '--';
    }

    // This card section has no lines, so it's a special case blank
    const emptyCardOrSideOrVariant = this.cardSectionLineCount === 0;
    const currentSideIndex = this.cardSideIndex;
    const currentVariantIndex = this.cardVariantIndex;

    if (isSideDivider) {
      this.cardSideIndex++;
      this.cardVariantIndex = 0;
      this.cardSectionLineCount = 0;
      // console.log(`Card ${this.cardIndex} Side: ${value}`);
    } else if (isVariantDivider) {
      this.cardVariantIndex++;
      this.cardSectionLineCount = 0;
      // console.log(`Card ${this.cardIndex}, Side ${this.cardSideIndex}, Variant: ${this.cardVariantIndex}`);
    }

    if (emptyCardOrSideOrVariant) {
      // This card section has no lines, so it's a special case blank
      return {
        type: TypeKey.Card,
        value: {
          cardIndex: this.cardIndex,
          cardSideIndex: currentSideIndex,
          cardVariantIndex: currentVariantIndex,
          value: '',
        } as CardData,
      };
    }

    if (this.isType(value, TypeKey.Card)) return value;

    return undefined;
  }

  processCardLine(value: unknown) {
    this.cardSectionLineCount++;
    // console.log(
    //   `CardLine (Card ${this.cardIndex}, Side ${this.cardSideIndex}, Variant: ${this.cardVariantIndex}): ${value}`,
    // );
    return {
      type: TypeKey.Card,
      value: {
        cardIndex: this.cardIndex,
        cardSideIndex: this.cardSideIndex,
        cardVariantIndex: this.cardVariantIndex,
        value,
      } as CardData,
    };
  }

  /**
   * Reduce the data to type objects.
   *
   * The input data can have any structure. It will be reduced to an array of BitContent objects.
   *
   * @param data the data to reduce
   * @param validTypes types include in the reduced data
   * @param recurseIntoTypes set to true to reduce types which have array values
   * @returns an array of BitContent objects reduced from the input data
   */
  reduceToArrayOfTypes(data: unknown, validTypes?: TypeKeyType[], recurseIntoTypes?: boolean): BitContent[] {
    if (!Array.isArray(data)) return [];

    const res = data.reduce((acc, content, _index) => {
      if (content == null) return acc;
      const { type, value } = content as TypeValue;

      if (Array.isArray(content)) {
        // Not a TypeKeyValue - recurse
        const subValues = this.reduceToArrayOfTypes(content, validTypes);
        acc.push(...subValues);
      } else {
        if (!this.isType(content, validTypes)) return acc;

        if (recurseIntoTypes && Array.isArray(value)) {
          // Not a TypeKeyValue - recurse
          const subValues = this.reduceToArrayOfTypes(value, validTypes);
          acc.push(...subValues);
        } else if (type) {
          acc.push(content);
        }
      }

      return acc;
    }, [] as BitContent[]);

    return res;
  }
}

export { BitmarkParserHelper, TypeKey };
