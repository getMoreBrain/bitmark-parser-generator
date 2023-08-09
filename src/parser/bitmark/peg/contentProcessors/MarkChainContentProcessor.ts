import { Builder } from '../../../../ast/Builder';
import { BodyPart, Mark } from '../../../../model/ast/Nodes';
import { BitType } from '../../../../model/enum/BitType';
import { ArrayUtils } from '../../../../utils/ArrayUtils';

import { markTagContentProcessor } from './MarkTagContentProcessor';

import {
  BitContent,
  BitContentLevel,
  BitContentLevelType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
} from '../BitmarkPegParserTypes';

const builder = new Builder();

function markChainContentProcessor(
  context: BitmarkPegParserContext,
  bitLevel: BitContentLevelType,
  bitType: BitType,
  content: BitContent,
  target: BitContentProcessorResult,
  bodyParts: BodyPart[],
): void {
  if (bitLevel === BitContentLevel.Chain) {
    markTagContentProcessor(context, BitContentLevel.Chain, bitType, content, target);
  } else {
    const mark = buildMark(context, bitType, content);
    if (mark) bodyParts.push(mark);
  }
}

function buildMark(context: BitmarkPegParserContext, bitType: BitType, content: BitContent): Mark | undefined {
  if (context.DEBUG_CHAIN_CONTENT) context.debugPrint('mark content', content);

  const chainContent = [content, ...(content.chain ?? [])];

  const tags = context.bitContentProcessor(BitContentLevel.Chain, bitType, chainContent);

  if (context.DEBUG_CHAIN_TAGS) context.debugPrint('mark TAGS', tags);

  const { solution, mark: markType, ...rest } = tags;

  const mark = builder.mark({
    solution: solution ?? '',
    mark: ArrayUtils.asSingle(markType) ?? '',
    ...rest,
  });

  return mark;
}

export { markChainContentProcessor };
