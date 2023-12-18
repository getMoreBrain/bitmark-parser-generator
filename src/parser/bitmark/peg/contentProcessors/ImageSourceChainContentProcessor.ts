import { Builder } from '../../../../ast/Builder';
import { Breakscape } from '../../../../breakscaping/Breakscape';
import { Config } from '../../../../config/Config';
import { BreakscapedString } from '../../../../model/ast/BreakscapedString';
import { TagsConfig } from '../../../../model/config/TagsConfig';
import { BitTypeType } from '../../../../model/enum/BitType';
import { TextFormatType } from '../../../../model/enum/TextFormat';
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
  bitType: BitTypeType,
  textFormat: TextFormatType,
  bitLevel: BitContentLevelType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  if (bitLevel === BitContentLevel.Chain) {
    imageSourceTagContentProcessor(context, bitType, textFormat, bitLevel, tagsConfig, content, target);
  } else {
    buildImageSource(context, bitType, textFormat, bitLevel, tagsConfig, content, target);
  }
}

function imageSourceTagContentProcessor(
  _context: BitmarkPegParserContext,
  _bitType: BitTypeType,
  _textFormat: TextFormatType,
  _bitLevel: BitContentLevelType,
  _tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  const { value } = content as TypeValue;

  // Extract the url from the content tag
  const url = StringUtils.trimmedString(value) as BreakscapedString;

  target.imageSourceUrl = url;
}

function buildImageSource(
  context: BitmarkPegParserContext,
  bitType: BitTypeType,
  textFormat: TextFormatType,
  _bitLevel: BitContentLevelType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  if (context.DEBUG_CHAIN_CONTENT) context.debugPrint('imageSource content', content);

  const { key: tag } = content as TypeKeyValue;
  const imageSourceConfig = Config.getTagConfigForTag(tagsConfig, tag);

  const tags = context.bitContentProcessor(bitType, textFormat, BitContentLevel.Chain, tagsConfig, [content]);
  const chainTags = context.bitContentProcessor(
    bitType,
    textFormat,
    BitContentLevel.Chain,
    imageSourceConfig?.chain,
    content.chain,
  );

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
    url: url ?? Breakscape.EMPTY_STRING,
    mockupId: mockupId ?? Breakscape.EMPTY_STRING,
    ...rest,
  });

  target.imageSource = imageSource;
}

export { imageSourceChainContentProcessor };
