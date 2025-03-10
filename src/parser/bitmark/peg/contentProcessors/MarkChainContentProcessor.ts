import { Config } from '../../../../config/Config';
import { BodyPart } from '../../../../model/ast/Nodes';
import { TagsConfig } from '../../../../model/config/TagsConfig';
import { BodyBitType } from '../../../../model/enum/BodyBitType';
import { Tag } from '../../../../model/enum/Tag';
import { MarkJson } from '../../../../model/json/BodyBitJson';
import { ArrayUtils } from '../../../../utils/ArrayUtils';

import { markTagContentProcessor } from './MarkTagContentProcessor';

import {
  BitContent,
  BitContentLevel,
  ContentDepthType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
} from '../BitmarkPegParserTypes';

function markChainContentProcessor(
  context: BitmarkPegParserContext,
  contentDepth: ContentDepthType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
  bodyParts: BodyPart[],
): void {
  if (contentDepth === BitContentLevel.Chain) {
    markTagContentProcessor(context, BitContentLevel.Chain, content, target);
  } else {
    const mark: Partial<MarkJson> | undefined = buildMark(context, contentDepth, tagsConfig, content);
    if (mark) bodyParts.push(mark as BodyPart);
  }
}

function buildMark(
  context: BitmarkPegParserContext,
  _contentDepth: ContentDepthType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
): Partial<MarkJson> | undefined {
  if (context.DEBUG_CHAIN_CONTENT) context.debugPrint('mark content', content);

  const markConfig = Config.getTagConfigForTag(tagsConfig, Tag.fromValue(content.type));

  const tags = context.bitContentProcessor(BitContentLevel.Chain, tagsConfig, [content]);
  const chainTags = context.bitContentProcessor(BitContentLevel.Chain, markConfig?.chain, content.chain);

  if (context.DEBUG_CHAIN_TAGS) context.debugPrint('mark TAGS', chainTags);

  const { solution } = tags;
  const { mark: markType, ...rest } = chainTags;

  const mark: Partial<MarkJson> = {
    type: BodyBitType.mark,
    solution: solution ?? '',
    mark: ArrayUtils.asSingle(markType) ?? '',
    ...rest,
  };

  return mark;
}

export { markChainContentProcessor };
