import { Builder } from '../../../../ast/Builder';
import { ImageResource, Resource } from '../../../../model/ast/Nodes';
import { BitTypeType } from '../../../../model/enum/BitType';
import { ResourceType } from '../../../../model/enum/ResourceType';
import { TextFormatType } from '../../../../model/enum/TextFormat';
import { StringUtils } from '../../../../utils/StringUtils';

import {
  BitContent,
  BitContentLevel,
  BitContentLevelType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
} from '../BitmarkPegParserTypes';

const builder = new Builder();

function partnerChainContentProcessor(
  context: BitmarkPegParserContext,
  _bitLevel: BitContentLevelType,
  bitType: BitTypeType,
  textFormat: TextFormatType,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  // const { value } = content as TypeValue;

  if (context.DEBUG_CHAIN_CONTENT) context.debugPrint('partner content', content);

  const tags = context.bitContentProcessor(BitContentLevel.Chain, bitType, textFormat, content.chain);

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
      if (!avatarImage && ResourceType.image === r.type) {
        avatarImage = r as ImageResource;
      } else {
        excessResources.push(r);
      }
    }
  }

  if (excessResources.length > 0) {
    // Set the excess resources in the parser info
    context.parser.excessResources = excessResources;

    // Add an error to warn about the excess resources
    context.addError(`${excessResources.length} excess resource(s) present in the [@parter] chain.`);
  }

  return avatarImage;
}

export { partnerChainContentProcessor };
