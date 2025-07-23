/**
 * BitmarkPegParserProcessor.ts
 * RA Sewell
 *
 * (c) 2023 Get More Brain AG
 * All rights reserved.
 *
 *
 * Debugging and Development
 * -------------------------
 *
 * - To build the parser, run 'yarn build-grammar-bit'
 * - Modify the bitmark in '_simple.bitmark' to test the parser (this will be parsed after building the parser)
 * - To undersand the operation and to help debug and develop, use the DEBUG_XXX flags in the code below
 *   and in BitmarkPegParserProcessor.ts
 *
 */

import '../../../config/Config.ts';

import { Breakscape } from '../../../breakscaping/Breakscape.ts';
import { type BreakscapedString } from '../../../model/ast/BreakscapedString.ts';
import { type Bit } from '../../../model/ast/Nodes.ts';
import { CardSetVersion } from '../../../model/enum/CardSetVersion.ts';
import { Tag } from '../../../model/enum/Tag.ts';
import { TextFormat } from '../../../model/enum/TextFormat.ts';
import { TextLocation } from '../../../model/enum/TextLocation.ts';
import { type ParserError } from '../../../model/parser/ParserError.ts';
import { type ParserLocation } from '../../../model/parser/ParserLocation.ts';
import { StringUtils } from '../../../utils/StringUtils.ts';
import {
  type ParsedCard,
  type ParsedCardSet,
  type ParsedCardSide,
  type ParseFunction,
  type SubParserResult,
  type UnparsedCardSet,
} from './BitmarkPegParserTypes.ts';
import {
  type BitContent,
  CARD_DIVIDER_V1,
  CARD_DIVIDER_V2,
  CARD_SIDE_DIVIDER_V1,
  CARD_SIDE_DIVIDER_V2,
  CARD_VARIANT_DIVIDER_V1,
  CARD_VARIANT_DIVIDER_V2,
  type CardData,
  type ParserHelperOptions,
  TypeKey,
  type TypeKeyType,
  type TypeValue,
} from './BitmarkPegParserTypes.ts';
import { PeggyGrammarLocation } from './PeggyGrammarLocation.ts';

const ENABLE_DEBUG = true;
const DEBUG_DATA = true;
const DEBUG_DATA_INCLUDE_PARSER = false;
const DEBUG_TRACE_RAW_BIT = true;
const DEBUG_TRACE_TEXT_FORMAT = false;
const DEBUG_TRACE_RESOURCE_TYPE = false;
const DEBUG_TRACE_BIT_CONTENT = false;
const DEBUG_TRACE_BIT_TAG = false;
const DEBUG_TRACE_TAGS = false;
const DEBUG_TRACE_PROPERTY_TAGS = false;
const DEBUG_TRACE_RESOURCE_TAGS = false;
const DEBUG_TRACE_TAGS_CHAIN = false;
const DEBUG_TRACE_CARD_SET = false;
const DEBUG_TRACE_CARD_SET_START = false;
const DEBUG_TRACE_CARD_SET_END = false;
const DEBUG_TRACE_CARD_LINE_OR_DIVIDER = false;
const DEBUG_TRACE_CARD_CONTENT = false;
const DEBUG_TRACE_CARD_TAGS = false;
const DEBUG_TRACE_CARD_PARSED = true; // Print the parsed card (will create a lot of output if card value is large)
const DEBUG = ENABLE_DEBUG && process.env.BPG_ENV === 'development';

class BitmarkPegParserHelper {
  private cardIndex = 0;
  private cardSideIndex = 0;
  private cardVariantIndex = 0;

  private parse: ParseFunction;
  private parserText: () => ParserError['text'];
  private parserLocation: () => ParserError['location'];

  constructor(options: ParserHelperOptions) {
    this.parse = options.parse;
    this.parserText = options.parserText;
    this.parserLocation = options.parserLocation;
  }

  //
  // PARSING
  //

  handleRawBit(rawBit: string): SubParserResult<Bit> | undefined {
    const rawBitTrimmed = rawBit.trim();

    if (DEBUG_TRACE_RAW_BIT) this.debugPrint('RAW BIT', rawBitTrimmed);

    // Ignore empty bits (only happens if entire file is empty / whitespace only
    if (!rawBitTrimmed) return undefined;

    // Get current parser location
    const location = this.parserLocation()?.start ?? {
      line: 1,
      column: 1,
      offset: 0,
    };

    // Parse the raw bit
    const bitParserResult = this.parse(rawBit, {
      startRule: 'bit',
      grammarSource: new PeggyGrammarLocation('bit', location),
    }) as SubParserResult<Bit>;

    // Add markup to the bit result
    if (bitParserResult.value) bitParserResult.value.markup = rawBitTrimmed;

    return bitParserResult;
  }

