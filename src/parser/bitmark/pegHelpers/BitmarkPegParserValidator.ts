/**
 * BitmarkPegParserValidator.ts
 * RA Sewell
 *
 * (c) 2023 Get More Brain AG
 * All rights reserved.
 *
 */

import { BitTypeType } from '../../../model/enum/BitType';

import {
  BitContent,
  BitContentLevel,
  BitContentLevelType,
  BitmarkPegParserContext,
  TypeKey,
} from './BitmarkPegParserTypes';

const COMMON_MISTAKE_STRINGS = [
  // Card divider errors
  '====',
  '----',
  '\n==\n',
  '\n---\n',
  '\n--\n',
  // Remark errors
  ':::',
  '::::',
  // Comment errors
  '|||',
  '||||',
];

const COMMON_STARTS_WITH_MISTAKE_STRINGS = [
  // Card divider errors
  '==\n',
  '---\n',
  '--\n',
];

const COMMON_ENDS_WITH_MISTAKE_STRINGS = [
  // Card divider errors
  '\n==',
  '\n---',
  '\n--',
];

class BitmarkPegParserValidator {
  validateBitContent(
    context: BitmarkPegParserContext,
    bitLevel: BitContentLevelType,
    bitType: BitTypeType,
    data: BitContent[],
  ): void {
    switch (bitLevel) {
      case BitContentLevel.Bit:
        this.validateBit(context, bitLevel, bitType, data);
        break;
      case BitContentLevel.Statement:
        this.validateStatement(context, bitLevel, bitType, data);
        break;
      case BitContentLevel.Choice:
        this.validateChoice(context, bitLevel, bitType, data);
        break;
      case BitContentLevel.Response:
        this.validateResponse(context, bitLevel, bitType, data);
        break;
      case BitContentLevel.GapChain:
        this.validateGapChain(context, bitLevel, bitType, data);
        break;
      case BitContentLevel.HighlightChain:
        this.validateHighlightChain(context, bitLevel, bitType, data);
        break;
      case BitContentLevel.SelectChain:
        this.validateSelectChain(context, bitLevel, bitType, data);
        break;
      case BitContentLevel.CardElement:
        this.validateCardElement(context, bitLevel, bitType, data);
        break;
      case BitContentLevel.CardStatements:
        this.validateCardStatements(context, bitLevel, bitType, data);
        break;
      case BitContentLevel.CardQuiz:
        this.validateCardQuiz(context, bitLevel, bitType, data);
        break;
      case BitContentLevel.CardQuestion:
        this.validateCardQuestion(context, bitLevel, bitType, data);
        break;
      case BitContentLevel.CardMatch:
        this.validateCardMatch(context, bitLevel, bitType, data);
        break;
      case BitContentLevel.CardMatrix:
        this.validateCardMatrix(context, bitLevel, bitType, data);
        break;
      case BitContentLevel.CardBotResponse:
        this.validateCardBotResponse(context, bitLevel, bitType, data);
        break;
      default:
      // Do nothing
    }
  }

  validateCardSetRequired(
    context: BitmarkPegParserContext,
    bitLevel: BitContentLevelType,
    bitType: BitTypeType,
    cardSet: BitContent[] | undefined,
    required: boolean,
  ): void {
    if (cardSet && !required) {
      const parserData = Array.isArray(cardSet) && cardSet.length > 0 ? cardSet[0] : undefined;
      context.addWarning(`Bit '${bitType}' should not have a card set. It will be ignored`, parserData);
    } else if (!cardSet && required) {
      context.addWarning(`Bit '${bitType}' is missing the card set`);
    }
  }

  checkBodyForCommonPotentialMistakes(
    context: BitmarkPegParserContext,
    bitLevel: BitContentLevelType,
    bitType: BitTypeType,
    body: string,
  ): void {
    if (!body) return;

    for (const mistake of COMMON_MISTAKE_STRINGS) {
      if (body.includes(mistake)) {
        context.addWarning(`Bit '${bitType}' contains a potential mistake: ${mistake}`);
      }
    }

    for (const mistake of COMMON_STARTS_WITH_MISTAKE_STRINGS) {
      if (body.startsWith(mistake)) {
        context.addWarning(`Bit '${bitType}' contains a potential mistake: ${mistake}`);
      }
    }

    for (const mistake of COMMON_ENDS_WITH_MISTAKE_STRINGS) {
      if (body.endsWith(mistake)) {
        context.addWarning(`Bit '${bitType}' contains a potential mistake: ${mistake}`);
      }
    }
  }

  private validateBit(
    context: BitmarkPegParserContext,
    bitLevel: BitContentLevelType,
    bitType: BitTypeType,
    data: BitContent[],
  ): void {
    this.checkForUnallowedDuplicates(context, bitLevel, bitType, data);
  }

