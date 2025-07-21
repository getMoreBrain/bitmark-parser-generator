import { Breakscape } from '../../../../breakscaping/Breakscape.ts';
import { type BreakscapedString } from '../../../../model/ast/BreakscapedString.ts';
import { TextFormat } from '../../../../model/enum/TextFormat.ts';
import { TextLocation } from '../../../../model/enum/TextLocation.ts';
import { StringUtils } from '../../../../utils/StringUtils.ts';
import {
  type BitContent,
  type BitContentProcessorResult,
  type BitmarkPegParserContext,
  type ContentDepthType,
  TypeKey,
  type TypeValue,
} from '../BitmarkPegParserTypes.ts';

function trueFalseTagContentProcessor(
  _context: BitmarkPegParserContext,
  _contentDepth: ContentDepthType,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  const { type, value } = content as TypeValue;

  const trueFalse = target.trueFalse;

  if (!trueFalse) return;

  const trimmedStringValue = Breakscape.unbreakscape(
    StringUtils.trimmedString(value) as BreakscapedString,
    {
      format: TextFormat.bitmarkText,
      location: TextLocation.tag,
    },
  );

  trueFalse.push({
    text: trimmedStringValue,
    isCorrect: type === TypeKey.True,
    __isDefaultExample: false,
  });
}
export { trueFalseTagContentProcessor };
