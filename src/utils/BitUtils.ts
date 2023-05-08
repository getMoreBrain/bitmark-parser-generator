import { Resource } from '../model/ast/Nodes';
import { BitType } from '../model/enum/BitType';
import { ResourceType, ResourceTypeType } from '../model/enum/ResourceType';

class BitUtils {
  /**
   * Calculate the final resource type based on the bit type, resource type, and resource.
   *
   * @param bitType
   * @param resourceType
   * @param resource
   * @returns the resource type or undefined if none set
   */
  calculateResourceType(
    bitType: string,
    resourceType: string | undefined,
    resource: Resource | undefined,
  ): ResourceTypeType | undefined {
    if (resourceType) return ResourceType.fromValue(resourceType);
    if (resource) return resource.type;

    switch (bitType) {
      case BitType.document:
        return ResourceType.document;

      case BitType.documentLink:
        return ResourceType.documentLink;

      case BitType.documentDownload:
        return ResourceType.documentDownload;

      case BitType.video:
        return BitType.video;

      case BitType.videoLink:
        return BitType.videoLink;

      default:
      // Do nothing
    }

    return undefined;
  }
}

const instance = new BitUtils();

export { instance as BitUtils };
