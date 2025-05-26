import { Breakscape } from '../../../../breakscaping/Breakscape';
import { BreakscapedString } from '../../../../model/ast/BreakscapedString';
import { TagsConfig } from '../../../../model/config/TagsConfig';
import { TextFormat } from '../../../../model/enum/TextFormat';
import { TextLocation } from '../../../../model/enum/TextLocation';
import { StringUtils } from '../../../../utils/StringUtils';
import { TextParser } from '../../../text/TextParser';

import {
  BitContent,
  ContentDepthType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
  TypeKey,
  TypeValue,
} from '../BitmarkPegParserTypes';

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
      target.instruction = textParser.toAst(trimmedStringValue, { textFormat, textLocation: TextLocation.tag });
      target.__instructionString = Breakscape.unbreakscape(trimmedStringValue, {
        textFormat: TextFormat.bitmarkText,
        textLocation: TextLocation.tag,
      });
      break;
    }

    case TypeKey.Hint: {
      target.hint = textParser.toAst(trimmedStringValue, { textFormat, textLocation: TextLocation.tag });
      target.__hintString = Breakscape.unbreakscape(trimmedStringValue, {
        textFormat: TextFormat.bitmarkText,
        textLocation: TextLocation.tag,
      });
      break;
    }

    case TypeKey.Anchor: {
      target.anchor = Breakscape.unbreakscape(trimmedStringValue, {
        textFormat: TextFormat.bitmarkText,
        textLocation: TextLocation.tag,
      });
      break;
    }

    case TypeKey.Reference: {
      target.reference = Breakscape.unbreakscape(trimmedStringValue, {
        textFormat: TextFormat.bitmarkText,
        textLocation: TextLocation.tag,
      });
      break;
    }

    // 16.08.2023 Deprecated, but currently still supported
    case TypeKey.SampleSolution: {
      target.sampleSolution = Breakscape.unbreakscape(trimmedStringValue, {
        textFormat: TextFormat.bitmarkText,
        textLocation: TextLocation.tag,
      });
      target.__sampleSolutionAst = textParser.toAst(trimmedStringValue, { textFormat, textLocation: TextLocation.tag });
      context.addWarning('[$...] tag is deprecated, use [@sampleSolution:...] instead', content);
      break;
    }

    default:
    // Unknown tag
  }
}
export { defaultTagContentProcessor };
