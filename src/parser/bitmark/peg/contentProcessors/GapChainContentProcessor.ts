import { Builder } from '../../../../ast/Builder';
import { Config } from '../../../../config/Config';
import { BodyPart, Gap } from '../../../../model/ast/Nodes';
import { TagsConfig } from '../../../../model/config/TagsConfig';
import { BitTypeType } from '../../../../model/enum/BitType';

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
  bitType: BitTypeType,
  bitLevel: BitContentLevelType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
  bodyParts: BodyPart[],
): void {
  if (bitLevel === BitContentLevel.Chain) {
    clozeTagContentProcessor(context, bitType, bitLevel, tagsConfig, content, target);
  } else {
    const gap = buildGap(context, bitType, bitLevel, tagsConfig, content);
    if (gap) bodyParts.push(gap);
  }
}

function buildGap(
  context: BitmarkPegParserContext,
  bitType: BitTypeType,
  _bitLevel: BitContentLevelType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
): Gap | undefined {
  if (context.DEBUG_CHAIN_CONTENT) context.debugPrint('gap content', content);

  const gapConfig = Config.getTagConfigForTag(tagsConfig, content.type);

  const chainContent = [content, ...(content.chain ?? [])];

  const chainTags = context.bitContentProcessor(bitType, BitContentLevel.Chain, gapConfig?.chain, chainContent);

  if (context.DEBUG_CHAIN_TAGS) context.debugPrint('gap TAGS', chainTags);

  const { solutions, ...rest } = chainTags;

  const gap = builder.gap({
    solutions: solutions ?? [],
    ...rest,
  });

  return gap;
}

export { gapChainContentProcessor };
