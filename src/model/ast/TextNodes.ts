import { TextMarkTypeType } from '../enum/TextMarkType';
import { TextNodeTypeType } from '../enum/TextNodeType';

export type Text = string | TextAst;

export type TextAst = TextNode[];

export interface TextNode {
  type: TextNodeTypeType;
  marks: TextMark[];
  text?: string;
  content?: TextNode[];
  parent?: TextNodeTypeType;
}

export interface TextMark {
  type: TextMarkTypeType;
}

export interface ImageTextNode extends TextNode {
  type: 'image';
  attrs?: ImageTextNodeAttributes;
}

export interface ImageTextNodeAttributes {
  textAlign: string;
  src: string;
  alt: string | null;
  title: string | null;
  class: string;
  width: string | number | null;
  height: string | number | null;
  section: string;
}
