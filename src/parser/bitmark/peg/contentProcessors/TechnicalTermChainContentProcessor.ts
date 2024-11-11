import { Builder } from '../../../../ast/Builder';
import { Breakscape } from '../../../../breakscaping/Breakscape';
import { BreakscapedString } from '../../../../model/ast/BreakscapedString';
import { TagsConfig } from '../../../../model/config/TagsConfig';
import { BitTypeType } from '../../../../model/enum/BitType';
import { TextFormatType } from '../../../../model/enum/TextFormat';
import { StringUtils } from '../../../../utils/StringUtils';

import {
  BitContent,
  BitContentLevel,
  ContentDepthType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
} from '../BitmarkPegParserTypes';

const builder = new Builder();

function technicalTermChainContentProcessor(
  context: BitmarkPegParserContext,
  _contentDepth: ContentDepthType,
  bitType: BitTypeType,
  textFormat: TextFormatType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  // const { value } = content as TypeValue;

  if (context.DEBUG_CHAIN_CONTENT) context.debugPrint('technicalTerm content', content);

  const tags = context.bitContentProcessor(BitContentLevel.Chain, bitType, textFormat, tagsConfig, content.chain);

  if (context.DEBUG_CHAIN_TAGS) context.debugPrint('technicalTerm TAGS', tags);

  const { lang } = tags;

  // Extract the technicalTerm from the content tag
  const technicalTerm = Breakscape.unbreakscape(StringUtils.trimmedString(content.value) as BreakscapedString);

  const node = builder.technicalTerm({
    technicalTerm,
    lang,
  });

  target.technicalTerm = node;
}

export { technicalTermChainContentProcessor };
