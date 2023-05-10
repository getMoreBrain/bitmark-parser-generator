import { ParserLocation } from './ParserLocation';

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
