import { BitBookTypeType } from '../../types/BitBookType';

import { BitBitJson } from './BitBitJson';

export interface BookJson extends BitBitJson {
  type: BitBookTypeType;
  body: string;
  instruction?: string; // not always present
  item: string;
  lead?: string; // not always present
  hint: string;
  isExample: boolean;
  example: string;
  title: string;
  subtitle: string;
  // subject: string[]; - is property?
}
