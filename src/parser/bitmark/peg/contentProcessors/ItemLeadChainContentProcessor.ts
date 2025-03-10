import { Config } from '../../../../config/Config';
import { TagsConfig } from '../../../../model/config/TagsConfig';
import { Tag } from '../../../../model/enum/Tag';

import { itemLeadTagContentProcessor } from './ItemLeadTagContentProcessor';

import {
  BitContent,
  BitContentLevel,
  ContentDepthType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
} from '../BitmarkPegParserTypes';

function itemLeadChainContentProcessor(
  context: BitmarkPegParserContext,
  contentDepth: ContentDepthType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  if (contentDepth === BitContentLevel.Chain) {
    itemLeadTagContentProcessor(context, contentDepth, tagsConfig, content, target);
  } else {
    buildItemLead(context, contentDepth, tagsConfig, content, target);
  }
}

function buildItemLead(
  context: BitmarkPegParserContext,
  _contentDepth: ContentDepthType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  if (context.DEBUG_CHAIN_CONTENT) context.debugPrint('item lead content', content);

  // Process the chain (lead)
  const itemLeadConfig = Config.getTagConfigForTag(tagsConfig, Tag.fromValue(content.type));
  const chainContent = [content, ...(content.chain ?? [])];

  const chainTags = context.bitContentProcessor(BitContentLevel.Chain, itemLeadConfig?.chain, chainContent);

  if (context.DEBUG_CHAIN_TAGS) context.debugPrint('item lead TAGS', chainTags);

  // Set the lead item from the chain
  target.itemLead = chainTags.itemLead;
}

export { itemLeadChainContentProcessor };
