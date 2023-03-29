import os from 'os';

import { Writer } from './Writer';

/**
 * Writer to write to a stream.
 */
abstract class StreamWriter implements Writer {
  private _stream: NodeJS.WritableStream | undefined;
  public endOfLineString = os.EOL;

  /**
   * Get the current write stream
   */
  public get stream(): NodeJS.WritableStream | undefined {
    return this._stream;
  }

  /**
   * Set the current write stream
   */
  public set stream(stream: NodeJS.WritableStream | undefined) {
    this._stream = stream;
  }

  abstract open(): Promise<void>;

  abstract close(): Promise<void>;

  public writeLine(value?: string): this {
    if (!this._stream) return this;

    if (value != null) {
      this._stream.write(value + this.endOfLineString);
    } else {
      this._stream.write(this.endOfLineString);
    }
    return this;
  }

  public writeLines(values: string[], delimiter?: string): this {
    if (!this._stream) return this;
    if (!values) return this;

    for (let i = 0, len = values.length; i < len; i++) {
      const value = values[i];
      this._stream.write(value);
      if (delimiter && i < len - 1) {
        this._stream.write(delimiter);
      }
      this._stream.write(this.endOfLineString);
    }
    return this;
  }

  public write(value: string): this {
    if (!this._stream) return this;
    if (value == null) return this;
    this._stream.write(value);
    return this;
  }

  public writeWhiteSpace(): this {
    this.write(' ');
    return this;
  }
}

export { StreamWriter };
