import { Breakscape } from '../../../../breakscaping/Breakscape';
import { BreakscapedString } from '../../../../model/ast/BreakscapedString';
import { TagsConfig } from '../../../../model/config/TagsConfig';
import { TextFormat } from '../../../../model/enum/TextFormat';
import { TextLocation } from '../../../../model/enum/TextLocation';
import { StringUtils } from '../../../../utils/StringUtils';

import {
  BitContent,
  ContentDepthType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
  TypeValue,
} from '../BitmarkPegParserTypes';

function referenceTagContentProcessor(
  _context: BitmarkPegParserContext,
  _contentDepth: ContentDepthType,
  _tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
  isReferenceEnd: boolean,
): void {
  const { value } = content as TypeValue;

  const trimmedStringValue = StringUtils.trimmedString(value) as BreakscapedString;

  if (isReferenceEnd) {
    target.referenceEnd = Breakscape.unbreakscape(trimmedStringValue, {
      textFormat: TextFormat.bitmarkText,
      textLocation: TextLocation.tag,
    });
  } else {
    target.reference = Breakscape.unbreakscape(trimmedStringValue, {
      textFormat: TextFormat.bitmarkText,
      textLocation: TextLocation.tag,
    });
  }
}
export { referenceTagContentProcessor };
