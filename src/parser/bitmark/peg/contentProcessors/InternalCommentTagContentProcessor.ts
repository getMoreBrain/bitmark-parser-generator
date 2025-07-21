import { type BreakscapedString } from '../../../../model/ast/BreakscapedString.ts';
import { StringUtils } from '../../../../utils/StringUtils.ts';
import {
  type BitContent,
  type BitContentProcessorResult,
  type BitmarkPegParserContext,
  type ContentDepthType,
  type TypeValue,
} from '../BitmarkPegParserTypes.ts';

function commentTagContentProcessor(
  _context: BitmarkPegParserContext,
  _contentDepth: ContentDepthType,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  if (!target.internalComments) return;

  const { value } = content as TypeValue;

  const internalComment: BreakscapedString | undefined = StringUtils.isString(value)
    ? (StringUtils.trimmedString(value) as BreakscapedString)
    : undefined;
  if (!internalComment) return;

  target.internalComments.push(internalComment);
}
export { commentTagContentProcessor };
