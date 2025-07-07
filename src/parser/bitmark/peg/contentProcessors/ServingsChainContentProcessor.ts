import { type TagsConfig } from '../../../../model/config/TagsConfig.ts';
import { type ServingsJson } from '../../../../model/json/BitJson.ts';
import { NumberUtils } from '../../../../utils/NumberUtils.ts';
import {
  type BitContent,
  BitContentLevel,
  type BitContentProcessorResult,
  type BitmarkPegParserContext,
  type ContentDepthType,
} from '../BitmarkPegParserTypes.ts';

function servingsChainContentProcessor(
  context: BitmarkPegParserContext,
  _contentDepth: ContentDepthType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  // const { value } = content as TypeValue;

  if (context.DEBUG_CHAIN_CONTENT) context.debugPrint('servings content', content);

  const tags = context.bitContentProcessor(BitContentLevel.Chain, tagsConfig, content.chain);

  if (context.DEBUG_CHAIN_TAGS) context.debugPrint('servings TAGS', tags);

  const { unit, unitAbbr, decimalPlaces, disableCalculation, __hintString } = tags;

  // Extract the servings from the content tag
  const servings = NumberUtils.asNumber(content.value) ?? 1;

  const node: Partial<ServingsJson> = {
    servings,
    unit,
    unitAbbr,
    decimalPlaces: decimalPlaces ?? 1,
    disableCalculation,
    hint: __hintString,
  };

  target.servings = node;
}

export { servingsChainContentProcessor };
