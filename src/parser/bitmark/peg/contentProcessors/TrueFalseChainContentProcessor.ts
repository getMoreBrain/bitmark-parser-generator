import { Config } from '../../../../config/Config.ts';
import { type BodyPart } from '../../../../model/ast/Nodes.ts';
import { type TagsConfig } from '../../../../model/config/TagsConfig.ts';
import { BitType } from '../../../../model/enum/BitType.ts';
import { BodyBitType } from '../../../../model/enum/BodyBitType.ts';
import {
  type ChoiceJson,
  type ResponseJson,
  type StatementJson,
} from '../../../../model/json/BitJson.ts';
import {
  type HighlightJson,
  type HighlightTextJson,
  type SelectJson,
  type SelectOptionJson,
} from '../../../../model/json/BodyBitJson.ts';
import {
  type BitContent,
  BitContentLevel,
  type BitContentProcessorResult,
  type BitmarkPegParserContext,
  type ContentDepthType,
  type StatementsOrChoicesOrResponses,
  type TrueFalseValue,
  TypeKey,
} from '../BitmarkPegParserTypes.ts';
import { trueFalseTagContentProcessor } from './TrueFalseTagContentProcessor.ts';

function trueFalseChainContentProcessor(
  context: BitmarkPegParserContext,
  contentDepth: ContentDepthType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
  bodyParts: BodyPart[],
): void {
  if (contentDepth === BitContentLevel.Chain) {
    trueFalseTagContentProcessor(context, BitContentLevel.Chain, content, target);
  } else {
    buildTrueFalse(context, contentDepth, tagsConfig, content, target, bodyParts);
  }
}

