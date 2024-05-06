import { BreakscapedString } from '../../../../model/ast/BreakscapedString';
import { BitTypeType } from '../../../../model/enum/BitType';
import { StringUtils } from '../../../../utils/StringUtils';

import {
  BitContent,
  ContentDepthType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
  TypeValue,
} from '../BitmarkPegParserTypes';

function markTagContentProcessor(
  _context: BitmarkPegParserContext,
  _contentDepth: ContentDepthType,
  _bitType: BitTypeType,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  const { value } = content as TypeValue;

  if (StringUtils.isString(value)) {
    target.solution = value as BreakscapedString;
  }
}
export { markTagContentProcessor };
