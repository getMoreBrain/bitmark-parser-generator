import { Breakscape } from '../../../../breakscaping/Breakscape';
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

const textParser = new TextParser();

function clozeTagContentProcessor(
  context: BitmarkPegParserContext,
  _contentDepth: ContentDepthType,
  _tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  const { textFormat } = context;
  const { value } = content as TypeValue;

  const solutions = target.solutions;
  const solutionsAst = target.__solutionsAst;

  if (!solutions || !solutionsAst) return;

  if (StringUtils.isString(value)) {
    const trimmedStringValue = StringUtils.trimmedString(value) as BreakscapedString;

    solutions.push(Breakscape.unbreakscape(trimmedStringValue));

    const solutionAst = textParser.toAst(trimmedStringValue, { textFormat, isProperty: true });
    solutionsAst.push(solutionAst);
  }
}
export { clozeTagContentProcessor };
