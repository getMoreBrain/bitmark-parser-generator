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
 * - Modify the bitmark in '_simple.bit' to test the parser (this will be parsed after building the parser)
 * - To undersand the operation and to help debug and develop, use the DEBUG_XXX flags in the code below
 *   and in BitmarkPegParserProcessor.ts
 *
 */

import { Bit } from '../../../model/ast/Nodes';
import { ParserError } from '../../../model/parser/ParserError';

import {
  ParseFunction,
  ParsedCard,
  ParsedCardSet,
  ParsedCardSide,
  SubParserResult,
  UnparsedCardSet,
} from './BitmarkPegParserTypes';
import {
  BitContent,
  CARD_DIVIDER_V2,
  CARD_SIDE_DIVIDER_V1,
  CARD_VARIANT_DIVIDER_V1,
  CARD_DIVIDER_V1,
  CARD_VARIANT_DIVIDER_V2,
  CARD_SIDE_DIVIDER_V2,
  CardData,
  ParserHelperOptions,
  TypeKey,
  TypeKeyType,
  TypeValue,
} from './BitmarkPegParserTypes';

import '../../../config/config';

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

// Dummy for stripping unwanted code
const STRIP = 0;

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

    // Parse the raw bit
    const bitParserResult = this.parse(rawBit, {
      startRule: 'bit',
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
    if (DEBUG_TRACE_TAGS) this.debugPrint(type, value);

    // if (type === TypeKey.Comment) {
    //   debugger;
    // }

    return {
      type,
      value,
      parser: {
        text: this.parserText(),
        location: this.parserLocation(),
      },
    };
  }

  handlePropertyTag(key: string, value: unknown): BitContent {
    if (DEBUG_TRACE_PROPERTY_TAGS) this.debugPrint(TypeKey.Property, { key, value });

    return {
      type: TypeKey.Property,
      key,
      value,
      parser: {
        text: this.parserText(),
        location: this.parserLocation(),
      },
    };
  }

  handleResourceTag(key: string, value: unknown): BitContent {
    if (DEBUG_TRACE_RESOURCE_TAGS) this.debugPrint(TypeKey.Resource, { key, value });

    return {
      type: TypeKey.Resource,
      key,
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
      for (const content of cards) {
        if (!content) continue;
        const { type, value: cardData } = content as TypeValue;
        if (!type || type !== TypeKey.Card) continue;
        const { cardIndex, cardSideIndex, cardVariantIndex: cardContentIndex, value } = cardData as CardData;

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
          side.variants[cardContentIndex] = value;
        } else {
          side.variants[cardContentIndex] += value;
        }
      }

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
          for (const rawContent of unparsedSide.variants) {
            let content = this.parse(rawContent, {
              startRule: 'cardContent',
            }) as BitContent[];

            content = this.reduceToArrayOfTypes(content);

            if (DEBUG_TRACE_CARD_PARSED) this.debugPrint('parsedCardContent', content);

            side.variants.push(content);
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
      if (version === 1) {
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
  private reduceToArrayOfTypes(data: unknown, validTypes?: TypeKeyType[], recurseIntoTypes?: boolean): BitContent[] {
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
   * Print out data for debugging
   *
   * @param header
   * @param data
   */
  private debugPrint(header: string, data?: unknown): void {
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

        console.log(`----- TRACE: ${header} -----`);
        console.log(JSON.stringify(data, null, 2));
        console.log(`----- END: ${header} -----`);
      } else {
        console.log(`- TRACE: ${header}`);
      }
    }

    /* STRIP:END */
    STRIP;
  }
}

export { BitmarkPegParserHelper };
