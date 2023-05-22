import { Resource } from '../model/ast/Nodes';
import { BitType, BitTypeMetadata, BitTypeType } from '../model/enum/BitType';
import { ResourceType, ResourceTypeType } from '../model/enum/ResourceType';

class BitUtils {
  /**
   * Calculate the valid bit resource type based on the bit type, resource type, and resource.
   *
   * @param bitType if set, and no resourceType or resource is set, it will be used to calculate the valid resource
   * @param resourceType if set, it will be used as the valid resource type
   * @param resource if set, and resource type is not set, the resource type will be extracted from the resource
   * @returns the resource type or undefined if none set
   */
  calculateValidResourceType(
    bitType: BitTypeType | undefined,
    resourceType: string | undefined,
    resource: Resource | undefined,
  ): ResourceTypeType | undefined {
    let ret: ResourceTypeType | undefined;

    if (resourceType) {
      ret = ResourceType.fromValue(resourceType);
    }
    if (!ret && resource) {
      ret = resource.type;
    }

    if (!ret) {
      const meta = BitType.getMetadata<BitTypeMetadata>(bitType) ?? {};

      if (meta) {
        ret = meta.resourceType;
      }
    }

    return ret;
  }
}

const instance = new BitUtils();

export { instance as BitUtils };
