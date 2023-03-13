import { BitBitJson } from './BitBitJson';

export interface AssignmentJson extends BitBitJson {
  type: 'assignment';
  body: string;
  instruction: string;
  item: string;
  // lead?: string;
  hint: string;
  isExample: boolean;
  example: string;
}
