import { ResourceBuilder } from '../../../../ast/ResourceBuilder';
import { AudioResource, ImageResource, Resource } from '../../../../model/ast/Nodes';
import { BitType, BitTypeMetadata, BitTypeType } from '../../../../model/enum/BitType';
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

  // Get the meta data for the bit
  const meta = BitType.getMetadata<BitTypeMetadata>(bitType);
  const resourceAttachmentAllowed = meta?.resourceAttachmentAllowed;

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
  const rt = resourceAttachmentAllowed ? resourceType : undefined;
  const validResourceType = BitUtils.calculateValidResourceType(bitType, rt, undefined);

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
    let warningMsg = `Resource type '&${resourceType}' is specified in the bit header, but no extra resource is allowed for this bit.`;

    if (validResourceType) {
      warningMsg += ` The resource type '&${validResourceType}' is automatically expected and should not be added.`;
    }
    context.addWarning(warningMsg);
  }

  if (!resource) {
    if (resourceType) {
      context.addWarning(
        `Resource type '&${resourceType}' is specified in the bit header, but no such a resource is present in the bit`,
      );
    } else if (validResourceType) {
      context.addWarning(`Resource type '&${validResourceType}' is required but is not present in the bit`);
    }
  }

  if (excessResources.length > 0) {
    // Set the excess resources in the parser info
    context.parser.excessResources = excessResources;

    // Add an error to warn about the excess resources
    let warningMsg = `${excessResources.length} excess resource(s) present in the bit.`;
    if (validResourceType === BitType.stillImageFilm) {
      // Special case for stillImageFilm
      warningMsg += ` The expected resource types are '&image' and '&audio'`;
    } else {
      const resourceTypeString = validResourceType ? `&${validResourceType}` : 'NONE';
      warningMsg += ` The expected resource type is '${resourceTypeString}'`;
    }

    context.addWarning(warningMsg);
  }

  return resource;
}

function resourceContentProcessor(
  context: BitmarkPegParserContext,
  _bitLevel: BitContentLevelType,
  bitType: BitTypeType,
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
