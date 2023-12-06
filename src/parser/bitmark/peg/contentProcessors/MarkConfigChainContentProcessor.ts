import { Builder } from '../../../../ast/Builder';
import { Config } from '../../../../config/Config';
import { BreakscapedString } from '../../../../model/ast/BreakscapedString';
import { TagsConfig } from '../../../../model/config/TagsConfig';
import { BitTypeType } from '../../../../model/enum/BitType';
import { StringUtils } from '../../../../utils/StringUtils';

import {
  BitContent,
  BitContentLevel,
  BitContentLevelType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
  TypeKeyValue,
} from '../BitmarkPegParserTypes';

const builder = new Builder();

function markConfigChainContentProcessor(
  context: BitmarkPegParserContext,
  bitType: BitTypeType,
  _bitLevel: BitContentLevelType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  const { key: tag } = content as TypeKeyValue;

  if (context.DEBUG_CHAIN_CONTENT) context.debugPrint('mark content', content);

  const markConfig = target.markConfig;

  if (!markConfig) return;

  const markTagConfig = Config.getTagConfigForTag(tagsConfig, tag);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { mark: _ignoreMark, ...tags } = context.bitContentProcessor(
    bitType,
    BitContentLevel.Chain,
    markTagConfig?.chain,
    content.chain,
  );

  if (context.DEBUG_CHAIN_TAGS) context.debugPrint('mark TAGS', tags);

  // Extract the name from the content tag
  const mark: BreakscapedString = (StringUtils.trimmedString(content.value) ?? 'unknown') as BreakscapedString;

  const config = builder.markConfig({
    mark,
    emphasis: 'underline' as BreakscapedString,
    ...tags,
  });

  markConfig.push(config);
}

export { markConfigChainContentProcessor };
