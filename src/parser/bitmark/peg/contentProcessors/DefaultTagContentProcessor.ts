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
  TypeKey,
  type TypeValue,
} from '../BitmarkPegParserTypes.ts';

function defaultTagContentProcessor(
  context: BitmarkPegParserContext,
  _contentDepth: ContentDepthType,
  _tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  const { type, value } = content as TypeValue;
  const { textFormat } = context;
  const textParser = new TextParser();

  const trimmedStringValue = StringUtils.trimmedString(value) as BreakscapedString;

  switch (type) {
    case TypeKey.Instruction: {
      target.instruction = textParser.toAst(trimmedStringValue, {
        format: textFormat,
        location: TextLocation.tag,
      });
      target.__instructionString = Breakscape.unbreakscape(trimmedStringValue, {
        format: TextFormat.bitmarkText,
        location: TextLocation.tag,
      });
      break;
    }

    case TypeKey.Hint: {
      target.hint = textParser.toAst(trimmedStringValue, {
        format: textFormat,
        location: TextLocation.tag,
      });
      target.__hintString = Breakscape.unbreakscape(trimmedStringValue, {
        format: TextFormat.bitmarkText,
        location: TextLocation.tag,
      });
      break;
    }

    case TypeKey.Anchor: {
      target.anchor = Breakscape.unbreakscape(trimmedStringValue, {
        format: TextFormat.bitmarkText,
        location: TextLocation.tag,
      });
      break;
    }

    case TypeKey.Reference: {
      target.reference = Breakscape.unbreakscape(trimmedStringValue, {
        format: TextFormat.bitmarkText,
        location: TextLocation.tag,
      });
      break;
    }

    // 16.08.2023 Deprecated, but currently still supported
    case TypeKey.SampleSolution: {
      target.sampleSolution = Breakscape.unbreakscape(trimmedStringValue, {
        format: TextFormat.bitmarkText,
        location: TextLocation.tag,
      });
      target.__sampleSolutionAst = textParser.toAst(trimmedStringValue, {
        format: textFormat,
        location: TextLocation.tag,
      });
      context.addWarning('[$...] tag is deprecated, use [@sampleSolution:...] instead', content);
      break;
    }

    default:
    // Unknown tag
  }
}
export { defaultTagContentProcessor };
