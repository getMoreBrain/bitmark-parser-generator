import { Builder } from '../../../../ast/Builder';
import { TagsConfig } from '../../../../model/config/TagsConfig';
import { BitTypeType } from '../../../../model/enum/BitType';
import { TextFormatType } from '../../../../model/enum/TextFormat';
import { NumberUtils } from '../../../../utils/NumberUtils';

import {
  BitContent,
  BitContentLevel,
  BitContentLevelType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
} from '../BitmarkPegParserTypes';

const builder = new Builder();

function servingsChainContentProcessor(
  context: BitmarkPegParserContext,
  bitType: BitTypeType,
  textFormat: TextFormatType,
  _bitLevel: BitContentLevelType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  // const { value } = content as TypeValue;

  if (context.DEBUG_CHAIN_CONTENT) context.debugPrint('servings content', content);

  const tags = context.bitContentProcessor(bitType, textFormat, BitContentLevel.Chain, tagsConfig, content.chain);

  if (context.DEBUG_CHAIN_TAGS) context.debugPrint('servings TAGS', tags);

  const { unit, unitAbbr, disableCalculation } = tags;

  // Extract the servings from the content tag
  const servings = NumberUtils.asNumber(content.value) ?? 1;

  const node = builder.servings({
    servings,
    unit,
    unitAbbr,
    disableCalculation,
  });

  target.servings = node;
}

export { servingsChainContentProcessor };
