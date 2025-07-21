import { Breakscape } from '../../../../breakscaping/Breakscape.ts';
import { type BreakscapedString } from '../../../../model/ast/BreakscapedString.ts';
import { type Footer } from '../../../../model/ast/Nodes.ts';
import { type JsonText } from '../../../../model/ast/TextNodes.ts';
import { type TagsConfig } from '../../../../model/config/TagsConfig.ts';
import { TextFormat } from '../../../../model/enum/TextFormat.ts';
import { TextLocation } from '../../../../model/enum/TextLocation.ts';
import { StringUtils } from '../../../../utils/StringUtils.ts';
import { TextParser } from '../../../text/TextParser.ts';
import {
  type BitContentProcessorResult,
  type BitmarkPegParserContext,
  type ContentDepthType,
} from '../BitmarkPegParserTypes.ts';
import { BitmarkPegParserValidator } from '../BitmarkPegParserValidator.ts';
import { ContentProcessorUtils } from './ContentProcessorUtils.ts';

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
        StringUtils.countOccurrencesAtEnd(footer, '\n') +
        StringUtils.countOccurrencesAtStart(footerPlainText, '\n');
    }

    if (footer || footerPlainText) {
      const isBitmarkText = textFormat === TextFormat.bitmarkText;

      if (footer) {
        footer = BitmarkPegParserValidator.checkFooter(context, contentDepth, footer);
      }

      const parsedFooterText: JsonText = isBitmarkText
        ? textParser.toAst(footer, {
            //
            format: textFormat,
            location: TextLocation.body,
          })
        : Breakscape.unbreakscape(footer, {
            format: TextFormat.plainText,
            location: TextLocation.body,
          });

      const parsedFooterPlainText = Breakscape.unbreakscape(footerPlainText, {
        format: TextFormat.plainText,
        location: TextLocation.body,
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
