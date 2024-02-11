import { Builder } from '../../../../ast/Builder';
import { BreakscapedString } from '../../../../model/ast/BreakscapedString';
import { TagsConfig } from '../../../../model/config/TagsConfig';
import { BitTypeType } from '../../../../model/enum/BitType';
import { TextFormatType } from '../../../../model/enum/TextFormat';
import { StringUtils } from '../../../../utils/StringUtils';

import {
  BitContent,
  BitContentLevel,
  BitContentLevelType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
} from '../BitmarkPegParserTypes';

const builder = new Builder();

function technicalTermChainContentProcessor(
  context: BitmarkPegParserContext,
  bitType: BitTypeType,
  textFormat: TextFormatType,
  _bitLevel: BitContentLevelType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  // const { value } = content as TypeValue;

  if (context.DEBUG_CHAIN_CONTENT) context.debugPrint('technicalTerm content', content);

  const tags = context.bitContentProcessor(bitType, textFormat, BitContentLevel.Chain, tagsConfig, content.chain);

  if (context.DEBUG_CHAIN_TAGS) context.debugPrint('technicalTerm TAGS', tags);

  const { lang } = tags;

  // Extract the technicalTerm from the content tag
  const term = StringUtils.trimmedString(content.value) as BreakscapedString;

  const node = builder.technicalTerm({
    term,
    lang,
  });

  target.technicalTerm = node;
}

export { technicalTermChainContentProcessor };
