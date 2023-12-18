import { BreakscapedString } from '../../../../model/ast/BreakscapedString';
import { BitTypeType } from '../../../../model/enum/BitType';
import { TextFormatType } from '../../../../model/enum/TextFormat';
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
  _bitType: BitTypeType,
  _textFormat: TextFormatType,
  _bitLevel: BitContentLevelType,
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
