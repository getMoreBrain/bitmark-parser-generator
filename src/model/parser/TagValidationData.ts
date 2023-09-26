import { TagsConfig } from '../config/TagsConfig';
import { ConfigKeyType } from '../config/enum/ConfigKey';
import { BitTagTypeType } from '../enum/BitTagType';
import { CountType } from '../enum/Count';
import { PropertyTagType } from '../enum/PropertyTag';
import { ResourceTagType } from '../enum/ResourceTag';
import { TagType } from '../enum/Tag';

import { ParserData } from './ParserData';

type InternalTagTypes = '||' | 'CardSet' | 'TextFormat' | 'BodyText' | 'CardText';

export interface TagValidationData {
  minCount: number; // Default: 0
  maxCount: CountType; // Default: 1
  chain?: TagsConfig; // Default: undefined
  isTag?: boolean; // Default: false
  isProperty?: boolean; // Default: false
  isResource?: boolean; // Default: false

  // Internal use only
  _configKey?: ConfigKeyType;
  _type: BitTagTypeType | InternalTagTypes;
  _tag: TagType | ResourceTagType | PropertyTagType | InternalTagTypes;
  _seenCount: number;
  _previous?: ParserData;
}