  handleTextFormat(value: unknown): BitContent {
    if (DEBUG_TRACE_TEXT_FORMAT) this.debugPrint(TypeKey.TextFormat, value);
    return {
      type: TypeKey.TextFormat,
      value,
      parser: {
        text: this.parserText(),
        location: this.parserLocation(),
      },
    };
  }

  handleResourceType(value: unknown): BitContent {
    if (DEBUG_TRACE_RESOURCE_TYPE) this.debugPrint(TypeKey.ResourceType, value);
    return {
      type: TypeKey.ResourceType,
      value,
      parser: {
        text: this.parserText(),
        location: this.parserLocation(),
      },
    };
  }

  handleBitContent(value: unknown): BitContent[] {
    if (DEBUG_TRACE_BIT_CONTENT) this.debugPrint('BitContent', value);

    let content = this.reduceToArrayOfTypes(value);

    // Merge the BodyChar to BodyText
    content = this.mergeCharToText(content);

    return content;
  }

  //
  // Bit tags parsing
  //

  handleBitTag(value: BitContent): BitContent {
    if (DEBUG_TRACE_BIT_TAG) this.debugPrint('BitTag', value);
    return value;
  }

  handleTag(type: TypeKeyType, value: unknown): BitContent {
    if (DEBUG_TRACE_TAGS) this.debugPrint(type, { value });

    // if (type === TypeKey.Comment) {
    //   debugger;
    // }

    return {
      type,
      key: Tag.fromValue(type),
      value,
      parser: {
        text: this.parserText(),
        location: this.parserLocation(),
      },
    };
  }

  handlePropertyTag(key: BreakscapedString, value: unknown): BitContent {
    if (DEBUG_TRACE_PROPERTY_TAGS) this.debugPrint(TypeKey.Property, { key, value });

    return {
      type: TypeKey.Property,
      key: `@${Breakscape.unbreakscape(key, {
        format: TextFormat.plainText,
        location: TextLocation.tag,
      })}`,
      value,
      parser: {
        text: this.parserText(),
        location: this.parserLocation(),
      },
    };
  }

  handleResourceTag(key: BreakscapedString, value: unknown): BitContent {
    if (DEBUG_TRACE_RESOURCE_TAGS) this.debugPrint(TypeKey.Resource, { key, value });

    const uKey = Breakscape.unbreakscape(key, {
      format: TextFormat.plainText,
      location: TextLocation.tag,
    });
    const camelKey = StringUtils.kebabToCamel(uKey);

    return {
      type: TypeKey.Resource,
      key: `&${camelKey}`,
      value,
      parser: {
        text: this.parserText(),
        location: this.parserLocation(),
      },
    };
  }

  handleTagChain(value: unknown): BitContent[] {
    if (DEBUG_TRACE_TAGS_CHAIN) this.debugPrint('TagsChain', value);
    const content = this.reduceToArrayOfTypes(value);
    let newContent: BitContent[] = content;

    if (content.length > 1) {
      const head = content[0];
      head.chain = content.slice(1);
      newContent = [head];
    }

    return newContent;
  }

  //
  // Divider parsing
  //

  // Plain text divider
  handlePlainTextDivider(value: unknown): BitContent {
    value = this.reduceToString(value);

    return {
      type: TypeKey.PlainTextDivider,
      value,
      parser: {
        text: this.parserText(),
        location: this.parserLocation(),
      },
    };
  }

  // Footer divider
  handleFooterDivider(value: unknown): BitContent {
    value = this.reduceToString(value);

    return {
      type: TypeKey.FooterDivider,
      value,
      parser: {
        text: this.parserText(),
        location: this.parserLocation(),
      },
    };
  }

  //
  // Card parsing
  //

