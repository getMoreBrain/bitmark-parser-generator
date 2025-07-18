import { TagsConfig } from '../../../../model/config/TagsConfig';
import { PropertyTag } from '../../../../model/enum/PropertyTag';
import { TextLocation } from '../../../../model/enum/TextLocation';
import { RatingLevelStartEndJson } from '../../../../model/json/BitJson';
import { NumberUtils } from '../../../../utils/NumberUtils';
import { TextParser } from '../../../text/TextParser';

import {
  BitContent,
  BitContentLevel,
  ContentDepthType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
  TypeKeyValue,
} from '../BitmarkPegParserTypes';

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
    label: label ? textParser.toAst(label, { format: textFormat, location: TextLocation.tag }) : undefined,
  };

  switch (key) {
    case PropertyTag.ratingLevelStart:
      target.ratingLevelStart = node;

      break;
    case PropertyTag.ratingLevelEnd:
      target.ratingLevelEnd = node;

      break;
    default:
    // Do nothing
  }
}

export { ratingLevelChainContentProcessor };
