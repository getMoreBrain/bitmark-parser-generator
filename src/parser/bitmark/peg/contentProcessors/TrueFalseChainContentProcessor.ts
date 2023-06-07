import { Builder } from '../../../../ast/Builder';
import { BitType, BitTypeType } from '../../../../model/enum/BitType';

import { trueFalseTagContentProcessor } from './TrueFalseTagContentProcessor';

import {
  BodyPart,
  Choice,
  Highlight,
  HighlightText,
  Response,
  Select,
  SelectOption,
  Statement,
} from '../../../../model/ast/Nodes';
import {
  BitContent,
  BitContentLevel,
  BitContentLevelType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
  StatementsOrChoicesOrResponses,
  TypeKey,
} from '../BitmarkPegParserTypes';

const builder = new Builder();

function trueFalseChainContentProcessor(
  context: BitmarkPegParserContext,
  bitLevel: BitContentLevelType,
  bitType: BitTypeType,
  content: BitContent,
  target: BitContentProcessorResult,
  bodyParts: BodyPart[],
): void {
  if (bitLevel === BitContentLevel.Chain) {
    trueFalseTagContentProcessor(context, BitContentLevel.Chain, bitType, content, target);
  } else {
    buildTrueFalse(context, bitLevel, bitType, content, target, bodyParts);
  }
}

function buildTrueFalse(
  context: BitmarkPegParserContext,
  _bitLevel: BitContentLevelType,
  bitType: BitTypeType,
  content: BitContent,
  target: BitContentProcessorResult,
  bodyParts: BodyPart[],
): void {
  const chainContent = [content, ...(content.chain ?? [])];

  const statements = target.statements;
  const choices = target.choices;
  const responses = target.responses;

  if (!statements || !choices || !responses || !bodyParts) return;

  if (bitType === BitType.trueFalse1) {
    // Treat as true/false for statement
    target.statement = buildStatement(context, bitType, chainContent);
  } else if (
    bitType === BitType.trueFalse ||
    bitType === BitType.multipleChoice ||
    bitType === BitType.multipleChoice1 ||
    bitType === BitType.multipleResponse ||
    bitType === BitType.multipleResponse1
  ) {
    // Treat as true/false for choices / responses
    const tf = buildStatementsChoicesResponses(context, bitType, chainContent);

    if (tf.statements) statements.push(...tf.statements);
    if (tf.choices) choices.push(...tf.choices);
    if (tf.responses) responses.push(...tf.responses);
  } else if (bitType === BitType.highlightText) {
    // Treat as highlight text
    const highlight = buildHighlight(context, bitType, chainContent);
    if (highlight) bodyParts.push(highlight);
  } else {
    // Treat as select
    const select = buildSelect(context, bitType, chainContent);
    if (select) bodyParts.push(select);
  }
}

/**
 * Build statement for the bit:
 * .trueFalse-1
 *
 * @param bitType
 * @param trueFalseContent
 * @returns
 */
function buildStatement(
  context: BitmarkPegParserContext,
  bitType: BitTypeType,
  trueFalseContent: BitContent[],
): Statement | undefined {
  if (bitType !== BitType.trueFalse1) return undefined;

  if (context.DEBUG_CHAIN_CONTENT) context.debugPrint('trueFalse V1 content (statement)', trueFalseContent);

  const { trueFalse, ...tags } = context.bitContentProcessor(BitContentLevel.Chain, bitType, trueFalseContent);

  if (context.DEBUG_CHAIN_TAGS) context.debugPrint('trueFalse V1 tags (statement)', tags);

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
function buildStatementsChoicesResponses(
  context: BitmarkPegParserContext,
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

  const trueFalseContents = context.splitBitContent(trueFalseContent, [TypeKey.True, TypeKey.False]);

  if (context.DEBUG_CHAIN_CONTENT) {
    context.debugPrint('trueFalse V1 content (choices/responses)', trueFalseContents);
  }

  for (const contents of trueFalseContents) {
    const { trueFalse, ...tags } = context.bitContentProcessor(BitContentLevel.Chain, bitType, contents);

    if (context.DEBUG_CHAIN_TAGS) context.debugPrint('trueFalse V1 tags (choices/responses)', tags);

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

function buildHighlight(
  context: BitmarkPegParserContext,
  bitType: BitTypeType,
  highlightContent: BitContent[],
): Highlight | undefined {
  if (context.DEBUG_CHAIN_CONTENT) context.debugPrint('highlight content', highlightContent);

  const { trueFalse, ...tags } = context.bitContentProcessor(BitContentLevel.Chain, bitType, highlightContent);

  if (context.DEBUG_CHAIN_TAGS) context.debugPrint('highlight TAGS', { trueFalse, ...tags });

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

function buildSelect(
  context: BitmarkPegParserContext,
  bitType: BitTypeType,
  selectContent: BitContent[],
): Select | undefined {
  if (context.DEBUG_CHAIN_CONTENT) context.debugPrint('select content', selectContent);

  const { trueFalse, ...tags } = context.bitContentProcessor(BitContentLevel.Chain, bitType, selectContent);

  if (context.DEBUG_CHAIN_TAGS) context.debugPrint('select TAGS', { trueFalse, ...tags });

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

export { trueFalseChainContentProcessor };
