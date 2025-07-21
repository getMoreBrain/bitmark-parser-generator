import { type ParserLocation } from './ParserLocation.ts';

export interface ParserData {
  parser: {
    text?: string;
    location?: {
      start: ParserLocation;
      end: ParserLocation;
    };
  };
}
