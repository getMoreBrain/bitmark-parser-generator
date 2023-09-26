import { Builder } from '../../../../ast/Builder';
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

const builder = new Builder();

function commentTagContentProcessor(
  _context: BitmarkPegParserContext,
  _bitType: BitType,
  _bitLevel: BitContentLevelType,
  _tagsConfig: TagsConfig | undefined,
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
