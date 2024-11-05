import { Builder } from '../../../../ast/Builder';
import { TagsConfig } from '../../../../model/config/TagsConfig';
import { BitTypeType } from '../../../../model/enum/BitType';
import { PropertyTag } from '../../../../model/enum/PropertyTag';
import { TextFormatType } from '../../../../model/enum/TextFormat';
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

const builder = new Builder();
const textParser = new TextParser();

function ratingLevelChainContentProcessor(
  context: BitmarkPegParserContext,
  _contentDepth: ContentDepthType,
  bitType: BitTypeType,
  textFormat: TextFormatType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  const { key, value } = content as TypeKeyValue;

  if (context.DEBUG_CHAIN_CONTENT) context.debugPrint('ratingLevel content', content);

  const tags = context.bitContentProcessor(BitContentLevel.Chain, bitType, textFormat, tagsConfig, content.chain);

  if (context.DEBUG_CHAIN_TAGS) context.debugPrint('ratingLevel TAGS', tags);

  const { label } = tags;

  // Extract the technicalTerm from the content tag
  const level = NumberUtils.asNumber(value) ?? 0;

  const node = builder.ratingLevelStartEnd({
    level,
    label: label ? textParser.toAst(label) : undefined,
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