function buildTrueFalse(
  context: BitmarkPegParserContext,
  _contentDepth: ContentDepthType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
  bodyParts: BodyPart[],
): void {
  const { bitType } = context;
  const chainContent = [content, ...(content.chain ?? [])];

  const statements = target.statements;
  const choices = target.choices;
  const responses = target.responses;

  if (!statements || !choices || !responses || !bodyParts) return;

  if (Config.isOfBitType(bitType, BitType.trueFalse1)) {
    // Treat as true/false for statement
    target.statement = buildStatement(context, tagsConfig, chainContent);
  } else if (
    Config.isOfBitType(bitType, [
      BitType.trueFalse,
      BitType.multipleChoice,
      BitType.multipleChoice1,
      BitType.multipleResponse,
      BitType.multipleResponse1,
      BitType.feedback,
    ])
  ) {
    // Treat as true/false for choices / responses
    const tf = buildStatementsChoicesResponses(context, tagsConfig, chainContent);

    if (tf.statements) statements.push(...tf.statements);
    if (tf.choices) choices.push(...tf.choices);
    if (tf.responses) responses.push(...tf.responses);
  } else if (Config.isOfBitType(bitType, BitType.highlightText)) {
    // Treat as highlight text
    const highlight = buildHighlight(context, tagsConfig, chainContent);
    if (highlight) bodyParts.push(highlight as BodyPart);
  } else {
    // Treat as select
    const select = buildSelect(context, tagsConfig, chainContent);
    if (select) bodyParts.push(select as BodyPart);
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
  tagsConfig: TagsConfig | undefined,
  trueFalseContent: BitContent[],
): Partial<StatementJson> | undefined {
  const { bitType } = context;
  if (!Config.isOfBitType(bitType, BitType.trueFalse1)) return undefined;

  if (context.DEBUG_CHAIN_CONTENT)
    context.debugPrint('trueFalse V1 content (statement)', trueFalseContent);

  const { trueFalse, ...tags } = context.bitContentProcessor(
    BitContentLevel.Chain,
    tagsConfig,
    trueFalseContent,
  );

  if (context.DEBUG_CHAIN_TAGS) context.debugPrint('trueFalse V1 tags (statement)', tags);

  let statement: Partial<StatementJson> | undefined;

  let firstTrueFalse: TrueFalseValue | undefined;
  if (trueFalse && trueFalse.length > 0) {
    firstTrueFalse = trueFalse[0];
  }

  if (firstTrueFalse) {
    // Have to remove the statement JSON tag to keep typescript happy
    const { statement: _ignore, ...tagsRest } = tags;
    statement = { ...firstTrueFalse, statement: firstTrueFalse.text, ...tagsRest };
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
  tagsConfig: TagsConfig | undefined,
  trueFalseContent: BitContent[],
): StatementsOrChoicesOrResponses {
  const { bitType } = context;
  // NOTE: We handle V1 tags in V2 multiple-choice / multiple-response for maxium backwards compatibility
  const insertStatements = Config.isOfBitType(bitType, BitType.trueFalse);
  const insertChoices = Config.isOfBitType(bitType, [
    BitType.multipleChoice,
    BitType.multipleChoice1,
    BitType.feedback,
  ]);
  const insertResponses = Config.isOfBitType(bitType, [
    BitType.multipleResponse,
    BitType.multipleResponse1,
  ]);
  if (!insertStatements && !insertChoices && !insertResponses) return {};

  const statements: Partial<StatementJson>[] = [];
  const choices: Partial<ChoiceJson>[] = [];
  const responses: Partial<ResponseJson>[] = [];

  const trueFalseContents = context.splitBitContent(trueFalseContent, [
    TypeKey.True,
    TypeKey.False,
  ]);

  if (context.DEBUG_CHAIN_CONTENT) {
    context.debugPrint('trueFalse V1 content (choices/responses)', trueFalseContents);
  }

  for (const contents of trueFalseContents) {
    const { trueFalse, ...tags } = context.bitContentProcessor(
      BitContentLevel.Chain,
      tagsConfig,
      contents,
    );

    if (context.DEBUG_CHAIN_TAGS) context.debugPrint('trueFalse V1 tags (choices/responses)', tags);

    let firstTrueFalse: TrueFalseValue | undefined;
    if (trueFalse && trueFalse.length > 0) {
      firstTrueFalse = trueFalse[0];
    }

    if (firstTrueFalse) {
      if (insertStatements) {
        // Have to remove the statement JSON tag to keep typescript happy
        const { statement: _ignore, ...tagsRest } = tags;

        const statement: Partial<StatementJson> = {
          ...firstTrueFalse,
          statement: firstTrueFalse.text,
          ...tagsRest,
        };
        if (statement) statements.push(statement);
      } else if (insertChoices) {
        const choice = { ...firstTrueFalse, choice: firstTrueFalse.text, ...tags };
        if (choice) choices.push(choice);
      } else if (insertResponses) {
        const response = { ...firstTrueFalse, response: firstTrueFalse.text, ...tags };
        if (response) responses.push(response);
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
  tagsConfig: TagsConfig | undefined,
  highlightContent: BitContent[],
): Partial<HighlightJson> | undefined {
  if (context.DEBUG_CHAIN_CONTENT) context.debugPrint('highlight content', highlightContent);

  const { trueFalse, ...tags } = context.bitContentProcessor(
    BitContentLevel.Chain,
    tagsConfig,
    highlightContent,
  );

  if (context.DEBUG_CHAIN_TAGS) context.debugPrint('highlight TAGS', { trueFalse, ...tags });

  const texts: Partial<HighlightTextJson>[] = [];
  if (trueFalse) {
    for (const tf of trueFalse) {
      const ht: Partial<HighlightTextJson> = { ...tf, isHighlighted: false };
      if (ht) texts.push(ht);
    }
  }

  const highlight: Partial<HighlightJson> = {
    type: BodyBitType.highlight,
    texts: texts as HighlightTextJson[],
    ...tags,
  };

  return highlight;
}

function buildSelect(
  context: BitmarkPegParserContext,
  tagsConfig: TagsConfig | undefined,
  selectContent: BitContent[],
): Partial<SelectJson> | undefined {
  if (context.DEBUG_CHAIN_CONTENT) context.debugPrint('select content', selectContent);

  const { trueFalse, ...tags } = context.bitContentProcessor(
    BitContentLevel.Chain,
    tagsConfig,
    selectContent,
  );

  if (context.DEBUG_CHAIN_TAGS) context.debugPrint('select TAGS', { trueFalse, ...tags });

  const options: Partial<SelectOptionJson>[] = [];
  if (trueFalse) {
    for (const tf of trueFalse) {
      const so: Partial<SelectOptionJson> = tf;
      if (so) options.push(so);
    }
  }

  const select: Partial<SelectJson> = {
    type: BodyBitType.select,
    options: options as SelectOptionJson[],
    ...tags,
  };

  return select;
}

export { trueFalseChainContentProcessor };
