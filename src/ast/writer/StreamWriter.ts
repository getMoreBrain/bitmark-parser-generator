import os from 'os';

import { type Writer } from './Writer.ts';

/**
 * Writer to write to a stream.
 */
abstract class StreamWriter implements Writer {
  private _stream: NodeJS.WritableStream | undefined;
  public endOfLineString = os.EOL;
  private lastWrite = '';

  public get isSync() {
    return false;
  }

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

  public openSync(): void {
    throw new Error('Sync operation not supported');
  }

  public closeSync(): void {
    throw new Error('Sync operation not supported');
  }

  public writeLine(value?: string): this {
    if (!this._stream) return this;

    if (value != null) {
      this._stream.write(value + this.endOfLineString);
      this.lastWrite = value + this.endOfLineString;
    } else {
      this._stream.write(this.endOfLineString);
      this.lastWrite = this.endOfLineString;
    }

    return this;
  }

  public writeLines(values: string[], delimiter?: string): this {
    if (!this._stream) return this;
    if (!values) return this;
    let str = '';

    for (let i = 0, len = values.length; i < len; i++) {
      const value = values[i];
      this._stream.write(value);
      str += value;
      if (delimiter && i < len - 1) {
        this._stream.write(delimiter);
        str += delimiter;
      }
      this._stream.write(this.endOfLineString);
      str += this.endOfLineString;
    }

    this.lastWrite = str;

    return this;
  }

  public write(value: string): this {
    if (!this._stream) return this;
    if (value == null) return this;
    if (value) this.lastWrite = value;
    this._stream.write(value);
    return this;
  }

  public writeWhiteSpace(): this {
    this.write(' ');
    return this;
  }

  public getLastWrite(): string {
    return this.lastWrite;
  }
}

export { StreamWriter };
