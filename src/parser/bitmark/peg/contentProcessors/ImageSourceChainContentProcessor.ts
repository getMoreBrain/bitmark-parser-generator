import { Builder } from '../../../../ast/Builder';
import { Config } from '../../../../config/Config_RENAME';
import { BitType } from '../../../../model/enum/BitType';
import { StringUtils } from '../../../../utils/StringUtils';

import {
  BitContent,
  BitContentLevel,
  BitContentLevelType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
  TypeKeyValue,
  TypeValue,
} from '../BitmarkPegParserTypes';

const builder = new Builder();

function imageSourceChainContentProcessor(
  context: BitmarkPegParserContext,
  bitLevel: BitContentLevelType,
  bitType: BitType,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  if (bitLevel === BitContentLevel.Chain) {
    imageSourceTagContentProcessor(context, bitLevel, bitType, content, target);
  } else {
    buildImageSource(context, bitLevel, bitType, content, target);
  }
}

function imageSourceTagContentProcessor(
  _context: BitmarkPegParserContext,
  _bitLevel: BitContentLevelType,
  _bitType: BitType,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  const { value } = content as TypeValue;

  // Extract the url from the content tag
  const url = StringUtils.trimmedString(value);

  target.imageSourceUrl = url;
}

function buildImageSource(
  context: BitmarkPegParserContext,
  _bitLevel: BitContentLevelType,
  bitType: BitType,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  if (context.DEBUG_CHAIN_CONTENT) context.debugPrint('imageSource content', content);

  // Build the variables required to process the chain
  const { key } = content as TypeKeyValue;
  const parentTagConfig = Config.getTagConfigFromTag(bitType, key);

  const tags = context.bitContentProcessor(BitContentLevel.Chain, bitType, undefined, [content]);
  const chainTags = context.bitContentProcessor(BitContentLevel.Chain, bitType, parentTagConfig, content.chain);

  if (context.DEBUG_CHAIN_TAGS) context.debugPrint('imageSource TAGS', chainTags);

  const { imageSourceUrl: url } = tags;
  const { mockupId, ...rest } = chainTags;

  if (!url) {
    context.addWarning('[@imageSource] is missing the image url', content);
  }
  if (!mockupId) {
    context.addWarning('[@mockupId:xxx] is missing from [@imageSource]', content);
  }

  const imageSource = builder.imageSource({
    url: url ?? '',
    mockupId: mockupId ?? '',
    ...rest,
  });

  target.imageSource = imageSource;
}

export { imageSourceChainContentProcessor };
