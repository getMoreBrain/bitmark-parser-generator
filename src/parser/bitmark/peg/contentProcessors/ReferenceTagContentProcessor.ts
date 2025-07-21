import { Breakscape } from '../../../../breakscaping/Breakscape.ts';
import { type BreakscapedString } from '../../../../model/ast/BreakscapedString.ts';
import { type TagsConfig } from '../../../../model/config/TagsConfig.ts';
import { TextFormat } from '../../../../model/enum/TextFormat.ts';
import { TextLocation } from '../../../../model/enum/TextLocation.ts';
import { StringUtils } from '../../../../utils/StringUtils.ts';
import {
  type BitContent,
  type BitContentProcessorResult,
  type BitmarkPegParserContext,
  type ContentDepthType,
  type TypeValue,
} from '../BitmarkPegParserTypes.ts';

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
      format: TextFormat.bitmarkText,
      location: TextLocation.tag,
    });
  } else {
    target.reference = Breakscape.unbreakscape(trimmedStringValue, {
      format: TextFormat.bitmarkText,
      location: TextLocation.tag,
    });
  }
}
export { referenceTagContentProcessor };
