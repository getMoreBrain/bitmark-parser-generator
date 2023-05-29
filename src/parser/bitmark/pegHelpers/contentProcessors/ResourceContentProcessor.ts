import { ResourceBuilder } from '../../../../ast/ResourceBuilder';
import { AudioResource, ImageResource, Resource } from '../../../../model/ast/Nodes';
import { BitType, BitTypeType } from '../../../../model/enum/BitType';
import { ResourceType } from '../../../../model/enum/ResourceType';
import { BitUtils } from '../../../../utils/BitUtils';

import {
  BitContent,
  BitContentLevelType,
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
 * @param resourceType
 * @param resource
 */
function buildResource(
  context: BitmarkPegParserContext,
  bitType: BitTypeType,
  resourceType: string | undefined,
  resources: Resource[] | undefined,
): Resource | undefined {
  let resource: Resource | undefined;
  let filteredResources: Resource[] | undefined;
  const excessResources: Resource[] = [];

  // Handle special case for stillImageFilm
  if (bitType === BitType.stillImageFilm) {
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

  // Get the valid resource types for the bit
  const validResourceType = BitUtils.calculateValidResourceType(bitType, resourceType, undefined);

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

  if (resourceType && !resource) {
    context.addError(
      `Resource type '&${resourceType}' specified in the bit header, but such a resource is not present in the bit`,
    );
  }

  if (excessResources.length > 0) {
    // Set the excess resources in the parser info
    context.parser.excessResources = excessResources;

    // Add an error to warn about the excess resources
    const resourceTypeString = resourceType ? `&${resourceType}` : 'NOT SET';
    context.addError(
      `${excessResources.length} excess resource(s) present in the bit. The bit resource type is '${resourceTypeString}'`,
    );
  }

  return resource;
}

function resourceContentProcessor(
  _context: BitmarkPegParserContext,
  _bitLevel: BitContentLevelType,
  _bitType: BitTypeType,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { type: ignoreType, key, ...resourceData } = content as TypeKeyValue<string>;

  const resources = target.resources;

  if (!resources) return;

  const type = ResourceType.fromValue(key);
  if (type) {
    const resource = resourceBuilder.resource({
      type,
      ...resourceData,
    });
    if (resource) resources.push(resource);
  }
}

export { buildResource, resourceContentProcessor };
