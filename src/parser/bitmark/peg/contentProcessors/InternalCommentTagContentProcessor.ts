import { BreakscapedString } from '../../../../model/ast/BreakscapedString';
import { StringUtils } from '../../../../utils/StringUtils';

import {
  BitContent,
  ContentDepthType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
  TypeValue,
} from '../BitmarkPegParserTypes';

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
