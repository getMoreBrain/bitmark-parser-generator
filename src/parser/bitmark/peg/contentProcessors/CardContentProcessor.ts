import { Builder } from '../../../../ast/Builder';
import { Breakscape } from '../../../../breakscaping/Breakscape';
import { Config } from '../../../../config/Config';
import { CardBit } from '../../../../model/ast/Nodes';
import { TextAst } from '../../../../model/ast/TextNodes';
import { CardSetConfigKey } from '../../../../model/config/enum/CardSetConfigKey';
import { BitType, BitTypeType } from '../../../../model/enum/BitType';
import { BodyBitType } from '../../../../model/enum/BodyBitType';
import { ResourceTag } from '../../../../model/enum/ResourceTag';
import { TextFormatType } from '../../../../model/enum/TextFormat';
import { SelectJson } from '../../../../model/json/BodyBitJson';
import { NumberUtils } from '../../../../utils/NumberUtils';
import { BitmarkPegParserValidator } from '../BitmarkPegParserValidator';

import {
  BotResponseJson,
  ChoiceJson,
  DescriptionListItemJson,
  ExampleJson,
  FlashcardJson,
  HeadingJson,
  IngredientJson,
  MatrixCellJson,
  MatrixJson,
  PairJson,
  QuestionJson,
  QuizJson,
  ResponseJson,
  StatementJson,
} from '../../../../model/json/BitJson';
import {
  AudioResourceJson,
  AudioResourceWrapperJson,
  ImageResourceJson,
  ImageResourceWrapperJson,
} from '../../../../model/json/ResourceJson';
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
  statementV1: StatementJson | undefined,
  statementsV1: StatementJson[] | undefined,
  choicesV1: ChoiceJson[] | undefined,
  responsesV1: ResponseJson[] | undefined,
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
    case CardSetConfigKey._flashcardLike:
      result = parseFlashcardLike(context, bitType, processedCardSet);
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
      result = parseCardBits(context, bitType, textFormat, processedCardSet);
      break;

    case CardSetConfigKey._captionDefinitionsList:
      // ==> captionDefinitionsList
      result = parseCaptionDefinitionsList(context, bitType, processedCardSet);
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

