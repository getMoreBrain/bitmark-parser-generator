import { ConfigKey } from '../../../../model/config/enum/ConfigKey.ts';
import { type TagsConfig } from '../../../../model/config/TagsConfig.ts';
import { TextLocation } from '../../../../model/enum/TextLocation.ts';
import { type RatingLevelStartEndJson } from '../../../../model/json/BitJson.ts';
import { NumberUtils } from '../../../../utils/NumberUtils.ts';
import { TextParser } from '../../../text/TextParser.ts';
import {
  type BitContent,
  BitContentLevel,
  type BitContentProcessorResult,
  type BitmarkPegParserContext,
  type ContentDepthType,
  type TypeKeyValue,
} from '../BitmarkPegParserTypes.ts';

const textParser = new TextParser();

function ratingLevelChainContentProcessor(
  context: BitmarkPegParserContext,
  _contentDepth: ContentDepthType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  const { textFormat } = context;
  const { key, value } = content as TypeKeyValue;

  if (context.DEBUG_CHAIN_CONTENT) context.debugPrint('ratingLevel content', content);

  const tags = context.bitContentProcessor(BitContentLevel.Chain, tagsConfig, content.chain);

  if (context.DEBUG_CHAIN_TAGS) context.debugPrint('ratingLevel TAGS', tags);

  const { label } = tags;

  // Extract the technicalTerm from the content tag
  const level = NumberUtils.asNumber(value) ?? 0;

  const node: Partial<RatingLevelStartEndJson> = {
    level,
    label: label
      ? textParser.toAst(label, { format: textFormat, location: TextLocation.tag })
      : undefined,
  };

  switch (key) {
    case ConfigKey.property_ratingLevelStart:
      target.ratingLevelStart = node;

      break;
    case ConfigKey.property_ratingLevelEnd:
      target.ratingLevelEnd = node;

      break;
    default:
    // Do nothing
  }
}

export { ratingLevelChainContentProcessor };
