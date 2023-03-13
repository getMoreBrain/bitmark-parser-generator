import { BitBitJson } from './BitBitJson';

export interface SummaryJson extends BitBitJson {
  type: 'summary';
  body: string;
  // instruction: string;
  item: string;
  // lead?: string;
  hint: string;
  isExample: boolean;
  example: string;
  title: string;
}
