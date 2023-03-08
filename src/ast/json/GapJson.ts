import { BitPlaceholderJson } from './BitPlaceholderJson';

export interface GapJson extends BitPlaceholderJson {
  type: 'gap';
  solutions: string[];
  instruction: string;
  item: string;
  // lead?: string;
  hint: string;
  isCaseSensitive: boolean;
  isExample: boolean;
  example: string;
}
