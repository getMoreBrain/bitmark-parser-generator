import { BitBitJson } from './BitBitJson';
import { PlaceholdersJson } from './PlaceholdersJson';

export interface ClozeSolutionGroupedJson extends BitBitJson {
  type: 'cloze-solution-grouped';
  body: string;
  // instruction: string;
  item: string;
  // lead?: string;
  hint: string;
  isExample: boolean;
  example: string;
  placeholders?: PlaceholdersJson;
}
