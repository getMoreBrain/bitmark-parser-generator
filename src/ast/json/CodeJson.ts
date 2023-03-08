import { CodeFormatType } from '../types/CodeFormat';

import { BitBitJson } from './BitBitJson';

export interface CodeJson extends BitBitJson {
  type: 'code';
  body: string;
  instruction?: string; // Not always present!
  item: string;
  lead?: string;
  hint: string;
  isExample: boolean;
  example: string;
  computerLanguage: CodeFormatType;
}
