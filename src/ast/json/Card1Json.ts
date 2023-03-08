import { BitBitJson } from './BitBitJson';

export interface Card1Json extends BitBitJson {
  type: 'card-1';
  body: string;
  instruction?: string; // Not always present!
  item: string;
  // lead?: string;
  hint: string;
  isExample: boolean;
  example: string;
}
