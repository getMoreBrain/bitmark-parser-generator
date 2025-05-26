import { ResourceBuilder } from '../../../../ast/ResourceBuilder';
import { Breakscape } from '../../../../breakscaping/Breakscape';
import { Config } from '../../../../config/Config';
import { BreakscapedString } from '../../../../model/ast/BreakscapedString';
import { TagsConfig } from '../../../../model/config/TagsConfig';
import { Count } from '../../../../model/enum/Count';
import { ResourceTag, ResourceTagType } from '../../../../model/enum/ResourceTag';
import { TextFormat } from '../../../../model/enum/TextFormat';
import { TextLocation } from '../../../../model/enum/TextLocation';
import { ImageResourceJson, ImageResourceWrapperJson, ResourceJson } from '../../../../model/json/ResourceJson';

import {
  BitContent,
  BitContentLevel,
  ContentDepthType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
  TypeKeyValue,
} from '../BitmarkPegParserTypes';

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

  const validatedResourceTypeAttachemnt = ResourceTag.fromValue(resourceTypeAttachment);

  // Get the bit configuration for the bit
  const resourcesConfig = Config.getBitResourcesConfig(bitType, validatedResourceTypeAttachemnt);
  const resourceAttachmentAllowed = resourcesConfig.resourceAttachmentAllowed;
  const countsMin = resourcesConfig.getCountsMin(); // Returns a copy, so it can be modified
  const countsMax = resourcesConfig.getCountsMax(); // Returns a copy, so it can be modified

  // Find the excess resources and ensure we have the minimum resources
  if (resources) {
    for (const r of resources.reverse()) {
      let countMin = countsMin.get(r.__typeAlias) ?? 0;
      let countMax = countsMax.get(r.__typeAlias) ?? 0;

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
      countsMin.set(r.__typeAlias, countMin);
      countsMax.set(r.__typeAlias, countMax);
    }
  }

  // Raise a warning if the resource type is specified in the bit header, but no extra resource attachment is allowed
  if (!resourceAttachmentAllowed && resourceTypeAttachment) {
    const warningMsg = `Resource type [&${resourceTypeAttachment}] is specified in the bit header, but no extra resource is allowed for this bit.`;
    context.addWarning(warningMsg);
  } else if (filteredResources.length === 0 && resourceTypeAttachment) {
    context.addWarning(
      `Resource type [&${resourceTypeAttachment}] is specified in the bit header, but no such a resource is present`,
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { type: _ignoreType, key, value, chain } = content as TypeKeyValue<BreakscapedString>;

  const resources = target.resources;

  if (!resources) return;

  const type = ResourceTag.fromValue(key);
  if (type) {
    // Parse the resource chain
    const resourceConfig = Config.getTagConfigForTag(tagsConfig, type);

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
    const { posterImage, ...tags } = context.bitContentProcessor(BitContentLevel.Chain, resourceConfig?.chain, chain);

    // Handle the poster image
    let posterImageResource: ImageResourceJson | undefined;
    if (posterImage) {
      // Process the poster image chain
      const { subConfig: posterImageChainConfig, subChain: posterImageChain } = extractSubChain(
        resourceConfig?.chain,
        chain,
        'posterImage',
      );

      const { posterImage: unused, ...posterImageTags } = context.bitContentProcessor(
        BitContentLevel.Chain,
        posterImageChainConfig,
        posterImageChain,
      );
      unused;

      // Build the poster image resource
      posterImageResource = (
        resourceBuilder.resource(context, {
          type: ResourceTag.image,
          value: posterImage,
          ...posterImageTags,
        }) as ImageResourceWrapperJson
      ).image;
    }

    const resource = resourceBuilder.resource(context, {
      type,
      value: Breakscape.unbreakscape(value, {
        textFormat: TextFormat.bitmarkText,
        textLocation: TextLocation.tag,
      }),
      posterImage: posterImageResource,
      ...tags,
    });
    if (resource) resources.push(resource);
  }
}

function propertyStyleResourceContentProcessor(
  context: BitmarkPegParserContext,
  _contentDepth: ContentDepthType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
  type: ResourceTagType,
): void {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { type: _ignoreType, key, value, chain } = content as TypeKeyValue<BreakscapedString>;

  target.propertyStyleResources = target.propertyStyleResources ?? {};

  if (type) {
    // Parse the resource chain
    const resourceConfig = Config.getTagConfigForTag(tagsConfig, type);

    const { posterImage, ...tags } = context.bitContentProcessor(BitContentLevel.Chain, resourceConfig?.chain, chain);

    const posterImageResource = posterImage
      ? (
          resourceBuilder.resource(context, {
            type: ResourceTag.image,
            value: posterImage,
          }) as ImageResourceWrapperJson
        ).image
      : undefined;

    const resource = resourceBuilder.resource(context, {
      type,
      value: Breakscape.unbreakscape(value, {
        textFormat: TextFormat.bitmarkText,
        textLocation: TextLocation.tag,
      }),
      posterImage: posterImageResource,
      ...tags,
    });
    if (resource) target.propertyStyleResources[key] = resource;
  }
}

function extractSubChain(
  config: TagsConfig | undefined,
  chain: BitContent[] | undefined,
  key: string,
): { subConfig: TagsConfig | undefined; subChain: BitContent[] | undefined } {
  let subConfig: TagsConfig | undefined;
  if (config) {
    subConfig = config[key]?.chain;
  }

  const subChain = chain?.reduce(
    (acc, c) => {
      if (acc) return acc;
      const tkv = c as TypeKeyValue;
      if (tkv.key === 'posterImage') return tkv.chain;
      return undefined;
    },
    undefined as BitContent[] | undefined,
  );

  return { subConfig, subChain };
}

export { buildResources, resourceContentProcessor, propertyStyleResourceContentProcessor };
