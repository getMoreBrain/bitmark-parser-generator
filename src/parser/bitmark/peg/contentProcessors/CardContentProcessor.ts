import { Builder } from '../../../../ast/Builder';
import { Breakscape } from '../../../../breakscaping/Breakscape';
import { Config } from '../../../../config/Config';
import { BreakscapedString } from '../../../../model/ast/BreakscapedString';
import { CardSetConfigKey } from '../../../../model/config/enum/CardSetConfigKey';
import { BitType, BitTypeType } from '../../../../model/enum/BitType';
import { BodyBitType } from '../../../../model/enum/BodyBitType';
import { ResourceTag } from '../../../../model/enum/ResourceTag';
import { TextFormatType } from '../../../../model/enum/TextFormat';
import { NumberUtils } from '../../../../utils/NumberUtils';
import { BitmarkPegParserValidator } from '../BitmarkPegParserValidator';

import {
  AudioResource,
  Body,
  BodyText,
  BotResponse,
  CardBit,
  Choice,
  Ingredient,
  Flashcard,
  Heading,
  ImageResource,
  Matrix,
  MatrixCell,
  Pair,
  Question,
  Quiz,
  Response,
  Statement,
  Select,
} from '../../../../model/ast/Nodes';
import {
  BitContentLevel,
  BitContentProcessorResult,
  BitSpecificCards,
  BitmarkPegParserContext,
  ParsedCardSet,
  ProcessedCard,
  ProcessedCardSet,
  ProcessedCardSide,
  ProcessedCardVariant,
} from '../BitmarkPegParserTypes';

const builder = new Builder();

function buildCards(
  context: BitmarkPegParserContext,
  bitType: BitTypeType,
  textFormat: TextFormatType,
  parsedCardSet: ParsedCardSet | undefined,
  statementV1: Statement | undefined,
  statementsV1: Statement[] | undefined,
  choicesV1: Choice[] | undefined,
  responsesV1: Response[] | undefined,
): BitSpecificCards {
  if (context.DEBUG_CARD_SET) context.debugPrint('card set', parsedCardSet);

  let result: BitSpecificCards = {};

  // Process the card contents
  const processedCardSet = processCardSet(context, bitType, textFormat, parsedCardSet);

  // Parse the card contents according to the card set type

  // Get the bit metadata to check how to parse the card set
  const bitConfig = Config.getBitConfig(bitType);
  const cardSetType = bitConfig.cardSet?.configKey;

  switch (cardSetType) {
    case CardSetConfigKey._flashcards:
      result = parseFlashcards(context, bitType, processedCardSet);
      break;

    case CardSetConfigKey._elements:
      result = parseElements(context, bitType, processedCardSet);
      break;

    case CardSetConfigKey._statements:
      result = parseStatements(context, bitType, processedCardSet, statementV1, statementsV1);
      break;

    case CardSetConfigKey._quiz:
      result = parseQuiz(context, bitType, processedCardSet, choicesV1, responsesV1);
      break;

    case CardSetConfigKey._questions:
      result = parseQuestions(context, bitType, processedCardSet);
      break;

    case CardSetConfigKey._matchPairs:
      // ==> heading / pairs
      result = parseMatchPairs(context, bitType, processedCardSet);
      break;

    case CardSetConfigKey._matchMatrix:
      // ==> heading / matrix
      result = parseMatchMatrix(context, bitType, processedCardSet);
      break;

    case CardSetConfigKey._table:
      // ==> heading / table
      result = parseTable(context, bitType, processedCardSet);
      break;

    case CardSetConfigKey._botActionResponses:
      result = parseBotActionResponses(context, bitType, processedCardSet);
      break;

    case CardSetConfigKey._ingredients:
      result = parseIngredients(context, bitType, processedCardSet);
      break;

    case CardSetConfigKey._clozeList:
    case CardSetConfigKey._exampleBitList:
      result = parseCardBits(context, bitType, processedCardSet);
      break;

    default:
    // Return default empty object
  }

  // Add the internal comments
  result.internalComments =
    processedCardSet.internalComments.length > 0 ? processedCardSet.internalComments : undefined;

  return result;
}

