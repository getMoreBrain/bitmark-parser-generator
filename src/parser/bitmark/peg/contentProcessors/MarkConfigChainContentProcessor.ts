import { Builder } from '../../../../ast/Builder';
import { Config } from '../../../../config/Config_RENAME';
import { BitType } from '../../../../model/enum/BitType';
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
  _bitLevel: BitContentLevelType,
  bitType: BitType,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  // const { value } = content as TypeValue;

  if (context.DEBUG_CHAIN_CONTENT) context.debugPrint('mark content', content);

  const markConfig = target.markConfig;

  if (!markConfig) return;

  // Build the variables required to process the chain
  const { key } = content as TypeKeyValue;
  const parentTagConfig = Config.getTagConfigFromTag(bitType, key);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { mark: _ignoreMark, ...tags } = context.bitContentProcessor(
    BitContentLevel.Chain,
    bitType,
    parentTagConfig,
    content.chain,
  );

  if (context.DEBUG_CHAIN_TAGS) context.debugPrint('mark TAGS', tags);

  // Extract the name from the content tag
  const mark: string = StringUtils.trimmedString(content.value) ?? 'unknown';

  const config = builder.markConfig({
    mark,
    emphasis: 'underline',
    ...tags,
  });

  markConfig.push(config);
}

export { markConfigChainContentProcessor };
