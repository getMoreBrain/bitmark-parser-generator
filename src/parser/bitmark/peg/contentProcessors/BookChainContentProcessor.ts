import { BreakscapedString } from '../../../../model/ast/BreakscapedString';
import { TagsConfig } from '../../../../model/config/TagsConfig';
import { BitTypeType } from '../../../../model/enum/BitType';
import { StringUtils } from '../../../../utils/StringUtils';

import {
  BitContent,
  BitContentLevel,
  BitContentLevelType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
} from '../BitmarkPegParserTypes';

// const builder = new Builder();

function bookChainContentProcessor(
  context: BitmarkPegParserContext,
  bitType: BitTypeType,
  bitLevel: BitContentLevelType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  if (bitLevel === BitContentLevel.Chain) {
    // Do nothing
  } else {
    const book = buildBook(context, bitType, bitLevel, tagsConfig, content);
    target.book = book.book;
    target.reference = book.reference;
    target.referenceEnd = book.referenceEnd;
  }
}

function buildBook(
  context: BitmarkPegParserContext,
  bitType: BitTypeType,
  _bitLevel: BitContentLevelType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
): {
  book: BreakscapedString | undefined;
  reference: BreakscapedString | undefined;
  referenceEnd: BreakscapedString | undefined;
} {
  if (context.DEBUG_CHAIN_CONTENT) context.debugPrint('book content', content);

  const tags = context.bitContentProcessor(bitType, BitContentLevel.Chain, tagsConfig, content.chain);

  if (context.DEBUG_CHAIN_TAGS) context.debugPrint('book TAGS', tags);

  const { reference, referenceEnd } = tags;

  // Extract the book from the content tag
  const book = StringUtils.trimmedString(content.value) as BreakscapedString;

  return {
    book,
    reference,
    referenceEnd,
  };
}

export { bookChainContentProcessor };
