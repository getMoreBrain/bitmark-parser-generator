import { Builder } from '../../../../ast/Builder';
import { BreakscapedString } from '../../../../model/ast/BreakscapedString';
import { ImageResource, Resource } from '../../../../model/ast/Nodes';
import { TagsConfig } from '../../../../model/config/TagsConfig';
import { BitTypeType } from '../../../../model/enum/BitType';
import { ResourceTag } from '../../../../model/enum/ResourceTag';
import { TextFormatType } from '../../../../model/enum/TextFormat';
import { StringUtils } from '../../../../utils/StringUtils';

import {
  BitContent,
  BitContentLevel,
  ContentDepthType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
} from '../BitmarkPegParserTypes';

const builder = new Builder();

function personChainContentProcessor(
  context: BitmarkPegParserContext,
  _contentDepth: ContentDepthType,
  bitType: BitTypeType,
  textFormat: TextFormatType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  // const { value } = content as TypeValue;

  if (context.DEBUG_CHAIN_CONTENT) context.debugPrint('person content', content);

  const tags = context.bitContentProcessor(BitContentLevel.Chain, bitType, textFormat, tagsConfig, content.chain);

  if (context.DEBUG_CHAIN_TAGS) context.debugPrint('person TAGS', tags);

  const { propertyTitle, resources } = tags;

  // Extract the name from the content tag
  const name = StringUtils.trimmedString(content.value) as BreakscapedString;

  // Extract the title from the propertyTitle tag
  const title = StringUtils.trimmedString(propertyTitle) as BreakscapedString;

  // Extract avatarImage from the resources
  const avatarImage = extractAvatarImage(context, resources);

  const person = builder.person({
    name,
    title,
    avatarImage,
  });

  target.person = person;
}

function extractAvatarImage(
  context: BitmarkPegParserContext,
  resources: Resource[] | undefined,
): ImageResource | undefined {
  // Extract avatarImage from the resources
  // Return the actual resource, and add all other resources to excess resources
  let avatarImage: ImageResource | undefined;
  const excessResources: Resource[] = [];

  if (resources) {
    for (const r of resources.reverse()) {
      if (!avatarImage && ResourceTag.image === r.type) {
        avatarImage = r as ImageResource;
      } else {
        excessResources.push(r);
      }
    }
  }

  if (excessResources.length > 0) {
    // Set the excess resources in the parser info
    context.parser.excessResources = excessResources;

    // Add an warning to warn about the excess resources
    context.addWarning(`${excessResources.length} excess resource(s) present in the [@person] chain.`);
  }

  return avatarImage;
}

export { personChainContentProcessor };
