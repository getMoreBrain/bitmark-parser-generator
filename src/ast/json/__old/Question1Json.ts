import { BitBitJson } from './BitBitJson';

export interface Question1 extends BitBitJson {
  type: 'question-1';
  body: string;
  instruction?: string; // Not always present!
  item: string;
  // lead?: string;
  hint: string;
  isExample: boolean;
  example: string;
}