  handleCardSet(value: unknown): BitContent {
    if (DEBUG_TRACE_CARD_SET) this.debugPrint(TypeKey.CardSet, value);

    // Build card set
    const cards = value as BitContent[];
    const unparsedCardSet: UnparsedCardSet = {
      cards: [],
    };
    const cardSet: ParsedCardSet = {
      cards: [],
    };

    if (cards) {
      // Get current parser location
      const parser = {
        text: this.parserText(),
        location: this.parserLocation(),
      };

      for (const content of cards) {
        if (!content) continue;
        const { type, value: cardData, parser } = content as TypeValue;
        if (!type || type !== TypeKey.Card) continue;
        const {
          cardIndex,
          cardSideIndex,
          cardVariantIndex: cardContentIndex,
          value,
        } = cardData as CardData;

        // Get or create card
        let card = unparsedCardSet.cards[cardIndex];
        if (!card) {
          card = {
            sides: [],
          };
          unparsedCardSet.cards[cardIndex] = card;
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
          side.variants[cardContentIndex] = {
            value,
            parser,
          };
        } else {
          side.variants[cardContentIndex].value += value;
        }
      }

      // Remove any completely empty cards
      unparsedCardSet.cards = unparsedCardSet.cards.filter((card) => {
        return card.sides.some((side) => {
          return side.variants.some((variant) => {
            const trimmed = StringUtils.trimmedString(variant.value);
            return trimmed.length !== 0;
          });
        });
      });

      // Parse the card data
      for (const unparsedCard of unparsedCardSet.cards) {
        const card = {
          sides: [],
        } as ParsedCard;
        cardSet.cards.push(card);
        for (const unparsedSide of unparsedCard.sides) {
          const side = {
            variants: [],
          } as ParsedCardSide;
          card.sides.push(side);
          for (const unparsedContent of unparsedSide.variants) {
            // Get current parser location
            // It must be modified by the length of the divider to be correct as the text in 'unparsedContent.value'
            // have the divider removed.
            let location: ParserLocation = {
              line: 1,
              column: 1,
              offset: 0,
            };
            if (unparsedContent.parser.location) {
              location = unparsedContent.parser.location.start;
              const text = unparsedContent.parser.text;
              const offsetCorrection = text ? text.length : 0;
              const lineCorrection = 1;
              location.offset += offsetCorrection;
              location.line += lineCorrection;
            }

            // Run the parser on the card content
            let content = this.parse(unparsedContent.value, {
              startRule: 'cardContent',
              grammarSource: new PeggyGrammarLocation('card-content', location),
            }) as BitContent[];

            content = this.reduceToArrayOfTypes(content);

            if (DEBUG_TRACE_CARD_PARSED) this.debugPrint('parsedCardContent', content);

            side.variants.push({
              parser,
              content,
            });
          }
        }
      }
    }

    return {
      type: TypeKey.CardSet,
      value: cardSet,
      parser: {
        text: this.parserText(),
        location: this.parserLocation(),
      },
    };
  }

  handleCardSetStart() {
    if (DEBUG_TRACE_CARD_SET_START) this.debugPrint('CardSetStart');

    this.cardIndex = -1; // Incremented by first card divider to 0 for first card
    this.cardSideIndex = 0;
    this.cardVariantIndex = 0;
  }

  handleCardSetEnd() {
    if (DEBUG_TRACE_CARD_SET_END) this.debugPrint('CardSetEnd');
    // console.log('CardSetEnd');
    this.cardIndex = 0;
    this.cardSideIndex = 0;
    this.cardVariantIndex = 0;
  }

  handleCards(value: unknown): unknown {
    // console.log('Cards');
    return value;
  }

  handleCardLineOrDivider(value: unknown, version: number) {
    if (DEBUG_TRACE_CARD_LINE_OR_DIVIDER) this.debugPrint('CardLineOrDivider', value);

    let isCardDivider = false;
    let isSideDivider = false;
    let isVariantDivider = false;

    if (Array.isArray(value) && value.length === 2) {
      value = value[0];
      if (version === CardSetVersion.v1) {
        isCardDivider = value === CARD_DIVIDER_V1;
        isSideDivider = value === CARD_SIDE_DIVIDER_V1;
        isVariantDivider = value === CARD_VARIANT_DIVIDER_V1;
      } else {
        isCardDivider = value === CARD_DIVIDER_V2;
        isSideDivider = value === CARD_SIDE_DIVIDER_V2;
        isVariantDivider = value === CARD_VARIANT_DIVIDER_V2;
      }
    }

    if (isCardDivider) {
      this.cardIndex++;
      this.cardSideIndex = 0;
      this.cardVariantIndex = 0;
    } else if (isSideDivider) {
      this.cardSideIndex++;
      this.cardVariantIndex = 0;
      // console.log(`Card ${this.cardIndex} Side: ${value}`);
    } else if (isVariantDivider) {
      this.cardVariantIndex++;
      // console.log(`Card ${this.cardIndex}, Side ${this.cardSideIndex}, Variant: ${this.cardVariantIndex}`);
    }

    if (this.isType(value, TypeKey.Card)) return value;

    return {
      type: TypeKey.Card,
      value: {
        cardIndex: this.cardIndex,
        cardSideIndex: this.cardSideIndex,
        cardVariantIndex: this.cardVariantIndex,
        value: '',
      } as CardData,
      parser: {
        text: this.parserText(),
        location: this.parserLocation(),
      },
    };
  }

