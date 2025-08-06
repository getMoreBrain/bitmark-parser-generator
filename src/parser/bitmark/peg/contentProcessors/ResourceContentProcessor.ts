import { ResourceBuilder } from '../../../../ast/ResourceBuilder.ts';
import { Breakscape } from '../../../../breakscaping/Breakscape.ts';
import { Config } from '../../../../config/Config.ts';
import { type BreakscapedString } from '../../../../model/ast/BreakscapedString.ts';
import { ConfigKey, type ConfigKeyType } from '../../../../model/config/enum/ConfigKey.ts';
import { type TagsConfig } from '../../../../model/config/TagsConfig.ts';
import { Count } from '../../../../model/enum/Count.ts';
import { ResourceType } from '../../../../model/enum/ResourceType.ts';
import { TextFormat } from '../../../../model/enum/TextFormat.ts';
import { TextLocation } from '../../../../model/enum/TextLocation.ts';
import {
  type ImageResourceJson,
  type ImageResourceWrapperJson,
  type ResourceJson,
} from '../../../../model/json/ResourceJson.ts';
import {
  type BitContent,
  BitContentLevel,
  type BitContentProcessorResult,
  type BitmarkPegParserContext,
  type ContentDepthType,
  type TypeKeyValue,
} from '../BitmarkPegParserTypes.ts';

// const builder = new Builder();
const resourceBuilder = new ResourceBuilder();

/**
 * Get the valid resource from all the resources on the bit, and add the invalid ones to
 * excess resources
 *
 * @param resourceTypeAttachment the resource type specified in the bit header
 * @param resources the resources on the bit
 */
function buildResources(
  context: BitmarkPegParserContext,
  resourceTypeAttachment: string | undefined,
  resources: ResourceJson[] | undefined,
): ResourceJson[] | undefined {
  const { bitType } = context;
  const filteredResources: ResourceJson[] = [];
  const excessResources: ResourceJson[] = [];

  const validatedResourceTypeAttachemnt = ResourceType.fromValue(resourceTypeAttachment);

  // Get the bit configuration for the bit
  const resourcesConfig = Config.getBitResourcesConfig(bitType, validatedResourceTypeAttachemnt);
  const resourceAttachmentAllowed = resourcesConfig.resourceAttachmentAllowed;
  const countsMin = resourcesConfig.getCountsMin(); // Returns a copy, so it can be modified
  const countsMax = resourcesConfig.getCountsMax(); // Returns a copy, so it can be modified

  // Find the excess resources and ensure we have the minimum resources
  if (resources) {
    for (const r of resources.reverse()) {
      const configKey = r.__configKey;
      let countMin = countsMin.get(configKey) ?? 0;
      let countMax = countsMax.get(configKey) ?? 0;

      // Decrement the minimum count and later ensure it is 0
      countMin = Math.max(0, countMin - 1);

      if (countMax === Count.infinity) {
        filteredResources.unshift(r);
      } else if (countMax > 0) {
        // We still have a count left for this resource
        filteredResources.unshift(r);
        countMax--;
      } else {
        excessResources.unshift(r);
      }

      // Set the new counts
      countsMin.set(configKey, countMin);
      countsMax.set(configKey, countMax);

      if (r.__invalid) {
        context.addWarning(`Resource type [&${r.type}] is not valid`);
      }
    }
  }

  // Raise a warning if the resource type is specified in the bit header, but no extra resource attachment is allowed
  if (!resourceAttachmentAllowed && resourceTypeAttachment) {
    const warningMsg = `Resource type [&${resourceTypeAttachment}] is specified in the bit header, but no extra resource is allowed for this bit.`;
    context.addWarning(warningMsg);
  } else if (filteredResources.length === 0 && resourceTypeAttachment) {
    context.addWarning(
      `Resource type [&${resourceTypeAttachment}] is specified in the bit header, but no such resource is present`,
    );
  }

  if (excessResources.length > 0) {
    // Set the excess resources in the parser info
    context.parser.excessResources = excessResources;
  }

  return filteredResources;
}

