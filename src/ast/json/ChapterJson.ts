import { BitBitJson } from './BitBitJson';

export interface ChapterJson extends BitBitJson {
  type: 'chapter';
  body: string;
  // instruction: string;
  item: string;
  // lead?: string;
  hint: string;
  isExample: boolean;
  example: string;
  title: string;
  level: number;
  // progress: string; - is propery
  // toc: boolean; - is propery
}
