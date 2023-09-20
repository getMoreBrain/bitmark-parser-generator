import { Builder } from '../../../../ast/Builder';
import { Config } from '../../../../config/Config_RENAME';
import { ImageResource, Resource } from '../../../../model/ast/Nodes';
import { BitType } from '../../../../model/enum/BitType';
import { ResourceTag } from '../../../../model/enum/ResourceTag';
import { StringUtils } from '../../../../utils/StringUtils';

import {
  BitContent,
  BitContentLevel,
  BitContentLevelType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
  TypeKeyValue,
} from '../BitmarkPegParserTypes';

const builder = new Builder();

function partnerChainContentProcessor(
  context: BitmarkPegParserContext,
  _bitLevel: BitContentLevelType,
  bitType: BitType,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  // const { value } = content as TypeValue;

  if (context.DEBUG_CHAIN_CONTENT) context.debugPrint('partner content', content);

  // Build the variables required to process the chain
  const { key } = content as TypeKeyValue;
  const parentTagConfig = Config.getTagConfigFromTag(bitType, key);

  const tags = context.bitContentProcessor(BitContentLevel.Chain, bitType, parentTagConfig, content.chain);

  if (context.DEBUG_CHAIN_TAGS) context.debugPrint('partner TAGS', tags);

  const { resources } = tags;

  // Extract the name from the content tag
  const name = StringUtils.trimmedString(content.value);

  // Extract avatarImage from the resources
  const avatarImage = extractAvatarImage(context, resources);

  const partner = builder.partner({
    name,
    avatarImage,
  });

  target.partner = partner;
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
    context.addWarning(`${excessResources.length} excess resource(s) present in the [@parter] chain.`);
  }

  return avatarImage;
}

export { partnerChainContentProcessor };
