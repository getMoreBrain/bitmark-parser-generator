import { type BreakscapedString } from '../../../../model/ast/BreakscapedString.ts';
import { type TagsConfig } from '../../../../model/config/TagsConfig.ts';
import { TextLocation } from '../../../../model/enum/TextLocation.ts';
import { StringUtils } from '../../../../utils/StringUtils.ts';
import { TextParser } from '../../../text/TextParser.ts';
import {
  type BitContent,
  type BitContentProcessorResult,
  type BitmarkPegParserContext,
  type ContentDepthType,
  type TypeValue,
} from '../BitmarkPegParserTypes.ts';

function itemLeadTagContentProcessor(
  context: BitmarkPegParserContext,
  _contentDepth: ContentDepthType,
  _tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  const { textFormat } = context;
  const { value } = content as TypeValue;
  const textParser = new TextParser();

  const trimmedStringValue = StringUtils.trimmedString(value) as BreakscapedString;

  if (!target.itemLead) target.itemLead = [];
  const text = textParser.toAst(trimmedStringValue, {
    format: textFormat,
    location: TextLocation.tag,
  });
  target.itemLead.push(text);
}
export { itemLeadTagContentProcessor };
