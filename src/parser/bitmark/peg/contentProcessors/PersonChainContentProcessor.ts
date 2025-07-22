import { Breakscape } from '../../../../breakscaping/Breakscape.ts';
import { type BreakscapedString } from '../../../../model/ast/BreakscapedString.ts';
import { type TagsConfig } from '../../../../model/config/TagsConfig.ts';
import { ResourceType } from '../../../../model/enum/ResourceType.ts';
import { TextFormat } from '../../../../model/enum/TextFormat.ts';
import { TextLocation } from '../../../../model/enum/TextLocation.ts';
import { type PersonJson } from '../../../../model/json/BitJson.ts';
import {
  type ImageResourceWrapperJson,
  type ResourceJson,
} from '../../../../model/json/ResourceJson.ts';
import { StringUtils } from '../../../../utils/StringUtils.ts';
import {
  type BitContent,
  BitContentLevel,
  type BitContentProcessorResult,
  type BitmarkPegParserContext,
  type ContentDepthType,
} from '../BitmarkPegParserTypes.ts';

function personChainContentProcessor(
  context: BitmarkPegParserContext,
  _contentDepth: ContentDepthType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  // const { value } = content as TypeValue;

  if (context.DEBUG_CHAIN_CONTENT) context.debugPrint('person content', content);

  const tags = context.bitContentProcessor(BitContentLevel.Chain, tagsConfig, content.chain);

  if (context.DEBUG_CHAIN_TAGS) context.debugPrint('person TAGS', tags);

  const { propertyTitle, resources } = tags;

  // Extract the name from the content tag
  const name = Breakscape.unbreakscape(
    StringUtils.trimmedString(content.value) as BreakscapedString,
    {
      format: TextFormat.bitmarkText,
      location: TextLocation.tag,
    },
  );

  // Extract the title from the propertyTitle tag
  const title = StringUtils.trimmedString(propertyTitle);

  // Extract avatarImage from the resources
  const avatarImage = extractAvatarImage(context, resources);

  const person: Partial<PersonJson> = {
    name,
    title,
    avatarImage,
  };

  target.person = person;
}

function extractAvatarImage(
  context: BitmarkPegParserContext,
  resources: ResourceJson[] | undefined,
): ImageResourceWrapperJson | undefined {
  // Extract avatarImage from the resources
  // Return the actual resource, and add all other resources to excess resources
  let avatarImage: ImageResourceWrapperJson | undefined;
  const excessResources: ResourceJson[] = [];

  if (resources) {
    for (const r of resources.reverse()) {
      if (!avatarImage && ResourceType.image === r.type) {
        avatarImage = r;
      } else {
        excessResources.push(r);
      }
    }
  }

  if (excessResources.length > 0) {
    // Set the excess resources in the parser info
    context.parser.excessResources = excessResources;

    // Add an warning to warn about the excess resources
    context.addWarning(
      `${excessResources.length} excess resource(s) present in the [@person] chain.`,
    );
  }

  return avatarImage;
}

export { personChainContentProcessor };
