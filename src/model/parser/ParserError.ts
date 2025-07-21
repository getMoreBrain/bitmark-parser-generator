import { type ParserLocation } from './ParserLocation.ts';

export interface ParserError {
  message: string;
  text?: string;
  location?: {
    start: ParserLocation;
    end: ParserLocation;
  };
  original?: {
    text?: string;
    location?: {
      start: ParserLocation;
      end: ParserLocation;
    };
  };
}
