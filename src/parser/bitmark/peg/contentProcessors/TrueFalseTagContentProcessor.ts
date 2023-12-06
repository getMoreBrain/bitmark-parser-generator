import { BreakscapedString } from '../../../../model/ast/BreakscapedString';
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

function trueFalseTagContentProcessor(
  _context: BitmarkPegParserContext,
  _bitLevel: BitContentLevelType,
  _bitType: BitTypeType,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  const { type, value } = content as TypeValue;

  const trueFalse = target.trueFalse;

  if (!trueFalse) return;

  const trimmedStringValue = StringUtils.trimmedString(value) as BreakscapedString;

  trueFalse.push({
    text: trimmedStringValue,
    isCorrect: type === TypeKey.True,
    isDefaultExample: false,
  });
}
export { trueFalseTagContentProcessor };