function processCardSet(
  context: BitmarkPegParserContext,
  bitType: BitTypeType,
  textFormat: TextFormatType,
  parsedCardSet: ParsedCardSet | undefined,
): ProcessedCardSet {
  const processedCardSet: ProcessedCardSet = {
    cards: [],
    internalComments: [],
  };

  // Early return if no card set
  if (!parsedCardSet) return processedCardSet;

  // Process the card contents
  let cardNo = 0;
  let sideNo = 0;
  let variantNo = 0;
  for (const card of parsedCardSet.cards) {
    const processedCard: ProcessedCard = {
      no: cardNo++,
      sides: [],
    };
    processedCardSet.cards.push(processedCard);
    for (const side of card.sides) {
      const processedSide: ProcessedCardSide = {
        no: sideNo++,
        variants: [],
      };
      processedCard.sides.push(processedSide);
      for (const variant of side.variants) {
        const { parser, content } = variant;
        const processedVariant: ProcessedCardVariant = {
          parser,
          no: variantNo++,
        } as ProcessedCardVariant;
        processedSide.variants.push(processedVariant);

        const tagsConfig = Config.getTagsConfigForCardSet(bitType, sideNo, variantNo);

        const tags = context.bitContentProcessor(BitContentLevel.Card, bitType, textFormat, tagsConfig, content);

        if (context.DEBUG_CARD_TAGS) context.debugPrint('card tags', tags);

        // Validate the cardBody
        tags.cardBody = BitmarkPegParserValidator.checkCardBody(
          context,
          BitContentLevel.Card,
          bitType,
          tags.cardBody,
          processedCard.no,
          processedSide.no,
          processedVariant.no,
        );
        // Reduce the card body parts to a breakscaped string
        tags.cardBodyStr = cardBodyToBreakscapedString(tags.cardBody);

        processedVariant.data = tags;

        // Add any internal comments
        if (tags.internalComments) processedCardSet.internalComments.push(...tags.internalComments);
      }
      variantNo = 0;
    }
    sideNo = 0;
  }

  return processedCardSet;
}

function parseFlashcards(
  context: BitmarkPegParserContext,
  bitType: BitTypeType,
  cardSet: ProcessedCardSet,
): BitSpecificCards {
  const flashcards: Flashcard[] = [];
  let question = Breakscape.EMPTY_STRING;
  let answer: BreakscapedString | undefined;
  let alternativeAnswers: BreakscapedString[] = [];
  let cardIndex = 0;
  let variantIndex = 0;
  let extraTags = {};
  let questionVariant: ProcessedCardVariant | undefined;
  const onlyOneCardAllowed = bitType === BitType.flashcard1;

  for (const card of cardSet.cards) {
    // Reset the question and answers
    question = Breakscape.EMPTY_STRING;
    answer = undefined;
    alternativeAnswers = [];
    variantIndex = 0;
    extraTags = {};

    for (const side of card.sides) {
      for (const content of side.variants) {
        const { cardBodyStr, ...tags } = content.data;
        extraTags = {
          ...extraTags,
          ...tags,
        };

        if (variantIndex === 0) {
          questionVariant = content;
          question = cardBodyStr ?? Breakscape.EMPTY_STRING;
        } else if (variantIndex === 1) {
          answer = cardBodyStr ?? Breakscape.EMPTY_STRING;
        } else {
          alternativeAnswers.push(cardBodyStr ?? Breakscape.EMPTY_STRING);
        }
        variantIndex++;
      }
    }

    // Add the flashcard
    if (cardIndex === 0 || !onlyOneCardAllowed) {
      // if (question) {
      flashcards.push(
        builder.flashcard({
          question,
          answer,
          alternativeAnswers: alternativeAnswers.length > 0 ? alternativeAnswers : undefined,
          ...extraTags,
        }),
      );
      // } else {
      //   context.addWarning('Ignoring card with empty question', questionVariant);
      // }
    } else {
      // Only one card allowed, add a warning and ignore the card
      context.addWarning(
        `Bit '${bitType}' should only contain one card. Ignore subsequent card: '${question}'`,
        questionVariant,
      );
      break;
    }

    cardIndex++;
  }

  return {
    flashcards: flashcards.length > 0 ? flashcards : undefined,
  };
}

