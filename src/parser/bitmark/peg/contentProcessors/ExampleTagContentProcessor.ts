import { BitType, BitTypeType } from '../../../../model/enum/BitType';
import { BooleanUtils } from '../../../../utils/BooleanUtils';
import { StringUtils } from '../../../../utils/StringUtils';

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
  _bitLevel: BitContentLevelType,
  bitType: BitTypeType,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  const { value } = content as TypeValue;
  const example = value as string | boolean;

  // Each bit type handles example tags differently

  switch (bitType) {
    case BitType.cloze:
    case BitType.clozeSolutionGrouped:
    case BitType.clozeInstructionGrouped:
    case BitType.clozeAndMultipleChoiceText:
    case BitType.multipleChoiceText:
    case BitType.highlightText:
      handleGapOrSelectExample(context, bitType, example, target);
      break;
    case BitType.match:
    case BitType.matchAll:
    case BitType.matchAllReverse:
    case BitType.matchAudio:
    case BitType.matchPicture:
    case BitType.matchReverse:
    case BitType.matchSolutionGrouped:
    case BitType.matchMatrix:
    case BitType.sequence:
      // Standard example handling (boolean)
      handleStandardBooleanExample(context, bitType, example, target);
      break;
    default:
      // Standard example handling (string)
      handleStandardStringExample(context, bitType, example, target);
  }
}

function handleGapOrSelectExample(
  context: BitmarkPegParserContext,
  bitType: BitTypeType,
  example: string | boolean,
  target: BitContentProcessorResult,
): void {
  let trueFalse: TrueFalseValue | undefined;

  if (Array.isArray(target.trueFalse) && target.trueFalse.length > 0) {
    trueFalse = target.trueFalse[target.trueFalse.length - 1] ?? undefined;
  }

  if (trueFalse) {
    if (example === true) {
      trueFalse.example = null;
    } else {
      // TODO: This should raise a warning, because a value on the example tag is not allowed for select
      trueFalse.example = null;
    }
  } else if (Array.isArray(target.solutions) && target.solutions.length > 0) {
    if (example === true) {
      target.example = target.solutions[target.solutions.length - 1] ?? undefined;
    } else {
      target.example = example as string | boolean;
    }
  } else {
    // Example at the bit level
    handleStandardStringExample(context, bitType, example, target);
  }
}

function handleStandardStringExample(
  _context: BitmarkPegParserContext,
  _bitType: BitTypeType,
  example: string | boolean,
  target: BitContentProcessorResult,
): void {
  if (example === true) {
    // Apply the example default (depends on the position of the [@example] tag in the bitmark)
    target.example = null;
  } else {
    // Set the example as set in the bitmark
    if (example) {
      if (StringUtils.isString(example)) {
        target.example = example;
      } else {
        target.example = ''; // Default to string if not a string (i.e. a boolean)
      }
    }
  }
}

function handleStandardBooleanExample(
  _context: BitmarkPegParserContext,
  _bitType: BitTypeType,
  example: string | boolean,
  target: BitContentProcessorResult,
): void {
  if (example === true) {
    // Apply the example default (depends on the position of the [@example] tag in the bitmark)
    target.example = null;
  } else {
    // Set the example as set in the bitmark
    if (BooleanUtils.isBooleanString(example)) {
      target.example = BooleanUtils.toBoolean(example);
    } else {
      target.example = true; // Default to true if not a boolean string
    }
  }
}

export { exampleTagContentProcessor };
