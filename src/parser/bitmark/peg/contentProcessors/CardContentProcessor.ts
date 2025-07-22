import { Breakscape } from '../../../../breakscaping/Breakscape.ts';
import { Config } from '../../../../config/Config.ts';
import { type CardBit } from '../../../../model/ast/Nodes.ts';
import { type JsonText, type TextAst } from '../../../../model/ast/TextNodes.ts';
import { CardSetConfigKey } from '../../../../model/config/enum/CardSetConfigKey.ts';
import { BitType, type BitTypeType } from '../../../../model/enum/BitType.ts';
import { BodyBitType } from '../../../../model/enum/BodyBitType.ts';
import { ResourceType } from '../../../../model/enum/ResourceType.ts';
import { type TextFormatType } from '../../../../model/enum/TextFormat.ts';
import {
  type BotResponseJson,
  type ChoiceJson,
  type DefinitionListItemJson,
  type ExampleJson,
  type FeedbackChoiceJson,
  type FeedbackJson,
  type FeedbackReasonJson,
  type FlashcardJson,
  type HeadingJson,
  type IngredientJson,
  type MatrixCellJson,
  type MatrixJson,
  type PairJson,
  type PronunciationTableCellJson,
  type PronunciationTableJson,
  type QuestionJson,
  type QuizJson,
  type ResponseJson,
  type StatementJson,
  type TableJson,
  type TextAndIconJson,
} from '../../../../model/json/BitJson.ts';
import { type SelectJson } from '../../../../model/json/BodyBitJson.ts';
import {
  type AudioResourceWrapperJson,
  type ImageResourceWrapperJson,
} from '../../../../model/json/ResourceJson.ts';
import { NumberUtils } from '../../../../utils/NumberUtils.ts';
import {
  BitContentLevel,
  type BitContentProcessorResult,
  type BitmarkPegParserContext,
  type BitSpecificCards,
  type ParsedCardSet,
  type ProcessedCard,
  type ProcessedCardSet,
  type ProcessedCardSide,
  type ProcessedCardVariant,
} from '../BitmarkPegParserTypes.ts';
import { BitmarkPegParserValidator } from '../BitmarkPegParserValidator.ts';

interface HeadingData {
  heading: HeadingJson;
  isDefaultExampleCardSet: boolean;
  exampleCardSet: ExampleJson | undefined;
}