function parseElements(
  _context: BitmarkPegParserContext,
  _bitType: BitTypeType,
  cardSet: ProcessedCardSet,
): BitSpecificCards {
  const elements: BreakscapedString[] = [];

  for (const card of cardSet.cards) {
    for (const side of card.sides) {
      for (const content of side.variants) {
        const tags = content.data;

        // if (tags.cardBody) {
        elements.push(tags.cardBodyStr ?? Breakscape.EMPTY_STRING);
        // } else {
        //   context.addWarning('Ignoring card with empty element', content);
        // }
      }
    }
  }

  return {
    elements: elements.length > 0 ? elements : undefined,
  };
}

function parseStatements(
  _context: BitmarkPegParserContext,
  _bitType: BitTypeType,
  cardSet: ProcessedCardSet,
  statementV1: Statement | undefined,
  statementsV1: Statement[] | undefined,
): BitSpecificCards {
  const statements: Statement[] = [];

  for (const card of cardSet.cards) {
    for (const side of card.sides) {
      for (const content of side.variants) {
        const { statements: chainedStatements, ...tags } = content.data;

        // Re-build the statement, adding any tags that were not in the True/False chain
        // These tags are actually not in the correct place, but we can still interpret them and fix the data.
        // As .true-false only has one statement per card, we can just add the extra tags to the statement.
        if (Array.isArray(chainedStatements)) {
          for (const s of chainedStatements) {
            // if (s.text) {
            const statement = builder.statement({
              ...s,
              ...s.itemLead,
              ...tags,
            });
            statements.push(statement);
            // } else {
            //   context.addWarning('Ignoring card with empty statement', content);
            // }
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
  _context: BitmarkPegParserContext,
  bitType: BitTypeType,
  cardSet: ProcessedCardSet,
  choicesV1: Choice[] | undefined,
  responsesV1: Response[] | undefined,
): BitSpecificCards {
  const quizzes: Quiz[] = [];
  const insertChoices = Config.isOfBitType(bitType, BitType.multipleChoice);
  const insertResponses = Config.isOfBitType(bitType, BitType.multipleResponse);
  if (!insertChoices && !insertResponses) return {};

  let isDefaultExampleCard = false;
  let exampleCard: BreakscapedString | undefined;

  for (const card of cardSet.cards) {
    isDefaultExampleCard = false;
    exampleCard = Breakscape.EMPTY_STRING;

    for (const side of card.sides) {
      for (const content of side.variants) {
        const { isDefaultExample, example, ...tags } = content.data;

        // Example
        isDefaultExampleCard = isDefaultExample === true ? true : isDefaultExampleCard;
        exampleCard = example ? example : exampleCard;

        // Insert choices / responses
        if (tags.trueFalse && tags.trueFalse.length > 0) {
          const responsesOrChoices: Choice[] | Response[] = [];
          const builderFunc = insertResponses ? builder.response : builder.choice;

          for (const tf of tags.trueFalse) {
            const { isDefaultExample: isDefaultExampleTf, example: exampleTf, ...tfTags } = tf;
            const isDefaultExample = isDefaultExampleTf || isDefaultExampleCard;
            const example = exampleTf || exampleCard;

            const response = builderFunc({
              ...tfTags,
              isDefaultExample,
              example,
            });
            responsesOrChoices.push(response);
          }

          if (insertResponses) tags.responses = responsesOrChoices;
          else tags.choices = responsesOrChoices;
        }

        // if (tags.choices || tags.responses) {
        const quiz = builder.quiz({
          ...tags,
          isDefaultExample: isDefaultExampleCard,
          example: exampleCard,
        });
        quizzes.push(quiz);
        // } else {
        //   context.addWarning('Ignoring card with empty quiz', content);
        // }
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

function parseQuestions(
  _context: BitmarkPegParserContext,
  _bitType: BitTypeType,
  cardSet: ProcessedCardSet,
): BitSpecificCards {
  const questions: Question[] = [];

  for (const card of cardSet.cards) {
    for (const side of card.sides) {
      for (const content of side.variants) {
        const tags = content.data;

        // if (tags.cardBody) {
        const q = builder.question({
          question: tags.cardBodyStr ?? Breakscape.EMPTY_STRING,
          ...tags,
        });
        questions.push(q);
        // }
        // else {
        //   context.addWarning('Ignoring card with empty body text', content);
        // }
      }
    }
  }

  return {
    questions: questions.length > 0 ? questions : undefined,
  };
}

function parseMatchPairs(
  _context: BitmarkPegParserContext,
  _bitType: BitTypeType,
  cardSet: ProcessedCardSet,
): BitSpecificCards {
  let sideIdx = 0;
  let isHeading = false;
  let heading: Heading | undefined;
  const pairs: Pair[] = [];
  let forKeys: BreakscapedString | undefined = undefined;
  let forValues: BreakscapedString[] = [];
  let pairKey: BreakscapedString | undefined = undefined;
  let pairValues: BreakscapedString[] = [];
  let keyAudio: AudioResource | undefined = undefined;
  let keyImage: ImageResource | undefined = undefined;
  let extraTags: BitContentProcessorResult = {};
  let isDefaultExampleCardSet = false;
  let exampleCardSet: BreakscapedString | undefined;
  let isDefaultExampleCard = false;
  let exampleCard: BreakscapedString | undefined;
  // let variant: ProcessedCardVariant | undefined;

  for (const card of cardSet.cards) {
    isHeading = false;
    forKeys = undefined;
    forValues = [];
    pairKey = undefined;
    pairValues = [];
    keyAudio = undefined;
    keyImage = undefined;
    sideIdx = 0;
    extraTags = {};
    isDefaultExampleCard = false;
    exampleCard = Breakscape.EMPTY_STRING;

    for (const side of card.sides) {
      for (const content of side.variants) {
        // variant = content;
        const { cardBodyStr, title, resources, isDefaultExample, example, ...tags } = content.data;

        // Example
        isDefaultExampleCard = isDefaultExample === true ? true : isDefaultExampleCard;
        exampleCard = example ? example : exampleCard;

        // Get the 'heading' which is the [#title] at level 1
        const heading = title && title[1];
        if (heading != null) isHeading = true;

        if (sideIdx === 0) {
          // First side
          forKeys = heading;
          if (heading != null) {
            isDefaultExampleCardSet = isDefaultExample === true ? true : isDefaultExampleCardSet;
            exampleCardSet = example ? example : exampleCardSet;
          } else if (Array.isArray(resources) && resources.length > 0) {
            // TODO - should search the correct resource type based on the bit type
            const resource = resources[0];
            // console.log('WARNING: Match card has resource on first side', tags.resource);
            if (resource.type === ResourceTag.audio) {
              keyAudio = resource as AudioResource;
            } else if (resource.type === ResourceTag.image) {
              keyImage = resource as ImageResource;
            }
          } else {
            // If not a heading or resource, it is a pair
            pairKey = cardBodyStr;
          }
        } else {
          // Subsequent sides
          forValues.push(heading ?? Breakscape.EMPTY_STRING);
          if (heading != null) {
            isDefaultExampleCardSet = isDefaultExample === true ? true : isDefaultExampleCardSet;
            exampleCardSet = example ? example : exampleCardSet;
          } else if (title == null) {
            // If not a heading, it is a pair
            const value = cardBodyStr ?? Breakscape.EMPTY_STRING;
            pairValues.push(value);
            if ((isDefaultExampleCardSet || isDefaultExampleCard) && !exampleCard) exampleCard = value;
          }

          // Fix: https://github.com/getMoreBrain/cosmic/issues/5454
          delete tags.item;
          delete tags.lead;
        }

        // Extra tags
        extraTags = {
          ...extraTags,
          ...tags,
        };
      }
      sideIdx++;
    }

    if (isHeading) {
      heading = builder.heading({
        forKeys: forKeys ?? Breakscape.EMPTY_STRING,
        forValues,
      });
    } else {
      // if (pairKey || keyAudio || keyImage) {
      // Calculate final example and isDefaultExample
      if (isDefaultExampleCard) exampleCardSet = undefined;
      const isDefaultExample = isDefaultExampleCard || isDefaultExampleCardSet;
      const example = exampleCard || exampleCardSet;

      const pair = builder.pair({
        key: pairKey ?? Breakscape.EMPTY_STRING,
        keyAudio,
        keyImage,
        values: pairValues,
        ...extraTags,
        isDefaultExample,
        example,
      });
      pairs.push(pair);
      // } else {
      //   context.addWarning('Ignoring card with empty body text', variant);
      // }
    }
  }

  return {
    heading,
    pairs: pairs.length > 0 ? pairs : undefined,
  };
}

function parseMatchMatrix(
  _context: BitmarkPegParserContext,
  _bitType: BitTypeType,
  cardSet: ProcessedCardSet,
): BitSpecificCards {
  let sideIdx = 0;
  let isHeading = false;
  let heading: Heading | undefined;
  let forKeys: BreakscapedString | undefined = undefined;
  let forValues: BreakscapedString[] = [];
  let matrixKey: BreakscapedString | undefined = undefined;
  let matrixKeyTags: BitContentProcessorResult | undefined = undefined;
  const matrix: Matrix[] = [];
  let matrixCells: MatrixCell[] = [];
  let matrixCellValues: BreakscapedString[] = [];
  let matrixCellTags: BitContentProcessorResult = {};
  let isDefaultExampleCardSet = false;
  let exampleCardSet: BreakscapedString | undefined;
  let isDefaultExampleCard = false;
  let exampleCard: BreakscapedString | undefined;
  let isDefaultExampleSide = false;
  let exampleSide: BreakscapedString | undefined;
  let isCaseSensitiveMatrix: boolean | undefined;
  let isCaseSensitiveCell: boolean | undefined;

  // let keyAudio: AudioResource | undefined = undefined;
  // let keyImage: ImageResource | undefined = undefined;
  // let variant: ProcessedCardVariant | undefined;

  for (const card of cardSet.cards) {
    isHeading = false;
    forKeys = undefined;
    matrixKey = undefined;
    matrixKeyTags = undefined;
    forValues = [];
    // keyAudio = undefined;
    // keyImage = undefined;
    matrixCells = [];
    matrixCellValues = [];
    sideIdx = 0;
    isDefaultExampleCard = false;
    exampleCard = Breakscape.EMPTY_STRING;
    isCaseSensitiveMatrix = undefined;

    for (const side of card.sides) {
      matrixCellValues = [];
      matrixCellTags = {};
      isDefaultExampleSide = false;
      exampleSide = Breakscape.EMPTY_STRING;
      isCaseSensitiveCell = undefined;

      for (const content of side.variants) {
        // variant = content;
        const tags = content.data;

        const { title, cardBodyStr, isDefaultExample, example, isCaseSensitive, ...restTags } = tags;

        // Example
        isDefaultExampleSide = isDefaultExample === true ? true : isDefaultExampleSide;
        exampleSide = example ? example : exampleSide;

        // Merge the tags into the matrix cell tags
        Object.assign(matrixCellTags, restTags);

        // Get the 'heading' which is the [#title] at level 1
        const heading = title && title[1];
        if (heading != null) isHeading = true;

        if (sideIdx === 0) {
          // First side
          forKeys = heading;
          if (heading != null) {
            // } else if (tags.resource) {
            //   console.log('WARNING: Match card has resource on first side', tags.resource);
            //   if (tags.resource.type === ResourceTag.audio) {
            //     keyAudio = tags.resource as AudioResource;
            //   } else if (tags.resource.type === ResourceTag.image) {
            //     keyImage = tags.resource as ImageResource;
            //   }
            isDefaultExampleCardSet = isDefaultExample === true ? true : isDefaultExampleCardSet;
            exampleCardSet = example ? example : exampleCardSet;
          } else {
            // If not a heading or resource, it is a matrix
            matrixKey = cardBodyStr;
            matrixKeyTags = restTags;
            isDefaultExampleCard = isDefaultExample === true ? true : isDefaultExampleCard;
            exampleCard = example ? example : exampleCard;
            isCaseSensitiveMatrix = isCaseSensitive != null ? isCaseSensitive : isCaseSensitiveMatrix;
          }
        } else {
          // Subsequent sides
          forValues.push(heading ?? Breakscape.EMPTY_STRING);
          if (heading != null) {
            isDefaultExampleCardSet = isDefaultExample === true ? true : isDefaultExampleCardSet;
            exampleCardSet = example ? example : exampleCardSet;
          } else if (tags.title == null) {
            // If not a heading, it is a matrix cell value
            const value = cardBodyStr ?? Breakscape.EMPTY_STRING;
            matrixCellValues.push(value);
            if ((isDefaultExampleCardSet || isDefaultExampleSide) && !exampleSide) exampleSide = value;
            isCaseSensitiveCell = isCaseSensitive != null ? isCaseSensitive : isCaseSensitiveMatrix;
          }
        }
      }

      // Finished looping variants, create matrix cell
      if (sideIdx > 0) {
        // Calculate final example and isDefaultExample
        if (isDefaultExampleSide) exampleCard = exampleCardSet = undefined;
        if (isDefaultExampleCard) exampleCardSet = undefined;
        const isDefaultExample = isDefaultExampleSide || isDefaultExampleCard || isDefaultExampleCardSet;
        const example = exampleSide || exampleCard || exampleCardSet;

        const matrixCell = builder.matrixCell({
          values: matrixCellValues,
          ...matrixCellTags,
          isDefaultExample,
          example,
          isCaseSensitive: isCaseSensitiveCell,
        });
        matrixCells.push(matrixCell);
      }

      sideIdx++;
    }

    if (isHeading) {
      heading = builder.heading({
        forKeys: forKeys ?? Breakscape.EMPTY_STRING,
        forValues,
      });
    } else {
      // if (matrixKey) {
      const m = builder.matrix({
        key: matrixKey ?? Breakscape.EMPTY_STRING,
        // item: matrixItem ?? Breakscape.EMPTY_STRING,
        // keyAudio,
        // keyImage,
        cells: matrixCells,
        ...matrixKeyTags,
      });
      matrix.push(m);
      // } else {
      //   context.addWarning('Ignoring card with empty body text', variant);
      // }
    }
  }

  return {
    heading,
    matrix: matrix.length > 0 ? matrix : undefined,
  };
}

function parseTable(
  _context: BitmarkPegParserContext,
  _bitType: BitTypeType,
  cardSet: ProcessedCardSet,
): BitSpecificCards {
  let cardIdx = 0;
  let isHeading = false;
  const columns: BreakscapedString[] = [];
  const rows: BreakscapedString[][] = [];
  let rowValues: BreakscapedString[] = [];

  for (const card of cardSet.cards) {
    isHeading = false;
    rowValues = [];

    for (const side of card.sides) {
      for (const content of side.variants) {
        // variant = content;
        const tags = content.data;

        const { title, cardBodyStr } = tags;

        // Get the 'heading' which is the [#title] at level 1
        const heading = title && title[1];
        if (cardIdx === 0 && heading != null) isHeading = true;

        if (isHeading) {
          columns.push(heading ?? Breakscape.EMPTY_STRING);
        } else {
          // If not a heading, it is a row cell value
          const value = cardBodyStr ?? Breakscape.EMPTY_STRING;
          rowValues.push(value);
        }
      }
    }

    if (!isHeading) {
      rows.push(rowValues);
    }

    cardIdx++;
  }

  const table = builder.table({
    columns,
    rows,
  });

  return { table };
}

function parseBotActionResponses(
  _context: BitmarkPegParserContext,
  _bitType: BitTypeType,
  cardSet: ProcessedCardSet,
): BitSpecificCards {
  const botResponses: BotResponse[] = [];

  for (const card of cardSet.cards) {
    for (const side of card.sides) {
      for (const content of side.variants) {
        const { instruction, reaction, cardBodyStr: feedback, ...tags } = content.data;

        const botResponse = builder.botResponse({
          response: instruction ?? Breakscape.EMPTY_STRING,
          reaction: reaction ?? Breakscape.EMPTY_STRING,
          feedback: feedback ?? Breakscape.EMPTY_STRING,
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

function parseIngredients(
  _context: BitmarkPegParserContext,
  _bitType: BitTypeType,
  cardSet: ProcessedCardSet,
): BitSpecificCards {
  const ingredients: Ingredient[] = [];

  for (const card of cardSet.cards) {
    for (const side of card.sides) {
      for (const content of side.variants) {
        const {
          title: titleArray,
          instruction,
          unit,
          unitAbbr,
          decimalPlaces,
          disableCalculation,
          cardBodyStr: item,
          cardBody,
          ...tags
        } = content.data;

        // Extract 'title' from title array (if present)
        // Extract 'quantity' from either then unchained instruction, or from the select (otherwise use 0)
        // Extract checked from the select options (if present, otherwise checked is false))
        const title =
          Array.isArray(titleArray) && titleArray.length > 0 ? titleArray[titleArray.length - 1] : undefined;
        let checked = false;
        let quantity: number | undefined = NumberUtils.asNumber(instruction);
        if (cardBody && cardBody.bodyParts) {
          const select = cardBody.bodyParts.find((part) => part.type === BodyBitType.select) as Select | undefined;
          if (select) {
            quantity = select.data.instruction ? NumberUtils.asNumber(select.data.instruction) : quantity;
            if (select.data.options && select.data.options.length > 0) {
              checked = select.data.options[0].isCorrect;
            }
          }
        }

        const trimmedItem: BreakscapedString = item ? (item.trim() as BreakscapedString) : Breakscape.EMPTY_STRING;

        const ingredient = builder.ingredient({
          title,
          checked,
          item: trimmedItem,
          quantity,
          unit: unit ?? Breakscape.EMPTY_STRING,
          unitAbbr: unitAbbr ?? Breakscape.EMPTY_STRING,
          decimalPlaces: decimalPlaces ?? 1,
          disableCalculation: disableCalculation,
          ...tags,
        });
        ingredients.push(ingredient);
      }
    }
  }

  return {
    ingredients: ingredients.length > 0 ? ingredients : undefined,
  };
}

function parseCardBits(
  _context: BitmarkPegParserContext,
  _bitType: BitTypeType,
  cardSet: ProcessedCardSet,
): BitSpecificCards {
  const cardBits: CardBit[] = [];

  for (const card of cardSet.cards) {
    for (const side of card.sides) {
      for (const content of side.variants) {
        const { cardBody: body, ...rest } = content.data;

        const cardBit = builder.cardBit({
          body,
          ...rest,
        });
        if (cardBit) cardBits.push(cardBit);
      }
    }
  }

  return {
    cardBits: cardBits.length > 0 ? cardBits : undefined,
  };
}

function cardBodyToBreakscapedString(cardBody: Body | undefined): BreakscapedString {
  let bodyStr = '';

  if (cardBody && cardBody.bodyParts) {
    for (const bodyPart of cardBody.bodyParts) {
      if (bodyPart.type === BodyBitType.text) {
        const asText = bodyPart as BodyText;
        const bodyTextPart = asText.data.bodyText;

        bodyStr += bodyTextPart;
      }
    }
  }

  return bodyStr as BreakscapedString;
}

export { buildCards };
