import { Config } from '../../../../config/Config.ts';
import { type BreakscapedString } from '../../../../model/ast/BreakscapedString.ts';
import { type TextAst } from '../../../../model/ast/TextNodes.ts';
import { type TagsConfig } from '../../../../model/config/TagsConfig.ts';
import { BitType, type BitTypeType } from '../../../../model/enum/BitType.ts';
import { TextLocation } from '../../../../model/enum/TextLocation.ts';
import { StringUtils } from '../../../../utils/StringUtils.ts';
import { TextParser } from '../../../text/TextParser.ts';
import {
  type BitContent,
  type BitContentProcessorResult,
  type BitmarkPegParserContext,
  type BitSpecificTitles,
  type ContentDepthType,
  type TypeValue,
} from '../BitmarkPegParserTypes.ts';

const textParser = new TextParser();

function titleTagContentProcessor(
  context: BitmarkPegParserContext,
  _contentDepth: ContentDepthType,
  _tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  const { textFormat } = context;
  const { value } = content as TypeValue;

  const title = target.title;

  if (!title) return;

  // Parse the title and its level
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const titleValue: { title: string; level: string[] } = value as any;
  const titleText = StringUtils.trimmedString(titleValue.title) as BreakscapedString;
  const level = titleValue.level.length;
  title[level] = {
    //
    titleAst: textParser.toAst(titleText ?? '', {
      format: textFormat,
      location: TextLocation.tag,
    }),
    titleString: titleText ?? '',
  };
}

function buildTitles(
  _context: BitmarkPegParserContext,
  bitType: BitTypeType,
  title: { titleAst: TextAst; titleString: string }[] | undefined,
): BitSpecificTitles {
  title = title ?? [];

  if (Config.isOfBitType(bitType, BitType.chapter)) {
    let t: { titleAst: TextAst; titleString: string } | undefined;
    if (title.length > 0) t = title[title.length - 1];

    return {
      title: t?.titleAst ?? [],
      titleString: t?.titleString ?? '',
      level: title.length > 0 ? title.length - 1 : undefined,
    };
  } else {
    return {
      title: title[1]?.titleAst ?? undefined,
      titleString: title[1]?.titleString ?? undefined,
      subtitle: title[2]?.titleAst ?? undefined,
      subtitleString: title[2]?.titleString ?? undefined,
    };
  }
}

export { buildTitles, titleTagContentProcessor };
