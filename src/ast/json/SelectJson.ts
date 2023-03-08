import { BitPlaceholderJson } from './BitPlaceholderJson';
import { SelectOptionJson } from './SelectOptionJson';

export interface SelectJson extends BitPlaceholderJson {
  type: 'select';
  prefix: string;
  postfix: string;
  options: SelectOptionJson[];
  instruction: string;
  item: string;
  // lead?: string;
  hint: string;
  isCaseSensitive: boolean;
  isExample: boolean;
  example: string;
}
