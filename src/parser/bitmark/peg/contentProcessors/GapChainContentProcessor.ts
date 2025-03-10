import { Config } from '../../../../config/Config';
import { BodyPart } from '../../../../model/ast/Nodes';
import { TagsConfig } from '../../../../model/config/TagsConfig';
import { BodyBitType } from '../../../../model/enum/BodyBitType';
import { Tag } from '../../../../model/enum/Tag';
import { GapJson } from '../../../../model/json/BodyBitJson';

import { clozeTagContentProcessor } from './ClozeTagContentProcessor';

import {
  BitContent,
  BitContentLevel,
  ContentDepthType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
} from '../BitmarkPegParserTypes';

function gapChainContentProcessor(
  context: BitmarkPegParserContext,
  contentDepth: ContentDepthType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
  bodyParts: BodyPart[],
): void {
  if (contentDepth === BitContentLevel.Chain) {
    clozeTagContentProcessor(context, contentDepth, tagsConfig, content, target);
  } else {
    const gap: Partial<GapJson> | undefined = buildGap(context, contentDepth, tagsConfig, content);
    if (gap) bodyParts.push(gap as BodyPart);
  }
}

function buildGap(
  context: BitmarkPegParserContext,
  _contentDepth: ContentDepthType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
): Partial<GapJson> | undefined {
  if (context.DEBUG_CHAIN_CONTENT) context.debugPrint('gap content', content);

  const gapConfig = Config.getTagConfigForTag(tagsConfig, Tag.fromValue(content.type));

  const chainContent = [content, ...(content.chain ?? [])];

  const chainTags = context.bitContentProcessor(BitContentLevel.Chain, gapConfig?.chain, chainContent);

  if (context.DEBUG_CHAIN_TAGS) context.debugPrint('gap TAGS', chainTags);

  const gap: Partial<GapJson> = {
    type: BodyBitType.gap,
    ...chainTags,
  };

  return gap;
}

export { gapChainContentProcessor };
