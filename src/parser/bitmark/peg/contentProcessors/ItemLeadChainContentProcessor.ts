import { Config } from '../../../../config/Config';
import { TagsConfig } from '../../../../model/config/TagsConfig';
import { BitTypeType } from '../../../../model/enum/BitType';
import { TextFormatType } from '../../../../model/enum/TextFormat';

import { itemLeadTagContentProcessor } from './ItemLeadTagContentProcessor';

import {
  BitContent,
  BitContentLevel,
  BitContentLevelType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
} from '../BitmarkPegParserTypes';

function itemLeadChainContentProcessor(
  context: BitmarkPegParserContext,
  bitType: BitTypeType,
  textFormat: TextFormatType,
  bitLevel: BitContentLevelType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  if (bitLevel === BitContentLevel.Chain) {
    itemLeadTagContentProcessor(context, bitType, textFormat, bitLevel, tagsConfig, content, target);
  } else {
    buildItemLead(context, bitType, textFormat, bitLevel, tagsConfig, content, target);
  }
}

function buildItemLead(
  context: BitmarkPegParserContext,
  bitType: BitTypeType,
  textFormat: TextFormatType,
  bitLevel: BitContentLevelType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  if (context.DEBUG_CHAIN_CONTENT) context.debugPrint('item lead content', content);

  // Process the chain (lead)
  const itemLeadConfig = Config.getTagConfigForTag(tagsConfig, content.type);
  const chainContent = content.chain ?? [];
  const chainTags = context.bitContentProcessor(
    bitType,
    textFormat,
    BitContentLevel.Chain,
    itemLeadConfig?.chain,

    chainContent,
  );

  if (context.DEBUG_CHAIN_TAGS) context.debugPrint('item lead TAGS', chainTags);

  // Process the item tag
  itemLeadTagContentProcessor(context, bitType, textFormat, bitLevel, tagsConfig, content, target);

  // Set the lead item from the chain
  target.lead = chainTags.item;
}

export { itemLeadChainContentProcessor };
