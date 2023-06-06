import { TextFormatType } from '../enum/TextFormat';

export type Text = string | TextAst;

export interface TextNode {
  format: TextFormatType;
  text: string;
  textAst: TextAst;
}

// export interface TextAst {
//   // TODO
// }

export type TextAst = unknown; // TODO
