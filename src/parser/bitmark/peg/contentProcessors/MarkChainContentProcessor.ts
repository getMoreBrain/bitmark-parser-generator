import { Builder } from '../../../../ast/Builder';
import { Breakscape } from '../../../../breakscaping/Breakscape';
import { Config } from '../../../../config/Config';
import { BodyPart, Mark } from '../../../../model/ast/Nodes';
import { TagsConfig } from '../../../../model/config/TagsConfig';
import { BitType } from '../../../../model/enum/BitType';
import { ArrayUtils } from '../../../../utils/ArrayUtils';

import { markTagContentProcessor } from './MarkTagContentProcessor';

import {
  BitContent,
  BitContentLevel,
  BitContentLevelType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
} from '../BitmarkPegParserTypes';

const builder = new Builder();

function markChainContentProcessor(
  context: BitmarkPegParserContext,
  bitType: BitType,
  bitLevel: BitContentLevelType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
  bodyParts: BodyPart[],
): void {
  if (bitLevel === BitContentLevel.Chain) {
    markTagContentProcessor(context, BitContentLevel.Chain, bitType, content, target);
  } else {
    const mark = buildMark(context, bitType, bitLevel, tagsConfig, content);
    if (mark) bodyParts.push(mark);
  }
}

function buildMark(
  context: BitmarkPegParserContext,
  bitType: BitType,
  _bitLevel: BitContentLevelType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
): Mark | undefined {
  if (context.DEBUG_CHAIN_CONTENT) context.debugPrint('mark content', content);

  const markConfig = Config.getTagConfigForTag(tagsConfig, content.type);

  const tags = context.bitContentProcessor(bitType, BitContentLevel.Chain, tagsConfig, [content]);
  const chainTags = context.bitContentProcessor(bitType, BitContentLevel.Chain, markConfig?.chain, content.chain);

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