function parseFlashcardLike(
  context: BitmarkPegParserContext,
  bitType: BitTypeType,
  cardSet: ProcessedCardSet,
): BitSpecificCards {
  const flashcards: FlashcardJson[] = [];
  const descriptions: DescriptionListItemJson[] = [];
  let question: TextAst = [];
  let questionString = '';
  let answer: TextAst = [];
  let alternativeAnswers: TextAst[] = [];
  let cardIndex = 0;
  let variantIndex = 0;
  let extraTags: BitContentProcessorResult = {};
  let questionVariant: ProcessedCardVariant | undefined;
  const onlyOneCardAllowed = bitType === BitType.flashcard1;

  for (const card of cardSet.cards) {
    // Reset the question and answers
    question = [];
    answer = [];
    alternativeAnswers = [];
    variantIndex = 0;
    extraTags = {};

    for (const side of card.sides) {
      for (const content of side.variants) {
        const { cardBody, ...tags } = content.data;
        extraTags = {
          ...extraTags,
          ...tags,
        };

        if (variantIndex === 0) {
          questionVariant = content;
          question = cardBody?.body as TextAst;
          questionString = (cardBody?.bodyString ?? '') as string;
        } else if (variantIndex === 1) {
          answer = cardBody?.body as TextAst;
        } else {
          alternativeAnswers.push(cardBody?.body as TextAst);
        }
        variantIndex++;
      }
    }

    // Add the flashcard
    if (cardIndex === 0 || !onlyOneCardAllowed) {
      if (Config.isOfBitType(bitType, BitType.descriptionList)) {
        // .description-list
        const dl = builder.buildDescriptionListItem({
          term: question,
          description: answer,
          alternativeDescriptions: alternativeAnswers,
          ...extraTags,
        });
        if (dl) descriptions.push(dl);
      } else {
        // .flashcard
        // if (question) {
        const fc = builder.buildFlashcard({
          question,
          answer,
          alternativeAnswers,
          ...extraTags,
        });
        if (fc) flashcards.push(fc);
        // } else {
        //   context.addWarning('Ignoring card with empty question', questionVariant);
        // }
      }
    } else {
      // Only one card allowed, add a warning and ignore the card
      context.addWarning(
        `Bit '${bitType}' should only contain one card. Ignore subsequent card: '${questionString}'`,
        questionVariant,
      );
      break;
    }

    cardIndex++;
  }

  return {
    flashcards: flashcards.length > 0 ? flashcards : undefined,
    descriptions: descriptions.length > 0 ? descriptions : undefined,
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
  statementV1: StatementJson | undefined,
  statementsV1: StatementJson[] | undefined,
): BitSpecificCards {
  const statements: StatementJson[] = [];

  for (const card of cardSet.cards) {
    for (const side of card.sides) {
      for (const content of side.variants) {
        const { statements: chainedStatements, statement: _ignore, ...tags } = content.data;
        // Remove statement from rest, tags
        _ignore;

        // Re-build the statement, adding any tags that were not in the True/False chain
        // These tags are actually not in the correct place, but we can still interpret them and fix the data.
        // As .true-false only has one statement per card, we can just add the extra tags to the statement.
        if (Array.isArray(chainedStatements)) {
          for (const s of chainedStatements) {
            // if (s.text) {
            const statement = builder.buildStatement({
              statement: s.statement ?? '',
              isCorrect: s.isCorrect,
              item: s.item,
              lead: s.lead,
              // pageNumber: undefined,
              // marginNumber: undefined,
              hint: s.hint,
              instruction: s.instruction,
              example: s.example,
              ...tags,
            });
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

function parseQuiz(
  _context: BitmarkPegParserContext,
  bitType: BitTypeType,
  cardSet: ProcessedCardSet,
  choicesV1: ChoiceJson[] | undefined,
  responsesV1: ResponseJson[] | undefined,
): BitSpecificCards {
  const quizzes: QuizJson[] = [];
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
        const { _isDefaultExample, example, ...tags } = content.data;

        // Example
        isDefaultExampleCard = _isDefaultExample === true ? true : isDefaultExampleCard;
        exampleCard = example ? example : exampleCard;

        // Insert choices / responses
        if (tags.trueFalse && tags.trueFalse.length > 0) {
          const responsesOrChoices: (Partial<ChoiceJson> | Partial<ResponseJson>)[] = [];

          for (const tf of tags.trueFalse) {
            const { _isDefaultExample: isDefaultExampleTf, example: exampleTf, ...tfTags } = tf;
            const _isDefaultExample = isDefaultExampleTf || isDefaultExampleCard;
            const example = exampleTf || exampleCard;

            const response: Partial<ChoiceJson> & Partial<ResponseJson> = {
              isCorrect: tfTags.isCorrect,
              _isDefaultExample,
              example,
            };
            if (insertResponses) response.response = tfTags.text;
            else response.choice = tfTags.text;
            if (response) responsesOrChoices.push(response);
          }

          if (insertResponses) tags.responses = responsesOrChoices as ResponseJson[];
          else tags.choices = responsesOrChoices as ChoiceJson[];
        }

        // if (tags.choices || tags.responses) {
        const quiz = builder.buildQuiz({
          ...tags,
          _isDefaultExample: isDefaultExampleCard,
          _defaultExample: exampleCard,
        });
        if (quiz) quizzes.push(quiz);
        // } else {
        //   context.addWarning('Ignoring card with empty quiz', content);
        // }
      }
    }
  }

  // Add a quiz for the V1 choices / responses
  if (insertChoices && Array.isArray(choicesV1) && choicesV1.length > 0) {
    const quiz = builder.buildQuiz({
      choices: choicesV1,
    });
    if (quiz) quizzes.push(quiz);
  }
  if (insertResponses && Array.isArray(responsesV1) && responsesV1.length > 0) {
    const quiz = builder.buildQuiz({
      responses: responsesV1,
    });
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
  const questions: QuestionJson[] = [];

  for (const card of cardSet.cards) {
    for (const side of card.sides) {
      for (const content of side.variants) {
        const tags = content.data;

        // if (tags.cardBody) {
        const q = builder.buildQuestion({
          question: tags.cardBodyStr ?? Breakscape.EMPTY_STRING,
          ...tags,
        });
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
  let sideIdx = 0;
  let isHeading = false;
  let heading: HeadingJson | undefined;
  const pairs: PairJson[] = [];
  let forKeys: string | undefined = undefined;
  let forValues: string[] = [];
  let pairKey: string | undefined = undefined;
  let pairValues: string[] = [];
  let _pairValuesAst: TextAst[] = [];
  let keyAudio: AudioResourceJson | undefined = undefined;
  let keyImage: ImageResourceJson | undefined = undefined;
  let extraTags: BitContentProcessorResult = {};
  let isDefaultExampleCardSet = false;
  let exampleCardSet: ExampleJson | undefined;
  let isDefaultExampleCard = false;
  let exampleCard: ExampleJson | undefined;
  // let variant: ProcessedCardVariant | undefined;

  for (const card of cardSet.cards) {
    isHeading = false;
    forKeys = undefined;
    forValues = [];
    pairKey = undefined;
    pairValues = [];
    _pairValuesAst = [];
    keyAudio = undefined;
    keyImage = undefined;
    sideIdx = 0;
    extraTags = {};
    isDefaultExampleCard = false;
    exampleCard = undefined;

    for (const side of card.sides) {
      for (const content of side.variants) {
        // variant = content;
        const { cardBody, cardBodyStr, title, resources, _isDefaultExample, example, ...tags } = content.data;

        // Example
        isDefaultExampleCard = _isDefaultExample === true ? true : isDefaultExampleCard;
        exampleCard = example ? (example as TextAst) : exampleCard;

        // Get the 'heading' which is the [#title] at level 1
        const heading = title && title[1].titleString;
        if (heading != null) isHeading = true;

        if (sideIdx === 0) {
          // First side
          forKeys = heading;
          if (heading != null) {
            isDefaultExampleCardSet = _isDefaultExample === true ? true : isDefaultExampleCardSet;
            exampleCardSet = example ? (example as TextAst) : exampleCardSet;
          } else if (Array.isArray(resources) && resources.length > 0) {
            // TODO - should search the correct resource type based on the bit type
            const resource = resources[0];
            // console.log('WARNING: Match card has resource on first side', tags.resource);
            if (resource.type === ResourceTag.audio) {
              keyAudio = (resource as AudioResourceWrapperJson).audio;
            } else if (resource.type === ResourceTag.image) {
              keyImage = (resource as ImageResourceWrapperJson).image;
            }
          } else {
            // If not a heading or resource, it is a pair
            pairKey = cardBodyStr;
          }
        } else {
          // Subsequent sides
          forValues.push(heading ?? '');
          if (heading != null) {
            isDefaultExampleCardSet = _isDefaultExample === true ? true : isDefaultExampleCardSet;
            exampleCardSet = example ? (example as TextAst) : exampleCardSet;
          } else if (title == null) {
            // If not a heading, it is a pair
            const value = cardBodyStr ?? Breakscape.EMPTY_STRING;
            const valueAst = cardBody?.body as TextAst;
            pairValues.push(value);
            _pairValuesAst.push(valueAst);
            if ((isDefaultExampleCardSet || isDefaultExampleCard) && !exampleCard) exampleCard = valueAst;
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
      let forValuesFinal: string | string[] = forValues;
      if (Config.isOfBitType(bitType, BitType.matchMatrix)) {
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
      heading = builder.buildHeading({
        forKeys: forKeys ?? '',
        forValues: forValuesFinal,
      });
    } else {
      // if (pairKey || keyAudio || keyImage) {
      // Calculate final example and _isDefaultExample
      if (isDefaultExampleCard) exampleCardSet = undefined;
      const _isDefaultExample = isDefaultExampleCard || isDefaultExampleCardSet;
      const example = exampleCard || exampleCardSet;

      const pair = builder.buildPair(bitType, {
        key: pairKey ?? '',
        keyAudio,
        keyImage,
        values: pairValues,
        _valuesAst: _pairValuesAst,
        ...extraTags,
        _isDefaultExample,
        example,
      });
      if (pair) pairs.push(pair);
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
  let heading: HeadingJson | undefined;
  let forKeys: string | undefined = undefined;
  let forValues: string[] = [];
  let matrixKey: string | undefined = undefined;
  let matrixKeyTags: BitContentProcessorResult | undefined = undefined;
  const matrix: MatrixJson[] = [];
  let matrixCells: MatrixCellJson[] = [];
  let matrixCellValues: string[] = [];
  let _matrixCellValuesAst: TextAst[] = [];
  let matrixCellTags: BitContentProcessorResult = {};
  let isDefaultExampleCardSet = false;
  let exampleCardSet: ExampleJson | undefined;
  let isDefaultExampleCard = false;
  let exampleCard: ExampleJson | undefined;
  let isDefaultExampleSide = false;
  let exampleSide: ExampleJson | undefined;
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
    _matrixCellValuesAst = [];
    sideIdx = 0;
    isDefaultExampleCard = false;
    exampleCard = undefined;
    isCaseSensitiveMatrix = undefined;

    for (const side of card.sides) {
      matrixCellValues = [];
      _matrixCellValuesAst = [];
      matrixCellTags = {};
      isDefaultExampleSide = false;
      exampleSide = undefined;
      isCaseSensitiveCell = undefined;

      for (const content of side.variants) {
        // variant = content;
        const tags = content.data;

        const { title, cardBody, cardBodyStr, _isDefaultExample, example, isCaseSensitive, ...restTags } = tags;

        // Example
        isDefaultExampleSide = _isDefaultExample === true ? true : isDefaultExampleSide;
        exampleSide = example ? example : exampleSide;

        // Merge the tags into the matrix cell tags
        Object.assign(matrixCellTags, restTags);

        // Get the 'heading' which is the [#title] at level 1
        const heading = title && title[1].titleString;
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
            isDefaultExampleCardSet = _isDefaultExample === true ? true : isDefaultExampleCardSet;
            exampleCardSet = example ? example : exampleCardSet;
          } else {
            // If not a heading or resource, it is a matrix
            matrixKey = cardBodyStr;
            matrixKeyTags = restTags;
            isDefaultExampleCard = _isDefaultExample === true ? true : isDefaultExampleCard;
            exampleCard = example ? example : exampleCard;
            isCaseSensitiveMatrix = isCaseSensitive != null ? isCaseSensitive : isCaseSensitiveMatrix;
          }
        } else {
          // Subsequent sides
          forValues.push(heading ?? Breakscape.EMPTY_STRING);
          if (heading != null) {
            isDefaultExampleCardSet = _isDefaultExample === true ? true : isDefaultExampleCardSet;
            exampleCardSet = example ? example : exampleCardSet;
          } else if (tags.title == null) {
            // If not a heading, it is a matrix cell value
            const value = cardBodyStr ?? Breakscape.EMPTY_STRING;
            const valueAst = cardBody?.body as TextAst;
            matrixCellValues.push(value);
            _matrixCellValuesAst.push(valueAst);
            if ((isDefaultExampleCardSet || isDefaultExampleSide) && !exampleSide) exampleSide = valueAst;
            isCaseSensitiveCell = isCaseSensitive != null ? isCaseSensitive : isCaseSensitiveMatrix;
          }
        }
      }

      // Finished looping variants, create matrix cell
      if (sideIdx > 0) {
        // Calculate final example and _isDefaultExample
        if (isDefaultExampleSide) exampleCard = exampleCardSet = undefined;
        if (isDefaultExampleCard) exampleCardSet = undefined;
        const _isDefaultExample = isDefaultExampleSide || isDefaultExampleCard || isDefaultExampleCardSet;
        const example = exampleSide || exampleCard || exampleCardSet;

        const matrixCell = builder.buildMatrixCell({
          values: matrixCellValues,
          _valuesAst: _matrixCellValuesAst,
          ...matrixCellTags,
          _isDefaultExample: _isDefaultExample,
          example,
          isCaseSensitive: isCaseSensitiveCell,
        });
        if (matrixCell) matrixCells.push(matrixCell);
      }

      sideIdx++;
    }

    if (isHeading) {
      heading = builder.buildHeading({
        forKeys: forKeys ?? Breakscape.EMPTY_STRING,
        forValues,
      });
    } else {
      // if (matrixKey) {
      const m = builder.buildMatrix({
        key: matrixKey ?? Breakscape.EMPTY_STRING,
        // item: matrixItem ?? Breakscape.EMPTY_STRING,
        // keyAudio,
        // keyImage,
        cells: matrixCells,
        ...matrixKeyTags,
      });
      if (m) matrix.push(m);
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
  const columns: string[] = [];
  const rows: string[][] = [];
  let rowValues: string[] = [];

  for (const card of cardSet.cards) {
    isHeading = false;
    rowValues = [];

    for (const side of card.sides) {
      for (const content of side.variants) {
        // variant = content;
        const tags = content.data;

        const { title, cardBodyStr } = tags;

        // Get the 'heading' which is the [#title] at level 1
        const heading = title && title[1].titleString;
        if (cardIdx === 0 && heading != null) isHeading = true;

        if (isHeading) {
          columns.push(heading ?? '');
        } else {
          // If not a heading, it is a row cell value
          const value = cardBodyStr ?? '';
          rowValues.push(value);
        }
      }
    }

    if (!isHeading) {
      rows.push(rowValues);
    }

    cardIdx++;
  }

  const table = builder.buildTable({
    columns,
    data: rows,
  });

  return { table };
}

function parseBotActionResponses(
  _context: BitmarkPegParserContext,
  _bitType: BitTypeType,
  cardSet: ProcessedCardSet,
): BitSpecificCards {
  const botResponses: BotResponseJson[] = [];

  for (const card of cardSet.cards) {
    for (const side of card.sides) {
      for (const content of side.variants) {
        const { _instructionString, reaction, cardBodyStr: feedback, ...tags } = content.data;

        const botResponse = builder.botResponse({
          response: _instructionString ?? Breakscape.EMPTY_STRING,
          reaction: reaction ?? Breakscape.EMPTY_STRING,
          feedback: feedback ?? Breakscape.EMPTY_STRING,
          ...tags,
        });
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
  const ingredients: IngredientJson[] = [];

  for (const card of cardSet.cards) {
    for (const side of card.sides) {
      for (const content of side.variants) {
        const {
          title: titleArray,
          _instructionString,
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
        let quantity: number | undefined = NumberUtils.asNumber(_instructionString);
        if (cardBody && cardBody.bodyBits) {
          const select: SelectJson | undefined = cardBody.bodyBits.find((c) => c.type === BodyBitType.select) as
            | SelectJson
            | undefined;
          if (select) {
            quantity = select._instructionString ? NumberUtils.asNumber(select._instructionString) : quantity;
            if (select.options && select.options.length > 0) {
              checked = select.options[0].isCorrect;
            }
          }
        }

        const ingredient = builder.buildIngredient({
          title,
          checked,
          // TS compiler very weird. It doesn't recognize that cardBodyStr is a string|undefined, even if cast!
          // Casting to 'any' to avoid the error
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          item: cardBodyStr as any,
          quantity,
          unit: unit ?? Breakscape.EMPTY_STRING,
          unitAbbr: unitAbbr ?? Breakscape.EMPTY_STRING,
          decimalPlaces: decimalPlaces ?? 1,
          disableCalculation: disableCalculation,
          ...tags,
        });
        if (ingredient) ingredients.push(ingredient);
      }
    }
  }

  return {
    ingredients: ingredients.length > 0 ? ingredients : undefined,
  };
}

function parseCaptionDefinitionsList(
  _context: BitmarkPegParserContext,
  _bitType: BitTypeType,
  cardSet: ProcessedCardSet,
): BitSpecificCards {
  let cardIdx = 0;
  let isHeading = false;
  const columns: string[] = [];
  const rows: string[][] = [];
  let rowValues: string[] = [];

  for (const card of cardSet.cards) {
    isHeading = false;
    rowValues = [];

    for (const side of card.sides) {
      for (const content of side.variants) {
        // variant = content;
        const tags = content.data;

        const { title, cardBodyStr } = tags;

        // Get the 'heading' which is the [#title] at level 1
        const heading = title && title[1].titleString;
        if (cardIdx === 0 && heading != null) isHeading = true;

        if (isHeading) {
          columns.push(heading ?? '');
        } else {
          // If not a heading, it is a row cell value
          const value = cardBodyStr ?? '';
          rowValues.push(value);
        }
      }
    }

    if (!isHeading) {
      rows.push(rowValues);
    }

    cardIdx++;
  }

  const captionDefinitionList =
    columns.length > 0
      ? builder.buildCaptionDefinitionList({
          columns,
          definitions: rows
            .map((row) => {
              return builder.buildCaptionDefinition({
                term: row[0],
                description: row[1],
              });
            })
            .filter((d) => d != null),
        })
      : undefined;

  return { captionDefinitionList };
}

function parseCardBits(
  _context: BitmarkPegParserContext,
  _bitType: BitTypeType,
  textFormat: TextFormatType,
  cardSet: ProcessedCardSet,
): BitSpecificCards {
  const cardBits: CardBit[] = [];

  for (const card of cardSet.cards) {
    for (const side of card.sides) {
      for (const content of side.variants) {
        const { cardBody: body, ...rest } = content.data;

        const cardBit = builder.buildCardBit(textFormat, {
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

export { buildCards };
