import { BitBitJson } from './BitBitJson';
import { PlaceholdersJson } from './PlaceholdersJson';

export interface ClozeJson extends BitBitJson {
  type: 'cloze';
  body: string;
  // instruction: string;
  item: string;
  // lead?: string;
  hint: string;
  isExample: boolean;
  example: string;
  placeholders?: PlaceholdersJson;
}
