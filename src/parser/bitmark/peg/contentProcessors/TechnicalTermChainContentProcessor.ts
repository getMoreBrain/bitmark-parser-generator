import { Breakscape } from '../../../../breakscaping/Breakscape';
import { BreakscapedString } from '../../../../model/ast/BreakscapedString';
import { TagsConfig } from '../../../../model/config/TagsConfig';
import { TextFormat } from '../../../../model/enum/TextFormat';
import { TextLocation } from '../../../../model/enum/TextLocation';
import { TechnicalTermJson } from '../../../../model/json/BitJson';
import { StringUtils } from '../../../../utils/StringUtils';

import {
  BitContent,
  BitContentLevel,
  ContentDepthType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
} from '../BitmarkPegParserTypes';

function technicalTermChainContentProcessor(
  context: BitmarkPegParserContext,
  _contentDepth: ContentDepthType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  // const { value } = content as TypeValue;

  if (context.DEBUG_CHAIN_CONTENT) context.debugPrint('technicalTerm content', content);

  const tags = context.bitContentProcessor(BitContentLevel.Chain, tagsConfig, content.chain);

  if (context.DEBUG_CHAIN_TAGS) context.debugPrint('technicalTerm TAGS', tags);

  const { lang } = tags;

  // Extract the technicalTerm from the content tag
  const technicalTerm = Breakscape.unbreakscape(StringUtils.trimmedString(content.value) as BreakscapedString, {
    textFormat: TextFormat.bitmarkMinusMinus,
    textLocation: TextLocation.tag,
  });

  const node: Partial<TechnicalTermJson> = {
    technicalTerm,
    lang,
  };

  target.technicalTerm = node;
}

export { technicalTermChainContentProcessor };
