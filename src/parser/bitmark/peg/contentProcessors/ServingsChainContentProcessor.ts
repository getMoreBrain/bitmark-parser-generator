import { Builder } from '../../../../ast/Builder';
import { TagsConfig } from '../../../../model/config/TagsConfig';
import { BitTypeType } from '../../../../model/enum/BitType';
import { TextFormatType } from '../../../../model/enum/TextFormat';
import { NumberUtils } from '../../../../utils/NumberUtils';

import {
  BitContent,
  BitContentLevel,
  ContentDepthType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
} from '../BitmarkPegParserTypes';

const builder = new Builder();

function servingsChainContentProcessor(
  context: BitmarkPegParserContext,
  _contentDepth: ContentDepthType,
  bitType: BitTypeType,
  textFormat: TextFormatType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  // const { value } = content as TypeValue;

  if (context.DEBUG_CHAIN_CONTENT) context.debugPrint('servings content', content);

  const tags = context.bitContentProcessor(BitContentLevel.Chain, bitType, textFormat, tagsConfig, content.chain);

  if (context.DEBUG_CHAIN_TAGS) context.debugPrint('servings TAGS', tags);

  const { unit, unitAbbr, decimalPlaces, disableCalculation, hint } = tags;

  // Extract the servings from the content tag
  const servings = NumberUtils.asNumber(content.value) ?? 1;

  const node = builder.servings({
    servings,
    unit,
    unitAbbr,
    decimalPlaces: decimalPlaces ?? 1,
    disableCalculation,
    hint,
  });

  target.servings = node;
}

export { servingsChainContentProcessor };
