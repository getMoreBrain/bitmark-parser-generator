import { TextMarkTypeType } from '../enum/TextMarkType';
import { TextNodeTypeType } from '../enum/TextNodeType';

export type JsonText = string | TextAst;

export type TextAst = TextNode[];

export interface TextNode {
  type: TextNodeTypeType;
  marks?: TextMark[];
  text?: string;
  content?: TextNode[];
  parent?: TextNodeTypeType;
  attrs?: TextNodeAttibutes;
}

export interface TextMark {
  type: TextMarkTypeType;
  attrs?: TextMarkAttibutes;
}

export interface LinkMark {
  type: 'link';
  attrs?: LinkMarkAttibutes;
}

export interface CommentMark {
  type: 'comment';
  comment: string;
}

export interface RefMark {
  type: 'ref';
  attrs?: RefMarkAttibutes;
}

export interface XRefMark {
  type: 'xref';
  attrs?: XRefMarkAttibutes;
}

export interface FootnoteMark {
  type: 'footnote';
  attrs?: FootnoteAttibutes;
}

export interface HeadingTextNode extends TextNode {
  type: 'heading';
  attrs?: HeadingTextNodeAttributes;
}

export interface SectionTextNode extends TextNode {
  type: 'heading';
  section: string;
}

export interface TaskItemTextNode extends TextNode {
  type: 'taskItem';
  attrs?: TaskItemTextNodeAttributes;
}

export interface ImageTextNode extends TextNode {
  type: 'image';
  attrs?: ImageTextNodeAttributes;
}

export interface CodeBlockTextNode extends TextNode {
  type: 'codeBlock';
  attrs?: CodeBlockTextNodeAttributes;
}

export interface LatexTextNode extends TextNode {
  type: 'latex';
  attrs?: LatexTextNodeAttibutes;
}

export interface ListTextNode extends TextNode {
  type:
    | 'noBulletList'
    | 'bulletList'
    | 'orderedList'
    | 'orderedListRoman'
    | 'orderedListRomanLower'
    | 'letteredList'
    | 'letteredListLower';
  attrs?: ListTextNodeAttributes;
}

export interface TextNodeAttibutes {
  section: string;
}

export interface HeadingTextNodeAttributes extends TextNodeAttibutes {
  level: number;
}

export interface TaskItemTextNodeAttributes extends TextNodeAttibutes {
  checked: boolean;
}

export interface ImageTextNodeAttributes extends TextNodeAttibutes {
  src: string;
  alt: string | null;
  title: string | null;
  textAlign: string;
  width: string | number | null;
  height: string | number | null;
  class: string;
  comment: string;
}

export interface CodeBlockTextNodeAttributes extends TextNodeAttibutes {
  language: string;
}

export interface LatexTextNodeAttibutes extends TextNodeAttibutes {
  formula: string;
}

export interface ListTextNodeAttributes extends TextNodeAttibutes {
  start: number;
}

export interface TextMarkAttibutes {
  //
}

export interface LinkMarkAttibutes extends TextMarkAttibutes {
  href: string;
  target: string;
}

export interface RefMarkAttibutes extends TextMarkAttibutes {
  reference: string;
}

export interface XRefMarkAttibutes extends TextMarkAttibutes {
  xref: string;
  reference: string;
}

export interface FootnoteAttibutes extends TextMarkAttibutes {
  content: TextNode[];
}
