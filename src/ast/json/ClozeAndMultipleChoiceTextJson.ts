import { BitBitJson } from './BitBitJson';
import { PlaceholdersJson } from './PlaceholdersJson';

export interface ClozeAndMultipleChoiceTextJson extends BitBitJson {
  type: 'cloze-and-multiple-choice-text';
  body: string;
  // instruction: string;
  item: string;
  // lead?: string;
  hint: string;
  isExample: boolean;
  example: string;
  placeholders?: PlaceholdersJson;
}
