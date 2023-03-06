import { BitTypeType } from './bitType';
import { TextFormat } from './textFormat';

export interface Bit {
  type: BitTypeType;
  format: TextFormat;
  body: string;
  id: string | number | (string | number)[];
}