  private validateStatement(
    context: BitmarkPegParserContext,
    bitLevel: BitContentLevelType,
    bitType: BitTypeType,
    data: BitContent[],
  ): void {
    this.checkForUnallowedDuplicates(context, bitLevel, bitType, data);
  }

  private validateChoice(
    context: BitmarkPegParserContext,
    bitLevel: BitContentLevelType,
    bitType: BitTypeType,
    data: BitContent[],
  ): void {
    this.checkForUnallowedDuplicates(context, bitLevel, bitType, data);
  }

  private validateResponse(
    context: BitmarkPegParserContext,
    bitLevel: BitContentLevelType,
    bitType: BitTypeType,
    data: BitContent[],
  ): void {
    this.checkForUnallowedDuplicates(context, bitLevel, bitType, data);
  }

  private validateGapChain(
    context: BitmarkPegParserContext,
    bitLevel: BitContentLevelType,
    bitType: BitTypeType,
    data: BitContent[],
  ): void {
    this.checkForUnallowedDuplicates(context, bitLevel, bitType, data);
  }

  private validateHighlightChain(
    context: BitmarkPegParserContext,
    bitLevel: BitContentLevelType,
    bitType: BitTypeType,
    data: BitContent[],
  ): void {
    this.checkForUnallowedDuplicates(context, bitLevel, bitType, data);
  }

  private validateSelectChain(
    context: BitmarkPegParserContext,
    bitLevel: BitContentLevelType,
    bitType: BitTypeType,
    data: BitContent[],
  ): void {
    this.checkForUnallowedDuplicates(context, bitLevel, bitType, data);
  }

  private validateCardElement(
    context: BitmarkPegParserContext,
    bitLevel: BitContentLevelType,
    bitType: BitTypeType,
    data: BitContent[],
  ): void {
    this.checkForUnallowedDuplicates(context, bitLevel, bitType, data);
  }

  private validateCardStatements(
    context: BitmarkPegParserContext,
    bitLevel: BitContentLevelType,
    bitType: BitTypeType,
    data: BitContent[],
  ): void {
    this.checkForUnallowedDuplicates(context, bitLevel, bitType, data);
  }

  private validateCardQuiz(
    context: BitmarkPegParserContext,
    bitLevel: BitContentLevelType,
    bitType: BitTypeType,
    data: BitContent[],
  ): void {
    this.checkForUnallowedDuplicates(context, bitLevel, bitType, data);
  }

  private validateCardQuestion(
    context: BitmarkPegParserContext,
    bitLevel: BitContentLevelType,
    bitType: BitTypeType,
    data: BitContent[],
  ): void {
    this.checkForUnallowedDuplicates(context, bitLevel, bitType, data);
  }

  private validateCardMatch(
    context: BitmarkPegParserContext,
    bitLevel: BitContentLevelType,
    bitType: BitTypeType,
    data: BitContent[],
  ): void {
    this.checkForUnallowedDuplicates(context, bitLevel, bitType, data);
  }

  private validateCardMatrix(
    context: BitmarkPegParserContext,
    bitLevel: BitContentLevelType,
    bitType: BitTypeType,
    data: BitContent[],
  ): void {
    this.checkForUnallowedDuplicates(context, bitLevel, bitType, data);
  }

  private validateCardBotResponse(
    context: BitmarkPegParserContext,
    bitLevel: BitContentLevelType,
    bitType: BitTypeType,
    data: BitContent[],
  ): void {
    this.checkForUnallowedDuplicates(context, bitLevel, bitType, data);
  }

  //
  // Generic
  //

  private checkForUnallowedDuplicates(
    context: BitmarkPegParserContext,
    bitLevel: BitContentLevelType,
    bitType: BitTypeType,
    data: BitContent[],
  ): void {
    const foundTypes: { [key: string]: BitContent } = {};
    let haveItem = false;

    // Loop the data checking for invalid duplicates
    data.forEach((content, _index) => {
      const { type } = content;
      let tag = type;

      switch (type) {
        // There should not be a 3rd [%] tag
        case TypeKey.ItemLead: {
          tag = haveItem ? 'Lead' : 'Item';
          if (Object.prototype.hasOwnProperty.call(foundTypes, tag)) {
            const existing = foundTypes[tag];
            const current = content;
            context.addWarning(`Duplicate '${tag}' tag found`, current, existing);
          }
          haveItem = true;
          break;
        }

        // These types should not be repeated
        case TypeKey.Instruction:
        case TypeKey.Hint:
        case TypeKey.Anchor:
        case TypeKey.Reference:
        case TypeKey.SampleSolution: {
          if (Object.prototype.hasOwnProperty.call(foundTypes, tag)) {
            const existing = foundTypes[tag];
            const current = content;
            context.addWarning(`Duplicate '${tag}' tag found`, current, existing);
          }
          break;
        }

        default:
        // Do nothing
      }

      foundTypes[tag] = content;
    });
  }
}

const instance = new BitmarkPegParserValidator();

export { instance as BitmarkPegParserValidator };