function resourceContentProcessor(
  context: BitmarkPegParserContext,
  _contentDepth: ContentDepthType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  const { type: _ignoreType, key, value, chain } = content as TypeKeyValue<BreakscapedString>;

  const resources = target.resources;

  if (!resources) return;

  const configKey = ConfigKey.fromValue(key);
  if (!configKey) return;
  const resourceType = ResourceType.fromKey(configKey.replace(/^&/, '')) ?? ResourceType.unknown;

  // Parse the resource chain
  const resourceConfig = Config.getTagConfigForTag(tagsConfig, configKey);

  // const { posterImage, ...tags } = context.bitContentProcessor(
  //   BitContentLevel.Chain,
  //   bitType,
  //   textFormat,
  //   resourceConfig?.chain,
  //   chain,
  // );

  // // If the chain contains a poster image, the chain is split at this point, and any tags after the poster image
  // // apply to the poster image, not the original resource.
  // const { originalChain, posterImageChain } = extractPosterImageChain(chain);
  // const posterImageChainConfig = resourceConfig?.chain?.posterImage?.chain;

  // // Process the poster image chain
  // const { posterImage: unused, ...posterImageTags } = context.bitContentProcessor(
  //   BitContentLevel.Chain,
  //   bitType,
  //   textFormat,
  //   posterImageChainConfig,
  //   posterImageChain,
  // );
  // unused;

  // // Process the remaining chain
  // const { posterImage, ...tags } = context.bitContentProcessor(
  //   BitContentLevel.Chain,
  //   bitType,
  //   textFormat,
  //   resourceConfig?.chain,
  //   originalChain,
  // );

  // Process the chain
  const { posterImage, ...tags } = context.bitContentProcessor(
    BitContentLevel.Chain,
    resourceConfig?.chain,
    chain,
  );

  // Handle the poster image
  let posterImageResource: ImageResourceJson | undefined;
  if (posterImage) {
    // Process the poster image chain
    const { subConfig: posterImageChainConfig, subChain: posterImageChain } = extractSubChain(
      resourceConfig?.chain,
      chain,
      ConfigKey.property_posterImage,
    );

    const { posterImage: _unused, ...posterImageTags } = context.bitContentProcessor(
      BitContentLevel.Chain,
      posterImageChainConfig,
      posterImageChain,
    );

    // Build the poster image resource
    posterImageResource = (
      resourceBuilder.resource(context, {
        type: ResourceType.image,
        value: posterImage,
        ...posterImageTags,
      }) as ImageResourceWrapperJson
    ).image;
  }

  const resource = resourceBuilder.resource(context, {
    type: resourceType,
    value: Breakscape.unbreakscape(value, {
      format: TextFormat.bitmarkText,
      location: TextLocation.tag,
    }),
    posterImage: posterImageResource,
    ...tags,
  });
  if (resource) {
    // Depending on the resource type, add it to the appropriate part of the target
    if (
      configKey === ConfigKey.resource_backgroundWallpaper ||
      configKey === ConfigKey.resource_imagePlaceholder
    ) {
      if (target.propertyStyleResources) target.propertyStyleResources[resourceType] = resource;
    } else {
      resources.push(resource);
    }
  }
}

function extractSubChain(
  config: TagsConfig | undefined,
  chain: BitContent[] | undefined,
  configKey: ConfigKeyType,
): { subConfig: TagsConfig | undefined; subChain: BitContent[] | undefined } {
  let subConfig: TagsConfig | undefined;
  if (config) {
    subConfig = config[configKey]?.chain;
  }

  const subChain = chain?.reduce(
    (acc, c) => {
      if (acc) return acc;
      const tkv = c as TypeKeyValue;
      if (tkv.key === configKey) return tkv.chain;
      return undefined;
    },
    undefined as BitContent[] | undefined,
  );

  return { subConfig, subChain };
}

export { buildResources, resourceContentProcessor };
