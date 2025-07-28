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

function groupTagChainContentProcessor(
  context: BitmarkPegParserContext,
  _contentDepth: ContentDepthType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  // const { textFormat } = context;
  const { value } = content as TypeKeyValue;

  if (context.DEBUG_CHAIN_CONTENT) context.debugPrint('groupTag content', content);

  const tags = context.bitContentProcessor(BitContentLevel.Chain, tagsConfig, content.chain);

  if (context.DEBUG_CHAIN_TAGS) context.debugPrint('groupTag TAGS', tags);

  const { tag } = tags;

  // Extract the technicalTerm from the content tag
  const name = StringUtils.trimmedString(value) ?? '';

  const node: Partial<GroupTagJson> = {
    name,
    tags: tag ?? [],
  };

  if (!Array.isArray(target.groupTag)) target.groupTag = [];
  target.groupTag.push(node);
}

export { groupTagChainContentProcessor };
