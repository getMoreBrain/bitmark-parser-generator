export interface ParserError {
  message: string;
  text?: string;
  location?: {
    start: ErrorLocation;
    end: ErrorLocation;
  };
}

export interface ErrorLocation {
  offset: number;
  line: number;
  column: number;
}
