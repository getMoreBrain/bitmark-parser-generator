import { Builder } from '../../../../ast/Builder';
import { TagsConfig } from '../../../../model/config/TagsConfig';
import { BitTypeType } from '../../../../model/enum/BitType';
import { PropertyTag } from '../../../../model/enum/PropertyTag';
import { TextFormatType } from '../../../../model/enum/TextFormat';
import { NumberUtils } from '../../../../utils/NumberUtils';

import {
  BitContent,
  BitContentLevel,
  BitContentLevelType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
  TypeKeyValue,
} from '../BitmarkPegParserTypes';

const builder = new Builder();

function ratingLevelChainContentProcessor(
  context: BitmarkPegParserContext,
  bitType: BitTypeType,
  textFormat: TextFormatType,
  _bitLevel: BitContentLevelType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  const { key, value } = content as TypeKeyValue;

  if (context.DEBUG_CHAIN_CONTENT) context.debugPrint('ratingLevel content', content);

  const tags = context.bitContentProcessor(bitType, textFormat, BitContentLevel.Chain, tagsConfig, content.chain);

  if (context.DEBUG_CHAIN_TAGS) context.debugPrint('ratingLevel TAGS', tags);

  const { label } = tags;

  // Extract the technicalTerm from the content tag
  const level = NumberUtils.asNumber(value) ?? 0;

  const node = builder.ratingLevelStartEnd({
    level,
    label,
  });

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
