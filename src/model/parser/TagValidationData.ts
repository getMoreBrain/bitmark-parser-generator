import type { ConfigKeyType } from '../config/enum/ConfigKey.ts';
import { type TagsConfig } from '../config/TagsConfig.ts';
import { type BitTagConfigKeyTypeType } from '../enum/BitTagConfigKeyType.ts';
import { type CountType } from '../enum/Count.ts';
import { type TagType } from '../enum/Tag.ts';
import { type ParserData } from './ParserData.ts';

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
  _type: BitTagConfigKeyTypeType | InternalTagTypes;
  _tag: TagType | string | InternalTagTypes;
  _seenCount: number;
  _previous?: ParserData;
}
