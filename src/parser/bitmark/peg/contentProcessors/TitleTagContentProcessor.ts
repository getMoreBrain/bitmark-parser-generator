import { Config } from '../../../../config/Config';
import { BreakscapedString } from '../../../../model/ast/BreakscapedString';
import { TextAst } from '../../../../model/ast/TextNodes';
import { TagsConfig } from '../../../../model/config/TagsConfig';
import { BitType, BitTypeType } from '../../../../model/enum/BitType';
import { StringUtils } from '../../../../utils/StringUtils';
import { TextParser } from '../../../text/TextParser';

import {
  BitContent,
  ContentDepthType,
  BitContentProcessorResult,
  BitSpecificTitles,
  BitmarkPegParserContext,
  TypeValue,
} from '../BitmarkPegParserTypes';

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
      textFormat,
      isProperty: true,
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

export { titleTagContentProcessor, buildTitles };
