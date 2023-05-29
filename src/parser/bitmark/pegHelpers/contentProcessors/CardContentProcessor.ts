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
  BitSpecificCards,
  BitmarkPegParserContext,
  CardData,
  TypeKey,
  TypeValue,
} from '../BitmarkPegParserTypes';

const builder = new Builder();

function buildCards(
  context: BitmarkPegParserContext,
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

  if (context.DEBUG_CARD_SET_CONTENT) context.debugPrint('card set content', cardSetContent);

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
  const meta = BitType.getMetadata<BitTypeMetadata>(bitType);
  const cardSetType = meta && meta.cardSetType;

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

function parseElements(context: BitmarkPegParserContext, bitType: BitTypeType, cardSet: CardSet): BitSpecificCards {
  const elements: string[] = [];

  for (const card of cardSet.cards) {
    for (const side of card.sides) {
      for (const rawContent of side.variants) {
        const content = context.parse(rawContent, {
          startRule: 'cardContent',
        }) as BitContent[];

        if (context.DEBUG_CARD_PARSED) context.debugPrint('parsedCardContent (elements)', content);

        const tags = context.bitContentProcessor(BitContentLevel.CardElement, bitType, content);

        if (context.DEBUG_CARD_TAGS) context.debugPrint('card tags (elements)', tags);

        elements.push(tags.cardBody ?? '');
      }
    }
  }

  return {
    elements: elements.length > 0 ? elements : undefined,
  };
}

function parseStatements(
  context: BitmarkPegParserContext,
  bitType: BitTypeType,
  cardSet: CardSet,
  statementV1: Statement | undefined,
  statementsV1: Statement[] | undefined,
): BitSpecificCards {
  const statements: Statement[] = [];

  for (const card of cardSet.cards) {
    for (const side of card.sides) {
      for (const rawContent of side.variants) {
        const content = context.parse(rawContent, {
          startRule: 'cardContent',
        }) as BitContent[];

        if (context.DEBUG_CARD_PARSED) context.debugPrint('parsedCardContent (statements)', content);

        const { statements: chainedStatements, ...tags } = context.bitContentProcessor(
          BitContentLevel.CardStatements,
          bitType,
          content,
        );

        if (context.DEBUG_CARD_TAGS) context.debugPrint('card tags (statements)', tags);

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

function parseQuiz(
  context: BitmarkPegParserContext,
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
        const content = context.parse(rawContent, {
          startRule: 'cardContent',
        }) as BitContent[];

        if (context.DEBUG_CARD_PARSED) context.debugPrint('parsedCardContent (quizzes)', content);

        const tags = context.bitContentProcessor(BitContentLevel.CardQuiz, bitType, content);

        if (context.DEBUG_CARD_TAGS) context.debugPrint('card tags (quizzes)', tags);

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

function parseQuestions(context: BitmarkPegParserContext, bitType: BitTypeType, cardSet: CardSet): BitSpecificCards {
  const questions: Question[] = [];

  for (const card of cardSet.cards) {
    for (const side of card.sides) {
      for (const rawContent of side.variants) {
        const content = context.parse(rawContent, {
          startRule: 'cardContent',
        }) as BitContent[];

        if (context.DEBUG_CARD_PARSED) context.debugPrint('parsedCardContent (questions)', content);

        const tags = context.bitContentProcessor(BitContentLevel.CardQuestion, bitType, content);

        if (context.DEBUG_CARD_TAGS) context.debugPrint('card tags (questions)', tags);

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

function parseMatchPairs(context: BitmarkPegParserContext, bitType: BitTypeType, cardSet: CardSet): BitSpecificCards {
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
        const content = context.parse(rawContent, {
          startRule: 'cardContent',
        }) as BitContent[];

        if (context.DEBUG_CARD_PARSED) context.debugPrint('parsedCardContent (match heading / pairs)', content);

        const { cardBody, title, resources, example, ...tags } = context.bitContentProcessor(
          BitContentLevel.CardMatch,
          bitType,
          content,
        );

        if (context.DEBUG_CARD_TAGS) context.debugPrint('card tags (match heading / pairs)', tags);

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
        isShortAnswer: true, // Default shortAnswer to true - will be overridden by @shortAnswer:false or @longAnswer?
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

function parseMatchMatrix(context: BitmarkPegParserContext, bitType: BitTypeType, cardSet: CardSet): BitSpecificCards {
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
        const content = context.parse(rawContent, {
          startRule: 'cardContent',
        }) as BitContent[];

        if (context.DEBUG_CARD_PARSED) context.debugPrint('parsedCardContent (match heading / matrix)', content);

        const tags = context.bitContentProcessor(BitContentLevel.CardMatrix, bitType, content);

        if (context.DEBUG_CARD_TAGS) context.debugPrint('card tags (match heading / matrix)', tags);

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
        isShortAnswer: true, // Default shortAnswer to true - will be overridden by @shortAnswer:false or @longAnswer?
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

function parseBotActionResponses(
  context: BitmarkPegParserContext,
  bitType: BitTypeType,
  cardSet: CardSet,
): BitSpecificCards {
  const botResponses: BotResponse[] = [];

  for (const card of cardSet.cards) {
    for (const side of card.sides) {
      for (const rawContent of side.variants) {
        const content = context.parse(rawContent, {
          startRule: 'cardContent',
        }) as BitContent[];

        if (context.DEBUG_CARD_PARSED) context.debugPrint('parsedCardContent (botResponses)', content);

        const {
          instruction,
          reaction,
          cardBody: feedback,
          ...tags
        } = context.bitContentProcessor(BitContentLevel.CardBotResponse, bitType, content);

        if (context.DEBUG_CARD_TAGS) context.debugPrint('card tags (botResponses)', tags);

        const botResponse = builder.botResponse({
          response: instruction ?? '',
          reaction: reaction ?? '',
          feedback: feedback ?? '',
          ...tags,
        });
        botResponses.push(botResponse);
      }
    }
  }

  return {
    botResponses: botResponses.length > 0 ? botResponses : undefined,
  };
}

export { buildCards };
