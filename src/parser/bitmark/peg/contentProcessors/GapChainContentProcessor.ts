import { Builder } from '../../../../ast/Builder';
import { BodyPart, Gap } from '../../../../model/ast/Nodes';
import { BitTypeType } from '../../../../model/enum/BitType';
import { TextFormatType } from '../../../../model/enum/TextFormat';

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
  _bitLevel: BitContentLevelType,
  bitType: BitTypeType,
  textFormat: TextFormatType,
  content: BitContent,
  target: BitContentProcessorResult,
  bodyParts: BodyPart[],
  inChain: boolean,
): void {
  if (inChain) {
    clozeTagContentProcessor(context, BitContentLevel.Chain, bitType, content, target);
  } else {
    const gap = buildGap(context, bitType, textFormat, content);
    if (gap) bodyParts.push(gap);
  }
}

function buildGap(
  context: BitmarkPegParserContext,
  bitType: BitTypeType,
  textFormat: TextFormatType,
  content: BitContent,
): Gap | undefined {
  if (context.DEBUG_CHAIN_CONTENT) context.debugPrint('gap content', content);

  const chainContent = [content, ...(content.chain ?? [])];

  const tags = context.bitContentProcessor(BitContentLevel.Chain, bitType, textFormat, chainContent);

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
