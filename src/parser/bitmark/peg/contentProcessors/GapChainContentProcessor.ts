import { Builder } from '../../../../ast/Builder';
import { Config } from '../../../../config/Config_RENAME';
import { BodyPart, Gap } from '../../../../model/ast/Nodes';
import { BitType } from '../../../../model/enum/BitType';

import { clozeTagContentProcessor } from './ClozeTagContentProcessor';

import {
  BitContent,
  BitContentLevel,
  BitContentLevelType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
  TypeKeyValue,
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

  // Build the variables required to process the chain
  const { key } = content as TypeKeyValue;
  const parentTagConfig = Config.getTagConfigFromTag(bitType, key);

  const chainContent = [content, ...(content.chain ?? [])];

  const chainTags = context.bitContentProcessor(BitContentLevel.Chain, bitType, parentTagConfig, chainContent);

  if (context.DEBUG_CHAIN_TAGS) context.debugPrint('gap TAGS', chainTags);

  const { solutions, ...rest } = chainTags;

  const gap = builder.gap({
    solutions: solutions ?? [],
    ...rest,
    isCaseSensitive: true,
  });

  return gap;
}

export { gapChainContentProcessor };
