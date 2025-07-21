import { type ResourceTagType } from '../enum/ResourceTag.ts';
import { type TagsConfig } from './TagsConfig.ts';

export interface TagsConfigWithInfo {
  tags: TagsConfig;
  info?: {
    comboResourceType?: ResourceTagType;
  };
}
