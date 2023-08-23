import { Builder } from '../../../../ast/Builder';
import { BitType } from '../../../../model/enum/BitType';
import { StringUtils } from '../../../../utils/StringUtils';

import {
  BitContent,
  BitContentLevel,
  BitContentLevelType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
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

  const chainContent = [content, ...(content.chain ?? [])];

  const tags = context.bitContentProcessor(BitContentLevel.Chain, bitType, chainContent);

  if (context.DEBUG_CHAIN_TAGS) context.debugPrint('imageSource TAGS', tags);

  const { imageSourceUrl: url, mockupId, ...rest } = tags;

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
