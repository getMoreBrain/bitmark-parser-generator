import { BitType, BitTypeType } from '../../../../model/enum/BitType';

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
    default:
      // Standard example handling
      handleStandardExample(context, bitType, example, target);
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
      trueFalse.isDefaultExample = true;
    } else {
      // TODO: This should raise a warning, because a value on the example tag is not allowed for select
      trueFalse.isDefaultExample = true;
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

function handleStandardExample(
  _context: BitmarkPegParserContext,
  _bitType: BitTypeType,
  example: string | boolean,
  target: BitContentProcessorResult,
): void {
  if (example === true) {
    target.isDefaultExample = true;
  } else {
    target.example = example as string;
  }
}

export { exampleTagContentProcessor };
