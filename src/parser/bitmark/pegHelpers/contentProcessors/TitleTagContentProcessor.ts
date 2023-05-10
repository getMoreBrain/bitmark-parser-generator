/* eslint-disable @typescript-eslint/no-explicit-any */

import { BitTypeType } from '../../../../model/enum/BitType';
import { StringUtils } from '../../../../utils/StringUtils';

import {
  BitContent,
  BitContentLevelType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
  TypeValue,
} from '../BitmarkPegParserTypes';

function titleTagContentProcessor(
  context: BitmarkPegParserContext,
  bitLevel: BitContentLevelType,
  bitType: BitTypeType,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  const { value } = content as TypeValue;

  const title = target.title;

  if (!title) return;

  // Parse the title and its level
  const titleValue: { title: string; level: string[] } = value as any;
  const titleText = StringUtils.trimmedString(titleValue.title);
  const level = titleValue.level.length;
  title[level] = titleText;
}
export { titleTagContentProcessor };
