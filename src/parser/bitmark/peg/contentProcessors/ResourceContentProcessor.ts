import { ResourceBuilder } from '../../../../ast/ResourceBuilder';
import { AudioResource, ImageResource, Resource } from '../../../../model/ast/Nodes';
import { BitType, RootBitType, RootBitTypeMetadata } from '../../../../model/enum/BitType';
import { ResourceType } from '../../../../model/enum/ResourceType';
import { BitUtils } from '../../../../utils/BitUtils';

import {
  BitContent,
  BitContentLevel,
  BitContentLevelType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
  TypeKeyValue,
} from '../BitmarkPegParserTypes';

const IMAGE_RESPONSIVE_RESOURCE_TYPES_MSG = ' The expected resource types are [&image-portrait] and [&image-landscape]';
const STILL_IMAGE_FILM_EXPECTED_RESOURCE_TYPES_MSG = ' The expected resource types are [&image] and [&audio]';

// const builder = new Builder();
const resourceBuilder = new ResourceBuilder();

/**
 * Get the valid resource from all the resources on the bit, and add the invalid ones to
 * excess resources
 *
 * @param resourceType
 * @param resource
 */
function buildResource(
  context: BitmarkPegParserContext,
  bitType: BitType,
  resourceType: string | undefined,
  resources: Resource[] | undefined,
): Resource | undefined {
  let resource: Resource | undefined;
  let filteredResources: Resource[] | undefined;
  const excessResources: Resource[] = [];

  // Get the meta data for the bit
  const meta = RootBitType.getMetadata<RootBitTypeMetadata>(bitType.root);
  const resourceAttachmentAllowed = meta?.resourceAttachmentAllowed;

  // Get the valid resource types for the bit
  const rt = resourceAttachmentAllowed ? resourceType : undefined;
  const validResourceType = BitUtils.calculateValidResourceType(bitType, rt, undefined);

  // Handle special cases for multiple resource bits (imageResponsive, stillImageFilm)
  if (validResourceType === ResourceType.imageResponsive) {
    if (resources) {
      filteredResources = [];
      let imagePortraitResource: ImageResource | undefined;
      let imageLandscapeResource: ImageResource | undefined;

      for (const r of resources.reverse()) {
        if (!imagePortraitResource && ResourceType.imagePortrait === r.typeAlias) {
          imagePortraitResource = r as ImageResource;
        } else if (!imageLandscapeResource && ResourceType.imageLandscape === r.typeAlias) {
          imageLandscapeResource = r as ImageResource;
        } else {
          filteredResources.push(r);
        }
      }
      resource = resourceBuilder.imageResponsiveResource({
        imagePortrait: imagePortraitResource,
        imageLandscape: imageLandscapeResource,
      });
    }
  } else if (validResourceType === ResourceType.stillImageFilm) {
    if (resources) {
      filteredResources = [];
      let imageResource: ImageResource | undefined;
      let audioResource: AudioResource | undefined;

      for (const r of resources.reverse()) {
        if (!imageResource && ResourceType.image === r.type) {
          imageResource = r as ImageResource;
        } else if (!audioResource && ResourceType.audio === r.type) {
          audioResource = r as AudioResource;
        } else {
          filteredResources.push(r);
        }
      }
      resource = resourceBuilder.stillImageFilmResource({
        image: imageResource,
        audio: audioResource,
      });
    }
  } else {
    filteredResources = resources;
  }

  // Return the actual resource, and add all other resources to excess resources
  if (filteredResources) {
    for (const r of filteredResources.reverse()) {
      if (!resource && validResourceType === r.type) {
        resource = r;
      } else {
        excessResources.push(r);
      }
    }
  }

  if (!resourceAttachmentAllowed && resourceType) {
    let warningMsg = `Resource type [&${resourceType}] is specified in the bit header, but no extra resource is allowed for this bit.`;

    if (validResourceType) {
      warningMsg += ` The resource type [&${validResourceType}] is automatically expected and should not be added.`;
    }
    context.addWarning(warningMsg);
  }

  if (!resource) {
    if (resourceType) {
      context.addWarning(
        `Resource type [&${resourceType}] is specified in the bit header, but no such a resource is present in the bit`,
      );
    } else if (validResourceType) {
      let warningMsg = `A resource is required but is not present in the bit.`;
      // Handle special cases for multiple resource bits (imageResponsive, stillImageFilm)
      if (validResourceType === RootBitType.imageResponsive) {
        warningMsg += IMAGE_RESPONSIVE_RESOURCE_TYPES_MSG;
      } else if (validResourceType === RootBitType.stillImageFilm) {
        warningMsg += STILL_IMAGE_FILM_EXPECTED_RESOURCE_TYPES_MSG;
      } else {
        const resourceTypeString = `[&${validResourceType}]`;
        warningMsg += ` The expected resource type is ${resourceTypeString}`;
      }

      context.addWarning(warningMsg);
    }
  }

  if (excessResources.length > 0) {
    // Set the excess resources in the parser info
    context.parser.excessResources = excessResources;

    // Add an error to warn about the excess resources
    let warningMsg = `${excessResources.length} excess resource(s) present in the bit.`;
    // Handle special cases for multiple resource bits (imageResponsive, stillImageFilm)
    if (validResourceType === RootBitType.imageResponsive) {
      warningMsg += IMAGE_RESPONSIVE_RESOURCE_TYPES_MSG;
    } else if (validResourceType === RootBitType.stillImageFilm) {
      warningMsg += STILL_IMAGE_FILM_EXPECTED_RESOURCE_TYPES_MSG;
    } else {
      const resourceTypeString = validResourceType ? `[&${validResourceType}]` : 'NONE';
      warningMsg += ` The expected resource type is ${resourceTypeString}`;
    }

    context.addWarning(warningMsg);
  }

  return resource;
}

function resourceContentProcessor(
  context: BitmarkPegParserContext,
  _bitLevel: BitContentLevelType,
  bitType: BitType,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { type: _ignoreType, key, value, chain } = content as TypeKeyValue<string>;

  const resources = target.resources;

  if (!resources) return;

  const type = ResourceType.fromValue(key);
  if (type) {
    // Parse the resource chain
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const tags = context.bitContentProcessor(BitContentLevel.Chain, bitType, chain);

    const resource = resourceBuilder.resource({
      type,
      value,
      ...tags,
    });
    if (resource) resources.push(resource);
  }
}

export { buildResource, resourceContentProcessor };
