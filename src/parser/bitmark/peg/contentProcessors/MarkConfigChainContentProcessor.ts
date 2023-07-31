import { Builder } from '../../../../ast/Builder';
import { BitTypeType } from '../../../../model/enum/BitType';
import { StringUtils } from '../../../../utils/StringUtils';

import {
  BitContent,
  BitContentLevel,
  BitContentLevelType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
} from '../BitmarkPegParserTypes';

const builder = new Builder();

function markConfigChainContentProcessor(
  context: BitmarkPegParserContext,
  _bitLevel: BitContentLevelType,
  bitType: BitTypeType,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  // const { value } = content as TypeValue;

  if (context.DEBUG_CHAIN_CONTENT) context.debugPrint('mark content', content);

  const markConfig = target.markConfig;

  if (!markConfig) return;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const tags = context.bitContentProcessor(BitContentLevel.Chain, bitType, content.chain);

  if (context.DEBUG_CHAIN_TAGS) context.debugPrint('mark TAGS', tags);

  // Extract the name from the content tag
  const type: string = StringUtils.trimmedString(content.value) ?? 'unknown';

  const config = builder.markConfig({
    type,
    ...tags,
  });

  markConfig.push(config);
}

export { markConfigChainContentProcessor };
