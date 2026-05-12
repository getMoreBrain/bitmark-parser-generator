import { Breakscape } from '../../../../breakscaping/Breakscape.ts';
import { type BreakscapedString } from '../../../../model/ast/BreakscapedString.ts';
import { type TagsConfig } from '../../../../model/config/TagsConfig.ts';
import { TextFormat } from '../../../../model/enum/TextFormat.ts';
import { TextLocation } from '../../../../model/enum/TextLocation.ts';
import { StringUtils } from '../../../../utils/StringUtils.ts';
import {
  type BitContent,
  BitContentLevel,
  type BitContentProcessorResult,
  type BitmarkPegParserContext,
  type ContentDepthType,
  type TypeValue,
} from '../BitmarkPegParserTypes.ts';

function referenceTagContentProcessor(
  context: BitmarkPegParserContext,
  _contentDepth: ContentDepthType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  const { value, chain } = content as TypeValue;

  const trimmedStringValue = StringUtils.trimmedString(value) as BreakscapedString;

  target.reference = Breakscape.unbreakscape(trimmedStringValue, {
    format: TextFormat.bitmarkText,
    location: TextLocation.tag,
  });

  // A chained [►] under a [►] is referenceEnd (per the bit config: tag_reference → chain: tag_reference).
  if (Array.isArray(chain) && chain.length > 0) {
    const sub = context.bitContentProcessor(BitContentLevel.Chain, tagsConfig, chain);
    if (sub.reference != null) {
      target.referenceEnd = sub.reference;
    }
  }
}
export { referenceTagContentProcessor };
