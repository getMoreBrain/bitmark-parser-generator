import { Breakscape } from '../../../../breakscaping/Breakscape';
import { Config } from '../../../../config/Config';
import { BreakscapedString } from '../../../../model/ast/BreakscapedString';
import { TagsConfig } from '../../../../model/config/TagsConfig';
import { PropertyConfigKey } from '../../../../model/config/enum/PropertyConfigKey';
import { BitTypeType } from '../../../../model/enum/BitType';
import { Count } from '../../../../model/enum/Count';
import { TextFormatType } from '../../../../model/enum/TextFormat';
import { StringUtils } from '../../../../utils/StringUtils';

import {
  BitContent,
  BitContentLevel,
  ContentDepthType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
} from '../BitmarkPegParserTypes';

function bookChainContentProcessor(
  context: BitmarkPegParserContext,
  contentDepth: ContentDepthType,
  bitType: BitTypeType,
  textFormat: TextFormatType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  if (contentDepth === BitContentLevel.Chain) {
    // Do nothing
  } else {
    buildBook(context, contentDepth, bitType, textFormat, tagsConfig, content, target);
  }
}

function buildBook(
  context: BitmarkPegParserContext,
  _contentDepth: ContentDepthType,
  bitType: BitTypeType,
  textFormat: TextFormatType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  if (context.DEBUG_CHAIN_CONTENT) context.debugPrint('book content', content);

  const tags = context.bitContentProcessor(BitContentLevel.Chain, bitType, textFormat, tagsConfig, content.chain);

  if (context.DEBUG_CHAIN_TAGS) context.debugPrint('book TAGS', tags);

  const { reference, referenceEnd } = tags;

  // Extract the book from the content tag
  const book = Breakscape.unbreakscape(StringUtils.trimmedString(content.value) as BreakscapedString);

  // Get the config for the bit
  const bitConfig = Config.getBitConfig(bitType);
  const bookConfig = bitConfig.tags[PropertyConfigKey.book];
  if (bookConfig && (bookConfig.maxCount === Count.infinity || bookConfig.maxCount > 1)) {
    // Add the book to the list of books
    if (!Array.isArray(target.book)) target.book = [];
    target.book.push({
      book,
      reference: reference ?? '',
      referenceEnd: (referenceEnd ?? undefined) as string,
    });
    return;
  }

  // Book should be added at the body level
  target.book = book;
  target.reference = reference;
  target.referenceEnd = referenceEnd;
}

export { bookChainContentProcessor };
