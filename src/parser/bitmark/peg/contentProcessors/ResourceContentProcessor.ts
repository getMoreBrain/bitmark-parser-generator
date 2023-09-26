import { ResourceBuilder } from '../../../../ast/ResourceBuilder';
import { Config } from '../../../../config/Config';
import { Resource } from '../../../../model/ast/Nodes';
import { TagsConfig } from '../../../../model/config/TagsConfig';
import { BitType } from '../../../../model/enum/BitType';
import { Count } from '../../../../model/enum/Count';
import { ResourceTag } from '../../../../model/enum/ResourceTag';

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
 * @param resourceTypeAttachment the resource type specified in the bit header
 * @param resources the resources on the bit
 */
function buildResource(
  context: BitmarkPegParserContext,
  bitType: BitType,
  resourceTypeAttachment: string | undefined,
  resources: Resource[] | undefined,
): Resource[] | undefined {
  const filteredResources: Resource[] = [];
  const excessResources: Resource[] = [];

  const validatedResourceTypeAttachemnt = ResourceTag.fromValue(resourceTypeAttachment);

  // Get the bit configuration for the bit
  const resourcesConfig = Config.getBitResourcesConfig(bitType, validatedResourceTypeAttachemnt);
  const resourceAttachmentAllowed = resourcesConfig.resourceAttachmentAllowed;
  const countsMin = resourcesConfig.getCountsMin(); // Returns a copy, so it can be modified
  const countsMax = resourcesConfig.getCountsMax(); // Returns a copy, so it can be modified

  // Find the excess resources and ensure we have the minimum resources
  if (resources) {
    for (const r of resources.reverse()) {
      let countMin = countsMin.get(r.typeAlias) ?? 0;
      let countMax = countsMax.get(r.typeAlias) ?? 0;

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
      countsMin.set(r.typeAlias, countMin);
      countsMax.set(r.typeAlias, countMax);
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
  bitType: BitType,
  _bitLevel: BitContentLevelType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { type: _ignoreType, key, value, chain } = content as TypeKeyValue<string>;

  const resources = target.resources;

  if (!resources) return;

  const type = ResourceTag.fromValue(key);
  if (type) {
    // Parse the resource chain
    const resourceConfig = Config.getTagConfigForTag(tagsConfig, key);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const tags = context.bitContentProcessor(bitType, BitContentLevel.Chain, resourceConfig?.chain, chain);

    const resource = resourceBuilder.resource({
      type,
      value,
      ...tags,
    });
    if (resource) resources.push(resource);
  }
}

export { buildResource as buildResources, resourceContentProcessor };
