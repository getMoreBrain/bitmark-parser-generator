import { BitBitJson } from './BitBitJson';

export interface InternalLinkJson extends BitBitJson {
  type: 'internal-link';
  body: string;
  instruction: string;
  item: string;
  // lead?: string;
  hint: string;
  isExample: boolean;
  example: string;
  reference: string;
  anchor: string;
}
