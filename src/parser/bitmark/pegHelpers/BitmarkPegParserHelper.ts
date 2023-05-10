/**
 * BitmarkPegParserProcessor.ts
 * v0.0.1
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

/* eslint-disable @typescript-eslint/no-explicit-any */

import { ResourcePropertyKey } from '../../../model/enum/ResourcePropertyKey';
import { ParserError } from '../../../model/parser/ParserError';

// Debugging flags for helping develop and debug the parser
const ENABLE_DEBUG = true;
const DEBUG_DATA = true; // Include data in the debug output
const DEBUG_DATA_INCLUDE_PARSER = false; // Include the parser data in the debug output - very very verbose!
const DEBUG_TRACE_TEXT_FORMAT = false; // The bit text format (e.g. bitmark++)
const DEBUG_TRACE_RESOURCE_TYPE = false; // The bit resource type (e.g. &image)
const DEBUG_TRACE_BIT_CONTENT = false; // The content of the bit - verbose if a lot of body text
const DEBUG_TRACE_STANDARD_TAGS_CHAIN = false; // Top level tag chains
const DEBUG_TRACE_BIT_TAG = false; // Top level tags
const DEBUG_TRACE_CARD_SET = false; // The content of the card set
const DEBUG_TRACE_CARD_SET_START = false; // Start of a card set
const DEBUG_TRACE_CARD_SET_END = false; // End of a card set
const DEBUG_TRACE_CARD_LINE_OR_DIVIDER = false; // A card line or a card divider (=== / == / --)
const DEBUG_TRACE_CARD_CONTENT = true; // The content of the card - verbose if a lot of card body text
const DEBUG_TRACE_CARD_TAGS = false; // Tags within the content of a card
const DEBUG_TRACE_RESOURCE_TAGS_CHAIN = false; // Resource tags chain
const DEBUG_TRACE_RESOURCE = false; // Resource tag
const DEBUG_TRACE_RESOURCE_PROPERTY = false; // Resource property tag
const DEBUG_TRACE_GAP_CHAIN = false; // Gap tag chain
const DEBUG_TRACE_TRUE_FALSE_CHAIN = false; // True/False tag chain
const DEBUG_TRACE_TAGS = false; // Standard tags
const DEBUG_TRACE_PROPERTY_TAGS = false; // Standard property tags

// DO NOT EDIT THIS LINE. Ensures no debug in production in case ENABLE_DEBUG is accidentally left on
const DEBUG = ENABLE_DEBUG && process.env.NODE_ENV === 'development';

import {
  BitContent,
  CARD_DIVIDER,
  CARD_SIDE_DIVIDER,
  CARD_VARIANT_DIVIDER,
  CardData,
  ParserHelperOptions,
  TypeKey,
  TypeKeyType,
  TypeValue,
} from './BitmarkPegParserTypes';

class BitmarkPegParserHelper {
  private cardIndex = 0;
  private cardSideIndex = 0;
  private cardVariantIndex = 0;

  private parserText: () => ParserError['text'];
  private parserLocation: () => ParserError['location'];

  constructor(options: ParserHelperOptions) {
    this.parserText = options.parserText;
    this.parserLocation = options.parserLocation;
  }

  //
  // PARSING
  //

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

  handleStandardTagsChain(value: unknown): BitContent[] {
    if (DEBUG_TRACE_STANDARD_TAGS_CHAIN) this.debugPrint('StandardTagsChain', value);
    return this.reduceToArrayOfTypes(value);
  }

  handleBitTag(value: BitContent): BitContent {
    if (DEBUG_TRACE_BIT_TAG) this.debugPrint('BitTag', value);
    return value;
  }

  //
  // Card parsing
  //

  handleCardSet(value: unknown): BitContent {
    if (DEBUG_TRACE_CARD_SET) this.debugPrint(TypeKey.CardSet, value);
    return {
      type: TypeKey.CardSet,
      value,
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

  handleCardLineOrDivider(value: unknown) {
    if (DEBUG_TRACE_CARD_LINE_OR_DIVIDER) this.debugPrint('CardLineOrDivider', value);

    let isCardDivider = false;
    let isSideDivider = false;
    let isVariantDivider = false;

    if (Array.isArray(value) && value.length === 2) {
      value = value[0];
      isCardDivider = value === CARD_DIVIDER;
      isSideDivider = value === CARD_SIDE_DIVIDER;
      isVariantDivider = value === CARD_VARIANT_DIVIDER;
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
  // Resource parsing
  //

  handleResourceTagsChain(resourceValue: any, extraProps: any[]) {
    if (DEBUG_TRACE_RESOURCE_TAGS_CHAIN) this.debugPrint('ResourceTagsChain', [resourceValue, ...extraProps]);

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

  handleReourceTag(key: string, value: unknown): BitContent {
    if (DEBUG_TRACE_RESOURCE) this.debugPrint(TypeKey.Resource, { key, value });

    // console.log('ResourceTag');
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

  handleReourcePropertyTag(key: string, value: unknown): BitContent {
    if (DEBUG_TRACE_RESOURCE_PROPERTY) this.debugPrint(TypeKey.ResourceProperty, { key, value });

    return {
      type: TypeKey.ResourceProperty,
      key,
      value,
      parser: {
        text: this.parserText(),
        location: this.parserLocation(),
      },
    };
  }

  //
  // Tag Chain parsing
  //

  handleGapChainTags(value: unknown): BitContent {
    if (DEBUG_TRACE_GAP_CHAIN) this.debugPrint(TypeKey.GapChain, value);

    return {
      type: TypeKey.GapChain,
      value,
      parser: {
        text: this.parserText(),
        location: this.parserLocation(),
      },
    };
  }

  handleTrueFalseChainTags(value: unknown): BitContent {
    if (DEBUG_TRACE_TRUE_FALSE_CHAIN) this.debugPrint(TypeKey.TrueFalseChain, value);

    return {
      type: TypeKey.TrueFalseChain,
      value,
      parser: {
        text: this.parserText(),
        location: this.parserLocation(),
      },
    };
  }

  //
  // Tags parsing
  //

  handleTag(type: TypeKeyType, value: unknown): BitContent {
    if (DEBUG_TRACE_TAGS) this.debugPrint(type, value);

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

  /**
   * Print out data for debugging
   *
   * @param header
   * @param data
   */
  debugPrint(header: string, data?: unknown): void {
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
  }
}

export { BitmarkPegParserHelper };
