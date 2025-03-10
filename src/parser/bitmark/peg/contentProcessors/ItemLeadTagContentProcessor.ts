import { BreakscapedString } from '../../../../model/ast/BreakscapedString';
import { TagsConfig } from '../../../../model/config/TagsConfig';
import { StringUtils } from '../../../../utils/StringUtils';
import { TextParser } from '../../../text/TextParser';

import {
  BitContent,
  ContentDepthType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
  TypeValue,
} from '../BitmarkPegParserTypes';

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
    textFormat,
    isProperty: true,
  });
  target.itemLead.push(text);
}
export { itemLeadTagContentProcessor };
