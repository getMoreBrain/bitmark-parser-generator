import { Builder } from '../../../../ast/Builder';
import { BreakscapedString } from '../../../../model/ast/BreakscapedString';
import { BodyPart, Footer, FooterText } from '../../../../model/ast/Nodes';
import { JsonText } from '../../../../model/ast/TextNodes';
import { TagsConfig } from '../../../../model/config/TagsConfig';
import { BitTypeType } from '../../../../model/enum/BitType';
import { BodyBitType } from '../../../../model/enum/BodyBitType';
import { TextFormat, TextFormatType } from '../../../../model/enum/TextFormat';
import { TextParser } from '../../../text/TextParser';
import { BitmarkPegParserValidator } from '../BitmarkPegParserValidator';

import { ContentProcessorUtils } from './ContentProcessorUtils';

import {
  BitContent,
  BitContentProcessorResult,
  BitmarkPegParserContext,
  ContentDepthType,
} from '../BitmarkPegParserTypes';

export interface FooterText {
  footerText: BreakscapedString;
  isPlain: boolean;
}

const builder = new Builder();
const textParser = new TextParser();

class FooterContentProcessor {
  public process(
    context: BitmarkPegParserContext,
    contentDepth: ContentDepthType,
    bitType: BitTypeType,
    textFormat: TextFormatType,
    _tagsConfig: TagsConfig | undefined,
    _target: BitContentProcessorResult,
    footer: BreakscapedString,
    footerPlainText: BreakscapedString,
  ): Footer | undefined {
    let finalFooterText: JsonText | undefined;
    //

    // Create the body text AST
    footer = footer.trim() as BreakscapedString;
    footerPlainText = footerPlainText.trim() as BreakscapedString;

    if (footer || footerPlainText) {
      const isBitmarkText = textFormat === TextFormat.bitmarkMinusMinus || textFormat === TextFormat.bitmarkPlusPlus;

      if (footer) {
        footer = BitmarkPegParserValidator.checkFooter(context, contentDepth, bitType, footer);
      }

      const footerTexts: BreakscapedString[] = [];
      if (footer) footerTexts.push(footer);
      if (footerPlainText) footerTexts.push(footerPlainText);
      const trimmedFooterTexts: BreakscapedString[] = this.trimFooterTexts(footerTexts);
      const timmedFooter = footer ? trimmedFooterTexts[0] : '';
      const trimmedFooterPlainText = footerPlainText ? trimmedFooterTexts[footer ? 1 : 0] : '';

      const parsedFooterText: JsonText = isBitmarkText
        ? textParser.toAst(timmedFooter, {
            //
            textFormat,
          })
        : timmedFooter;

      finalFooterText = ContentProcessorUtils.concatenatePlainTextWithAstTexts(
        parsedFooterText,
        trimmedFooterPlainText,
      );
    }

    // Return the footer in the target
    return finalFooterText ? builder.footer({ footer: finalFooterText }) : undefined;
  }

  /**
   * Trim the footer texts, removing any whitespace only parts at start and end of footer
   *
   * @param parts the footer texts to trim
   * @returns the trimmed footer texts
   */
  private trimFooterTexts(parts: BreakscapedString[]): FooterText[] {
    // Trim start
    let foundText = false;
    let trimmedParts: BreakscapedString[] = parts.reduce((acc, part) => {
      let text = part as BreakscapedString;
      if (!foundText) {
        const t = text.trimStart() as BreakscapedString;
        if (t) {
          foundText = true;
          text = t;
          acc.push(text);
        }
      } else {
        // Not body text, so add it
        foundText = true;
        acc.push(part);
      }
      return acc;
    }, [] as FooterText[]);

    // Trim end
    foundText = false;
    trimmedParts = trimmedParts.reduceRight((acc, part) => {
      let text = part as BreakscapedString;
      if (!foundText) {
        const t = text.trimEnd() as BreakscapedString;
        if (t) {
          foundText = true;
          text = t;
          acc.unshift(text);
        }
      } else {
        // Not body text, so add it
        foundText = true;
        acc.unshift(part);
      }
      return acc;
    }, [] as FooterText[]);

    return trimmedParts;
  }
}

const instance = new FooterContentProcessor();
export { instance as FooterContentProcessor };
