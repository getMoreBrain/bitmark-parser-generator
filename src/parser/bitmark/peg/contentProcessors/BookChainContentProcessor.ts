import { Breakscape } from '../../../../breakscaping/Breakscape';
import { BreakscapedString } from '../../../../model/ast/BreakscapedString';
import { TagsConfig } from '../../../../model/config/TagsConfig';
import { PropertyConfigKey } from '../../../../model/config/enum/PropertyConfigKey';
import { Count } from '../../../../model/enum/Count';
import { TextFormat } from '../../../../model/enum/TextFormat';
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
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  if (contentDepth === BitContentLevel.Chain) {
    // Do nothing
  } else {
    buildBook(context, contentDepth, tagsConfig, content, target);
  }
}

function buildBook(
  context: BitmarkPegParserContext,
  _contentDepth: ContentDepthType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  const { bitConfig } = context;

  if (context.DEBUG_CHAIN_CONTENT) context.debugPrint('book content', content);

  const tags = context.bitContentProcessor(BitContentLevel.Chain, tagsConfig, content.chain);

  if (context.DEBUG_CHAIN_TAGS) context.debugPrint('book TAGS', tags);

  const { reference, referenceEnd } = tags;

  // Extract the book from the content tag
  const book = Breakscape.unbreakscape(StringUtils.trimmedString(content.value) as BreakscapedString, {
    textFormat: TextFormat.tag,
  });

  // Get the config for the bit
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
