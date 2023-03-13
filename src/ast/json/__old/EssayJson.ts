import { BitBitJson } from './BitBitJson';
import { ResourceJson } from './ResourceJson';

export interface EssayJson extends BitBitJson {
  type: 'essay';
  body: string;
  instruction: string;
  item: string;
  // lead?: string;
  hint: string;
  partialAnswer: string;
  isExample: boolean;
  example: string;
  resource?: ResourceJson;
}
