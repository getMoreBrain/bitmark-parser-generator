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

// const builder = new Builder();

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
    const book = buildBook(context, contentDepth, bitType, textFormat, tagsConfig, content);
    target.book = book.book;
    target.reference = book.reference;
    target.referenceEnd = book.referenceEnd;
  }
}

function buildBook(
  context: BitmarkPegParserContext,
  _contentDepth: ContentDepthType,
  bitType: BitTypeType,
  textFormat: TextFormatType,
  tagsConfig: TagsConfig | undefined,
  content: BitContent,
): {
  book: BreakscapedString | undefined;
  reference: BreakscapedString | undefined;
  referenceEnd: BreakscapedString | undefined;
} {
  if (context.DEBUG_CHAIN_CONTENT) context.debugPrint('book content', content);

  const tags = context.bitContentProcessor(BitContentLevel.Chain, bitType, textFormat, tagsConfig, content.chain);

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
