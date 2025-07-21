import {
  type JsonText,
  type TextNode,
  type TextNodeAttibutes,
} from '../../../../model/ast/TextNodes.ts';
import { TextNodeType } from '../../../../model/enum/TextNodeType.ts';

class ContentProcessorUtils {
  /**
   * Concatenates a plain JSON text with a JsonText that may be plain (v2) or BitmarkText (v3)
   * Returns the combined text.
   *
   * @param text the text to concatenate
   * @param extraBreaks extra breaks to add between concatenated texts
   * @param textPlain the plain text to concatenate
   */
  public concatenatePlainTextWithAstTexts(
    text: JsonText,
    extraBreaks: number,
    textPlain: string,
  ): JsonText {
    if (Array.isArray(text)) {
      textPlain = textPlain && textPlain.trim();
      if (textPlain) {
        const splitText = textPlain.split('\n');
        const content: TextNode[] = [];

        for (let i = 0; i < extraBreaks; i++) {
          content.push({
            type: TextNodeType.hardBreak,
          });
        }

        for (let i = 0; i < splitText.length; i++) {
          const t = splitText[i];
          if (t) {
            content.push({
              text: t,
              type: TextNodeType.text,
            });
          }
          // Add a hard break after each paragraph, except the last one
          if (i < splitText.length - 1) {
            content.push({
              type: TextNodeType.hardBreak,
            });
          }
        }

        // Add the content to the final paragraph, or create a new one if there none
        const lastNode = text[text.length - 1];
        if (lastNode && lastNode.type === TextNodeType.paragraph) {
          lastNode.content = [...(lastNode.content ?? []), ...content];
        } else {
          text.push({
            type: TextNodeType.paragraph,
            content,
            attrs: {} as TextNodeAttibutes,
          });
        }
      }
      return text;
    }

    return `${text ?? ''}${'\n'.repeat(extraBreaks)}${textPlain ?? ''}`;
  }
}

const instance = new ContentProcessorUtils();
export { instance as ContentProcessorUtils };
