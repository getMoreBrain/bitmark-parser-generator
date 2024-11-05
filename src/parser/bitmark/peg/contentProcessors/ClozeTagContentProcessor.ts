import { BreakscapedString } from '../../../../model/ast/BreakscapedString';
import { TagsConfig } from '../../../../model/config/TagsConfig';
import { BitTypeType } from '../../../../model/enum/BitType';
import { TextFormatType } from '../../../../model/enum/TextFormat';
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
  _context: BitmarkPegParserContext,
  _contentDepth: ContentDepthType,
  _bitType: BitTypeType,
  _textFormat: TextFormatType,
  _tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  const { value } = content as TypeValue;

  const solutions = target.solutions;
  const solutionStrings = target._solutionStrings;

  if (!solutions || !solutionStrings) return;

  if (StringUtils.isString(value)) {
    const trimmedStringValue = StringUtils.trimmedString(value) as BreakscapedString;

    solutionStrings.push(trimmedStringValue);

    const solution = textParser.toAst(trimmedStringValue);
    solutions.push(solution);
  }
}
export { clozeTagContentProcessor };
