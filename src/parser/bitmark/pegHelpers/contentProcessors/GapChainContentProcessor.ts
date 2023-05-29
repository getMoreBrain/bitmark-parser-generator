/* eslint-disable @typescript-eslint/no-explicit-any */
import { Builder } from '../../../../ast/Builder';
import { BodyPart, Gap } from '../../../../model/ast/Nodes';
import { BitTypeType } from '../../../../model/enum/BitType';

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
  _target: BitContentProcessorResult,
  bodyParts: BodyPart[],
): void {
  const { value } = content as TypeValue;

  const gap = buildGap(context, bitType, value as BitContent[]);
  if (gap) bodyParts.push(gap);
}

function buildGap(context: BitmarkPegParserContext, bitType: BitTypeType, content: BitContent[]): Gap | undefined {
  if (context.DEBUG_CHAIN_CONTENT) context.debugPrint('gap content', content);

  const tags = context.bitContentProcessor(BitContentLevel.GapChain, bitType, content);

  if (context.DEBUG_CHAIN_TAGS) context.debugPrint('gap TAGS', tags);

  const gap = builder.gap({
    solutions: [],
    ...tags,
    isCaseSensitive: true,
  });

  return gap;
}

export { gapChainContentProcessor };
