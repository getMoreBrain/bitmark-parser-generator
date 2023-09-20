import { Builder } from '../../../../ast/Builder';
import { Config } from '../../../../config/Config_RENAME';
import { BodyPart, Mark } from '../../../../model/ast/Nodes';
import { BitType } from '../../../../model/enum/BitType';
import { ArrayUtils } from '../../../../utils/ArrayUtils';

import { markTagContentProcessor } from './MarkTagContentProcessor';

import {
  BitContent,
  BitContentLevel,
  BitContentLevelType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
  TypeKeyValue,
} from '../BitmarkPegParserTypes';

const builder = new Builder();

function markChainContentProcessor(
  context: BitmarkPegParserContext,
  bitLevel: BitContentLevelType,
  bitType: BitType,
  content: BitContent,
  target: BitContentProcessorResult,
  bodyParts: BodyPart[],
): void {
  if (bitLevel === BitContentLevel.Chain) {
    markTagContentProcessor(context, BitContentLevel.Chain, bitType, content, target);
  } else {
    const mark = buildMark(context, bitType, content);
    if (mark) bodyParts.push(mark);
  }
}

function buildMark(context: BitmarkPegParserContext, bitType: BitType, content: BitContent): Mark | undefined {
  if (context.DEBUG_CHAIN_CONTENT) context.debugPrint('mark content', content);

  // Build the variables required to process the chain
  const { key } = content as TypeKeyValue;
  const parentTagConfig = Config.getTagConfigFromTag(bitType, key);

  const tags = context.bitContentProcessor(BitContentLevel.Chain, bitType, undefined, [content]);
  const chainTags = context.bitContentProcessor(BitContentLevel.Chain, bitType, parentTagConfig, content.chain);

  if (context.DEBUG_CHAIN_TAGS) context.debugPrint('mark TAGS', chainTags);

  const { solution } = tags;
  const { mark: markType, ...rest } = chainTags;

  const mark = builder.mark({
    solution: solution ?? '',
    mark: ArrayUtils.asSingle(markType) ?? '',
    ...rest,
  });

  return mark;
}

export { markChainContentProcessor };
