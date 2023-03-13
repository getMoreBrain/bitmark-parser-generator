import { BitBitJson } from './BitBitJson';

export interface BitAliasJson extends BitBitJson {
  type: 'bit-alias';
  body: string;
  item: string;
  // lead?: string;
  hint: string;
  isExample: boolean;
  example: string;
  reference: string;
}
