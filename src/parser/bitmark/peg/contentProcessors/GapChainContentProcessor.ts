import { Builder } from '../../../../ast/Builder';
import { BodyPart, Gap } from '../../../../model/ast/Nodes';
import { BitType } from '../../../../model/enum/BitType';

import { clozeTagContentProcessor } from './ClozeTagContentProcessor';

import {
  BitContent,
  BitContentLevel,
  BitContentLevelType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
} from '../BitmarkPegParserTypes';

const builder = new Builder();

function gapChainContentProcessor(
  context: BitmarkPegParserContext,
  bitLevel: BitContentLevelType,
  bitType: BitType,
  content: BitContent,
  target: BitContentProcessorResult,
  bodyParts: BodyPart[],
): void {
  if (bitLevel === BitContentLevel.Chain) {
    clozeTagContentProcessor(context, bitLevel, bitType, content, target);
  } else {
    const gap = buildGap(context, bitType, content);
    if (gap) bodyParts.push(gap);
  }
}

function buildGap(context: BitmarkPegParserContext, bitType: BitType, content: BitContent): Gap | undefined {
  if (context.DEBUG_CHAIN_CONTENT) context.debugPrint('gap content', content);

  const chainContent = [content, ...(content.chain ?? [])];

  const tags = context.bitContentProcessor(BitContentLevel.Chain, bitType, chainContent);

  if (context.DEBUG_CHAIN_TAGS) context.debugPrint('gap TAGS', tags);

  const { solutions, ...rest } = tags;

  const gap = builder.gap({
    solutions: solutions ?? [],
    ...rest,
    isCaseSensitive: true,
  });

  return gap;
}

export { gapChainContentProcessor };
