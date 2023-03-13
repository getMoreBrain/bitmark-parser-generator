import { BitBitTypeType } from '../types/BitBitType';
import { TextFormatType } from '../types/TextFormat';

export interface BitBitJson {
  type: BitBitTypeType; // bit type
  format: TextFormatType; // bit format
  // instruction?: string;
  // item?: string;
  // lead?: string;
  // hint?: string;
}

// Properties
/*
id (all bit bits)
ageRange (article, book)
language (article, book, card-1, question-1)
subject (book)
copyright (book)
skills (book)
complexity (book)
seriesTitle (book)
seriesId (book)
numberInSeries (book)
_format (book)
_type (book)
isLiveBook (book)
isSmartBook (book)
isHighQuality (book)
leave.levelCEFR (book)
publications (book)
publisher.name (book)
ISBN (book)
progress (chapter)
toc (chapter)
*/
