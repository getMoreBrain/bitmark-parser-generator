import { Breakscape } from '../../../../breakscaping/Breakscape.ts';
import { type BreakscapedString } from '../../../../model/ast/BreakscapedString.ts';
import { type TagsConfig } from '../../../../model/config/TagsConfig.ts';
import { TextFormat } from '../../../../model/enum/TextFormat.ts';
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

    solutions.push(
      Breakscape.unbreakscape(trimmedStringValue, {
        format: TextFormat.bitmarkText,
        location: TextLocation.tag,
      }),
    );

    const solutionAst = textParser.toAst(trimmedStringValue, {
      format: textFormat,
      location: TextLocation.tag,
    });
    solutionsAst.push(solutionAst);
  }
}
export { clozeTagContentProcessor };
