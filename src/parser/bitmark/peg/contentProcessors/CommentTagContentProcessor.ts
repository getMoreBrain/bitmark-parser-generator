import { BreakscapedString } from '../../../../model/ast/BreakscapedString';
import { BitType } from '../../../../model/enum/BitType';
import { StringUtils } from '../../../../utils/StringUtils';

import {
  BitContent,
  BitContentLevelType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
  TypeValue,
} from '../BitmarkPegParserTypes';

function commentTagContentProcessor(
  _context: BitmarkPegParserContext,
  _bitType: BitType,
  _bitLevel: BitContentLevelType,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  if (!target.comments) return;

  const { value } = content as TypeValue;

  const comment: BreakscapedString | undefined = StringUtils.isString(value)
    ? (StringUtils.trimmedString(value) as BreakscapedString)
    : undefined;
  if (!comment) return;

  target.comments.push(comment);
}
export { commentTagContentProcessor };
