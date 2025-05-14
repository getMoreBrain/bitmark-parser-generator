import { Breakscape } from '../../../../breakscaping/Breakscape';
import { Config } from '../../../../config/Config';
import { BreakscapedString } from '../../../../model/ast/BreakscapedString';
import { TagsConfig } from '../../../../model/config/TagsConfig';
import { PropertyTag } from '../../../../model/enum/PropertyTag';
import { TextFormat } from '../../../../model/enum/TextFormat';
import { MarkConfigJson } from '../../../../model/json/BitJson';
import { StringUtils } from '../../../../utils/StringUtils';

import {
  BitContent,
  BitContentLevel,
  ContentDepthType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
  TypeKeyValue,
} from '../BitmarkPegParserTypes';

function markConfigChainContentProcessor(
  context: BitmarkPegParserContext,
  _contentDepth: ContentDepthType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  const { key: tag } = content as TypeKeyValue;

  if (context.DEBUG_CHAIN_CONTENT) context.debugPrint('mark content', content);

  const markConfig = target.markConfig;

  if (!markConfig) return;

  const markTagConfig = Config.getTagConfigForTag(tagsConfig, PropertyTag.fromValue(tag));

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { mark: _ignoreMark, ...tags } = context.bitContentProcessor(
    BitContentLevel.Chain,
    markTagConfig?.chain,
    content.chain,
  );

  if (context.DEBUG_CHAIN_TAGS) context.debugPrint('mark TAGS', tags);

  // Extract the name from the content tag
  const mark: string = Breakscape.unbreakscape(
    (StringUtils.trimmedString(content.value) ?? 'unknown') as BreakscapedString,
    {
      textFormat: TextFormat.tag,
    },
  );

  const config: Partial<MarkConfigJson> = {
    mark,
    emphasis: 'underline' as string,
    ...tags,
  };

  if (config) markConfig.push(config);
}

export { markConfigChainContentProcessor };
