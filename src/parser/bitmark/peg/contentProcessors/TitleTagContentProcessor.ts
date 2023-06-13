import { BitType, BitTypeType } from '../../../../model/enum/BitType';
import { StringUtils } from '../../../../utils/StringUtils';

import {
  BitContent,
  BitContentLevelType,
  BitContentProcessorResult,
  BitSpecificTitles,
  BitmarkPegParserContext,
  TypeValue,
} from '../BitmarkPegParserTypes';

function titleTagContentProcessor(
  _context: BitmarkPegParserContext,
  _bitLevel: BitContentLevelType,
  _bitType: BitTypeType,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  const { value } = content as TypeValue;

  const title = target.title;

  if (!title) return;

  // Parse the title and its level
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const titleValue: { title: string; level: string[] } = value as any;
  const titleText = StringUtils.trimmedString(titleValue.title);
  const level = titleValue.level.length;
  title[level] = titleText;
}

function buildTitles(
  _context: BitmarkPegParserContext,
  bitType: BitTypeType,
  title: string[] | undefined,
): BitSpecificTitles {
  title = title ?? [];

  switch (bitType) {
    case BitType.chapter: {
      let t: string | undefined;
      if (title.length > 0) t = title[title.length - 1];

      return {
        title: t,
        level: title.length > 0 ? title.length - 1 : undefined,
      };
    }

    case BitType.book:
    default: {
      return {
        title: title[1] ?? undefined,
        subtitle: title[2] ?? undefined,
      };
    }
  }
}

export { titleTagContentProcessor, buildTitles };
