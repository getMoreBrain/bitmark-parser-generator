import { Builder } from '../../../../ast/Builder';
import { BodyPart, Gap } from '../../../../model/ast/Nodes';
import { BitTypeType } from '../../../../model/enum/BitType';

import { clozeTagContentProcessor } from './ClozeTagContentProcessor';

import {
  BitContent,
  BitContentLevel,
  BitContentLevelType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
  TypeValue,
} from '../BitmarkPegParserTypes';

const builder = new Builder();

function gapChainContentProcessor(
  context: BitmarkPegParserContext,
  _bitLevel: BitContentLevelType,
  bitType: BitTypeType,
  content: BitContent,
  target: BitContentProcessorResult,
  bodyParts: BodyPart[],
  inChain: boolean,
): void {
  if (inChain) {
    clozeTagContentProcessor(context, BitContentLevel.GapChain, bitType, content, target);
  } else {
    const gap = buildGap(context, bitType, content);
    if (gap) bodyParts.push(gap);
  }
}

function buildGap(context: BitmarkPegParserContext, bitType: BitTypeType, content: BitContent): Gap | undefined {
  if (context.DEBUG_CHAIN_CONTENT) context.debugPrint('gap content', content);

  const solutions = [];

  const target: BitContentProcessorResult = {
    solutions: [],
  };
  clozeTagContentProcessor(context, BitContentLevel.GapChain, bitType, content, target);

  const tags = context.bitContentProcessor(BitContentLevel.GapChain, bitType, content.chain, true);

  if (context.DEBUG_CHAIN_TAGS) context.debugPrint('gap TAGS', tags);

  const { solutions: chainedSolutions, ...rest } = tags;
  if (target.solutions) solutions.push(...target.solutions);
  if (chainedSolutions) solutions.push(...chainedSolutions);

  const gap = builder.gap({
    solutions,
    ...rest,
    isCaseSensitive: true,
  });

  return gap;
}

export { gapChainContentProcessor };
