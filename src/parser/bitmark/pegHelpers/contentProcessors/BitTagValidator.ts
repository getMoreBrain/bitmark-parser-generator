/* eslint-disable @typescript-eslint/no-explicit-any */
import { Builder } from '../../../../ast/Builder';
import { CardSet } from '../../../../model/ast/CardSet';
import { BitType, BitTypeMetadata, BitTypeType } from '../../../../model/enum/BitType';
import { CardSetType } from '../../../../model/enum/CardSetType';
import { ResourceType } from '../../../../model/enum/ResourceType';
import { BitmarkPegParserValidator } from '../BitmarkPegParserValidator';

import {
  AudioResource,
  BotResponse,
  Choice,
  Heading,
  ImageResource,
  Matrix,
  MatrixCell,
  Pair,
  Question,
  Quiz,
  Response,
  Statement,
} from '../../../../model/ast/Nodes';
import {
  BitContent,
  BitContentLevel,
  BitContentLevelType,
  BitSpecificCards,
  BitmarkPegParserContext,
  CardData,
  TypeKey,
  TypeValue,
} from '../BitmarkPegParserTypes';

const builder = new Builder();

function validateBitTags(
  context: BitmarkPegParserContext,
  bitLevel: BitContentLevelType,
  bitType: BitTypeType,
  data: BitContent[],
): BitSpecificCards {
  // if (context.DEBUG_BIT_TAG_VALIDATION) context.debugPrint('bit tag validation', data);

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

  if (context.DEBUG_CARD_SET) context.debugPrint('card set', cardSet);

  // Parse the card contents
  let result: BitSpecificCards = {};

  // Get the bit metadata to check how to parse the card set
  const meta = BitType.getMetadata<BitTypeMetadata>(bitType) ?? {};
  const cardSetType = meta.cardSetType;

  switch (cardSetType) {
    case CardSetType.elements:
      result = parseElements(context, bitType, cardSet);
      break;

    case CardSetType.statements:
      result = parseStatements(context, bitType, cardSet, statementV1, statementsV1);
      break;

    case CardSetType.quiz:
      result = parseQuiz(context, bitType, cardSet, choicesV1, responsesV1);
      break;

    case CardSetType.questions:
      result = parseQuestions(context, bitType, cardSet);
      break;

    case CardSetType.matchPairs:
      // ==> heading / pairs
      result = parseMatchPairs(context, bitType, cardSet);
      break;

    case CardSetType.matchMatrix:
      // ==> heading / matrix
      result = parseMatchMatrix(context, bitType, cardSet);
      break;

    case CardSetType.botActionResponses:
      result = parseBotActionResponses(context, bitType, cardSet);
      break;

    default:
    // Return default empty object
  }

  // Validate card set required and present, or not required and not present
  BitmarkPegParserValidator.validateCardSetType(context, BitContentLevel.Bit, bitType, cardSetContent, cardSetType);

  return result;
}

export { validateBitTags };
