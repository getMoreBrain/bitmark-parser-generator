import { TagsConfig } from '../../../../model/config/TagsConfig';
import { BitType } from '../../../../model/enum/BitType';
import { StringUtils } from '../../../../utils/StringUtils';

import {
  BitContent,
  BitContentLevelType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
  TypeValue,
} from '../BitmarkPegParserTypes';

function referenceTagContentProcessor(
  _context: BitmarkPegParserContext,
  _bitType: BitType,
  _bitLevel: BitContentLevelType,
  _tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
  isReferenceEnd: boolean,
): void {
  const { value } = content as TypeValue;

  const trimmedStringValue = StringUtils.trimmedString(value);

  if (isReferenceEnd) {
    target.referenceEnd = trimmedStringValue;
  } else {
    target.reference = trimmedStringValue;
  }
}
export { referenceTagContentProcessor };
