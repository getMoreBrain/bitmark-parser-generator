import { RootBitType, BitType } from '../../../../model/enum/BitType';

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
  bitType: BitType,
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
      handleGapOrSelectExample(context, bitType, example, target);
      break;
    case RootBitType.mark:
      // Default only example handling
      handleDefaultOnlyExample(context, bitType, example, target);
      break;
    default:
      // Standard example handling
      handleStandardExample(context, bitType, example, target);
  }
}

function handleGapOrSelectExample(
  context: BitmarkPegParserContext,
  bitType: BitType,
  example: string | boolean,
  target: BitContentProcessorResult,
): void {
  let trueFalse: TrueFalseValue | undefined;

  if (Array.isArray(target.trueFalse) && target.trueFalse.length > 0) {
    trueFalse = target.trueFalse[target.trueFalse.length - 1] ?? undefined;
  }

  if (trueFalse) {
    if (example === true) {
      trueFalse.isDefaultExample = true;
      trueFalse.example = undefined;
    } else {
      // TODO: This should raise a warning, because a value on the example tag is not allowed for select
      trueFalse.isDefaultExample = true;
      trueFalse.example = undefined;
    }
  } else if (Array.isArray(target.solutions) && target.solutions.length > 0) {
    if (example === true) {
      // Extract the solution nearest [@example] tag as the example value
      target.example = target.solutions[target.solutions.length - 1] ?? undefined;
    } else {
      target.example = example as string;
    }
  } else {
    handleStandardExample(context, bitType, example, target);
  }
}

function handleDefaultOnlyExample(
  _context: BitmarkPegParserContext,
  _bitType: BitType,
  _example: string | boolean,
  target: BitContentProcessorResult,
): void {
  target.isDefaultExample = true;
  target.example = undefined;
}

function handleStandardExample(
  _context: BitmarkPegParserContext,
  _bitType: BitType,
  example: string | boolean,
  target: BitContentProcessorResult,
): void {
  if (example === true) {
    target.isDefaultExample = true;
    target.example = undefined;
  } else {
    target.example = example as string;
  }
}

export { exampleTagContentProcessor };
