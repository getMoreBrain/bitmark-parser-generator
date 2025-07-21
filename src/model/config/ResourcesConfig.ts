import { type CountType } from '../enum/Count.ts';
import { type ResourceTagType } from '../enum/ResourceTag.ts';
import { type TagsConfig } from './TagsConfig.ts';

class ResourcesConfig {
  readonly tags: TagsConfig;
  readonly resourceAttachmentAllowed: boolean;
  readonly resourceTypeAttachment: ResourceTagType | undefined;
  readonly comboResourceTagTypesMap: Map<ResourceTagType, ResourceTagType[]>;

  public constructor(
    tags: TagsConfig,
    resourceAttachmentAllowed: boolean | undefined,
    resourceTypeAttachment: ResourceTagType | undefined,
    comboResourceTagTypesMap: Map<ResourceTagType, ResourceTagType[]>,
  ) {
    this.tags = tags;
    this.resourceAttachmentAllowed = resourceAttachmentAllowed ?? false;
    this.resourceTypeAttachment = resourceTypeAttachment;
    this.comboResourceTagTypesMap = comboResourceTagTypesMap;
  }

  public getCountsMin(): Map<ResourceTagType, number> {
    const counts: Map<ResourceTagType, number> = new Map();
    for (const r of Object.values(this.tags)) {
      if (r.minCount != null) {
        counts.set(r.tag as ResourceTagType, r.minCount);
      }
    }
    return counts;
  }

  public getCountsMax(): Map<ResourceTagType, CountType> {
    const counts: Map<ResourceTagType, CountType> = new Map();
    for (const r of Object.values(this.tags)) {
      if (r.maxCount != null) {
        counts.set(r.tag as ResourceTagType, r.maxCount);
      }
    }
    return counts;
  }
}

export { ResourcesConfig };
