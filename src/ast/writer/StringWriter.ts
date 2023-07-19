import { Writer } from './Writer';

/**
 * Writer to write to a string.
 */
class StringWriter implements Writer {
  private _buffer: string[] | undefined;
  private _string: string = '';
  public endOfLineString = '\n';

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
    Promise.resolve();
  }

  public async close(): Promise<void> {
    try {
      this.closeSync();
    } catch (e) {
      return Promise.reject(e);
    }
    Promise.resolve();
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

    if (value != null) {
      this._buffer.push(value + this.endOfLineString);
    } else {
      this._buffer.push(this.endOfLineString);
    }
    return this;
  }

  public writeLines(values: string[], delimiter?: string): this {
    if (!this._buffer) return this;
    if (!values) return this;

    for (let i = 0, len = values.length; i < len; i++) {
      const value = values[i];
      this._buffer.push(value);
      if (delimiter && i < len - 1) {
        this._buffer.push(delimiter);
      }
      this._buffer.push(this.endOfLineString);
    }
    return this;
  }

  public write(value: string): this {
    if (!this._buffer) return this;
    if (value == null) return this;
    this._buffer.push(value);
    return this;
  }

  public writeWhiteSpace(): this {
    this.write(' ');
    return this;
  }
}

export { StringWriter };
