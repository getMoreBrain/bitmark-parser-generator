import { ParserLocation } from './ParserLocation';

export interface ParserData {
  parser: {
    text?: string;
    location?: {
      start: ParserLocation;
      end: ParserLocation;
    };
  };
}