function buildCards(
  context: BitmarkPegParserContext,
  bitType: BitTypeType,
  textFormat: TextFormatType,
  parsedCardSet: ParsedCardSet | undefined,
  statementV1: Partial<StatementJson> | undefined,
  statementsV1: Partial<StatementJson>[] | undefined,
  choicesV1: Partial<ChoiceJson>[] | undefined,
  responsesV1: Partial<ResponseJson>[] | undefined,
): BitSpecificCards {
  const { bitConfig } = context;

  if (context.DEBUG_CARD_SET) context.debugPrint('card set', parsedCardSet);

  let result: BitSpecificCards = {};

  // Process the card contents
  const processedCardSet = processCardSet(context, parsedCardSet);

  // Parse the card contents according to the card set type

  // Get the bit metadata to check how to parse the card set
  const cardSetType = bitConfig.cardSet?.configKey;

  switch (cardSetType) {
    case CardSetConfigKey.flashcard:
    case CardSetConfigKey.definitionList:
      result = parseFlashcardOrDefinitionList(context, bitType, processedCardSet);
      break;

    case CardSetConfigKey.elements:
      result = parseElements(context, bitType, processedCardSet);
      break;

    case CardSetConfigKey.statements:
      result = parseStatements(context, bitType, processedCardSet, statementV1, statementsV1);
      break;

    case CardSetConfigKey.feedback:
      result = parseFeedback(context, bitType, processedCardSet);
      break;

    case CardSetConfigKey.quiz:
      result = parseQuiz(context, bitType, processedCardSet, choicesV1, responsesV1);
      break;

    case CardSetConfigKey.questions:
      result = parseQuestions(context, bitType, processedCardSet);
      break;

    case CardSetConfigKey.matchPairs:
      // ==> heading / pairs
      result = parseMatchPairs(context, bitType, processedCardSet);
      break;

    case CardSetConfigKey.matchMatrix:
      // ==> heading / matrix
      result = parseMatchMatrix(context, bitType, processedCardSet);
      break;

    case CardSetConfigKey.pronunciationTable:
      result = parsePronunciationTable(context, bitType, processedCardSet);
      break;

    case CardSetConfigKey.table:
      // ==> heading / table
      result = parseTable(context, bitType, processedCardSet);
      break;

    case CardSetConfigKey.botActionResponses:
      result = parseBotActionResponses(context, bitType, processedCardSet);
      break;

    case CardSetConfigKey.ingredients:
      result = parseIngredients(context, bitType, processedCardSet);
      break;

    case CardSetConfigKey.clozeList:
    case CardSetConfigKey.exampleBitList:
    case CardSetConfigKey.bookReferenceList:
      result = parseCardBits(context, bitType, textFormat, processedCardSet);
      break;

    // DEPRECATED - REMOVE IN THE FUTURE
    // case CardSetConfigKey._captionDefinitionsList:
    //   // ==> captionDefinitionsList
    //   result = parseCaptionDefinitionsList(context, bitType, processedCardSet);
    //   break;

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
  parsedCardSet: ParsedCardSet | undefined,
): ProcessedCardSet {
  const processedCardSet: ProcessedCardSet = {
    cards: [],
    internalComments: [],
  };

  // Early return if no card set
  if (!parsedCardSet) return processedCardSet;

  const { bitType } = context;

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

        const tags = context.bitContentProcessor(BitContentLevel.Card, tagsConfig, content);

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
        tags.cardBodyStr = tags.cardBody?.bodyString;

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

function parseFlashcardOrDefinitionList(
  context: BitmarkPegParserContext,
  bitType: BitTypeType,
  cardSet: ProcessedCardSet,
): BitSpecificCards {
  const flashcards: Partial<FlashcardJson>[] = [];
  const definitions: Partial<DefinitionListItemJson>[] = [];
  let questionStr = '';
  let question: Partial<TextAndIconJson> | undefined;
  let answer: Partial<TextAndIconJson> | undefined;
  let alternativeAnswers: Partial<TextAndIconJson>[] = [];
  let variantIndex = 0;
  let extraTags: BitContentProcessorResult = {};
  let questionVariant: ProcessedCardVariant | undefined;
  const onlyOneCardAllowed = bitType === BitType.flashcard1;

  // Extract the heading card if it exists
  const headingData = extractHeadingCard(cardSet);

  for (let cardIdx = 0; cardIdx < cardSet.cards.length; cardIdx++) {
    const card = cardSet.cards[cardIdx];

    // Skip the headings card if it exists
    if (headingData && cardIdx === 0) continue;

    // Reset the question and answers
    question = undefined;
    answer = undefined;
    alternativeAnswers = [];
    variantIndex = 0;
    extraTags = {};

    for (const side of card.sides) {
      for (const content of side.variants) {
        const { cardBody, resources, ...tags } = content.data;
        extraTags = {
          ...extraTags,
          ...tags,
        };
        const icon =
          resources && resources.length > 0
            ? (resources[0] as ImageResourceWrapperJson)
            : undefined;
        const text = cardBody?.body as TextAst;
        const str = cardBody?.bodyString ?? '';

        if (variantIndex === 0) {
          questionVariant = content;
          questionStr = str;
          question = {
            text,
            icon,
          };
        } else if (variantIndex === 1) {
          answer = {
            text,
            icon,
          };
        } else {
          alternativeAnswers.push({
            text,
            icon: icon,
          });
        }
        variantIndex++;
      }
    }

    // Add the flashcard
    if (cardIdx === 0 || !onlyOneCardAllowed) {
      if (Config.isOfBitType(bitType, [BitType.flashcard])) {
        // .flashcard
        // if (question) {
        const fc: Partial<FlashcardJson> = {
          question: question as TextAndIconJson,
          answer: answer as TextAndIconJson,
          alternativeAnswers: alternativeAnswers as TextAndIconJson[],
          ...extraTags,
        };
        if (fc) flashcards.push(fc);
        // } else {
        //   context.addWarning('Ignoring card with empty question', questionVariant);
        // }
      } else {
        // .definition-list, etc
        const dl: Partial<DefinitionListItemJson> = {
          term: question as TextAndIconJson,
          definition: answer as TextAndIconJson,
          alternativeDefinitions: alternativeAnswers as TextAndIconJson[],
          ...extraTags,
        };
        if (dl) definitions.push(dl);
      }
    } else {
      // Only one card allowed, add a warning and ignore the card
      context.addWarning(
        `Bit '${bitType}' should only contain one card. Ignore subsequent card: '${questionStr}'`,
        questionVariant,
      );
      break;
    }
  }

  return {
    heading: headingData?.heading,
    flashcards: flashcards.length > 0 ? flashcards : undefined,
    definitions: definitions.length > 0 ? definitions : undefined,
  };
}

function parseElements(
  _context: BitmarkPegParserContext,
  _bitType: BitTypeType,
  cardSet: ProcessedCardSet,
): BitSpecificCards {
  const elements: string[] = [];

  for (const card of cardSet.cards) {
    for (const side of card.sides) {
      for (const content of side.variants) {
        const tags = content.data;

        // if (tags.cardBody) {
        elements.push(tags.cardBodyStr ?? '');
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
  statementV1: Partial<StatementJson> | undefined,
  statementsV1: Partial<StatementJson>[] | undefined,
): BitSpecificCards {
  const statements: Partial<StatementJson>[] = [];

  for (const card of cardSet.cards) {
    for (const side of card.sides) {
      for (const content of side.variants) {
        const { statements: chainedStatements, statement: _ignore, ...tags } = content.data;

        // Re-build the statement, adding any tags that were not in the True/False chain
        // These tags are actually not in the correct place, but we can still interpret them and fix the data.
        // As .true-false only has one statement per card, we can just add the extra tags to the statement.
        if (Array.isArray(chainedStatements)) {
          for (const s of chainedStatements) {
            // if (s.text) {
            const statement: Partial<StatementJson> = {
              statement: s.statement ?? '',
              isCorrect: s.isCorrect,
              item: s.item,
              lead: s.lead,
              hint: s.hint,
              instruction: s.instruction,
              example: s.example,
              ...tags,
            };
            if (statement) statements.push(statement);
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

function parseFeedback(
  _context: BitmarkPegParserContext,
  _bitType: BitTypeType,
  cardSet: ProcessedCardSet,
): BitSpecificCards {
  let feedback: Partial<FeedbackJson> | undefined;
  const feedbacks: Partial<FeedbackJson>[] = [];

  // Extract the heading card if it exists
  const headingData = extractHeadingCard(cardSet);

  for (let cardIdx = 0; cardIdx < cardSet.cards.length; cardIdx++) {
    const card = cardSet.cards[cardIdx];

    // Skip the headings card if it exists
    if (headingData && cardIdx === 0) continue;

    feedback = undefined;

    for (let sideIdx = 0; sideIdx < card.sides.length; sideIdx++) {
      const side = card.sides[sideIdx];

      for (const content of side.variants) {
        const tags = content.data;

        const { cardBody, cardBodyStr, choices: choiceTags, ...restTags } = tags;

        if (sideIdx === 0) {
          // First side (feedback choices)

          const choices: Partial<FeedbackChoiceJson>[] = [];

          if (choiceTags && choiceTags.length > 0) {
            for (const tf of choiceTags) {
              const { __isDefaultExample, example, ...tfTags } = tf;

              const choice: Partial<FeedbackChoiceJson> = {
                choice: tfTags.choice,
                requireReason: tfTags.isCorrect,
                __isDefaultExample,
                example,
              };
              choices.push(choice);
            }
          }

          // if (tags.choices || tags.responses) {
          feedback = {
            ...tags,
            choices: choices as FeedbackChoiceJson[],
          };
          if (feedback) feedbacks.push(feedback);
        } else if (sideIdx === 1) {
          // Second side (feedback reason)
          const reason: Partial<FeedbackReasonJson> = {
            text: cardBodyStr ?? '',
            __textAst: cardBody?.body as TextAst,
            ...restTags,
          };
          if (feedback) {
            feedback.reason = reason as FeedbackReasonJson;
          }
        }
      }
    }
  }

  return {
    heading: headingData?.heading,
    feedbacks: feedbacks.length > 0 ? feedbacks : undefined,
  };
}

function parseQuiz(
  _context: BitmarkPegParserContext,
  bitType: BitTypeType,
  cardSet: ProcessedCardSet,
  choicesV1: Partial<ChoiceJson>[] | undefined,
  responsesV1: Partial<ResponseJson>[] | undefined,
): BitSpecificCards {
  const quizzes: Partial<QuizJson>[] = [];
  const insertChoices = Config.isOfBitType(bitType, BitType.multipleChoice);
  const insertResponses = Config.isOfBitType(bitType, BitType.multipleResponse);
  if (!insertChoices && !insertResponses) return {};

  let isDefaultExampleCard = false;
  let exampleCard: ExampleJson | undefined;

  for (const card of cardSet.cards) {
    isDefaultExampleCard = false;
    exampleCard = undefined;

    for (const side of card.sides) {
      for (const content of side.variants) {
        const { __isDefaultExample, example, ...tags } = content.data;

        // Example
        isDefaultExampleCard = __isDefaultExample === true ? true : isDefaultExampleCard;
        exampleCard = example ? example : exampleCard;

        // Insert choices / responses
        if (tags.trueFalse && tags.trueFalse.length > 0) {
          const responsesOrChoices: (Partial<ChoiceJson> | Partial<ResponseJson>)[] = [];

          for (const tf of tags.trueFalse) {
            const { __isDefaultExample: isDefaultExampleTf, example: exampleTf, ...tfTags } = tf;
            const __isDefaultExample = isDefaultExampleTf || isDefaultExampleCard;
            const example = exampleTf || exampleCard;

            const response: Partial<ChoiceJson> & Partial<ResponseJson> = {
              isCorrect: tfTags.isCorrect,
              __isDefaultExample,
              example,
            };
            if (insertResponses) response.response = tfTags.text;
            else response.choice = tfTags.text;
            if (response) responsesOrChoices.push(response);
          }

          if (insertResponses) tags.responses = responsesOrChoices as Partial<ResponseJson>[];
          else tags.choices = responsesOrChoices as Partial<ChoiceJson>[];
        }

        // if (tags.choices || tags.responses) {
        const quiz: Partial<QuizJson> = {
          ...tags,
          choices: tags.choices as ChoiceJson[],
          responses: tags.responses as ResponseJson[],
          __isDefaultExample: isDefaultExampleCard,
          __defaultExample: exampleCard,
        };
        if (quiz) quizzes.push(quiz);
        // } else {
        //   context.addWarning('Ignoring card with empty quiz', content);
        // }
      }
    }
  }

  // Add a quiz for the V1 choices / responses
  if (insertChoices && Array.isArray(choicesV1) && choicesV1.length > 0) {
    const quiz: Partial<QuizJson> = {
      choices: choicesV1 as ChoiceJson[],
    };
    if (quiz) quizzes.push(quiz);
  }
  if (insertResponses && Array.isArray(responsesV1) && responsesV1.length > 0) {
    const quiz: Partial<QuizJson> = {
      responses: responsesV1 as ResponseJson[],
    };
    if (quiz) quizzes.push(quiz);
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
  const questions: Partial<QuestionJson>[] = [];

  for (const card of cardSet.cards) {
    for (const side of card.sides) {
      for (const content of side.variants) {
        const tags = content.data;

        // if (tags.cardBody) {
        const q: Partial<QuestionJson> = {
          question: tags.cardBodyStr ?? '',
          ...tags,
        };
        if (q) questions.push(q);
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
  bitType: BitTypeType,
  cardSet: ProcessedCardSet,
): BitSpecificCards {
  const pairs: Partial<PairJson>[] = [];
  let pairKey: string | undefined = undefined;
  let pairValues: string[] = [];
  let _pairValuesAst: TextAst[] = [];
  let keyAudio: AudioResourceWrapperJson | undefined = undefined;
  let keyImage: ImageResourceWrapperJson | undefined = undefined;
  let extraTags: BitContentProcessorResult = {};
  let isDefaultExampleCard = false;
  let exampleCard: ExampleJson | undefined;
  // let variant: ProcessedCardVariant | undefined;

  // Extract the heading card if it exists
  const headingValuesIsArray = Config.isOfBitType(bitType, BitType.matchMatrix);
  const headingData = extractHeadingCard(cardSet, headingValuesIsArray);

  const isDefaultExampleCardSet = headingData?.isDefaultExampleCardSet ?? false;
  let exampleCardSet = headingData?.exampleCardSet;

  for (let cardIdx = 0; cardIdx < cardSet.cards.length; cardIdx++) {
    const card = cardSet.cards[cardIdx];

    // Skip the headings card if it exists
    if (headingData && cardIdx === 0) continue;

    pairKey = undefined;
    pairValues = [];
    _pairValuesAst = [];
    keyAudio = undefined;
    keyImage = undefined;
    extraTags = {};
    isDefaultExampleCard = false;
    exampleCard = undefined;

    for (let sideIdx = 0; sideIdx < card.sides.length; sideIdx++) {
      const side = card.sides[sideIdx];

      for (const content of side.variants) {
        // variant = content;
        const { cardBody, cardBodyStr, resources, __isDefaultExample, example, ...tags } =
          content.data;

        // Example
        isDefaultExampleCard = __isDefaultExample === true ? true : isDefaultExampleCard;
        exampleCard = example ? (example as TextAst) : exampleCard;

        if (sideIdx === 0) {
          // First side
          if (Array.isArray(resources) && resources.length > 0) {
            // TODO - should search the correct resource type based on the bit type
            const resource = resources[0];
            // console.log('WARNING: Match card has resource on first side', tags.resource);
            if (resource.type === ResourceType.audio) {
              keyAudio = resource as AudioResourceWrapperJson;
            } else if (resource.type === ResourceType.image) {
              keyImage = resource as ImageResourceWrapperJson;
            }
          } else {
            // If not a heading or resource, it is a pair
            pairKey = cardBodyStr;
          }
        } else {
          // Subsequent sides (pair)
          const value = cardBodyStr ?? '';
          const valueAst = cardBody?.body as TextAst;
          pairValues.push(value);
          _pairValuesAst.push(valueAst);
          if ((isDefaultExampleCardSet || isDefaultExampleCard) && !exampleCard)
            exampleCard = valueAst;

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
    }

    // if (pairKey || keyAudio || keyImage) {
    // Calculate final example and __isDefaultExample
    if (isDefaultExampleCard) exampleCardSet = undefined;
    const __isDefaultExample = isDefaultExampleCard || isDefaultExampleCardSet;
    const example = exampleCard || exampleCardSet;

    const pair: Partial<PairJson> = {
      key: pairKey ?? '',
      keyAudio,
      keyImage,
      values: pairValues,
      __valuesAst: _pairValuesAst,
      ...extraTags,
      __isDefaultExample,
      example,
    };
    if (pair) pairs.push(pair);
    // } else {
    //   context.addWarning('Ignoring card with empty body text', variant);
    // }
  }

  return {
    heading: headingData?.heading,
    pairs: pairs.length > 0 ? pairs : undefined,
  };
}

function parseMatchMatrix(
  _context: BitmarkPegParserContext,
  _bitType: BitTypeType,
  cardSet: ProcessedCardSet,
): BitSpecificCards {
  let matrixKey: string | undefined = undefined;
  let matrixKeyTags: BitContentProcessorResult | undefined = undefined;
  const matrix: Partial<MatrixJson>[] = [];
  let matrixCells: Partial<MatrixCellJson>[] = [];
  let matrixCellValues: string[] = [];
  let _matrixCellValuesAst: TextAst[] = [];
  let matrixCellTags: BitContentProcessorResult = {};
  let isDefaultExampleCard = false;
  let exampleCard: ExampleJson | undefined;
  let isDefaultExampleSide = false;
  let exampleSide: ExampleJson | undefined;
  let isCaseSensitiveMatrix: boolean | undefined;
  let isCaseSensitiveCell: boolean | undefined;

  // let keyAudio: AudioResource | undefined = undefined;
  // let keyImage: ImageResource | undefined = undefined;
  // let variant: ProcessedCardVariant | undefined;

  // Extract the heading card if it exists
  const headingData = extractHeadingCard(cardSet, true);

  const isDefaultExampleCardSet = headingData?.isDefaultExampleCardSet ?? false;
  let exampleCardSet = headingData?.exampleCardSet;

  for (let cardIdx = 0; cardIdx < cardSet.cards.length; cardIdx++) {
    const card = cardSet.cards[cardIdx];

    // Skip the headings card if it exists
    if (headingData && cardIdx === 0) continue;

    matrixKey = undefined;
    matrixKeyTags = undefined;
    // keyAudio = undefined;
    // keyImage = undefined;
    matrixCells = [];
    matrixCellValues = [];
    _matrixCellValuesAst = [];
    isDefaultExampleCard = false;
    exampleCard = undefined;
    isCaseSensitiveMatrix = undefined;

    for (let sideIdx = 0; sideIdx < card.sides.length; sideIdx++) {
      const side = card.sides[sideIdx];

      matrixCellValues = [];
      _matrixCellValuesAst = [];
      matrixCellTags = {};
      isDefaultExampleSide = false;
      exampleSide = undefined;
      isCaseSensitiveCell = undefined;

      for (const content of side.variants) {
        // variant = content;
        const tags = content.data;

        const { cardBody, cardBodyStr, __isDefaultExample, example, isCaseSensitive, ...restTags } =
          tags;

        // Example
        isDefaultExampleSide = __isDefaultExample === true ? true : isDefaultExampleSide;
        exampleSide = example ? example : exampleSide;

        // Merge the tags into the matrix cell tags
        Object.assign(matrixCellTags, restTags);

        if (sideIdx === 0) {
          // First side (matrix)
          matrixKey = cardBodyStr;
          matrixKeyTags = restTags;
          isDefaultExampleCard = __isDefaultExample === true ? true : isDefaultExampleCard;
          exampleCard = example ? example : exampleCard;
          isCaseSensitiveMatrix = isCaseSensitive != null ? isCaseSensitive : isCaseSensitiveMatrix;
        } else {
          // Subsequent sides (matrix cell value)
          const value = cardBodyStr ?? Breakscape.EMPTY_STRING;
          const valueAst = cardBody?.body as TextAst;
          matrixCellValues.push(value);
          _matrixCellValuesAst.push(valueAst);
          if ((isDefaultExampleCardSet || isDefaultExampleSide) && !exampleSide)
            exampleSide = valueAst;
          isCaseSensitiveCell = isCaseSensitive != null ? isCaseSensitive : isCaseSensitiveMatrix;
        }
      }

      // Finished looping variants, create matrix cell
      if (sideIdx > 0) {
        // Calculate final example and __isDefaultExample
        if (isDefaultExampleSide) exampleCard = exampleCardSet = undefined;
        if (isDefaultExampleCard) exampleCardSet = undefined;
        const __isDefaultExample =
          isDefaultExampleSide || isDefaultExampleCard || isDefaultExampleCardSet;
        const example = exampleSide || exampleCard || exampleCardSet;

        const matrixCell: Partial<MatrixCellJson> = {
          values: matrixCellValues,
          __valuesAst: _matrixCellValuesAst,
          ...matrixCellTags,
          __isDefaultExample: __isDefaultExample,
          example,
          isCaseSensitive: isCaseSensitiveCell,
        };
        if (matrixCell) matrixCells.push(matrixCell);
      }
    }

    // if (matrixKey) {
    const m: Partial<MatrixJson> = {
      key: matrixKey ?? Breakscape.EMPTY_STRING,
      // item: matrixItem ?? Breakscape.EMPTY_STRING,
      // keyAudio,
      // keyImage,
      cells: matrixCells as MatrixCellJson[],
      ...matrixKeyTags,
    };
    if (m) matrix.push(m);
    // } else {
    //   context.addWarning('Ignoring card with empty body text', variant);
    // }
  }

  return {
    heading: headingData?.heading,
    matrix: matrix.length > 0 ? matrix : undefined,
  };
}

function parsePronunciationTable(
  _context: BitmarkPegParserContext,
  _bitType: BitTypeType,
  cardSet: ProcessedCardSet,
): BitSpecificCards {
  const rows: PronunciationTableCellJson[][] = [];
  let rowValues: PronunciationTableCellJson[] = [];

  for (const card of cardSet.cards) {
    rowValues = [];

    for (const side of card.sides) {
      for (const content of side.variants) {
        // variant = content;
        const tags = content.data;

        const { title, cardBody, resources } = tags;

        const heading = title && title[1].titleAst;
        const audio: AudioResourceWrapperJson = (
          resources && resources.length > 0
            ? resources.find((r) => r.type === ResourceType.audio)
            : undefined
        ) as AudioResourceWrapperJson;

        const value: PronunciationTableCellJson = {
          title: heading ?? [],
          body: (cardBody?.body ?? []) as JsonText,
          audio,
        };
        rowValues.push(value);
      }
    }

    rows.push(rowValues);
  }

  const table: Partial<PronunciationTableJson> = {
    data: rows,
  };

  return { pronunciationTable: table };
}

function parseTable(
  _context: BitmarkPegParserContext,
  _bitType: BitTypeType,
  cardSet: ProcessedCardSet,
): BitSpecificCards {
  let isHeading = false;
  const columns: JsonText[] = [];
  const rows: JsonText[][] = [];
  let rowValues: JsonText[] = [];

  for (let cardIdx = 0; cardIdx < cardSet.cards.length; cardIdx++) {
    const card = cardSet.cards[cardIdx];

    isHeading = false;
    rowValues = [];

    for (const side of card.sides) {
      for (const content of side.variants) {
        // variant = content;
        const tags = content.data;

        const { title, cardBody } = tags;

        // Get the 'heading' which is the [#title] at level 1
        // const heading = title && title[1].titleString;
        const heading = title && title[1].titleAst;
        if (cardIdx === 0 && heading != null) isHeading = true;

        if (isHeading) {
          columns.push(heading ?? []);
        } else {
          // If not a heading, it is a row cell value
          // const value = cardBodyStr ?? '';
          const value = (cardBody?.body ?? []) as JsonText;
          rowValues.push(value);
        }
      }
    }

    if (!isHeading) {
      rows.push(rowValues);
    }
  }

  const table: Partial<TableJson> = {
    columns,
    data: rows,
  };

  return { table };
}

function parseBotActionResponses(
  _context: BitmarkPegParserContext,
  _bitType: BitTypeType,
  cardSet: ProcessedCardSet,
): BitSpecificCards {
  const botResponses: Partial<BotResponseJson>[] = [];

  for (const card of cardSet.cards) {
    for (const side of card.sides) {
      for (const content of side.variants) {
        const { __instructionString, reaction, cardBodyStr: feedback, ...tags } = content.data;

        const botResponse: Partial<BotResponseJson> = {
          response: __instructionString ?? Breakscape.EMPTY_STRING,
          reaction: reaction ?? Breakscape.EMPTY_STRING,
          feedback: feedback ?? Breakscape.EMPTY_STRING,
          ...tags,
        };
        if (botResponse) botResponses.push(botResponse);
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
  const ingredients: Partial<IngredientJson>[] = [];

  for (const card of cardSet.cards) {
    for (const side of card.sides) {
      for (const content of side.variants) {
        const {
          title: titleArray,
          __instructionString,
          unit,
          unitAbbr,
          decimalPlaces,
          disableCalculation,
          cardBodyStr,
          cardBody,
          ...tags
        } = content.data;

        // Extract 'title' from title array (if present)
        // Extract 'quantity' from either then unchained instruction, or from the select (otherwise use 0)
        // Extract checked from the select options (if present, otherwise checked is false))
        const title =
          Array.isArray(titleArray) && titleArray.length > 0
            ? titleArray[titleArray.length - 1].titleString
            : undefined;
        let checked = false;
        let quantity: number | undefined = NumberUtils.asNumber(__instructionString);
        if (cardBody && cardBody.bodyBits) {
          const select: SelectJson | undefined = cardBody.bodyBits.find(
            (c) => c.type === BodyBitType.select,
          ) as SelectJson | undefined;
          if (select) {
            quantity = select.__instructionString
              ? NumberUtils.asNumber(select.__instructionString)
              : quantity;
            if (select.options && select.options.length > 0) {
              checked = select.options[0].isCorrect;
            }
          }
        }

        const ingredient: Partial<IngredientJson> = {
          title,
          checked,
          // TS compiler very weird. It doesn't recognize that cardBodyStr is a string|undefined, even if cast!
          // Casting to 'any' to avoid the error
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ingredient: cardBodyStr as any,
          quantity,
          unit: unit ?? Breakscape.EMPTY_STRING,
          unitAbbr: unitAbbr ?? Breakscape.EMPTY_STRING,
          decimalPlaces: decimalPlaces ?? 1,
          disableCalculation: disableCalculation,
          ...tags,
        };
        if (ingredient) ingredients.push(ingredient);
      }
    }
  }

  return {
    ingredients: ingredients.length > 0 ? ingredients : undefined,
  };
}

// DEPRECATED - REMOVE IN THE FUTURE
// function parseCaptionDefinitionsList(
//   _context: BitmarkPegParserContext,
//   _bitType: BitTypeType,
//   cardSet: ProcessedCardSet,
// ): BitSpecificCards {
//   let isHeading = false;
//   const columns: string[] = [];
//   const rows: string[][] = [];
//   let rowValues: string[] = [];

//   for (let cardIdx = 0; cardIdx < cardSet.cards.length; cardIdx++) {
//     const card = cardSet.cards[cardIdx];

//     isHeading = false;
//     rowValues = [];

//     for (const side of card.sides) {
//       for (const content of side.variants) {
//         // variant = content;
//         const tags = content.data;

//         const { title, cardBodyStr } = tags;

//         // Get the 'heading' which is the [#title] at level 1
//         const heading = title && title[1].titleString;
//         if (cardIdx === 0 && heading != null) isHeading = true;

//         if (isHeading) {
//           columns.push(heading ?? '');
//         } else {
//           // If not a heading, it is a row cell value
//           const value = cardBodyStr ?? '';
//           rowValues.push(value);
//         }
//       }
//     }

//     if (!isHeading) {
//       rows.push(rowValues);
//     }
//   }

//   const captionDefinitionList: Partial<CaptionDefinitionListJson> | undefined =
//     columns.length > 0
//       ? {
//           heading: columns,
//           definitions: rows
//             .map((row) => {
//               const col: Partial<CaptionDefinitionJson> = {
//                 term: row[0],
//                 definition: row[1],
//               };
//               return col as CaptionDefinitionJson;
//             })
//             .filter((d) => d != null),
//         }
//       : undefined;

//   return { captionDefinitionList };
// }

function parseCardBits(
  _context: BitmarkPegParserContext,
  _bitType: BitTypeType,
  _textFormat: TextFormatType,
  cardSet: ProcessedCardSet,
): BitSpecificCards {
  const cardBits: Partial<CardBit>[] = [];

  for (const card of cardSet.cards) {
    for (const side of card.sides) {
      for (const content of side.variants) {
        const { cardBody: body, ...rest } = content.data;

        const cardBit: Partial<CardBit> = {
          body,
          ...rest,
        } as CardBit;
        if (cardBit) cardBits.push(cardBit);
      }
    }
  }

  return {
    cardBits: cardBits.length > 0 ? cardBits : undefined,
  };
}

function extractHeadingCard(
  cardSet: ProcessedCardSet,
  valuesIsArray = false,
): HeadingData | undefined {
  let isHeading = false;
  let heading: Partial<HeadingJson> | undefined;
  let forKeys: string | undefined = undefined;
  const forValues: string[] = [];
  let isDefaultExampleCardSet = false;
  let exampleCardSet: ExampleJson | undefined;

  if (cardSet.cards.length === 0) return undefined;
  const card = cardSet.cards[0];

  for (let sideIdx = 0; sideIdx < card.sides.length; sideIdx++) {
    const side = card.sides[sideIdx];

    if (side.variants.length === 0) continue;

    const content = side.variants[0];
    const tags = content.data;

    const { title, __isDefaultExample, example } = tags;

    // Get the 'heading' which is the [#title] at level 1
    const heading = title && title[1].titleString;
    if (heading != null) isHeading = true;

    if (sideIdx === 0) {
      // 1st side

      if (isHeading) {
        forKeys = heading;
        isDefaultExampleCardSet = __isDefaultExample === true ? true : isDefaultExampleCardSet;
        exampleCardSet = example ? (example as TextAst) : exampleCardSet;
      }
    } /*if (sideIdx === 1)*/ else {
      // 2nd side
      if (isHeading) {
        forValues.push(heading ?? '');
        isDefaultExampleCardSet = __isDefaultExample === true ? true : isDefaultExampleCardSet;
        exampleCardSet = example ? (example as TextAst) : exampleCardSet;
      }
    }
  }

  if (isHeading) {
    let forValuesFinal: string | string[] = forValues;
    if (valuesIsArray) {
      // forValues is an array of values
      forValuesFinal = forValues;
    } else {
      // Standard match, forValues is a single value
      if (forValues.length >= 1) {
        forValuesFinal = forValues[forValues.length - 1];
      } else {
        forValuesFinal = '';
      }
    }

    heading = {
      forKeys: forKeys ?? '',
      forValues: forValuesFinal,
    };
  }

  return heading
    ? {
        heading: heading as HeadingJson,
        isDefaultExampleCardSet,
        exampleCardSet,
      }
    : undefined;
}

export { buildCards };
