import { Builder } from '../../../../ast/Builder';
import { Config } from '../../../../config/Config';
import { BodyPart, Gap } from '../../../../model/ast/Nodes';
import { TagsConfig } from '../../../../model/config/TagsConfig';
import { BitTypeType } from '../../../../model/enum/BitType';
import { Tag } from '../../../../model/enum/Tag';
import { TextFormatType } from '../../../../model/enum/TextFormat';

import { clozeTagContentProcessor } from './ClozeTagContentProcessor';

import {
  BitContent,
  BitContentLevel,
  ContentDepthType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
} from '../BitmarkPegParserTypes';

const builder = new Builder();

function gapChainContentProcessor(
  context: BitmarkPegParserContext,
  contentDepth: ContentDepthType,
  bitType: BitTypeType,
  textFormat: TextFormatType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
  bodyParts: BodyPart[],
): void {
  if (contentDepth === BitContentLevel.Chain) {
    clozeTagContentProcessor(context, contentDepth, bitType, textFormat, tagsConfig, content, target);
  } else {
    const gap = buildGap(context, contentDepth, bitType, textFormat, tagsConfig, content);
    if (gap) bodyParts.push(gap);
  }
}

function buildGap(
  context: BitmarkPegParserContext,
  _contentDepth: ContentDepthType,
  bitType: BitTypeType,
  textFormat: TextFormatType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
): Gap | undefined {
  if (context.DEBUG_CHAIN_CONTENT) context.debugPrint('gap content', content);

  const gapConfig = Config.getTagConfigForTag(tagsConfig, Tag.fromValue(content.type));

  const chainContent = [content, ...(content.chain ?? [])];

  const chainTags = context.bitContentProcessor(
    BitContentLevel.Chain,
    bitType,
    textFormat,
    gapConfig?.chain,
    chainContent,
  );

  if (context.DEBUG_CHAIN_TAGS) context.debugPrint('gap TAGS', chainTags);

  const { solutions, ...rest } = chainTags;

  const gap = builder.gap({
    solutions: solutions ?? [],
    ...rest,
  });

  return gap;
}

export { gapChainContentProcessor };
