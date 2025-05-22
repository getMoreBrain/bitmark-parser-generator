import { Breakscape } from '../../../../breakscaping/Breakscape';
import { BreakscapedString } from '../../../../model/ast/BreakscapedString';
import { Footer } from '../../../../model/ast/Nodes';
import { JsonText } from '../../../../model/ast/TextNodes';
import { TagsConfig } from '../../../../model/config/TagsConfig';
import { TextFormat } from '../../../../model/enum/TextFormat';
import { TextLocation } from '../../../../model/enum/TextLocation';
import { StringUtils } from '../../../../utils/StringUtils';
import { TextParser } from '../../../text/TextParser';
import { BitContentProcessorResult, BitmarkPegParserContext, ContentDepthType } from '../BitmarkPegParserTypes';
import { BitmarkPegParserValidator } from '../BitmarkPegParserValidator';

import { ContentProcessorUtils } from './ContentProcessorUtils';

export interface FooterText {
  footerText: BreakscapedString;
  isPlain: boolean;
}

const textParser = new TextParser();

class FooterContentProcessor {
  public process(
    context: BitmarkPegParserContext,
    contentDepth: ContentDepthType,
    _tagsConfig: TagsConfig | undefined,
    _target: BitContentProcessorResult,
    footer: BreakscapedString,
    footerPlainText: BreakscapedString,
  ): Footer | undefined {
    const { textFormat } = context;
    let finalFooterText: JsonText | undefined;

    footer = footer.trimStart() as BreakscapedString;
    footerPlainText = footerPlainText.trimEnd() as BreakscapedString;

    // Create the body text AST
    const haveFooter = !!footer.trim();
    const haveFooterPlainText = !!footerPlainText.trim();

    // Newlines will be lost from the end of footer, and start of footerPlainText
    // Count then and add them back when merging
    let newLines = 0;
    if (haveFooter && haveFooterPlainText) {
      newLines =
        StringUtils.countOccurrencesAtEnd(footer, '\n') + StringUtils.countOccurrencesAtStart(footerPlainText, '\n');
    }

    if (footer || footerPlainText) {
      const isBitmarkText = textFormat === TextFormat.bitmarkMinusMinus || textFormat === TextFormat.bitmarkPlusPlus;

      if (footer) {
        footer = BitmarkPegParserValidator.checkFooter(context, contentDepth, footer);
      }

      const parsedFooterText: JsonText = isBitmarkText
        ? textParser.toAst(footer, {
            //
            textFormat,
            isProperty: false,
          })
        : Breakscape.unbreakscape(footer, {
            textFormat: TextFormat.text,
            textLocation: TextLocation.body,
          });

      const parsedFooterPlainText = Breakscape.unbreakscape(footerPlainText, {
        textFormat: TextFormat.text,
        textLocation: TextLocation.body,
      });

      finalFooterText = ContentProcessorUtils.concatenatePlainTextWithAstTexts(
        parsedFooterText,
        newLines,
        parsedFooterPlainText,
      );
    }

    // Return the footer in the target
    return finalFooterText ? { footer: finalFooterText } : undefined;
  }
}

const instance = new FooterContentProcessor();
export { instance as FooterContentProcessor };
