import { TagsConfig } from '../../../../model/config/TagsConfig';
import { BitType } from '../../../../model/enum/BitType';
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
  _bitType: BitType,
  _bitLevel: BitContentLevelType,
  _tagsConfig: TagsConfig | undefined,
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

    // 16.08.2023 Deprecated, but currently still supported
    case TypeKey.SampleSolution: {
      target.sampleSolution = trimmedStringValue;
      context.addWarning('[$...] tag is deprecated, use [@sampleSolution:...] instead', content);
      break;
    }

    default:
    // Unknown tag
  }
}
export { defaultTagContentProcessor };
