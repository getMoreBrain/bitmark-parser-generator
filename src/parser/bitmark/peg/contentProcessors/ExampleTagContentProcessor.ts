import { Breakscape } from '../../../../breakscaping/Breakscape';
import { Config } from '../../../../config/Config';
import { BreakscapedString } from '../../../../model/ast/BreakscapedString';
import { BitType, BitTypeType } from '../../../../model/enum/BitType';
import { TextFormatType } from '../../../../model/enum/TextFormat';
import { BooleanUtils } from '../../../../utils/BooleanUtils';
import { TextParser } from '../../../text/TextParser';

import {
  BitContent,
  ContentDepthType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
  TrueFalseValue,
  TypeValue,
} from '../BitmarkPegParserTypes';

// const builder = new Builder();
const textParser = new TextParser();

function exampleTagContentProcessor(
  context: BitmarkPegParserContext,
  _contentDepth: ContentDepthType,
  bitType: BitTypeType,
  _textFormat: TextFormatType,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  const { value } = content as TypeValue;
  const example = value as BreakscapedString | boolean;

  // Each bit type handles example tags differently
  if (
    Config.isOfBitType(bitType, [
      BitType.cloze,
      BitType.clozeAndMultipleChoiceText,
      BitType.multipleChoiceText,
      BitType.highlightText,
      BitType.trueFalse,
      BitType.trueFalse1,
      BitType.multipleResponse,
      BitType.multipleResponse1,
      BitType.multipleChoice,
      BitType.multipleChoice1,
    ])
  ) {
    //
    handleGapOrSelectOrTrueFalseExample(context, bitType, content, example, target);
    //
  } else if (Config.isOfBitType(bitType, BitType.mark)) {
    // Default only example handling
    handleDefaultOnlyExample(context, bitType, content, example, target);
    //
  } else {
    // Standard example handling
    handleStandardStringExample(context, bitType, content, example, target);
    //
  }
}

function handleGapOrSelectOrTrueFalseExample(
  context: BitmarkPegParserContext,
  bitType: BitTypeType,
  content: BitContent,
  example: BreakscapedString | boolean,
  target: BitContentProcessorResult,
): void {
  let trueFalse: TrueFalseValue | undefined;

  if (Array.isArray(target.trueFalse) && target.trueFalse.length > 0) {
    trueFalse = target.trueFalse[target.trueFalse.length - 1] ?? undefined;
  }

  if (trueFalse) {
    // Example is set on the true/false tag [+...] / [-...]
    if (example === true) {
      trueFalse.__isDefaultExample = true;
      trueFalse.example = !!trueFalse.isCorrect;
    } else {
      if (BooleanUtils.isBooleanString(example)) {
        trueFalse.example = BooleanUtils.toBoolean(example);
      } else {
        // Example is set to a value other than true / false which is not valid in the case of select
        trueFalse.__isDefaultExample = true;
        trueFalse.example = undefined;
        context.addWarning(`Only 'true' / 'false' / default are allowed here, using default`, content);
      }
    }
  } else if (Array.isArray(target.__solutionsAst) && target.__solutionsAst.length > 0) {
    // Example is set on the gap solution tag [_...]
    if (example === true) {
      // Extract the solution nearest [@example] tag as the example value
      target.example = target.__solutionsAst[target.__solutionsAst.length - 1] ?? undefined;
    } else {
      target.example = example ? textParser.toAst(example) : undefined;
    }
  } else {
    // Example is higher up the chain, so how it is handled depends on the bit type
    if (
      Config.isOfBitType(bitType, [
        BitType.multipleChoiceText,
        BitType.highlightText,
        BitType.trueFalse,
        BitType.trueFalse1,
        BitType.multipleResponse,
        BitType.multipleResponse1,
      ])
    ) {
      // Treat as a standard boolean
      handleStandardBooleanExample(context, bitType, content, example, target);
      //
    } else if (
      Config.isOfBitType(bitType, [BitType.clozeAndMultipleChoiceText, BitType.multipleChoice, BitType.multipleChoice1])
    ) {
      // For these bits, a specific example value higher up the chain makes no sense
      // Set example to default, and raise a warning if any value is set.
      target.__isDefaultExample = true;
      target.example = undefined;

      if (example !== true) {
        // Example is set to a value other than true / false which is not valid in the case of select
        context.addWarning(`At this level, only default [@example] is allowed, using default`, content);
      }
      //
    } else {
      // Treat as a standard string
      handleStandardStringExample(context, bitType, content, example, target);
      //
    }
  }
}

function handleDefaultOnlyExample(
  context: BitmarkPegParserContext,
  _bitType: BitTypeType,
  content: BitContent,
  example: string | boolean,
  target: BitContentProcessorResult,
): void {
  // This bit can have only default examples - nothing else makes sense
  target.__isDefaultExample = true;
  target.example = undefined;

  if (example !== true) {
    // Example is set to a value other than true / false which is not valid in the case of select
    context.addWarning(`Only default [@example] is allowed, using default`, content);
  }
}

function handleStandardBooleanExample(
  context: BitmarkPegParserContext,
  _bitType: BitTypeType,
  content: BitContent,
  example: BreakscapedString | boolean,
  target: BitContentProcessorResult,
): void {
  if (example === true) {
    target.__isDefaultExample = true;
    target.example = undefined;
  } else {
    const exampleStr = example ? Breakscape.unbreakscape(example) : undefined;
    if (BooleanUtils.isBooleanString(exampleStr)) {
      target.example = BooleanUtils.toBoolean(exampleStr);
    } else {
      // Example is set to a value other than true / false which is not valid in the case of select
      target.__isDefaultExample = true;
      target.example = undefined;
      context.addWarning(`Only 'true' / 'false' / default are allowed here, using default`, content);
    }
  }
}

function handleStandardStringExample(
  _context: BitmarkPegParserContext,
  _bitType: BitTypeType,
  _content: BitContent,
  example: BreakscapedString | boolean,
  target: BitContentProcessorResult,
): void {
  if (example === true || example === 'true') {
    target.__isDefaultExample = true;
    target.example = undefined;
  } else {
    target.example = example ? textParser.toAst(example) : undefined;
  }
}

export { exampleTagContentProcessor };
