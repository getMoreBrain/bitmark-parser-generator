import { Config } from '../../../../config/Config_RENAME';
import { BitType } from '../../../../model/enum/BitType';
import { StringUtils } from '../../../../utils/StringUtils';

import {
  BitContent,
  BitContentLevel,
  BitContentLevelType,
  BitContentProcessorResult,
  BitmarkPegParserContext,
  TypeKeyValue,
} from '../BitmarkPegParserTypes';

// const builder = new Builder();

function bookChainContentProcessor(
  context: BitmarkPegParserContext,
  bitLevel: BitContentLevelType,
  bitType: BitType,
  content: BitContent,
  target: BitContentProcessorResult,
): void {
  if (bitLevel === BitContentLevel.Chain) {
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
  bitType: BitType,
  content: BitContent,
): {
  book: string | undefined;
  reference: string | undefined;
  referenceEnd: string | undefined;
} {
  if (context.DEBUG_CHAIN_CONTENT) context.debugPrint('book content', content);

  // Build the variables required to process the chain
  const { key } = content as TypeKeyValue;
  const parentTagConfig = Config.getTagConfigFromTag(bitType, key);

  const tags = context.bitContentProcessor(BitContentLevel.Chain, bitType, parentTagConfig, content.chain);

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
