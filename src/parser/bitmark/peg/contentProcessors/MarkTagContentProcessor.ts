import { type BreakscapedString } from '../../../../model/ast/BreakscapedString.ts';
import { StringUtils } from '../../../../utils/StringUtils.ts';
import {
  type BitContent,
  type BitContentProcessorResult,
  type BitmarkPegParserContext,
  type ContentDepthType,
  type TypeValue,
} from '../BitmarkPegParserTypes.ts';

function markTagContentProcessor(
  _context: BitmarkPegParserContext,
  _contentDepth: ContentDepthType,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  const { value } = content as TypeValue;

  if (StringUtils.isString(value)) {
    target.solution = StringUtils.trimmedString(value) as BreakscapedString;
  }
}
export { markTagContentProcessor };
