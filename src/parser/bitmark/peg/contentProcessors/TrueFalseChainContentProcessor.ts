import { Builder } from '../../../../ast/Builder';
import { Config } from '../../../../config/Config';
import { BodyPart } from '../../../../model/ast/Nodes';
import { TagsConfig } from '../../../../model/config/TagsConfig';
import { BitType, BitTypeType } from '../../../../model/enum/BitType';
import { TextFormatType } from '../../../../model/enum/TextFormat';
import { ChoiceJson, ResponseJson, StatementJson } from '../../../../model/json/BitJson';
import { HighlightJson, HighlightTextJson, SelectJson, SelectOptionJson } from '../../../../model/json/BodyBitJson';

import { trueFalseTagContentProcessor } from './TrueFalseTagContentProcessor';

import {
  BitContent,
  BitContentLevel,
  ContentDepthType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
  StatementsOrChoicesOrResponses,
  TypeKey,
  TrueFalseValue,
} from '../BitmarkPegParserTypes';

const builder = new Builder();

function trueFalseChainContentProcessor(
  context: BitmarkPegParserContext,
  contentDepth: ContentDepthType,
  bitType: BitTypeType,
  textFormat: TextFormatType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
  bodyParts: BodyPart[],
): void {
  if (contentDepth === BitContentLevel.Chain) {
    trueFalseTagContentProcessor(context, BitContentLevel.Chain, bitType, textFormat, content, target);
  } else {
    buildTrueFalse(context, contentDepth, bitType, textFormat, tagsConfig, content, target, bodyParts);
  }
}

