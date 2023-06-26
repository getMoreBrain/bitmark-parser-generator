import { ParserError } from '../../../model/parser/ParserError';

export type ParserTextFunc = () => ParserError['text'];
export type ParserLocationFunc = () => ParserError['location'];

class BitmarkPegParserLocationInfo {
  private textFunc: ParserTextFunc;
  private locationFunc: ParserLocationFunc;
  private offset: number;
  private line: number;

  constructor(text: ParserTextFunc, location: ParserLocationFunc) {
    this.textFunc = text;
    this.locationFunc = location;
    this.offset = 0;
    this.line = 0;
  }

  setRelativeOffset(offset: number, line: number): void {
    this.offset = offset;
    this.line = line;
  }

  text(): ParserError['text'] {
    return this.textFunc();
  }

  location(): ParserError['location'] {
    const l = this.locationFunc();
    if (!l) return l;

    // Add the relative offset in the file
    l.start.offset += this.offset;
    l.start.line += this.line;
    l.end.offset += this.offset;
    l.end.line += this.line;

    return l;
  }
}

export { BitmarkPegParserLocationInfo };