  handleCardLine(value: unknown) {
    if (DEBUG_TRACE_CARD_LINE_OR_DIVIDER) {
      this.debugPrint(
        'CardLine',
        `(Card ${this.cardIndex}, Side ${this.cardSideIndex}, Variant: ${this.cardVariantIndex}): ${value}`,
      );
    }

    return {
      type: TypeKey.Card,
      value: {
        cardIndex: this.cardIndex,
        cardSideIndex: this.cardSideIndex,
        cardVariantIndex: this.cardVariantIndex,
        value,
      } as CardData,
      parser: {
        text: this.parserText(),
        location: this.parserLocation(),
      },
    };
  }

  handleCardContent(value: BitContent[]): BitContent[] {
    if (DEBUG_TRACE_CARD_CONTENT) this.debugPrint('CardContent', value);

    // Merge the BodyChar to BodyText
    const content = this.mergeCharToText(value);

    return content;
  }

  handleCardTags(value: unknown): unknown {
    if (DEBUG_TRACE_CARD_TAGS) this.debugPrint('CardTags', value);

    return value;
  }

  //
  // Util functions
  //

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
            bodyText = {
              type: TypeKey.BodyText,
              value: c.value ?? '',
              parser: {
                text: this.parserText(),
                location: this.parserLocation(),
              },
            };
          }
          break;
        }

        case TypeKey.CardChar: {
          if (cardText) {
            const val = `${cardText.value ?? ''}${c.value ?? ''}`;
            cardText.value = val;
          } else {
            cardText = {
              type: TypeKey.CardText,
              value: c.value ?? '',
              parser: {
                text: this.parserText(),
                location: this.parserLocation(),
              },
            };
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
   * Reduce the data to type objects.
   *
   * The input data can have any structure. It will be reduced to an array of BitContent objects.
   *
   * @param data the data to reduce
   * @param validTypes types include in the reduced data
   * @param recurseIntoTypes set to true to reduce types which have array values
   * @returns an array of BitContent objects reduced from the input data
   */
  private reduceToArrayOfTypes(
    data: unknown,
    validTypes?: TypeKeyType[],
    recurseIntoTypes?: boolean,
  ): BitContent[] {
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

  /**
   * Reduce the data to a string.
   *
   * The input data can have any nested array structure. It will be reduced to a single string.
   *
   * @param data the data to reduce
   * @returns a string concatenated from all the string values in the input data
   */
  private reduceToString(data: unknown): string {
    if (!Array.isArray(data)) return '';

    const res = data.reduce((acc, content, _index) => {
      if (content == null) return acc;

      if (Array.isArray(content)) {
        // An array - recurse
        const subValue = this.reduceToString(content);
        acc += subValue;
      } else {
        acc += content;
      }

      return acc;
    }, [] as BitContent[]);

    return res;
  }

  /**
   * Print out data for debugging
   *
   * @param header
   * @param data
   */
  private debugPrint(header: string, data?: unknown): void {
    /* STRIP:START */
    if (DEBUG) {
      if (DEBUG_DATA) {
        // Strip 'parser' out of the data, otherwise it is too verbose
        if (!DEBUG_DATA_INCLUDE_PARSER) {
          if (data != undefined) {
            data = JSON.parse(JSON.stringify(data, (k, v) => (k === 'parser' ? undefined : v)));
          }
        }

        console.log(`----- TRACE: ${header} -----`);
        console.log(JSON.stringify(data, null, 2));
        console.log(`----- END: ${header} -----`);
      } else {
        console.log(`- TRACE: ${header}`);
      }
    }
    /* STRIP:END */
  }
}

export { BitmarkPegParserHelper };
