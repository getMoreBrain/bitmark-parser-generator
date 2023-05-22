import { Builder } from '../../../../ast/Builder';
import { ImageResource, Partner, Resource } from '../../../../model/ast/Nodes';
import { BitTypeType } from '../../../../model/enum/BitType';
import { ResourceType } from '../../../../model/enum/ResourceType';
import { ObjectUtils } from '../../../../utils/ObjectUtils';

import {
  BitContent,
  BitContentLevel,
  BitContentLevelType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
  TypeKey,
  TypeValue,
} from '../BitmarkPegParserTypes';

const builder = new Builder();

function partnerChainContentProcessor(
  context: BitmarkPegParserContext,
  _bitLevel: BitContentLevelType,
  bitType: BitTypeType,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  const { value } = content as TypeValue;

  target.partner = buildPartner(context, bitType, value as BitContent[]);
}

function buildPartner(
  context: BitmarkPegParserContext,
  bitType: BitTypeType,
  content: BitContent[],
): Partner | undefined {
  if (context.DEBUG_PARTNER_CONTENT) context.debugPrint('partner content', content);

  const tags = context.bitContentProcessor(BitContentLevel.PartnerChain, bitType, content, [
    TypeKey.Property,
    TypeKey.Resource,
  ]);

  if (context.DEBUG_PARTNER_TAGS) context.debugPrint('partner TAGS', tags);

  const { extraProperties, resources } = tags;

  // Extract the name from the extra properties
  const name = ObjectUtils.extractSingleValue(extraProperties, 'partner') as string;

  // Extract avatarImage from the resources
  const avatarImage = extractAvatarImage(context, resources);

  const partner = builder.partner({
    name,
    avatarImage,
  });

  return partner;
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