function buildTrueFalse(
  context: BitmarkPegParserContext,
  _contentDepth: ContentDepthType,
  bitType: BitTypeType,
  textFormat: TextFormatType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
  bodyParts: BodyPart[],
): void {
  const chainContent = [content, ...(content.chain ?? [])];

  const statements = target.statements;
  const choices = target.choices;
  const responses = target.responses;

  if (!statements || !choices || !responses || !bodyParts) return;

  if (Config.isOfBitType(bitType, BitType.trueFalse1)) {
    // Treat as true/false for statement
    target.statement = buildStatement(context, bitType, textFormat, tagsConfig, chainContent);
  } else if (
    Config.isOfBitType(bitType, [
      BitType.trueFalse,
      BitType.multipleChoice,
      BitType.multipleChoice1,
      BitType.multipleResponse,
      BitType.multipleResponse1,
    ])
  ) {
    // Treat as true/false for choices / responses
    const tf = buildStatementsChoicesResponses(context, bitType, textFormat, tagsConfig, chainContent);

    if (tf.statements) statements.push(...tf.statements);
    if (tf.choices) choices.push(...tf.choices);
    if (tf.responses) responses.push(...tf.responses);
  } else if (Config.isOfBitType(bitType, BitType.highlightText)) {
    // Treat as highlight text
    const highlight = buildHighlight(context, bitType, textFormat, tagsConfig, chainContent);
    if (highlight) bodyParts.push(highlight);
  } else {
    // Treat as select
    const select = buildSelect(context, bitType, textFormat, tagsConfig, chainContent);
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
  textFormat: TextFormatType,
  tagsConfig: TagsConfig | undefined,
  trueFalseContent: BitContent[],
): StatementJson | undefined {
  if (!Config.isOfBitType(bitType, BitType.trueFalse1)) return undefined;

  if (context.DEBUG_CHAIN_CONTENT) context.debugPrint('trueFalse V1 content (statement)', trueFalseContent);

  const { trueFalse, ...tags } = context.bitContentProcessor(
    BitContentLevel.Chain,
    bitType,
    textFormat,
    tagsConfig,
    trueFalseContent,
  );

  if (context.DEBUG_CHAIN_TAGS) context.debugPrint('trueFalse V1 tags (statement)', tags);

  let statement: StatementJson | undefined;

  let firstTrueFalse: TrueFalseValue | undefined;
  if (trueFalse && trueFalse.length > 0) {
    firstTrueFalse = trueFalse[0];
  }

  if (firstTrueFalse) {
    // Have to remove the statement JSON tag to keep typescript happy
    const { statement: _ignore, ...tagsRest } = tags;
    _ignore;
    statement = builder.statement({ ...firstTrueFalse, statement: firstTrueFalse.text, ...tagsRest });
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
  textFormat: TextFormatType,
  tagsConfig: TagsConfig | undefined,
  trueFalseContent: BitContent[],
): StatementsOrChoicesOrResponses {
  // NOTE: We handle V1 tags in V2 multiple-choice / multiple-response for maxium backwards compatibility
  const insertStatements = Config.isOfBitType(bitType, BitType.trueFalse);
  const insertChoices = Config.isOfBitType(bitType, [BitType.multipleChoice, BitType.multipleChoice1]);
  const insertResponses = Config.isOfBitType(bitType, [BitType.multipleResponse, BitType.multipleResponse1]);
  if (!insertStatements && !insertChoices && !insertResponses) return {};

  const statements: StatementJson[] = [];
  const choices: ChoiceJson[] = [];
  const responses: ResponseJson[] = [];

  const trueFalseContents = context.splitBitContent(trueFalseContent, [TypeKey.True, TypeKey.False]);

  if (context.DEBUG_CHAIN_CONTENT) {
    context.debugPrint('trueFalse V1 content (choices/responses)', trueFalseContents);
  }

  for (const contents of trueFalseContents) {
    const { trueFalse, ...tags } = context.bitContentProcessor(
      BitContentLevel.Chain,
      bitType,
      textFormat,
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
        _ignore;

        const statement = builder.statement({ ...firstTrueFalse, statement: firstTrueFalse.text, ...tagsRest });
        if (statement) statements.push(statement);
      } else if (insertChoices) {
        const choice = builder.choice({ ...firstTrueFalse, choice: firstTrueFalse.text, ...tags });
        if (choice) choices.push(choice);
      } else if (insertResponses) {
        const response = builder.response({ ...firstTrueFalse, response: firstTrueFalse.text, ...tags });
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
  bitType: BitTypeType,
  textFormat: TextFormatType,
  tagsConfig: TagsConfig | undefined,
  highlightContent: BitContent[],
): HighlightJson | undefined {
  if (context.DEBUG_CHAIN_CONTENT) context.debugPrint('highlight content', highlightContent);

  const { trueFalse, ...tags } = context.bitContentProcessor(
    BitContentLevel.Chain,
    bitType,
    textFormat,
    tagsConfig,
    highlightContent,
  );

  if (context.DEBUG_CHAIN_TAGS) context.debugPrint('highlight TAGS', { trueFalse, ...tags });

  const texts: HighlightTextJson[] = [];
  if (trueFalse) {
    for (const tf of trueFalse) {
      const ht = builder.highlightText({ ...tf, isHighlighted: false });
      if (ht) texts.push(ht);
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
  textFormat: TextFormatType,
  tagsConfig: TagsConfig | undefined,
  selectContent: BitContent[],
): SelectJson | undefined {
  if (context.DEBUG_CHAIN_CONTENT) context.debugPrint('select content', selectContent);

  const { trueFalse, ...tags } = context.bitContentProcessor(
    BitContentLevel.Chain,
    bitType,
    textFormat,
    tagsConfig,
    selectContent,
  );

  if (context.DEBUG_CHAIN_TAGS) context.debugPrint('select TAGS', { trueFalse, ...tags });

  const options: SelectOptionJson[] = [];
  if (trueFalse) {
    for (const tf of trueFalse) {
      const so = builder.selectOption(tf);
      if (so) options.push(so);
    }
  }

  const select = builder.select({
    options,
    ...tags,
  });

  return select;
}

export { trueFalseChainContentProcessor };
