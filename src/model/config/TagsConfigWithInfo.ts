import { ResourceTagType } from '../enum/ResourceTag';

import { TagsConfig } from './TagsConfig';

export interface TagsConfigWithInfo {
  tags: TagsConfig;
  info?: {
    comboResourceType?: ResourceTagType;
  };
}
