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
  _bitLevel: BitContentLevelType,
  bitType: BitTypeType,
  content: BitContent,
  target: BitContentProcessorResult,
  inChain: boolean,
): void {
  if (inChain) {
    // Do nothing
  } else {
    const book = buildBook(context, bitType, content);
    target.book = book.book;
    target.reference = book.reference;
    target.referenceEnd = book.referenceEnd;
  }
}

function buildBook(
  context: BitmarkPegParserContext,
  bitType: BitTypeType,
  content: BitContent,
): {
  book: string | undefined;
  reference: string | undefined;
  referenceEnd: string | undefined;
} {
  // const { value } = content as TypeValue;

  if (context.DEBUG_CHAIN_CONTENT) context.debugPrint('book content', content);

  const tags = context.bitContentProcessor(BitContentLevel.Chain, bitType, content.chain);

  if (context.DEBUG_CHAIN_TAGS) context.debugPrint('book TAGS', tags);

  const { reference, referenceEnd } = tags;

  // Extract the book from the content tag
  const book = StringUtils.trimmedString(content.value);

  return {
    book,
    reference,
    referenceEnd,
  };
}

export { bookChainContentProcessor };
