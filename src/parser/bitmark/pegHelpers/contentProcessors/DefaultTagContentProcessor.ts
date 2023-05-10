/* eslint-disable @typescript-eslint/no-explicit-any */

import { BitTypeType } from '../../../../model/enum/BitType';
import { StringUtils } from '../../../../utils/StringUtils';

import {
  BitContent,
  BitContentLevelType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
  TypeKey,
  TypeValue,
} from '../BitmarkPegParserTypes';

function defaultTagContentProcessor(
  context: BitmarkPegParserContext,
  bitLevel: BitContentLevelType,
  bitType: BitTypeType,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  const { type, value } = content as TypeValue;

  const trimmedStringValue = StringUtils.trimmedString(value);

  switch (type) {
    case TypeKey.Instruction: {
      target.instruction = trimmedStringValue;
      break;
    }

    case TypeKey.Hint: {
      target.hint = trimmedStringValue;
      break;
    }

    case TypeKey.Anchor: {
      target.anchor = trimmedStringValue;
      break;
    }

    case TypeKey.Reference: {
      target.reference = trimmedStringValue;
      break;
    }

    case TypeKey.SampleSolution: {
      target.sampleSolution = trimmedStringValue;
      break;
    }

    default:
    // Unknown tag
  }
}
export { defaultTagContentProcessor };
