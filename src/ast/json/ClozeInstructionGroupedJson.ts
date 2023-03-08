import { BitBitJson } from './BitBitJson';
import { PlaceholdersJson } from './PlaceholdersJson';

export interface ClozeInstructionGroupedJson extends BitBitJson {
  type: 'cloze-instruction-grouped';
  body: string;
  // instruction: string;
  item: string;
  // lead?: string;
  hint: string;
  isExample: boolean;
  example: string;
  placeholders?: PlaceholdersJson;
}
