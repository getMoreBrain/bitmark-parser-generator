import { Builder } from '../../../../ast/Builder';
import { BodyPart, Mark } from '../../../../model/ast/Nodes';
import { BitTypeType } from '../../../../model/enum/BitType';
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
  bitType: BitTypeType,
  content: BitContent,
  target: BitContentProcessorResult,
  bodyParts: BodyPart[],
): void {
  if (bitLevel === BitContentLevel.Chain) {
    markTagContentProcessor(context, BitContentLevel.Chain, bitType, content, target);
  } else {
    const gap = buildMark(context, bitType, content);
    if (gap) bodyParts.push(gap);
  }
}

function buildMark(context: BitmarkPegParserContext, bitType: BitTypeType, content: BitContent): Mark | undefined {
  if (context.DEBUG_CHAIN_CONTENT) context.debugPrint('mark content', content);

  const chainContent = [content, ...(content.chain ?? [])];

  const tags = context.bitContentProcessor(BitContentLevel.Chain, bitType, chainContent);

  if (context.DEBUG_CHAIN_TAGS) context.debugPrint('mark TAGS', tags);

  const { solution, markType, ...rest } = tags;

  const mark = builder.mark({
    solution: solution ?? '',
    type: ArrayUtils.asSingle(markType),
    ...rest,
  });

  return mark;
}

export { markChainContentProcessor };
