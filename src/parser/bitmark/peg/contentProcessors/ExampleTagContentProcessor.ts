import { BreakscapedString } from '../../../../model/ast/BreakscapedString';
import { RootBitType, BitType } from '../../../../model/enum/BitType';
import { BooleanUtils } from '../../../../utils/BooleanUtils';

import {
  BitContent,
  BitContentLevelType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
  TrueFalseValue,
  TypeValue,
} from '../BitmarkPegParserTypes';

// const builder = new Builder();

function exampleTagContentProcessor(
  context: BitmarkPegParserContext,
  bitType: BitType,
  _bitLevel: BitContentLevelType,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  const { value } = content as TypeValue;
  const example = value as string | boolean;

  // Each bit type handles example tags differently
  switch (bitType.root) {
    case RootBitType.cloze:
    case RootBitType.clozeAndMultipleChoiceText:
    case RootBitType.multipleChoiceText:
    case RootBitType.highlightText:
    case RootBitType.trueFalse:
    case RootBitType.trueFalse1:
    case RootBitType.multipleResponse:
    case RootBitType.multipleResponse1:
    case RootBitType.multipleChoice:
    case RootBitType.multipleChoice1:
      handleGapOrSelectOrTrueFalseExample(context, bitType, content, example, target);
      break;
    case RootBitType.mark:
      // Default only example handling
      handleDefaultOnlyExample(context, bitType, content, example, target);
      break;
    default:
      // Standard example handling
      handleStandardStringExample(context, bitType, content, example, target);
  }
}

function handleGapOrSelectOrTrueFalseExample(
  context: BitmarkPegParserContext,
  bitType: BitType,
  content: BitContent,
  example: string | boolean,
  target: BitContentProcessorResult,
): void {
  let trueFalse: TrueFalseValue | undefined;

  if (Array.isArray(target.trueFalse) && target.trueFalse.length > 0) {
    trueFalse = target.trueFalse[target.trueFalse.length - 1] ?? undefined;
  }

  if (trueFalse) {
    // Example is set on the true/false tag [+...] / [-...]
    if (example === true) {
      trueFalse.isDefaultExample = true;
      trueFalse.example = undefined;
    } else {
      if (BooleanUtils.isBooleanString(example)) {
        trueFalse.example = example as BreakscapedString;
      } else {
        // Example is set to a value other than true / false which is not valid in the case of select
        trueFalse.isDefaultExample = true;
        trueFalse.example = undefined;
        context.addWarning(`Only 'true' / 'false' / default are allowed here, using default`, content);
      }
    }
  } else if (Array.isArray(target.solutions) && target.solutions.length > 0) {
    // Example is set on the gap solution tag [_...]
    if (example === true) {
      // Extract the solution nearest [@example] tag as the example value
      target.example = target.solutions[target.solutions.length - 1] ?? undefined;
    } else {
      target.example = example as BreakscapedString;
    }
  } else {
    // Example is higher up the chain, so how it is handled depends on the bit type
    switch (bitType.root) {
      default:
      case RootBitType.cloze:
        // Treat as a standard string
        handleStandardStringExample(context, bitType, content, example, target);
        break;
      case RootBitType.multipleChoiceText:
      case RootBitType.highlightText:
      case RootBitType.trueFalse:
      case RootBitType.trueFalse1:
      case RootBitType.multipleResponse:
      case RootBitType.multipleResponse1:
        // Treat as a standard boolean
        handleStandardBooleanExample(context, bitType, content, example, target);
        break;
      case RootBitType.clozeAndMultipleChoiceText:
      case RootBitType.multipleChoice:
      case RootBitType.multipleChoice1: {
        // For these bits, a specific example value higher up the chain makes no sense
        // Set example to default, and raise a warning if any value is set.
        target.isDefaultExample = true;
        target.example = undefined;

        if (example !== true) {
          // Example is set to a value other than true / false which is not valid in the case of select
          context.addWarning(`At this level, only default [@example] is allowed, using default`, content);
        }
        break;
      }
    }
  }
}

function handleDefaultOnlyExample(
  context: BitmarkPegParserContext,
  _bitType: BitType,
  content: BitContent,
  example: string | boolean,
  target: BitContentProcessorResult,
): void {
  // This bit can have only default examples - nothing else makes sense
  target.isDefaultExample = true;
  target.example = undefined;

  if (example !== true) {
    // Example is set to a value other than true / false which is not valid in the case of select
    context.addWarning(`Only default [@example] is allowed, using default`, content);
  }
}

function handleStandardBooleanExample(
  context: BitmarkPegParserContext,
  _bitType: BitType,
  content: BitContent,
  example: string | boolean,
  target: BitContentProcessorResult,
): void {
  if (example === true) {
    target.isDefaultExample = true;
    target.example = undefined;
  } else {
    if (BooleanUtils.isBooleanString(example)) {
      target.example = example as BreakscapedString;
    } else {
      // Example is set to a value other than true / false which is not valid in the case of select
      target.isDefaultExample = true;
      target.example = undefined;
      context.addWarning(`Only 'true' / 'false' / default are allowed here, using default`, content);
    }
  }
}

function handleStandardStringExample(
  _context: BitmarkPegParserContext,
  _bitType: BitType,
  _content: BitContent,
  example: string | boolean,
  target: BitContentProcessorResult,
): void {
  if (example === true) {
    target.isDefaultExample = true;
    target.example = undefined;
  } else {
    target.example = example as BreakscapedString;
  }
}

export { exampleTagContentProcessor };
