/* eslint-disable @typescript-eslint/no-explicit-any */
import { Builder } from '../../../../ast/Builder';
import { Resource } from '../../../../model/ast/Nodes';
import { BitTypeType } from '../../../../model/enum/BitType';
import { ResourceType } from '../../../../model/enum/ResourceType';
import { BitUtils } from '../../../../utils/BitUtils';

import {
  BitContent,
  BitContentLevelType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
  TypeKeyResource,
} from '../BitmarkPegParserTypes';

const builder = new Builder();

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
  const excessResources: Resource[] = [];

  const finalResourceType = BitUtils.calculateResourceType(bitType, resourceType, undefined);

  if (resources) {
    for (const r of resources.reverse()) {
      if (r.type === finalResourceType && !resource) {
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
  const { type: ignoreType, key, ...resourceData } = content as TypeKeyResource;

  const resources = target.resources;

  if (!resources) return;

  const type = ResourceType.fromValue(key);
  if (type) {
    const resource = builder.resource({
      type,
      ...resourceData,
    });
    if (resource) resources.push(resource);
  }
}

export { buildResource, resourceContentProcessor };
