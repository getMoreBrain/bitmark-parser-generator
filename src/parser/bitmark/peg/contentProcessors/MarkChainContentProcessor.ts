import { Config } from '../../../../config/Config.ts';
import { type BodyPart } from '../../../../model/ast/Nodes.ts';
import { type TagsConfig } from '../../../../model/config/TagsConfig.ts';
import { BodyBitType } from '../../../../model/enum/BodyBitType.ts';
import { Tag } from '../../../../model/enum/Tag.ts';
import { type MarkJson } from '../../../../model/json/BodyBitJson.ts';
import { ArrayUtils } from '../../../../utils/ArrayUtils.ts';
import {
  type BitContent,
  BitContentLevel,
  type BitContentProcessorResult,
  type BitmarkPegParserContext,
  type ContentDepthType,
} from '../BitmarkPegParserTypes.ts';
import { markTagContentProcessor } from './MarkTagContentProcessor.ts';

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
    const mark: Partial<MarkJson> | undefined = buildMark(
      context,
      contentDepth,
      tagsConfig,
      content,
    );
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
  const chainTags = context.bitContentProcessor(
    BitContentLevel.Chain,
    markConfig?.chain,
    content.chain,
  );

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
