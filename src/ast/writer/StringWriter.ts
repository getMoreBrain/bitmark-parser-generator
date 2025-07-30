import { type Writer } from './Writer.ts';

/**
 * Writer to write to a string.
 */
class StringWriter implements Writer {
  private _buffer: string[] | undefined;
  private _string: string = '';
  public endOfLineString = '\n';
  private lastWrite = '';

  public get isSync() {
    return true;
  }

  /**
   * Get the string which has been written.
   *
   * This cannot be called until after close() has resolved its Promise.
   *
   * @returns
   */
  public getString(): string {
    return this._string;
  }

  public async open(): Promise<void> {
    this.openSync();
    return Promise.resolve();
  }

  public async close(): Promise<void> {
    try {
      this.closeSync();
    } catch (e) {
      return Promise.reject(e);
    }
    return Promise.resolve();
  }

  public openSync(): void {
    this._buffer = [];
    this._string = '';
  }

  public closeSync(): void {
    if (!this._buffer) {
      throw new Error('open() or openSync() never called');
    }
    this._string = this._buffer.join('');
    this._buffer = [];
  }

  public writeLine(value?: string): this {
    if (!this._buffer) return this;

    let line: string;

    if (value != null) {
      line = value + this.endOfLineString;
    } else {
      line = this.endOfLineString;
    }

    this._buffer.push(line);
    this.lastWrite = line;

    return this;
  }

  public writeLines(values: string[], delimiter?: string): this {
    if (!this._buffer) return this;
    if (!values) return this;
    let str = '';

    for (let i = 0, len = values.length; i < len; i++) {
      const value = values[i];
      this._buffer.push(value);
      str += value;
      if (delimiter && i < len - 1) {
        this._buffer.push(delimiter);
        str += delimiter;
      }
      this._buffer.push(this.endOfLineString);
      str += this.endOfLineString;
    }

    this.lastWrite = str;

    return this;
  }

  public write(value: string): this {
    if (!this._buffer) return this;
    if (value == null) return this;
    if (value) this.lastWrite = value;
    this._buffer.push(value);
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

export { StringWriter };
