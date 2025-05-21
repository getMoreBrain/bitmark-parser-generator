import { Breakscape } from '../../../../breakscaping/Breakscape';
import { BreakscapedString } from '../../../../model/ast/BreakscapedString';
import { TextFormat } from '../../../../model/enum/TextFormat';
import { TextLocation } from '../../../../model/enum/TextLocation';
import { StringUtils } from '../../../../utils/StringUtils';

import {
  BitContent,
  ContentDepthType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
  TypeKey,
  TypeValue,
} from '../BitmarkPegParserTypes';

function trueFalseTagContentProcessor(
  _context: BitmarkPegParserContext,
  _contentDepth: ContentDepthType,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  const { type, value } = content as TypeValue;

  const trueFalse = target.trueFalse;

  if (!trueFalse) return;

  const trimmedStringValue = Breakscape.unbreakscape(StringUtils.trimmedString(value) as BreakscapedString, {
    textFormat: TextFormat.bitmarkMinusMinus,
    textLocation: TextLocation.tag,
  });

  trueFalse.push({
    text: trimmedStringValue,
    isCorrect: type === TypeKey.True,
    __isDefaultExample: false,
  });
}
export { trueFalseTagContentProcessor };
