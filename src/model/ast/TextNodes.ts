import { TextMarkTypeType } from '../enum/TextMarkType';
import { TextNodeTypeType } from '../enum/TextNodeType';

export type Text = string | TextAst;

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

export type TextAst = TextNode[];
