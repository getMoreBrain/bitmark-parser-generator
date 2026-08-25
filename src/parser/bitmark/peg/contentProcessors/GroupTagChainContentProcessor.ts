import { type TagsConfig } from '../../../../model/config/TagsConfig.ts';
import { type GroupTagJson } from '../../../../model/json/BitJson.ts';
import { StringUtils } from '../../../../utils/StringUtils.ts';
import {
  type BitContent,
  BitContentLevel,
  type BitContentProcessorResult,
  type BitmarkPegParserContext,
  type ContentDepthType,
  type TypeKeyValue,
} from '../BitmarkPegParserTypes.ts';

// const textParser = new TextParser();

/**
 * Keys of the parser result that hold a group-tag array, and the key of the
 * chained member tag that fills each group's `tags`.
 */
type GroupTagKeys = {
  groupKey: 'groupTag' | 'accessibilityGroupTag';
  memberKey: 'tag' | 'accessibilityTag';
};

const GROUP_TAG: GroupTagKeys = { groupKey: 'groupTag', memberKey: 'tag' };
const ACCESSIBILITY_GROUP_TAG: GroupTagKeys = {
  groupKey: 'accessibilityGroupTag',
  memberKey: 'accessibilityTag',
};

function groupTagChainContentProcessor(
  context: BitmarkPegParserContext,
  _contentDepth: ContentDepthType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
  keys: GroupTagKeys = GROUP_TAG,
): void {
  // const { textFormat } = context;
  const { value } = content as TypeKeyValue;
  const { groupKey, memberKey } = keys;

  if (context.DEBUG_CHAIN_CONTENT) context.debugPrint(`${groupKey} content`, content);

  const tags = context.bitContentProcessor(BitContentLevel.Chain, tagsConfig, content.chain);

  if (context.DEBUG_CHAIN_TAGS) context.debugPrint(`${groupKey} TAGS`, tags);

  const memberTags = tags[memberKey];

  // Extract the technicalTerm from the content tag
  const name = StringUtils.trimmedString(value) ?? '';

  const node: Partial<GroupTagJson> = {
    name,
    tags: memberTags ?? [],
  };

  if (!Array.isArray(target[groupKey])) target[groupKey] = [];
  target[groupKey].push(node);
}

export { ACCESSIBILITY_GROUP_TAG, GROUP_TAG, groupTagChainContentProcessor };
