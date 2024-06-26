import { Builder } from '../../../../ast/Builder';
import { Breakscape } from '../../../../breakscaping/Breakscape';
import { Config } from '../../../../config/Config';
import { BodyPart, Mark } from '../../../../model/ast/Nodes';
import { TagsConfig } from '../../../../model/config/TagsConfig';
import { BitTypeType } from '../../../../model/enum/BitType';
import { Tag } from '../../../../model/enum/Tag';
import { TextFormatType } from '../../../../model/enum/TextFormat';
import { ArrayUtils } from '../../../../utils/ArrayUtils';

import { markTagContentProcessor } from './MarkTagContentProcessor';

import {
  BitContent,
  BitContentLevel,
  ContentDepthType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
} from '../BitmarkPegParserTypes';

const builder = new Builder();

function markChainContentProcessor(
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
    markTagContentProcessor(context, BitContentLevel.Chain, bitType, content, target);
  } else {
    const mark = buildMark(context, contentDepth, bitType, textFormat, tagsConfig, content);
    if (mark) bodyParts.push(mark);
  }
}

function buildMark(
  context: BitmarkPegParserContext,
  _contentDepth: ContentDepthType,
  bitType: BitTypeType,
  textFormat: TextFormatType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
): Mark | undefined {
  if (context.DEBUG_CHAIN_CONTENT) context.debugPrint('mark content', content);

  const markConfig = Config.getTagConfigForTag(tagsConfig, Tag.fromValue(content.type));

  const tags = context.bitContentProcessor(BitContentLevel.Chain, bitType, textFormat, tagsConfig, [content]);
  const chainTags = context.bitContentProcessor(
    BitContentLevel.Chain,
    bitType,
    textFormat,
    markConfig?.chain,
    content.chain,
  );

  if (context.DEBUG_CHAIN_TAGS) context.debugPrint('mark TAGS', chainTags);

  const { solution } = tags;
  const { mark: markType, ...rest } = chainTags;

  const mark = builder.mark({
    solution: solution ?? Breakscape.EMPTY_STRING,
    mark: ArrayUtils.asSingle(markType) ?? Breakscape.EMPTY_STRING,
    ...rest,
  });

  return mark;
}

export { markChainContentProcessor };
