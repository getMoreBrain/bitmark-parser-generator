import { Breakscape } from '../../../../breakscaping/Breakscape';
import { Config } from '../../../../config/Config';
import { BreakscapedString } from '../../../../model/ast/BreakscapedString';
import { TagsConfig } from '../../../../model/config/TagsConfig';
import { PropertyTag } from '../../../../model/enum/PropertyTag';
import { ImageSourceJson } from '../../../../model/json/BitJson';
import { StringUtils } from '../../../../utils/StringUtils';

import {
  BitContent,
  BitContentLevel,
  ContentDepthType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
  TypeKeyValue,
  TypeValue,
} from '../BitmarkPegParserTypes';

function imageSourceChainContentProcessor(
  context: BitmarkPegParserContext,
  contentDepth: ContentDepthType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  if (contentDepth === BitContentLevel.Chain) {
    imageSourceTagContentProcessor(context, contentDepth, tagsConfig, content, target);
  } else {
    buildImageSource(context, contentDepth, tagsConfig, content, target);
  }
}

function imageSourceTagContentProcessor(
  _context: BitmarkPegParserContext,
  _contentDepth: ContentDepthType,
  _tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  const { value } = content as TypeValue;

  // Extract the url from the content tag
  const url = Breakscape.unbreakscape(StringUtils.trimmedString(value) as BreakscapedString);

  target.imageSourceUrl = url;
}

function buildImageSource(
  context: BitmarkPegParserContext,
  _contentDepth: ContentDepthType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  if (context.DEBUG_CHAIN_CONTENT) context.debugPrint('imageSource content', content);

  const { key: tag } = content as TypeKeyValue;
  const imageSourceConfig = Config.getTagConfigForTag(tagsConfig, PropertyTag.fromValue(tag));

  const tags = context.bitContentProcessor(BitContentLevel.Chain, tagsConfig, [content]);
  const chainTags = context.bitContentProcessor(BitContentLevel.Chain, imageSourceConfig?.chain, content.chain);

  if (context.DEBUG_CHAIN_TAGS) context.debugPrint('imageSource TAGS', chainTags);

  const { imageSourceUrl: url } = tags;
  const { mockupId, ...rest } = chainTags;

  if (!url) {
    context.addWarning('[@imageSource] is missing the image url', content);
  }
  if (!mockupId) {
    context.addWarning('[@mockupId:xxx] is missing from [@imageSource]', content);
  }

  const imageSource: Partial<ImageSourceJson> = {
    url: url ?? '',
    mockupId: mockupId ?? '',
    ...rest,
  };

  target.imageSource = imageSource;
}

export { imageSourceChainContentProcessor };
