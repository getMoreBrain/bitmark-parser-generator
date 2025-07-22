import { Breakscape } from '../../../../breakscaping/Breakscape.ts';
import { Config } from '../../../../config/Config.ts';
import { type BreakscapedString } from '../../../../model/ast/BreakscapedString.ts';
import { ConfigKey } from '../../../../model/config/enum/ConfigKey.ts';
import { type TagsConfig } from '../../../../model/config/TagsConfig.ts';
import { TextFormat } from '../../../../model/enum/TextFormat.ts';
import { TextLocation } from '../../../../model/enum/TextLocation.ts';
import { type MarkConfigJson } from '../../../../model/json/BitJson.ts';
import { StringUtils } from '../../../../utils/StringUtils.ts';
import {
  type BitContent,
  BitContentLevel,
  type BitContentProcessorResult,
  type BitmarkPegParserContext,
  type ContentDepthType,
  type TypeKeyValue,
} from '../BitmarkPegParserTypes.ts';

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

  const markTagConfig = Config.getTagConfigForTag(tagsConfig, ConfigKey.fromValue(tag));

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
      format: TextFormat.bitmarkText,
      location: TextLocation.tag,
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
