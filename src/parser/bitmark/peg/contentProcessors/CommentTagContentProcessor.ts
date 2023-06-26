import { Builder } from '../../../../ast/Builder';
import { BitTypeType } from '../../../../model/enum/BitType';
import { StringUtils } from '../../../../utils/StringUtils';

import {
  BitContent,
  BitContentLevelType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
  TypeValue,
} from '../BitmarkPegParserTypes';

const builder = new Builder();

function commentTagContentProcessor(
  _context: BitmarkPegParserContext,
  _bitLevel: BitContentLevelType,
  _bitType: BitTypeType,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  if (!target.comments) return;

  const { value } = content as TypeValue;

  const text: string = StringUtils.isString(value) ? (value as string) : '';

  const comment = builder.comment({
    text,
    location: content.parser.location,
  });
  target.comments.push(comment);
}
export { commentTagContentProcessor };
